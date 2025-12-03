import React, { Component, Fragment } from 'react'
import { Combo, Input, Fecha, Util } from 'appfuture-react'
import Autocompletado from '../../Assets/componentes/Autocompletado'
import API from '../../../global/rutas_api'
import Peticion from '../../../global/peticion'
import axios from 'axios';
import './Generacion.scss';
import { toast } from 'react-toastify';

const opciones = {
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

class Generacion extends Component {
  state = {
    dialogoModal: false,
    deshabilitar: true,
    lista: [],
    listaLiquidaciones: [],

    // defecto

    empresa: '-1',
    descripcion: '',
    municipio: '',
    ordenTrabajo: '',
    desde: '',
    hasta: '',
    enProgreso: false,
    progreso: 0,
  };

  // componentes

  BotonPreliquidar = () => {
    /* prettier-ignore */
    return !this.state.enProgreso
      ? <button className="btn" onClick={() => { this.preliquidar() }}>preliquidar</button>
      : <button className="btn" disabled={true}>preliquidar</button>
  };

  BotonLimpiar = () => {
    /* prettier-ignore */
    return !this.state.enProgreso
      ? <button className="btn" onClick={() => { this.limpiarCampos() }}>Limpiar</button>
      : <button className="btn" disabled={true}>Limpiar</button>
  };

  /**
   * Obtiene el id del Municipio.
   * @param {string}
   * @return {number}
   */
  obtenerIdMunicipio = (texto) => {
    const { municipioJson } = this.state;
    const municipio = municipioJson.find(m => m.texto.trim() == texto.trim());
    if (!municipio) {
      return null;
    }
    return municipio.valor;
  };

  validarArreglo = (arreglo) => {
    return Array.isArray(arreglo) && arreglo.length;
  };

  verificarProgreso = () => {
    this.setState({ enProgreso: true });
    this.consultarProgreso();
  };

  consultarProgreso = () => {
    axios.post(API.PRELIQUIDACION_FACTURACION.VERIFICAR_PROGRESO)
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.setState({ progreso: respuesta.data.datos.correcto, errores: respuesta.data.datos.errores });
          setTimeout(this.consultarProgreso, 15000);
        } else {
          this.setState({ enProgreso: false });
        }
      });
  };

  obtenerIdOrdenTrabajo = (ordenTrabajo) => {
    if (!Util.validarArreglo(this.state.ordenTrabajoJson)) {
      return null;
    }
    const indexOrden = this.state.ordenTrabajoJson.findIndex(o => {
      if (o.texto == ordenTrabajo) {
        return o;
      }
    });
    if (indexOrden >= 0) {
      return this.state.ordenTrabajoJson[indexOrden].sigueOrdtra;
    }
    return null;
  };

  preliquidar = () => {
    const { desde, hasta, empresa, ordenTrabajo, municipio, descripcion, liquidacion } = this.state;

    if(desde==='' || 
      hasta==='' ||
      empresa===''||
      descripcion===''){
        let mensaje = 'Es necesario ingresar Empresa,Fechas,Descripcion,Liquidacion';
        toast.error(mensaje, opciones); 
    }
    else{
      axios.post(API.PRELIQUIDACION_FACTURACION.PRELIQUIDAR,
        {
          fechaInicio: desde,
          fechaFin: hasta,
          uniLiquidacion: liquidacion,
          codigoEmpresa: empresa,
          ordenTrabajo: this.obtenerIdOrdenTrabajo(ordenTrabajo),
          observacion: descripcion,
          proyectoIderegistro: this.obtenerIdMunicipio(municipio),
        })
        .then(respuesta => {
          if (respuesta.data.codigo > 0) {
            this.verificarProgreso();
          }
        });
    }

  };

  // confirmar = () => {
  //   this.props.mostrarAlerta('Confirmación', '¿Desea preliquidar la información actual?', [
  //     {
  //       clase: 'btn btn-danger',
  //       callback: () => this.preliquidar(),
  //       texto: 'Aceptar'
  //     },
  //     {
  //       clase: 'btn btn-secondary',
  //       texto: 'Cancelar'
  //     }
  //   ]);
  // };

  BotonConsultar = () => {
    /* prettier-ignore */

    return !this.state.enProgreso
      ? <button className="btn" onClick={this.consultar}>consultar</button>
      : <button className="btn" disabled={true}>consultar</button>
  };

  BotonValidar = () => {
    /* prettier-ignore */

    return !this.state.enProgreso
      ? <button className="btn" onClick={this.validar}>validar</button>
      : <button className="btn" disabled={true}>validar</button>
  };

  consultarEmpresas = () => {
    axios.post(API.PRELIQUIDACION_FACTURACION.LISTAR_EMPRESAS)
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.setState({
            empresaJson: Util.validarArreglo(respuesta.data.datos) ? respuesta.data.datos : []
          });
        }
      });
  };

  obtenerIdEmpresaSeven = (idEmpresa) => {
    const empresa = this.state.empresaJson.find(e => e.empresaCod == idEmpresa);
    return empresa ? empresa.empresaSevemp : null;
  };

  consultarMunicipios = () => {
    Peticion.postCustom({
      url: API.PRELIQUIDACION_FACTURACION.LISTAR_MUNICIPIOS,
      config: {
        valor: 'proyectoCod',
        texto: 'proyectoNom',
        autocompletado: true,
      },
      parametros: {
        idEmpresaContratante: this.obtenerIdEmpresaSeven(this.state.empresa),
      },
      callback: municipioJson => {
        const municipios = Util.validarArreglo(municipioJson) ? municipioJson : [];
        this.setState({ municipioJson: municipios })
      }
    });
  };

  consultarLiquidaciones = () => {
    axios.post(API.PRELIQUIDACION_FACTURACION.LISTAR_LIQUIDACIONES_APLICAR, { criterio: '' })
      .then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.setState({ listaLiquidaciones: respuesta.data.datos });
        }
      });
  };

  parsearListaParaAutocomplete = (lista, config) => {
    const listaFinal = [];
    lista.forEach(item => {
      const obj = {
        id: item[config.valor],
        texto: item[config.texto]
      };
      listaFinal.push(obj);
    });
    return listaFinal;
  };

  consultarOrdenesTrabajo = () => {
    const { empresa } = this.state;
    if (!empresa || (typeof empresa == 'string' && empresa.trim() == '')) {
      return;
    }

    Peticion.postCustom({
      url: API.PRELIQUIDACION_FACTURACION.LISTAR_ORDENES_COMPLETAS,
      parametros: {
        codigoEmpresa: this.state.empresa,
        autocompletado: true
      },
      config: {
        valor: 'sigueCodsus',
        texto: 'sigueOrdtra',
        autocompletado: true
      },
      callback: (ordenTrabajoJson) => this.setState({ ordenTrabajoJson }),
    });
  };

  componentDidMount() {
    this.consultarEmpresas();
    this.consultarLiquidaciones();
  };

  verificarConsultas = (id, value) => {
    if (this.obtenerIdOrdenTrabajo(value)) {
      return;
    }

    if (id === 'empresa') {
      this.consultarOrdenesTrabajo();
    }

    if (id == 'ordenTrabajo') {
      console.log(value);
      if (this.state.empresa === '-1') {
        !this.state.deshabilitar ? this.setState({ deshabilitar: true }) : ''
        return;
      }
      this.setState({ deshabilitar: false });
      if (value && value.length >= 3) {
        Peticion.postCustom({
          url: API.PRELIQUIDACION_FACTURACION.LISTAR_ORDENES_COMPLETAS,
          parametros: {
            codigoEmpresa: this.state.empresa,
            sigueOrdtra: value,
            autocompletado: true
          },
          config: {
            valor: 'sigueCodsus',
            texto: 'sigueOrdtra',
            autocompletado: true
          },
          callback: (ordenTrabajoJson) => this.setState({ ordenTrabajoJson }),
        })
      }
    }
  };

  change = ({ target: { id, value } }) => {
    this.setState({ [id]: value }, () => {
      this.verificarConsultas(id, value);
      if (!Util.validarArreglo(this.state.municipioJson) && id == 'empresa') {
        this.consultarMunicipios();
      }
    });
  };

  // vista

  cancelar = () => {
    this.limpiarCampos()
    this.handleDialogo(false) // cerrar modal
  }

  //consultar = () => this.props.onChange(1);
  validar = () => this.props.onChange(1);

  guardar = () => {
    // TODO
    this.cancelar();
  }

  handleDialogo = (valor) => {
    if (valor == undefined || typeof valor != 'boolean') {
      valor = !this.state.dialogoModal;
    }
    this.setState({ dialogoModal: valor })
  }

  limpiarCampos = () => {
    // limpieza
    this.setState({
      desde: '',
      hasta: '',
      municipio: '-',
      contratista: '-1',
      enProgreso: false,
      errores: [],
    })
  }

  botones = [
    { texto: 'guardar', callback: this.guardar },
    { texto: 'cancelar', callback: this.cancelar },
  ];

  renderErrores = () => {
    const { errores } = this.state;
    return (
      <Fragment>
        <h2 className='text-danger mb-0'><i className='fa fa-fw fa-times'></i> Errores transacción</h2>
        <table className='table table-hover table-condensed table-striped table-striped'>
          <thead>
            <tr>
              <th>Agenda</th>
              <th>Código Suscripción</th>
              <th>Mensaje</th>
              <th>Código Servicio</th>
            </tr>
          </thead>
          <tbody>
            {errores.map(error => {
              return (
                <tr key={error.sigueIde}>
                  <td>{error.sigueCodage}</td>
                  <td>{error.sigueCodsus}</td>
                  <th>{error.mensaje}</th>
                  <td>{error.sigueCodser}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Fragment>
    );
  };

  render() {
    const { BotonValidar, BotonPreliquidar, BotonLimpiar } = this

    return (
      <React.Fragment>
        <h1>Preliquidación de factura</h1>

        <div className="d-flex justify-content-center btn-group">
          <BotonPreliquidar />        
          <BotonValidar/>
          <BotonLimpiar />
        </div>
        {
          this.state.enProgreso && (
            <div className='col-12 mt-5'>
              <div className='content-progress'>
                <label className='titulo'>La acción se encuentra en progreso, por favor espere...</label>
                <i className='fa fa-fw fa-spinner fa-spin'></i>
                <label className='descripcion text-success'>Se han ejecutado {this.state.progreso} registros.</label>
                {this.state.errores > 0 && (<label className='descripcion errores text-danger'>Se han generado {Util.validarArreglo(this.state.errores) && this.state.errores.length} errores.</label>)}
              </div>
            </div>
          )
        }
        {Util.validarArreglo(this.state.errores) && this.renderErrores()}
        {!this.state.enProgreso && !Util.validarArreglo(this.state.errores) && (
          <div className="contenedor formulario">
            <Combo
              id="empresa"
              label="empresa"
              propValor='empresaCod'
              propTexto='empresaNom'
              name='empresa'
              value={this.state.empresa}
              onChange={this.change}
              opciones={this.state.empresaJson}
              required={true}
            />

            <Input
              id="descripcion"
              label="descripción liquidación"
              value={this.state.descripcion}
              onChange={this.change}
            />

            <Autocompletado
              id="municipio"
              label="municipio"
              value={this.state.municipio}
              onChange={this.change}
              opciones={this.state.municipioJson}
              required={true}
            />

            <Autocompletado
              id="ordenTrabajo"
              label="orden de trabajo"
              marcaAgua={'Escriba la orden de trabajo'}
              opciones={this.state.ordenTrabajoJson}
              onChange={this.change}
              value={this.state.ordenTrabajo}
              required={true}
              extra={{
                disabled: this.state.deshabilitar
              }}
            />

            <Fecha
              id='desde'
              label='Desde*'
              name='desde'
              fecha={this.state.desde}
              onChange={this.change}
            />

            <Fecha
              id='hasta'
              label='Hasta*'
              name='hasta'
              fecha={this.state.hasta}
              onChange={this.change}
            />

            <Combo
              id='liquidacion'
              opciones={this.state.listaLiquidaciones}
              propTexto='liqNombre'
              propValor='uniLiquidacion'
              label='Liquidación aplicar*:'
              name='liquidacion'
              value={this.state.liquidacion}
              onChange={this.change}
            />

          </div>
        )}
      </React.Fragment>
    )
  }
}

export default Generacion
