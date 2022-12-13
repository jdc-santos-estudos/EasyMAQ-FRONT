import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Auth from "../auth";
import {toast} from 'react-toastify';

/**
 * Valida se usuário está logado ou não. Caso esteja, retorna os dados
 * @param {string} redirectPath 
 * @param {boolean} condition 
 */
const useLogged = (redirectPath, condition = false) =>{
    
    const history = useNavigate();
    
    // Recupera sessionData 
    const sessionData = Auth.getSession();

    // Valida casos de redirecionamento
    useEffect(() => {
        if(condition){
            if(sessionData) {
                toast.error('voce nao tem permissão para acessar esta página.');
                history(redirectPath);
            }
        }else{
            if(!sessionData) {
                toast.error('voce nao tem permissão para acessar esta página.');
                history(redirectPath);
            }
        }
    }, []);
    
    // Caso tenha passado pela validação e tenha sessionData
    return sessionData;
}

export default useLogged;