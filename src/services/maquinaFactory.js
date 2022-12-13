import api from './api';
import config from '../config.json';

const userFactory = {
  cadastrar: async (body) => {
    try {
      return (await api._req('post','/maquina/cadastrar', body)).data;
    } catch (err) {
      throw new Error('Erro ao tentar cadastrar a máquina');
    }
  },
  atualizar : async (body) => {
    try {
      return (await api._req('post','/maquina/atualizar', body)).data;
    } catch (err) {
      throw new Error('Erro ao tentar atualizar a máquina');
    }
  },
  listar: async (p ={}) => {
    try {
      return (await api._req('get','/maquina/listar',  { params: p })).data;
    } catch (err) {
      throw new Error('Erro ao tentar listar as máquinas');
    }
  },
  listarPorPerfil: async (p ={}) => {
    try {
      return (await api._req('get','/maquina/listar-por-perfil',  { params: p })).data;
    } catch (err) {
      throw new Error('Erro ao tentar listar as máquinas');
    }
  },
  excluir: async (cd_maquina) => {
    try {
      return (await api._req('delete','/maquina/deletar/'+cd_maquina)).data;
    } catch (err) {
      throw new Error('Erro ao tentar deletar a máquina');
    }
  },
  getCategorias: async (p) => {
    try {
      return (await api._req('get','/categorias/listar', {params: p })).data;
    } catch (err) {
      throw new Error('Erro ao tentar listar as categorias');
    }
  },
}

export default userFactory;