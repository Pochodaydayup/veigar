export const getContext = () => {
  const app = getApp();
  return app._pages[app._pages.length - 1] || { _mounted: false };
};
