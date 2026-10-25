import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useState, useEffect } from "react";

import HomePage from "./HomePage";
import JuzPage from "./Component/JuzPage";
import NavbarComponent from "./Component/NavbarComponent";
import AdminPage from "./admin/AdminPage";
import Beranda from "./admin/Beranda";
import LoginRegis from "./LoginRegis";
import ProtectedRoute from "./ProtectedRoute";
 // Sesuaikan dengan nama file di Windows// ✅ Pastikan sesuai dengan nama file!



import "bootstrap/dist/css/bootstrap.min.css";

function App() {
    const [دور_المستخدم, ضبط_دور_المستخدم] = useState(""); 

    // ✅ Ambil role dari localStorage saat aplikasi dimuat
    useEffect(() => {
        const الدور_المخزن = localStorage.getItem("role");
        if (الدور_المخزن) {
            ضبط_دور_المستخدم(الدور_المخزن);
        }
    }, []);

    return (
        <Router>
            <div className="container-fluid p-0">
                <NavbarComponent />
                <Routes>
                    {/* ✅ Kirim setUserRole ke LoginRegis */}
                    <Route path="/loginregis" element={<LoginRegis ضبط_دور_المستخدم={ضبط_دور_المستخدم} />} />

                    {/* Halaman Utama User */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/juz/:id" element={<JuzPage />} />

                    {/* ✅ Gunakan ProtectedRoute untuk Admin */}
                    <Route element={<ProtectedRoute الأدوار_المسموح_بها={["admin"]} دور_المستخدم={دور_المستخدم} />}>
                        <Route path="/adminpage" element={<AdminPage />} />
                        <Route path="/beranda" element={<Beranda />} />
                    </Route>

                    {/* Halaman Tidak Ditemukan */}
                    <Route path="*" element={<h1>404 - Not Found</h1>} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
