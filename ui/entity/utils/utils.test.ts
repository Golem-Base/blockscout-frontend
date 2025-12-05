import MockDate from 'mockdate';

import type { EntityFormFields, ExtendEntityFormFields } from './types';
import type { EntityStatus, FullEntity } from '@golembase/l3-indexer-types';

import dayjs from 'lib/date/dayjs';

import {
  FORMAT_DATE_TIME,
  generateAnnotationId,
  mapEntityFormDataToArkivCreate,
  mapExtendEntityFormDataToArkivExtend,
  mapFullEntityToFormFields,
} from './utils';

jest.mock('lib/arkiv/useArkivClient', () => ({
  createPublicClient: jest.fn(() => ({
    getBlockTiming: jest.fn().mockResolvedValue({
      currentBlock: BigInt(100),
      currentBlockTime: 1000000,
      blockDuration: 2,
    }),
  })),
}));

const createMockFile = (content: string | Uint8Array, name: string, type: string) => {
  const encodedContent = content instanceof Uint8Array ? content : new TextEncoder().encode(content);
  const mockArrayBuffer = jest.fn().mockResolvedValue(encodedContent.buffer);

  return {
    name,
    type,
    size: encodedContent.length,
    arrayBuffer: mockArrayBuffer,
  } as unknown as File;
};

describe('entity utils', () => {
  const MOCK_CURRENT_DATE = '2024-06-15T10:00:00Z';

  beforeEach(() => {
    MockDate.set(MOCK_CURRENT_DATE);
  });

  afterEach(() => {
    MockDate.reset();
  });

  describe('generateAnnotationId', () => {
    it('should generate a random string', () => {
      const id1 = generateAnnotationId();
      const id2 = generateAnnotationId();

      expect(typeof id1).toBe('string');
      expect(id1).not.toBe(id2);
    });
  });

  describe('mapEntityFormDataToArkivCreate', () => {
    const mockFile = createMockFile('test file content', 'test.txt', 'text/plain');

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should map form data with file correctly and convert expirationDate to expiresIn lifespan value', async() => {
      const formData: EntityFormFields = {
        dataText: '',
        dataFile: [ mockFile ],
        expirationDate: dayjs().add(30, 'minutes').format(FORMAT_DATE_TIME),
        stringAnnotations: [
          { id: '1', key: 'stringKey1', value: 'stringValue1' },
          { id: '2', key: 'stringKey2', value: 'stringValue2' },
        ],
        numericAnnotations: [
          { id: '1', key: 'numKey1', value: '42' },
          { id: '2', key: 'numKey2', value: '0' },
        ],
      };

      const result = await mapEntityFormDataToArkivCreate(formData);

      expect(result.expiresInDateTime).toBe(dayjs().add(30, 'minutes').set('second', 0).set('millisecond', 0).format(FORMAT_DATE_TIME));
      expect(Array.from(result.payload)).toEqual(Array.from(new TextEncoder().encode('test file content')));
      expect(result.contentType).toBe('text/plain');
      expect(result.attributes).toEqual([
        { key: 'stringKey1', value: 'stringValue1' },
        { key: 'stringKey2', value: 'stringValue2' },
        { key: 'numKey1', value: 42 },
        { key: 'numKey2', value: 0 },
      ]);
    });

    it('should map form data with text data correctly', async() => {
      const formData: EntityFormFields = {
        dataText: 'Hello, World!',
        dataFile: [],
        expirationDate: dayjs().add(30, 'minutes').format(FORMAT_DATE_TIME),
        stringAnnotations: [],
        numericAnnotations: [],
      };

      const result = await mapEntityFormDataToArkivCreate(formData);

      expect(result.expiresInDateTime).toBe(dayjs().add(30, 'minutes').set('second', 0).set('millisecond', 0).format(FORMAT_DATE_TIME));
      expect(Array.from(result.payload)).toEqual(Array.from(new TextEncoder().encode('Hello, World!')));
      expect(result.contentType).toBe('text/plain');
      expect(result.attributes).toEqual([]);
    });

    it('should handle mixed data sources (file takes precedence)', async() => {
      const binaryData = new Uint8Array([ 0x00, 0x01, 0x02, 0xFF, 0xFE, 0xFD ]);
      const binaryFile = createMockFile(binaryData, 'binary.bin', 'application/octet-stream');

      const formData: EntityFormFields = {
        dataText: 'This should be ignored',
        dataFile: [ binaryFile ],
        expirationDate: dayjs().add(45, 'minutes').format(FORMAT_DATE_TIME),
        stringAnnotations: [ { id: '1', key: 'test', value: 'value' } ],
        numericAnnotations: [ { id: '1', key: 'count', value: '5' } ],
      };

      const result = await mapEntityFormDataToArkivCreate(formData);

      expect(result.payload).toEqual(binaryData);
      expect(result.contentType).toBe('application/octet-stream');
      expect(result.expiresInDateTime).toBe(dayjs().add(45, 'minutes').set('second', 0).set('millisecond', 0).format(FORMAT_DATE_TIME));
      expect(result.attributes).toHaveLength(2);
    });

    it('should default to text/plain for contentType when no file is provided', async() => {
      const formData: EntityFormFields = {
        dataText: 'Plain text',
        dataFile: [],
        expirationDate: dayjs().add(30, 'minutes').format(FORMAT_DATE_TIME),
        stringAnnotations: [],
        numericAnnotations: [],
      };

      const result = await mapEntityFormDataToArkivCreate(formData);

      expect(result.contentType).toBe('text/plain');
    });
  });

  describe('mapExtendEntityFormDataToArkivExtend', () => {
    it('should map extend form data and convert expirationDate to expiresIn lifespan value', async() => {
      const formData: ExtendEntityFormFields = {
        expirationDate: dayjs().add(10, 'minutes').format(FORMAT_DATE_TIME),
      };

      const result = await mapExtendEntityFormDataToArkivExtend(formData);

      expect(result.expiresInDateTime).toBe(dayjs().add(10, 'minutes').format(FORMAT_DATE_TIME));
    });

    it('should handle small expirationDate values', async() => {
      const formData: ExtendEntityFormFields = {
        expirationDate: dayjs().add(2, 'seconds').format(FORMAT_DATE_TIME),
      };

      const result = await mapExtendEntityFormDataToArkivExtend(formData);

      expect(result.expiresInDateTime).toBe(dayjs().add(2, 'seconds').set('second', 0).set('millisecond', 0).format(FORMAT_DATE_TIME));
    });
  });

  describe('mapFullEntityToFormFields', () => {
    it('should map entity to form fields', () => {
      const mockEntity: FullEntity = {
        key: 'test-key-123',
        data: '0x48656c6c6f',
        data_size: '5',
        status: 'ACTIVE' as EntityStatus,
        string_annotations: [
          { key: 'key1', value: 'value1', related_entities: '1' },
          { key: 'key2', value: 'value2', related_entities: '1' },
        ],
        numeric_annotations: [
          { key: 'num1', value: '42', related_entities: '1' },
          { key: 'num2', value: '100', related_entities: '1' },
        ],
        created_at_tx_hash: '0x1234567890abcdef',
        created_at_operation_index: '0',
        created_at_block_number: '1234567',
        created_at_timestamp: '2024-01-15T10:30Z',
        expires_at_block_number: '2234567',
        expires_at_timestamp: '2024-06-15T10:30Z',
        owner: '0xabcdef1234567890',
        gas_used: '21000',
        fees_paid: '500000000000000',
        updated_at_tx_hash: '0x1234567890abcdef',
        updated_at_operation_index: '0',
        updated_at_block_number: '1234567',
        updated_at_timestamp: '2024-01-15T10:30',
      };

      const result = mapFullEntityToFormFields(mockEntity);

      expect(result.dataText).toBe('Hello');
      expect(result.dataFile).toEqual([]);
      expect(result.expirationDate).toBe(dayjs(mockEntity.expires_at_timestamp).format(FORMAT_DATE_TIME));
      expect(result.stringAnnotations).toHaveLength(2);
      expect(result.numericAnnotations).toHaveLength(2);
    });
  });
});
