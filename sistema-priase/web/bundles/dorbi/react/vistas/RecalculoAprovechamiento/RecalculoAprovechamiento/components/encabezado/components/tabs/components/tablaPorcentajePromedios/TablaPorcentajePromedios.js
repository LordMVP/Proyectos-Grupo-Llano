import React, { Fragment} from 'react';
import { Input, Botonera, Combo, Tabla, VentanaModal, Util, TextoNumerico } from 'appfuture-react';
import ReactTable from 'react-table-6';

const TablaPorcentajePromedios = ({ listaPorcentajesPromedios }) => {
  let lista = listaPorcentajesPromedios;
    if (!Util.validarArreglo(lista)) {
      return <div className='text-center'>Sin resultados</div>
    }

    return (
      <div>
      <table className='table table-bordered'>
        <thead className='bg-dark text-white'>
          <tr>
          <th colSpan={4} className='text-center'>Porcentaje TA</th>
          </tr>
          <tr>
            <th className='text-center'>N°</th>
            <th className='text-center'>Asociación</th>
            <th className='text-center'>Promedio</th>
            <th className='text-center'>Porcentaje</th>
          </tr>
        </thead>
        <tbody>
          {Util.validarArreglo(lista) && (
            lista.filter(x=>x.conIderegistro==5979)
            .map((dato, index) => {
              return (
                <Fragment key={Util.generarIdControl(index)}>
                  <tr key={Util.generarIdControl(index)}>
                    <td >{index+1}</td>
                    <td >{dato.nombreAsociacion}</td>
                    <td >{dato.ajustado}</td>
                    <td >{(dato.participacion).toFixed(5)}%</td>
                  </tr>
                </Fragment>
              );
            })
          )}
        </tbody>
        <tfoot>
        <tr>
          <td colSpan={2} className='text-center'>TOTAL</td>
          <td >{
          lista.filter(x=>x.conIderegistro==5979)
          .reduce((a,v) =>  a = a + v.ajustado , 0 ).toFixed(4)
          }</td>
          <td >{
          lista.filter(x=>x.conIderegistro==5979)
          .reduce((a,v) =>  a = a + v.participacion , 0 ).toFixed(0)
          }%</td>
        </tr>          
        </tfoot>
      <div></div>
      </table>
      <table className='table table-bordered'>
        <thead className='bg-dark text-white'>
        <tr>
          <th colSpan={4} className='text-center'>Porcentaje CCS</th>
          </tr>
          <tr>
            <th className='text-center'>N°</th>
            <th className='text-center'>Asociación</th>
            <th className='text-center'>Promedio</th>
            <th className='text-center'>Porcentaje</th>
          </tr>
        </thead>
        <tbody>
          {Util.validarArreglo(lista) && (
            lista.filter(x=>x.conIderegistro==5980)
            .map((dato, index) => {
              return (
                <Fragment key={Util.generarIdControl(index)}>
                  <tr key={Util.generarIdControl(index)}>
                    <td >{index+1}</td>
                    <td >{dato.nombreAsociacion}</td>
                    <td >{dato.ajustado}</td>
                    <td >{(dato.participacion).toFixed(5)}%</td>
                  </tr>
                </Fragment>
              );
            })
          )}
        </tbody>
        <tfoot>
        <tr>
          <td colSpan={2} className='text-center'>TOTAL</td>
          <td >{
          Number(lista.filter(x=>x.conIderegistro==5980 && x.participacion!=0)
          .reduce((a,v) =>  a = a + v.ajustado , 0 )).toFixed(4)
          }</td>
          <td >{
          lista.filter(x=>x.conIderegistro==5980)
          .reduce((a,v) =>  a = a + v.participacion , 0 ).toFixed(0)
          }%</td>
        </tr>          
        </tfoot>
      </table>
      </div>
    );
};

export default TablaPorcentajePromedios;
