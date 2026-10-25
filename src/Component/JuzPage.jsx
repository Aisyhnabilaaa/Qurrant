import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Dropdown, Button } from "react-bootstrap";
import { jwtDecode } from "jwt-decode";
import محتوى_الأجزاء from "../data/juzContent";
import { جلب_تقدم_قراءة_المستخدم, إضافة_تقدم_القراءة, تحديث_تقدم_القراءة } from "../api/api";

const JuzPage = () => {
  const { id: رقم_الجزء } = useParams();
  const انتقل_إلى = useNavigate();
  const الجزء = محتوى_الأجزاء.find((عنصر) => عنصر.الرقم === Number(رقم_الجزء));

  const رمز_المصادقة = localStorage.getItem("token");
  const معرف_المستخدم = رمز_المصادقة ? jwtDecode(رمز_المصادقة).userId : null;

  const [حالات_السور, ضبط_حالات_السور] = useState(
    الجزء
      ? الجزء.السور.map((سورة) => ({
          الاسم: سورة,
          الحالة: "Belum Dibaca", // status default
        }))
      : []
  );
  const [الملاحظة, ضبط_الملاحظة] = useState("");
  const [رسالة_الحفظ, ضبط_رسالة_الحفظ] = useState("");
  const [الجزء_مكتمل, ضبط_الجزء_مكتمل] = useState(false);

  useEffect(() => {
    if (!الجزء || !معرف_المستخدم) return;

    const جلب_التقدم = async () => {
      try {
        console.log("🔍 Mengecek progress untuk userId:", معرف_المستخدم, "Juz:", رقم_الجزء);
    
        let الاستجابة = await جلب_تقدم_قراءة_المستخدم(معرف_المستخدم);
        console.log("📜 Response dari backend:", الاستجابة.data); // Debugging response
    
        let بيانات_التقدم = الاستجابة.data;
        let تقدم_الجزء = بيانات_التقدم.find((العنصر) => Number(العنصر.juz) === Number(رقم_الجزء));
    
        console.log("✅ Progress ditemukan:", تقدم_الجزء); // Debugging hasil pencarian
    
        if (!تقدم_الجزء) {
          console.log("🚀 Progress untuk Juz ini belum ada, membuat progress baru...");
    
          const تقدم_السور = الجزء.السور.reduce((المجمع, اسم_السورة) => {
            المجمع[اسم_السورة] = "Belum Dibaca";
            return المجمع;
          }, {});
    
          await إضافة_تقدم_القراءة(معرف_المستخدم, Number(رقم_الجزء), تقدم_السور, "");
    
          // Ambil ulang data progress setelah ditambahkan
          الاستجابة = await جلب_تقدم_قراءة_المستخدم(معرف_المستخدم);
          console.log("📜 Response setelah menambah progress:", الاستجابة.data); // Debugging response baru
    
          بيانات_التقدم = الاستجابة.data;
          تقدم_الجزء = بيانات_التقدم.find((العنصر) => Number(العنصر.juz) === Number(رقم_الجزء));
        }
    
        if (تقدم_الجزء) {
          ضبط_حالات_السور(
            الجزء.السور.map((سورة) => ({
              الاسم: سورة,
              الحالة: تقدم_الجزء.progress?.[سورة] || "Belum Dibaca",
            }))
          );
          ضبط_الملاحظة(تقدم_الجزء.catatan || "");
        }
      } catch (الخطأ) {
        console.error("⚠ Gagal mengambil progress:", الخطأ.response?.data || الخطأ.message);
      }
    };
    

    جلب_التقدم();
  }, [رقم_الجزء, معرف_المستخدم, الجزء]);

  useEffect(() => {
    const الكل_مكتمل = حالات_السور.every((سورة) => سورة.الحالة === "Selesai");
    ضبط_الجزء_مكتمل(الكل_مكتمل);
  }, [حالات_السور]);

  // const handleStatusChange = async (surahName, newStatus) => {
  //   setSurahStatus((prevStatus) =>
  //     prevStatus.map((s) => (s.name === surahName ? { ...s, status: newStatus } : s))
  //   );
  
  //   try {
  //     console.log(`📝 Mengupdate status surah "${surahName}" menjadi "${newStatus}" untuk Juz ${id}`);
  
  //     let response = await getUserReadingProgress(userId);
  //     let progressData = response.data;
  //     let juzProgress = progressData.find((item) => Number(item.juz) === Number(id));
  
  //     if (!juzProgress) {
  //       console.error("⚠ Progress tidak ditemukan! Tidak bisa update.");
  //       return;
  //     }
  
  //     console.log("📤 Mengirim request update:", {
  //       progressId: juzProgress.id,  // Pastikan ID ini benar
  //       userId,
  //       juzId: id,
  //       surahName,
  //       newStatus
  //     });
  
  //     await updateReadingProgress(juzProgress.id, surahName, newStatus);
  //   } catch (error) {
  //     console.error("⚠ Gagal memperbarui status:", error.response?.data || error.message);
  //   }
  // };
  
  const تغيير_حالة_السورة = async (اسم_السورة, الحالة_الجديدة) => {
    ضبط_حالات_السور((الحالات_السابقة) =>
      الحالات_السابقة.map((سورة) => (سورة.الاسم === اسم_السورة ? { ...سورة, الحالة: الحالة_الجديدة } : سورة))
    );
  
    try {
      console.log(`🔄 Mengupdate status surah "${اسم_السورة}" menjadi "${الحالة_الجديدة}"`);
      const الاستجابة = await تحديث_تقدم_القراءة(معرف_المستخدم, رقم_الجزء, اسم_السورة, الحالة_الجديدة);
      
      console.log("✅ Response dari server:", الاستجابة);
    } catch (الخطأ) {
      console.error("⚠ Gagal memperbarui status:", الخطأ);
    }
  };
  
  const حفظ_الملاحظة = async () => {
    try {
      console.log("💾 Menyimpan catatan...");

      let الاستجابة = await جلب_تقدم_قراءة_المستخدم(معرف_المستخدم);
      let بيانات_التقدم = الاستجابة.data;
      let تقدم_الجزء = بيانات_التقدم.find((العنصر) => Number(العنصر.juz) === Number(رقم_الجزء));

      if (!تقدم_الجزء) {
        console.log("🚀 Menambahkan progress baru sebelum menyimpan catatan...");
        const تقدم_السور = حالات_السور.reduce((المجمع, سورة) => {
          المجمع[سورة.الاسم] = سورة.الحالة;
          return المجمع;
        }, {});
        await إضافة_تقدم_القراءة(معرف_المستخدم, رقم_الجزء, تقدم_السور, الملاحظة);
      } else {
        console.log("✅ Progress sudah ada, hanya memperbarui catatan.");
        await تحديث_تقدم_القراءة(معرف_المستخدم, رقم_الجزء, null, null, الملاحظة);
      }

      ضبط_رسالة_الحفظ("Catatan berhasil disimpan!");
      setTimeout(() => ضبط_رسالة_الحفظ(""), 3000);
    } catch (الخطأ) {
      console.error("⚠ Gagal menyimpan catatan:", الخطأ);
    }
  };

  if (!الجزء) {
    return (
      <div className="container mt-5">
        <h1>Juz Tidak Ditemukan</h1>
        <p>Pastikan nomor Juz yang Anda masukkan benar.</p>
        <Button variant="secondary" onClick={() => انتقل_إلى("/")}>
          Kembali ke Homepage
        </Button>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h1>{الجزء.العنوان}</h1>
      <p className={"keterangan " + (الجزء_مكتمل ? "text-success fw-bold" : "text-muted")}>
        {الجزء_مكتمل ? "Juz ini telah selesai!" : "Belum selesai"}
      </p>

      <table className="table">
        <thead>
          <tr>
            <th>No</th>
            <th>Nama Surah</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {حالات_السور.map((سورة, الفهرس) => (
            <tr key={الفهرس}>
              <td>{الفهرس + 1}</td>
              <td>{سورة.الاسم}</td>
              <td>
                <Dropdown>
                  <Dropdown.Toggle variant={سورة.الحالة === "Selesai" ? "success" : "secondary"}>
                    {سورة.الحالة}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => تغيير_حالة_السورة(سورة.الاسم, "Belum Dibaca")}>
                      Belum Dibaca
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => تغيير_حالة_السورة(سورة.الاسم, "Sedang Membaca")}>
                      Sedang Membaca
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => تغيير_حالة_السورة(سورة.الاسم, "Selesai")}>
                      Selesai
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4">
        <h3>Catatan</h3>
        <textarea
          className="form-control"
          rows="4"
          placeholder="Tambahkan catatan untuk Juz ini..."
          value={الملاحظة}
          onChange={(الحدث) => ضبط_الملاحظة(الحدث.target.value)}
        />
        <Button variant="primary" className="mt-2" onClick={حفظ_الملاحظة}>
          Simpan Catatan
        </Button>
        {رسالة_الحفظ && <p className="text-success mt-2">{رسالة_الحفظ}</p>}
      </div>

      <Button variant="secondary" className="mt-3" onClick={() => انتقل_إلى("/")}>
        Kembali ke Homepage
      </Button>
    </div>
  );
};

export default JuzPage;
