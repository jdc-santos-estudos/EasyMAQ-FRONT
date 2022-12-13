import moment from 'moment';

export function ordenarObjectArray(attrName, desc = false) {
  return function(a,b) {
    if (desc) {let c = a; a=b; b = c }
    return ( a[attrName] < b[attrName] ) ? -1 : (a[attrName] > b[attrName] ? 1: 0 );
  }
}

export function formatarTelCel (telCel, usarPrefixoPais) {

  telCel = telCel.replace(/[\D]/ig,'');
  const l = telCel.length;
  const c = usarPrefixoPais ? 2 : 0;

  if (l > 11 ) telCel = telCel.substring(0, 11 + c);

  let regex = `([\\d]{2})`;

  if(usarPrefixoPais) regex += l > 2 ? `([\\d]{1,2})`: '';

  regex += l > 2+c ? (l>6+c ? `([\\d]{1,${telCel.length == 11 + c ? 5: 4}})([\\d]{1,4})`:`([\\d]{1,4})`):'';

  let replace = `(${usarPrefixoPais ? '+': ''}$1)`;

  if(usarPrefixoPais)  replace += l > 2 ? ' $2 ': "";

  replace += l > 2+c ? (l>6+c ? `${c ? '':' '}$${c?3:2}-$${c?4:3}` : `${c ? '':' '}$${c?3:2}` ):'';

  return telCel.replace(new RegExp(regex),replace);
}

export function formataRG(rg) {
  return rg.replace(/[\D]/ig,'').replace(/([\d]{2})([\d]{3})([\d]{3})([\d]{1})/,'$1.$2.$3-$4');
}

export function formataCPF(cpf) {
  return cpf.replace(/[\D]/ig,'').replace(/([0-9]{3})([0-9]{3})([0-9]{3})([0-9]{2})/,'$1.$2.$3/$4');
}

export function formataCNPJ(cnpj) {
  return cnpj.replace(/[\D]/ig,'').replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,"$1.$2.$3/$4-$5")
}

export function formataCEP(cep) {
  return cep.replace(/[\D]/ig,'').replace(/(\d{5})(\d{3})/,"$1-$2")
}

export function inputValue(val, defaultVal = '') {
  return val ? val: defaultVal;
}

export const regexPatterns = {
  alphaComEspaco: /[^a-zA-ZçáàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ\s]/ig, // retorna tudo que nao for letras e espaço.
  alphaNumericosComEspaco: /[^a-zA-ZçáàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ\d\s]/ig, // retorna tudo que nao for letras, numeros e espaço.
  onlyNumbers: /[\D]/g, // retorna tudo que não for número.
}

export function currencyFormat(valor, decimal) {
  if (!valor) return null;

  const vl = parseFloat(valor)/(decimal ? 100: 1);
  const vlReal = (vl).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
  return (vl > 0 ? vlReal: '');
}

export function getCookie(cookieName) {
  let cookie = {};
  document.cookie.split(';').forEach(function(el) {
    let [key,value] = el.split('=');
    cookie[key.trim()] = value;
  })
  return cookie[cookieName];
}

export function toFixed( num, precision ) {
  return (+(Math.round(+(num + 'e' + precision)) + 'e' + -precision)).toFixed(precision);
}

export function getMinutesDiff(dt_entrega, dt_devolucao) {

  // dt_entrega = (dt_entrega + ':00').split(' ').join('T');
  // dt_devolucao = (dt_devolucao + ':00').split(' ').join('T');

  // console.log('ini:', dt_entrega + ':00');
  // console.log('ter:', dt_devolucao + ':00');
  var ini = new Date(dt_entrega);
  var ter = new Date(dt_devolucao);

  let _ini = moment(dt_entrega, 'YYYY-MM-DD H:i:s').toDate().valueOf();
  let _ter = moment(dt_devolucao, 'YYYY-MM-DD H:i:s').toDate().valueOf();
  _ini = new Date(_ini);
  _ter = new Date(_ter);

  const milisegundos2 = _ter.getTime() - _ini.getTime();
  const milisegundos = ter - ini;
  const milisegundos0 = isNaN(milisegundos) ? milisegundos2 : milisegundos;

  // console.log('milisegundos-certo:', milisegundos);
  // console.log('milisegundos-?????:', milisegundos2);
  const segundos = milisegundos0 / 1000;
  const minutos = segundos / 60;

  // console.log(milisegundos == milisegundos2);
  return minutos;
}

export function getStatusPedido(status) {
  const STATUS_PEDIDO = {
    "APR": "APROVADO", // cliente
    "CAN": "CANCELADO", // cliente
    "REC": "RECUSADO", // fornecedor
    "ACE": 'ACEITO PELO FORNECEDOR', // fornecedor
    'ANA': 'EM ANÁLISE', // cliente
    'AGUA_ASS':'ESPERANDO ASSINATURAS',
    'POSSE_CLI': 'EM POSSE DO CLIENTE', // fornecedor
    'POSSE_FORN': 'EM POSSE DO FORNECEDOR', // fornecedor
    'ROTA_ENTREGA': 'EM ROTA DE ENTREGA', // fornecedor
    "ASSINADO": "DOCUMENTO ASSINADO",
    'AGU_PGTO' :'AGUARDANDO PAGAMENTO',
    "RECOLHIDO": 'RECOLHIDO - FINALIZADO'
  };

  return STATUS_PEDIDO[status];
}

export function senhaValida(senha) {

  // verifica se tem letras minusculas
  const temMinusculas = /[a-z]/g.test(senha);
  console.log(temMinusculas);

  // verifica se tem letras minusculas
  const temMaiusculas = /[A-Z]/g.test(senha);

  // verifica se tem numeros
  const temNumeros = /[0-9]/g.test(senha);

  // verifica se tem caracteres especiais
  const temCharEspeciais = /[\W\D]/g.test(senha);

  return temMaiusculas && temMinusculas && temNumeros && temCharEspeciais;
}