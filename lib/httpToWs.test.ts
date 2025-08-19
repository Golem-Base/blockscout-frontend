import { httpToWs } from './httpToWs';

describe('httpToWs', () => {
  it('should convert http:// URLs to ws://', () => {
    const httpUrl = 'http://example.com/api';
    const expected = 'ws://example.com/api';

    expect(httpToWs(httpUrl)).toBe(expected);
  });

  it('should convert https:// URLs to wss://', () => {
    const httpsUrl = 'https://example.com/api';
    const expected = 'wss://example.com/api';

    expect(httpToWs(httpsUrl)).toBe(expected);
  });
});
