// import { Navbar, Container, Nav } from "react-bootstrap";
// import { Link, NavLink } from "react-router-dom";

// const NavbarComponent = () => {
//   return (
//     <Navbar expand="lg" className="shadow-md fixed-top bg-white">
//       <Container>
//         <Navbar.Brand as={Link} to="/" className="fw-bold text-primary">
//           QURRANT
//         </Navbar.Brand>
//         <Navbar.Toggle aria-controls="basic-navbar-nav" />
//         <Navbar.Collapse id="basic-navbar-nav">
//           <div className=" join d-flex gap-4">
//             <Link to="/loginregis" className="btn btn-outline-primary">
//               Join With Us
//             </Link>
//           </div>
//         </Navbar.Collapse>
//       </Container>
//     </Navbar>
//   );
// };

// export default NavbarComponent;


import { Navbar, Container, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const NavbarComponent = () => {
  const [مسجل_الدخول, ضبط_مسجل_الدخول] = useState(false);

  useEffect(() => {
    const رمز_المصادقة = localStorage.getItem("token");
    ضبط_مسجل_الدخول(!!رمز_المصادقة); // Cek apakah token ada
  }, []);

  const تسجيل_الخروج = () => {
    localStorage.removeItem("token"); // Hapus token saat logout
    ضبط_مسجل_الدخول(false);
    window.location.reload(); // Refresh halaman supaya update
  };

  return (
    <Navbar expand="lg" className="shadow-md fixed-top bg-white">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold text-primary">
          QURRANT
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <div className="join d-flex gap-4">
            {مسجل_الدخول ? (
              <button className="btn btn-danger" onClick={تسجيل_الخروج}>
                Logout
              </button>
            ) : (
              <Link to="/loginregis" className="btn btn-outline-primary">
                Join With Us 
              </Link>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
