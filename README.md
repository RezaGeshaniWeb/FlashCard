# FlashMaster

پلتفرم مدرن یادگیری با فلش‌کارت، مبتنی بر **یادآوری فعال (Active Recall)** و **تکرار فاصله‌دار (Spaced Repetition)**.

این مخزن شامل مستندات محصول در `context/` و اپلیکیشن Next.js در `project/` است.

---

## فهرست مطالب

1. [معرفی](#معرفی)
2. [ساختار مخزن](#ساختار-مخزن)
3. [اهداف محصول](#اهداف-محصول)
4. [مخاطبان](#مخاطبان)
5. [قابلیت‌های MVP](#قابلیت‌های-mvp)
6. [استک فناوری](#استک-فناوری)
7. [معماری](#معماری)
8. [ساختار پوشه‌ها (اپ)](#ساختار-پوشه‌ها-اپ)
9. [مسیرها (Routes)](#مسیرها-routes)
10. [API](#api)
11. [احراز هویت و امنیت](#احراز-هویت-و-امنیت)
12. [مدل داده و ذخیره محلی](#مدل-داده-و-ذخیره-محلی)
13. [الگوریتم SRS](#الگوریتم-srs)
14. [رابط کاربری و تم](#رابط-کاربری-و-تم)
15. [پیش‌نیازها](#پیش‌نیازها)
16. [راه‌اندازی](#راه‌اندازی)
17. [اسکریپت‌ها](#اسکریپت‌ها)
18. [متغیرهای محیطی](#متغیرهای-محیطی)
19. [حساب دمو](#حساب-دمو)
20. [قوانین توسعه](#قوانین-توسعه)
21. [تست](#تست)
22. [عیب‌یابی رایج](#عیب‌یابی-رایج)
23. [آینده محصول (خارج از MVP)](#آینده-محصول-خارج-از-mvp)
24. [مستندات منبع حقیقت](#مستندات-منبع-حقیقت)

---

## معرفی

**FlashMaster** به کاربران کمک می‌کند محتوا را در قالب فلش‌کارت بسازند، در دسته‌ها (Deck) سازمان‌دهی کنند، با جلسات مطالعه مرور کنند و پیشرفت خود را با آمار و استریک پیگیری کنند.

مشکلاتی که حل می‌کند:

- فراموشی سریع اطلاعات
- روش مطالعه ناکارآمد
- نبود زمان‌بندی مرور
- نبود دید شفاف از پیشرفت یادگیری

---

## ساختار مخزن

```text
FlashCard/
├── README.md          ← همین فایل
├── context/           ← مستندات محصول (فقط خواندنی / منبع حقیقت)
│   ├── project.md
│   ├── stack.md
│   ├── architecture.md
│   ├── features.md
│   ├── rules.md
│   └── ui.md
└── project/           ← ریشه اپلیکیشن Next.js (کد، تست، کانفیگ)
    ├── package.json
    ├── src/
    ├── data/          ← db.json (ذخیره محلی در زمان اجرا)
    ├── e2e/
    ├── public/
    └── ...
```

**قید مهم:** همه کد اپ، `package.json`، `node_modules` و کانفیگ‌ها فقط زیر `project/` هستند. از ریشه `FlashCard/` دستور `npm` اجرا نکنید.

---

## اهداف محصول

- افزایش کارایی یادگیری
- کاهش نرخ فراموشی
- تجربه مطالعه لذت‌بخش و سریع
- پشتیبانی از حفظ بلندمدت
- ردیابی پیشرفت و هدف روزانه/هفتگی

اصول محصول: **سادگی، سرعت، دسترسی‌پذیری، مقیاس‌پذیری معماری**.

---

## مخاطبان

| گروه | نیاز |
|------|------|
| دانش‌آموزان / دانشجویان | حفظ محتوای درسی |
| زبان‌آموزان | واژگان و مرور منظم |
| حرفه‌ای‌ها | آمادگی گواهینامه |
| خودآموزان | سیستم حفظ دانش |

---

## قابلیت‌های MVP

### احراز هویت
- ثبت‌نام، ورود، خروج
- فراموشی رمز + بازنشانی با توکن محلی (بدون ایمیل واقعی؛ مناسب دمو)
- Remember Me (کوکی ۷ روزه / ۳۰ روزه)
- پروفایل و تغییر رمز
- حذف حساب

### داشبورد
- مرورهای امروز
- استریک مطالعه
- دقت (Accuracy)
- دسته‌های اخیر
- هدف هفتگی
- فعالیت اخیر

### دسته‌ها (Decks)
- CRUD کامل
- آرشیو، علاقه‌مندی، کپی (Duplicate)
- جستجو، فیلتر، مرتب‌سازی، فیلتر برچسب

### فلش‌کارت‌ها
- CRUD
- برچسب، سطح سختی، راهنما، مثال، یادداشت
- نشانک (Bookmark)
- ایمپورت CSV / JSON / Markdown
- URL تصویر و صدا (اختیاری)

### مطالعه
- حالت‌ها: Practice، Review، Exam، Timed، Random، Sequential
- انیمیشن برگرداندن کارت
- رتبه‌بندی SRS: Again / Hard / Good / Easy
- میانبرهای صفحه‌کلید (Space، ۱–۴، B)
- پیشرفت جلسه، Retry کارت‌های غلط
- نشانک و یادداشت در حین مطالعه

### آمار
- نمودار فعالیت و دقت (Recharts)
- Heatmap، استریک، دستاوردها
- امتیاز حافظه (Memory Score)

### تنظیمات
- تم روشن / تاریک / سیستم
- زبان و منطقه زمانی (ذخیره در تنظیمات)
- اعلان‌ها (تاگل ذخیره‌شده؛ بدون ارسال واقعی)
- دسترسی‌پذیری (حرکت کمتر، متن بزرگ‌تر، کنتراست بالا)
- Export / Import داده
- حذف حساب

### جستجوی سراسری
- جستجوی دسته و کارت (از جمله با ⌘/Ctrl+K)

---

## استک فناوری

| لایه | فناوری |
|------|--------|
| فریم‌ورک | Next.js **16** (App Router) |
| UI | React **19**، TypeScript (strict) |
| استایل | Tailwind CSS **v4**، CVA، `tailwind-merge` |
| سرور استیت | TanStack Query |
| کلاینت استیت | Zustand |
| فرم | React Hook Form + Zod |
| HTTP | Axios + Route Handlers |
| احراز هویت | JWT (`jose`) + کوکی HTTP-only |
| نمودار | Recharts |
| آیکن | Lucide React |
| Toast | Sonner |
| تاریخ | date-fns |
| تست واحد | Vitest + Testing Library |
| E2E | Playwright |
| کیفیت کد | ESLint، Prettier، Husky |

---

## معماری

سبک: **Feature-Based Architecture** با App Router.

جریان داده معمول:

```text
Page (Server یا Client)
  → Hook / Server Action
    → Feature Service
      → Axios Client یا Route Handler
        → Store محلی (JSON) / منطق کسب‌وکار
```

جریان احراز هویت:

```text
Login → JWT → کوکی امن HTTP-only
  → Middleware اعتبارسنجی نشست
    → دریافت پروفایل → Dashboard
```

لایه‌ها:

- **Presentation:** `app/`، layouts، components
- **Business:** hooks، validation، permissions
- **Data:** services، TanStack Query، Route Handlers، store

---

## ساختار پوشه‌ها (اپ)

مسیر ریشه اپ: `project/src/`

```text
src/
├── app/                 # مسیرها، layout، API Route Handlers
│   ├── (app)/           # صفحات محافظت‌شده (dashboard, decks, study, ...)
│   ├── (auth)/          # login, register, forgot/reset password
│   └── api/             # REST محلی
├── components/
│   ├── providers/       # QueryClient، ThemeProvider
│   └── ui/              # دکمه، اینپوت، دیالوگ، Empty/Error، ...
├── features/            # هر فیچر: components / hooks / services
│   ├── auth/
│   ├── dashboard/
│   ├── decks/
│   ├── flashcards/
│   ├── search/
│   ├── settings/
│   ├── statistics/
│   └── study/
├── layouts/             # AppShell، Header، Sidebar
├── lib/                 # auth، store، api-helpers، schemas
├── services/            # api-client (Axios)
├── store/               # Zustand (مثلاً UI)
├── types/
├── utils/               # cn، srs، dates، export
└── constants/
```

---

## مسیرها (Routes)

| مسیر | توضیح |
|------|--------|
| `/` | لندینگ؛ در صورت لاگین → داشبورد |
| `/login` | ورود |
| `/register` | ثبت‌نام |
| `/forgot-password` | درخواست بازنشانی رمز |
| `/reset-password` | تنظیم رمز جدید با توکن |
| `/dashboard` | داشبورد |
| `/decks` | لیست دسته‌ها |
| `/decks/[id]` | جزئیات دسته + کارت‌ها |
| `/study/[deckId]` | جلسه مطالعه |
| `/statistics` | آمار |
| `/profile` | پروفایل |
| `/settings` | تنظیمات |

مسیرهای محافظت‌شده توسط Middleware به `/login` هدایت می‌شوند.

---

## API

پایه: `NEXT_PUBLIC_API_URL` (پیش‌فرض `/api`)

### Auth
| متد | مسیر | توضیح |
|-----|------|--------|
| POST | `/api/auth/register` | ثبت‌نام |
| POST | `/api/auth/login` | ورود (+ Remember Me) |
| POST | `/api/auth/logout` | خروج |
| GET | `/api/auth/me` | کاربر فعلی |
| PATCH | `/api/auth/profile` | به‌روزرسانی نام |
| POST | `/api/auth/change-password` | تغییر رمز |
| POST | `/api/auth/forgot-password` | ساخت توکن بازنشانی (دمو) |
| POST | `/api/auth/reset-password` | اعمال رمز جدید |
| DELETE | `/api/auth/account` | حذف حساب |

### Decks / Cards / Study / Stats / Settings / Search
- `/api/decks` و `/api/decks/[id]` (+ archive، duplicate، cards، import)
- `/api/cards/[id]` (+ bookmark، notes)
- `/api/study/[deckId]` (+ review، session)
- `/api/stats`، `/api/stats/activity`
- `/api/settings` (+ export، import)
- `/api/search`

پاسخ‌ها معمولاً به شکل `{ success, data, message?, error? }` هستند.

---

## احراز هویت و امنیت

- JWT با `jose`، امضاشده با `JWT_SECRET`
- ذخیره توکن در **کوکی HTTP-only** (`AUTH_STORAGE_KEY` / پیش‌فرض `flashmaster_token`)
- `sameSite=lax`؛ در production مقدار `secure=true`
- **هرگز** توکن یا رمز در `localStorage` ذخیره نمی‌شود
- `localStorage` فقط برای ترجیحات غیرحساس (تم، دسترسی‌پذیری)
- رمزها با `bcryptjs` هش می‌شوند
- Middleware مسیرهای اپ را محافظت می‌کند

### بازنشانی رمز (حالت دمو)
چون ایمیل واقعی وجود ندارد، پس از forgot-password اگر حساب وجود داشته باشد یک `resetToken` برمی‌گردد و کاربر می‌تواند به `/reset-password` برود.

---

## مدل داده و ذخیره محلی

بک‌اند این MVP یک **JSON Store** فایل‌محور است:

- فایل: `project/data/db.json`
- پیاده‌سازی: `src/lib/store.ts`
- موجودیت‌ها: Users، Decks، Flashcards، StudySessions

با اولین اجرا در صورت نبود فایل، دیتابیس seed می‌شود (کاربر دمو + چند دسته نمونه).

> مناسب توسعه و دموی محلی است؛ برای پروداکشن واقعی معمولاً به دیتابیس خارجی مهاجرت می‌شود.

---

## الگوریتم SRS

پیاده‌سازی الهام‌گرفته از SM-2 در `src/utils/srs.ts`:

| رتبه | اثر تقریبی |
|------|------------|
| Again | بازنشانی تکرار / بازه کوتاه |
| Hard | بازه کوتاه‌تر، ease کمتر |
| Good | پیشرفت استاندارد |
| Easy | بازه بلندتر + بونوس |

خروجی‌ها شامل `nextReviewAt`، `easeFactor`، `interval`، `repetitions` و `memoryScore` هستند.

---

## رابط کاربری و تم

- فونت: Inter
- توکن‌های رنگ: Primary، Secondary، Success، Warning، Danger، Info، Neutral
- تم: Light / Dark / System (Provider محلی با `useServerInsertedHTML` برای جلوگیری از هشدار React 19 درباره `<script>` داخل Client Component)
- حالت‌های خالی / لودینگ / خطا طبق `context/ui.md`
- انیمیشن‌ها: fade، slide، scale، flip کارت

---

## پیش‌نیازها

- **Node.js** 20+ (پیشنهادی LTS)
- **npm** 10+
- سیستم‌عامل: Windows / macOS / Linux

---

## راه‌اندازی

همه دستورها از پوشه `project/`:

```bash
cd project
cp .env.example .env.local
npm install
npm run dev
```

سپس مرورگر را باز کنید: [http://localhost:3000](http://localhost:3000)

بیلد پروداکشن:

```bash
cd project
npm run build
npm start
```

---

## اسکریپت‌ها

| دستور | کار |
|--------|-----|
| `npm run dev` | سرور توسعه (Turbopack) |
| `npm run build` | بیلد پروداکشن |
| `npm start` | اجرای بیلد |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |
| `npm test` | Vitest (watch) |
| `npm run test:run` | Vitest یک‌باره |
| `npm run test:coverage` | پوشش تست |
| `npm run test:e2e` | Playwright |

---

## متغیرهای محیطی

فایل نمونه: `project/.env.example`

| متغیر | نقش | نمونه |
|--------|-----|--------|
| `NEXT_PUBLIC_API_URL` | پایه API سمت کلاینت | `/api` |
| `NEXT_PUBLIC_APP_NAME` | نام اپ | `FlashMaster` |
| `AUTH_STORAGE_KEY` | نام کوکی JWT | `flashmaster_token` |
| `NEXT_PUBLIC_ENABLE_ANALYTICS` | فلگ آنالیتیکس | `false` |
| `JWT_SECRET` | کلید امضای JWT | مقدار امن در پروداکشن |

---

## حساب دمو

پس از seed اولیه:

| فیلد | مقدار |
|------|--------|
| Email | `demo@flashmaster.com` |
| Password | `password123` |

دسته‌های نمونه: Spanish Vocabulary، JavaScript Fundamentals، World Capitals.

---

## قوانین توسعه

خلاصه‌ای از `context/rules.md`:

- TypeScript strict؛ پرهیز از `any`
- Server Components به‌صورت پیش‌فرض؛ `"use client"` فقط در صورت نیاز
- کامپوننت‌ها ترجیحاً ≤ ۳۰۰ خط
- کلاینت مستقیماً به API نزند؛ از `services/` + hooks استفاده شود
- استایل فقط با Tailwind (تا حد ممکن)
- دسترسی‌پذیری: `aria-label`، label فرم، دیالوگ قابل کیبورد
- هر درخواست API: loading / error / retry
- نام‌گذاری: PascalCase برای کامپوننت، `useSomething` برای هوک

---

## تست

حداقل تست‌های واحد فعلی شامل:

- `src/utils/srs.test.ts` — منطق SRS
- `src/utils/export.test.ts` — JSON/CSV/Markdown
- `src/utils/cn.test.ts`
- `src/components/ui/Button.test.tsx`

E2E نمونه: `project/e2e/auth-smoke.spec.ts`

```bash
cd project
npm run test:run
npm run test:e2e   # نیاز به مرورگر Playwright
```

---

## عیب‌یابی رایج

### `Could not read package.json` در ریشه FlashCard
دستور را داخل `project/` اجرا کنید:

```bash
cd project
npm run dev
```

### هشدار script در ThemeProvider (نسخه‌های قدیمی)
نسخه فعلی از Provider محلی با `useServerInsertedHTML` استفاده می‌کند، نه `next-themes` منسوخ‌شده برای React 19.

### خطای `buttonVariants` روی Server Component
واریانت‌ها در `src/components/ui/button-variants.ts` (بدون `"use client"`) هستند؛ صفحات سرور از همین ماژول import کنند.

### هشدار deprecation مربوط به `middleware`
در Next.js 16 قرارداد `middleware` به سمت `proxy` می‌رود؛ فعلاً برای MVP کار می‌کند و مهاجرت اختیاری است.

### قفل npm روی Windows (`EEXIST` / `ENOTEMPTY`)
```bash
# بستن processهای node، حذف node_modules، سپس:
npm install --force
```

---

## آینده محصول (خارج از MVP)

طبق `context/project.md` و `features.md` — پیاده‌سازی نشده مگر صریحاً درخواست شود:

- تولید کارت با AI / توضیح AI
- صدای فلش‌کارت / OCR / Speech
- اپ موبایل و دسکتاپ
- آفلاین / PWA / Background Sync
- فضای تیمی، دسته اشتراکی، مارکت‌پلیس عمومی

---

## مستندات منبع حقیقت

قبل از تغییر بزرگ در محصول، این فایل‌ها را بخوانید:

| فایل | محتوا |
|------|--------|
| `context/project.md` | چشم‌انداز، ماژول‌ها، اهداف کسب‌وکار |
| `context/stack.md` | استک و env و اهداف پرفورمنس |
| `context/architecture.md` | معماری، routing، لایه‌ها |
| `context/features.md` | فهرست قابلیت‌ها و Future |
| `context/rules.md` | قوانین کدنویسی و امنیت |
| `context/ui.md` | سیستم طراحی و وضعیت‌های UI |

---

## مجوز و وضعیت

پروژه خصوصی آموزشی/محصولی در نسخه **0.1.0** است.

ساخته‌شده با Next.js 16، React 19 و TypeScript.
