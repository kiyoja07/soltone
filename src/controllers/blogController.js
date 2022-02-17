import routes from "../routes";
import { defaultOgImage } from "../middlewares";
import Blog from "../models/Blog";
import { ObjectId } from "bson";

const makeOgImage = (blog) => {
  if (blog.image1) {
    return blog.image1.split(",")[0];
  } else if (blog.image2) {
    return blog.image2.split(",")[0];
  } else if (blog.image3) {
    return blog.image3.split(",")[0];
  } else if (blog.image4) {
    return blog.image4.split(",")[0];
  } else if (blog.image5) {
    return blog.image5.split(",")[0];
  } else {
    return defaultOgImage;
  }
};

function dateFormat(date) {
  let month = date.getMonth() + 1;
  let day = date.getDate();
  // let hour = date.getHours();
  // let minute = date.getMinutes();
  // let second = date.getSeconds();

  month = month >= 10 ? month : "0" + month;
  day = day >= 10 ? day : "0" + day;
  // hour = hour >= 10 ? hour : "0" + hour;
  // minute = minute >= 10 ? minute : "0" + minute;
  // second = second >= 10 ? second : "0" + second;

  return (
    date.getFullYear() + "-" + month + "-" + day
    // +
    // " " +
    // hour +
    // ":" +
    // minute +
    // ":" +
    // second
  );
}

const handleBlog = (blogRaw) => {
  return {
    id: blogRaw._id,
    type: blogRaw.type,
    title: blogRaw.title,
    ogImageUrl: makeOgImage(blogRaw),
    description1: blogRaw.description1,
    description2: blogRaw.description2,
    description3: blogRaw.description3,
    description4: blogRaw.description4,
    description5: blogRaw.description5,
    outlink: blogRaw.outlink,
    postdate: dateFormat(blogRaw.postdate),
    image1: blogRaw.image1 ? blogRaw.image1.split(",") : [],
    image2: blogRaw.image2 ? blogRaw.image2.split(",") : [],
    image3: blogRaw.image3 ? blogRaw.image3.split(",") : [],
    image4: blogRaw.image4 ? blogRaw.image4.split(",") : [],
    image5: blogRaw.image5 ? blogRaw.image5.split(",") : [],
    tags: blogRaw.tags ? blogRaw.tags.split(",") : [],
  };
};

// Blog Detail
export const blogDetail = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    let blog = await Blog.findOne(
      { _id: ObjectId(id) },
      {
        _id: 1,
        type: 1,
        title: 1,
        image1: 1,
        description1: 1,
        image2: 1,
        description2: 1,
        image3: 1,
        description3: 1,
        image4: 1,
        description4: 1,
        image5: 1,
        description5: 1,
        outlink: 1,
        postdate: 1,
        tags: 1,
      }
    );

    if (blog.type == "outside") {
      throw "blog type is the outside";
    }

    blog = handleBlog(blog);

    res.render("blogDetail", {
      pageTitle: blog.title,
      canonicalUrl: routes.blogDetail(blog.id),
      metaDescription: blog.title,
      ogImageUrl: blog.ogImageUrl,
      blog,
    });
  } catch (error) {
    console.log(`render blogDetail error : ${error}`);
    res.redirect(routes.blogs);
  }
};
