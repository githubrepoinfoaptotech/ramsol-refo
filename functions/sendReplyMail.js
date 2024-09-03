const candidate = require("../models/candidate");
const recruiter = require("../models/recruiter");
const chatUserMessage = require("../models/chatUserMessage");
const candidateDetail = require("../models/candidateDetail");
const recruiterSettings = require("../models/recruiterSettings");
const user = require("../models/user");
const email = require("../config/email.js");
const { Op } = require("sequelize");
const requirement = require("../models/requirement");
//dependencies
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const base64url=require("base64url");
const crypto=require("crypto");
const http = require("axios").default;
const { format, parseISO,addMinutes  } = require('date-fns');
const clients = require("../models/client.js");
//


exports.candidateReply = async (replyId) => {
  await chatUserMessage
    .findOne({
      where: { messageId: replyId, candidateId: { [Op.ne]: null } },
    })
    .then(async (data) => {
      if (data) {
        var chatUserId = data.chatUserId;

        var can_data = await candidate.findOne({
          where: { id: data.candidateId },
          include: [
            {
              model: recruiter,
              attributes: ["firstName", "lastName", "mobile"],
            },
            {
              model: candidateDetail,
              attributes: ["firstName", "lastName", "mobile", "email"],
            },
            {
              model: requirement,
              attributes: ["uniqueId"],
            },
          ],
        });
        //if (data.template == "candidate_initiation") {

        var settings = await recruiterSettings.findOne({
          where: { mainId: can_data.mainId },
        });

        const FB_BASE_URL = settings.fbBaseUrl;
        const PHONE_NUMBER_ID = settings.phoneNumberId;
        const WHATSAPP_TOKEN = settings.waToken;

        var link =
          "https://reach.infoapto.com/#/app/singlechat?user_id=" + chatUserId;

        const vars = [
          can_data.recruiter.firstName,
          can_data.candidateDetail.firstName,
          can_data.requirement.uniqueId,
          link,
        ];

        var req_body = {
          messaging_product: "whatsapp",
          to: can_data.recruiter.mobile,
          type: "template",
          template: {
            name: "candidate_replied",
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
              // const message_id = response.data.messages[0].id;
              //   res.status(200).json({ status: true, message: "Sent" });
            }
          })
          .catch((error) => {
            console.log(error);
          });

        //  vars.push("banana", "apple", "peach");

        /* var mailOptions = {
          from: '"Reachforshure"<admin@recrubot.com>',
          //to: "vishallegend7775@gmail.com",
          to: can_data.recruiter.user.email,
          template: "candidate_initiation",
          subject: "Candidate has Replied",
          context: {
            name:
              can_data.candidateDetail.firstName +
              can_data.candidateDetail.lastName,
            email: can_data.candidateDetail.email,
            mobile: can_data.candidateDetail.mobile,
          },
        };

        email.transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("Success");
          }
        }); */
        // } else if (data.template == "1st_interview_round") {

        // } else if (data.template == "initial_interview_rounds") {

        //  } else if (data.template == "final_interview_round") {

        //  } else if (data.template == "document_collect") {

        //   } else if (data.template == "salary_breakup_shared_confirmation") {

        //  } else if (data.template == "offer_released_confirmation") {

        //   } else if (data.template == "joining_confirmation") {
        //
        //    }
      }
    });
};

exports.nonSwipeReply=async(mainId,phone_number,chatUserId)=>{
  var can_data=await candidate.findOne({where:{mainId:mainId},include:[{
    model:candidateDetail,
    where:{mobile:phone_number},
    require:true,
    attributes:["firstName"],
  },
  {
    model:recruiter,
    attributes:["mobile","firstName"]
  },
  {
    model:requirement,
    attributes:["uniqueId"]
  }
],order:[["createdAt","DESC"]]});
if(can_data){
  var settings = await recruiterSettings.findOne({
    where: { mainId: mainId },
  });

  const FB_BASE_URL = settings.fbBaseUrl;
  const PHONE_NUMBER_ID = settings.phoneNumberId;
  const WHATSAPP_TOKEN = settings.waToken;

  var link =
    "https://reach.infoapto.com/#/app/singlechat?user_id="+chatUserId;

  const vars = [
    can_data.recruiter.firstName,
    can_data.candidateDetail.firstName,
    can_data.requirement.uniqueId,
    link,
  ];

  var req_body = {
    messaging_product: "whatsapp",
    to: can_data.recruiter.mobile,
    type: "template",
    template: {
      name: "candidate_replied",
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
        // const message_id = response.data.messages[0].id;
        //   res.status(200).json({ status: true, message: "Sent" });
      }
    })
    .catch((error) => {
      console.log(error);
    });
}
};


exports.supportTicketAlert=async(req,data)=>{
  try{
  var comp=await recruiter.findOne({where:{mainId:req.mainId,userId:req.userId},include:[{model:user,attributes:['email']}]});
  var companyName=comp.companyName;
  var mailOptionsClient = {
      from: '<no-reply@refo.app>',
      //to: req.body.email,
      to: comp.user.email,
      template: "supportTicket-client",
      subject: "Ticket has been raised successfully("+data+")",
      context: {
          companyName:companyName,
          ticketNO:data
      },
  };
  var mailOptionsSupport = {
    from: '<no-reply@refo.app>',
    //to: req.body.email,
    to: "contact-support@refo.app",
    template: "supportTicket-superAdmin",
    subject: "An Ticket has been raised By "+companyName,
    context: {
        companyName:companyName,
        ticketNO:data
    },
};
  email.transporter.sendMail(mailOptionsClient, async function (error, info) {
      if (error) {
          console.log(error);
      } else {
          console.log("Success");
      }
  });
  email.transporter.sendMail(mailOptionsSupport, async function (error, info) {
    if (error) {
        console.log(error);
    } else {
        console.log("Success");
    }
});
}
catch(e){
  console.log(e);
}
}

exports.passwordResetSuccess=async(data)=>{
  try{
    var mailOptions = {
      from: '<no-reply@refo.app>',
      //to: req.body.email,
      to: data.email,
      template: "reset-password-success",
      subject: "Password has been changed successfully.",
      context: {
          name:data.recruiter.firstName+" "+data.recruiter.lastName,
      },
  };
  email.transporter.sendMail(mailOptions, async function (error, info) {
    if (error) {
        console.log(error);
    } else {
        console.log("Success");
    }
});
  }
  catch(e){
    console.log(e);
  }
};

exports.clientReplied=async(req,data)=>{
  try{
    var myuser=await user.findOne({where:{id:req.userId},include:['companyName']});
    var mailOptions = {
      from: '<no-reply@refo.app>',
      //to: req.body.email,
      to: "contact-support@refo.app",
      template: "clientReplied",
      subject: "Client has replied to yur message",
      context: {
          companyName:myuser.recruiter.companyName,
          ticketNo:data.ticketNo
      },
  };
  email.transporter.sendMail(mailOptions, async function (error, info) {
    if (error) {
        console.log(error);
    } else {
        console.log("Success");
    }
});
  }
  catch(e){
    console.log(e);
  }
};
exports.supportReplied=async(req,data)=>{
  try{
    var myuser=await user.findOne({where:{id:req.userId},include:['companyName']});
    var mailOptions = {
      from: '<no-reply@refo.app>',
      //to: req.body.email,
      to: myuser.email,
      template: "supportReplied",
      subject: "Support has replied to your issue",
      context: {
          ticketNo:data.ticketNo
      },
  };
  email.transporter.sendMail(mailOptions, async function (error, info) {
    if (error) {
        console.log(error);
    } else {
        console.log("Success");
    }
});
  }
  catch(e){
    console.log(e);
  }
};

exports.ticketClosed=async(req,data)=>{
  try{
    var myuser=await user.findOne({where:{id:req.userId},attributes:['companyName']});
    var mailOptions = {
      from: '<no-reply@refo.app>',
      //to: req.body.email,
      to: "contact-support@refo.app",
      template: "ticketClosed",
      subject: "Clinet has closed ticket",
      context: {
          ticketNo:data.ticketNo
      },
  };
  email.transporter.sendMail(mailOptions, async function (error, info) {
    if (error) {
        console.log(error);
    } else {
        console.log("Success");
    }
});
  }
  catch(e){
    console.log(e);
  }
}


exports.sendMailAdminExternalCandidateAdded=async(req,canId)=>{
  try{
    var theUser=await user.findOne({where:{id:req.userId},include:[recruiter]});
    var theCompany=await user.findOne({where:{id:req.userId},include:[recruiter]});
    var theRequirement=await requirement.findOne({where:{id:req.body.requirementId},include:[{model:clients,include:[{ model: recruiter, as: 'handler'}]}]});
    var theCandidate=await candidate.findOne({where:{id:canId},include:[candidateDetail]});
    console.log(theRequirement)
    var hr= await user.findOne({where:{id:theRequirement.client.handler.userId}});
    console.log(hr);
    var mailOptions = {
      from: '<no-reply@refo.app>',
      to: hr.email,
      cc: ['gowtham@ramsol.onmicrosoft.com','vishallegend7775@gmail.com'],
      template: "ExternalUser",
      subject: "External user has added an candidate",
      context: {
          name:theUser.recruiter.firstName+" "+theUser.recruiter.lastName,
          requirementName:theRequirement.requirementName+"("+theRequirement.uniqueId+")",
          candidateName:theCandidate.candidateDetail.firstName+" "+theCandidate.candidateDetail.lastName+"("+theCandidate.uniqueId+")",
          mobile:theCandidate.candidateDetail.mobile,
          email:theCandidate.candidateDetail.email ,
          altmobile:theCandidate.candidateDetail.alternateMobile,
          dob:theCandidate.candidateDetail.dob,
          education_qual:theCandidate.candidateDetail.educationalQualification,
          education_gap:theCandidate.candidateDetail.education_gap,
          overall_exp:theCandidate.candidateDetail.experience,
          relevant_exp:theCandidate.candidateDetail.relevantExperience,
          current_company:theCandidate.candidateDetail.currentCompanyName,
          current_ctc:theCandidate.candidateDetail.currentCtc,
          expected_ctc:theCandidate.candidateDetail.expectedCtc,
          notice_period:theCandidate.candidateDetail.noticePeriod,
          current_location:theCandidate.candidateDetail.currentLocation,
          native_loaction:theCandidate.candidateDetail.nativeLocation,
          preferred_location:theCandidate.candidateDetail.preferredLocation,
          relocation_reason:theCandidate.candidateDetail.reloaction_reason,
          offer_details:theCandidate.candidateDetail.offer_details,
          career_gap:theCandidate.candidateDetail.career_gap,
          document_check:theCandidate.candidateDetail.document_check,
          pan_number:theCandidate.candidateDetail.panNumber
      },
  };
  email.transporter.sendMail(mailOptions, async function (error, info) {
    if (error) {
        console.log(error);
    } else {
        console.log("Success");
    }
});
  }
  catch(e){
    console.log(e);
  }
};
/*
let token = base64url(crypto.randomBytes(20));
            await user_data.update({
                token: token
            }); 
            */
exports.resgistrationConformation=async(req,data)=>{
  var SupportmailOptions = {
    from: '<no-reply@refo.app>',
    // to: "vishallegend7775@gmail.com",
    to: "contact-support@refo.app",
    template: "companyRegisterationInformation",
    subject: "A company has registered for refo",
    context: {
        companyName:req.body.companyName,
        mobile:req.body.mobile,
        email:req.body.email 
    },
};
email.transporter.sendMail(SupportmailOptions, async function (error, info) {
  if (error) {
      console.log(error);
  } else {
      console.log("Success");
  }
});
  
};

exports.salesContactIntimation=(req)=>{
  var mailOptions = {
    from: '<no-reply@refo.app>',
    to: "contact-support@refo.app",
    // to: "vishallegend7775@gmail.com",
    template: "contactSales",
    subject: "Contacted for sales",
    context: {
        companyName:req.body.companyName,
        mobile:req.body.mobile,
        email:req.body.email 
    },
};
email.transporter.sendMail(mailOptions, async function (error, info) {
  if (error) {
      console.log(error);
  } else {
      console.log("Success");
  }
});
};
exports.requestDemoIntimation=(req)=>{
  var mailOptions = {
    from: '<no-reply@refo.app>',
    to: "contact-support@refo.app",
    // to: "vishallegend7775@gmail.com",
    template: "demoRequest",
    subject: "Requested For Demo",
    context: {
        companyName:req.body.companyName,
        mobile:req.body.mobile,
        email:req.body.email 
    },
};
email.transporter.sendMail(mailOptions, async function (error, info) {
  if (error) {
      console.log(error);
  } else {
      console.log("Success");
  }
});
};

exports.MsmeResgistrationConformation=async(req,password)=>{
var supportMailOptions = {
  from: '<no-reply@refo.app>',
  to: "contact-support@refo.app",
  //  to: "vishallegend7775@gmail.com",
  template: "msmeApproval",
  subject: "Registration approval for Msme",
  context: {
      companyName:req.body.companyName
  },
};

email.transporter.sendMail(supportMailOptions, async function (error, info) {
  if (error) {
      console.log(error);
  } else {
      console.log("Success");
  }
});
};

exports.sendApprovedRegistration=async(data,password)=>{
  var clientMailOptions = {
    from: '<no-reply@refo.app>',
    to: data.email,
    // to: "vishallegend7775@gmail.com",
    template: "msmeRegistration",
    subject: "Thankyou For Registration",
    context: {
        password:password,
        mobile:data.mobile,
        email:data.email ,
        companyName:data.companyName
    },
};
email.transporter.sendMail(clientMailOptions, async function (error, info) {
  if (error) {
      console.log(error);
  } else {
      console.log("Success");
  }
});
}

exports.sendProjectApproval=async(data)=>{
  var clientMailOptions = {
    from: '<no-reply@refo.app>',
    to: data.email,
    // to: "vishallegend7775@gmail.com",
    template: "projectApproval",
    subject: "Project Approval",
    context: {
       name:data.name,
       content:data.content,
       url:data.url
    },
};
email.transporter.sendMail(clientMailOptions, async function (error, info) {
  if (error) {
      console.log(error);
  } else {
      console.log("Success");
  }
});
};

exports.sendOtpForProjectApproval=async(data)=>{
  console.log(data);
  var clientMailOptions = {
    from: '<no-reply@refo.app>',
    to: data.email,
    // to: "vishallegend7775@gmail.com",
    template: "sendOtpForProjectApproval",
    subject: "Otp For Project Approval",
    context: {
       name:data.name,
       content:data.content,
       otp:otp
    },
};
email.transporter.sendMail(clientMailOptions, async function (error, info) {
  if (error) {
      console.log(error);
  } else {
      console.log("Success");
  }
});
};

exports.sendcandidateShowDetails=async(data,myemail)=>{
  var clientMailOptions = {
    from: '<no-reply@refo.app>',
    to: myemail,
    cc: "vishallegend7775@gmail.com",
    template: "candidateShowDetails",
    subject: "Candidate Suitability Confirmation - Need Further Details",
    context: {
      vendor_name:data.vendor_name,
      candidate_unique_number:data.candidate_unique_number,
      company_name:data.company_name
    },
};
email.transporter.sendMail(clientMailOptions, async function (error, info) {
  if (error) {
      console.log(error);
  } else {
      console.log("Success");
  }
});
};


exports.sendFirstLoginMail=async(user_data,data)=>{
  const now = new Date();
  var theDateandtime =now.toISOString();
  const date = parseISO(theDateandtime);
  const istDate = addMinutes(date, 330);
  theDateandtime=format(istDate, 'dd-MM-yyyy HH:mm:ss');
  var clientMailOptions = {
    from: '<no-reply@refo.app>',
    //to: "",
     to: "vishallegend7775@gmail.com",
    template: "sendFirstLoginMail",
    subject: "First Login Detected",
    context: {
      name:user_data.firstName+" "+user_data.lastName,
      email:data.email,
      time:theDateandtime
    },
};
email.transporter.sendMail(clientMailOptions, async function (error, info) {
  if (error) {
      console.log(error);
  } else {
      console.log("Success");
  }
});
};


exports.sendFirst=async(user_data,data)=>{
  const now = new Date();
  var theDateandtime =now.toISOString();
  const date = parseISO(theDateandtime);
  const istDate = addMinutes(date, 330);
  theDateandtime=format(istDate, 'dd-MM-yyyy HH:mm:ss');
  var clientMailOptions = {
    from: '<no-reply@refo.app>',
    //to: "",
     to: "vishallegend7775@gmail.com",
    template: "sendFirstLoginMail",
    subject: "First Login Detected",
    context: {
      name:user_data.firstName+" "+user_data.lastName,
      email:data.email,
      time:theDateandtime
    },
};
email.transporter.sendMail(clientMailOptions, async function (error, info) {
  if (error) {
      console.log(error);
  } else {
      console.log("Success");
  }
});
};


exports.sendRedumptionRequest=async(data)=>{
  var clientMailOptions = {
    from: '<no-reply@refo.app>',
    //to: "",
    to: ["pradeep@ramsolcorp.com","viswanathan@ramsol.onmicrosoft.com"], // Array of email addresses
    cc: ["balaji@ramsol.in",
      "kumar@ramsol.in",
      "reena.m@ramsol.onmicrosoft.com",
      "jothilingam@ramsol.onmicrosoft.com",
      "vishali.g@ramsol.onmicrosoft.com",
    "gowtham@ramsol.onmicrosoft.com"],
    template: "reedemRequest",
    subject: "Redemption Request",
    context: data
};
email.transporter.sendMail(clientMailOptions, async function (error, info) {
  if (error) {
      console.log(error);
  } else {
      console.log("Success");
  }
});
};


exports.redeemSuccess = async (data, mailId) => {
  var clientMailOptions = {
    from: '<no-reply@refo.app>',
    to: mailId, // Array of email addresses
    template: "candidateReedemed",
    subject: "Redemption Confirmation",
    context: data
  };

  email.transporter.sendMail(clientMailOptions, async function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Success");
    }
  });
};


