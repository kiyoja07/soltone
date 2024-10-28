import { vipOgImage, vipPageDescription, vipPageTitle } from "../middlewares";
import routes from "../routes";

export const vipHome = (req, res) => {
  try {
    res.render("vipHome", {
      pageTitle: vipPageTitle,
      canonicalUrl: routes.vip,
      metaDescription: vipPageDescription,
      ogImageUrl: vipOgImage,
    });
  } catch (error) {
    console.log(`res.render("vip") error : ${error}`);
    res.redirect(routes.home);
  }
};

export const vipSample = (req, res) => {
  console.log("vipSample");
  try {
    res.render("vipSample", {
      pageTitle: vipPageTitle,
      canonicalUrl: `${routes.vip}${routes.sample}`,
      metaDescription: vipPageDescription,
      ogImageUrl: vipOgImage,
    });
  } catch (error) {
    console.log(`res.render("vipSample") error : ${error}`);
    res.redirect(routes.home);
  }
};
