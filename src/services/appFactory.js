import api from './api';
import config from '../config.json';

const appFactory = {
  getConfigFront: async () => {
    try {
      return (await api._req('get','/v1/get-config-front')).data;
    } catch (err) {
      throw new Error('Erro ao recuperar as configurações');
    }
  },
  getConfigs: async (name) => {
    try {
      return (await api._req('get','/v1/get-configs', { params: { config: name } })).data;
    } catch (err) {
      throw new Error('Erro ao recuperar as configurações');
    }
  },
  saveConfig: async(config, data) => {
    try {
      return (await api._req('post','/v1/save-config', { config: config, dados: data})).data;
    } catch (err) {
      throw new Error('Erro ao tentar logar');
    }
  },
  login : async (params) => {
    try {
      return (await api._req('post','/dashboard/login', params)).data;
    } catch (err) {
      throw new Error('Erro ao tentar logar');
    }
  },
  redefinirSenha : async (params) => {
    try {
      return (await api._req('post','/dashboard/redefinir-senha', params)).data;
    } catch (err) {
      throw new Error('Erro ao tentar redefinir a senha');
    }
  },
  getUserInfo: async () => {
    try {
      return (await api._req('get','/usuario/get-info')).data;
    } catch (err) {
      throw new Error('Erro ao tentar recuperar os dados do usuário logado');
    }
  },
  getEstados: async () => {
    try {
      return (await api._req('get','/estado/listar')).data;
    } catch (err) {
      throw new Error('Erro ao tentar recuperar os estados');
    }
  },
  getCidades: async (cd_estado) => {
    try {
      return (await api._req('get','/cidade/listar/'+cd_estado)).data;
    } catch (err) {
      throw new Error('Erro ao tentar recuperar as cidades do estado');
    }
  },
  confirmEmail: async (token) => {
    try {
      return (await api._req('get','/usuario/confirm-email',{ params: {'token': token}})).data;
    } catch (err) {
      throw new Error('Erro ao tentar confirmar o email');
    }
  },
  getTermos: async () => {
    try {
      return (await api._req('get','/v1/get-termos')).data;
    } catch (err) {
      throw new Error('Erro ao tentar recuperar os termos de uso');
    }
  }
}

export default appFactory;