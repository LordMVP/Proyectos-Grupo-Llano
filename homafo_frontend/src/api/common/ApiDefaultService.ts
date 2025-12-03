import { AxiosInstance } from "axios";
//import React from 'react';
import axios from "axios";
import RUTAS_API from "../../data/rutasApi";
import { getToken } from "../../utils/Utils";
import { toast } from "react-toastify";

export class ApiDefaultService {
  protected baseUrl;
  protected instance: AxiosInstance;
  protected cancelToken;

  constructor() {
    axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";
    this.instance = axios.create({ baseURL: RUTAS_API.API.ENDPOINT });
    //localStorage.setItem('token','Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxNjAwOTk5NDAxMjA1IiwianRpIjoiNTA1NTA2IiwiaWF0IjoxNjAwOTk5NDAxLCJleHAiOjE2MzY5OTk0MDEsImlkRW1wcmVzYSI6MzE3LCJpZEFjY2VzbyI6IjUwNTUwNiIsImlkVXN1YXJpbyI6MTUxOCwiaW5mbyI6eyJpZFBlcmZpbCI6IjEiLCJub21icmVFbXByZXNhIjoiQmlvYWdyaWNvbGEgZGVsIExsYW5vIFMuQS4gRS5TLlAifX0.Qcsf-ujkUX4vg63LwZ1N6OsR_2_wP_dmIfPiDJlD34s');
    const token = getToken();
    this.instance.interceptors.request.use(function (config) {
      //const token = "Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxNTk4OTgzMjk0NjA2IiwianRpIjoiNjEwODYwIiwiaWF0IjoxNTk4OTgzMjk0LCJleHAiOjE2MzQ5ODMyOTQsImlkRW1wcmVzYSI6MzIyLCJpZEFjY2VzbyI6IjYxMDg2MCIsImlkVXN1YXJpbyI6MTMxMiwiaW5mbyI6eyJpZFBlcmZpbCI6IjM0MyIsIm5vbWJyZUVtcHJlc2EiOiJMbGFub2dhcyBTLkEgIEUuUy5QIn19.L_jOtIjmzuKhP0mEoECkS_xuDoTmqLqLWBPZt0Nsy1E";
      config.headers.Authorization = token;
      return config;
    });

    this.instance.interceptors.response.use(
      function (response) {
        // Do something with response data
        return response;
      },
      function (error) {
        // Do something with response error
        //alert('Error');
        if (axios.isCancel(error)) {
          return "axios request cancelled";
        }

        if (error?.response?.status === 404) {
          return Promise.reject(error);
        }

        const data = error?.response?.data;
        if (data) {
          if (data.apierror) {
            toast.error(
              "Error al ejecutar la solicitud: " + data.apierror.debugMessage
            );
          } else if (data.message) {
            toast.error("Error al ejecutar la solicitud: " + data.message);
          } else if (typeof data === "string") {
            toast.error("Error al ejecutar la solicitud: " + data);
          } else {
            toast.error("Error al ejecutar la solicitud");
          }
        }

        return Promise.reject(error);
      }
    );
  }
}
