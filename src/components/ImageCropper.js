export const getCroppedImg = async (fileOrUrl, pixelCrop, displayedWidth, displayedHeight) => {
    return new Promise(async (resolve, reject) => {
      let imgBlob;
  
      // Check if the input is a valid Blob/File
      if (fileOrUrl instanceof Blob || fileOrUrl instanceof File) {
        imgBlob = fileOrUrl;
      } else if (typeof fileOrUrl === 'string') {
        // If it's a URL, fetch the image and convert it to a Blob
        try {
          const response = await fetch(fileOrUrl);
          if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.statusText}`);
          }
          imgBlob = await response.blob();
        } catch (fetchError) {
          reject(new Error(`Failed to load image from URL: ${fetchError.message}`));
          return;
        }
      } else {
        reject(new Error('Invalid image source: Expected Blob, File, or URL'));
        return;
      }
  
      // Create an Image object and set its source
      const img = new Image();
      img.src = URL.createObjectURL(imgBlob);
  
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
  
        // Get the natural dimensions of the image
        const imgWidth = img.naturalWidth;
        const imgHeight = img.naturalHeight;
  
        // Calculate the scale factors
        const scaleX = imgWidth / displayedWidth; // Scale factor for width
        const scaleY = imgHeight / displayedHeight; // Scale factor for height
  
        // Adjust the crop area to match the original image dimensions
        const cropX = Math.max(0, Math.min(pixelCrop.x * scaleX, imgWidth - 1));
        const cropY = Math.max(0, Math.min(pixelCrop.y * scaleY, imgHeight - 1));
        const cropWidth = Math.min(pixelCrop.width * scaleX, imgWidth - cropX);
        const cropHeight = Math.min(pixelCrop.height * scaleY, imgHeight - cropY);
  
        // Ensure valid dimensions
        if (cropWidth <= 0 || cropHeight <= 0) {
          console.error('Invalid crop dimensions:', { cropWidth, cropHeight });
          reject(new Error('Invalid crop dimensions'));
          return;
        }
  
        console.log('Cropping:', { cropX, cropY, cropWidth, cropHeight });
  
        // Set canvas size to match crop area
        canvas.width = cropWidth;
        canvas.height = cropHeight;
  
        // Draw the cropped area onto the canvas
        ctx.drawImage(
          img,
          cropX,
          cropY,
          cropWidth,
          cropHeight,
          0,
          0,
          cropWidth,
          cropHeight
        );
  
        // Convert the canvas content to a data URL
        try {
          const dataUrl = canvas.toDataURL('image/jpeg', 0.9); // Optional: Set JPEG quality (0.9 = 90%)
          resolve(dataUrl); // Return the data URL
        } catch (canvasError) {
          reject(new Error('Failed to create data URL from canvas'));
        }
      };
  
      img.onerror = (error) => reject(error);
    });
  };