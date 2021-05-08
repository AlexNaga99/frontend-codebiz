import axios from 'axios';
import config from '../../config.json';

const request = axios.create({
  baseURL: config['API_URL'],   
  withCredentials: false,
  headers: {
    'Content-Type': 'application/json',    
	  'Access-Control-Allow-Origin': '*',
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
  },
});

export { request }