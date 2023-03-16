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

#define RST_PIN  9      // Define reset pin
#define SS_PIN  10      // Define slave select pin

MFRC522 mfrc522(SS_PIN, RST_PIN); // new object 

void setup() {
  Serial.begin(9600);
  SPI.begin();
  mfrc522.PCD_Init();     // initialize module reader
  pinMode(6, OUTPUT);
}

void loop() {
  if ( ! mfrc522.PICC_IsNewCardPresent()) // when there isn't a card
    return;
  
  if ( ! mfrc522.PICC_ReadCardSerial())   // when de card cannot be read
    return;
    
  for (byte i = 0; i < mfrc522.uid.size; i++) { // read and print card information
    if (mfrc522.uid.uidByte[i] < 0x10){
      Serial.print(" 0");
      }
      else{ 
      Serial.print(" ");
      }
    Serial.print(mfrc522.uid.uidByte[i], HEX);
  } 
  Serial.println();
  
  mfrc522.PICC_HaltA();// stops card communication

  delay(1000);
}