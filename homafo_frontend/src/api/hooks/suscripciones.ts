import { useState } from "react";
import suscripcionSuscriptorApi from "../suscripcion/suscripcionHomologacion";
const newSuscripcionApi = new suscripcionSuscriptorApi();

export function getSuscripcionesByIDTercero(init: any): any {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [data, setData] = useState<any>(init || null);
  const onClearList = () => setData(init || null);
  const onFetch = (id: number, idEmp: number) =>
    newSuscripcionApi
      .getSuscripcionesHomologaciones(id, idEmp)
      .then((response) => {
        setData(response.data);
      });
  return [data, onFetch, onClearList];
}

export function getUnitsContact(init: any): any {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [data, setData] = useState<any>(init || null);
  const onClearList = () => setData(init || null);
  const onFetch = () =>
    newSuscripcionApi.getUnitsContactThird().then((response) => {
      setData(response.data);
    });
  return [data, onFetch, onClearList];
}
