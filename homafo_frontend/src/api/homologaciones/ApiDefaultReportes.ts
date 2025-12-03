import axios from 'axios';

export class ApiDefaultReportes {
    protected baseUrl;
    protected instance;
    protected cancelToken;
    
    constructor(){
        axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
         this.instance = axios.create({
                baseURL: 'http://190.14.232.146:8081/JasperBridge-1.0-SNAPSHOT/',
            });
          //localStorage.setItem('token','Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxNTk4OTgzMjk0NjA2IiwianRpIjoiNjEwODYwIiwiaWF0IjoxNTk4OTgzMjk0LCJleHAiOjE2MzQ5ODMyOTQsImlkRW1wcmVzYSI6MzIyLCJpZEFjY2VzbyI6IjYxMDg2MCIsImlkVXN1YXJpbyI6MTMxMiwiaW5mbyI6eyJpZFBlcmZpbCI6IjM0MyIsIm5vbWJyZUVtcHJlc2EiOiJMbGFub2dhcyBTLkEgIEUuUy5QIn19.L_jOtIjmzuKhP0mEoECkS_xuDoTmqLqLWBPZt0Nsy1E');
          //const token =localStorage.getItem('token');
            this.instance.interceptors.request.use(function (config) {
             //config.headers.Authorization = token;      
             return config;
          });

        this.instance.interceptors.response.use(function(response) {
            return response;
        }, function(error) {                       
            return Promise.reject(error);
        });
    }
    
}