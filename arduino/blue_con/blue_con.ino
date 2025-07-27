#include <Arduino.h>
#include <BluetoothSerial.h>  // Para usar el Bluetooth interno del ESP32

// Pines motores
const int pwmMotorA = 25;  // Motor izquierdo (PWM A)
const int pwmMotorB = 26;  // Motor derecho (PWM B)
const int in1 = 32;
const int in2 = 33;
const int in3 = 27;
const int in4 = 14;

// Pines sensores
const int sensorIzq = 19;
const int sensorDer = 21;

// Bluetooth serial
BluetoothSerial SerialBT;  // Nombre del objeto BluetoothSerial

// PWM - configuración
const int resolucion = 8;     // bits
const int frecuencia = 1000;  // Hz

// Velocidades
const int pwmValues[] = {80, 128, 192, 254};
int vel = 1;
int pwm = pwmValues[vel - 1];
float ajusteA = 1.0;
float ajusteB = 0.90;

unsigned long lastTime = 0;
const unsigned long intervalo = 10;  // ms

void setSpeed(int val) {
  int pwmA = int(val * ajusteA);
  int pwmB = int(val * ajusteB);
  ledcWrite(pwmMotorA, pwmA);
  ledcWrite(pwmMotorB, pwmB);
}

void detener() {
  digitalWrite(in1, LOW); digitalWrite(in2, LOW);
  digitalWrite(in3, LOW); digitalWrite(in4, LOW);
}

void retroceder() {
  digitalWrite(in2, LOW); digitalWrite(in1, HIGH);
  digitalWrite(in4, LOW); digitalWrite(in3, HIGH);
}

void adelante() {
  digitalWrite(in2, HIGH); digitalWrite(in1, LOW);
  digitalWrite(in4, HIGH); digitalWrite(in3, LOW);
}

void derecha() {
  //necesario pwm
  digitalWrite(in2, HIGH); digitalWrite(in1, LOW);
  digitalWrite(in4, LOW); digitalWrite(in3, HIGH);
}

void izquierda() {
  digitalWrite(in2, LOW); digitalWrite(in1, HIGH);
  digitalWrite(in4, HIGH); digitalWrite(in3, LOW);
}

void actualizarVelocidad() {
  if (vel < 1) vel = 1;
  if (vel > 4) vel = 4;
  pwm = pwmValues[vel - 1];
  setSpeed(pwm);
  Serial.print("Velocidad: ");
  Serial.println(vel);
}

void setup() {
  // Pines motores
  pinMode(in1, OUTPUT); pinMode(in2, OUTPUT);
  pinMode(in3, OUTPUT); pinMode(in4, OUTPUT);

  // Pines sensores
  pinMode(sensorIzq, INPUT);
  pinMode(sensorDer, INPUT);

  // PWM: asocia pines a canales y configura PWM
  ledcAttach(pwmMotorA, frecuencia, resolucion);
  ledcAttach(pwmMotorB, frecuencia, resolucion);

  setSpeed(pwm);  // Aplica velocidad inicial

  // Seriales
  Serial.begin(115200);
  SerialBT.begin("Seguidor_QS");  // Bluetooth con nombre "esp32car"
  Serial.println("Bluetooth iniciado como 'Seguidor_QS'");
}

void loop() {
  unsigned long ahora = millis();
  if (ahora - lastTime >= intervalo) {
    bool izq = digitalRead(sensorIzq);
    bool der = digitalRead(sensorDer);

    if (!izq && !der) {
      Serial.println("Obstáculo en ambos sensores");
      detener();
      delay(1000);
      retroceder();
      delay(1000);
      if (random(0, 2) == 0) {
        Serial.println("Giro aleatorio: izquierda");
        izquierda();
      } else {
        Serial.println("Giro aleatorio: derecha");
        derecha();
      }
      delay(1000);
      //adelante();
      detener();
    } else if (!izq) {
      Serial.println("Obstáculo izquierda - Giro derecha");
      derecha();
    } else if (!der) {
      Serial.println("Obstáculo derecha - Giro izquierda");
      izquierda();
    } else {
      if (SerialBT.available()) {
        char c = SerialBT.read();
        Serial.print("Bluetooth: ");
        Serial.println(c);
        switch (c) {
          case '1': adelante(); break;
          case '2': retroceder(); break;
          case '3': izquierda(); break;
          case '4': derecha(); break;
          case '5': detener(); break;
          case 'u': vel++; actualizarVelocidad(); break;
          case 'd': vel--; actualizarVelocidad(); break;
          default: detener(); break;
        }
      }
    }
    lastTime = ahora;
  }
  delay(10);
  //detener();
}
