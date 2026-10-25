import { useState, useEffect } from "react";
import { Container, Row, Col, Button, Modal, Form } from "react-bootstrap";
import محتوى_الأجزاء from "./data/juzContent.js";

const رابط_جلب_التقدم = "https://qurrant.vercel.app/api/reading/get/progress"; // Sesuaikan dengan backend kamu

const HomePage = () => {
  const [النافذة_ظاهرة, ضبط_النافذة_ظاهرة] = useState(false);
  const [الجزء_المختار, ضبط_الجزء_المختار] = useState(null);
  const [قائمة_السور, ضبط_قائمة_السور] = useState([]);
  const [السورة, ضبط_السورة] = useState("");
  const [الحالة, ضبط_الحالة] = useState("Belum Dibaca");
  const [الملاحظة, ضبط_الملاحظة] = useState("");
  const [حالة_الأجزاء, ضبط_حالة_الأجزاء] = useState({});
  const [اسم_المستخدم, ضبط_اسم_المستخدم] = useState("Anonim");

  useEffect(() => {
    const رمز_المصادقة = localStorage.getItem("token");
    if (رمز_المصادقة) {
      try {
        const الرمز_المفكوك = JSON.parse(atob(رمز_المصادقة.split(".")[1]));
        ضبط_اسم_المستخدم(الرمز_المفكوك.username || "Anonim");
      } catch (الخطأ) {
        console.error("❌ Gagal decode token:", الخطأ);
      }
    }

    جلب_التقدم();
  }, []);

  const جلب_التقدم = async () => {
    try {
      const الاستجابة = await fetch(رابط_جلب_التقدم, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!الاستجابة.ok) throw new Error("Gagal mengambil data progress");

      const البيانات = await الاستجابة.json();
      const الحالة_المحدثة = {};

      البيانات.forEach((العنصر) => {
        الحالة_المحدثة[العنصر.juz] = { الحالة: العنصر.status, اسم_المستخدم: العنصر.username };
      });

      ضبط_حالة_الأجزاء(الحالة_المحدثة);
    } catch (الخطأ) {
      console.error("❌ Error mengambil data progress:", الخطأ);
    }
  };

  const فتح_النافذة = (رقم_الجزء) => {
    ضبط_الجزء_المختار(رقم_الجزء);
    const بيانات_الجزء_المختار = محتوى_الأجزاء.find((جزء) => جزء.الرقم === رقم_الجزء);
    ضبط_قائمة_السور(بيانات_الجزء_المختار ? بيانات_الجزء_المختار.السور : []);
  
    const البيانات_المحفوظة = حالة_الأجزاء[رقم_الجزء];
    if (البيانات_المحفوظة) {
      ضبط_السورة(البيانات_المحفوظة.السورة || "");
      ضبط_الحالة(البيانات_المحفوظة.الحالة || "Belum Dibaca");
      ضبط_الملاحظة(البيانات_المحفوظة.الملاحظة || "");
    } else {
      ضبط_السورة("");
      ضبط_الحالة("Belum Dibaca");
      ضبط_الملاحظة("");
    }
  
    ضبط_النافذة_ظاهرة(true);
  };  

  const إغلاق_النافذة = () => {
    ضبط_النافذة_ظاهرة(false);
    ضبط_الجزء_المختار(null);
  };

  const حفظ_التقدم = async () => {
    if (!الجزء_المختار) {
      console.error("❌ selectedJuz tidak boleh kosong!");
      return;
    }
  
    // Konversi status ke format yang diterima backend
    const خريطة_الحالات = {
      "Belum Dibaca": "belum_dibaca",
      "Sedang Dilakukan": "Sedang_dilakukan",
      "Selesai": "Selesai",
    };
  
    const بيانات_التقدم = {
      juz: String(الجزء_المختار),
      surah: السورة,
      status: خريطة_الحالات[الحالة] || "belum_dibaca", // Default jika status tidak cocok
      catatan: الملاحظة,
    };
  
    console.log("📌 Data yang dikirim ke backend:", JSON.stringify(بيانات_التقدم, null, 2));
  
    try {
      const رمز_المصادقة = localStorage.getItem("token");
      if (!رمز_المصادقة) {
        console.error("❌ Token tidak ditemukan, user belum login!");
        return;
      }
  
      const استجابة_الفحص = await fetch(`https://qurrant.vercel.app/api/reading/progress/${الجزء_المختار}`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${رمز_المصادقة}` },
      });
  
      const النتيجة = await استجابة_الفحص.json();
      console.log("📌 Response GET:", استجابة_الفحص.status, النتيجة);
  
      let الطريقة = "POST";
      let الرابط = "https://qurrant.vercel.app/api/reading/progress";
  
      if (استجابة_الفحص.ok && النتيجة.data && النتيجة.data.juz === String(الجزء_المختار)) {
        الطريقة = "PUT";
        الرابط = `https://qurrant.vercel.app/api/reading/progress/${الجزء_المختار}`;
      }
  
      const الاستجابة = await fetch(الرابط, {
        method: الطريقة,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${رمز_المصادقة}`,
        },
        body: JSON.stringify(بيانات_التقدم),
      });
  
      const بيانات_الاستجابة = await الاستجابة.json();
      console.log("📌 Response dari server:", بيانات_الاستجابة);
  
      if (!الاستجابة.ok) {
        throw new Error(`Gagal menyimpan progress: ${بيانات_الاستجابة.message || الاستجابة.statusText}`);
      }
  
      // Update state
      const الحالة_المحدثة = { ...حالة_الأجزاء, [الجزء_المختار]: { الحالة: بيانات_التقدم.status, اسم_المستخدم } };
      ضبط_حالة_الأجزاء(الحالة_المحدثة);
      localStorage.setItem(`juz_${الجزء_المختار}_progress`, JSON.stringify(بيانات_التقدم));
  
      إغلاق_النافذة();
    } catch (الخطأ) {
      console.error("❌ Error menyimpan progress:", الخطأ.message);
    }
  };
  
  return (
    <>
      <header className="header">
        <Container fluid className="p-0 m-0">
          <Row className="justify-content-center align-items-center w-100 m-0">
            <Col xs={12} className="text-center p-0">
              <div className="header-content">
                <h1 className="header-title">QURRANT</h1>
                <p className="header-subtitle">(Quran + Current)</p>
              </div>
            </Col>
          </Row>
        </Container>
      </header>
      <Container className="text-center mt-4">
        <h5 className="welcome fs-1 my-4 text-white">Selamat datang, {اسم_المستخدم}!</h5>
        <Row className="justify-content-center">
          {Array.from({ length: 30 }, (_, الفهرس) => {
            const رقم_الجزء = الفهرس + 1;
            const بيانات_الجزء = حالة_الأجزاء[رقم_الجزء] || { الحالة: "Belum Dibaca", اسم_المستخدم: "" };
            const نمط_الزر =
              بيانات_الجزء.الحالة === "Selesai"
                ? "success"
                : بيانات_الجزء.الحالة === "Sedang_dilakukan"
                ? "warning"
                : "secondary";
            return (
              <Col xs={4} sm={3} md={2} key={الفهرس} className="mb-3">
                <Button variant={نمط_الزر} className="w-100" onClick={() => فتح_النافذة(رقم_الجزء)}>
                  JUZ {رقم_الجزء}
                  <br />
                  <small>{بيانات_الجزء.اسم_المستخدم || "Belum ada"}</small>
                </Button>
              </Col>
            );
          })}
        </Row>
      </Container>
      <Modal show={النافذة_ظاهرة} onHide={إغلاق_النافذة} centered>
        <Modal.Header closeButton>
          <Modal.Title>Tambah Catatan untuk Juz {الجزء_المختار}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Juz</Form.Label>
              <Form.Control type="text" value={الجزء_المختار || ""} readOnly />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Surah</Form.Label>
              <Form.Select value={السورة} onChange={(الحدث) => ضبط_السورة(الحدث.target.value)}>
                <option value="">Pilih Surah</option>
                {قائمة_السور.map((سورة, الفهرس) => (
                  <option key={الفهرس} value={سورة}>{سورة}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status Juz</Form.Label>
              <Form.Select value={الحالة} onChange={(الحدث) => ضبط_الحالة(الحدث.target.value)}>
                <option>Belum Dibaca</option>
                <option>Sedang Dilakukan</option>
                <option>Selesai</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Catatan</Form.Label>
              <Form.Control as="textarea" rows={3} value={الملاحظة} onChange={(الحدث) => ضبط_الملاحظة(الحدث.target.value)} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={إغلاق_النافذة}>Batal</Button>
          <Button variant="primary" onClick={حفظ_التقدم}>Simpan</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default HomePage;


