import { request } from '../https';

const products_service = {
  getProducts: () => {
    return request.get('/products');
  }
}

export {
    products_service
}