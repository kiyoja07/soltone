import multer from "multer";
import routes from "./routes";

const multerImage = multer({ dest: "uploads/images" });

export const localsMiddleware = (req, res, next) => {
    res.locals.siteName = "솔톤세무회계";
    res.locals.routes = routes;
    next();
};

export const uploadImage = multerImage.single("imageFile");