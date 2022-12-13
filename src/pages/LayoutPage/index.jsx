import { useContext, useEffect } from 'react';
import Menu from "../../components/Menu";
import Footer from '../../components/Footer';
import { Container, Row, Col } from 'react-bootstrap';
import ConfigContext from "../../contexts/ConfigContext";
import { useLocation } from 'react-router-dom';
import CookieConsent, { Cookies } from "react-cookie-consent";

const hideHeader = [
  '/login'
];

const hideFooter = [
  '/login'
];

const LayoutPage = props => {

  const { setShowHeader, setShowFooter, setUseCookies } = useContext(ConfigContext);

  const location = useLocation();

  useEffect(() => {
    setShowHeader(!hideHeader.includes(location.pathname));
    setShowFooter(!hideFooter.includes(location.pathname));
  }, [location.pathname]);

  return (
    <Container fluid className="__main">

      <Row>
        <Col style={{ padding: 0 }}>
          <Menu />
        </Col>
      </Row>

      <Row className="___conteudo">
        <Col style={{ padding: 0 }}>
          {props.children}
        </Col>
      </Row>

      <Row>
        <Col style={{ padding: 0 }}>
          <Footer />
        </Col>
      </Row>
      <CookieConsent
        location="bottom"
        buttonText="ACEITAR COOKIES"
        cookieName="EasyMAQ"
        style={{ background: "#002354" }}
        overlay
        buttonStyle={{ 
          background: '#f96b13',
          color: "#002354",
          fontSize: "15px"
        }}
        debug={false}
        expires={150}
        // enableDeclineButton
        // declineButtonText="RECUSAR"
        // declineButtonStyle={{ 
        //   fontSize: "15px"
        // }}
        // onDecline={() => {
        //   document.cookie = 'EasyMAQ=; Max-Age=-99999999;';
        //   setUseCookies(false);
        // }}
        onAccept={() => { setUseCookies(true); }}
      >
        Este site usa cookies para melhorar a experiência do usuário.       
        <span style={{ fontSize: "10px" }}></span>
      </CookieConsent>
    </Container>
  );
}

export default LayoutPage;