import { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Beranda = () => {
  const [حالة_الأجزاء, ضبط_حالة_الأجزاء] = useState({}); // Status penyelesaian juz
  const انتقل_إلى = useNavigate();

  useEffect(() => {
    const الحالة_المحدثة = {};
    for (let الرقم = 1; الرقم <= 30; الرقم++) {
      الحالة_المحدثة[الرقم] = JSON.parse(localStorage.getItem(`juz_${الرقم}_completed`)) || false;
    }
    ضبط_حالة_الأجزاء(الحالة_المحدثة);
  }, []);

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


      {/* 🔹 BUTTON PER JUZ */}
    <Container className="text-center mt-4">
      <Row className="justify-content-center">
        {Array.from({ length: 30 }, (_, الفهرس) => (
          <Col xs={4} sm={3} md={2} key={الفهرس} className="mb-3">
            <Button
              variant={حالة_الأجزاء[الفهرس + 1] ? "success" : "primary"}
              className="button w-100"
              onClick={() => انتقل_إلى(`/juz/${الفهرس + 1}`)}
            >
              JUZ {الفهرس + 1}
            </Button>
          </Col>
        ))}
      </Row>
    </Container>
    </>
  );
};

export default Beranda;
