<div dir="rtl">

# QURRANT 📖

**Qurrant** (*Quran + Current*) تطبيق ويب لتسجيل التقدّم في قراءة القرآن الكريم جزءًا جزءًا. يختار كل مستخدم الجزء، ويحدّد السورة التي يقرؤها، ويضع لها حالة، ويكتب ملاحظاته. وتظهر النتيجة مباشرة في الصفحة الرئيسية على شكل شبكة من ثلاثين جزءًا.

القراءة مستمرة والتقدّم محفوظ بترتيب، فلا مزيد من لحظات «أين وصلتُ بالأمس؟» 😄

## ✨ المزايا

- **إنشاء حساب وتسجيل الدخول**: التسجيل باسم المستخدم والبريد الإلكتروني وكلمة المرور، ثم الدخول. يُحفظ رمز JWT القادم من الخادم في `localStorage`.
- **شبكة الأجزاء الثلاثين**: تعرض الصفحة الرئيسية أزرار الأجزاء من 1 إلى 30 بألوان تدلّ على الحالة (رمادي = لم يُقرأ، أصفر = قيد القراءة، أخضر = مكتمل) مع اسم المستخدم الذي سجّلها.
- **تسجيل التقدّم لكل جزء**: عند الضغط على جزء يُفتح نموذج فيه اختيار السورة أو الآيات في ذلك الجزء، والحالة (*Belum Dibaca* أي لم يُقرأ، *Sedang Dilakukan* أي قيد القراءة، *Selesai* أي مكتمل)، وحقل للملاحظات. تُرسَل البيانات إلى الخادم (إنشاء جديد أو تحديث الموجود).
- **صفحة تفاصيل الجزء** (`/juz/:id`): قائمة سور الجزء مع حالة كل سورة وحقل للملاحظات.
- **لوحة المشرف** (`/adminpage`): جدول بتقدّم جميع المستخدمين (مجمّعًا حسب اسم المستخدم) وزرّ **Reset Semua Progress** لإعادة ضبط كل التقدّم. لا يفتح هذه الصفحة إلا حساب بدور `admin`.
- **تسجيل الخروج** من زرّ في شريط التنقّل.

## 🛠️ التقنيات المستخدمة

- [React 19](https://react.dev/) + [Vite 6](https://vite.dev/)
- [React Router 7](https://reactrouter.com/) للتنقّل وحماية صفحات المشرف
- [React Bootstrap](https://react-bootstrap.github.io/) + Bootstrap 5 للواجهة
- [Axios](https://axios-http.com/) و`fetch` لاستدعاء REST API
- [jwt-decode](https://github.com/auth0/jwt-decode) لقراءة بيانات المستخدم من الرمز
- ESLint

الخادم (REST API) في مستودع منفصل، وهذا المستودع يحتوي على الواجهة الأمامية فقط.

## 🚀 طريقة التشغيل

**المتطلبات:** Node.js الإصدار 18 أو أحدث، مع npm.

1. انسخ المستودع وادخل إلى مجلده:

   ```bash
   git clone https://github.com/Aisyhnabilaaa/Qurrant.git
   cd Qurrant
   ```

2. ثبّت الحزم:

   ```bash
   npm install
   ```

3. جهّز ملف `.env` في جذر المشروع:

   ```env
   VITE_API_BASE_URL=https://contoh-backend-kamu.example.com/api
   ```

   > **ملاحظة:** عنوان الخادم حاليًا مكتوب مباشرة في الشيفرة (`src/api/api.js` و`src/HomePage.jsx` و`src/admin/AdminPage.jsx`) ولا يُقرأ بعدُ من `VITE_API_BASE_URL`. إن أردت استخدام خادم آخر فعدّل العنوان في هذه الملفات أيضًا.

4. شغّل وضع التطوير:

   ```bash
   npm run dev
   ```

   افتح العنوان الذي يظهر في الطرفية (غالبًا `http://localhost:5173`).

أوامر أخرى متاحة:

| الأمر | الوظيفة |
| --- | --- |
| `npm run build` | بناء نسخة الإنتاج في مجلد `dist` |
| `npm run preview` | تشغيل نسخة البناء محليًا |
| `npm run lint` | فحص الشيفرة باستخدام ESLint |

## 🔌 نقاط الخادم المستخدمة

كل المسارات نسبية إلى عنوان الـAPI الأساسي (مثال: `https://contoh-backend-kamu.example.com/api`).

| الطريقة | المسار | الاستخدام |
| --- | --- | --- |
| `POST` | `/auth/register` | إنشاء حساب |
| `POST` | `/auth/login` | تسجيل الدخول، ويعيد الرمز والدور |
| `GET` | `/reading/get/progress` | جلب التقدّم لشبكة الأجزاء الثلاثين |
| `GET` | `/reading/progress/:id` | التحقّق من تقدّم موجود |
| `POST` | `/reading/progress` | حفظ تقدّم جديد |
| `PUT` | `/reading/progress/:id` | تحديث التقدّم |
| `GET` | `/reading` | تقدّم جميع المستخدمين (للمشرف) |
| `DELETE` | `/reading/progress` | إعادة ضبط كل التقدّم (للمشرف) |

الطلبات التي تحتاج إلى تسجيل دخول ترسل الترويسة `Authorization: Bearer <token>`.

## 📁 بنية المشروع

</div>

```
Qurrant/
├── public/                 # Logo & header images
├── src/
│   ├── api/
│   │   └── api.js          # Axios instance + register, login, progress
│   ├── Component/
│   │   ├── JuzPage.jsx     # Juz detail page (/juz/:id)
│   │   └── NavbarComponent.jsx
│   ├── admin/
│   │   ├── AdminPage.jsx   # Admin dashboard + reset progress
│   │   └── Beranda.jsx     # Admin juz grid (/beranda)
│   ├── data/
│   │   ├── juzContent.js   # Surahs/ayahs for each juz (1–30)
│   │   └── main.css        # Main styles
│   ├── App.jsx             # Routes
│   ├── HomePage.jsx        # Home: 30-juz grid + progress form
│   ├── LoginRegis.jsx      # Login & register form
│   ├── ProtectedRoute.jsx  # Role-based route guard
│   └── main.jsx            # React entry point
├── index.html
├── vite.config.js
└── package.json
```

<div dir="rtl">

## 🗺️ الصفحات

| المسار | الصفحة | الوصول |
| --- | --- | --- |
| `/` | الصفحة الرئيسية (شبكة الأجزاء) | الجميع |
| `/loginregis` | الدخول والتسجيل | الجميع |
| `/juz/:id` | تفاصيل الجزء | الجميع |
| `/adminpage` | لوحة المشرف | دور admin |
| `/beranda` | شبكة الأجزاء الخاصة بالمشرف | دور admin |

---

صُنع بفنجان قهوة ☕ وهمّة الختم على يد [Aisyhnabilaaa](https://github.com/Aisyhnabilaaa).

</div>
