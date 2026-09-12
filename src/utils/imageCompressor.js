/**
 * Client-side canvas image compressor utility
 * Resizes images to maxWidth and applies JPEG quality compression before uploading to Cloudinary.
 *
 * @param {File} file - Original uploaded File object
 * @param {number} maxWidth - Maximum width in pixels (default 1800)
 * @param {number} quality - Quality compression ratio 0.0 to 1.0 (default 0.8)
 * @returns {Promise<File>} Compressed File object (or original file if not an image)
 */
export const compressImageFile = (file, maxWidth = 1800, quality = 0.8) => {
  return new Promise((resolve) => {
    // If file is not an image (e.g. PDF), return original as-is
    if (!file || !file.type || !file.type.startsWith('image/')) {
      return resolve(file);
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob && blob.size < file.size) {
              const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.jpg'), {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = () => resolve(file);
    };
    reader.onerror = () => resolve(file);
  });
};

export default compressImageFile;
