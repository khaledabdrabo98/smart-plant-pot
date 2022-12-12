#include <CapacitiveSensor.h>

/*---------------------------------*/

CapacitiveSensor   cs_2_4 = CapacitiveSensor(2,4); // 1M resistor between pins 2 & 4, pin 4 is sensor pin, add a wire and foil

int activated = false;
int threshold = 0;
long r;
int state;
int sensorVal = 0;

/*---------------------------------*/

void setup()
{
  Serial.begin(9600);
  pinMode(4, INPUT); // sensor
  pinMode(6, OUTPUT); // GREEN
  pinMode(7, OUTPUT); // YELLOW
  pinMode(8, OUTPUT); // RED
  // Electrods
  pinMode(A4, INPUT); // input from first moisture sensor 1
  pinMode(13, OUTPUT); // Sends a pulse of current to the sensor 1
}

void loop()
{  
  r = cs_2_4.capacitiveSensor(30);
  state = get_plant();
  get_water();
  led_control(state);
  /*
  Serial.print(r);
  Serial.print("\t");
  Serial.print(state);
  Serial.println();
  delay(100);
  */
}

/*---------------------------------*/

int get_plant() {
  int temp = 1; // touch
  if (r<50){
    temp = 2; // nothing
  }
  if (r>200){
    temp = 0; // pinch
  }
  return temp;
}

void get_water() {
  // Provide current to sensor 1 and read the value
  digitalWrite(13, HIGH);
  delay(100);
  sensorVal = analogRead(A4);
  delay(100);
  Serial.println(sensorVal);
  delay(250);
  /*
  // Provide current to sensor 2 and read the value
  digitalWrite(PulsePin2, HIGH);
  delay(100);
  sensorValue2 = analogRead(SensorRods2);
  delay(100);
  Serial.println(sensorValue2);
  digitalWrite(PulsePin2, LOW);
  delay(250);
  */
  // Evaluate the moisture sensor values and turn on valves as necessary
  if (sensorVal >= 700) {

  }
  if (sensorVal < 700) {

  }
  // Check once every 1 seconds
  //delay(1000);
}

void led_control(int led_id)
{   
  if (r >= threshold) {
    activated = true;
  }
  else {
    activated = false;
  }
  
  if (activated == true){
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
    }
  }
  else {
    digitalWrite(6, LOW);
    digitalWrite(7, LOW);
    digitalWrite(8, LOW);
  }
}
