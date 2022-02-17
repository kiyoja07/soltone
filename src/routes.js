// Global
const HOME = "/";
const PEOPLE = "/people";
const SITEMAP = "/sitemap.xml";
const LOGIN = "/login";

// Blog
const BLOGS = "/blogs";
const BLOG_DETAIL = "/:id";

// Routes
const routes = {
  home: HOME,
  people: PEOPLE,
  sitemap: SITEMAP,
  login: LOGIN,

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
