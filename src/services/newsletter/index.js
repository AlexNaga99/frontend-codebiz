import { request } from '../https';

const newsletter_service = {
  insertNewsletter: (body) => {
    return request.post('/newsletter', body);
  }
}

export {
    newsletter_service
}