import React, { useState, useEffect, useCallback } from "react";
import { Table, Container, Button } from "react-bootstrap";
import axios from "axios";

const AdminPage = () => {
  const [بيانات_المستخدمين, ضبط_بيانات_المستخدمين] = useState([]);
  const رمز_المصادقة = localStorage.getItem("token");

  const جلب_المستخدمين = useCallback(async () => {
    try {
      const الاستجابة = await axios.get("https://qurrant.vercel.app/api/reading", {
        headers: { Authorization: `Bearer ${رمز_المصادقة}` },
      });

      console.log("✅ Data dari Backend:", الاستجابة.data);
      ضبط_بيانات_المستخدمين(الاستجابة.data);
    } catch (الخطأ) {
      console.error("❌ Gagal mengambil data pengguna:", الخطأ);
    }
  }, [رمز_المصادقة]);

  useEffect(() => {
    جلب_المستخدمين();
  }, [جلب_المستخدمين]);

  // 🔹 Kelompokkan data berdasarkan username
  const المستخدمون_المجمعون = بيانات_المستخدمين.reduce((المجمع, الحالي) => {
    const اسم_المستخدم = الحالي.user.username;

    if (!المجمع[اسم_المستخدم]) {
      المجمع[اسم_المستخدم] = {
        اسم_المستخدم: اسم_المستخدم,
        القراءات: [],
      };
    }

    المجمع[اسم_المستخدم].القراءات.push({
      الجزء: الحالي.juz,
      السورة: الحالي.surah,
      الملاحظة: الحالي.catatan,
    });

    return المجمع;
  }, {});


// 🔄 Fungsi untuk reset semua progress membaca
const إعادة_ضبط_التقدم = async () => {
  const النافذة = document.createElement("div");
  النافذة.className = "modal-backdrop d-flex align-items-center justify-content-center";
  النافذة.style.position = "fixed";
  النافذة.style.top = 0;
  النافذة.style.left = 0;
  النافذة.style.width = "100vw";
  النافذة.style.height = "100vh";
  النافذة.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  النافذة.style.zIndex = 1050;

  النافذة.innerHTML = `
    <div class="modal-dialog modal-dialog-centered" style="background: white; border-radius: 8px; padding: 20px; max-width: 400px;">
      <div class="modal-content border-0">
        <div class="modal-header border-0">
          <h5 class="modal-title">Konfirmasi Reset Progress</h5>
        </div>
        <div class="modal-body text-center">
          <p class="mb-3">⚠ Apakah Anda yakin ingin menghapus semua progress membaca?</p>
        </div>
        <div class="modal-footer border-0 d-flex justify-content-between">
          <button id="cancel-reset" class="btn btn-secondary">Tidak</button>
          <button id="confirm-reset" class="btn btn-danger">Ya</button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(النافذة);

  return new Promise((إتمام) => {
    document.getElementById("confirm-reset").onclick = async () => {
      document.body.removeChild(النافذة);

      try {
        const الاستجابة = await axios.delete("https://qurrant.vercel.app/api/reading/progress", {
          headers: { Authorization: `Bearer ${رمز_المصادقة}` },
        });

        alert(الاستجابة.data.message);
        جلب_المستخدمين(); // Refresh data setelah reset
        إتمام();
      } catch (الخطأ) {
        console.error("❌ Gagal menghapus progress:", الخطأ);
        alert("Gagal menghapus progress!");
        إتمام();
      }
    };

    document.getElementById("cancel-reset").onclick = () => {
      document.body.removeChild(النافذة);
      إتمام();
    };
  });
};



  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Admin Dashboard</h2>

      {/* Tombol Reset Progress */}
      <Button variant="danger" className="mb-3" onClick={إعادة_ضبط_التقدم}>
        🔄 Reset Semua Progress
      </Button>

      <Table striped bordered hover>
        <thead className="table-dark">
          <tr>
            <th>No</th>
            <th>Username</th>
            <th>Juz</th>
            <th>Surah</th>
            <th>Catatan</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(المستخدمون_المجمعون).length > 0 ? (
            Object.values(المستخدمون_المجمعون).map((مستخدم, الفهرس) => {
              return مستخدم.القراءات.map((قراءة, ترتيب_القراءة) => (
                <tr key={`${مستخدم.اسم_المستخدم}-${ترتيب_القراءة}`}>
                  {ترتيب_القراءة === 0 && (
                    <td rowSpan={مستخدم.القراءات.length}>{الفهرس + 1}</td>
                  )}
                  {ترتيب_القراءة === 0 && (
                    <td rowSpan={مستخدم.القراءات.length}>{مستخدم.اسم_المستخدم}</td>
                  )}
                  <td>{قراءة.الجزء}</td>
                  <td>{قراءة.السورة}</td>
                  <td>{قراءة.الملاحظة}</td>
                </tr>
              ));
            })
          ) : (
            <tr>
              <td colSpan="6" className="text-center">Tidak ada data progress</td>
            </tr>
          )}
        </tbody>
      </Table>
    </Container>
  );
};

export default AdminPage;
