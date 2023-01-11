import React from "react";
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

function prettyJSON(text) {
  return (
    <SyntaxHighlighter language="javascript" style={docco}>
      {text}
    </SyntaxHighlighter>
  );
}

const Step3 = props => {
  if (props.currentStep !== 3) {
    return null;
  }

  return (
    <>
      <h4><b>Step 3 : Plant information and needs</b></h4>
      <p>Notice : Plant needs are set for as current plant, and sent to your connected Arduino UNO</p>
      
      <img src={"https://opb-img.plantbook.io/" + encodeURI(props.details.pid).trim() + ".jpg"} alt={props.details.display_pid} />
      
      <p><b>Useful information about your plant:</b></p>
      <p>{prettyJSON("Plant category: " + props.details.category)} </p>
      <p>{prettyJSON("Humidity range: [ " + props.details.min_env_humid +" %, " + props.details.max_env_humid + " % ]")} </p>
      <p>{prettyJSON("Soil moist range: [ " + props.details.min_soil_moist +" %, " + props.details.max_soil_moist + " % ]")} </p>
      <p>{prettyJSON("Room temperature range: [ " + props.details.min_temp +" ℃, " + props.details.max_temp + " ℃ ]")} </p>
      <p>{prettyJSON("Light intensity range: [ " + props.details.min_light_mmol +" mmol, " + props.details.max_light_mmol + " mmol ]")} </p>
    </>
  );
};

export default Step3;
