import { useContext, useState, useRef, useEffect } from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import ConfigContext from '../../contexts/ConfigContext';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  faInstagram, faLinkedin, faFacebookSquare } from "@fortawesome/free-brands-svg-icons";
import Show from '../ShowIf';
import { BrowserView, MobileView, isBrowser, isMobile } from 'react-device-detect';
import qrcodePng from '../../assets/qrcode.png';

import './style.scss';

const Footer = props => {

  const { config, showFooter } = useContext(ConfigContext);

  return (
    <Show if={showFooter}>
      <Container fluid className="footer">
        <Row>
          <Col style={{ textAlign: 'center' }}>
            <div className="iconsContainer">
              <a href={config?.facebook} target="_blank">
                <FontAwesomeIcon icon={faFacebookSquare} className="socialIcon" />
              </a>
              <a href={config?.instagram} target="_blank">
                <FontAwesomeIcon icon={faInstagram} className="socialIcon" />
              </a>
              <a href={config?.linkedin} target="_blank">
                <FontAwesomeIcon icon={faLinkedin} className="socialIcon" />
              </a>
            </div>
            <div className="infoContainer">
              <Link to="/faq">FAQ</Link><span className="divisor">-</span>
              <Link to="/termos">Termos e condições</Link><span className="divisor">-</span>
              <Link to="/contato">Contato</Link>
              <Show if={isBrowser}>
                <br/><br/>
                <p>Baixe nosso App <br/>
                  <img src={qrcodePng} alt="" style={{width: 100,'marginTop': 10}}/>
                </p>
              </Show>              
            </div>
            <div className="copyright">
              <span >&copy;{(new Date()).getFullYear()} - EasyMAQ </span>
            </div>
            
          </Col>
        </Row>
      </Container>
    </Show>
  )
}



export default Footer;