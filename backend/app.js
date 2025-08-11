const express=require('express');
const dotenv=require('dotenv');
const  bodyParser=require('body-parser');
const  cors =require('cors');



const sendToMqttRouter=require("./routes/sendToMqtt");
const mobivendRouter=require("./routes/mobivendRoute");
const userRouter=require("./routes/userRutes");
const deviceConfigRouter=require("./routes/deviceConfig");
const mobivendApiRouter=require("./routes/mobivendRoute");
const mqttMacMappingRouter=require("./routes/mqttMacMapping");
const cityClientSiteRouter=require("./routes/cityClientSite");
const dashboardUserRouter=require("./routes/dashboardUser");


dotenv.config();
// require('./helpers/socketServer');
// require('./src/helpers/trafficSocket');


const app = express();

// Add debugging middleware


app.use(cors());

// Body parsing middleware - order matters
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);


app.use('/mqtt',sendToMqttRouter);
app.use('/mobivend',mobivendRouter);
app.use('/users',userRouter);
app.use('/device-config',deviceConfigRouter);
app.use('/mobivendApi',mobivendApiRouter);
app.use('/mqtt-mac-mapping',mqttMacMappingRouter);
app.use('/city-client-sites',cityClientSiteRouter);
app.use('/dashboard-users',dashboardUserRouter);

// Test endpoint to verify server is working
app.get('/test', (req, res) => {
  res.status(200).json({ message: 'Server is running on port 8080', timestamp: new Date().toISOString() });
});

app.get('/hbt', (req, res) => {
  const clientIP = req.ip.replace('::ffff:', '');

  // Perform a reverse DNS lookup to get the hostname
  dns.reverse(clientIP, (err, hostnames) => {
    if (err) {
      res.send('Unable to determine client hostname');
    } else {
      const clientHostname = hostnames[0] || 'Unknown';
      res.send(`Client Hostname: ${clientHostname}`);
    }
  });
}
);
 
 


module.exports = app;


