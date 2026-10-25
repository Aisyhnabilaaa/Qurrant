import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, loginUser } from "./api/api"; // ✅ Panggil API yang sudah dibuat


const LoginRegis = ({ setUserRole }) => {
    const [isRegister, setIsRegister] = useState(false);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    // ✅ Fungsi Register
    const handleRegister = async (e) => {
        e.preventDefault();

        if (!username || !email || !password) {
            setMessage("Semua field harus diisi!");
            return;
        }

        try {
            const response = await registerUser(username, email, password);
            console.log("✅ Registrasi sukses:", response.data);
            setMessage("Registrasi berhasil! Silakan login.");
            setIsRegister(false); // Pindah ke login setelah sukses

        } catch (error) {
            console.error("❌ Register Error:", error.response ? error.response.data : error.message);
            setMessage(error.response?.data?.message || "Gagal registrasi, coba lagi.");
        }
    };

    // ✅ Fungsi Login
    const handleLogin = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            setMessage("Username dan password harus diisi!");
            return;
        }

        try {
            const response = await loginUser(username, password);

            localStorage.setItem("token", response.data.token);
            localStorage.setItem("role", response.data.role);
            setUserRole(response.data.role);

            // ✅ Redirect sesuai role
            navigate(response.data.role === "Admin" ? "/adminpage" : "/");

        } catch (error) {
            console.error("❌ Login Error:", error.response ? error.response.data : error.message);
            setMessage(error.response?.data?.message || "Login gagal, coba lagi.");
        }
    };

    return (
        <div className={`contentlr d-flex justify-content-center align-items-center shadow-ig ${isRegister ? "active" : ""}`}>
            {/* Form Registrasi */}
            <div className={`col-md-6 form-box ${isRegister ? "show" : "hide"}`}>
                <form onSubmit={handleRegister}>
                    <div className="header-logreg mb-4 text-center">
                        <h1>BUAT AKUN DULU!</h1>
                        <div className="input-group mb-3">
                            <input type="text" placeholder="Username" className="form-control form-control-lg bg-light fs-6"
                                value={username} onChange={(e) => setUsername(e.target.value)} required />
                        </div>
                        <div className="input-group mb-3">
                            <input type="email" placeholder="Email" className="form-control form-control-lg bg-light fs-6"
                                value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className="input-group mb-3">
                            <input type="password" placeholder="Password" className="form-control form-control-lg bg-light fs-6"
                                value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        <div className="input-group mb-3 justify-content-center">
                            <button type="submit" className="btn btn-primary w-10 fs-6">Daftar</button>
                        </div>
                        <p>{message}</p>
                    </div>
                </form>
            </div>

            {/* Form Login */}
            <div className={`col-md-6 form-box ${isRegister ? "hide" : "show"}`}>
                <form onSubmit={handleLogin}>
                    <div className="header-logreg mb-4 text-center">
                        <h1>YUK MASUK</h1>
                        <div className="input-group mb-3">
                            <input type="text" placeholder="Username" className="form-control form-control-lg bg-light fs-6"
                                value={username} onChange={(e) => setUsername(e.target.value)} required />
                        </div>
                        <div className="input-group mb-3">
                            <input type="password" placeholder="Password" className="form-control form-control-lg bg-light fs-6"
                                value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        <div className="input-group mb-3 justify-content-center">
                            <button type="submit" className="btn btn-primary w-10 fs-6">Masuk</button>
                        </div>
                        <p>{message}</p>
                    </div>
                </form>
            </div>

            {/* Switch Button */}
            <div className="switch-content">
                <div className="switch">
                    <div className="switch-panel switch-left">
                        <h1>Datang Kembali</h1>
                        <button className="hidden btn border-white text-white w-10 fs-6" onClick={() => setIsRegister(false)}>Login</button>
                    </div>
                    <div className="switch-panel switch-right">
                        <h1>Selamat Datang</h1>
                        <button className="hidden btn border-white text-white w-10 fs-6" onClick={() => setIsRegister(true)}>Register</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginRegis;
