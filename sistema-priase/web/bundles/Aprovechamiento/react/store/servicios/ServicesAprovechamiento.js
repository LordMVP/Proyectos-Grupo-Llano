import axios from 'axios';
import { URL_BACKEND_APROVECHAMIENTO } from '../../global/constantes';

export const getServiceAprovechamiento = async (serviceNAme, params, headers = {}) => {
  try {
    const response = await axios.get(
      `${URL_BACKEND_APROVECHAMIENTO}${serviceNAme}`,
      { ...headers, params, }
    );
    return response
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const postServiceAprovechamiento = async (serviceNAme, params, headers = {}) => {
  try {
    const response = await axios.post(
      `${URL_BACKEND_APROVECHAMIENTO}${serviceNAme}`,
      { ...params, },
      { headers, }
    );
    return response
  } catch (error) {
    console.log(error);
    throw error;
  }
};
