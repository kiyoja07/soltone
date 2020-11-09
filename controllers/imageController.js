import routes from "../routes";

// Home
export const home = (req, res) => {
    try {
      res.render("home", { pageTitle: "Home" });
    } catch (error) {
      console.log(error);
      res.render("home", { pageTitle: "Home" });
    }
};