# 솔톤세무회계 홈페이지 리팩토링 플랜

> **목표**: 현재의 `Express + Pug + Mongoose + Webpack/SCSS` 스택을
> **`Next.js + Prisma + TailwindCSS`** 로 리팩토링한다.
> **제약**: 현재 구현된 **모든 기능과 디자인을 100% 동일하게** 보존한다. (URL, SEO 메타,
> 리다이렉트 규칙, 외부 스크립트, 픽셀 단위 디자인까지)

---

## 1. 현재 아키텍처 분석 (As-Is)

| 영역 | 현재 구현 |
| --- | --- |
| 서버 | Express 4 (`src/app.js`, `src/init.js`) |
| 뷰 | Pug 템플릿 (`src/views/*`) — layouts / partials / mixins 구조 |
| 데이터 | MongoDB + Mongoose (`src/models/Blog.js`) — **읽기 전용** 조회만 사용 |
| 번들 | Webpack + Babel + SCSS → `static/styles.css`, `static/main.js` |
| 스타일 | SCSS 1,681줄 (config / partials / pages 구조) |
| 클라 JS | 바닐라 JS 7개 모듈 (map, typewriter, lazyloading, progressBar, topBtn, menuToggle, main) |
| 배포 | GCP App Engine (`app.yaml`, `runtime: nodejs20`) |
| 세션 | `express-session` + `connect-mongo` (현재 실제 사용처 없음 — 로그인 미구현) |

### 1.1 라우팅 (보존 대상)

| URL | 핸들러 | 동작 |
| --- | --- | --- |
| `GET /` | `home` | `status:"home"` 블로그 최신 4건, 카카오맵, 타자기 효과 |
| `GET /people` | `people` | 정적 소개 페이지 |
| `GET /blogs` | `blogs` | `status:["on","home"]` 블로그 목록 (record_id desc) |
| `GET /blogs/:bid` | `blogDetail` | 상세. **구 URL(61~64 시작) → 301 리다이렉트**, `type:"outside"` 차단 |
| `GET /vip` | `vipHome` | VIP 재무리포트 소개 |
| `GET /vip/sample` | `vipSample` | PDF iframe 임베드 |
| `GET /robots.txt` | inline | 텍스트 응답 |
| `GET /sitemap.xml` | `generateSitemap` | gzip XML, `status:["on","home"] + type:"inside"` |
| `*` (404) | inline | `/` 로 리다이렉트 |

### 1.2 보존해야 할 비즈니스 로직 (놓치기 쉬운 디테일)

- **구 URL 301 리다이렉트**: `bid`가 `61/62/63/64`로 시작하면 `blogsMapping`(`src/blogsMapping.js`)에서 새 `bid`를 찾아 `https://soltonetax.com/blogs/{bid}` 로 301 영구 리다이렉트.
- **`outside` 타입 차단**: 상세 페이지에서 `type === "outside"` 이면 `/blogs`로 리다이렉트.
- **이미지 파싱**: `image1`~`image5` 필드는 콤마 구분 문자열 → 배열로 분리, 목록에서는 첫 번째 이미지 사용. 없으면 기본 OG 이미지.
- **설명 가공**: 목록 카드 description은 HTML 태그 제거(`<[^>]*>` → `&nbsp`) 후 160자 컷.
- **날짜 포맷**: `postdate` → `YYYY-MM-DD`.
- **outlink 처리**: `outlink` 있는 블로그 카드는 새 탭(`target="_blank" rel="noopener noreferrer external"`)으로, 없으면 내부 상세 링크.
- **에러 핸들링**: 각 핸들러는 try/catch로 실패 시 홈 또는 블로그로 안전 리다이렉트.

### 1.3 SEO / 외부 연동 (보존 대상)

- Google Analytics (`G-9SVY2KLBTZ`), Naver Analytics (`wcs`, `9eaa3501e4e0d0`)
- 페이지별 메타(title/description/keywords), canonical(`https://soltonetax.com{path}`), Open Graph
- `naver-site-verification` 메타 (홈/공통 레이아웃)
- Google Fonts `Nunito`, favicon
- Kakao Map SDK (`MAP_APP_KEY` 환경변수), 카카오 채널 상담 버튼

---

## 2. 목표 아키텍처 (To-Be)

```
Next.js 15 (App Router, TypeScript)
├─ 데이터: Prisma (MongoDB 커넥터) → 기존 MongoDB를 그대로 읽기
├─ 스타일: TailwindCSS (SCSS 변수 → tailwind theme 이전)
├─ 폰트: next/font (Nunito)
├─ 이미지: next/image (lazyloading 대체) 또는 기존 IntersectionObserver 보존
├─ 메타: generateMetadata + app/sitemap.ts + app/robots.ts
└─ 배포: GCP App Engine (nodejs20, next start) — 또는 Vercel
```

### 2.1 핵심 기술 결정

**① 데이터베이스 — Prisma + MongoDB 커넥터 (권장)**
현재 데이터는 MongoDB에 존재하고 앱은 **읽기 전용**이다. Prisma는 MongoDB 커넥터를 정식
지원하므로, **기존 DB를 그대로 가리키면 데이터 마이그레이션이 전혀 필요 없다.** 이것이
"기능을 그대로 옮긴다"는 요구사항에 가장 안전하다.
- *대안(비권장)*: PostgreSQL로 이전 → 데이터 마이그레이션 + ObjectId/콤마문자열 스키마 재설계 필요 → 리스크 큼. 향후 관리자 CRUD가 필요해지면 재검토.

**② App Router 채택**: 서버 컴포넌트에서 직접 Prisma 조회 → 현재의 SSR 동작과 동일. 페이지별 `generateMetadata`로 SEO 메타를 그대로 재현.

**③ TailwindCSS 이전 전략**: SCSS 변수(`_variables.scss`)를 `tailwind.config`의 `theme.extend`로 이전하고, 1:1 픽셀 값을 유지. 복잡한 셀렉터(카카오맵 인포윈도우, 햄버거 토글 등)는 `globals.css`의 컴포넌트 클래스로 보존하여 **디자인 드리프트를 방지**한다. (전부 유틸리티로 무리하게 치환하지 않음)

---

## 3. 목표 디렉토리 구조

```
soltone-1/
├─ prisma/
│  └─ schema.prisma            # Blog 모델 (MongoDB 커넥터)
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx            # 루트 레이아웃 (GA, Naver, 폰트, 공통 meta)
│  │  ├─ page.tsx              # 홈 (/)
│  │  ├─ globals.css           # @tailwind + 보존용 컴포넌트 클래스
│  │  ├─ people/page.tsx       # /people
│  │  ├─ blogs/
│  │  │  ├─ page.tsx           # /blogs
│  │  │  └─ [bid]/page.tsx     # /blogs/:bid (+ 301 리다이렉트 로직)
│  │  ├─ vip/
│  │  │  ├─ layout.tsx         # VIP 전용 헤더 레이아웃
│  │  │  ├─ page.tsx           # /vip
│  │  │  └─ sample/page.tsx    # /vip/sample
│  │  ├─ sitemap.ts            # /sitemap.xml
│  │  └─ robots.ts             # /robots.txt
│  ├─ components/
│  │  ├─ layout/               # Header, HeaderVip, Footer, TopButton, ProgressBar
│  │  ├─ blog/                 # BlogBlock(카드)
│  │  └─ common/               # KakaoButton, StartButton, KakaoMap, Typewriter, PriceTable, LazyImage
│  ├─ lib/
│  │  ├─ prisma.ts             # PrismaClient 싱글톤
│  │  ├─ blog.ts               # 조회 + 가공 함수 (현 controller 로직 이전)
│  │  ├─ blogsMapping.ts       # 구 URL 매핑 테이블 (그대로 이전)
│  │  └─ meta.ts               # 메타데이터 상수 (현 middlewares.js 이전)
│  └─ types/blog.ts
├─ public/                     # favicon 등 정적 파일
├─ next.config.js
├─ tailwind.config.ts
├─ tsconfig.json
├─ package.json
└─ app.yaml                    # GCP App Engine 배포 설정 갱신
```

---

## 4. 라우팅 매핑 (Express → Next App Router)

| 기존 | Next.js | 비고 |
| --- | --- | --- |
| `GET /` | `app/page.tsx` (server) | Prisma로 home 블로그 4건 조회 |
| `GET /people` | `app/people/page.tsx` | 정적 |
| `GET /blogs` | `app/blogs/page.tsx` (server) | 목록 조회 |
| `GET /blogs/:bid` | `app/blogs/[bid]/page.tsx` (server) | `redirect()`로 301 + outside 차단 |
| `GET /vip` | `app/vip/page.tsx` | VIP 레이아웃 |
| `GET /vip/sample` | `app/vip/sample/page.tsx` | PDF iframe |
| `GET /robots.txt` | `app/robots.ts` | Next 메타 라우트 |
| `GET /sitemap.xml` | `app/sitemap.ts` | Next 메타 라우트(자동 XML). gzip은 Next/호스팅이 처리 |
| 404 → `/` | `app/not-found.tsx` + `redirect("/")` | 동일 동작 |

> **주의**: 기존 `/sitemap.xml`은 `connect-gzip`으로 직접 압축했다. Next `sitemap.ts`는 표준 XML을 반환하고 압축은 인프라(App Engine/Vercel)가 담당하므로 결과 URL/내용은 동일하게 유지된다.

---

## 5. 데이터 계층

### 5.1 Prisma 스키마 (`prisma/schema.prisma`)

```prisma
datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")   // 기존 MONGO_URL_PROD 값 사용
}

generator client {
  provider = "prisma-client-js"
}

model Blog {
  id           String   @id @default(auto()) @map("_id") @db.ObjectId
  record_id    Int
  bid          String
  status       String
  type         String
  title        String
  image1       String?
  description1 String?
  image2       String?
  description2 String?
  image3       String?
  description3 String?
  image4       String?
  description4 String?
  image5       String?
  description5 String?
  outlink      String?
  postdate     DateTime
  tags         String?
  modifiedAt   DateTime @default(now())
  createdAt    DateTime @default(now())

  @@map("blogs")   // Mongoose 기본 컬렉션명. 실제 컬렉션명 확인 후 확정
}
```

- **선행 확인 필요**: 실제 MongoDB 컬렉션명(`blogs` 추정)과 모든 문서가 위 필수 필드를 채우고 있는지(`record_id`, `status`, `type`, `title`, `postdate`). 누락 문서가 있으면 `prisma db pull`/예외 처리로 대응.
- `DATABASE_URL`에는 기존 `MONGO_URL_PROD` 값을 그대로 사용 (replica set 필요 시 `?replicaSet=` 확인 — Prisma MongoDB는 트랜잭션용 replica set을 권장하나 읽기 전용이라 단순 연결로 충분한지 검증).

### 5.2 조회 로직 이전 (`src/lib/blog.ts`)

현 `globalController.js` / `blogController.js` / `sitemap.js`의 쿼리·가공 함수를 그대로 이전:

| 함수 | Prisma 쿼리 |
| --- | --- |
| `getHomeBlogs()` | `findMany({ where:{status:"home"}, orderBy:{record_id:"desc"}, take:4 })` + `handleBlogsRaw` |
| `getAllBlogs()` | `findMany({ where:{status:{in:["on","home"]}}, orderBy:{record_id:"desc"} })` |
| `getBlogDetail(bid)` | `findFirst({ where:{bid} })` + outside/301 로직 |
| `getSitemapBlogs()` | `findMany({ where:{status:{in:["on","home"]}, type:"inside"}, select:{bid:true} })` |

`handleDescription`(태그제거+160컷), `handleBlogsRaw`, `makeOgImage`, `dateFormat`, 이미지 콤마 분리 등 **순수 가공 함수는 로직 변경 없이 그대로** 옮긴다.

---

## 6. 페이지/컴포넌트 매핑

### 6.1 레이아웃 (Pug layouts → React layouts)

| Pug | Next | 내용 |
| --- | --- | --- |
| `layouts/main.pug` | `app/layout.tsx` (루트) | GA·Naver 스크립트, Nunito 폰트, 공통 meta, Header+Footer+TopButton |
| `layouts/blogDetailMain.pug` | 루트 레이아웃 재사용 + 페이지 `generateMetadata` | 메타만 페이지별로 다름 |
| `layouts/vipMain.pug` | `app/vip/layout.tsx` | VIP 헤더 + 동일 푸터/스크립트 |

- GA/Naver/외부 스크립트는 `next/script`(strategy 적절히)로 이전.
- 공통 meta/keywords/OG는 루트 `metadata` + 페이지별 `generateMetadata`로 분리.

### 6.2 Partials/Mixins → 컴포넌트

| Pug | React 컴포넌트 | 클라이언트 여부 |
| --- | --- | --- |
| `partials/header.pug` | `Header` | client (햄버거 토글 상태) |
| `partials/headerVip.pug` | `HeaderVip` | client |
| `partials/footer.pug` | `Footer` | server |
| `mixins/blogBlock.pug` | `BlogBlock` | server |
| `mixins/kakaoBtn.pug` | `KakaoButton` | client (onclick window.open) |
| `mixins/startBtn.pug` / `sampleBtn.pug` | `StartButton` | client |
| `mixins/mapBlock.pug` | `KakaoMap` | client (SDK + next/script) |
| `mixins/priceTable.pug` | `PriceTable` | server (현재 홈에서 주석처리 상태 — 동일하게 미노출 유지) |

### 6.3 클라이언트 JS → React 매핑

| 기존 JS | 이전 방식 |
| --- | --- |
| `menuToggle.js` | `Header` 내부 `useState` 토글 + 바깥 클릭 닫기(`useEffect`/오버레이) |
| `typewriter.js` | `Typewriter` client 컴포넌트 (`typewriter-effect` 유지, `useEffect`) |
| `progressBar.js` | `ProgressBar` client 컴포넌트 (scroll 리스너) |
| `topBtn.js` | `TopButton` client 컴포넌트 (scroll 방향 감지 + 맨 위로) |
| `map.js` | `KakaoMap` client 컴포넌트 (`next/script`로 SDK 로드 후 init) |
| `lazyloading.js` | `next/image`로 대체(권장) **또는** 동일 IntersectionObserver 훅 보존 |
| `main.js` | 제거(번들 진입점 불필요) |

> **lazyloading 결정**: 디자인을 그대로 유지하려면 `next/image`의 자동 lazy + blur가 더 안전하고 성능도 우수. 단, 외부 CDN(`soltone.edge.naverncp.com`) 이미지는 `next.config.js`의 `images.remotePatterns`에 등록 필요. CDN 도메인 등록이 어려우면 기존 IntersectionObserver 방식을 훅으로 보존.

---

## 7. 스타일 이전 (SCSS → Tailwind)

1. **테마 이전**: `_variables.scss`의 색상/사이즈를 `tailwind.config.ts`의 `theme.extend.colors`, `spacing`, `fontFamily`로 등록.
   ```
   colors: { red:'#ea232c', darkRed:'#bb2f2a', soltoneBlack:'#334147',
             bgDark:'#2e394d', bgYellow:'rgb(245,241,237)', bgBlue:'#e1eaf4',
             textRed:'#f1574b', ... }
   fontFamily: { sans:['"Apple SD Gothic Neo"','Nunito','sans-serif'] }
   // header-height 64px 등은 spacing 또는 CSS 변수로
   ```
2. **reset.scss**: Tailwind `preflight`가 대부분 대체. 차이 나는 부분만 `globals.css`에 보존.
3. **페이지/파셜 SCSS**: 레이아웃·여백·타이포는 Tailwind 유틸리티로 치환. **복잡·고유 셀렉터**(햄버거 메뉴 애니메이션, 스크롤 progress bar, 카카오맵 인포윈도우 오버라이드, priceTable 반응형 `data-title`)는 `@layer components`로 `globals.css`에 원본 CSS를 보존하여 픽셀 동일성 확보.
4. **검증**: 각 페이지를 기존 사이트와 나란히 비교(스크린샷 diff). 모바일/데스크톱 반응형 분기(미디어쿼리) 동일 적용.

> 디자인 무손실이 최우선이므로, 무리한 전(全) 유틸리티화보다 "Tailwind 우선 + 복잡 부분 CSS 보존" 하이브리드를 채택한다.

---

## 8. SEO / 메타데이터 / 외부 스크립트

- **메타**: 페이지별 `generateMetadata`로 title/description/keywords/canonical/openGraph를 1:1 재현. 상수는 `lib/meta.ts`(현 `middlewares.js`)로 이전.
- **robots**: `app/robots.ts` → 기존 텍스트(`User-agent:* / Allow:/ / Sitemap:`) 동일 + `naver-site-verification` 메타 유지.
- **sitemap**: `app/sitemap.ts` → 정적 3개 URL + DB 블로그(`inside`) URL, 우선순위/주기 동일.
- **Analytics**: GA·Naver 스크립트 `next/script`로 이전(동일 ID).
- **favicon**: `public/`로 이동, App Router `icon` 컨벤션 또는 link 유지.

---

## 9. 환경변수 / 배포

| 항목 | 현재 | 변경 후 |
| --- | --- | --- |
| DB 접속 | `MONGO_URL_PROD` | `DATABASE_URL` (동일 값) |
| 카카오맵 | `MAP_APP_KEY` | `NEXT_PUBLIC_MAP_APP_KEY` (클라 노출 필요) |
| 세션 | `COOKIE_SECRET` | 제거 (미사용 기능) |
| 배포 | `app.yaml` nodejs20 + babel build | `app.yaml` nodejs20 + `next build`/`next start`, `npm start` 스크립트 갱신 |

- **`app.yaml`**: `runtime: nodejs20` 유지, `scripts.build`/`start`를 Next용으로 교체. App Engine standard에서 Next standalone 출력(`output:'standalone'`) 권장.
- *대안*: Vercel 배포 시 sitemap gzip·이미지 최적화 등 기본 제공으로 더 단순.
- 도메인(`soltonetax.com`)·CDN 이미지 URL은 변경 없음.

---

## 10. 단계별 실행 순서 (Phases)

**Phase 0 — 사전 확인** (구현 전)
- [ ] MongoDB 실제 컬렉션명/접속 문자열/replica set 여부 확인
- [ ] 모든 Blog 문서가 필수 필드 충족하는지 표본 검증
- [ ] 외부 CDN 이미지 도메인 `next/image` 등록 가능 여부 결정 (또는 IO 보존)

**Phase 1 — 스캐폴딩**
- [ ] Next.js(App Router, TS) + Tailwind + Prisma 초기화
- [ ] `tailwind.config` 테마 이전, `globals.css` 기본 구성
- [ ] `prisma.ts` 싱글톤, `schema.prisma` 작성, `prisma db pull`로 스키마 검증

**Phase 2 — 공통 레이아웃/컴포넌트**
- [ ] 루트 레이아웃(폰트/GA/Naver/meta) + Header/Footer/TopButton/ProgressBar
- [ ] VIP 레이아웃 + HeaderVip
- [ ] 공통 컴포넌트(KakaoButton, StartButton, BlogBlock)

**Phase 3 — 페이지 이전 (기능 동등성)**
- [ ] `/` 홈 (블로그4건, Typewriter, KakaoMap, 도서소개, 사무실 안내)
- [ ] `/people`, `/blogs`, `/blogs/[bid]`(+301/outside), `/vip`, `/vip/sample`
- [ ] `sitemap.ts`, `robots.ts`, `not-found`(→`/`)

**Phase 4 — 스타일 정밀 이전**
- [ ] 페이지별 SCSS → Tailwind/보존 CSS, 반응형 포함
- [ ] 기존 사이트와 스크린샷 비교 검증(데스크톱/모바일)

**Phase 5 — 마무리/배포**
- [ ] 환경변수 정리, `app.yaml`/스크립트 갱신
- [ ] 빌드·E2E 점검(모든 URL 200, 301, 메타, OG 확인)
- [ ] 구 패키지/Webpack/Pug/Express 제거

---

## 11. 검증 체크리스트 (기능/디자인 동등성)

- [ ] 6개 페이지 + robots/sitemap URL 모두 동일 응답
- [ ] 구 URL(61~64) → 301 → 새 bid 정상 (`blogsMapping`)
- [ ] `type:"outside"` 상세 접근 시 `/blogs` 리다이렉트
- [ ] 목록 카드: outlink 새 탭 / 내부 링크, 이미지 fallback, 160자 컷, 태그제거
- [ ] 홈: home 블로그 정확히 4건·정렬, 타자기 문구, 카카오맵 마커/인포윈도우, 도서 2종
- [ ] 메타(title/desc/keywords/canonical/OG), GA·Naver 태그, naver-site-verification
- [ ] sitemap 내용(정적3 + inside 블로그), robots 텍스트 동일
- [ ] 반응형(모바일 햄버거, priceTable data-title, progress bar, top 버튼) 동작
- [ ] 폰트/색상/여백 픽셀 비교 일치

## 12. 리스크 & 대응

| 리스크 | 대응 |
| --- | --- |
| Prisma MongoDB가 replica set 요구 | 읽기 전용이라 단순 연결 검증; 필요 시 접속 문자열에 replicaSet 명시 |
| 컬렉션 스키마 불일치(누락 필드) | 옵셔널 처리 + 표본 검증, `db pull` 결과 대조 |
| SCSS→Tailwind 디자인 드리프트 | 복잡 셀렉터 CSS 보존 + 스크린샷 diff 게이트 |
| 외부 CDN 이미지 최적화 제약 | `remotePatterns` 등록 또는 IO 방식 보존 |
| sitemap gzip 차이 | 인프라 레벨 압축으로 결과 동일, 내용 검증 |
| App Engine에서 Next 구동 | `output:'standalone'` + start 스크립트 검증, 필요 시 Vercel 고려 |

---

## 13. 미해결/결정 필요 사항

1. **DB 전략 최종 확정**: Prisma+MongoDB 커넥터(권장, 무마이그레이션) vs PostgreSQL 이전.
2. **배포 타깃**: 기존 GCP App Engine 유지 vs Vercel 전환.
3. **이미지 처리**: `next/image`(CDN 도메인 등록) vs 기존 IntersectionObserver 보존.
4. **세션/로그인 코드**: 현재 미사용 — 제거 확정 여부.
