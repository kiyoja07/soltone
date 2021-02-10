import dotenv from "dotenv";
import request from "request";

dotenv.config();

const blogClientID = process.env.NAVER_SEARCH_CLIENT_ID;
const blogClientSECRET = process.env.NAVER_SEARCH_CLIENT_SECRET;
const soltone_blog_url = "https://blog.naver.com/dukazzang";

let blogsFromNaver = [];


const replaceStr = str => {
    str = str.replace(/&gt;/g, '>');
    str = str.replace(/&lt;/g, '<');
    str = str.replace(/<b>/g, '');
    str = str.replace(/<\Wb>/g, '');
    str = str.replace(/`\`/g, '');
    return str
};

const getItem = json => {
  for (const key in json.items) { 
    const items = json.items[key];
    if (items.bloggerlink == soltone_blog_url) {
      let {
        title, link, description, bloggername, bloggerlink, postdate
      } = items;
      title = replaceStr(title);
      link = replaceStr(link);
      description = replaceStr(description);

      let blog = {}

      blog['title'] = title;
      blog['link'] = link;
      blog['description'] = description;
      blog['bloggername'] = bloggername;
      blog['bloggerlink'] = bloggerlink;
      blog['postdate'] = postdate;

      blogsFromNaver.push(blog);
    }
  }
  return blogsFromNaver
};

export const requestBlog = (req, res, next) => {
    const api_url = 'https://openapi.naver.com/v1/search/blog?query=' + encodeURI("솔톤세무회계"); // json 결과
    const options = {
        url: api_url,
        headers: {'X-Naver-Client-Id':blogClientID, 'X-Naver-Client-Secret': blogClientSECRET}
    };
    request.get(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            // res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
            // res.end(body);
            const json = JSON.parse(body) //json으로 파싱
            blogsFromNaver = getItem(json);
        } else {
          res.status(response.statusCode).end();
          console.log('error = ' + response.statusCode);
        }
        next();
    });
};





