import React, { Fragment, useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";

import axios from "axios";
import InputCustom from "../Utils/components/InputCustom";
import { getToken } from "../../global/util_nominaciones";

export const Reportes = ({ match }) => {
  const [session, setSession] = useState();
  const [filtros, setFiltros] = useState([]);
  const [parametros, setParametros] = useState(null);
  const [configuracion, setConfiguracion] = useState(null);

  const api = axios.create({
    baseURL: "http://localhost:8080/priase/api/v1/",
  });
  const consultar = (url, setObject, objeto) => {
    api
      .post(url, objeto)
      .then((respuesta) => {
        setObject(respuesta.data.data[0]);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const consultar2 = async (url, objeto) => {
    return await api.post(url, objeto);
  };
  const getSession = () => {
    let bearerToken = getToken();
    bearerToken = bearerToken.replace("Bearer ", "");
    consultar2("/session/get", { token: bearerToken }).then((respuesta) => {
      setSession(respuesta.data.datos);
    });
  };

  const getReportes = async () => {
    const localSession = JSON.parse(localStorage.getItem("datos_prisma"));
    //todos los datos requeridos han de ser enviados en el objeto
    const filtrosRequire = filtros.filter((filtro) => filtro.require);
    const isChange = filtrosRequire.every((filtro) => filtro.isChange);
    if (isChange) {
      const valuesConfig = configuracion.valor;
      //objeto a enviar
      const entidad = {
        jndi: valuesConfig.jndi,
        format: parametros.valor.formato,
        reportName: valuesConfig.path + parametros.valor.jasper,
        user: valuesConfig.user.id,
        password: valuesConfig.user.password,
        parameters: {
          PR_INT_EMPRESA: session.idEmpresa,
          PR_STR_TITULO_EMPRESA: session.parametros.nombreEmpresa,
          PR_STR_ROOT_PATH: valuesConfig.path,
          PR_STR_IMAGES_PATH: valuesConfig.path,
          PR_INT_NUMERO_VENTA: 1,
          PR_INT_SUSCRIPCION: 1,
          PR_STR_DOCUMENTO: "1",
          PR_STR_USUARIO: localSession.usuario,
        },
      };
      //se agregan los parametros faltantes
      filtros.forEach((filtro) => {
        if (filtro.isChange) {
          if (filtro.name.includes("INT")) {
            entidad.parameters[filtro.name] = parseInt(filtro.value);
          } else {
            entidad.parameters[filtro.name] = filtro.value;
          }
        }
      });

      //se evalua la validacion dada por el backend
      const validacion = parametros.valor.validacion;
      console.log(validacion);
      eval(validacion);
      console.log(entidad);
      const validacionRequire = parametros.valor.validacionRequire
        .replaceAll("\n", "")
        .split(";");
      validacionRequire.pop();
      let isValid = true;
      validacionRequire.forEach((v) => {
          if (!eval(v)) {
            console.log(eval(v));
            isValid = false;
          }
      });
      if (isValid) {
        // se envia la peticion
        const respuesta = await api.post(
          "http://10.43.51.126:8080/JasperBridge-1.0-SNAPSHOT/ws/jasper/json",
          entidad
        );
        const base64 = respuesta.data.content;
        //se descarga el archivo segun el formato seleccionado del base64 recibido
        if (parametros.valor.formato === "pdf") {
          downloadFile(
            `data:application/pdf;base64,${base64}`,
            parametros.valor.titulo + ".pdf"
          );
        }
        if (parametros.valor.formato === "xlsx") {
          downloadFile(
            `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${base64}`,
            parametros.valor.titulo + ".xlsx"
          );
        }
      }else{
        alert("No se puede generar el reporte, verifique los datos ingresados");
      }
    } else {
      alert("Todos los campos son requeridos");
    }
  };
  function downloadFile(pdfBase64, filename) {
    const linkSource = pdfBase64;
    const downloadLink = document.createElement("a");
    const fileName = filename;
    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
  }

  const onChange = (obj, e) => {
    obj.isChange = true;
    obj.value = e.target.value;

    const filtrosCopy = filtros.map((filtro) => {
      if (filtro.name === obj.name) {
        return obj;
      }
      return filtro;
    });
    setFiltros(filtrosCopy);
  };
  useEffect(() => {
    if (parametros) {
      const isDataRequire = parametros.valor.filtros.some(
        (filtro) => filtro.dataRequire
      );
      if (isDataRequire) {
        parametros.valor.filtros.map((filtro) => {
          if (filtro.dataRequire) {
            consultar2("/filtros/getByFilter", {
              clave: filtro.dataOrigin,
            })
              .then((respuesta) => {
                filtro.data = respuesta.valor;
                setFiltros(parametros.valor.filtrosgetReportes);
              })
              .catch((error) => {
                console.log("error", error);
              });
          }
        });
      } else {
        setFiltros(parametros.valor.filtros);
      }
    }
  }, [parametros]);

  useEffect(() => {
    consultar("/reportes/getByPriase", setParametros, {
      clave: match.params.reporte,
    });
    consultar("/reportes/getByPriase", setConfiguracion, {
      tipo: "configuracion",
    });
    getSession();
  }, []);

  return (
    <Fragment>
      <Form.Row>
        <div className="card w-100">
          <div className="card-body align-items-center justify-content-center">
            <div className="row">
              <div className="col-12">
                <h2>Parametros</h2>
              </div>
            </div>
            <div className="row">
              {filtros.length > 0 &&
                filtros.map((parametro, index) => {
                  return (
                    <InputCustom
                      label={parametro.label}
                      name={parametro.name}
                      type={parametro.type}
                      options={parametro.data ? parametro.data : null}
                      disabled={parametro.disabled}
                      key={index}
                      onChange={(e) => onChange(parametro, e)}
                    />
                  );
                })}
            </div>
          </div>
          <Form.Row className="justify-content-center mb-3 align-items-center">
            <Button
              variant="primary"
              type="submit"
              onClick={() => {
                getReportes();
              }}
            >
              Generar Reporte
            </Button>
          </Form.Row>
        </div>
      </Form.Row>
    </Fragment>
  );
};