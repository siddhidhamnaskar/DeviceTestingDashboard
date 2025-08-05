const {Op}=require("sequelize");
const moment=require("moment");
const dotenv=require('dotenv');
const {KwikpayTXN,KwikpayDevices,KwikNetPwFailReport,KwikpayMachineStatus}=require('../models');
const { parseMqttMessage } = require("./mqttMacMappingHandler");
dotenv.config();

function formatDateYYMMDDHHMMSS(date) {
    const pad = (n) => n.toString().padStart(2, '0');
    return (
        pad(date.getFullYear() % 100) +
        pad(date.getMonth() + 1) +
        pad(date.getDate()) +
        pad(date.getHours()) +
        pad(date.getMinutes()) +
        pad(date.getSeconds())
    );
}


const parseCustomTimestamp = (ts) => {
    const day = ts.slice(0, 2);
    const month = ts.slice(2, 4);
    const year = '20' + ts.slice(4, 6);
    const hour = ts.slice(6, 8);
    const minute = ts.slice(8, 10);
    const second = ts.slice(10, 12);

    return new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        parseInt(hour),
        parseInt(minute),
        parseInt(second)
    );
};

const getISTDateTime = () => {
    const now = new Date();
  
    const parts = new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      year: '2-digit',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).formatToParts(now);
  
    const map = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  
    return `${map.day}${map.month}${map.year}${map.hour}${map.minute}${map.second}`;
  };

module.exports.parse = (payload, mqttClient,topic) => {
    let cleanedStr =payload.toString().replace(/[*#]/g, '');
    parseInternal(cleanedStr,mqttClient,topic);
    // if (!/.*?(\*[0-9A-Za-z\,]*\#)+?.*?/gm.test(payload)) return;
    // var commands = [...payload.toString().matchAll(/.*?(\*[0-9A-Za-z\,]*\#)+?.*?/gm)].map(q => q[0]);
    // commands.forEach(cmd => {
    //     try {
    //         parseInternal(cmd, mqttClient,topic);
    //     } catch (ex) {
    //         console.log('Exception in MQTT:', ex);
    //     }
    // })
}

const parseInternal = async(payload, mqttClient,topic) => {
    // 'Parsing message - ' + payload
    try {
        // var cleaned = /^\**(.*?)\#*$/.exec(payload)[1];
        // var parts = cleaned.split(',');
        // // console.log(parts);

        const input = payload
        parseMqttMessage(input,mqttClient,topic);
        const parts = input.split(','); // split into array by comma
        
        


        //  Join everything from the 2nd element onward
         const result = parts.slice(1).join(',');

         console.log(result); 
         await KwikpayTXN.create({
             deviceId:parts[0],
             TCResponse:result,
            
         });
        
         if(parts[1] && (parts[1].includes("MAC") || parts[1].includes("HBT")))
         {
              // program comes here when  MAC OR HBT is as input
            if(parts[1].includes("MAC"))
                {
                    
                        mqttClient.publish(`GVC/KP/${parts[0]}`,`*DATA:${getISTDateTime()}#`);
               
              
                }

            const data= await KwikpayMachineStatus.findOne({
                where:{MachineNumber:parts[0]}
        
            })

            if(!data)
            {
                 // program comes here when is serial number data is not exist
                await KwikpayMachineStatus.create({
                    MachineNumber:parts[0],
                    LastHBT:new Date(),
                    Status:3,
                    DateTimeOfStatus:new Date(),
                
                })
                setTimeout(async()=>{
                    await KwikpayMachineStatus.create({
                        MachineNumber:parts[0],
                        LastHBT:new Date(),
                    
                    })
                },2000)
             
            }
            else if(data)
            {
                 // program comes here when is serial number data is exist
                const data1= await KwikpayMachineStatus.findAll({
                    where:{MachineNumber:parts[0]},
                    order: [['createdAt', 'DESC']],
                })
               if(data1[0])
               {
                // program comes here when is serial number data & last entry is exist
                var time = new Date() - new Date(data1[0].LastHBT);
                var timeDiff = Math.floor(time / (1000 * 60));
                    console.log("TimeDiff is :",timeDiff)
                  if(data1[0].Status>0)
                    {
                         // program comes here when lastStatus is  not null & last entry is exist
                     await KwikpayMachineStatus.create({
                         MachineNumber:parts[0],
                         LastHBT:new Date(),
                         
                     })
                    
                    }
                    else{
                       
                        if(parts[1].includes("HBT") && timeDiff>process.env.TIME_DIFF)
                        {
                              // program comes here when HBT is as input & lastStatus is null & timeDiff is greater thar 5
                            console.log("Status is Null");
                            data1[0].Status=1;
                            data1[0].DateTimeOfStatus=new Date();
                            await data1[0].save();
                        }
                     
                        else if(parts[1].includes("MAC")){
                               // program comes here when Mac is as input & lastStatus is null
                            console.log("Status is Null");
                            data1[0].Status=2;
                            data1[0].DateTimeOfStatus=new Date(),
                            await data1[0].save();
                        }
                        else {
                             // program comes here lastStatus is null
                            console.log("Status is Null");
                            data1[0].LastHBT=new Date();
                            await data1[0].save();
                        }
                        
                    }

               }

             
            }
          
         }
 
       
        
        // if(parts[1] && parts[1].includes("NETWORKOKAY"))
        // {
        //     console.log("NETWORKOKAY RECEIVED");
        //     const lastEntry  = await KwikpayTXN.findOne({
        //         where: {
        //             deviceId: parts[0],
        //             TCResponse: {
        //                 [Op.like]: '%NONETWORK%'
        //             }
        //         },
        //         order: [['createdAT', 'DESC']],
              
        //     });
            
           
        //     if(lastEntry)
        //     {
        //         const partTimestamp = parts[2];
        //         const lastEntryTimestamp = lastEntry.TCResponse.split(",")[1];

        //         // Parse both timestamps into Date objects
        //         const date1 = parseCustomTimestamp(partTimestamp);
        //         const date2 = parseCustomTimestamp(lastEntryTimestamp);

        //         // Calculate difference
        //         const diffMs = Math.abs(date2 - date1); // milliseconds
        //         const diffSec = Math.floor(diffMs / 1000);
        //         const diffMin = Math.floor(diffSec / 60);
        //         console.log(diffMin);
        //         if (diffMin > 1 && diffMin < 30000000) {
        //             await KwikNetPwFailReport.create({
        //                 deviceId: parts[0],
        //                 NetworkFailPeriod: `${lastEntryTimestamp} to ${partTimestamp}`,
        //             });
        //         } else {
        //             console.log("🕒 1 minute or less.");
        //         }
        //     }
         

        // }

        // if(parts[1] && parts[1].includes("MAC"))
        //  {
        //     const now = new Date();

        //     // Get last TXN record for this device
        //     const lastTXN = await KwikpayTXN.findOne({
        //         where: { deviceId: parts[0], TCResponse: "HBT" },
        //         order: [['createdAt', 'DESC']],
        //     });
            
        //     if (lastTXN && lastTXN.createdAt) {
        //         const lastHBT = new Date(lastTXN.createdAt);
        //         const durationMs = now - lastHBT;
        //         const durationMinutes = durationMs / (1000 * 60);
            
        //         if (durationMinutes > 2) {
        //             // Check if there are NETWORKOKAY or NONETWORK entries after lastHBT
        //             const networkEntries = await KwikpayTXN.findOne({
        //                 where: {
        //                     deviceId: parts[0],
        //                     TCResponse: ["NETWORKOKAY", "NONETWORK"],
        //                     createdAt: {
        //                         [Op.gt]: lastHBT,
        //                         [Op.lte]: now,
        //                     },
        //                 },
        //             });
            
        //             if (!networkEntries) {
        //                 const period = `${getISTDateTime(lastHBT)} to ${getISTDateTime(now)}`;

        //                 await KwikNetPwFailReport.create({
        //                     deviceId: parts[0],
        //                     PowerFailPeriod: period,
        //                 });
            
        //                 console.log(`Power failure recorded for ${parts[0]}`);
        //             } else {
        //                 console.log(`Skipped power failure logging due to NETWORKOKAY or NONETWORK entry for ${parts[0]}`);
        //             }
        //         }
        //     }
            

        //       mqttClient.publish(`GVC/KP/${parts[0]}`,`*DATA:${getISTDateTime()}#`)
        //  }

      

      
    }
    catch(err)
    {
       console.log(err);
    }
}