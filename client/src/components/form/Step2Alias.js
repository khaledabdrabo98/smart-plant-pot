import React from "react";
import { Button } from "reactstrap";
import FormGroup from 'react-bootstrap/FormGroup';

const Step2 = props => {
  if (props.currentStep !== 2) {
    return null;
  }

  return (
    <>
      <h4><b>Step 2 : Verify API response</b></h4>
      <p> Looks like multiple plants exist with the name you have inserted,
        please choose one of the options below : </p>
      <div>
        {/* Loop on possible alias using data received from api */}
        {props.plant_pids.map(pid => {
          return <label key={pid.pid}>
            <input type="radio" key={pid.pid} name="plant_pid" id="plant_pid" onChange={props.handleChange} 
                  value={pid.pid} checked={props.plant_pid === pid.pid} />
            <img src={"https://opb-img.plantbook.io/" + encodeURI(pid.pid).trim() + ".jpg"} alt={pid.display_pid} />
            <p className="p_title"><b>{pid.display_pid.replace(" ", "\n")}</b></p>
          </label>
        })}
        <br />
        <p>Notice : If everything seems good, submitting will transfer the current plant information to your connected Arduino UNO</p>
        <FormGroup>
          <Button color="success" onClick={props.handleDetailsFromPID}>Confirm and save choice</Button>
        </FormGroup>
      </div>
    </>
  );
};

export default Step2;
