// Helper to get the cropped image blob/dataURL
export async function getCroppedImg(imageSrc, pixelCrop) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const maxSize = Math.max(pixelCrop.width, pixelCrop.height);
  canvas.width = maxSize;
  canvas.height = maxSize;

  // Draw circular clipped image
  ctx.save();
  ctx.beginPath();
  ctx.arc(maxSize / 2, maxSize / 2, maxSize / 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();

  // Draw the image portion
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    maxSize,
    maxSize
  );

  ctx.restore();

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve({ blob, url: URL.createObjectURL(blob) });
    }, 'image/jpeg', 0.9);
  });
}

function createImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (err) => reject(err));
    image.setAttribute('crossOrigin', 'anonymous'); // needed for CORS
    image.src = url;
  });
}
