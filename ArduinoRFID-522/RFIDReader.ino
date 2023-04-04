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
#define Err  165
#define OK  880
#define det 659

MFRC522 mfrc522(SS_PIN, RST_PIN);

const unsigned long INTERVAL_RES = 5000UL;
unsigned long event_res = 0;

byte LecturaUID[4];

void setup() {
  Serial.begin(9600);
  SPI.begin();
  mfrc522.PCD_Init();
  pinMode(buz, OUTPUT);
}

void loop() {
  if ( ! mfrc522.PICC_IsNewCardPresent())
    return;
  
  if ( ! mfrc522.PICC_ReadCardSerial())
    return;

  detected();
  for (byte i = 0; i < mfrc522.uid.size; i++) { 
    if (mfrc522.uid.uidByte[i] < 0x10){
      Serial.print(" 0");
      }
      else{
      Serial.print(" ");
      }
    Serial.print(mfrc522.uid.uidByte[i], HEX);
  } 
  Serial.println();

  event_res = millis();
  
  while (Serial.available() == 0 && (millis() - event_res) < INTERVAL_RES) {}
  String answer = Serial.readString();
  answer.trim();

  if(answer == "OK"){
    Ok();
  }
  else{
    Error();
  }
  
  mfrc522.PICC_HaltA();

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