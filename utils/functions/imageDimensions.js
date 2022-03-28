const imageDimensions = (sizesObj, imageSize) => {
  const aspectRatio = sizesObj.width / sizesObj.height;
  const width = Math.sqrt(imageSize * aspectRatio);
  const height = width / aspectRatio;

  return { width: width || 1, height: height || 1 };
};

export default imageDimensions;
