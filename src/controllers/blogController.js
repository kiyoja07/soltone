import dotenv from "dotenv";
import Airtable from "airtable";
import routes from "../routes";
import open from "open";
// import { openInNewTab } from "../assets/js/openInNewTab";
import { defaultOgImage } from "../middlewares";

dotenv.config();

const airTableBaseId = process.env.AIRTABLE_BASE_ID;
const airTableApiKey = process.env.AIRTABLE_API_KEY;

const handleImage = (images) => {
  const imageUrl = [];
  if (images) {
    images.forEach((image) => {
      imageUrl.push(image.url);
    });
  }
  return imageUrl;
};

const retrieveAirtable = (id) => {
  const base = new Airtable({ apiKey: airTableApiKey }).base(airTableBaseId);
  const blog = [];
  const regExp = /[**]|\\/g;
  return new Promise((resolve, reject) => {
    base("blog").find(id, (err, record) => {
      const type = record.get("type");

      if (type == "inside") {
        const status = record.get("status");
        if (status == "on" || status == "home") {
          blog.id = record.id;

          blog.title = record.get("title");
          blog.description1 = record.get("description1").replace(regExp, "");
          blog.description2 = record.get("description2").replace(regExp, "");
          blog.description3 = record.get("description3").replace(regExp, "");
          blog.description4 = record.get("description4").replace(regExp, "");
          blog.description5 = record.get("description5").replace(regExp, "");

          blog.image1 = handleImage(record.get("image1"));
          blog.image2 = handleImage(record.get("image2"));
          blog.image3 = handleImage(record.get("image3"));
          blog.image4 = handleImage(record.get("image4"));
          blog.image5 = handleImage(record.get("image5"));

          blog.tags = record.get("tags");
          blog.postdate = record.get("postdate");

          if (record.get("image1")) {
            blog.ogImageUrl = record.get("image1")[0].url;
          } else if (record.get("image2")) {
            blog.ogImageUrl = record.get("image2")[0].url;
          } else if (record.get("image3")) {
            blog.ogImageUrl = record.get("image3")[0].url;
          } else if (record.get("image4")) {
            blog.ogImageUrl = record.get("image4")[0].url;
          } else if (record.get("image5")) {
            blog.ogImageUrl = record.get("image5")[0].url;
          } else {
            blog.ogImageUrl = defaultOgImage;
          }
        }
      } else if (type == "outside") {
        blog.link = record.get("link");
      }
      if (err) {
        console.error(err);
        reject();
      }
      resolve(blog);
    });
  });
};

// const openInNewTab = (url) => {
//   window.open(url, "_blank").focus();
// };

// Blog Detail
export const blogDetail = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    const blog = await retrieveAirtable(id);
    if (blog.link) {
      // openInNewTab(blog.link);
      await open(blog.link);
      // open(blog.link, function (err) {
      //   if (err) throw err;
      // });
      // res.redirect(routes.blogs);
    } else {
      res.render("blogDetail", {
        pageTitle: blog.title,
        canonicalUrl: routes.blogDetail(blog.id),
        metaDescription: blog.title,
        ogImageUrl: blog.ogImageUrl,
        blog,
      });
    }
  } catch (error) {
    console.log(`render blogDetail error : ${error}`);
    res.redirect(routes.blogs);
  }
};
