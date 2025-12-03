import React, { Component } from 'react'
import { Input, Tabla, VentanaModal } from 'appfuture-react'

import Peticion from '../../../../global/peticion'
import API from '../../../../global/rutas_api'

import Util from '../../../../global/util'
/**
 *
 *
 * @class Detalle
 * @extends {Component}
 */
class Detalle extends Component {

  /**
   *Define estados iniciales
   * @memberof ActividadesMunicipios
   */
  state = { lista: [] }

  columnas = [
    {
      Header: 'Venta',

      columns: [
        { Header: 'Liquidación', accessor: 'liquidacion' },
        { Header: 'Concepto', accessor: 'concepto' },
        { Header: 'Valor Unitario', accessor: 'valorUnitario' },
        { Header: 'Cantidad', accessor: 'cantidad' },
        { Header: 'Total', accessor: 'total' },
      ],
    },
  ]

	/**
     * Realiza las consultas previas para listar los elementos que irán en los combobox
     * @method
     * @async
     */
  componentDidMount() {
    // lista

    this.obtenerLista()
  }

	/**
	 *
	 *Carga la lista de detalles al escoger un contratista  y suscriptor del combobox
	 * @method
	 */

  async obtenerLista() {
    const { servicio } = this.props

    // peticion

    let lista = await Peticion.post({
      url: API.BUSQUEDA_SERVICIOS.CONSULTAR_DETALLE_VENTA,
      parametros: {
        suscriptor: Util.obtenerId(servicio.suscriptor),
        empresaContratante: servicio.contratante,
      },
    })

    if (lista.length == undefined) return // no hay datos

    lista = lista.map(function (dato) {
      return {
        liquidacion: dato.liqLiquidacion.liqNombre,
        concepto: dato.conConcepto.conNombre,
        valorUnitario: dato.dvenDetVenta.dvenVlrunitario,
        cantidad: dato.dvenDetVenta.dvenCantidad,
        total: dato.dvenDetVenta.dvenVlrtotal,
        venFecaprobada: dato.venFecaprobada,
        venFecha: dato.venFecha
      }
    });

    let fechaAprobacion = '';
    let fechaVenta = '';
    if (Util.validarArreglo(lista)) {
      const temp = lista[0];
      fechaAprobacion = temp.venFecaprobada;
      fechaVenta = temp.venFecha;
    }

    this.setState({ lista: lista, fechaVenta: fechaVenta, fechaAprobacion: fechaAprobacion });
  }

  /**
   *Renderiza la vista 
   * @return {JSX} componente - returna vista jsx 
   */
  render() {
    return (
      <VentanaModal
        titulo="Detalle de venta"
        mostrar={this.props.mostrar}
        cerrarModal={this.props.cerrarModal}
      >

        <div className="fila">
          <Input
            label="fecha venta"
            extra={{ disabled: true }}
            value={this.state.fechaVenta}
          />

          <Input
            label="fecha aprobacion"
            extra={{ disabled: true }}
            value={this.state.fechaAprobacion}
          />
        </div>

        <div className="contenedor">
          <Tabla datos={this.state.lista} columnas={this.columnas} />
        </div>
      </VentanaModal>
    );
  }
}

export default Detalle
