export const getImagePath = (image: string) => {
  return image.startsWith('http')
    ? image
    : `${import.meta.env.PUBLIC_URL}/images/products/${image}`;
};
