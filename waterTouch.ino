#include <CapacitiveSensor.h>

CapacitiveSensor   cs_2_4 = CapacitiveSensor(2,4); // 1M resistor between pins 2 & 4, pin 4 is sensor pin with the detection wire

int touchValue;  // <50:nothing - >400:pinched - inbetween:touched
int lightSwitch = true;  // true:lights_ON - false:lights_OFF
int moisturePercentage;


// WARNING !!!
// The bigger the moistureValue, the lower the moisture is
float min_moistureValue = 110;  // min sensor value (in water)
float max_moistureValue = 445;  // max sensor value (in air)
int moistureValue;  // [110;445]
int needed_min_moisture = -1;  // percentage to get from API
int needed_max_moisture = -1;  // percentage to get from API

/*---------------------------------*/

void setup()
{
  Serial.begin(9600);
  pinMode(4, INPUT); // touch sensor
  pinMode(6, OUTPUT); // GREEN LED
  pinMode(7, OUTPUT); // YELLOW LED
  pinMode(8, OUTPUT); // RED LED
  pinMode(A0, INPUT); // moisture sensor
}

void loop()
{  
  touchValue = cs_2_4.capacitiveSensor(30);
  moistureValue = analogRead(A0);
  if (needed_min_moisture<0 or needed_max_moisture<0){
    query_data();
  }
  //
  check_touch();
  check_water();
  
  Serial.print(touchValue);
  Serial.print("\t");
  Serial.println();
  delay(100);
  
}

/*---------------------------------*/

void check_touch()
{
  int touchState = 1; // touch
  if (touchValue<400){
    touchState = 2; // nothing
  }
  if (touchValue>1000){
    touchState = 0; // pinch
  }
  react(touchState);
}


void react(int action_id)
{
  switch (action_id) {
    case 0:
      send_data();
      lights_led(4);
      break;
    case 1:
      lightSwitch = !lightSwitch;
      delay(500);
      break;
    default:
      break;
  }
}

//////////////////
void check_water()
{
  // Convert the moisture sensor values to percentage to match the API (and reverse it)
  moisturePercentage = 100 - ((moistureValue - min_moistureValue) / (max_moistureValue - min_moistureValue)) * 100;
  //Serial.println(moisturePercentage);
  // Define plant needs
  int moistureState = 0; // happy (GREEN)
  if (moisturePercentage < (needed_min_moisture + 0.2 * needed_max_moisture)) {
    moistureState = 1; // thirsty (YELLOW)
  }
  if (moisturePercentage < needed_min_moisture) {
    moistureState = 2; // parched (RED)
  }
  if (moisturePercentage > needed_max_moisture) {
    moistureState = 3; // drowning (GREEN & RED)
  }
  lights_led(moistureState);
}

///////////////////////////
void lights_led(int led_id)
{
  if (lightSwitch or led_id==4){
    switch (led_id) {
      case 0:
        digitalWrite(6, HIGH);
        digitalWrite(7, LOW);
        digitalWrite(8, LOW);
        break;
      case 1:
        digitalWrite(6, LOW);
        digitalWrite(7, HIGH);
        digitalWrite(8, LOW);
        break;
      case 2:
        digitalWrite(6, LOW);
        digitalWrite(7, LOW);
        digitalWrite(8, HIGH);
        break;
      case 3:
        digitalWrite(6, HIGH);
        digitalWrite(7, LOW);
        digitalWrite(8, HIGH);
        break;
      case 4:
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
  } else {
    digitalWrite(6, LOW);
    digitalWrite(7, LOW);
    digitalWrite(8, LOW);
  }
}

////////////////
void query_data()
{
  // TODO query website
  needed_min_moisture = 15;
  needed_max_moisture = 60;
}

/////////////
void send_data()
{
  // TODO send to website
  int dataSent = 100 - ((moistureValue - min_moistureValue) / (max_moistureValue - min_moistureValue)) * 100;
  // Penser à mettre un timestamp
}
