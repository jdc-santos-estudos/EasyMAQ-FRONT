import Carousel from 'react-bootstrap/Carousel';

import './style.scss';

const EMBanner = props => {
  return (
    <Carousel indicators={false} className="EMcarrousel">
      <Carousel.Item>
        <div style={{ backgroundImage: "url('carousel-img1.png')" }} className="carouselItem"></div>

        <Carousel.Caption bsPrefix="carousel-caption carouselCaption">
          <h3>Facilidade</h3>
          <p>Encontre as máquinas necessárias para sua construção em um unico lugar.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <div style={{ backgroundImage: "url('assinatura.png')" }} className="carouselItem"></div>
        <Carousel.Caption bsPrefix="carousel-caption carouselCaption">
          <h3>Agilidade</h3>
          <p>O processo de contrato das máquinas é totalmente automatizado.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <div style={{ backgroundImage: "url('33.jpg')" }} className="carouselItem"></div>
        <Carousel.Caption bsPrefix="carousel-caption carouselCaption">
          <h3>Confiabilidade</h3>
          <p>Os contratos são formalizados através de documentos assinados digitalmente.</p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  )
}

export default EMBanner;