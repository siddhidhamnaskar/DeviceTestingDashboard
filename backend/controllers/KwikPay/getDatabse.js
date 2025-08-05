const { Op ,Sequelize} = require("sequelize");
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

const {KwikpayTXN,KwikpayDevices,KwikNetPwFailReport, KwikpayMachineStatus} =require("../../models")
// import { successResponse, errorResponse, uniqueId } from '../../helpers';
var events = require('../../helpers/events');

dayjs.extend(utc);
dayjs.extend(timezone);

const getTcResponse=async(req,res)=>{
    try{
    
      const startUTC = dayjs.tz(`${req.body.startDate} 00:00:00`, 'Asia/Kolkata').utc().toDate();
      const endUTC = dayjs.tz(`${req.body.endDate} 23:59:59`, 'Asia/Kolkata').utc().toDate();

      // Sequelize query with UTC range
      const transactions = await KwikpayTXN.findAll({
        where: {
          createdAt: {
            [Op.between]: [startUTC, endUTC]
          }
        },
        order: [['createdAt', 'DESC']]
      });
      
      // console.log(transactions.length);
         
         res.status(200).json({data:transactions})

    }
    catch(err){
        console.log(err);
        res.status(505).json({status:505})

    }

}


const getMachineStatus=async(req,res)=>{
  try{
  
    const startUTC = dayjs.tz(`${req.body.startDate} 00:00:00`, 'Asia/Kolkata').utc().toDate();
    const endUTC = dayjs.tz(`${req.body.endDate} 23:59:59`, 'Asia/Kolkata').utc().toDate();

    // Sequelize query with UTC range
    const transactions = await  KwikpayMachineStatus.findAll({
      where: {
        createdAt: {
          [Op.between]: [startUTC, endUTC]
        },
     
      },
      order: [['createdAt', 'DESC']]
    });
    
    // console.log(transactions.length);
       
       res.status(200).json({data:transactions})

  }
  catch(err){
      console.log(err);
      res.status(505).json({status:505})

  }

}

const getNetFailData=async(req,res)=>{
  try{
  
    const startUTC = dayjs.tz(`${req.body.startDate} 00:00:00`, 'Asia/Kolkata').utc().toDate();
    const endUTC = dayjs.tz(`${req.body.endDate} 23:59:59`, 'Asia/Kolkata').utc().toDate();

    // Sequelize query with UTC range
    const transactions = await KwikNetPwFailReport.findAll({
      where: {
        createdAt: {
          [Op.between]: [startUTC, endUTC]
        },
        NetworkFailPeriod: {
          [Op.not]: null
        }
      },
      order: [['createdAt', 'DESC']]
    });
    
    // console.log(transactions.length);
       
       res.status(200).json({data:transactions})

  }
  catch(err){
      console.log(err);
      res.status(505).json({status:505})

  }

}

const getPowerFailData=async(req,res)=>{
  try{
  
    const startUTC = dayjs.tz(`${req.body.startDate} 00:00:00`, 'Asia/Kolkata').utc().toDate();
    const endUTC = dayjs.tz(`${req.body.endDate} 23:59:59`, 'Asia/Kolkata').utc().toDate();

    // Sequelize query with UTC range
    const transactions = await KwikNetPwFailReport.findAll({
      where: {
        createdAt: {
          [Op.between]: [startUTC, endUTC]
        },
        PowerFailPeriod: {
          [Op.not]: null
        }
      },
      order: [['createdAt', 'DESC']]
    });
    
    // console.log(transactions.length);
       
       res.status(200).json({data:transactions})

  }
  catch(err){
      console.log(err);
      res.status(505).json({status:505})

  }

}

module.exports={
  getTcResponse,
  getMachineStatus,
  getNetFailData,
  getPowerFailData
}