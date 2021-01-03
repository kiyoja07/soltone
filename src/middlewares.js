import multer from "multer";
import AWS from "aws-sdk";
import routes from "./routes";

const endpoint = new AWS.Endpoint('https://kr.object.ncloudstorage.com');
const region = 'kr-standard';
const access_key = process.env.NCLOUD_ACESS_KEY;
const secret_key = process.env.NCLOUD_SECRET_KEY;

const multerImage = multer({ dest: "uploads/images" });

// const s3 = new aws.S3({
//     accessKeyId: process.env.NCLOUD_ACESS_KEY,
//     secretAccessKey: process.env.NCLOUD_SECRET_KEY,
//     region: "kr-standard"
// });


const S3 = new AWS.S3({
    endpoint: endpoint,
    region: region,
    credentials: {
        accessKeyId : access_key,
        secretAccessKey: secret_key
    }
});

const bucket_name = 'soltone';

var params = {
    Bucket: bucket_name
};

export const localsMiddleware = (req, res, next) => {
    res.locals.siteName = "솔톤세무회계";
    res.locals.routes = routes;
    next();
};

export const uploadImage = multerImage.single("imageFile");









