import React, { Component } from 'react';
import { Combo, Input, Fecha, Tabla } from 'appfuture-react';

import Autocompletado from '../../../Assets/componentes/Autocompletado';
import API from '../../../../global/rutas_api';
import Peticion from '../../../../global/peticion';
import axios from 'axios';
import Util from '../../../../global/util';


/**
 *
 *
 * @class Materiales
 * @extends {Component}
 */
class Materiales extends Component {

	/**
     *Define estados iniciales
     * @memberof Materiales
     */
  state = {
    colaboradorJson: this.props.colaboradorJson || [],
    materialJson: this.props.materialJson || [],
    listaMaterial: this.props.listaMaterial || [],
    lista: this.props.lista || [],

    // defecto

    colaborador: '',
    material: '',

    cantidad: '',
    fechaAplicacion: '',
    valorMaterial: '',
    observaciones: '',
    numeroMedidor: '',
    habilitarNumeroMedidor: true,


    alto: '0',
    largo: '0',
    profundo: '0',
  }

  columnas = [
    {
      Header: 'Materiales',

      columns: [
        {
          Header: 'Material',
          accessor: 'material',
          /*Cell: (props) => props.value.materialCod*/
        },

        { Header: 'Cantidad', accessor: 'tranmaterialCan' },

        {
          Header: 'Fecha Aplicación',
          accessor: 'tranmaterialFecgra',
          Cell: (props) => {
            try {
              return props.value;
            } catch (error) {
              return 'Indefinida';
            }
          },
        },

        { Header: 'Medidas', accessor: 'tranmaterialMedidas' },

        {
          Header: 'Observaciones',
          accessor: 'tranmaterialObservaciones',
        },
        {
          Header: 'Acción',
          accessor: 'material',
          Cell: (props) => {
            const click = () => {
              if (props.original.ancIderegistro) {
                this.setState({ id: props.original.ancIderegistro })
                this.handleModal();
              }

              else {
                // eliminar
                let datos = this.props.value
                const indice = props.index - this.state.lista.length

                datos = datos.filter(function (value, index) {
                  return index !== indice
                })

                this.props.onChange({ target: { id: 'materiales', value: datos } })
              }
            }

            return (
              <button className="btn" onClick={click}>
                <span>eliminar</span>
              </button>
            )
          },
        },
      ],
    },
  ]

	/**
     *
     *Habilita el botón agregar
     *@method
     *@param {Object} props
     *@return {JSX} Componente - Button
     */

  BotonAgregar = () => {
    /* prettier-ignore */
    const { colaborador, material, fechaAplicacion, cantidad, valorMaterial, alto, largo, profundo } = this.state
    return Util.validarObjeto({ colaborador, material, fechaAplicacion, cantidad, valorMaterial, alto, largo, profundo })
      ? <button className="btn" onClick={this.agregar}>agregar</button>
      : <button className="btn" disabled={true}>agregar</button>
  }

	/**
     *
     *Habilita el botón guardar
     *@method
     *@param {Object} props
     *@return {JSX} Componente - Button
     */
  BotonGuardar = () => {
    return (this.props.value.length > 0)
      ? <button className="btn" onClick={this.guardar}>Guardar</button>
      : <button className="btn" disabled={true}>Guardar</button>
  };

  /**
   * Método encargado de llegar un control de cuanto se actualiza el componente.
   * @method
   * @param {Object} props Propiedades del componente
   */
  componentDidUpdate(props, state) {
    if (props.servicio.id !== this.props.servicio.id) {
      //this.obtenerLista()
    }
    if (props.colaboradorJson !== this.props.colaboradorJson) {
      this.setState({ colaboradorJson: this.props.colaboradorJson })
    }
    if (props.materialJson !== this.props.materialJson) {
      this.setState({ materialJson: this.props.materialJson })
    }
    if (props.listaMaterial !== this.props.listaMaterial) {
      this.setState({ listaMaterial: this.props.listaMaterial })
    }
  }
	/**
     * Realiza las consultas previas para listar los elementos que irán en los combobox
     * @method
     * @async
     */
  async componentDidMount() {
    const { servicio } = this.props
  }

  change = ({ target: { id, value } }) => {
    this.setState({ [id]: value });
    if (id == 'material') {
      if (value.search('-') !== -1) {
        const listaMaterial = this.state.listaMaterial;
        const filtro = Util.obtenerId(value);
        const item = listaMaterial.filter((a) => {
          return a.materialCod == filtro;
        });
        this.setState({
          valorMaterial: item[0].materialVlruni,
          habilitarNumeroMedidor: !item[0].materialSwtmed,
          numeroMedidor: item[0].materialSwtmed ? this.state.numeroMedidor : ''
        });
      } else {
        this.setState({
          valorMaterial: ''
        });
      }
    }
  }

	/**
	 *
	 * Agregar material en la BD
	 * @method
	 * 
	 */
  agregar = () => {
    const { alto, largo, profundo } = this.state
    const servicio = this.props.servicio
    const fecha = this.state.fechaAplicacion
    //obtener valor del material
    const listaMaterial = this.state.listaMaterial
    const filtro = Util.obtenerId(this.state.material)
    let materialSwtmed = listaMaterial.filter((a) => {
      return a.materialCod == filtro
    })
    materialSwtmed = materialSwtmed[0].materialSwtmed

    const datos = [
      ...this.props.value,
      {
        tranmaterialCan: this.state.cantidad,
        materialSwtmed,
        tranmaterialFecgra: fecha,
        tranmaterialOrdtra: servicio.ordenTrabajo,
        tranmaterialCodsus: Util.obtenerId(servicio.suscriptor),
        tranmaterialCodmat: Util.obtenerId(this.state.material),
        tranmaterialCodemp: Util.obtenerId(servicio.contratante),
        tranmaterialCodser: Util.obtenerId(servicio.id),
        tranmaterialVlruni: this.state.valorMaterial,
        tranmaterialObservaciones: this.state.observaciones,
        tranmaterialMedidas: [alto, largo, profundo].join(', '),
        medidorNummed: this.state.numeroMedidor,
        //uso de la tabla
        material: Util.obtenerId(this.state.material, 1)
				/*material: {
					materialCod: Util.obtenerId(this.state.material, 1),
				},
				tranmaterialNomemp: Util.obtenerId(this.state.colaborador, 1),*/
      },
    ]
    this.props.onChange({ target: { id: 'materiales', value: datos } })
    this.limpiarCampos()
  }

  /**
   * Método encargado de guardar los materiales
   * @method
   */
  guardar = async () => {
    //this.limpiarCampos()
    this.props.onChange({ target: { id: 'materiales', value: [] } });
    await this.props.guardar();
    this.consultarMaterialesServicio();
  };

  /**
   * Limpiar el formulario de agregar materiales
   * @method
   */
  limpiarCampos = () => {
    this.setState({
      material: '',
      cantidad: '',
      fechaAplicacion: '',
      valorMaterial: '',
      observaciones: '',
      //alto: '',
      //largo: '',
      //profundo: '',
    });
  }


  /**
   * Método encargado de consultar los materiales listados
   * @method
   */
  consultarMaterialesServicio = () => {
    const servicio = this.props.servicio;
    axios.post(API.BUSQUEDA_SERVICIOS.CONSULTAR_MATERIALES, {
      ordenTrabajo: servicio.ordenTrabajo,
      servicio: servicio.id,
      suscripcion: servicio.suscriptor,
    }).then(respuesta => {
      if (respuesta.data.codigo > 0) {
        let lista = respuesta.data.datos.map(fila => {
          fila.material = (typeof fila.material == 'string') ? fila.material : fila.material.materialNom;
          return fila;
        });
        this.setState({ lista: lista });
      }
    });
  };

  /**
 *Renderiza la vista 
 * @return {JSX} componente - returna vista jsx 
 */
  render() {
    return (
      <React.Fragment>
        <div className="contenedor formulario">
          <Autocompletado
            id="colaborador"
            label="colaborador"
            marcaAgua={'Escribe el colaborador'}
            opciones={this.state.colaboradorJson}
            onChange={this.change}
            value={this.state.colaborador}
            required={true}
            extra={{
              disabled: false
            }}
          />
          <Autocompletado
            id="material"
            label="material"
            marcaAgua={'Escribe el material'}
            opciones={this.state.materialJson}
            onChange={this.change}
            value={this.state.material}
            required={true}
            extra={{
              disabled: false
            }}
          />
          <Fecha
            id='fechaAplicacion'
            label='Fecha Aplicación'
            name='fechaAplicacion'
            fecha={this.state.fechaAplicacion}
            onChange={this.change}
          />
          <Input
            id="numeroMedidor"
            label="número medidor"
            type="text"
            value={this.state.numeroMedidor}
            onChange={this.change}
            extra={{
              disabled: this.state.habilitarNumeroMedidor,
            }}
          />
          <Input
            id="cantidad"
            label="cantidad"
            type="number"
            value={this.state.cantidad}
            onChange={this.change}
          />
          <Input
            id="valorMaterial"
            label="valor material"
            type="number"
            value={this.state.valorMaterial}
            onChange={this.change}
          />
          <Input
            id="observaciones"
            label="observaciones"
            value={this.state.observaciones}
            onChange={this.change}
          />
        </div>

        <div className="contenedor fila">
          <Input
            id="alto"
            label="alto"
            type="number"
            value={this.state.alto}
            onChange={this.change}
          />

          <Input
            id="largo"
            label="largo"
            type="number"
            value={this.state.largo}
            onChange={this.change}
          />

          <Input
            id="profundo"
            label="profundo"
            type="number"
            value={this.state.profundo}
            onChange={this.change}
          />

          <div>
            <this.BotonAgregar />
            <this.BotonGuardar />
          </div>
        </div>

        <div className="contenedor">
          <Tabla
            datos={[...this.state.lista, ...this.props.value]}
            columnas={this.columnas}
          />
        </div>
      </React.Fragment>
    )
  }
}

export default Materiales
