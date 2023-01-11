import React from "react";
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

const Step2 = props => {
  if (props.currentStep !== 2) {
    return null;
  }

  return (
    <>
      <h4><b>Step 2 : Verify API response</b></h4>
      <p> Here are the models predictions, please choose one of the following to proceed </p>
      <div style={{ width: '100%' }}>
        <ButtonGroup>
          {/* Loop on possible alias using data received from api */}
          {props.plant_pids.map(pid => {
            return <label key={pid.pid}>
              <input type="radio" key={pid.pid} name="choice" id="choice" value={pid.pid} checked />
              <img src={"https://opb-img.plantbook.io/" + encodeURI(pid.pid).trim() + ".jpg"} alt={pid.display_pid} />
            </label>
          })}
        </ButtonGroup>
        {/* <Button onClick={props.handleDetailsFromPID} only if checked is true */}
      </div>
    </>
  );
};

export default Step2;
