import dotenv from 'dotenv';
import Airtable from 'airtable';
import routes from '../routes';

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
  const defaultImageUrl = 'https://kr.object.ncloudstorage.com/soltone/images/og_image_soltone.jpg';
  return new Promise((resolve, reject) => {
    base('blog').find(id, (err, record) => {
      const status = record.get('status');
      if (status == 'on' || status == 'home') {
        blog.id = record.id;
        blog.title = record.get('title');
        blog.description1 = record.get('description1').replace(regExp, '');
        blog.description2 = record.get('description2').replace(regExp, '');
        blog.description3 = record.get('description3').replace(regExp, '');
        blog.description4 = record.get('description4').replace(regExp, '');
        blog.description5 = record.get('description5').replace(regExp, '');

        blog.image1 = handleImage(record.get('image1'));
        blog.image2 = handleImage(record.get('image2'));
        blog.image3 = handleImage(record.get('image3'));
        blog.image4 = handleImage(record.get('image4'));
        blog.image5 = handleImage(record.get('image5'));

        blog.tags = record.get('tags');
        blog.postdate = record.get('postdate');

        if (record.get('image1')) {
          blog.ogImageUrl = record.get('image1')[0].url;
        } else if (record.get('image2')) {
          blog.ogImageUrl = record.get('image2')[0].url;
        } else if (record.get('image3')) {
          blog.ogImageUrl = record.get('image3')[0].url;
        } else if (record.get('image4')) {
          blog.ogImageUrl = record.get('image4')[0].url;
        } else if (record.get('image5')) {
          blog.ogImageUrl = record.get('image5')[0].url;
        } else {
          blog.ogImageUrl = defaultImageUrl;
        }
      }
      if (err) {
        console.error(err);
        reject();
      }
      resolve(blog);
    });
  });
};

// Blog Detail
export const blogDetail = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    const blog = await retrieveAirtable(id);
    const metaDescription = blog.title;
    const { ogImageUrl } = blog;
    res.render('blogDetail', {
      pageTitle: blog.title, canonicalUrl: routes.blogDetail(blog.id), metaDescription, blog, ogImageUrl,
    });
  } catch (error) {
    console.log(`render blogDetail error : ${error}`);
    res.redirect(routes.blogs);
  }
};