import dotenv from "dotenv";
import routes from "../routes";
import Blog from "../models/Blog";
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

const handleDescription = (descriptionRaw) => {
  const maxDescriptionLength = 160;
  const regExp = /<[^>]*>/g;
  let description = descriptionRaw.replace(regExp, "&nbsp");

  if (description.length >= maxDescriptionLength) {
    description = `${description.substr(0, maxDescriptionLength)} ...`;
  }
  return description;
};

const handleBlogsRaw = (blogsRaw) => {
  let handledBlogs = [];

  for (let blogRaw of blogsRaw) {
    let blog = {
      id: blogRaw._id,
      bid: blogRaw.bid,
      type: blogRaw.type,
      title: blogRaw.title,
    };

    if (blogRaw.image1) {
      blog.image = blogRaw.image1.split(",")[0];
    } else if (blogRaw.image2) {
      blog.image = blogRaw.image2.split(",")[0];
    } else if (blogRaw.image3) {
      blog.image = blogRaw.image3.split(",")[0];
    } else {
      blog.image = defaultOgImage;
    }

    if (blogRaw.description1) {
      blog.description = handleDescription(blogRaw.description1);
    } else if (blogRaw.description2) {
      blog.description = handleDescription(blogRaw.description2);
    }

    if (blogRaw.outlink) {
      blog.outlink = blogRaw.outlink;
    }

    handledBlogs.push(blog);
  }
  return handledBlogs;
};

// Blogs
export const blogs = async (req, res) => {
  try {
    const blogsRaw = await Blog.find(
      { status: { $in: ["on", "home"] } },
      {
        bid: 1,
        type: 1,
        title: 1,
        image1: 1,
        description1: 1,
        image2: 1,
        outlink: 1,
        record_id: 1,
      }
    ).sort({
      record_id: -1,
    });

    const blogs = handleBlogsRaw(blogsRaw);

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
    const blogsRaw = await Blog.find(
      { status: "home" },
      {
        bid: 1,
        type: 1,
        title: 1,
        image1: 1,
        description1: 1,
        image2: 1,
        outlink: 1,
        record_id: 1,
      }
    )
      .sort({
        record_id: -1,
      })
      .limit(4);

    const blogs = handleBlogsRaw(blogsRaw);

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

// Log In
export const login = (req, res) => {
  res.render("login", {});
};
