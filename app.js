const sequelize = require("./db/db");
const express = require("express");
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const user = require("./models/user");
const pricing = require("./models/pricing");
const admin_routes = require("./routes/admin-routes");
const super_admin_routes = require("./routes/superAdmin-routes");
const recruiter_routes = require("./routes/recruiter-routes");
const auth_routes = require("./routes/auth-routes");
const chat_routes = require("./routes/chat-routes");
const clientCoordinator_routes = require("./routes/clientCoordinator-routes");
const role = require("./models/role");
const multer = require("multer");
const http = require("http");
const cluster = require("cluster");
const os = require("os");
const Sequelize = require("./db/db");
const socketio = require("socket.io");
const { Server } = require("socket.io");
const chatUser = require("./models/chatUser");
const chatUserMessage = require("./models/chatUserMessage");
const recruiterWallets=require("./models/recruiterWallets");
const chatMedia = require("./models/chatMedia");
const recruiterSettings = require("./models/recruiterSettings");
const hiringSupport = require("./models/hiringSupport");
const statusList = require("./models/statusList");
const axios = require("axios").default;
const fs = require("fs");
const AWS = require("aws-sdk");
require("dotenv").config();
const FN=require("./functions/sendReplyMail");
const wallet=require("./functions/messageValidation");
const priceRoutes = require("./routes/pricing-routes");
const sourceRoutes = require("./routes/source-rouetes");
const aiRoutes=require('./routes/ai-connection-routes');
const { Op } = require("sequelize");
const xlsx = require('xlsx');
const https = require("https");
// -----------------------------------
const app = express();
// ----------------------------
var corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};

server = http.createServer(app);

app.use(express.json({ limit: "5000mb" }));
app.use(express.urlencoded({ extended: true, limit: 20000000 }));
app.use(cors());
//const path = require("path");
app.use("/media", express.static(path.join("media")));
app.use("/images", express.static(path.join("images")));
app.use("/zip",express.static(path.join("zip")));
app.use("/resumes",express.static(path.join("resumes")));
app.use("/job_descriptions",express.static(path.join("job_descriptions")));
// ========--------------------=========================---------using router---------==========================--------------
app.use("/api/admin", admin_routes);
app.use("/api/superAdmin", super_admin_routes);
app.use("/api/recruiter", recruiter_routes);
app.use("/api/auth", auth_routes);
app.use("/api/CC", clientCoordinator_routes);
app.use("/api/chat", chat_routes);
app.use("/api/pricing",priceRoutes);
app.use("/api/source",sourceRoutes);

// -----------------------------------------------sequalize-------------------------------------sequalize----------------------

//---------------------ai---------------------------------

app.use("/api/AI/",aiRoutes);
//-------------------------------------

app.post("/addrole", async(req, res) => {
  const workbook = xlsx.readFile('statusLists.csv', { cellText: false, cellDates: false });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
// Convert the CSV data to JSON
    const data = xlsx.utils.sheet_to_json(sheet);
      console.log(data);
  for(i=0;i<data.length;i++)
    {
      await statusList.create(data[i]);
    }
    const workbook2 = xlsx.readFile('roles.csv', { cellText: false, cellDates: false });
  const sheetName2 = workbook2.SheetNames[0];
  const sheet2 = workbook2.Sheets[sheetName2];
    const data2 = xlsx.utils.sheet_to_json(sheet2);
  for(i=0;i<data2.length;i++)
    {
      await role.create(data2[i]);
    }
    res.send("done");
});
app.get("/getAllRoutes", async (req, res) => {
  try {
    const data = await getRoutes(app);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving routes', error: error.message });
  }
});
app.post("/testUser", async (req, res) => {
  const { email, password } = req.body;
  const salt = await bcrypt.genSalt(Number(process.env.SALT));
  console.log(salt);
  const Hash = await bcrypt.hash(password, salt);
  user
    .create({
      email: email,
      roleName: "SUPERADMIN",
      password: Hash,
    })
    .then(() => {
      res.send("success");
    });
});

// app.post("/createRole", async (req, res) => {
//   const { roleName,title } = req.body;
//   role
//     .create({
//       roleName,
//       title
//     })
//     .then(() => {
//       res.send("success");
//     });
// });


app.get("/",async(req,res)=>{
  console.log("in");
  res.send("helloworld");
});


http.createServer(app)
  .listen(8443, function (req, res) {
 console.log(req);
console.log(res);
   console.log("Server started at port 8443");
});


sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("synced db.");
})  
  .catch((err) => {
    console.log(err);
}); 



  



// Function to get all routes from the app
function getRoutes(app, baseUrl = '') {
  const routes = [];
  function getorgRoute(path){
    var mypath=path.replace("^\\","")
mypath=mypath.replace("\\","")
mypath=mypath.replace("\\/","")
mypath=mypath.replace("?(?=\\/|$)","")
  return mypath;
  }

  app._router.stack.forEach(middleware => {
    if (middleware.route) { // Route middleware
      const method = Object.keys(middleware.route.methods)[0].toUpperCase();
      const path = getorgRoute(baseUrl + middleware.route.path);
      routes.push({ method, path });
    } else if (middleware.name === 'router') { // Router middleware
      const basePath = middleware.regexp.source.includes('(?:/)?') ? baseUrl : baseUrl + middleware.regexp.source.replace(/^\/|\/$/, '');
      middleware.handle.stack.forEach(handler => {
        if (handler.route) {
          const method = Object.keys(handler.route.methods)[0].toUpperCase();
          const path = getorgRoute(basePath + handler.route.path);
          routes.push({ method, path });
        } else if (handler.name === 'router') {
          const nestedRoutes = getRoutes(handler.handle, basePath);
          routes.push(...nestedRoutes);
        }
      });
    }
  });

  return routes;
}


// module.exports = io;
