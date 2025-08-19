export function httpToWs(url: string): string {
  return url.replace('http://', 'ws://').replace('https://', 'wss://');
}
