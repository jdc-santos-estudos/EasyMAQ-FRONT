import api from './api';
import config from '../config.json';

const cartFactory = {
  // recupera os itens do carrinho do localStorage
  getLocalItens:  () => {
    const cart = localStorage.getItem('EasyMAQ_CART');
    return cart ? JSON.parse(cart) : false;
  },

  // salva os itens do carrinho no localStorage
  setLocalItens: (itens) => {
    localStorage.setItem('EasyMAQ_CART', JSON.stringify(itens));
  },
  
  destroyCart: () => {
    localStorage.removeItem('EasyMAQ_CART');
  }
}

export default cartFactory;