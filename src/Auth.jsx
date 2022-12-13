const SESSION_ITEM = 'token';

const Auth = {

  /**
   * Salva sessionData de usuario logado
   * @param {any} sessionData Informações do usuario para serem salvas
   */
  saveSession: (token) => {
    localStorage.setItem(SESSION_ITEM, token);
  },

  /**
   * Retorna informações de usuário salvo
   * @returns Objeto de usuario logado
   */
  getSession: () => {
    const token = localStorage.getItem(SESSION_ITEM);
    return token ? token : false;
  },

  /**
   * Destroi sessão salva
   */
  destroySession: () => {
    localStorage.removeItem(SESSION_ITEM);
  }
}

export default Auth;