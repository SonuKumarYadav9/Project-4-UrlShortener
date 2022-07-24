const urlModels = require("../Models/urlModels");
const validUrl = require("valid-url");            //Package for validation of url
const shortid = require("shortid");                 // Package for Creating ShortUrl
const redis = require("redis");                     // Package to Connect with Redis
const baseUrl = "http://localhost:3000";
const { promisify  }= require("util");

//❌❌❌❌❌❌❌❌❌❌======CONNECTION TO REDIS======❌❌❌❌❌❌❌❌❌❌//


const redisClient = redis.createClient(
  17366,
  "redis-17366.c212.ap-south-1-1.ec2.cloud.redislabs.com",       //Connect to the Redis
  { no_ready_check: true }
);
redisClient.auth("OHOw51bzRM1A2iYXN2HYVaFNneeVqpOO", function (err) {
  if (err) throw err;
});
redisClient.on("connect", async function () {
  console.log("Connected to Redis..");
});
//1. connect to the server
//2. use the commands :
//Connection setup for redis
const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);               
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);

//❌❌❌❌❌❌❌❌❌❌======Create Shoten url ======❌❌❌❌❌❌❌❌❌❌//

const createUrl = async function (req, res) {
  try {
    const longUrl = req.body.longUrl.trim();

               if (!(Object.keys(req.body).length > 0)) {
               res.status(400).send("No Url Found");
    }
    if (validUrl.isUri(longUrl)) {
      const shortCode = shortid.generate();
           let checkUrl = await urlModels
              .findOne({ longUrl: longUrl })
              .select({ __v: 0, createdAt: 0, updatedAt: 0, _id: 0 });
      if (checkUrl) {
               return res.status(400).send({
               message: " You already created Short Url for this Long Url :",
               data: checkUrl,
               });
      } else {
              const shortUrl = baseUrl + "/" + shortCode;
              const storedData = { longUrl, shortUrl, urlCode: shortCode };
              let savedData = await urlModels.create(storedData);
              let finaldata = await urlModels.findById({ _id: savedData._id })
              .select({ __v: 0, createdAt: 0, updatedAt: 0, _id: 0 });
              res.status(201).send({
              status: true,
              msg: "Shorurl Created Succesfully",
              data: finaldata,
              });
     }
     }  else {
             return res.status(400)
             .send({ status: false, message: "Invalid Long Url" });
     }
  }     catch (err) {
             res.status(500).send(err.message);
  }
};

//❌❌❌❌❌❌❌❌❌❌======= Get Ridect By urlCode ======❌❌❌❌❌❌❌❌❌❌//

function x(data) {
  if (!data || data == null || data === undefined || data.trim()== 0)
    return false;
  return true;
}

const getUrl = async function (req, res) {
  try {
    let urlCode = req.params.urlCode;
    if (!x(urlCode))
      return res
        .status(400)
        .send({ status: false, message: "enter valid urlcode" });
    let cahcedUrlData = await GET_ASYNC(`${urlCode}`);
     let data = JSON.parse(cahcedUrlData);
    //if data present in cache
    if (cahcedUrlData) {
      res.redirect(`${data.longUrl}`, 302);
    } else {
      //if data is not there in cache
      let urlData = await urlModels.findOne({ urlCode: urlCode });
      if (!urlData) {
        return res
          .status(404)
          .send({
            status: false,
            msg: "This url does not exist please provide valid url  ",
          });
      }
      //setting data in cache
      await SET_ASYNC(`${urlCode}`, JSON.stringify(urlData));
      return res.redirect(`${urlData.longUrl}`, 302);
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

module.exports = { createUrl, getUrl };
