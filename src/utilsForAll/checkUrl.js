export const checkLocalPath = (url) => url.split('//')[0].includes('file');

//there is a getHostName function, but this is for saving and retrieving domain preferences, and getHostName is for displaying

export const getCurrentDomain = (url) =>
  checkLocalPath(url) ? 'file' : new URL(url).hostname;

export const checkIsValidEnvironmentByUrl = (url) => !url.startsWith('chrome');
