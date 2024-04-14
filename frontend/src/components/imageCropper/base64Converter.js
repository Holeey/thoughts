function base64ToFile(base64String, filename) {
    // Assume base64String is the Base64-encoded image data
     const byteString = atob(base64String.split(',')[1]);
     const ab = new ArrayBuffer(byteString.length);
     const ia = new Uint8Array(ab);
     for (let i = 0; i < byteString.length; i++) {
       ia[i] = byteString.charCodeAt(i);
     }
     const blob = new Blob([ab], { type: 'image/jpeg' }); // Adjust the MIME type as needed
     return new File([blob], filename, { type: 'image/jpeg' }); // Adjust the file type as needed
   }

   
  function convertToBase64(file) {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();

      fileReader.onload = () => {
        const base64 = fileReader.result;
        resolve(base64);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };

      fileReader.readAsDataURL(file);
    });
  }

  module.exports = { convertToBase64, base64ToFile };
