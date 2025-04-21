import axios from 'axios'; 

export default {
    getToday(){
        return axios.get('api/topics/today').then(r => r.data); 
    },
    getRecent(limit = 7){
        return axios.get(`api/topics?limit=${limit}`).then(r => r.data); 
    }
}