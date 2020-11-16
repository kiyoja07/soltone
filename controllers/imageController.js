import dotenv from "dotenv";
import routes from "../routes";

dotenv.config();

const mapKey = process.env.MAP_KEY;

// Home
export const home = (req, res) => {
    try {
      res.render("home", { pageTitle: "Home", mapKey});
      console.log(mapKey);
    } catch (error) {
      console.log(error);
      res.render("home", { pageTitle: "Home", mapKey });
    }
};