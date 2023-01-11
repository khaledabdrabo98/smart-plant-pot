import React from 'react';
import { Button } from "reactstrap";

const FileUploader = props => {
  const hiddenFileInput = React.useRef(null);
  
  const handleClick = event => {
    hiddenFileInput.current.click();
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
             onChange={event => props.handleFile(event)}
             style={{display:'none'}} 
      /> 
    </>
  );
};

export default FileUploader;
