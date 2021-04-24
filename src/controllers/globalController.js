import dotenv from "dotenv";
import Airtable from "airtable";
import routes from "../routes";
import {
  defaultMetaDescription,
  defaultOgImage,
  blogsPageTitle,
  blogsMetaDescription,
  peoplePageTitle,
  peopleMetaDescription,
} from "../middlewares";

dotenv.config();

const mapAppKey = process.env.MAP_APP_KEY;
const kakaoMapApi = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${mapAppKey}&libraries=services,clusterer,drawing`;
const airTableBaseId = process.env.AIRTABLE_BASE_ID;
const airTableApiKey = process.env.AIRTABLE_API_KEY;

// Blogs
const handelRecord = (record) => {
  const blog = [];
  const maxTextLength = 160;
  const regExp = /[**]|\\/g;

  blog.id = record.id;
  blog.title = record.get("title");

  // let description1 = record.get('description1').replace(/(\r\n\t|\n|\r\t)/gm,"");
  let description = record.get("description1");
  if (description.length >= maxTextLength) {
    description = `${description.substr(0, maxTextLength)} ...`;
  }
  blog.description = description.replace(regExp, "");

  if (record.get("image1")) {
    blog.image = record.get("image1")[0].url;
  } else if (record.get("image2")) {
    blog.image = record.get("image2")[0].url;
  } else if (record.get("image3")) {
    blog.image = record.get("image3")[0].url;
  } else if (record.get("image4")) {
    blog.image = record.get("image4")[0].url;
  } else if (record.get("image5")) {
    blog.image = record.get("image5")[0].url;
  } else {
    blog.image = defaultOgImage;
  }

  return blog;
};

const requestAirtable = (blogType) => {
  const base = new Airtable({ apiKey: airTableApiKey }).base(airTableBaseId);
  const blogsFromAirtable = [];
  return new Promise((resolve, reject) => {
    base("blog")
      .select({
        view: "Grid view",
      })
      .eachPage(
        (records, fetchNextPage) => {
          records.forEach((record) => {
            let blog;
            const status = record.get("status");
            const type = record.get("type");
            if (blogType == "home") {
              if (status == blogType) {
                blog = handelRecord(record);
                blogsFromAirtable.push(blog);
              }
            } else if (blogType == "on") {
              if (status == blogType || status == "home") {
                blog = handelRecord(record);
                blogsFromAirtable.push(blog);
              }
            }
          });

          fetchNextPage();
        },
        (err) => {
          if (err) {
            console.error(err);
            reject();
          }
          resolve(blogsFromAirtable);
        }
      );
  });
};

// Blogs
export const blogs = async (req, res) => {
  try {
    const blogType = "on";
    let blogs = await requestAirtable(blogType);
    blogs = blogs.reverse();
    res.render("blogs", {
      pageTitle: blogsPageTitle,
      canonicalUrl: routes.blogs,
      metaDescription: blogsMetaDescription,
      ogImageUrl: defaultOgImage,
      blogs,
    });
  } catch (error) {
    console.log(`res.render("blogs") error : ${error}`);
    res.redirect(routes.home);
  }
};

// Home
export const home = async (req, res) => {
  try {
    const maxBlog = 4;
    const blogType = "home";
    let blogs = await requestAirtable(blogType);
    blogs = blogs.reverse().slice(0, maxBlog);
    res.render("home", {
      canonicalUrl: routes.home,
      metaDescription: defaultMetaDescription,
      kakaoMapApi,
      blogs,
      ogImageUrl: defaultOgImage,
    });
  } catch (error) {
    console.log(`res.render("home") error : ${error}`);
    res.render("home", {
      canonicalUrl: routes.home,
      metaDescription: defaultMetaDescription,
      kakaoMapApi: [],
      blogs: [],
      ogImageUrl: defaultOgImage,
    });
  }
};

// People
export const people = (req, res) => {
  try {
    res.render("people", {
      pageTitle: peoplePageTitle,
      canonicalUrl: routes.people,
      metaDescription: peopleMetaDescription,
      ogImageUrl: defaultOgImage,
    });
  } catch (error) {
    console.log(`res.render("people") error : ${error}`);
    res.redirect(routes.home);
  }
};
