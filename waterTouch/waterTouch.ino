/*-----------------------------------
 * M2IA - Projet d'IoTR - WaterTouch
 * Par HERVIER, BRIGNONE et ABDRABO
 * Code de l'Arduino UNO
 *-----------------------------------*/

#include <CapacitiveSensor.h>

CapacitiveSensor   cs_2_4 = CapacitiveSensor(2,4); // 1M resistor between pins 2 & 4, pin 4 is the sensor pin with the detection wire

int touchValue;  // <50:nothing - >400:pinched - inbetween:touched
int lightSwitch = true;  // true:lights_ON - false:lights_OFF

// WARNING !!!
// The bigger the 'moistureValue', the lower the moisture is
int moistureState;  // 0:happy - 1:thirsty - 2:parched - 3:drowning
float min_moistureValue = 110;  // min sensor value (in water)
float max_moistureValue = 445;  // max sensor value (in air)
int moistureValue;  // [110;445]
int needed_min_moisture = -1;  // percentage to get from API
int needed_max_moisture = -1;  // percentage to get from API

/*---------------------------------*/

////////////
void setup()
{
  Serial.begin(9600);
  pinMode(4, INPUT); // touch sensor
  pinMode(6, OUTPUT); // GREEN LED
  pinMode(7, OUTPUT); // YELLOW LED
  pinMode(8, OUTPUT); // RED LED
  pinMode(A0, INPUT); // moisture sensor
}

///////////
void loop()
{
  touchValue = cs_2_4.capacitiveSensor(30);
  moistureValue = analogRead(A0);
  if (needed_min_moisture==-1 or needed_max_moisture==-1){  // if needed moisture has not been set, request through Serial
    query_data();
  }
  //
  check_touch();
  check_water();
}

/*---------------------------------*/

//////////////////
void check_touch()  // check if the plant is interacted with
{
  int touchState = 1; // touch
  if (touchValue<200){
    touchState = 2; // nothing
  }
  if (touchValue>400){
    touchState = 0; // pinch
  }
  react(touchState);
}

/////////////////////////
void react(int action_id)  // modifiy behavior based on touchState
{
  switch (action_id) {
    case 0:  // if pinched, update needed moisture (if plant has changed)
      query_data();
      lights_led(4);
      delay(1000);
      break;
    case 1:  // if touched, switch lights
      lightSwitch = !lightSwitch;
      delay(1000);
      break;
    default:
      break;
  }
}

//////////////////
void check_water()  // evaluate the moisture level of the soil
{
  // Convert the moisture sensor values to percentage to match the API (and reverse it)
  int moisturePercentage = 100 - ((moistureValue - min_moistureValue) / (max_moistureValue - min_moistureValue)) * 100;
  // Define plant needs
  int newState = 0; // happy (GREEN)
  if (moisturePercentage < (needed_min_moisture + 0.2 * needed_max_moisture)) {
    newState = 1; // thirsty (YELLOW)
  }
  if (moisturePercentage < needed_min_moisture) {
    newState = 2; // parched (RED)
  }
  if (moisturePercentage > needed_max_moisture) {
    newState = 3; // drowning (GREEN & RED)
  }
  // Check if the led has changed
  if (newState != moistureState){
    moistureState = newState;
    send_data();
  }
  lights_led(moistureState);
}

///////////////////////////
void lights_led(int led_id)  // LED system controler
{
  if (lightSwitch or led_id==4){ // if LEDs are ON or if data is being sent to server
    switch (led_id) {
      case 0:  // GREEN
        digitalWrite(6, HIGH);
        digitalWrite(7, LOW);
        digitalWrite(8, LOW);
        break;
      case 1:  // YELLOW
        digitalWrite(6, LOW);
        digitalWrite(7, HIGH);
        digitalWrite(8, LOW);
        break;
      case 2:  // RED
        digitalWrite(6, LOW);
        digitalWrite(7, LOW);
        digitalWrite(8, HIGH);
        break;
      case 3:  // GREEN & RED
        digitalWrite(6, HIGH);
        digitalWrite(7, LOW);
        digitalWrite(8, HIGH);
        break;
      case 4:  // BLINKING
        for (int i=0; i<10; i++){
          digitalWrite(6, HIGH);
          digitalWrite(7, LOW);
          digitalWrite(8, LOW);
          delay(100);
          digitalWrite(6, LOW);
          digitalWrite(7, HIGH);
          digitalWrite(8, LOW);
          delay(100);
          digitalWrite(6, LOW);
          digitalWrite(7, LOW);
          digitalWrite(8, HIGH);
          delay(100);
        }
        break;
    }
  } else {  // LEDs OFF
    digitalWrite(6, LOW);
    digitalWrite(7, LOW);
    digitalWrite(8, LOW);
  }
}

////////////////
void query_data()  // get data from the API through SERIAL
{
  String request;
  for (int i=0; i<2; i++){
    if (i==0){
      request = "min";
    }
    else request = "max";
    Serial.println(request); // request min_soil_moist then max_soil_moist
    //
    int value = 0;
    char char_in = -1;
    while (Serial.available()){  // read all the incoming data
      char_in = Serial.read();
      if (char_in != -1){        // check to make sure there is a character
        if ((char_in >= '0') && (char_in <= '9')){  // is it a digit?
          value *= 10;                              // multiply total by 10
          value += (char_in - '0');                 // add numeric value of new character
        }
        // else the new character is not a digit, we are done and can save the value
        else {
          if (i==0){
            needed_min_moisture = value;
          }
          else {
            needed_max_moisture = value;
          }
          break;
        }
      }
    }
  }
  delay(500);
}

/////////////
void send_data()  // send current 'moistureState' to the server through SERIAL
{
  delay(1000);
  if (needed_min_moisture > -1 and needed_max_moisture > -1){
    Serial.println(String(moistureState));
  }
}
