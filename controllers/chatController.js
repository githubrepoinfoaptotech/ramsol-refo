//models

const chatUser = require("../models/chatUser");
const chatUserMessage = require("../models/chatUserMessage");
const chatMedia = require("../models/chatMedia");
const recruiterSettings = require("../models/recruiterSettings");
const candidateStatus = require("../models/myCandidateStatus");
const candidateDetails = require("../models/candidateDetail");
const candidate = require("../models/candidate");
const recruiterMessageActivity = require("../models/recruiterMessageActivity");
const recruiterWallet = require("../models/recruiterWallets");
const dashboard = require("../models/dashboard");
//
const fs = require("fs");
const AWS = require("aws-sdk");
const Sequelize = require("../db/db");
const { QueryTypes, Op } = require("sequelize");
const http = require("axios").default;
const https = require("https");
var FormData = require("form-data");
const sequelize = require("sequelize");
require("dotenv").config();

// const FB_BASE_URL = "https://graph.facebook.com/v15.0/";
// const PHONE_NUMBER_ID = "109715518677814";
// const WHATSAPP_TOKEN =
//   "EAAH0kXABQFcBANlP5AYnWHZADc4JOweZAxqLPPbke5MLZBeTNrUwxOXLZCUxE5ueOZCbyu8wqUAd7KSGeF7xC3gpqi9ssnrkmIPYLBrF7LT7lHZA7rJTbcIjnpm7bZBySlV6gMP2PrKvvlZATZAeNoiZAwMan5MAJBINz7KKRKsHQn62X6ZAZC5JZBBND";
// https://prod.liveshare.vsengsaas.visualstudio.com/join?74583C0D52A6AED80D0034628A3CC31F4402
exports.getChatUsers = async (req, res) => {
  try {
    const cudata = await chatUser.findAll({
      where: { mainId: req.mainId },
      include: [
        {
          model: chatUserMessage,
          limit: 1,
          order: [["createdAt", "DESC"]],
          required: false,
        },
      ],
      order: [["lastUpdated", "DESC"]],
    });

    res.status(200).json({
      message: "Success",
      status: true,
      chatdata: cudata,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error", status: false });
  }
};
exports.getOneChatUser = async (req, res) => {
  try {
    const cudata = await chatUser.findAll({
      where: { id: req.body.chatUserId },
      include: [
        {
          model: chatUserMessage,
          limit: 1,
          order: [["createdAt", "DESC"]],
          required: false,
        },
      ],
      order: [["lastUpdated", "DESC"]],
    });
    res.status(200).json({
      message: "Success",
      status: true,
      chatdata: cudata,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error", status: false });
  }
};
exports.getChatUserMessages = async (req, res) => {

  try {
    var settings = await recruiterSettings.findOne({
      where: { mainId: req.mainId },
    });
    if (settings) {
      const FB_BASE_URL = settings.fbBaseUrl;
      const PHONE_NUMBER_ID = settings.phoneNumberId;
      const WHATSAPP_TOKEN = settings.waToken;
      await chatUserMessage
        .update(
          { status: "read" },
          {
            where: {
              chatUserId: req.query["user_id"],
              status: { [Op.ne]: "read" },
              to: null,
            },
            order: [["createdAt", "ASC"]],
          }
        )
        .then(async (data) => {
          if (data) {
            await chatUserMessage
              .findAll({
                where: { chatUserId: req.query["user_id"] },
                order: [["createdAt", "ASC"]],
                include: [
                  chatUser,
                  {
                    model: chatMedia,
                    required: false,
                  },
                ],
              })
              .then(async (updatedValues) => {
                res.status(200).json({
                  message: "Success",
                  status: true,
                  data: updatedValues,
                });
              })
              .catch((e) => {
                console.log(e);
                res.status(500).json({ status: false, message: "Error" });
              });
          }
        })
        .catch((e) => {
          console.log(e);
          res.status(500).json({ status: false, message: "Error" });
        });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, mesage: "Error" });
  }
};
exports.sendMessage = async (req, res) => {
  await chatUser
    .findOne({
      where: { mainId: req.mainId, id: req.body.chatUserId },
    })
    .then(async (data) => {
      var settings = await recruiterSettings.findOne({
        where: { mainId: req.mainId },
      });
      if (settings) {
        const FB_BASE_URL = settings.fbBaseUrl;
        const PHONE_NUMBER_ID = settings.phoneNumberId;
        const WHATSAPP_TOKEN = settings.waToken;
        if (data) {
          http
            .post(
              FB_BASE_URL + PHONE_NUMBER_ID + "/messages",
              {
                messaging_product: "whatsapp",
                preview_url: false,
                recipient_type: "individual",
                to: data.phoneNumber,
                type: "text",
                text: { body: req.body.message },
              },
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + WHATSAPP_TOKEN,
                },
              }
            )
            .then((response) => {
              if (response.data.messages) {
                const message_id = response.data.messages[0].id;
                // database.update();
                // resolve(message_id);
                chatUserMessage
                  .create({
                    chatUserId: data.id,
                    messageId: message_id,
                    to: data.phoneNumber,
                    recruiterId: req.recruiterId,
                    mainId: req.mainId,
                    timestamp: Math.floor(Date.now() / 1000),
                    status: "delivered",
                    caption: req.body.message,
                    type: "text",
                    PHONE_NUMBER_ID: PHONE_NUMBER_ID,
                  })
                  .then((data) => {
                    res.status(200).json({ status: true, message: "Sent" });
                  })
                  .catch((error) => {
                    res.status(500).json({ status: false, mesage: "Error2" });
                  });
              }
            })
            .catch((error) => {
              console.log(error);
              res.status(500).json({ status: false, mesage: "Error1" });
            });
        } else {
          await chatUser
            .create({
              phoneNumber: req.body.phoneNumber,
              name: req.body.name,
              recruiterId: req.recruiterId,
              mainId: req.mainId,
              PHONE_NUMBER_ID: PHONE_NUMBER_ID,
            })
            .then((cdata) => {
              http
                .post(
                  FB_BASE_URL + PHONE_NUMBER_ID + "/messages",
                  {
                    messaging_product: "whatsapp",
                    preview_url: false,
                    recipient_type: "individual",
                    to: req.body.phoneNumber,
                    type: "text",
                    text: { body: req.body.message },
                  },
                  {
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: "Bearer " + WHATSAPP_TOKEN,
                    },
                  }
                )
                .then((response) => {
                  if (response.data.messages) {
                    const message_id = response.data.messages[0].id;
                    // database.update();
                    // resolve(message_id);
                    chatUserMessage
                      .create({
                        chatUserId: cdata.id,
                        messageId: message_id,
                        to: req.body.phoneNumber,
                        recruiterId: req.recruiterId,
                        mainId: req.mainId,
                        timestamp: Math.floor(Date.now() / 1000),
                        status: "delivered",
                        caption: req.body.message,
                        type: "text",
                        PHONE_NUMBER_ID: PHONE_NUMBER_ID,
                      })
                      .then((data) => {
                        res.status(200).json({ status: true, message: "Sent" });
                      })
                      .catch((error) => {
                        res
                          .status(500)
                          .json({ status: false, mesage: "Error" });
                      });
                  } else {
                    res.status(200).json({ status: true, message: "Not Sent" });
                  }
                })
                .catch((error) => {
                  res.status(500).json({ status: false, mesage: "Error" });
                });
            });
        }
      } else {
        res.status(200).json({ status: false, messAGE: "TRY AGAIN!!" });
      }
    })
    .catch((e) => {
      console.log(e);
      res.status(500).json({ status: false, mesage: "Error1" });
    });
};
//

///
exports.sendTemplateMessage = async (req, res) => {
    if(req.body.sendMessage==true){
    const phoneNumber = req.body.phone_number;
    const templateName = req.body.template_name;
    const vars = req.body.vars;
    const message = req.body.message;
    const candidate_name = req.body.candidate_name;
    var settings = await recruiterSettings.findOne({
      where: { mainId: req.mainId },
    });
    if (settings) {
      const FB_BASE_URL = settings.fbBaseUrl;
      const PHONE_NUMBER_ID = settings.phoneNumberId;
      const WHATSAPP_TOKEN = settings.waToken;
      if (templateName == "1st_interview_round") {
        await chatUser
          .findOne({
            where: {
              mainId: req.mainId,
              phoneNumber: phoneNumber,
              PHONE_NUMBER_ID: PHONE_NUMBER_ID,
            },
          })
          .then(async (data) => {

            if (data != null) {
              var req_body = {
                messaging_product: "whatsapp",
                to: phoneNumber,
                type: "template",
                template: {
                  name: templateName,
                  language: {
                    policy: "deterministic",
                    code: "en_US",
                  },
                  components: [
                    {
                      type: "body",
                      parameters: [],
                    },
                  ],
                },
              };

              if (vars) {
                vars.forEach((var1) => {
                  req_body.template.components[0].parameters.push({
                    type: "text",
                    text: var1,
                  });
                });
              }
              http
                .post(FB_BASE_URL + PHONE_NUMBER_ID + "/messages", req_body, {
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + WHATSAPP_TOKEN,
                  },
                })
                .then((response) => {

                  if (response.data.messages) {
                    const message_id = response.data.messages[0].id;

                    // database.update();
                    //   resolve(message_id);

                    //console.log(message_id);

                    chatUserMessage
                      .create({
                        chatUserId: data.id,
                        messageId: message_id,
                        to: phoneNumber,
                        recruiterId: req.recruiterId,
                        mainId: req.mainId,
                        timestamp: Math.floor(Date.now() / 1000),
                        status: "delivered",
                        caption: message,
                        type: "text",
                        template: templateName,
                        vars: vars,
                        PHONE_NUMBER_ID: PHONE_NUMBER_ID,
                        candidateId: req.body.candidateId,
                      })
                      .then(async (data_val) => {
                      // var hist_data = await messagehistory(req, data_val);  changed data candidate wise
                        var can_data = await candidate.findOne({
                          where: { id: req.body.candidateId, statusCode: 303 },
                        });
                        if (can_data) {
                          await can_data.update({
                            statusCode: 3031,
                          });
                          var can_status = await candidateStatus.findOne({
                            where: {
                              candidateId: req.body.candidateId,
                              statusCode: 3031,
                            },
                          });
                          if (!can_status) {
                            await candidateStatus.create({
                              candidateId: req.body.candidateId,
                              statusCode: 3031,
                              mainId: req.mainId,
                              createdBy: req.userId,
                              updatedBy: req.userId,
                            });
                            res
                              .status(200)
                              .json({
                                status: true,
                                message: "Sent",
                              // isNew: hist_data,                                   changed data candidate wise
                              });
                          } else {
                            res
                              .status(200)
                              .json({
                                status: false,
                                message: "Already sent to candidate!!!",
                              });
                          }
                        }
                      })
                      .catch((error) => {
                        console.log(error);
                        res.status(500).json({ status: false, mesage: "Error" });
                      });
                  }
                })
                .catch((error) => {
                  console.log(error);
                  res.status(500).json({ status: false, mesage: "Error1" });
                });
            }
          })
          .catch((e) => {
            console.log(e);
            res.status(500).json({ status: false, mesage: "Error1" });
          });
      } else if (templateName == "general_message") {

        await chatUser
          .findOne({
            where: {
              mainId: req.mainId,
              phoneNumber: phoneNumber,
              PHONE_NUMBER_ID: PHONE_NUMBER_ID,
            },
          })
          .then(async (data) => {

            if (data != null) {
              var req_body = {
                messaging_product: "whatsapp",
                to: phoneNumber,
                type: "template",
                template: {
                  name: templateName,
                  language: {
                    policy: "deterministic",
                    code: "en_US",
                  },
                  components: [
                    {
                      type: "body",
                      parameters: [],
                    },
                  ],
                },
              };

              if (vars) {
                vars.forEach((var1) => {
                  req_body.template.components[0].parameters.push({
                    type: "text",
                    text: var1,
                  });
                });
              }
              http
                .post(FB_BASE_URL + PHONE_NUMBER_ID + "/messages", req_body, {
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + WHATSAPP_TOKEN,
                  },
                })
                .then((response) => {

                  if (response.data.messages) {
                    const message_id = response.data.messages[0].id;

                    // database.update();
                    //   resolve(message_id);


                    chatUserMessage
                      .create({
                        chatUserId: data.id,
                        messageId: message_id,
                        to: phoneNumber,
                        recruiterId: req.recruiterId,
                        mainId: req.mainId,
                        timestamp: Math.floor(Date.now() / 1000),
                        status: "delivered",
                        caption: message,
                        type: "text",
                        template: templateName,
                        vars: vars,
                        PHONE_NUMBER_ID: PHONE_NUMBER_ID,
                        candidateId: req.body.candidateId,
                      })
                      .then(async (data) => {

                      // var hist_data = await messagehistory(req, data_val);  changed data candidate wise
                        res
                          .status(200)
                          .json({
                            status: true,
                            message: "Sent",
                          //  isNew: hist_data,                      changed data candidate wise
                          });
                      })
                      .catch((error) => {
                        console.log(error);
                        res.status(500).json({ status: false, mesage: "Error" });
                      });
                  }
                })
                .catch((error) => {
                  res.status(500).json({ status: false, mesage: "Error1" });
                });
            }
          })
          .catch((e) => {
            console.log(e);
            res.status(500).json({ status: false, mesage: "Error1" });
          });
      } else if (templateName == "initial_interview_rounds") {
        await chatUser
          .findOne({
            where: {
              mainId: req.mainId,
              phoneNumber: phoneNumber,
              PHONE_NUMBER_ID: PHONE_NUMBER_ID,
            },
          })
          .then(async (data) => {

            if (data != null) {
              var req_body = {
                messaging_product: "whatsapp",
                to: phoneNumber,
                type: "template",
                template: {
                  name: templateName,
                  language: {
                    policy: "deterministic",
                    code: "en_US",
                  },
                  components: [
                    {
                      type: "body",
                      parameters: [],
                    },
                  ],
                },
              };

              if (vars) {
                vars.forEach((var1) => {
                  req_body.template.components[0].parameters.push({
                    type: "text",
                    text: var1,
                  });
                });
              }
              http
                .post(FB_BASE_URL + PHONE_NUMBER_ID + "/messages", req_body, {
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + WHATSAPP_TOKEN,
                  },
                })
                .then((response) => {

                  if (response.data.messages) {
                    const message_id = response.data.messages[0].id;

                    // database.update();
                    //   resolve(message_id);

                    chatUserMessage
                      .create({
                        chatUserId: data.id,
                        messageId: message_id,
                        to: phoneNumber,
                        recruiterId: req.recruiterId,
                        mainId: req.mainId,
                        timestamp: Math.floor(Date.now() / 1000),
                        status: "delivered",
                        caption: message,
                        type: "text",
                        template: templateName,
                        vars: vars,
                        PHONE_NUMBER_ID: PHONE_NUMBER_ID,
                        candidateId: req.body.candidateId,
                      })
                      .then(async (data) => {

                    //   var hist_data = await messagehistory(req, data);     changed data candidate wise
                        var can_data = await candidate.findOne({
                          where: { id: req.body.candidateId, statusCode: 3031 },
                        });
                        if (can_data) {
                          await can_data.update({
                            statusCode: 304,
                          });
                          var can_status = await candidateStatus.findOne({
                            where: {
                              candidateId: req.body.candidateId,
                              statusCode: 304,
                            },
                          });
                          if (!can_status) {
                            await candidateStatus.create({
                              candidateId: req.body.candidateId,
                              statusCode: 304,
                              mainId: req.mainId,
                              createdBy: req.userId,
                              updatedBy: req.userId,
                            });
                            res
                              .status(200)
                              .json({
                                status: true,
                                message: "Sent",
                              //  isNew: hist_data,    changed data candidate wise
                              });
                          } else {
                            res
                              .status(200)
                              .json({
                                status: false,
                                message: "Already sent to candidate!!!",
                              });
                          }
                        }
                        else{
                        //  var hist_data = await messagehistory(req, data); changed data candidate wise
                          res
                          .status(200)
                          .json({
                            status: true,
                            message: "Sent",
                          // isNew: hist_data, changed data candidate wise
                          });
                        }
                      })
                      .catch((error) => {
                        res.status(500).json({ status: false, mesage: "Error" });
                      });
                  }
                })
                .catch((error) => {
                  console.log(error);
                  res.status(500).json({ status: false, mesage: "Error1" });
                });
            }
          })
          .catch((e) => {
            console.log(e);
            res.status(500).json({ status: false, mesage: "Error1" });
          });
      } else if (templateName == "final_interview_round") {
        await chatUser
          .findOne({
            where: {
              mainId: req.mainId,
              phoneNumber: phoneNumber,
              PHONE_NUMBER_ID: PHONE_NUMBER_ID,
            },
          })
          .then(async (data) => {

            if (data != null) {
              var req_body = {
                messaging_product: "whatsapp",
                to: phoneNumber,
                type: "template",
                template: {
                  name: templateName,
                  language: {
                    policy: "deterministic",
                    code: "en_US",
                  },
                  components: [
                    {
                      type: "body",
                      parameters: [],
                    },
                  ],
                },
              };

              if (vars) {
                vars.forEach((var1) => {
                  req_body.template.components[0].parameters.push({
                    type: "text",
                    text: var1,
                  });
                });
              }
              http
                .post(FB_BASE_URL + PHONE_NUMBER_ID + "/messages", req_body, {
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + WHATSAPP_TOKEN,
                  },
                })
                .then((response) => {

                  if (response.data.messages) {
                    const message_id = response.data.messages[0].id;

                    // database.update();
                    //   resolve(message_id);


                    chatUserMessage
                      .create({
                        chatUserId: data.id,
                        messageId: message_id,
                        to: phoneNumber,
                        recruiterId: req.recruiterId,
                        mainId: req.mainId,
                        timestamp: Math.floor(Date.now() / 1000),
                        status: "delivered",
                        caption: message,
                        type: "text",
                        template: templateName,
                        vars: vars,
                        PHONE_NUMBER_ID: PHONE_NUMBER_ID,
                        candidateId: req.body.candidateId,
                      })
                      .then(async (data) => {
                      //  var hist_data = await messagehistory(req, data);     changed data candidate wise
                        var can_data = await candidate.findOne({
                          where: { id: req.body.candidateId, statusCode: 304 },
                        });
                        if (can_data) {
                          await can_data.update({
                            statusCode: 3041,
                          });
                          var can_status = await candidateStatus.findOne({
                            where: {
                              candidateId: req.body.candidateId,
                              statusCode: 3041,
                            },
                          });
                          if (!can_status) {
                            await candidateStatus.create({
                              candidateId: req.body.candidateId,
                              statusCode: 3041,
                              mainId: req.mainId,
                              createdBy: req.userId,
                              updatedBy: req.userId,
                            });
                            res
                              .status(200)
                              .json({
                                status: true,
                                message: "Sent",
                            //   isNew: hist_data,              changed data candidate wise
                              });
                          } else {
                            res
                              .status(200)
                              .json({
                                status: false,
                                message: "Already sent to candidate!!!",
                              });
                          }
                        }
                      })
                      .catch((error) => {
                        console.log(error);
                        res.status(500).json({ status: false, mesage: "Error" });
                      });
                  }
                })
                .catch((error) => {
                  console.log(error);
                  res.status(500).json({ status: false, mesage: "Error1" });
                });
            }
          })
          .catch((e) => {
            console.log(e);
            res.status(500).json({ status: false, mesage: "Error1" });
          });
      } else if (templateName == "document_collect") {
        await chatUser
          .findOne({
            where: {
              mainId: req.mainId,
              phoneNumber: phoneNumber,
              PHONE_NUMBER_ID: PHONE_NUMBER_ID,
            },
          })
          .then(async (data) => {

            if (data != null) {
              var req_body = {
                messaging_product: "whatsapp",
                to: phoneNumber,
                type: "template",
                template: {
                  name: templateName,
                  language: {
                    policy: "deterministic",
                    code: "en_US",
                  },
                  components: [
                    {
                      type: "body",
                      parameters: [],
                    },
                  ],
                },
              };

              if (vars) {
                vars.forEach((var1) => {
                  req_body.template.components[0].parameters.push({
                    type: "text",
                    text: var1,
                  });
                });
              }
              http
                .post(FB_BASE_URL + PHONE_NUMBER_ID + "/messages", req_body, {
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + WHATSAPP_TOKEN,
                  },
                })
                .then((response) => {

                  if (response.data.messages) {
                    const message_id = response.data.messages[0].id;

                    // database.update();
                    //   resolve(message_id);


                    chatUserMessage
                      .create({
                        chatUserId: data.id,
                        messageId: message_id,
                        to: phoneNumber,
                        recruiterId: req.recruiterId,
                        mainId: req.mainId,
                        timestamp: Math.floor(Date.now() / 1000),
                        status: "delivered",
                        caption: message,
                        type: "text",
                        template: templateName,
                        vars: vars,
                        PHONE_NUMBER_ID: PHONE_NUMBER_ID,
                        candidateId: req.body.candidateId,
                      })
                      .then(async (data) => {
                  //      var hist_data = await messagehistory(req, data);           changed data candidate wise
                        var can_data = await candidate.findOne({
                          where: {
                            id: req.body.candidateId,
                            statusCode: { [Op.or]: [3041, 304] },
                          },
                        });

                        if (can_data) {
                          await can_data.update({
                            statusCode: 305,
                          });
                          var can_status = await candidateStatus.findOne({
                            where: {
                              candidateId: req.body.candidateId,
                              statusCode: 305,
                            },
                          });
                          if (!can_status) {
                            await candidateStatus.create({
                              candidateId: req.body.candidateId,
                              statusCode: 305,
                              mainId: req.mainId,
                              createdBy: req.userId,
                              updatedBy: req.userId,
                            });
                            res
                              .status(200)
                              .json({
                                status: true,
                                message: "Sent",
                        //        isNew: hist_data,           changed data candidate wise
                              });
                          } else {
                            res
                              .status(200)
                              .json({
                                status: false,
                                message: "Already sent to candidate!!!",
                              });
                          }
                        } else {
                          console.log("not found");
                        }
                      })
                      .catch((error) => {
                        console.log(error);
                        res.status(500).json({ status: false, mesage: "Error" });
                      });
                  }
                })
                .catch((error) => {
                  console.log(error);
                  res.status(500).json({ status: false, mesage: "Error1" });
                });
            }
          })
          .catch((e) => {
            console.log(e);
            res.status(500).json({ status: false, mesage: "Error1" });
          });
      } else if (templateName == "salary_breakup_shared_confirmation") {
        console.log("in");
        await chatUser
          .findOne({
            where: {
              mainId: req.mainId,
              phoneNumber: phoneNumber,
              PHONE_NUMBER_ID: PHONE_NUMBER_ID,
            },
          })
          .then(async (data) => {

            if (data != null) {
              var req_body = {
                messaging_product: "whatsapp",
                to: phoneNumber,
                type: "template",
                template: {
                  name: templateName,
                  language: {
                    policy: "deterministic",
                    code: "en_US",
                  },
                  components: [
                    {
                      type: "body",
                      parameters: [],
                    },
                  ],
                },
              };

              if (vars) {
                vars.forEach((var1) => {
                  req_body.template.components[0].parameters.push({
                    type: "text",
                    text: var1,
                  });
                });
              }
              http
                .post(FB_BASE_URL + PHONE_NUMBER_ID + "/messages", req_body, {
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + WHATSAPP_TOKEN,
                  },
                })
                .then((response) => {

                  if (response.data.messages) {
                    const message_id = response.data.messages[0].id;

                    // database.update();
                    //   resolve(message_id);

                    chatUserMessage
                      .create({
                        chatUserId: data.id,
                        messageId: message_id,
                        to: phoneNumber,
                        recruiterId: req.recruiterId,
                        mainId: req.mainId,
                        timestamp: Math.floor(Date.now() / 1000),
                        status: "delivered",
                        caption: message,
                        type: "text",
                        template: templateName,
                        vars: vars,
                        PHONE_NUMBER_ID: PHONE_NUMBER_ID,
                        candidateId: req.body.candidateId,
                      })
                      .then(async (data) => {
              //         var hist_data = await messagehistory(req, data);         changed data candidate wise
                        var can_data = await candidate.findOne({
                          where: { id: req.body.candidateId, statusCode: 305 },
                        });
                        if (can_data) {
                          await can_data.update({
                            statusCode: 307,
                          });
                          var can_status = await candidateStatus.findOne({
                            where: {
                              candidateId: req.body.candidateId,
                              statusCode: 306,
                            },
                          });
                          if (!can_status) {
                            await candidateStatus.create({
                              candidateId: req.body.candidateId,
                              statusCode: 306,
                              mainId: req.mainId,
                              createdBy: req.userId,
                              updatedBy: req.userId,
                            });
                            await candidateStatus.create({
                              candidateId: req.body.candidateId,
                              statusCode: 307,
                              mainId: req.mainId,
                              createdBy: req.userId,
                              updatedBy: req.userId,
                            });
                            res
                              .status(200)
                              .json({
                                status: true,
                                message: "Sent",
                          //      isNew: hist_data,        changed data candidate wise
                              });
                          } else {
                            res
                              .status(200)
                              .json({
                                status: false,
                                message: "Already sent to candidate!!!",
                              });
                          }
                        }
                      })
                      .catch((error) => {
                        console.log(error);
                        res.status(500).json({ status: false, mesage: "Error" });
                      });
                  }
                })
                .catch((error) => {
                  console.log(error);
                  res.status(500).json({ status: false, mesage: "Error1" });
                });
            }
          })
          .catch((e) => {
            console.log(e);
            res.status(500).json({ status: false, mesage: "Error1" });
          });
      } else if (templateName == "offer_released_confirmation") {
        await chatUser
          .findOne({
            where: {
              mainId: req.mainId,
              phoneNumber: phoneNumber,
              PHONE_NUMBER_ID: PHONE_NUMBER_ID,
            },
          })
          .then(async (data) => {

            if (data != null) {
              var req_body = {
                messaging_product: "whatsapp",
                to: phoneNumber,
                type: "template",
                template: {
                  name: templateName,
                  language: {
                    policy: "deterministic",
                    code: "en_US",
                  },
                  components: [
                    {
                      type: "body",
                      parameters: [],
                    },
                  ],
                },
              };

              if (vars) {
                vars.forEach((var1) => {
                  req_body.template.components[0].parameters.push({
                    type: "text",
                    text: var1,
                  });
                });
              }
              http
                .post(FB_BASE_URL + PHONE_NUMBER_ID + "/messages", req_body, {
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + WHATSAPP_TOKEN,
                  },
                })
                .then((response) => {

                  if (response.data.messages) {
                    const message_id = response.data.messages[0].id;

                    // database.update();
                    //   resolve(message_id);


                    chatUserMessage
                      .create({
                        chatUserId: data.id,
                        messageId: message_id,
                        to: phoneNumber,
                        recruiterId: req.recruiterId,
                        mainId: req.mainId,
                        timestamp: Math.floor(Date.now() / 1000),
                        status: "delivered",
                        caption: message,
                        type: "text",
                        template: templateName,
                        vars: vars,
                        PHONE_NUMBER_ID: PHONE_NUMBER_ID,
                        candidateId: req.body.candidateId,
                      })
                      .then(async (data) => {
                  //     var hist_data = await messagehistory(req, data);         changed data candidate wise
                        var can_data = await candidate.findOne({
                          where: { id: req.body.candidateId, statusCode: 307 },
                        });
                        if (can_data) {
                          await can_data.update({
                            statusCode: 308,
                          });
                          var can_status = await candidateStatus.findOne({
                            where: {
                              candidateId: req.body.candidateId,
                              statusCode: 308,
                            },
                          });
                          if (!can_status) {
                            await candidateStatus.create({
                              candidateId: req.body.candidateId,
                              statusCode: 308,
                              mainId: req.mainId,
                              createdBy: req.userId,
                              updatedBy: req.userId,
                            });
                            res
                              .status(200)
                              .json({
                                status: true,
                                message: "Sent",
                            //   isNew: hist_data,                         changed data candidate wise
                              });
                          } else {
                            res
                              .status(200)
                              .json({
                                status: false,
                                message: "Already sent to candidate!!!",
                              });
                          }
                        }
                      })
                      .catch((error) => {
                        console.log(error);
                        res.status(500).json({ status: false, mesage: "Error" });
                      });
                  }
                })
                .catch((error) => {
                  console.log(error);
                  res.status(500).json({ status: false, mesage: "Error1" });
                });
            }
          })
          .catch((e) => {
            console.log(e);
            res.status(500).json({ status: false, mesage: "Error1" });
          });
      } /*
      else if (templateName == "candidate_no_response") {
        await chatUser
          .findOne({
            where: {
              mainId: req.mainId,
              phoneNumber: phoneNumber,
              PHONE_NUMBER_ID: PHONE_NUMBER_ID,
            },
          })
          .then(async (data) => {
            //console.log(data);

            if (data != null) {
              var req_body = {
                messaging_product: "whatsapp",
                to: phoneNumber,
                type: "template",
                template: {
                  name: templateName,
                  language: {
                    policy: "deterministic",
                    code: "en_US",
                  },
                  components: [
                    {
                      type: "body",
                      parameters: [],
                    },
                  ],
                },
              };

              if (vars) {
                vars.forEach((var1) => {
                  req_body.template.components[0].parameters.push({
                    type: "text",
                    text: var1,
                  });
                });
              }
              http
                .post(FB_BASE_URL + PHONE_NUMBER_ID + "/messages", req_body, {
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + WHATSAPP_TOKEN,
                  },
                })
                .then((response) => {
                  //  console.log(response.data.messages);

                  if (response.data.messages) {
                    const message_id = response.data.messages[0].id;

                    // database.update();
                    //   resolve(message_id);

                    //console.log(message_id);

                    chatUserMessage
                      .create({
                        chatUserId: data.id,
                        messageId: message_id,
                        to: phoneNumber,
                        recruiterId: req.recruiterId,
                        mainId: req.mainId,
                        timestamp: Math.floor(Date.now() / 1000),
                        status: "delivered",
                        caption: message,
                        type: "text",
                        template: templateName,
                        vars: vars,
                        PHONE_NUMBER_ID: PHONE_NUMBER_ID,
                        candidateId:req.body.candidateId
                      })
                      .then(async (data) => {
                        console.log(req.body.candidateId)
                        var can_data = await candidate.findOne({ where: { id: req.body.candidateId } });
                        await can_data.update({
                          statusCode: 308
                        });
                        var can_status=await candidateStatus.findOne({where:{candidateId:req.body.candidateId,statusCode:308}});
                        if(!can_status){
                          await candidateStatus.create({
                            candidateId: req.body.candidateId,
                            statusCode: 308,
                            mainId:req.mainId,
                            createdBy: req.userId,
                            updatedBy: req.userId
                          });
                        }
                        else{
                          res.status(200).json({status:false,message:"Already sent to candidate!!!"})
                        }
                        res.status(200).json({ status: true, message: "Sent" });
                      })
                      .catch((error) => {
                        res.status(500).json({ status: false, mesage: "Error" });
                      });
                  }
                })
                .catch((error) => {
                  // console.log(e);
                  res.status(500).json({ status: false, mesage: "Error1" });
                });
            } else {
              await chatUser
                .create({
                  phoneNumber: phoneNumber,
                  name: candidate_name,
                  recruiterId: req.recruiterId,
                  mainId: req.mainId,
                  PHONE_NUMBER_ID: PHONE_NUMBER_ID,
                })
                .then((cdata) => {
                  var req_body = {
                    messaging_product: "whatsapp",
                    to: phoneNumber,
                    type: "template",
                    template: {
                      name: templateName,
                      language: {
                        policy: "deterministic",
                        code: "en_US",
                      },
                      components: [
                        {
                          type: "body",
                          parameters: [],
                        },
                      ],
                    },
                  };

                  if (vars) {
                    vars.forEach((var1) => {
                      req_body.template.components[0].parameters.push({
                        type: "text",
                        text: var1,
                      });
                    });
                  }

                  //console.log(req_body);

                  http
                    .post(FB_BASE_URL + PHONE_NUMBER_ID + "/messages", req_body, {
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + WHATSAPP_TOKEN,
                      },
                    })
                    .then((response) => {
                      //console.log(response);

                      if (response.data.messages) {
                        const message_id = response.data.messages[0].id;

                        // database.update();
                        //   resolve(message_id);

                        chatUserMessage
                          .create({
                            chatUserId: cdata.id,
                            messageId: message_id,
                            to: phoneNumber,
                            recruiterId: req.recruiterId,
                            mainId: req.mainId,
                            timestamp: Math.floor(Date.now() / 1000),
                            status: "delivered",
                            caption: message,
                            type: "text",
                            template: templateName,
                            vars: vars,
                            PHONE_NUMBER_ID: PHONE_NUMBER_ID,
                            candidateId:req.body.candidateId
                          })
                          .then((data) => {
                            res.status(200).json({ status: true, message: "Sent" });
                          })
                          .catch((error) => {
                            res
                              .status(500)
                              .json({ status: false, mesage: "Error" });
                          });
                      }
                    })
                    .catch((error) => {
                      // console.log(error);
                      res.status(500).json({ status: false, mesage: "Error2" });
                    });
                });
            }


          })
          .catch((e) => {
            console.log(e);
            res.status(500).json({ status: false, mesage: "Error1" });
          });
      }
      */ else if (templateName == "joining_confirmation") {
        await chatUser
          .findOne({
            where: {
              mainId: req.mainId,
              phoneNumber: phoneNumber,
              PHONE_NUMBER_ID: PHONE_NUMBER_ID,
            },
          })
          .then(async (data) => {

            if (data != null) {
              var req_body = {
                messaging_product: "whatsapp",
                to: phoneNumber,
                type: "template",
                template: {
                  name: templateName,
                  language: {
                    policy: "deterministic",
                    code: "en_US",
                  },
                  components: [
                    {
                      type: "body",
                      parameters: [],
                    },
                  ],
                },
              };

              if (vars) {
                vars.forEach((var1) => {
                  req_body.template.components[0].parameters.push({
                    type: "text",
                    text: var1,
                  });
                });
              }
              http
                .post(FB_BASE_URL + PHONE_NUMBER_ID + "/messages", req_body, {
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + WHATSAPP_TOKEN,
                  },
                })
                .then((response) => {

                  if (response.data.messages) {
                    const message_id = response.data.messages[0].id;

                    // database.update();
                    //   resolve(message_id);

                    chatUserMessage
                      .create({
                        chatUserId: data.id,
                        messageId: message_id,
                        to: phoneNumber,
                        recruiterId: req.recruiterId,
                        mainId: req.mainId,
                        timestamp: Math.floor(Date.now() / 1000),
                        status: "delivered",
                        caption: message,
                        type: "text",
                        template: templateName,
                        vars: vars,
                        PHONE_NUMBER_ID: PHONE_NUMBER_ID,
                        candidateId: req.body.candidateId,
                      })
                      .then(async (data) => {
                      //  var hist_data = await messagehistory(req, data);          changed data candidate wise

                        var can_data = await candidate.findOne({
                          where: { id: req.body.candidateId, statusCode: 308 },
                        });
                        if (can_data) {
                          await can_data.update({
                            statusCode: 3081,
                          });
                          var can_status = await candidateStatus.findOne({
                            where: {
                              candidateId: req.body.candidateId,
                              statusCode: 3081,
                            },
                          });
                          if (!can_status) {
                            await candidateStatus.create({
                              candidateId: req.body.candidateId,
                              statusCode: 3081,
                              mainId: req.mainId,
                              createBy: req.userId,
                              updatedBy: req.userId,
                            });
                          } else {
                            res
                              .status(200)
                              .json({
                                status: false,
                                message: "Already sent to candidate!!!",
                              });
                          }
                        }
                        res
                          .status(200)
                          .json({
                            status: true,
                            message: "Sent",
                        //   isNew: hist_data,               changed data candidate wise
                          });
                      })
                      .catch((error) => {
                        console.log(error);
                        res.status(500).json({ status: false, mesage: "Error" });
                      });
                  }
                })
                .catch((error) => {
                  console.log(error);
                  res.status(500).json({ status: false, mesage: "Error1" });
                });
            }
          })
          .catch((e) => {
            console.log(e);
            res.status(500).json({ status: false, mesage: "Error1" });
          });
      } else {
        await chatUser
          .findOne({
            where: {
              mainId: req.mainId,
              phoneNumber: phoneNumber,
              PHONE_NUMBER_ID: PHONE_NUMBER_ID,
            },
          })
          .then(async (data) => {

            if (data != null) {
              var req_body = {
                messaging_product: "whatsapp",
                to: phoneNumber,
                type: "template",
                template: {
                  name: templateName,
                  language: {
                    policy: "deterministic",
                    code: "en_US",
                  },
                  components: [
                    {
                      type: "body",
                      parameters: [],
                    },
                  ],
                },
              };

              if (vars) {
                vars.forEach((var1) => {
                  req_body.template.components[0].parameters.push({
                    type: "text",
                    text: var1,
                  });
                });
              }
              http
                .post(FB_BASE_URL + PHONE_NUMBER_ID + "/messages", req_body, {
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + WHATSAPP_TOKEN,
                  },
                })
                .then((response) => {

                  if (response.data.messages) {
                    const message_id = response.data.messages[0].id;

                    // database.update();
                    //   resolve(message_id);


                    chatUserMessage
                      .create({
                        chatUserId: data.id,
                        messageId: message_id,
                        to: phoneNumber,
                        recruiterId: req.recruiterId,
                        mainId: req.mainId,
                        timestamp: Math.floor(Date.now() / 1000),
                        status: "delivered",
                        caption: message,
                        type: "text",
                        template: templateName,
                        vars: vars,
                        PHONE_NUMBER_ID: PHONE_NUMBER_ID,
                        candidateId: req.body.candidateId,
                      })
                      .then(async (data) => {
                  //     var hist_data = await messagehistory(req, data);    changed data candidate wise
                        res
                          .status(200)
                          .json({
                            status: true,
                            message: "Sent",
                      //     isNew: hist_data,      changed data candidate wise
                          });
                      })
                      .catch((error) => {
                        console.log(error);
                        res.status(500).json({ status: false, mesage: "Error" });
                      });
                  }
                })
                .catch((error) => {
                  console.log(error);
                  res.status(500).json({ status: false, mesage: "Error1" });
                });
            } else {
              await chatUser
                .create({
                  phoneNumber: phoneNumber,
                  name: candidate_name,
                  recruiterId: req.recruiterId,
                  mainId: req.mainId,
                  PHONE_NUMBER_ID: PHONE_NUMBER_ID,
                })
                .then((cdata) => {
                  var req_body = {
                    messaging_product: "whatsapp",
                    to: phoneNumber,
                    type: "template",
                    template: {
                      name: templateName,
                      language: {
                        policy: "deterministic",
                        code: "en_US",
                      },
                      components: [
                        {
                          type: "body",
                          parameters: [],
                        },
                      ],
                    },
                  };

                  if (vars) {
                    vars.forEach((var1) => {
                      req_body.template.components[0].parameters.push({
                        type: "text",
                        text: var1,
                      });
                    });
                  }


                  http
                    .post(FB_BASE_URL + PHONE_NUMBER_ID + "/messages", req_body, {
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + WHATSAPP_TOKEN,
                      },
                    })
                    .then((response) => {

                      if (response.data.messages) {
                        const message_id = response.data.messages[0].id;

                        // database.update();
                        //   resolve(message_id);

                        chatUserMessage
                          .create({
                            chatUserId: cdata.id,
                            messageId: message_id,
                            to: phoneNumber,
                            recruiterId: req.recruiterId,
                            mainId: req.mainId,
                            timestamp: Math.floor(Date.now() / 1000),
                            status: "delivered",
                            caption: message,
                            type: "text",
                            template: templateName,
                            vars: vars,
                            PHONE_NUMBER_ID: PHONE_NUMBER_ID,
                            candidateId: req.body.candidateId,
                          })
                          .then(async (data) => {
                      //     const hist_data = await messagehistory(req, data);    changed data candidate wise


                            res
                              .status(200)
                              .json({
                                status: true,
                                message: "Sent",
                              //  isNew: hist_data,           changed data candidate wise
                              });
                          })
                          .catch((error) => {
                            res
                              .status(500)
                              .json({ status: false, mesage: "Error" });
                          });
                      }
                    })
                    .catch((error) => {
                      console.log(error);
                      res.status(500).json({ status: false, mesage: "Error2" });
                    });
                });
            }
          })
          .catch((e) => {
            console.log(e);
            res.status(500).json({ status: false, mesage: "Error1" });
          });
      }
    } else {
      res.status(200).json({ status: false, message: "User not auth" });
    }
  }
  else{
    await candidate.findOne({where:{id:req.body.candidateId},include:[{model:candidateDetails,attributes:["mobile"]}]}).then(data=>{
      if (templateName == "1st_interview_round") {
          if(data.statusCode==301){ 
              data.update({
                  statusCode:303
              }).then(async ()=>{
                  await candidateStatus.create({
                      candidateId: data.id,
                      statusCode: 303,
                      mainId: req.mainId,
                      createdBy: req.userId,
                      updatedBy: req.userId,
                    });
              })
          }
       
          res.status(200).json({status:true,message:"Done"});
      }
      else if (templateName == "initial_interview_rounds"){
          if(data.statusCode==303){
              data.update({
                  statusCode:304
              }).then(async ()=>{
                  await candidateStatus.create({
                      candidateId: data.id,
                      statusCode: 304,
                      mainId: req.mainId,
                      createdBy: req.userId,
                      updatedBy: req.userId,
                    });
              })
          }
          
          res.status(200).json({status:true,message:"Done"});
      }
      else if(templateName == "final_interview_round"){
          if(data.statusCode==304){
              data.update({
                  statusCode:3041
              }).then(async ()=>{
                  await candidateStatus.create({
                      candidateId: data.id,
                      statusCode: 3041,
                      mainId: req.mainId,
                      createdBy: req.userId,
                      updatedBy: req.userId,
                    });
              })
          }
         
          res.status(200).json({status:true,message:"Done"});
      }
      else if (templateName == "document_collect"){
          if(data.statusCode==3041||data.statusCode==304){
              data.update({
                  statusCode:305
              }).then(async ()=>{
                  await candidateStatus.create({
                      candidateId: data.id,
                      statusCode: 305,
                      mainId: req.mainId,
                      createdBy: req.userId,
                      updatedBy: req.userId,
                    });
              })
          }
        
          res.status(200).json({status:true,message:"Done"});
      }
      else if (templateName == "salary_breakup_shared_confirmation") {
          if(data.statusCode==305){
              data.update({
                  statusCode:307
              }).then(async ()=>{
                  await candidateStatus.create({
                      candidateId: data.id,
                      statusCode: 306,
                      mainId: req.mainId,
                      createdBy: req.userId,
                      updatedBy: req.userId,
                    });
                    await candidateStatus.create({
                      candidateId: data.id,
                      statusCode: 307,
                      mainId: req.mainId,
                      createdBy: req.userId,
                      updatedBy: req.userId,
                    });
              })
          }
          
          res.status(200).json({status:true,message:"Done"});
      }
      else if (templateName == "offer_released_confirmation"){
          if(data.statusCode==307){
              data.update({
                  statusCode:308
              }).then(async ()=>{
                  await candidateStatus.create({
                      candidateId: data.id,
                      statusCode: 308,
                      mainId: req.mainId,
                      createdBy: req.userId,
                      updatedBy: req.userId,
                    });
              })
          }
         
          res.status(200).json({status:true,message:"Done"});
      }
      else if (templateName == "joining_confirmation") {
          if(data.statusCode==308){
              data.update({
                  statusCode:3081
              }).then(async ()=>{
                  await candidateStatus.create({
                      candidateId: data.id,
                      statusCode: 3081,
                      mainId: req.mainId,
                      createdBy: req.userId,
                      updatedBy: req.userId,
                    });
              })
          }
         
          res.status(200).json({status:true,message:"Done"});
      }
      else{
           res.status(200).json({status:false,message:"Template Name Missing"});
      }
      
  }).catch(e=>{
      console.log(e);
      res.status(500).json({ message: "Error", status: false });
  })
  }
};

exports.searchChat = async (req, res) => {
  chatUser
    .findAll({
      include: [
        {
          model: chatUserMessage,
        },
      ],
      where: {
        mainId: req.mainId,
        [Op.or]: {
          "$chatUserMessages.caption$": {
            [Op.iLike]: "%" + req.body.search + "%",
          },
          name: { [Op.iLike]: "%" + req.body.search + "%" },
        },
      },
    })
    .then((data) => {
      res.status(200).json({ status: true, data: data });
    })
    .catch((e) => {
      console.log(e);
      res.status(500).json({ status: false, mesage: "Error" });
    });
};
exports.IniConv = async (req, res) => {};
exports.getIniChat = async (req, res) => {
  var dateObj = new Date();
  dateObj.setDate(dateObj.getDate());
  mywhere = {
    createdAt: {
      [Op.and]: [
        Sequelize.literal(
          `date_trunc('day', "createdAt") = '${dateObj
            .toISOString()
            .slice(0, 10)}'`
        ),
        Sequelize.literal(
          `extract(month from "createdAt") = ${dateObj.getMonth() + 1}`
        ),
        Sequelize.literal(
          `extract(year from "createdAt") = ${dateObj.getFullYear()}`
        ),
      ],
    },
    chatUserId: req.body.chatUserId,
    [Op.or]: {
      template: { [Op.ne]: null },
      from: { [Op.ne]: null },
    },
  };

  chatUserMessage
    .findOne({
      where: mywhere,
      order: [["createdAt", "ASC"]],
    })
    // chatUserMessage.findOne({
    //   where: Sequelize.literal(`
    //     date_trunc('day', "createdAt") = date_trunc('day', '${new Date().toISOString()}')
    //     AND chatUserId = ${req.body.chatUserId}
    //     AND ("template" IS NOT NULL OR "from" IS NOT NULL)`),
    //   order: [['createdAt', 'ASC']]
    // })
    .then((data) => {
      res.status(200).json({ status: true, data: data });
    })
    .catch((e) => {
      console.log(e);
      res.status(500).json({ status: false, mesage: "Error" });
    });
};

exports.sendImage = async (req, res) => {

  //
  var settings = await recruiterSettings.findOne({
    where: { mainId: req.mainId },
  });
  const FB_BASE_URL = settings.fbBaseUrl;
  const PHONE_NUMBER_ID = settings.phoneNumberId;
  const WHATSAPP_TOKEN = settings.waToken;
  const formData = new FormData();
  formData.append("file", fs.createReadStream(req.file.path), {
    contentType: req.file.mimetype,
  });
  formData.append("messaging_product", "whatsapp");


  http
    .post(
      FB_BASE_URL + PHONE_NUMBER_ID + "/media",

      formData,

      {
        headers: {
          //"Content-Type": "application/json",

          Authorization: "Bearer " + WHATSAPP_TOKEN,
          ...formData.getHeaders(),
        },
      }
    )
    .then(async (fileData) => {
      const fileId = fileData.data.id;
      await chatUser
        .findOne({
          where: { mainId: req.mainId, id: req.body.chatUserId },
        })
        .then(async (data) => {
          var settings = await recruiterSettings.findOne({
            where: { mainId: req.mainId },
          });
          if (settings) {
            const FB_BASE_URL = settings.fbBaseUrl;
            const PHONE_NUMBER_ID = settings.phoneNumberId;
            const WHATSAPP_TOKEN = settings.waToken;
            http
              .post(
                FB_BASE_URL + PHONE_NUMBER_ID + "/messages",
                {
                  messaging_product: "whatsapp",
                  preview_url: false,
                  recipient_type: "individual",
                  to: data.phoneNumber,
                  type: "image",
                  image: { id: fileId },
                },
                {
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + WHATSAPP_TOKEN,
                  },
                }
              )
              .then(async (response) => {
                if (response.data.messages) {
                  const message_id = response.data.messages[0].id;
                  const myMediaId = fileId;
                  // database.update();
                  // resolve(message_id);
                  chatUserMessage
                    .create({
                      chatUserId: data.id,
                      messageId: message_id,
                      to: data.phoneNumber,
                      recruiterId: req.recruiterId,
                      mainId: req.mainId,
                      mediaId: myMediaId,
                      timestamp: Math.floor(Date.now() / 1000),
                      status: "delivered",
                      type: "image",
                      PHONE_NUMBER_ID: PHONE_NUMBER_ID,
                    })
                    .then((data) => {
                      downloadMedia(
                        myMediaId,
                        data.dataValues.id,
                        FB_BASE_URL,
                        WHATSAPP_TOKEN,
                        req.file.originalname
                      );
                      res.status(200).json({ status: true, message: "Sent" });
                    })
                    .catch((error) => {
                      console.log(error);
                      res.status(500).json({ status: false, mesage: "Error2" });
                    });
                }
              })
              .catch((error) => {
                console.log(error);
                res.status(500).json({ status: false, mesage: "Error1" });
              });
          }
        });
    });
};
exports.sendDocument = async (req, res) => {

  //
  var settings = await recruiterSettings.findOne({
    where: { mainId: req.mainId },
  });
  const FB_BASE_URL = settings.fbBaseUrl;
  const PHONE_NUMBER_ID = settings.phoneNumberId;
  const WHATSAPP_TOKEN = settings.waToken;
  const formData = new FormData();
  formData.append("file", fs.createReadStream(req.file.path), {
    contentType: req.file.mimetype,
  });
  formData.append("messaging_product", "whatsapp");


  http
    .post(
      FB_BASE_URL + PHONE_NUMBER_ID + "/media",

      formData,

      {
        headers: {
          //"Content-Type": "application/json",

          Authorization: "Bearer " + WHATSAPP_TOKEN,
          ...formData.getHeaders(),
        },
      }
    )
    .then(async (fileData) => {
      const fileId = fileData.data.id;
      await chatUser
        .findOne({
          where: { mainId: req.mainId, id: req.body.chatUserId },
        })
        .then(async (data) => {
          var settings = await recruiterSettings.findOne({
            where: { mainId: req.mainId },
          });
          if (settings) {
            const FB_BASE_URL = settings.fbBaseUrl;
            const PHONE_NUMBER_ID = settings.phoneNumberId;
            const WHATSAPP_TOKEN = settings.waToken;
            http
              .post(
                FB_BASE_URL + PHONE_NUMBER_ID + "/messages",
                {
                  messaging_product: "whatsapp",
                  preview_url: false,
                  recipient_type: "individual",
                  to: data.phoneNumber,
                  type: "document",
                  document: { id: fileId, filename: req.file.originalname },
                },
                {
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + WHATSAPP_TOKEN,
                  },
                }
              )
              .then(async (response) => {
                if (response.data.messages) {
                  const message_id = response.data.messages[0].id;
                  const myMediaId = fileId;
                  // database.update();
                  // resolve(message_id);
                  chatUserMessage
                    .create({
                      chatUserId: data.id,
                      messageId: message_id,
                      to: data.phoneNumber,
                      recruiterId: req.recruiterId,
                      mainId: req.mainId,
                      mediaId: myMediaId,
                      timestamp: Math.floor(Date.now() / 1000),
                      status: "delivered",
                      type: "document",
                      PHONE_NUMBER_ID: PHONE_NUMBER_ID,
                    })
                    .then((data) => {
                      downloadMedia(
                        myMediaId,
                        data.dataValues.id,
                        FB_BASE_URL,
                        WHATSAPP_TOKEN,
                        req.file.originalname
                      );
                      res.status(200).json({ status: true, message: "Sent" });
                    })
                    .catch((error) => {
                      console.log(error);
                      res.status(500).json({ status: false, mesage: "Error2" });
                    });
                }
              })
              .catch((error) => {
                console.log(error);
                res.status(500).json({ status: false, mesage: "Error1" });
              });
          }
        });
    });
};

exports.viewAllChats=async(req,res)=>{
  if(req.body.page)
    {
        var page = req.body.page;
    }
    else
    {
        var page=1;
    }
  var limit = 10;
  chatUserMessage.findAndCountAll({limit:limit,
    offset: (page * limit) - limit,
    order: [['createdAt', 'DESC']]
  }).then(data=>{
    res.status(200).json({status:true,data:data});
  }).catch(e=>{
    res.status(500).json({ status: false, mesage: "Error" });
  });
};
function downloadMedia(
  media_id,
  chatUserMessageId,
  FB_BASE_URL,
  WHATSAPP_TOKEN,
  original_name
) {
  const storage = new AWS.S3({
    accessKeyId: process.env.s3_id,
    secretAccessKey: process.env.s3_key,
  });
  http
    .get(FB_BASE_URL + media_id, {
      headers: {
        Authorization: "Bearer " + WHATSAPP_TOKEN,
      },
    })
    .then((response) => {

      const retrival_url = response.data.url;
      http
        .get(retrival_url, {
          responseType: "stream",
          headers: {
            Authorization: "Bearer " + WHATSAPP_TOKEN,
          },
        })
        .then((response) => {
          const header = response.headers["content-disposition"];
          const filename = header.split("filename=")[1];
          const path = "media/" + media_id + "_" + filename;

          response.data
            .pipe(fs.createWriteStream(path))
            .on("finish", async () => {
              //   console.log(filename + " downloaded.");
              //     database.media[media_id] = { path };
              //  database.update();
              var binarydat = await fs.readFileSync(path);
              const params = {
                Bucket: "refo" + "/" + "Media",
                Key: filename,
                Body: binarydat,
                ACL: "public-read",
              };
              chatMedia
                .create({
                  mediaId: media_id,
                  path: path,
                  originalFileName: original_name,
                })
                .then(async (data) => {
                  storage.upload(params, async function (err, S3file) {
                    //S3 upload function
                    if (err) {
                      console.log(err);
                    }
                    await chatMedia.update(
                      { path: process.env.liveImageUrl + "/" + filename },
                      { where: { id: data.dataValues.id } }
                    );
                    chatUserMessage.update(
                      { chatMediaId: data.id },
                      { where: { id: chatUserMessageId } }
                    );
                  });
                  fs.unlink(path, function (err) {
                    if (err) throw err;
                    console.log("file deleted.");
                  });
                });
            });
        });
    });
}

// async function messagehistory(req, data) {
//   const newcandidate = await chatUser.findOne({
//     where: { id: data.dataValues.chatUserId },
//   });
//   var dateObj = new Date();
//   mywhere = {
//     createdAt: {
//       [Op.and]: [
//         Sequelize.literal(
//           `date_trunc('day', "createdAt") = '${dateObj
//             .toISOString()
//             .slice(0, 10)}'`
//         ),
//         Sequelize.literal(
//           `extract(month from "createdAt") = ${dateObj.getMonth() + 1}`
//         ),
//         Sequelize.literal(
//           `extract(year from "createdAt") = ${dateObj.getFullYear()}`
//         ),
//       ],
//     },
//     //candidateId:newcandidate.candidateId,
//     PHONE_NUMBER_ID: newcandidate.PHONE_NUMBER_ID,
//     to: newcandidate.phoneNumber,
//     mainId: req.mainId,
//   };
//   const activity = await recruiterMessageActivity.findOne({ where: mywhere });
//   if (!activity) {
//     await recruiterMessageActivity
//       .create({
//         PHONE_NUMBER_ID: newcandidate.PHONE_NUMBER_ID,
//         phoneNumber: newcandidate.phoneNumber,
//         mainId: req.mainId,
//         recruiterId: req.recruiterId,
//         to: newcandidate.phoneNumber,
//         chatUserMessageId: data.dataValues.id,
//       })
//       .then(async () => {
//         Wallet = await recruiterWallet.findOne({
//           where: { mainId: req.mainId },
//         });
//         messagesLeft = Wallet.remainingMessages - 1;
//         await Wallet.update({
//           remainingMessages: messagesLeft,
//         });
//       });
//     return true;
//   }
//   else{
//     return false;
//   }
// }

