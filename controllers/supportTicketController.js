
const supportTicket=require("../models/supportTicket");
const supportTicketConversations=require("../models/supportTicketConversations");
const recruiter=require("../models/recruiter");
const moment=require("moment");
const mailFunction=require("../functions/sendReplyMail");
const { Op } = require("sequelize");
exports.addTicket=async(req,res)=>{
    var ticket_data=await supportTicket.findOne({order:[["ticketInt","DESC"]]});
    if(ticket_data){
        var ticketInt=ticket_data.ticketInt+1;
        var ticketText="TICKET";
    }
    else{
        var ticketInt=10001;
        var ticketText="TICKET";
    }
    var ticketNo=`${ticketText}${ticketInt}`;
    await supportTicket.create({
        ticketInt:ticketInt,
        ticketNo:ticketNo,
        ticketText:ticketText,
        subject:req.body.subject,
        description:req.body.description,
        mainId:req.mainId,
        userId:req.userId,
        statusCode:401
    }).then(async(data)=>{
        await supportTicketConversations.create({
            description:req.body.description,
            supportTicketId:data.dataValues.id,
            userId:req.userId
        });
        mailFunction.supportTicketAlert(req,ticketNo);
        res.status(200).json({status:true,message:"Ticket Raised Successfully"});
    }).catch(e=>{
        console.log(e);
        res.status(500).json({status:false,message:"Error"});
    });
};

exports.supportConversation=async(req,res)=>{
    console.log(req.body);
    await supportTicketConversations.create({
        description:req.body.description,
        supportTicketId:req.body.supportTicketId,
        userId:req.userId
    }).then(async()=>{
        await supportTicket.update({statusCode:402},{where:{id:req.body.supportTicketId}}).then(data=>{
            mailFunction.clientReplied(req,data);
            res.status(200).json({status:true}); s
        });
    }).catch(e=>{ 
        console.log(e);
        res.status(500).json({status:false,message:"Error"});
    }); 
};
exports.superAdminSupportConversation=async(req,res)=>{
    console.log(req.body);
    await supportTicketConversations.create({
        description:req.body.description,
        supportTicketId:req.body.supportTicketId,
        userId:req.userId
    }).then(async ()=>{
        await supportTicket.update({statusCode:403},{where:{id:req.body.supportTicketId}}).then(data=>{
            mailFunction.supportReplied(req,data);
            res.status(200).json({status:true}); 
        });
    }).catch(e=>{ 
        console.log(e);
        res.status(500).json({status:false,message:"Error"});
    }); 
};
exports.ViewAllSupportConversation=async(req,res)=>{
    var mywhere={supportTicketId:req.body.supportTicketId};
    await supportTicketConversations.findAll({where:mywhere}).then(data=>{
        res.status(200).json({status:true,data:data})
    }).catch(e=>{
        console.log(e);
        res.status(500).json({status:false,message:"Error"});
    });
};
exports.viewTicket=async(req,res)=>{
    await supportTicket.findOne({where:{id:req.body.id}}).
    then((data)=>{
        res.status(200).json({status:true,data:data});
    }).catch(e=>{
        res.status(500).json({status:false,message:"Error"});
    });
};
exports.closeTicket=async(req,res)=>{
    await supportTicket.findOne({where:{id:req.body.id}}).
    then((data)=>{
        data.update({
            statusCode:404
        })
        mailFunction.ticketClosed(req,data);
        res.status(200).json({status:true,data:data});
    }).catch(e=>{
        res.status(500).json({status:false,message:"Error"});
    });
}
exports.viewAllTickets=async(req,res)=>{
    var page=req.body.page;
    var limit=50;
    myWhere={mainId:req.mainId};
    if (req.body.fromDate && req.body.toDate) {
        const fromDate = moment(req.body.fromDate).startOf('day').toISOString();
        const toDate = moment(req.body.toDate).endOf('day').toISOString();
        myWhere.createdAt = {
          [Op.between]: [fromDate, toDate]
        }
      }
     if(req.body.recruiterId){
        myWhere.recruiterId=req.body.recruiterId;
     } 
    await supportTicket.findAndCountAll({
        where:myWhere,
        include:[recruiter],
        limit:limit,
        offset:(page*limit)-limit,
        order:[["createdAt","DESC"]]
    }).
    then((data)=>{
        res.status(200).json({data:data.rows,count:data.count,status:true});
    }).catch(e=>{
        res.status(500).json({status:false,message:"Error"});
    });
};
exports.supportViewAllTickets=async(req,res)=>{
    myWhere={};
    var page=req.body.page;
    var limit=50;
    if (req.body.fromDate && req.body.toDate) {
        const fromDate = moment(req.body.fromDate).startOf('day').toISOString();
        const toDate = moment(req.body.toDate).endOf('day').toISOString();
        myWhere.createdAt = {
          [Op.between]: [fromDate, toDate]
        }
      }
     if(req.body.recruiterId){
        myWhere.recruiterId=req.body.recruiterId;
     } 
    await supportTicket.findAndCountAll({
        where:myWhere,
        include:[recruiter],
        limit:limit,
        offset:(page*limit)-limit,
        order:[["createdAt","DESC"]]
    }).
    then((data)=>{
        res.status(200).json({data:data.rows,count:data.count,status:true});
    }).catch(e=>{
        res.status(500).json({status:false,message:"Error"});
    });
};