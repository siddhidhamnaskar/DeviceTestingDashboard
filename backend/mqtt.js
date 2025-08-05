const mqtt = require('mqtt')
const fs = require('fs')
const path = require('path')
const moment = require('moment');
const dotenv=require("dotenv");
const mqttHelper=require("./helpers/mqtt");


dotenv.config();





class MqttHandler {
    constructor(){
        const url = `mqtt://${process.env.MQTT_SERVER}:${process.env.MQTT_PORT}`;
        //console.log(url);
        this.clientmqtt = mqtt.connect(url, {
           username: process.env.MQTT_USER_NAME,
           password: process.env.MQTT_PASSWORD
       });
     
    }
   

    connect(){
       const logPath = path.resolve(__dirname, 'mqtt.log');
   
     
       

       this.clientmqtt.on('error', (err) => {
           console.log(err);
         
           // this.mqttClient.end();
       });

       // Connection callback
       this.clientmqtt.on('connect', () => {
           console.log(`mqtt client connected`);
           this.clientmqtt.subscribe(process.env.MQTT_TOPIC1);
        
       });

       // this.clientmqtt.on('connect', function () {
       //     console.log('connected to cloudmqtt');
       //     clientmqtt.subscribe('GVC/VM/#');
       // });
   
      
   
       this.clientmqtt.on('message',async(topic, payload)=> {
        // console.log(payload.toString());
       
        fs.appendFile(logPath, `[${moment().format()}]\n${payload}\n\n`, err => {
            // console.log(err)
         });
          mqttHelper.parse(payload,this.clientmqtt,topic);
        });
    
        // heartbeat(this.clientmqtt);

       //    return client;
   }
   sendMessage(topic, message) {
        if (this.clientmqtt) {
            console.log(topic, message);
            this.clientmqtt.publish(topic, message);
          
        } else {
            console.error('Error: MQTT client is not initialized.');
        }
    }
    
    sub(topic) {
        this.clientmqtt.subscribe(topic, (err) => {
        });
    }
 
}





// const connect = () => {
//     const client = mqtt.connect(url, conf);
//     const logPath = path.resolve(__dirname, 'mqtt.log')

//     client.on('connect', () => {
//         client.subscribe([process.env.MQTT_TOPIC], () => {
//             console.log(`Subscribed to topic '${process.env.MQTT_TOPIC}'`)
//         })
//         // added one more topic to subscribe 211023
//         client.subscribe([process.env.MQTT_TOPIC_MACHINE], () => {
//             console.log(`Subscribed to topic '${process.env.MQTT_TOPIC_MACHINE}'`)
//         })
        
//     });

//     client.on('message', (topic, payload) => {
//         // DEBUG message - to be removed
//         //console.log('Received Message:', topic, payload.toString())
//         fs.appendFile(logPath, `[${moment().format()}]\n${payload}\n\n`, err => {
//             //console.log(err)
//         });
//         // send topic also
//         mqttHelper.parse(payload, client,topic);

//     });

//     heartbeat(client);

//     return client;
// }

module.exports = MqttHandler;