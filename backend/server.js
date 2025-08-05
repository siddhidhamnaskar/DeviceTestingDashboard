require('@babel/register');
/* eslint-disable no-console */
const chalk = require('chalk');
const dotenv = require('dotenv');
const cluster = require('cluster');
const numCores = require('os').cpus().length;
const app = require('./app');
const MqttHandler = require('./mqtt');
const MqttClient=new MqttHandler();
const fs = require('fs');
const path = require('path');



// Handle uncaught exceptions
process.on('uncaughtException', (uncaughtExc) => {
  // Won't execute
  console.log(chalk.bgRed('UNCAUGHT EXCEPTION! 💥 Shutting down...'));
  console.log('uncaughtException Err::', uncaughtExc);
  console.log('uncaughtException Stack::', JSON.stringify(uncaughtExc.stack));
  process.exit(1);
});

// Setup number of worker processes to share port which will be defined while setting up server
const workers = [];
const setupWorkerProcesses = () => {
  // Read number of cores on system
  console.log(`Master cluster setting up ${numCores} workers`);

  // Iterate on number of cores need to be utilized by an application
  // Current example will utilize all of them
  for (let i = 0; i < numCores; i++) {
    // Creating workers and pushing reference in an array
    // these references can be used to receive messages from workers
    workers.push(cluster.fork());

    // Receive messages from worker process
    workers[i].on('message', function (message) {
      console.log(message);
    });
  }

  


  // Process is clustered on a core and process id is assigned
  cluster.on('online', function (worker) {
    console.log(`Worker ${worker.process.pid} is listening`);
  });

  // If any of the worker process dies then start a new one by simply forking another one
  cluster.on('exit', function (worker, code, signal) {
    console.log(
      `Worker ${worker.process.pid} died with code: ${code}, and signal: ${signal}`
    );
    console.log('Starting a new worker');
    cluster.fork();
    workers.push(cluster.fork());
    // Receive messages from worker process
    workers[workers.length - 1].on('message', function (message) {
      console.log(message);
    });
  });
};

// Setup an express server and define port to listen all incoming requests for this application
// start running at APP_PORT (if defined) or 3000 
// display two messages
const setUpExpress = () => {
  dotenv.config({ path: '.env' });

  const port = process.env.APP_PORT || 8080;

  const server = app.listen(port, () => {
    console.log(`App running on port ${chalk.greenBright(port)}...`);
    console.log ("vinay - 12Oct23V2")
  });

  server.on('error', (err) => {
    // Log error
    fs.appendFile(logPath, `${new Date().toISOString()} - Error: ${err.message}\n`, 'utf8', (fileErr) => {
        if (fileErr) console.error('Error writing to log file:', fileErr);
    });
});

  // In case of an error
  app.on('error', (appErr, appCtx) => {
    console.error('app error', appErr.stack);
    console.error('on url', appCtx.req.url);
    console.error('with headers', appCtx.req.headers);
  });

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err) => {
    console.log(chalk.bgRed('UNHANDLED REJECTION! 💥 Shutting down...'));
    console.log(err.name, err.message);
    // Close server & exit process
    server.close(() => {
      process.exit(1);
    });
  });

  process.on('SIGTERM', () => {
    console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
    server.close(() => {
      console.log('💥 Process terminated!');
    });
  });
};

// Setup server either with clustering or without it
// as this is called with false, so next step is setUpExpress and then MQTT and then daily_schedule

const setupServer = (isClusterRequired) => {
  // If it is a master process then call setting up worker process
  if (isClusterRequired && cluster.isMaster) {
    setupWorkerProcesses();
  } else {
    // Setup server configurations and share port address for incoming requests
    setUpExpress();
    MqttClient.connect();
  }

};


// I think this is entry point of code
// as Siddi mentioned that process.env.NODE_ENV is not define any where
// so we call setupServer(false)

if (process.env.NODE_ENV === 'production') {
  setupServer(true);
} else {
  setupServer(false);
}
