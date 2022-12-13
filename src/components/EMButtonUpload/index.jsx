import { useRef, useContext, useEffect } from 'react';
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";
import ShowIf from '../ShowIf';

// import CotacaoContext from "../../contexts/CotacaoContext";
import LoadingContext from '../../contexts/LoadingContext';
// import CotacaoFactory from '../../services/cotacaoFactory';

import './style.scss';

const EMButtonUpload = (props) => {
  const {
    text,
    icon,
    btnClass = 'button white medium new-icon',
    isMultiple,
    maxFiles = 1,
    bucket,
    accept,
    controller
  } = props;

  const { setLoading } = useContext(LoadingContext);
  let __files = [];

  const fileRef = useRef();

  const __onChange = async (event) => {
    try {
      const { files } = event.target;

      if (files) {
  
        // Caso ja tenha atingido o limite de arquivos, não faz nada
        if (controller?.files && controller?.files?.length === maxFiles) return;

        // Caso não tenha arquivos para fazer upload, nao faz nada
        if (!files.length) return;

        // Quantidade de arquivos que ainda podem ser anexados
        const qtdFilesUpload = maxFiles - (controller?.files ? controller?.files?.length : 0);

        const a = [];

        // For adaptado para fazer apenas a quantidade de arquivos que pode ser anexado
        if (qtdFilesUpload > 0) {
          for (var i = 0; i < qtdFilesUpload; i++) {
            if (!files[i]) continue;
            a.push({
              nm_imagem: files[i].name,
              fileBase64: await convertBase64(files[i]),
              fileUrl: ''
            })
          }
        }

        controller.setFiles(controller.files.concat(a));
      }

      // limpa o input após fazer upload dos arquivos
      if (event.target.value !== '') event.target.value = '';
      
      setLoading(false);
    } catch(e) {
      setLoading(false);
      console.log(e);
    }
  }

  /**
   * Calcula bytes para Mega Bytes
   * @param {number} bytes 
   */
  function __bytesToMB(bytes) {
    return Math.round(bytes / Math.pow(1024, 2), 2);
  }

  /**
   * Deleta arquivos de lista de controle
   * @param {File} file 
   * @param {String} bucket
   * @return {void}
   */
  const __deleteFile = (file, bucket) => {
    for(var i = 0; dadosCotacaoFiles[bucket].length > i; i++){
      if (file.name === dadosCotacaoFiles[bucket][i].name) {
        dadosCotacaoFiles[bucket].splice(i, 1);
        break;
      }
    }
  }
 
  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file)
      fileReader.onload = () => {
        resolve(fileReader.result);
      }
      fileReader.onerror = (error) => {
        reject(error);
      }
    })
  }

  return (
    <>
      <Button
        className={'btnUpload '+btnClass}
        onClick={() => fileRef.current.click()}
      >
        <span>{text}</span>
        <ShowIf if={icon}>
          <span className="icon">
            {icon}
          </span>
        </ShowIf>
      </Button>
      <input
        ref={fileRef}
        multiple={isMultiple}
        type="file"
        hidden
        accept={accept}
        onChange={ __onChange }
      />
    </>
  )
}

export default EMButtonUpload;