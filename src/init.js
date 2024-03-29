import "@babel/polyfill";
import dotenv from "dotenv";
// import "./db";
import app from "./app";

import "./models/Blog";

dotenv.config();

const PORT = process.env.PORT || 3000;

const handleListening = () =>
  console.log(`✅ Listening on: http://localhost:${PORT}`);

app.listen(PORT, handleListening);
