import React, { useRef } from 'react';

import Button from './Button';
import './ImageUpload.css';

function ImageUpload(props) {
  const filePickerRef = useRef(),
    imagePreviewRef = useRef();

  const pickImageHandler = (event) => {
    filePickerRef.current.click();
    debugger;
    imagePreviewRef.current.style.display = 'block'
  };

  const imagePickedHandler = (event) => {
    console.log(event.target);
  };

  return (
    <div className="form-control">
      <input
        type="file"
        id={props.id}
        style={{ display: 'none' }}
        accept=".jpg,.jpeg,.png"
        ref={filePickerRef}
        onChange={imagePickedHandler}
      />
      <div className={`image-upload ${props.center && 'center'}`}>
        <div ref={imagePreviewRef} className="image-upload__preview">
          <img src="" alt="Image preview" />
        </div>
        <Button type="button" onClick={pickImageHandler}>
          Pick Profile Image
        </Button>
      </div>
    </div>
  );
}

export default ImageUpload;
