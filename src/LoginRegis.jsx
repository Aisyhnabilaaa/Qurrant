import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { تسجيل_مستخدم_جديد, تسجيل_الدخول } from "./api/api"; // ✅ Panggil API yang sudah dibuat


const LoginRegis = ({ ضبط_دور_المستخدم }) => {
    const [وضع_التسجيل, ضبط_وضع_التسجيل] = useState(false);
    const [اسم_المستخدم, ضبط_اسم_المستخدم] = useState("");
    const [البريد_الإلكتروني, ضبط_البريد_الإلكتروني] = useState("");
    const [كلمة_المرور, ضبط_كلمة_المرور] = useState("");
    const [الرسالة, ضبط_الرسالة] = useState("");
    const انتقل_إلى = useNavigate();

    // ✅ Fungsi Register
    const معالجة_التسجيل = async (الحدث) => {
        الحدث.preventDefault();
        console.log("📤 Data yang dikirim ke backend:", { username: اسم_المستخدم, email: البريد_الإلكتروني, password: كلمة_المرور });

        if (!اسم_المستخدم || !البريد_الإلكتروني || !كلمة_المرور) {
            ضبط_الرسالة("Semua field harus diisi!");
            return;
        }

        try {
            const الاستجابة = await تسجيل_مستخدم_جديد(اسم_المستخدم, البريد_الإلكتروني, كلمة_المرور);
            console.log("✅ Registrasi sukses:", الاستجابة.data);
            ضبط_الرسالة("Registrasi berhasil! Silakan login.");
            ضبط_وضع_التسجيل(false); // Pindah ke login setelah sukses

        } catch (الخطأ) {
            console.error("❌ Register Error:", الخطأ.response ? الخطأ.response.data : الخطأ.message);
            ضبط_الرسالة(الخطأ.response?.data?.message || "Gagal registrasi, coba lagi.");
        }
    };

    // ✅ Fungsi Login
    const معالجة_الدخول = async (الحدث) => {
        الحدث.preventDefault();
        console.log("📤 Data yang dikirim ke backend untuk login:", { username: اسم_المستخدم, password: كلمة_المرور });

        if (!اسم_المستخدم || !كلمة_المرور) {
            ضبط_الرسالة("Username dan password harus diisi!");
            return;
        }

        try {
            const الاستجابة = await تسجيل_الدخول(اسم_المستخدم, كلمة_المرور);
            console.log("✅ Login sukses:", الاستجابة.data);

            localStorage.setItem("token", الاستجابة.data.token);
            localStorage.setItem("role", الاستجابة.data.role);
            ضبط_دور_المستخدم(الاستجابة.data.role);

            // ✅ Redirect sesuai role
            انتقل_إلى(الاستجابة.data.role === "Admin" ? "/adminpage" : "/");

        } catch (الخطأ) {
            console.error("❌ Login Error:", الخطأ.response ? الخطأ.response.data : الخطأ.message);
            ضبط_الرسالة(الخطأ.response?.data?.message || "Login gagal, coba lagi.");
        }
    };

    return (
        <div className={`contentlr d-flex justify-content-center align-items-center shadow-ig ${وضع_التسجيل ? "active" : ""}`}>
            {/* Form Registrasi */}
            <div className={`col-md-6 form-box ${وضع_التسجيل ? "show" : "hide"}`}>
                <form onSubmit={معالجة_التسجيل}>
                    <div className="header-logreg mb-4 text-center">
                        <h1>BUAT AKUN DULU!</h1>
                        <div className="input-group mb-3">
                            <input type="text" placeholder="Username" className="form-control form-control-lg bg-light fs-6"
                                value={اسم_المستخدم} onChange={(الحدث) => ضبط_اسم_المستخدم(الحدث.target.value)} required />
                        </div>
                        <div className="input-group mb-3">
                            <input type="email" placeholder="Email" className="form-control form-control-lg bg-light fs-6"
                                value={البريد_الإلكتروني} onChange={(الحدث) => ضبط_البريد_الإلكتروني(الحدث.target.value)} required />
                        </div>
                        <div className="input-group mb-3">
                            <input type="password" placeholder="Password" className="form-control form-control-lg bg-light fs-6"
                                value={كلمة_المرور} onChange={(الحدث) => ضبط_كلمة_المرور(الحدث.target.value)} required />
                        </div>
                        <div className="input-group mb-3 justify-content-center">
                            <button type="submit" className="btn btn-primary w-10 fs-6">Daftar</button>
                        </div>
                        <p>{الرسالة}</p>
                    </div>
                </form>
            </div>

            {/* Form Login */}
            <div className={`col-md-6 form-box ${وضع_التسجيل ? "hide" : "show"}`}>
                <form onSubmit={معالجة_الدخول}>
                    <div className="header-logreg mb-4 text-center">
                        <h1>YUK MASUK</h1>
                        <div className="input-group mb-3">
                            <input type="text" placeholder="Username" className="form-control form-control-lg bg-light fs-6"
                                value={اسم_المستخدم} onChange={(الحدث) => ضبط_اسم_المستخدم(الحدث.target.value)} required />
                        </div>
                        <div className="input-group mb-3">
                            <input type="password" placeholder="Password" className="form-control form-control-lg bg-light fs-6"
                                value={كلمة_المرور} onChange={(الحدث) => ضبط_كلمة_المرور(الحدث.target.value)} required />
                        </div>
                        <div className="input-group mb-3 justify-content-center">
                            <button type="submit" className="btn btn-primary w-10 fs-6">Masuk</button>
                        </div>
                        <p>{الرسالة}</p>
                    </div>
                </form>
            </div>

            {/* Switch Button */}
            <div className="switch-content">
                <div className="switch">
                    <div className="switch-panel switch-left">
                        <h1>Datang Kembali</h1>
                        <button className="hidden btn border-white text-white w-10 fs-6" onClick={() => ضبط_وضع_التسجيل(false)}>Login</button>
                    </div>
                    <div className="switch-panel switch-right">
                        <h1>Selamat Datang</h1>
                        <button className="hidden btn border-white text-white w-10 fs-6" onClick={() => ضبط_وضع_التسجيل(true)}>Register</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginRegis;
