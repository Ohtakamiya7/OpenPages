import axios from 'axios'

export default {
    list(order) {
      return axios.get(`/api/entries/${order}`).then(r => r.data); 
    },
    create(order, entry) {
      return axios.post(`/api/entries/${order}`, entry).then(r => r.data); 
    }
  }
