/* ------------------------------------------------------------
*   This program We can read de UID from a RFID tag or Card
*--------------------------------------------------------------
*   MFRC522 Reader: |   Arduino UNO Pin:
*       RST         |           9
*       SDA (SS)    |           10
*       MOSI        |           11/ICSP-4
*       MISO        |           12/ICSP-1
*       SCK         |           13/ICSP-3
*--------------------------------------------------------------
*
*   More pin layouts for other boards can be found here: https://github.com/miguelbalboa/rfid#pin-layout
*/

#include <SPI.h>
#include <MFRC522.h>

#define RST_PIN  9
#define SS_PIN  10

#define buz 6 // passive buzzer

// music tones
#define Err  165 // if the card is not registered
#define OK  880 // if the card is registered
#define det 659 // when a card is detected

MFRC522 mfrc522(SS_PIN, RST_PIN); // crea objeto mfrc522 enviando pines de slave select y reset

byte LecturaUID[4];

void setup() {
  Serial.begin(9600);     // inicializa comunicacion por monitor serie a 9600 bps
  SPI.begin();        // inicializa bus SPI
  mfrc522.PCD_Init();     // inicializa modulo lector
  pinMode(buz, OUTPUT);
}

void loop() {
  if ( ! mfrc522.PICC_IsNewCardPresent()) // si no hay una tarjeta presente
    return;
  
  if ( ! mfrc522.PICC_ReadCardSerial())   // si no puede obtener datos de la tarjeta
    return;

  detected();
  for (byte i = 0; i < mfrc522.uid.size; i++) { // bucle recorre de a un byte por vez el UID
    if (mfrc522.uid.uidByte[i] < 0x10){   // si el byte leido es menor a 0x10
      Serial.print(" 0");     // imprime espacio en blanco y numero cero
      }
      else{         // sino
      Serial.print(" ");      // imprime un espacio en blanco
      }
    Serial.print(mfrc522.uid.uidByte[i], HEX);  // imprime el byte del UID leido en hexadecimal
  } 
  Serial.println();

  while (Serial.available() == 0) {}     //wait for data available
  String answer = Serial.readString();  //read until timeout
  answer.trim();

  if(answer == "OK"){
    Ok();
  }
  else{
    Error();
  }
  
  mfrc522.PICC_HaltA();                   // detiene comunicacion con tarjeta

  delay(1000);
}

void detected(){
  tone(buz, det);
  delay(100);
  noTone(buz);
}

void Ok(){
  tone(buz, OK);
  delay(620);
  noTone(buz);
}

void Error(){
  tone(buz, Err);
  delay(200);
  noTone(buz);
  delay(20);
  tone(buz, Err);
  delay(400);
  noTone(buz);
}