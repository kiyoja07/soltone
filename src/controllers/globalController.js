import dotenv from 'dotenv';
import Airtable from 'airtable';
import routes from '../routes';

dotenv.config();

const mapAppKey = process.env.MAP_APP_KEY;
const kakaoMapApi = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${mapAppKey}&libraries=services,clusterer,drawing`;
const airTableBaseId = process.env.AIRTABLE_BASE_ID;
const airTableApiKey = process.env.AIRTABLE_API_KEY;

// Blogs
const handelRecord = (record) => {
  const blog = [];
  const maxTextLength = 160;
  const defaultImageUrl = 'https://kr.object.ncloudstorage.com/soltone/images/og_image_soltone.jpg';
  const regExp = /[**]|\\/g;

  blog.id = record.id;
  blog.title = record.get('title');

  // let description1 = record.get('description1').replace(/(\r\n\t|\n|\r\t)/gm,"");
  let description = record.get('description1');
  if (description.length >= maxTextLength) {
    description = `${description.substr(0, maxTextLength)} ...`;
  }
  blog.description = description.replace(regExp, '');

  if (record.get('image1')) {
    blog.image = record.get('image1')[0].url;
  } else if (record.get('image2')) {
    blog.image = record.get('image2')[0].url;
  } else if (record.get('image3')) {
    blog.image = record.get('image3')[0].url;
  } else if (record.get('image4')) {
    blog.image = record.get('image4')[0].url;
  } else if (record.get('image5')) {
    blog.image = record.get('image5')[0].url;
  } else {
    blog.image = defaultImageUrl;
  }

  return blog;
};

const requestAirtable = (blogType) => {
  const base = new Airtable({ apiKey: airTableApiKey }).base(airTableBaseId);
  const blogsFromAirtable = [];
  return new Promise((resolve, reject) => {
    base('blog').select({
      view: 'Grid view',
    }).eachPage((records, fetchNextPage) => {
      records.forEach((record) => {
        let blog;
        const status = record.get('status');
        if (blogType == 'home') {
          if (status == blogType) {
            blog = handelRecord(record);
            blogsFromAirtable.push(blog);
          }
        } else if (blogType == 'on') {
          if (status == blogType || status == 'home') {
            blog = handelRecord(record);
            blogsFromAirtable.push(blog);
          }
        }
      });

      fetchNextPage();
    }, (err) => {
      if (err) {
        console.error(err);
        reject();
      }
      resolve(blogsFromAirtable);
    });
  });
};

// Blogs
export const blogs = async (req, res) => {
  const metaDescription = '솔톤세무회계 블로그';
  const ogImageUrl = 'https://kr.object.ncloudstorage.com/soltone/images/og_image_soltone.jpg';
  try {
    const blogType = 'on';
    let blogs = await requestAirtable(blogType);
    blogs = blogs.reverse();
    res.render('blogs', {
      pageTitle: 'Blogs', canonicalUrl: routes.blogs, metaDescription, blogs, ogImageUrl,
    });
  } catch (error) {
    console.log(`res.render("blogs") error : ${error}`);
    res.redirect(routes.home);
  }
};

// Home
export const home = async (req, res) => {
  const metaDescription = '내 손 안의 세무 파트너 솔톤. 법인세, 소득세, 재산세, 양도세, 상속, 증여 등 각종 세무 상담 및 기장 대행';
  const ogImageUrl = 'https://kr.object.ncloudstorage.com/soltone/images/og_image_soltone.jpg';
  try {
    const maxBlog = 4;
    const blogType = 'home';
    let blogs = await requestAirtable(blogType);
    blogs = blogs.reverse().slice(0, maxBlog);
    res.render('home', {
      pageTitle: 'Home', canonicalUrl: routes.home, metaDescription, kakaoMapApi, blogs, ogImageUrl,
    });
  } catch (error) {
    console.log(`res.render("home") error : ${error}`);
    res.render('home', {
      pageTitle: 'Home', canonicalUrl: routes.home, metaDescription, kakaoMapApi: [], blogs: [], ogImageUrl,
    });
  }
};

// People
export const people = (req, res) => {
  const metaDescription = '솔톤세무회계 김덕화 세무사';
  const ogImageUrl = 'https://kr.object.ncloudstorage.com/soltone/images/og_image_soltone.jpg';
  try {
    res.render('people', {
      pageTitle: 'People', canonicalUrl: routes.people, metaDescription, ogImageUrl,
    });
  } catch (error) {
    console.log(`res.render("people") error : ${error}`);
    res.redirect(routes.home);
  }
};
