import api from './api';
import config from '../config.json';

const pedidoFactory = {
  novoPedido: async (body) => {
    try {
      return (await api._req('post','/pedido/novo-pedido', body)).data;
    } catch (err) {
      throw new Error('Erro ao tentar enviar o pedido');
    }
  },
  atualizar : async (body) => {
    try {
      return (await api._req('post','/maquina/atualizar', body)).data;
    } catch (err) {
      throw new Error('Erro ao tentar atualizar a máquina');
    }
  },
  atualizarStatus: async (body) => {
    try {
      return (await api._req('post','/pedido/atualizar-status', body)).data;
    } catch (err) {
      throw new Error('Erro ao tentar atualizar o status do pedido');
    }
  },
  listar: async (p ={}) => {
    try {
      return (await api._req('get','/pedido/listar',  { params: p })).data;
    } catch (err) {
      throw new Error('Erro ao tentar listar os pedidos');
    }
  },
  excluir: async (cd_maquina) => {
    try {
      return (await api._req('delete','/maquina/deletar/'+cd_maquina)).data;
    } catch (err) {
      throw new Error('Erro ao tentar deletar a máquina');
    }
  },
  docusign: async () => {
    
    try {
      console.log((await api._req('get','https://docusign.easymaq.app/public/?jdc=1')));
    } catch (err) {
      throw new Error('Erro ao tentar deletar a máquina');
    }
  }
}

export default pedidoFactory;