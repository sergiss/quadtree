export const loadImage = (src, callback) => {
  const img = document.createElement("img");
  if (callback) {
    img.addEventListener("load", callback.loaded);
    img.addEventListener("error", callback.error);
  }
  img.src = src;
  return img;
};
