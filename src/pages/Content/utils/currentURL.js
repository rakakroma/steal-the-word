export const currentURL = () => {
  return window.location.hash
    ? window.location.href.slice(
        0,
        window.location.href.lastIndexOf(window.location.hash)
      )
    : window.location.href;
};

export const filterHashFromUrl = (url) => {
  const theURLData = new URL(url);
  if (theURLData.hash)
    return theURLData.href.slice(
      0,
      theURLData.href.lastIndexOf(window.location.hash)
    );
  return theURLData.href;
};
