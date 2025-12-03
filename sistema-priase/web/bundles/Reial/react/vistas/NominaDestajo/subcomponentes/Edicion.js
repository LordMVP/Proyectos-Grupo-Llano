import React, { Component } from 'react'
import { Combo, Input, VentanaModal } from 'appfuture-react'

import API from '../../../global/rutas_api'
import Peticion from '../../../global/peticion'
import Util from '../../../global/util'
import axios from 'axios';

class Edicion extends Component {
  state = {
    fecha: '',
    cantidad: '',
    contratista: '-1',
    municipio: '-1',
    actividad: '-1',
    cantidad: '',
    valorUnitario: '',
    valorPagar: '',
    observacion: '',
    generar: false
  }

  // componentes

  BotonGuardar = () => {
    /* prettier-ignore */

    const { fecha, contratista, actividad, municipio, cantidad, valorUnitario, valorPagar } = this.state
    const generar = this.state.generar

    return Util.validarObjeto({ fecha, contratista, actividad, municipio, cantidad, valorUnitario, valorPagar })
      ? <button className="btn" onClick={this.guardar}>{generar ? 'editar' : 'guardar'}</button>
      : <button className="btn" disabled={true}>{generar ? 'editar' : 'guardar'}</button>
  }

  listarActividades = () => {
    axios.post(API.NOMINA_DESTAJO.LISTAR_ACTIVIDADES_V2,
      {
        empCodempresa: this.state.contratista,
      }).then(respuesta => {
        if (respuesta.data.codigo > 0) {
          this.setState({ actividadJson: respuesta.data.datos });
        }
      });
  };

  listarMunicipios = () => {
    axios.post(API.NOMINA_DESTAJO.LISTAR_MUNICIPIOS, {
      proyectoCodemp: this.state.contratista,
    }).then(respuesta => {
      if (Util.validarArreglo(respuesta.data)) {
        this.setState({ municipioJson: respuesta.data });
      }
    });
  };

  // interno

  async componentDidUpdate(props,state) {

    if (props.contratistaJson !== this.props.contratistaJson) {
      this.setState({ contratistaJson: this.props.contratistaJson })
    }

    if (props.editable !== this.props.editable) {
      const { editable } = this.props
      console.log("desde edicion")
      console.log(editable)
    }

    const { actividad, municipio } = this.state

		if (state.actividad !== actividad ||
			state.municipio !== municipio) {


			if (Util.validarValor(actividad) &&
				Util.validarValor(municipio)) {

          this.setState({          
            cantidad: '',       
            valorPagar: ''          
          })  

				this.buscarValor(actividad, municipio)
			}
		}


  }

  change = async ({ target: { id, value } }) => {
    await this.setState({ [id]: value })

    //realizar calculo entre valorUnitario, cantidad y valor a pagar
    if (id == 'cantidad' || id == 'valorUnitario' || id == 'valorPagar') {
      let { cantidad, valorPagar, valorUnitario } = this.state
      if (Util.validarObjeto({})) {
        valorPagar = cantidad * valorUnitario
        this.setState({ valorPagar })
      } else {
        this.setState({ valorPagar: '' })
      }
    }

  }

  //Cambio de Empresa contratante
  cambiarContratante = async ({ target: { value } }) => {
    await this.setState({ contratista: value })
    this.listarActividades();
    this.listarMunicipios();
  }

  // vista

  cancelar = () => {
    this.props.cerrarModal(false)
  }

  obtenerNombreActividad = (actividad) => {
    const { actividadJson } = this.state;
    const act = actividadJson.find(a => a.actIdeactivi === actividad);
    if (typeof act === 'object') {
      return act.actDescripci;
    }
    return 'Indefinido';
  };

  obtenerNombreMunicipio = (idMunicipio) => {
    const { municipioJson } = this.state;
    const municipio = municipioJson.find(m => m.proyectoCod == idMunicipio);
    if (municipio) {
      return municipio.proyectoNom;
    }
    return 'Indefinido';
  };

  obtenerCodigoEmpresa = (contratante) => {
    const { contratistaJson } = this.state;
    const contratista = contratistaJson.find(c => c.empresaCod == contratante);
    if (contratante) {
      return contratista.empresaSevemp;
    }
    return 'Indefinido';
  };

  buscarValor = async (actividad, municipio) => {
		actividad = Util.obtenerId(actividad)
		municipio = Util.obtenerId(municipio)

		// peticion

		const valor = await Peticion.post({
			url: API.NOMINA_DESTAJO.CONSULTAR_VALOR,
			parametros: {
				proIdeproyec: municipio,
				actIdeactivi: actividad,
				empCodempresa:  this.state.contratista,
			}
		})

		const opciones = {
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
		}

		let mensaje = 'Valor obtenido correctamente'

		if (!valor || valor == '') {
			mensaje = 'La relación no tiene valor asociado'

			this.modificar = false

			//toast.warn(mensaje, opciones)
			return
		}

		this.modificar = true
		//toast.success(mensaje, opciones)

		this.setState({ valorUnitario: valor.actProactval })
	};

  guardar = () => {
    const editable = {
      ...this.props.editable,

      fecha_actividad: `${this.state.fecha}`,
      cantidad: this.state.cantidad,
      empIderegistro: this.obtenerCodigoEmpresa(this.state.contratista),
      codigo_municipio: Util.obtenerId(this.state.municipio),
      nombre_municipio: this.obtenerNombreMunicipio(this.state.municipio),
      codigo_actividad: this.state.actividad,
      nombre_actividad: this.obtenerNombreActividad(this.state.actividad),
      valor_unitario: this.state.valorUnitario,
      valor_pagar: this.state.valorPagar,
      ed_observacion:this.state.observacion,
    }
    if (!this.state.generar) {
      const lista = {
        lndIderegeistro: editable.lndIderegeistro,
        lndFechagrabacion: editable.lndFechagrabacion,
        usuIderegistro: editable.usuIderegistro,
        lndEstado: editable.lndEstado,
        empIderegistro: editable.empIderegistro,
        lndFechaactividad: editable.fecha_actividad,
        lndContratista: editable.contratista,
        codCodiemple: editable.cedula_nomina,
        colNumcontr: editable.contrato_nomina,
        actIdactivi: editable.codigo_actividad,
        lndCantidad: editable.cantidad,
        lndValorunitario: editable.valor_unitario,
        lndMunicipio: editable.codigo_municipio,
        lndValorapagar: editable.valor_pagar,
        lndObservacion: editable.ed_observacion,
      };

      Peticion.post({
        url: API.NOMINA_DESTAJO.ACTUALIZAR_LIQUIDACION,
        parametros: lista
      });
    }

    this.props.finalizarEdicion(editable)
    this.limpiarCampos();
  }

  limpiarCampos = () => {
    // limpieza
    this.setState({
      fecha: '',
      cantidad: '',      
      municipio: '-1',
      actividad: '-1',
      cantidad: '',
      valorUnitario: '',
      valorPagar: '',
      generar: false
    })
  }

  render() {
    const { BotonGuardar } = this

    return (
      <VentanaModal
        titulo="Edición de liquidación"
        mostrar={this.props.mostrar}
        cerrarModal={this.props.cerrarModal}
      >
        <div className="contenedor formulario">
          <Input
            id="fecha"
            label="fecha"
            type="date"
            value={this.state.fecha}
            onChange={this.change}
          />

          <Combo
            id="contratista"
            label="contratante"
            propValor='empresaCod'
            propTexto='empresaNom'
            value={this.state.contratista}
            opciones={this.props.contratistaJson}
            onChange={this.cambiarContratante}
            extra={{ disabled: !this.props.contratistaJson }}
          />

          <Combo
            id="actividad"
            label="actividad"
            propTexto='actDescripci'
            propValor='actIdeactivi'
            value={this.state.actividad}
            opciones={this.state.actividadJson}
            onChange={this.change}
            extra={{ disabled: !this.state.actividadJson }}
          />

          <Combo
            id="municipio"
            label="municipio"
            propValor='proyectoCod'
            propTexto='proyectoNom'
            value={this.state.municipio}
            opciones={this.state.municipioJson}
            onChange={this.change}
            extra={{ disabled: !this.state.municipioJson }}
          />

          <Input
            id="cantidad"
            label="cantidad"
            type="number"
            value={this.state.cantidad}
            onChange={this.change}            
          />

          <Input
            id="valorUnitario"
            label="valor unitario"
            type="number"
            value={this.state.valorUnitario}
            onChange={this.change}            
          />

          <Input
            id="valorPagar"
            label="valor a pagar"
            type="number"
            value={this.state.valorPagar}
            onChange={this.change}
          />

          <Input
            id="observacion"
            label="Observacion"
            value={this.state.observacion}
            onChange={this.change}
          />
        </div>

        <div className="contenedor btn-group">
          <BotonGuardar />
          <button className="btn" onClick={this.cancelar}>
            <span>cancelar</span>
          </button>
        </div>
      </VentanaModal>
    )
  }
}

export default Edicion
