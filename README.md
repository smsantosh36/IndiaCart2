# DealLoop — Affiliate Marketing Website + Dashboard

Next.js (frontend) + Node.js API routes (backend, Next.js ke andar hi) se bana affiliate marketing site.

## Features

**Public site**
- Homepage: sab categories grid mein, click karke category page open hota hai
- Homepage par har category (jisme kam se kam 1 product ho) ke neeche uska title (H2) + "View all →" link aur us category ke products ek row mein dikhte hain:
  - Desktop: 7 products (8-10+ hone par row apne aap horizontal slider ban jaati hai)
  - Tablet: 5 products (6+ hone par slider)
  - Mobile: 2 products (3+ hone par slider)
  - Slider ko mouse/hover arrows se ya touch-swipe se scroll kiya ja sakta hai
- Category page: us category ke selected products dikhte hain — pehle **10 products** dikhte hain, scroll karte hi agle 10 apne aap load ho jaate hain (infinite scroll, loading spinner ke saath)
- Product page: `/pd/product-title` (clean URL, product ke title se banti hai) — image gallery, regular/sale price, auto-calculated discount %, short description, "Buy now" button (affiliate URL par redirect, `nofollow sponsored` ke saath), aur sabse neeche **share buttons** (WhatsApp, Facebook, X, Copy link) — share karne par title, price, aur pehli image (Open Graph tags se) automatically preview mein aa jaate hain
- Custom pages (About, Contact, etc.): direct root par khulte hain, e.g. `/about-us` (`/page/` prefix nahi hai)

**Dashboard login**
- `/dashboard` (aur uske andar ke saare pages) ab ek single login ke peeche protected hain
- Default credentials `.env.local` mein hain: username `admin`, password `admin123`
- **Live/production par daalne se pehle `.env.local` mein `DASHBOARD_USERNAME`, `DASHBOARD_PASSWORD`, aur `AUTH_SECRET` zaroor badal dein**
- Sidebar mein "Logout" button se session khatam kar sakte hain

**Dashboard** (`/dashboard`)
- **Banners (Advertisement)**: image banner upload karein (optional click-through link ke saath). Homepage par **har 3 category ke baad** "Advertisement" heading + "View all →" ke saath 4 banners dikhte hain, 5-8 hon to slider ban jaati hai, poori list `/banners` par. Dashboard → Settings mein ek **toggle** hai jisse chahe to ye poora section (homepage aur "View all" page dono jagah) band kiya ja sakta hai.
- **Videos**: Instagram Reels, YouTube, ya Pinterest ka koi bhi video URL paste karein — platform aur embed apne aap detect ho jaata hai (YouTube seedha iframe se, Instagram/Pinterest unke apne official embed widgets se — details neeche). Homepage par **har 2 category ke baad** "Videos" heading + "View all →" ke saath ek slider dikhta hai: mobile 2.5, tablet 4, desktop 8 videos ek saath — usse zyada (9-12) hon to row apne aap horizontal slider ban jaati hai. YouTube video ke button par "Subscribe" likha hota hai, baaki platforms par "Follow". Har video card mein embedded video, ek **Like** button (visitor click kar sakta hai), aur click counts dashboard mein dikhte hain.
- **Brands**: brand name, logo **upload**, description, SEO title/description. Products ko (Product form mein) optional taur par ek brand se link kar sakte hain. Homepage par category/coupon section ke neeche 6 brand logos + "View all →" dikhte hain (zyada hon to slider), poori list `/brands` par. Har brand ka apna page hai — `/b/brand-name` — jisme logo, description, aur us brand ke saare products dikhte hain.
- **Coupons**: brand naam, brand logo **upload**, discount text (e.g. "Flat 20% OFF"), coupon code, optional store/affiliate URL. Homepage par category grid ke neeche latest 4 coupons + "View all" dikhte hain, poori list `/coupons` par. Public side par code hidden rehta hai — "Show code" click karne par reveal hota hai (aur agar URL diya ho to store bhi naye tab mein khulta hai), phir ek tap mein **Copy** ho jaata hai.
- **Overview**: total categories, products, aur **total views + total affiliate clicks** ek nazar mein
- **Categories**: title, image **upload**, optional description, SEO title/description — list mein har category ke **total views** bhi dikhte hain
- **Products**: title, sale/regular price (discount % auto-calculate), short description, affiliate URL, multiple image **URLs** (paste, upload nahi), SEO title/description — list ab **category-wise grouped** hai, har product image thumbnail ke saath, aur **views**/**affiliate clicks** dono dikhte hain. **CSV import/export** bhi hai — "Export CSV" se sab products download karein, "Import CSV" se bulk products upload karein (format: `title,category,regularPrice,salePrice,shortDescription,affiliateUrl,images,seoTitle,seoDescription` — images multiple ho to `|` se separate karein; category naam se match hota hai, na mile to apne aap ban jaati hai).
- **Blog**: WordPress jaisi rich-text editor (bold, italic, headings, bullet/numbered lists, quote, links) ke saath blog posts likhein — featured image upload, content, SEO title/description. Homepage par latest 4 posts + "View all" dikhte hain, poori list `/blog` par.
- **Pages**: apne khud ke custom pages banayein (About, Contact, Privacy Policy, etc.) — title, content, aur apna SEO title/description. Ye root par direct live ho jaate hain (e.g. `/about-us`) aur footer mein automatically link ho jaate hain.
- **Settings**: nav bar ka logo image **upload** + Home page ka SEO title/description

## Tech stack

- **Next.js 14** (pages router) — frontend UI
- **Node.js API routes** (`pages/api/**`) — backend logic (Next.js khud Node.js par chalta hai)
- Data ek JSON file (`data/store.json`) mein store hota hai — koi database setup ki zaroorat nahi, MVP/local use ke liye.

## Setup

```bash
npm install
npm run dev
```

Phir browser mein kholein:
- Public site: http://localhost:3000
- Dashboard: http://localhost:3000/dashboard

## SEO tags aur server-side rendering

Home page, category pages, product pages (`/pd/...`), blog posts (`/blog/...`), aur custom pages (`/about-us` jaise) ab **server-side render (SSR)** hote hain — matlab jo SEO title/meta description aap dashboard mein daalte hain, wo seedha page ke initial HTML mein hi aa jaate hain (`getServerSideProps` ke zariye). Isse:
- "View page source" karne par SEO tags dikhte hain
- Search engines aur social share previews (WhatsApp, Facebook, Twitter) sahi title/description uthate hain
- Category aur product ke **view counts** bhi ab seedha server par (page load ke waqt) update hote hain, extra client request ki zaroorat nahi

Dashboard pages (`/dashboard/...`) waise hi client-side rehte hain, kyunki wahan SEO ki zaroorat nahi hoti.

## WhatsApp, Facebook, Threads par share karna

Har page ab **Open Graph** aur **Twitter Card** meta tags bhejta hai, isliye jab koi link WhatsApp/Facebook/Threads/Twitter par paste karega, uska title + description ka preview turant dikhega.

**Image preview ke liye ek zaroori baat:** WhatsApp/Facebook jaisi apps sirf ek real `http(s)://` image URL fetch kar sakti hain — base64 (upload ki hui) images inline preview mein show nahi hoti.
- **Product pages**: image preview kaam karega, kyunki product images pehle se hi pasted URLs hain (upload nahi).
- **Category images, blog featured images, aur nav logo**: ye sab dashboard se **upload** kiye jaate hain (base64), is liye inka link-preview image kaam nahi karega — sirf title/description hi dikhega. Agar in par bhi image preview chahiye, to future mein inhe (Vercel Blob jaisi) real image-hosting service se upload karwana hoga, base64 ki jagah.

**Setup:** `.env.local` mein `NEXT_PUBLIC_SITE_URL` apni live site ka URL daal dein (e.g. `https://dealloop.vercel.app`) — is se share links ka `og:url` sahi banega. Vercel par deploy karte waqt ye environment variable **Settings → Environment Variables** mein bhi add karein.

**Agar image preview phir bhi na dikhe:**
1. **Cache ka masla:** WhatsApp aur Facebook har URL ka preview **cache** karke rakhte hain. Agar aapne pehle (OG tags add hone se pehle) wo link kisi ko bheja tha, to purana (image-less) preview cache ho sakta hai. Isko refresh karne ke liye: [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) mein product ka URL daal kar **"Scrape Again"** click karein — WhatsApp bhi yehi cache use karta hai.
2. **Image URL check karein:** product mein pasted image URL browser mein directly khol kar dekhein ke wo seedha image load karta hai (kisi webpage ka link nahi). Kuch sites (jaise Google Images, Amazon ke kuch CDN links) crawler bots ko block kar dete hain — aisi site ki image preview mein kaam nahi karegi.
3. Image `https://` se shuru honi chahiye (`http://` ya koi relative path nahi).

## Mobile par slider ka hint

Homepage ke saare horizontal sliders (categories, products, blog, videos) mobile par **2.5 items** dikhate hain — aakhri item ka aadha hissa jaan-boojh kar cut hota hai, taake user ko pata chale ke ye scroll ho sakta hai (sirf 2 poore items dikhne se ye normal grid jaisa lagta tha aur scroll karne ka hint nahi milta tha).

## Autoplay

**YouTube** videos ab card mein khud-b-khud **autoplay + loop** hote hain (muted state mein — browsers bina user-interaction ke sound ke saath autoplay allow nahi karte). Har video ke player ke corner mein ek 🔇/🔊 button hai jisse visitor sound on/off kar sakta hai.

**Instagram aur Pinterest** ke liye autoplay force nahi kiya ja sakta — ye unke apne official embed widget ke control mein hota hai, aur ye platforms apni browser-autoplay-policy khud follow karte hain (aksar tap/click se hi play hota hai). Isse bypass karne ka koi supported tareeka nahi hai.

## Video embeds (Instagram/Pinterest "blocked content" fix)

YouTube seedha `<iframe>` se embed hota hai — Google ye allow karta hai. Lekin **Instagram aur Pinterest apne raw content ko iframe mein khulne se block kar dete hain** (X-Frame-Options), isi wajah se pehle "This content is blocked" wala error aata tha.

Fix: ab Instagram aur Pinterest ke liye unke **apne official embed widgets** use ho rahe hain:
- Instagram: `embed.js` script + `<blockquote className="instagram-media">` (Instagram ka khud ka tareeka)
- Pinterest: `pinit.js` script + `<a data-pin-do="embedPin">` (Pinterest ka khud ka tareeka)
- YouTube: **official IFrame Player API** (`youtube.com/iframe_api`) — isse autoplay/mute properly control hota hai, aur agar kisi video ka owner ne embedding disable ki ho, to broken player dikhne ki jagah automatically ek clean "Watch on YouTube" fallback dikhta hai.

Ye scripts sirf browser mein, sirf tab load hote hain jab us platform ka video card page par ho. Pehli render par card thoda khaali dikh sakta hai jab tak script load ho kar embed ko render na kar de (ye normal hai, thodi der mein reels/pin apne aap dikhne lagta hai).

**Agar embed (YouTube iframe ya Instagram/Pinterest widget) bilkul na dikhe:**
- Sabse common wajah **ad-blocker ya privacy extension** (uBlock Origin, Brave Shields, AdGuard, etc.) hai — ye by default third-party iframes (YouTube embed) aur external scripts (Instagram/Pinterest ke widget scripts) ko block kar dete hain. Test karne ke liye: **Incognito/Private window** mein (extensions off) ya kisi extension-free browser mein site kholein — agar wahan sahi dikhe, to confirm ho gaya ke extension hi wajah thi.
- Isi wajah se har video card ke neeche ab ek **"Watch on [Platform] ↗"** link hamesha dikhta hai, chahe embed load ho ya na ho — is se visitor original video/reel/pin tak har haal mein pahunch sakta hai.

## Page speed fix

Pehle har page load par **poora database** (sab categories/products/blogs/banners ke images base64 samet) fresh fetch hota tha — agar bahut saari images upload ho chuki hon, ye ek hi request kai MB ki ho sakti thi, jisse homepage bahut slow lagta tha ("category/product der se dikhna"). Teen fixes kiye hain:

1. **Images ab base64 ki jagah real hosted files hain** ([Vercel Blob](https://vercel.com/docs/storage/vercel-blob) se) — category, banner, blog featured image, aur nav logo, sab upload hone par ek chhota URL milta hai, poori image data JSON/HTML mein embed nahi hoti. Isse database chhota, fetch fast, aur page HTML halka ho jaata hai. **Bonus:** ab ye images WhatsApp/Facebook share preview mein bhi dikhengi (pehle base64 hone ki wajah se nahi dikhti thi).
2. **Homepage aur listing pages (blog, coupons, banners, videos) ab cached (ISR) hain** — har visitor ke liye fresh database fetch karne ki bajaye, page 30 second tak cache rehta hai aur background mein refresh hota hai. Matlab zyada tar visitors ko instant-load cached page milta hai. **Note:** dashboard mein koi bhi naya category/product/banner add karne ke baad, homepage par change dikhne mein **30 second tak** lag sakte hain (turant nahi) — ye is speed ke trade-off mein normal hai.
3. Category/product pages (jinka view-count track hota hai, isliye inhe live rehna zaroori hai) par ab view-count save hone ka **wait nahi karte** — page turant render ho jaata hai, count background mein save hota hai.

**Vercel Blob setup (Storage → Create → Blob):**
1. Vercel project → **Storage** tab → **Create Database → Blob** → project se connect karein.
2. `BLOB_READ_WRITE_TOKEN` env var apne aap add ho jaata hai.
3. Redeploy karein — ab naye upload real hosted URLs banenge. (Purani base64 images kaam karti rahengi, bas unhe dobara upload karne se speed aur behtar hogi.)

Local dev (`npm run dev`) mein Blob connect na ho to bhi sab chalta hai — bas images base64 mein hi save hoti hain jaise pehle hoti thi.

## Deploying to Vercel (important)

Vercel's serverless functions have a **read-only filesystem**, so the simple `data/store.json` file storage won't work there — you'll get errors like `Unexpected token '<', "<!DOCTYPE "... is not valid JSON` because a failed API call returns Vercel's HTML error page instead of JSON.

This project already handles that: it automatically uses **Upstash Redis** (a free serverless key-value store) when connected on Vercel, and falls back to the local `data/store.json` file when you run it on your own machine.

**Steps (matches the "Browse Storage" screen in your Vercel dashboard):**

1. In your Vercel project → **Storage** tab.
2. Under **Marketplace Database Providers**, click **Upstash** ("Serverless DB (Redis, Vector, Queue, Search)").
3. Choose **Redis**, create a database (pick a region close to your users), and connect it to this project.
4. Vercel will automatically add `KV_REST_API_URL` and `KV_REST_API_TOKEN` (or `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`) as environment variables — the code checks for either naming, so no manual setup needed there.
5. Also in **Storage**, click **Create Database → Blob** and connect it — this adds `BLOB_READ_WRITE_TOKEN` automatically (needed for fast image uploads, see "Page speed fix" above).
6. Also add `DASHBOARD_USERNAME`, `DASHBOARD_PASSWORD`, `AUTH_SECRET`, and `NEXT_PUBLIC_SITE_URL` under **Settings → Environment Variables** (copy the values from `.env.local`).
7. **Redeploy** the project.

**Note:** category images and the nav logo are stored as base64 inside this store. Keep them reasonably small (a few hundred KB) — Upstash's free tier has a total storage cap, and large images will use it up quickly. Product images already use pasted URLs, so they don't count against this.

Locally (`npm run dev` without these env vars set), everything keeps working exactly as before, using `data/store.json`.
