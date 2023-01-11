import React, { Component, memo } from "react";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  CardText
} from "reactstrap";

import Step1 from "./Step1";
import Step2Alias from "./Step2Alias";
import Step2Image from "./Step2Image";
import Step3 from "./Step3";
import MultiStepProgressBar from "./MultiStepProgressBar";

async function upload_image_plant(image) {
  // console.log("in upload image");
  console.log(image)

  const thingData = new FormData();
  thingData.append('image', JSON.stringify(image));
  let contentType = 'multipart/form-data;boundary=' + image.size;

  return fetch("http://localhost:3000/plant/photo/", {
          method: 'POST',
          headers: {
            'Content-Type': contentType,
            'Accept': '*/*',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive'
          },
          body: thingData
      })
  .then(data => data.json())
  .then(data => {return data.message})
}

async function get_plant_alias(name) {
  // console.log("in search by name");
  // console.log(name)

  return fetch("http://localhost:3000/plant/id?alias=" + JSON.stringify(name.trim()), {
          method: 'GET',
          mode: 'cors',
          cache: 'default'
      })
  .then(data => data.json())
  .then(data => {return data.message.results})
}

async function get_details_from_pid(pid) {
  // console.log("in get details");
  // console.log(pid);
  // console.log(JSON.stringify(pid).trim().replace(/\s/g, '%20'));

  return fetch("http://localhost:3000/plant/stats?plant_pid=" + JSON.stringify(pid.trim()), {
          method: 'GET',
          mode: 'cors',
          cache: 'default'
      })  
  .then(data => data.json())
  .then(data => {return data.message})
}

async function get_saved_plant() {
  return fetch("http://localhost:3000/plant/myplant", {
          method: 'GET',
          mode: 'cors',
          cache: 'default'
      })  
  .then(data => data.json())
  .then(data => {return data.message})
}

async function get_saved_moist_level() {
  return fetch("http://localhost:3000/plant/moist_level", {
          method: 'GET',
          mode: 'cors',
          cache: 'default'
      })  
  .then(data => data.json())
  .then(data => {return data.message.current_moist_level})
}

function MultiStepForm() {
  const handleLoadSavedPlant = async () => {
    return await get_saved_plant();
  }

  const handleSavedMoistLevel = async () => {
    return await get_saved_moist_level();
  }

  return (
    <MainForm handleLoadSavedPlant={handleLoadSavedPlant}
              handleSavedMoistLevel={handleSavedMoistLevel}
    />
  );
}

function encode_status(moist_level) {
  if (moist_level === 0) 
    return <label>Happy 😄</label>
  else if (moist_level === 1)
    return <label>Thirsty 😓</label>
  else if (moist_level === 2)
    return <label>Parched 😵</label>
  else if (moist_level === 3)
    return <label>Drowning 😭</label>
  else 
    return <label>Loading...</label>
}

class MainForm extends Component {
  constructor(props) {
    super(props);

    // Set the initial input values
    this.state = {
      currentStep: 1,
      step2_alias: true,
      image: undefined,
      alias: undefined,
      plant_pids: [],
      plant_predictions: [],
      plant_pid: undefined,
      details: [],
      current_moist_level: undefined,
      handleLoadSavedPlant: props.handleLoadSavedPlant,
      handleSavedMoistLevel: props.handleSavedMoistLevel
    };

    // Bind the submission to handlers 
    this.handleChange = this.handleChange.bind(this);
    this.handleFile = this.handleFile.bind(this);
    this.handleAliasChange = this.handleAliasChange.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);
    this.handleDetailsFromPID = this.handleDetailsFromPID.bind(this);

    // Bind new functions for next and previous
    this._next = this._next.bind(this);
    this._prev = this._prev.bind(this);
  }

  componentDidMount() {
    this.state.handleLoadSavedPlant()
    .then(details => {this.setState({details: details})});

    this.timerID = setInterval(
      () => this.tick(),
      5000
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.state.handleSavedMoistLevel()
    .then(current_moist_level => {this.setState({current_moist_level: current_moist_level})});
  }

  // Use the submitted data to set the state
  handleChange(event) {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
    // console.log("received: "+name+": "+value);
  }

  handleFile(event) {
    if (event.target !== undefined) {
      this.setState({
        image: event.target.files[0],
        step2_alias: false
      });
      console.log(this.state.image);
      console.log(event.target.files[0]);
      this.handleImageChange(event.target.files[0]);
    } else {
      alert("Please retry uploading your image.");
    }
  }

  handleAliasChange = async () => {
    if (this.state.alias === undefined) {
      return
    }
    const pids = await get_plant_alias(this.state.alias);
    if (pids.length > 0) {
      this.setState({
        plant_pids: pids,
        plant_pid: pids[pids.length -1].pid,
        step2_alias: true
      });
      // console.log(pids);
      this._next();
    } else {
      alert("No results found :(");
    } 
  }

  handleImageChange = async (image) => {
    const predictions = await upload_image_plant(image);
    this.setState({
      plant_predictions: predictions,
      step2_alias: false
    });
    console.log(predictions);
    this._next();
  }

  handleDetailsFromPID = async () => {
    // console.log(this.state.plant_pid)
    const details = await get_details_from_pid(this.state.plant_pid)
    this.setState({
      details: details
    });
    // console.log(details);
    this._next();
  }

  // Test current step with ternary
  // _next and _previous functions will be called on button click
  _next() {
    let currentStep = this.state.currentStep;

    // If the current step is 1 or 2, then add one on "next" button click
    currentStep = currentStep >= 2 ? 3 : currentStep + 1;
    this.setState({
      currentStep: currentStep
    });
  }

  _prev() {
    let currentStep = this.state.currentStep;
    // If the current step is 2 or 3, then subtract one on "previous" button click
    currentStep = currentStep <= 1 ? 1 : currentStep - 1;
    this.setState({
      currentStep: currentStep
    });
  }

  // The "next" and "previous" button functions
  get previousButton() {
    let currentStep = this.state.currentStep;

    // If the current step is not 1, then render the "previous" button
    if (currentStep !== 1) {
      return (
        <Button color="secondary" className="float-left" onClick={this._prev}>
          Previous
        </Button>
      );
    }

    // ...else return nothing
    return null;
  }

  get nextButton() {
    let currentStep = this.state.currentStep;
    // If the current step is not 3, then render the "next" button
    if (currentStep < 3) {
      return (
        <Button color="success" className="float-right" onClick={this._next}>
          Next
        </Button>
      );
    }
    // ...else render nothing
    return null;
  }

  get submitButton() {
    let currentStep = this.state.currentStep;

    // If the current step is the last step, then render the "submit" button
    if (currentStep > 2) {
      return <Button color="success" className="float-right">Submit</Button>;
    }
    // ...else render nothing
    return null;
  }

  render() {
    return (
      <>
        <Card>
          <CardHeader>🍃 Welcome to <b>My Smart Plant</b> 🪴 </CardHeader>
          {this.state.details.display_pid ? 
            <CardHeader>Your current plant: <b>{this.state.details.display_pid}</b> (status: <b>{encode_status(this.state.current_moist_level)}</b>)</CardHeader>
          :
            <CardHeader>Your current plant: <b>???</b></CardHeader>
          }
          <CardBody>
            <CardTitle>
              <MultiStepProgressBar currentStep={this.state.currentStep} />
            </CardTitle>
            <CardText />
            <Step1
              currentStep={this.state.currentStep}
              handleChange={this.handleChange}
              handleFile={this.handleFile}
              handleImageChange={this.handleImageChange}
              handleAliasChange={this.handleAliasChange}
              alias={this.state.alias}
              image={this.state.image}
              next={this._next}
            />
            {this.state.step2_alias ? 
              <Step2Alias
                currentStep={this.state.currentStep}
                handleChange={this.handleChange}
                handleDetailsFromPID={this.handleDetailsFromPID}
                plant_pids={this.state.plant_pids}
                plant_pid={this.state.plant_pid}
                next={this._next}
              />
            : 
              <Step2Image
                currentStep={this.state.currentStep}
                handleChange={this.handleChange}  
                plant_pid={this.state.plant_pid}
                next={this._next}
              /> 
            }
            <Step3
              currentStep={this.state.currentStep}
              details={this.state.details}
            />
          </CardBody>
        </Card>
      </>
    );
  }
}

export default memo(MultiStepForm);
