const app = require("./app");
const http = require("http");
const cluster = require('cluster');
const os = require('os');
const socketio = require('socket.io');
const normalizePort = val => {
    var port = parseInt(val, 10);

    if(isNaN(port)){
        return val;
    }
    if(port >= 0){
        return port;
    }
    return false;
};

const onError = error => {
    if (error.syscall !== "listen") {
      throw error;
    }
    const bind = typeof port === "string" ? "pipe " + port : "port " + port;
    switch (error.code) {
      case "EACCES":
        console.error(bind + " requires elevated privileges");
        process.exit(1);
        break;
      case "EADDRINUSE":
        console.error(bind + " is already in use");
        process.exit(1);
        break;
      default:
        throw error;
    }
  };
  
  const onListening = () => {
    const addr = server.address();
    const bind = typeof port === "string" ? "pipe " + port : "port " + port;
    debug("Listening on " + bind);
  };

 /* const port = normalizePort(process.env.PORT || "3000");
  app.set("port", port);

const server = http.createServer(app);
server.on("error", onError);
server.on("listening", onListening);
server.listen(port); */



const https = require("https");






/*
if (cluster.isPrimary) {
  var numCPUs=os.cpus().length;
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
}
else{
  app.listen(3000) 
  console.log("listening")
}

if (cluster.isPrimary) {
  var numCPUs=os.cpus().length;
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
}
else{
    https.createServer(options, app)
  .listen(8443, function (req, res) {
    console.log("Server started at port 8443");
  });
  console.log("listening")
}
*/

myserver=http.createServer(app)  

exports.io = socketio(myserver);
 
myserver.listen(process.env.PORT || 4000,
  () => console.log(`Server has started.`));
//https://prod.liveshare.vsengsaas.visualstudio.com/join?A78DE6054239A046DD0815C721EEEF153217


