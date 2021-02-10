// Global
const HOME = "/";
const PEOPLE = "/people";
const SITEMAP = "/sitemap.xml";

// Blog
const BLOGS = "/blogs";
const BLOG_DETAIL = "/:id";

// Routes
const routes = {
  home: HOME,
  people: PEOPLE,
  sitemap: SITEMAP,

  blogs: BLOGS,
  blogDetail: (id) => {
    if (id) {
      return `/blogs/${id}`;
    } else {
      return BLOG_DETAIL;
    }
  },
};

export default routes;
