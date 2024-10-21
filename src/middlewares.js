import routes from "./routes";

export const localsMiddleware = (req, res, next) => {
  res.locals.siteName = "솔톤세무회계";
  res.locals.routes = routes;
  next();
};

// Meta Tag Info

// Default & Home Page
export const defaultOgImage =
  "https://kr.object.ncloudstorage.com/soltone/images/og_image_soltone.jpg";
export const defaultMetaDescription =
  "내 손 안의 세무 파트너 솔톤. 법인세, 소득세, 재산세, 양도세, 상속, 증여 등 각종 세무 상담 및 기장 대행";

// People Page
export const peoplePageTitle = "구성원";
export const peopleMetaDescription =
  "솔톤세무회계 김덕화 대표 세무사의 주요 경력과 학력을 소개합니다.";

// Blogs Page
export const blogsPageTitle = "블로그";
export const blogsMetaDescription =
  "세금과 관련된 다양하고 유용한 정보와 꿀팁들을 솔톤세무회계 김덕화 세무사가 쉽게 설명드립니다.";

// VIP Page
export const vipPageTitle = "VIP 재무리포트";
export const vipPageDescription =
  "사업과 개인 활동으로 발생하는 모든 자금 흐름을 통합 관리하는 서비스를 소개합니다.";
