// Global
const HOME = "/";
const PEOPLE = "/people";
const SITEMAP = "/sitemap.xml";
const LOGIN = "/login";

// Blog
const BLOGS = "/blogs";
const BLOG_DETAIL = "/:bid";

// VIP
const VIP = "/vip";
const SAMPLE = "/sample";

// Routes
const routes = {
  home: HOME,
  people: PEOPLE,
  sitemap: SITEMAP,
  login: LOGIN,

  blogs: BLOGS,
  blogDetail: (bid) => {
    if (bid) {
      return `/blogs/${bid}`;
    } else {
      return BLOG_DETAIL;
    }
  },
  vip: VIP,
  sample: SAMPLE,
};

export default routes;
