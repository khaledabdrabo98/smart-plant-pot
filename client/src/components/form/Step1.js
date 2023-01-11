import React from "react";
import { Input, FormGroup, Button } from "reactstrap";
import { Form } from 'react-bootstrap';
import FileUploader from "../utils/FileUploader";

function Step1 (props) {
    if (props.currentStep !== 1) {
        return <></>;
    } else {
        return (
            <>
                <div>
                    <h4><b>Step 1 : Identify your plant</b></h4>
                    <p>By uploading an image (.png, .jpg, .jpeg)</p>
                    <form encType="multipart/form-data">
                        {/* <Form.Group>
                            <Form.Label>Upload image</Form.Label>
                            <Form.File name="image" type="file" accept="image/*" />
                        </Form.Group> */}
                        {/* <Form.File name="image"  accept="image/*" onChange={e => setImage(e.target.files[0])} />  */}
                        <Form.Group>
                            <FileUploader handleFile={props.handleImageChange}/>
                        </Form.Group> 
                    </form>
                </div>
                <hr />
                <p><b> OR </b></p>
                <div>   
                    <p>By its scientific name</p>
                    <FormGroup>
                        <Input type="text" id="alias" name="alias" placeholder="Enter your plant's scientific name" onChange={props.handleChange} required/>
                        <br />
                        <Button color="success" className="float-right" onClick={props.handleAliasChange}>
                            Search by name
                        </Button>
                    </FormGroup>
                </div>
            </>
        );
    }
};

export default Step1;
