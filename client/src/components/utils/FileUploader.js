import React from 'react';
import { Button } from "reactstrap";

const FileUploader = props => {
  const hiddenFileInput = React.useRef(null);
  
  const handleClick = event => {
    hiddenFileInput.current.click();
  };
  const handleChange = event => {
    const fileUploaded = event.target.files[0];
    props.handleFile(fileUploaded);
  };

  return (
    <>
      <Button color="success" onClick={handleClick}>
        Upload an image
      </Button>
      <input type="file"
             id="image"
             name="image"
             accept="image/*" 
             ref={hiddenFileInput}
             onChange={handleChange}
             style={{display:'none'}} 
      /> 
    </>
  );
};

export default FileUploader;
