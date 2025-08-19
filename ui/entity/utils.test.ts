import { Annotation as GolemAnnotation } from 'golem-base-sdk';

import type { EntityFormFields } from './types';

import { mapEntityFormData } from './utils';

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

describe('mapEntityFormData', () => {
  const mockFile = createMockFile('test file content', 'test.txt', 'text/plain');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should map form data with file correctly', async() => {
    const formData: EntityFormFields = {
      dataText: '',
      dataFile: [ mockFile ],
      btl: 123,
      stringAnnotations: [
        { key: 'stringKey1', value: 'stringValue1' },
        { key: 'stringKey2', value: 'stringValue2' },
      ],
      numericAnnotations: [
        { key: 'numKey1', value: 42 },
        { key: 'numKey2', value: 100 },
      ],
    };

    const result = await mapEntityFormData(formData);

    expect(result.btl).toBe(123);
    expect(Array.from(result.data)).toEqual(Array.from(new TextEncoder().encode('test file content')));
    expect(result.stringAnnotations).toEqual([
      { key: 'stringKey1', value: 'stringValue1' },
      { key: 'stringKey2', value: 'stringValue2' },
    ]);
    expect(result.numericAnnotations).toEqual([
      { key: 'numKey1', value: 42 },
      { key: 'numKey2', value: 100 },
    ]);

    expect(GolemAnnotation).toHaveBeenCalledTimes(4);
    expect(GolemAnnotation).toHaveBeenCalledWith('stringKey1', 'stringValue1');
    expect(GolemAnnotation).toHaveBeenCalledWith('stringKey2', 'stringValue2');
    expect(GolemAnnotation).toHaveBeenCalledWith('numKey1', 42);
    expect(GolemAnnotation).toHaveBeenCalledWith('numKey2', 100);
  });

  it('should map form data with text data correctly', async() => {
    const formData: EntityFormFields = {
      dataText: 'Hello, World!',
      dataFile: [],
      btl: 456,
      stringAnnotations: [],
      numericAnnotations: [],
    };

    const result = await mapEntityFormData(formData);

    expect(result.btl).toBe(456);
    expect(Array.from(result.data)).toEqual(Array.from(new TextEncoder().encode('Hello, World!')));
    expect(result.stringAnnotations).toEqual([]);
    expect(result.numericAnnotations).toEqual([]);

    const expectedBytes = new TextEncoder().encode('Hello, World!');
    expect(result.data).toEqual(expectedBytes);
  });

  it('should handle mixed data sources (file takes precedence)', async() => {
    const binaryData = new Uint8Array([ 0x00, 0x01, 0x02, 0xFF, 0xFE, 0xFD ]);
    const binaryFile = createMockFile(binaryData, 'binary.bin', 'application/octet-stream');

    const formData: EntityFormFields = {
      dataText: 'This should be ignored',
      dataFile: [ binaryFile ],
      btl: 999,
      stringAnnotations: [ { key: 'test', value: 'value' } ],
      numericAnnotations: [ { key: 'count', value: 5 } ],
    };

    const result = await mapEntityFormData(formData);

    expect(result.data).toEqual(binaryData);
    expect(result.btl).toBe(999);
    expect(result.stringAnnotations).toHaveLength(1);
    expect(result.numericAnnotations).toHaveLength(1);
  });
});
