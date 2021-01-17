import express from "express";
import dotenv from "dotenv";
import request from "request";


dotenv.config();

const app = express();

const blogClientID = process.env.NAVER_SEARCH_CLIENT_ID;
const blogClientSECRET = process.env.NAVER_SEARCH_CLIENT_SECRET;

// export  const blog = (req, res) => {
//     const api_url = 'https://openapi.naver.com/v1/search/blog?query=' + encodeURI("솔톤세무회계"); // json 결과
//     // var request = require('request');
//     const options = {
//         url: api_url,
//         headers: {'X-Naver-Client-Id':blogClientID, 'X-Naver-Client-Secret': blogClientSECRET}
//      };
//     request.get(options, function (error, response, body) {
//       if (!error && response.statusCode == 200) {
//         res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
//         res.end(body);
//       } else {
//         res.status(response.statusCode).end();
//         console.log('error = ' + response.statusCode);
//       }
//     });
// };


