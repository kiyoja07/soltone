import routes from "../routes";
import User from "../models/User";

// JOIN

export const getJoin = (req, res) => {
    res.render("join", { pageTitle: "Join" });
};
export const postJoin = (req, res) => {
    res.render("join", { pageTitle: "Join" });
}

// LOG IN

export const getLogin = (req, res) => {
    res.render("login", { pageTitle: "Login" });
};
export const postLogin = (req, res) => {
    res.redirect(routes.home);
};

// LOG OUT

export const logout = (req, res) => {
    // To Do : Process Log out
    res.redirect(routes.home);
};

// USER DETAIL

export const userDetail = (req, res) => {
    res.render("userDetail", { pageTitle: "User Detail" });
};
export const editProfile = (req, res) => {
    res.render("editProfile", { pageTitle: "Edit Profile" });
};