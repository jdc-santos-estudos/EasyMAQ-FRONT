import emContrucaoPng from '/src/images/em-construcao.png';

const NotFound = props => {
    return (
        <div style={{textAlign: 'center'}}>
            <img src={emContrucaoPng} alt="" style={{width: 400, marginTop: 200}}/>
        </div>
    );
}

export default NotFound;