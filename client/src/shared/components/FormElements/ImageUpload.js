import React, { useRef, useState, useEffect } from 'react';

import Button from './Button';
import './ImageUpload.css';

function ImageUpload(props) {
  const filePickerRef = useRef(),
    imagePreviewRef = useRef();

  const [file, setFile] = useState(),
        [previewUrl, setPreviewUrl] = useState(),
        [isValid, setIsValid] = useState();

  const pickImageHandler = (event) => {
    filePickerRef.current.click();
    imagePreviewRef.current.style.display = 'block'
  };

  // useEffect to generate a preview when file changes
  useEffect(() => {
    if (!file) return;

    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result)
    };
    fileReader.readAsDataURL(file);
  }, [file])

  const imagePickerHandler = (event) => {

    let pickedFile, fileIsValid = isValid;

    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      setFile(pickedFile);
      setIsValid(true);
      fileIsValid = true;
    } else {
      setIsValid(false);
      fileIsValid = false;
    }

    props.onInput(props.id, pickedFile, fileIsValid);
  };

  console.log(previewUrl);
  return (
    <div className="form-control">
      <input
        type="file"
        id={props.id}
        style={{ display: 'none' }}
        accept=".jpg,.jpeg,.png"
        ref={filePickerRef}
        onChange={imagePickerHandler}
      />
      <div className={`image-upload ${props.center && 'center'}`}>
        <div ref={imagePreviewRef} className="image-upload__preview">
          {previewUrl && <img src={previewUrl} alt="Image preview" />}
          {!previewUrl && <p>Please pick up an image !</p>}
        </div>
        <Button type="button" onClick={pickImageHandler}>
          Pick Profile Image
        </Button>
      </div>
    </div>
  );
}

export default ImageUpload;
