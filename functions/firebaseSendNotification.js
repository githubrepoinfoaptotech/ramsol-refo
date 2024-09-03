const admin = require('firebase-admin');
const myAccessJson=require("../config/reachfroshure-firebase-adminsdk.json");



admin.initializeApp({
    credential: admin.credential.cert(myAccessJson)
  });

exports.sendNotification=async(obj)=>{
    console.log(obj);
    // const message = {
    //     notification: {
    //       title: 'Status Changed',
    //       body: 'A status has been changed'
    //     },
    //     topic: 'all'
    //   };
    //   admin.messaging().send(message)
    //   .then((response) => {
    //     console.log('Notification sent successfully:', response);
    //     res.send('Notification sent successfully');
    //   })
    //   .catch((err) => {
    //     console.error('Error sending notification:', err);
    //     res.status(500).send('Error sending notification');
    //   });
}