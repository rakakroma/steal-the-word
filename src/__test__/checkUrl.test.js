import { checkLocalPath, getCurrentDomain } from '../utilsForAll/checkUrl';

describe('checkLocalPath', () => {
  test('returns true for local file path', () => {
    const url = 'file:///C:/Users/Me/Documents/example.txt';
    expect(checkLocalPath(url)).toBe(true);
  });

  test('returns false for remote URL', () => {
    const url = 'https://www.example.com/page.html';
    expect(checkLocalPath(url)).toBe(false);
  });
});

describe('getCurrentDomain', () => {
  test('returns "file" for local file path', () => {
    const url = 'file:///C:/Users/Me/Documents/example.txt';
    expect(getCurrentDomain(url)).toBe('file');
  });

  test('returns domain name for remote URL', () => {
    const url = 'https://www.example.com/page.html';
    expect(getCurrentDomain(url)).toBe('www.example.com');
  });

  test('throws error for invalid URL', () => {
    const url = 'not_a_url';
    expect(() => getCurrentDomain(url)).toThrowError();
  });
});
