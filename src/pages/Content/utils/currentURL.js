export const currentURL = () => {
  return window.location.hash
    ? window.location.href.slice(
        0,
        window.location.href.lastIndexOf(window.location.hash)
      )
    : window.location.href;
};
