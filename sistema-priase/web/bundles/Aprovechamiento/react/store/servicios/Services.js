import axios from 'axios';
import { URL_BACKEND_BIOAGRICOLA } from '../../global/constantes';

export const getService = async (serviceNAme, params, headers = {}) => {
  try {
    const response = await axios.get(
      `${URL_BACKEND_BIOAGRICOLA}${serviceNAme}`,
      {
        ...headers,
        params,
      }
    );
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const postService = async (serviceNAme, params, headers = {}) => {
  try {
    const response = await axios.post(
      `${URL_BACKEND_BIOAGRICOLA}${serviceNAme}`,
      {
        ...params,
      },
      {
        headers,
      }
    );
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
