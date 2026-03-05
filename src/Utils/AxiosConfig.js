import axios from 'axios';

// Create an axios instance with a base URL
const API = axios.create({
  baseURL: 'https://incurred-sacred-classes-gui.trycloudflare.com/api/admin',
  headers: {
    'Content-Type': 'application/json',
  },
});

/* 
  If you actually meant localhost:300 (port 300), change the baseURL above.
  To use this in your components:
  import API from '../Utils/AxiosConfig';
  
  API.get('/users').then(...)
*/

export default API;
