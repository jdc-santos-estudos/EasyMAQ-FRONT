import api from './api';
import config from '../config.json';

const userFactory = {
  cadastrar: async (body) => {
    try {
      return (await api._req('post','/usuario/cadastrar', body)).data;
    } catch (err) {
      throw new Error('Erro ao tentar cadastrar o usuário');
    }
  },
  atualizar: async (body) => {
    try {
      return (await api._req('post','/usuario/perfil', body)).data;
    } catch (err) {
      throw new Error('Erro ao tentar atualizar o usuário');
    }
  },
  login : async (params) => {
    try {
      return (await api._req('post','/dashboard/login', params)).data;
    } catch (err) {
      throw new Error('Erro ao tentar logar');
    }
  },
  atualizarSenha: async (params) => {
    try {
      return (await api._req('post','/usuario/atualizar-senha', params)).data;
    } catch (err) {
      throw new Error('Erro ao tentar atualizar a senha');
    }
  },
  getUserInfo: async () => {
    try {
      return (await api._req('get','/usuario/get-info')).data;
    } catch (err) {
      throw new Error('Erro ao tentar recuperar os dados do usuário logado');
    }
  },
  getPerfil: async () => {
    try {
      return (await api._req('get','/usuario/perfil')).data;
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
  getFornecedores: async () => {
    try {
      return (await api._req('get','/usuario/get-fornecedores')).data;
    } catch (err) {
      throw new Error('Erro ao tentar recuperar os fornecedores');
    }
  }
}

export default userFactory;