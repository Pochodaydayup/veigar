export const getContext = () => {
  const page = getApp().getContext();
  return page || { __mounted: false };
};
