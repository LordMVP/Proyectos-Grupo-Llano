import React, { useState, useEffect } from 'react';
import ReactTable from 'react-table-6';

const TablaPorcentajeAsociaciones = ({ listaParticipacion }) => {
  const columnsTable = [{ Header: "Concepto", accessor: "concepto", },];
  const [datosParticipacionAjus, setDatosParticipacionAjus] = useState([]);
  const [datosParticipacionDev, setDatosParticipacionDev] = useState([]);
  const [columnasParticipacionAjus, setColumnasParticipacionAjus] = useState([]);
  const [columnasParticipacionDev, setColumnasParticipacionDev] = useState([]);
  const porcAjuste = 5981;
  const porcDev = 6152;

  useEffect(() => {
    mapearDatosParticipacion(listaParticipacion);
  }, [])

  const mapearDatosParticipacion = (listaParticipacionAsociaciones) => {
    setDatosParticipacionAjus([]);
    setDatosParticipacionDev([]);
    if (listaParticipacionAsociaciones.length > 0) {
      let columnasAjus = [], listaAjusSinAjuste = {}, listaAjusAjuste = {}, listaDiferenciasAjust = {},
      columnasDev = [], listaDevSinAjuste = {}, listaDevAjuste = {}, listaDiferenciasDev = {},
      listaPorcentajesAjus = {},listaPorcentajesDev = {};

      listaParticipacionAsociaciones.map((item, index) => {
        console.log("items->"+JSON.stringify(item))
        if(Number(item.conIderegistro)==Number(porcAjuste)){
          console.log("ajuste");
          columnasAjus = [...columnasAjus, { accessor: `asociacion${index + 1}`, Header: item.nombreAsociacion }];
          listaAjusSinAjuste = { ...listaAjusSinAjuste, [`asociacion${index + 1}`]: item.sinAjuste };
          listaAjusAjuste = { ...listaAjusAjuste, [`asociacion${index + 1}`]: item.ajustado };
          listaDiferenciasAjust = { ...listaDiferenciasAjust, [`asociacion${index + 1}`]: item.diferencia };
        }else{
          console.log("devolucion");
          columnasDev = [...columnasDev, { accessor: `asociacion${index + 1}`, Header: item.nombreAsociacion }];
          listaDevSinAjuste = { ...listaDevSinAjuste, [`asociacion${index + 1}`]: item.sinAjuste };
          listaDevAjuste = { ...listaDevAjuste, [`asociacion${index + 1}`]: item.ajustado };
          listaDiferenciasDev = { ...listaDiferenciasDev, [`asociacion${index + 1}`]: item.diferencia };
        }
      });

      columnasAjus.map(element => {
        const valorPorcentaje = porcentajeParticipacionCalculo(listaDiferenciasAjust, element.accessor);
        listaPorcentajesAjus = { ...listaPorcentajesAjus, [element.accessor]: `${Number(valorPorcentaje).toFixed(4)} %` };
      });

      columnasDev.map(element => {
        const valorPorcentaje = porcentajeParticipacionCalculo(listaDiferenciasDev, element.accessor);
        listaPorcentajesDev = { ...listaPorcentajesDev, [element.accessor]: `${Number(valorPorcentaje).toFixed(4)} %` };
      });

      listaAjusSinAjuste = { concepto: 'Sin Ajuste', ...listaAjusSinAjuste };
      listaAjusAjuste = { concepto: 'Ajustadas', ...listaAjusAjuste };
      listaDiferenciasAjust = { concepto: 'Diferencia', ...listaDiferenciasAjust };
      listaPorcentajesAjus = { concepto: 'Participación', ...listaPorcentajesAjus };

      listaDevSinAjuste = { concepto: 'Sin Ajuste', ...listaDevSinAjuste };
      listaDevAjuste = { concepto: 'Ajustadas', ...listaDevAjuste };
      listaDiferenciasDev = { concepto: 'Diferencia', ...listaDiferenciasDev };
      listaPorcentajesDev = { concepto: 'Participación', ...listaPorcentajesDev };

      setColumnasParticipacionAjus([{ Header: 'Concepto', accessor: 'concepto' }, ...columnasAjus]);
      setColumnasParticipacionDev([{ Header: 'Concepto', accessor: 'concepto' }, ...columnasDev]);
      setDatosParticipacionAjus([listaAjusSinAjuste, listaAjusAjuste, listaDiferenciasAjust, listaPorcentajesAjus]);
      setDatosParticipacionDev([listaDevSinAjuste, listaDevAjuste, listaDiferenciasDev, listaPorcentajesDev]);
    };
  };

  const porcentajeParticipacionCalculo = (listaDiferencias, accessorAsociacion) => {
    let sumatoria = 0;
    var result = Object.keys(listaDiferencias).map((key) => listaDiferencias[key]);
    result.map(item => sumatoria = sumatoria + item);
    return ((listaDiferencias[`${accessorAsociacion}`] * 100) / sumatoria);
  };


  return (
    <div className='tablaPorcentajesAsociaciones'>
      <div className='m-3'>Porcentaje Asociaciones</div>
      {
        listaParticipacion && datosParticipacionAjus && datosParticipacionAjus.length > 0 &&
        <React.Fragment>
        <div style={{'marginTop' : '50px'}}>Ajustes</div>
        <ReactTable
          columns={columnasParticipacionAjus}
          data={datosParticipacionAjus}
          showPaginationBottom={false}
          defaultPageSize={4}
          style={{ width: "100%" }}
        />
        </React.Fragment>
      }
      {
        listaParticipacion && datosParticipacionDev && datosParticipacionDev.length > 0 &&
        <React.Fragment>
        <div style={{'marginTop' : '50px'}}>Devoluciones</div>
        <ReactTable
          columns={columnasParticipacionDev}
          data={datosParticipacionDev}
          showPaginationBottom={false}
          defaultPageSize={4}
          style={{ width: "100%" }}
        />
        </React.Fragment>
      }
    </div>
  );
};

export default TablaPorcentajeAsociaciones;
