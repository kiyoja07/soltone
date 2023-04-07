import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose.connect(
  // Local에서 mongodb가 세팅이 덜 되어 있어서 prod를 사용한다. <- read만 하므로 괜찮다.
  // process.env.PRODUCTION ? process.env.MONGO_URL_PROD : process.env.MONGO_URL,
  process.env.MONGO_URL_PROD,
  {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true,
  }
);

const db = mongoose.connection;

const handelOpen = () => console.log("✅ Connected to DB");
const handleError = (error) =>
  console.log(`❌ Error on DB Connections: ${error}`);

db.once("open", handelOpen);
db.on("error", handleError);
