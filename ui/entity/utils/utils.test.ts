import { Annotation as GolemAnnotation } from 'golem-base-sdk';

import type { EntityFormFields } from './types';
import type { EntityStatus, FullEntity } from '@golembase/l3-indexer-types';

import { generateAnnotationId, mapEntityFormDataToGolemCreate, mapFullEntityToFormFields } from './utils';

jest.mock('golem-base-sdk', () => ({
  Annotation: jest.fn().mockImplementation((key, value) => ({ key, value })),
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
  describe('generateAnnotationId', () => {
    it('should generate a random string', () => {
      const id1 = generateAnnotationId();
      const id2 = generateAnnotationId();

      expect(typeof id1).toBe('string');
      expect(id1).not.toBe(id2);
    });
  });

  describe('mapEntityFormDataToGolemCreate', () => {
    const mockFile = createMockFile('test file content', 'test.txt', 'text/plain');

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should map form data with file correctly', async() => {
      const formData: EntityFormFields = {
        dataText: '',
        dataFile: [ mockFile ],
        btl: '123',
        stringAnnotations: [
          { id: '1', key: 'stringKey1', value: 'stringValue1' },
          { id: '2', key: 'stringKey2', value: 'stringValue2' },
        ],
        numericAnnotations: [
          { id: '1', key: 'numKey1', value: '42' },
          { id: '2', key: 'numKey2', value: '0' },
        ],
      };

      const result = await mapEntityFormDataToGolemCreate(formData);

      expect(result.btl).toBe(123);
      expect(Array.from(result.data)).toEqual(Array.from(new TextEncoder().encode('test file content')));
      expect(result.stringAnnotations).toEqual([
        { key: 'stringKey1', value: 'stringValue1' },
        { key: 'stringKey2', value: 'stringValue2' },
      ]);
      expect(result.numericAnnotations).toEqual([
        { key: 'numKey1', value: 42 },
        { key: 'numKey2', value: '' },
      ]);

      expect(GolemAnnotation).toHaveBeenCalledTimes(4);
      expect(GolemAnnotation).toHaveBeenCalledWith('stringKey1', 'stringValue1');
      expect(GolemAnnotation).toHaveBeenCalledWith('stringKey2', 'stringValue2');
      expect(GolemAnnotation).toHaveBeenCalledWith('numKey1', 42);
      expect(GolemAnnotation).toHaveBeenCalledWith('numKey2', '');
    });

    it('should map form data with text data correctly', async() => {
      const formData: EntityFormFields = {
        dataText: 'Hello, World!',
        dataFile: [],
        btl: '456',
        stringAnnotations: [],
        numericAnnotations: [],
      };

      const result = await mapEntityFormDataToGolemCreate(formData);

      expect(result.btl).toBe(456);
      expect(Array.from(result.data)).toEqual(Array.from(new TextEncoder().encode('Hello, World!')));
      expect(result.stringAnnotations).toEqual([]);
      expect(result.numericAnnotations).toEqual([]);
    });

    it('should handle mixed data sources (file takes precedence)', async() => {
      const binaryData = new Uint8Array([ 0x00, 0x01, 0x02, 0xFF, 0xFE, 0xFD ]);
      const binaryFile = createMockFile(binaryData, 'binary.bin', 'application/octet-stream');

      const formData: EntityFormFields = {
        dataText: 'This should be ignored',
        dataFile: [ binaryFile ],
        btl: '999',
        stringAnnotations: [ { id: '1', key: 'test', value: 'value' } ],
        numericAnnotations: [ { id: '1', key: 'count', value: '5' } ],
      };

      const result = await mapEntityFormDataToGolemCreate(formData);

      expect(result.data).toEqual(binaryData);
      expect(result.btl).toBe(999);
      expect(result.stringAnnotations).toHaveLength(1);
      expect(result.numericAnnotations).toHaveLength(1);
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
        created_at_timestamp: '2024-01-15T10:30:00Z',
        expires_at_block_number: '2234567',
        expires_at_timestamp: '2024-06-15T10:30:00Z',
        owner: '0xabcdef1234567890',
        gas_used: '21000',
        fees_paid: '500000000000000',
        updated_at_tx_hash: '0x1234567890abcdef',
        updated_at_operation_index: '0',
        updated_at_block_number: '1234567',
        updated_at_timestamp: '2024-01-15T10:30:00',
      };

      const result = mapFullEntityToFormFields(mockEntity);

      expect(result.dataText).toBe('Hello');
      expect(result.dataFile).toEqual([]);
      expect(result.btl).toBe('');
      expect(result.stringAnnotations).toHaveLength(2);
      expect(result.numericAnnotations).toHaveLength(2);
    });
  });
});
