// ملاحظة: أسماء المتغيرات والدوال في هذا المشروع مكتوبة بالعربية الفصحى عن قصد.
// هذه ليست أخطاء ترميز، بل تسمية مقصودة ليقرأ الكود بالعربية.
// أما ما يُرسل إلى الخادم أو يُخزَّن (مفاتيح JSON، مفاتيح localStorage، المسارات)
// وأسماء المكوّنات وواجهات React والمكتبات فقد بقيت كما هي دون تغيير.

import axios from "axios";
// import axios from "./axiosInstance"; 



// ✅ Buat instance axios dengan baseURL
const واجهة_الخادم = axios.create({
  baseURL: "https://qurrant.vercel.app/api", // Sesuaikan dengan URL backend
  headers: { "Content-Type": "application/json" },
});

// 🔹 Interceptor untuk menyertakan token JWT jika ada
واجهة_الخادم.interceptors.request.use((الإعدادات) => {
  const رمز_المصادقة = localStorage.getItem("token");

  if (رمز_المصادقة) {
    console.log("✅ Menggunakan token:", رمز_المصادقة); // 🔍 Debug token
    الإعدادات.headers.Authorization = `Bearer ${رمز_المصادقة}`;
  } else {
    console.warn("⚠️ Tidak ada token! Pastikan sudah login.");
  }

  return الإعدادات;
});


// ✅ Fungsi untuk registrasi
export const تسجيل_مستخدم_جديد = async (اسم_المستخدم, البريد_الإلكتروني, كلمة_المرور) => {
  try {
    const الاستجابة = await واجهة_الخادم.post("/auth/register", {
      username: اسم_المستخدم,
      email: البريد_الإلكتروني,
      password: كلمة_المرور,
    });
    return الاستجابة.data;
  } catch (الخطأ) {
    throw الخطأ.response ? الخطأ.response.data : الخطأ;
  }
};

// ✅ Fungsi untuk login
export const تسجيل_الدخول = async (اسم_المستخدم, كلمة_المرور) => {
  try {
    const الاستجابة = await واجهة_الخادم.post("/auth/login", {
      username: اسم_المستخدم,
      password: كلمة_المرور,
    });
    return الاستجابة.data;
  } catch (الخطأ) {
    throw الخطأ.response ? الخطأ.response.data : الخطأ;
  }
};

export const إضافة_تقدم_القراءة = async ( الجزء, السورة,  الملاحظة) => {
  try {
    const الاستجابة = await واجهة_الخادم.post("/reading/progress", {
      juz: الجزء,
      surah: السورة, // Kirim null jika surah kosong
      catatan: الملاحظة,
    });
    console.log("✅ Data progress berhasil dikirim ke backend:", الاستجابة.data);
    return الاستجابة.data;
  } catch (الخطأ) {
    console.error("⚠ Gagal mengirim progress ke backend:", الخطأ.response?.data || الخطأ.message);
    throw الخطأ;
  }
};



/** ✅ Ambil Progress Membaca berdasarkan User ID */
export const جلب_تقدم_قراءة_المستخدم = async (معرف_المستخدم) => {
  try {
    if (!معرف_المستخدم) {
      throw new Error("❌ userId tidak ditemukan! Pastikan sudah login.");
    }

    console.log(`🔍 Mengambil progress untuk userId: ${معرف_المستخدم}`);
    const الاستجابة = await واجهة_الخادم.get(`/reading/progress/${معرف_المستخدم}`);
    return الاستجابة.data;
  } catch (الخطأ) {
    console.error("⚠️ Gagal mengambil progress:", الخطأ.response?.data || الخطأ.message);
    throw الخطأ.response ? الخطأ.response.data : الخطأ;
  }
};


/** ✅ Update Progress (Tandai Selesai + Edit Catatan) */
export const تحديث_تقدم_القراءة = async (المعرف, السورة, الحالة, الملاحظة) => {
  try {
    if (!المعرف) {
      throw new Error("❌ userId tidak ditemukan! Pastikan sudah login.");
    }

    const جسم_الطلب = {};
    if (المعرف) جسم_الطلب.id = المعرف
    if (السورة) جسم_الطلب.surah = السورة;
    if (الحالة) جسم_الطلب.status = الحالة;
    if (الملاحظة !== null) جسم_الطلب.catatan = الملاحظة;

    console.log(`🔄 Memperbarui progress:`, جسم_الطلب);
    const الاستجابة = await واجهة_الخادم.put(`/reading/progress/${المعرف}`, جسم_الطلب);
    return الاستجابة.data;
  } catch (الخطأ) {
    console.error("⚠️ Gagal memperbarui progress:", الخطأ.response?.data || الخطأ.message);
    throw الخطأ.response ? الخطأ.response.data : الخطأ;
  }
};

export default واجهة_الخادم;
