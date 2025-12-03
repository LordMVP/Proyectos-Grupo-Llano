import { toast } from "react-toastify";
export function base64toBlob(base64Data: string, filename: string) {
  // convierte base64 a blob para reenviar el mismo archivo
  let arr = base64Data.split(",");
  let mime = arr[0].match(/:(.*?);/);

  if (mime !== null && mime[1] !== null) {
    let bstr = atob(arr[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: `${mime}` });
  } else {
    toast.error("El archivo no puede se mostrado");
    return null;
  }
}
