export const getPageTitle = () => {
  if (document.title) {
    return document.title;
  } else {
    const hostName = window.location.hostname;
    const pathName = window.location.pathname;
    const splittedPathName = pathName.split('/');
    const fileName = splittedPathName.pop();
    const fileNameWithoutHTMLExtension = fileName.replace('.html', '');
    if (hostName) return `${fileNameWithoutHTMLExtension} - ${hostName}`;
    const pathNameWithoutFileName = splittedPathName.join('/');
    return `${fileNameWithoutHTMLExtension} - ${pathNameWithoutFileName}`;
  }
};
