import { SitemapStream, streamToPromise } from "sitemap";
import { createGzip } from "zlib";
import { Readable } from "stream";
import Blog from "./models/Blog";

let sitemap;

export const generateSitemap = async (req, res) => {
  res.header("Content-Type", "application/xml");
  res.header("Content-Encoding", "gzip");
  // if we have a cached entry send it
  if (sitemap) {
    res.send(sitemap);
    return;
  }
  try {
    let blogs = await Blog.find(
      { status: { $in: ["on", "home"] }, type: "inside" },
      { _id: 1 }
    );

    const urls = [
      {
        url: "/",
        changefreq: "weekly",
        priority: 1.0,
        lastmod: Date.now(),
      },
      {
        url: "/people",
        changefreq: "monthly",
        priority: 0.6,
        lastmod: Date.now(),
      },
      {
        url: "/blogs",
        changefreq: "daily",
        priority: 0.4,
        lastmod: Date.now(),
      },
    ];

    for (const blog of blogs) {
      const links = {
        url: `/blogs/${blog._id}`,
        changefreq: "weekly",
        priority: 0.9,
        lastmod: Date.now(),
      };
      urls.push(links);
    }

    const smStream = new SitemapStream({
      hostname: "https://soltonetax.com/",
    });
    const pipeline = smStream.pipe(createGzip());

    Readable.from(urls).pipe(smStream);

    // cache the response
    streamToPromise(pipeline).then((sm) => (sitemap = sm));
    // make sure to attach a write stream such as streamToPromise before ending
    // smStream.end();
    // stream write the response
    pipeline.pipe(res).on("error", (e) => {
      throw e;
    });
  } catch (e) {
    console.error(e);
    res.status(500).end();
  }
};
