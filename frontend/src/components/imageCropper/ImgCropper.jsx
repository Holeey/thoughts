import { useState, useCallback, useEffect, useRef } from "react";
import Cropper from "react-easy-crop";
import {convertToBase64} from '../imageCropper/base64Converter'
import "./imgCropper.css";


const ImgCropper = ({ selectedImage, onCropDone, onCropCancel }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [imageData, setImageData] = useState('');
  const [croppedArea, setCroppedArea] = useState('');
  const [aspectRatio, setAspectratio] = useState(null);

  const onCropComplete = (croppedAreaPercentages, croppedAreaPixels) => {
    setCroppedArea(croppedAreaPixels)
  };


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
    <div >
      <div className="image_cropper_background">
       <Cropper
        image={imageData}
        crop={crop}
        zoom={zoom}
        aspect={aspectRatio}
        onCropChange={setCrop}
        onCropComplete={onCropComplete}
        onZoomChange={setZoom}
        showGrid={true}
        zoomWithScroll={true}
        style={{
          containerStyle: {
            width: '100%',
            height: '70%',
            backgroundColor: '#fff'
          },
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
      type="button">Cancel</button>
      <button
      onClick={() =>  onCropDone(croppedArea, imageData, selectedImage?.name) }
       type="button">Apply crop</button>  
      </div>

      </div>
    
    </div>
  );
};

export default ImgCropper;














