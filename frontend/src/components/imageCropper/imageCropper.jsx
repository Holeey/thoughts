import { useState, useCallback, useEffect, useRef } from "react";
import Cropper from "react-easy-crop";

import "./imageCropper.css";

const ImageCropper = ({ selectedImage, onCropDone, onCropCancel }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [imageData, setImageData] = useState('');
  const [croppedArea, setCroppedArea] = useState('');
  const [aspectRatio, setAspectratio] = useState(null);
  

  const canvasRef = useRef(null);

  const onCropComplete = (croppedAreaPixels) => {
    setCroppedArea(croppedAreaPixels)
  };

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

  useEffect(() =>{
    const loadImage = async () => {
      try {
        const base64data = await convertToBase64(selectedImage)
        setImageData(base64data)
      } catch (error) {
        console.error('crop-image-error:', error)
      }
    }
    loadImage();

  }, [selectedImage]);

  const changeAspectratio = (event) => {
    setAspectratio(event.target.value)
  }

  

  return (
    <div className="image_cropper_background">
      <canvas ref={canvasRef}/>
      <div>
       <Cropper
        image={imageData}
        crop={crop}
        zoom={zoom}
        aspect={aspectRatio}
        onCropChange={setCrop}
        onCropComplete={onCropComplete}
        onZoomChange={setZoom}
        showGrid={true}
        style={{
          containerStyle: {
            width: '50%',
            height: '50%',
            marginTop: '3rem',
            backgroundColor: '#fff'
          }
        }}
      />  
      <div className="aspectRatioChange" onChange={changeAspectratio}>
        <input type="radio" value={1/1} name="ratio"/> 1:1
        <input type="radio" value={3/2} name="ratio"/> 3:2
        <input type="radio" value={5/4} name="ratio"/> 5:4
        <input type="radio" value={16/9} name="ratio"/> 16:9
        <input type="radio" value={3/1} name="ratio"/> 3:1
        <input type="radio" value={4/3} name="ratio"/> 4:3
        <input type="radio" value={5/3} name="ratio"/> 5:3
        <input type="radio" value={5/2} name="ratio"/> 5:2

      </div >
      <div className="crop-action-btn">
            <button 
      className="crop-cancel"
      onClick={onCropCancel}
      type="button">cancel</button>
      <button
      onClick={() => onCropDone(croppedArea)}
       type="button">apply crop</button>  
      </div>

      </div>
      


    
    </div>
  );
};

export default ImageCropper;
