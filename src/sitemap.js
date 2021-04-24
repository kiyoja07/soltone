import { SitemapStream, streamToPromise } from "sitemap";
import { createGzip } from "zlib";
import { Readable } from "stream";

import dotenv from "dotenv";
import Airtable from "airtable";

dotenv.config();

const airTableBaseId = process.env.AIRTABLE_BASE_ID;
const airTableApiKey = process.env.AIRTABLE_API_KEY;

let sitemap;

const requestAirtable = (baseName) => {
  const base = new Airtable({ apiKey: airTableApiKey }).base(airTableBaseId);
  const recordsFromAirtable = [];
  return new Promise((resolve, reject) => {
    base(baseName)
      .select({
        view: "Grid view",
      })
      .eachPage(
        (records, fetchNextPage) => {
          records.forEach((record) => {
            const status = record.get("status");
            const type = record.get("type");
            if ((status == "on" || status == "home") && type == "inside") {
              const { id } = record;
              recordsFromAirtable.push(id);
            }
          });

          fetchNextPage();
        },
        (err) => {
          if (err) {
            console.error(err);
            reject();
          }
          resolve(recordsFromAirtable);
        }
      );
  });
};

export const generateSitemap = async (req, res) => {
  res.header("Content-Type", "application/xml");
  res.header("Content-Encoding", "gzip");
  // if we have a cached entry send it
  if (sitemap) {
    res.send(sitemap);
    return;
  }
  try {
    const blogIds = await requestAirtable("blog");
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

    for (const id of blogIds) {
      const links = {
        url: `/blogs/${id}`,
        changefreq: "daily",
        priority: 0.8,
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
