import { URL_BACKEND_BIOAGRICOLA } from "../../global/constantes";
import axios from "axios";

export const downloadFiles = async (
  url,
  fileName,
  params,
  typeFile = "pdf"
) => {
  try {
    const response = await axios.get(URL_BACKEND_BIOAGRICOLA + url, {
      params,
      headers: {
        "Content-Type": `application/${typeFile};blob`,
        //"Content-Type": "blob",
      },
      responseType: "blob",
    });
    const urldown = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = urldown;
    link.setAttribute("download", `${fileName}.${typeFile}`);
    document.body.appendChild(link);
    link.click();
  } catch (error) {
    console.log(error);
    throw error;
  }
};
