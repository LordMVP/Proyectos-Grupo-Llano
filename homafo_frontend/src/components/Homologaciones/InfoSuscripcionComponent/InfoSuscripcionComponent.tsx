import * as React from 'react';
import uniApi from '../../../api/homologaciones/UniUnidad';
import homoApi from '../../../api/homologaciones/Homologacion';
import conApi from '../../../api/homologaciones/ConConcepto';

import { Container, Row, Col , Button , Card , ListGroup } from 'react-bootstrap';
import { toast } from 'react-toastify';

import TableBasica from '../../../components/utils/TableBasica/TableBasica';

import ModalGuardar from '../../../components/utils/ModalGuardar/ModalGuardar';

import basicoDefault from '../../../api/homologaciones/BasicoDefault';

import parametrosApi from '../../../api/homologaciones/ParParametrosApi';

interface IProps{
    //eliminar: (id:number)=>void; 
    value?:any,
    informacion?:any,
    guardarInfoSuscripcion:(e:any)=>void,
    validacionVista:[],
    validacionEstado:[],
    programaId:number,
    permisos?:any
   
}

class InfoSuscripcionComponent extends React.Component<IProps,any>
{
    constructor(props:IProps)
    {
        super(props);
        this.state={
            value:'',
            suscripcion:{
                dsus_estado:'',
                dsus_fecinicio:'',
                dsus_fecexpira:'',
                uni_municipio:0,
                uni_tipusosuscr:0,
                pro_catestrato:0,
                cic_ideregistro:0,
                iasus_cobrojuridico:false,
                uni_liquidacion:0,
                iasus_pagapeaje:false,
                iasus_referenciacomercial:'',
                rutas:[],
                conceptosRelacionados:[],
                sus_ideregistro:0,
                dsus_ideregistr:0,
                emp_ideregistro:0,
                usu_ideregistro:0,
                rut_ideregistro_rec:0,
                rut_ideregistro_bar:0,
                rut_macroRuta:0,
                aprovechamiento:{}, 
                uni_barrio:Number,
                resolCatastral:'',
                cicloAlt:0,
                dsusAlt:0              
            },
            aprovechamiento:{
                rutapr_ideregistro:0,
                dsus_ideregistr:0,
                rut_ideregistro:0,
                ter_aprovechamiento:0,
                rutapr_incentivo:false,
                rutapr_aforado:false
            },
            conceptoTmp:{
                cosu_ideregistr:0,
                uni_concepto:0,
                concepto:'',
                desde:'',
                hasta:''

            },
            rutas:{
                macroRuta1:{},
                microRuta1:0
            },
            estadoLista:[],
            municipioLista:[],
            tipoUsoLista:[],
            estratosLista:[],
            estratosLista2:[],
            cicloLista:[],
            cicloLista2:[],
            liquidacionLista:[],
            listaConceptos:[],
            estadoModal:false,
            macroRutas:[],
            microRutas:[],
            frecuencias:[],
            frecuencias2:[],
            listaTerceros:[],
            rutasBarrido:[],
            rutasAprovechamiento:[],
            login:{
                idEmpresa:0,
                idUsuario:0
            },
            parametros:{},
            tempoTipoUsoLiquidacion:[],
            tempoLiquidaciones:[]
        }
    }

    async componentDidMount() 
    { 
      await this.cargarDatosSesion();  
      await this.cargarParametros(); 
      await this.cargarDefecto();
      await this.cargarUsarioEmpresa();
      await this.cargarAprovechamiento();
      await this.cargarMacroRuta();
      await this.cargarFrecuenciaBarrido();
      await this.cargarEstratoUsuario();
      await this.cargarEmpresaHomologada();
    }

    cargarDatosSesion=async()=>
    {
       let basico:basicoDefault=new basicoDefault();
       let resultado=basico.extraerInfoToken(localStorage.getItem('token')); 
        await this.setState({
            login:{
                ...this.state.login,idEmpresa:resultado.idEmpresa,idUsuario:resultado.idUsuario
            },
            suscripcion:{
                ...this.state.suscripcion,emp_ideregistro:resultado.idEmpresa
            }
        })
    }

    cargarParametros=async()=>
    {
        let paraApi:parametrosApi=new parametrosApi();
        let tmp=await paraApi.listaParametros();
        await this.setState({
            parametros:tmp.data
        })
    }

    cargarDefecto=async()=>
    {
        try
        {
            let basico:basicoDefault=new basicoDefault();
            let api:uniApi =new uniApi();
            let apiHomo:homoApi =new homoApi();
            let apiCon:conApi=new conApi();
            var _ = require('lodash');
            //let tmpEstados=await api.datosUnidades(parseInt(basico.buscarParametro('clase_estados_suscripcion',this.state.parametros)),this.state.login.idEmpresa);
            let tmpEstados=await api.datosUnidadesUspu(this.props.programaId,parseInt(basico.buscarParametro('clase_estados_suscripcion',this.state.parametros)));
            let tmpNumicipio=await apiHomo.listaProyectos(this.state.login.idEmpresa);
            let tmpEstratos=await api.datosUnidades(parseInt(basico.buscarParametro('clase_estrato',this.state.parametros)),this.state.login.idEmpresa);
            let tmpCiclos=await apiHomo.listaCiclos(this.state.login.idEmpresa);
            let tmpTipoUso=await api.datosUnidades(basico.buscarParametro('clase_tipo_uso',this.state.parametros),this.state.login.idEmpresa);
            let tmpLiquidaciones=await apiHomo.listaLiquidaciones(this.state.login.idEmpresa);
            let tmpConvenioCiclo=JSON.parse(basico.buscarParametro('convenio_ciclo',this.state.parametros));
            let datosHom = await apiHomo.informacionHomologacion(this.props.informacion.dsus_ideregistr)        
            let resultCiclo = tmpConvenioCiclo.filter(i=>i['convenio']===datosHom.data[0].cnre_ideregistr)
            
            /** Filtramos el ciclo de acuerdo al convenio de recaudo. */
            let cicloComparativo = resultCiclo.length > 0 ? resultCiclo[0]['ciclos'] : []
            
            let cix = tmpCiclos.data;
            if (cicloComparativo.length > 0) {
                cix = tmpCiclos.data.filter(c => {
                    return cicloComparativo.includes(c.cic_ideregistro);
                });
            }

            /** Filtramos la Liquidacion de acuerdo al Tipo Uso */
            let tmpTipoLiquidacion = JSON.parse(basico.buscarParametro('liquidacion_tipouso',this.state.parametros));
            
            let resultTipoLiquidacion = tmpTipoLiquidacion.filter(i=>i.tipouso.includes(this.props.informacion.uni_tipusosuscr))
            
            let tipoLiquidacionComparativo = resultTipoLiquidacion.length > 0 ? resultTipoLiquidacion[0]['liquidacion'] : []
            
            let lix = tmpLiquidaciones.data;
            if (tipoLiquidacionComparativo.length > 0) {
                lix = tmpLiquidaciones.data.filter(c => {
                    return tipoLiquidacionComparativo.includes(c.uni_liquidacion);
                });
            }

            let tmpConceptos=await apiCon.conceptosSuscripcionSesion(parseInt(basico.buscarParametro('programa_suscripcion20',this.state.parametros)),this.state.login.idUsuario);/////////////
            let tmpMacroRutas=await apiHomo.informacionMacrosRutas(this.state.login.idEmpresa,this.props.informacion.uni_barrio);
            let tmpTipoTercero=await apiHomo.tipoTerceros(parseInt(basico.buscarParametro('unidad_tercero_aprovechamiento',this.state.parametros)));//unidad
            //let tmpRutasBarrido=await apiHomo.rutasTipo(parseInt(basico.buscarParametro('estructura_barrido',this.state.parametros)));///unidad 3225
            let tmpAprovechamiento=await apiHomo.rutasTipo(parseInt(basico.buscarParametro('estructura_aprovechamiento',this.state.parametros)));//178 unidad 3224
            let tmpRutasBarrido=await apiHomo.rutasBarrioTipo(parseInt(basico.buscarParametro('estructura_barrido',this.state.parametros)),this.props.informacion.uni_barrio);
            // Verificar si el ciclo actual está en la lista filtrada y ajustar si es necesario
            const cicloActualExiste = cix.find(c => c.cic_ideregistro === this.props.informacion.cic_ideregistro);
            const liquidacionActualExiste = lix.find(l => l.uni_liquidacion === this.props.informacion.uni_liquidacion);
            console.log('=== CICLO ACTUAL EXISTE? ===', cicloActualExiste);
            console.log('=== LIQUIDACION ACTUAL EXISTE? ===', liquidacionActualExiste);
            // Si el valor actual no está en la lista filtrada, usar el primer elemento disponible o limpiarlo
            let suscripcionActualizada = { ...this.props.informacion };
            await this.setState({
                estadoLista:tmpEstados.data,
                municipioLista:tmpNumicipio.data,
                tipoUsoLista:tmpTipoUso.data,
                estratosLista:tmpEstratos.data,
                estratosLista2:tmpEstratos.data,
                cicloLista:cix,//tmpCiclos.data, JLMENDOZA
                liquidacionLista:lix,//tmpLiquidaciones.data,
                listaConceptos:_.sortBy(tmpConceptos.data,'con_nombre'), //tmpConceptos.data, 
                suscripcion:suscripcionActualizada,
                macroRutas:tmpMacroRutas.data,
                listaTerceros:tmpTipoTercero.data,
                rutasAprovechamiento:tmpAprovechamiento.data,
                rutasBarrido:tmpRutasBarrido.data,
                tempoTipoUsoLiquidacion:tmpTipoLiquidacion,
                tempoLiquidaciones:tmpLiquidaciones
            })

        }catch(e){
            console.log('ERROR en cargarDefecto:', e);
        }
    }

    cargarEstratoUsuario=async()=>{
        let value = this.state.estratosLista2.filter((s:any)=>{return Number(s.uni_codigo1) == this.state.suscripcion.pro_catestrato})[0]?.uni_estado;
        if(value!=undefined){
            let f = this.state.estratosLista2.filter(element => {
                return JSON.parse((element.uni_estado))?.filter((t:any) => { return t===Number(JSON.parse(value)[0])})[0]==Number(JSON.parse(value)[0]) 
            })
            this.setState({
                estratosLista:f
            })
        }
        
    }

    cargarEmpresaHomologada=async()=>{
        let apiHomo:homoApi =new homoApi();
        if(this.props.informacion.empAlt!=null){
            let tmpCiclos2=await apiHomo.listaCiclosOtros(this.props.informacion.empAlt);
            this.setState({
                cicloLista2:tmpCiclos2?.data.length===0 ? this.state.cicloLista : tmpCiclos2.data,
            })
        }
        
    }

    cargarAprovechamiento=async()=>
    {
        if(this.props.informacion.aprovechamiento.rutapr_ideregistro!=null)
        {
            await this.setState({
                aprovechamiento:this.props.informacion.aprovechamiento,
            })
        }
    }

    cargarFrecuenciaBarrido=async()=>
    {
        try
        {
        this.setState({
            frecuencias2:this.state.rutasBarrido[0]?.frecuencias.length===0 ? [] : this.state.rutasBarrido[0]?.frecuencias
        })   
        }catch(e)
        {
            this.setState({
                frecuencias2:[]
            }) 
        }            

    }

    cargarMacroRuta=async()=>
    {
        if(this.props.informacion.rut_macroRuta>0)
        {
            let valorTmp=this.state.macroRutas.find(e=> e.rut_ideregistro===this.state.suscripcion.rut_macroRuta); 
            if(valorTmp !=null)
            {
                // Filtrar frecuencias solo si hay una microruta seleccionada
                let frecuenciasFiltradas = [];
                if(this.props.informacion.rut_ideregistro_rec > 0 && valorTmp.frecuencias)
                {
                    frecuenciasFiltradas = valorTmp.frecuencias.filter((f: any) => {
                        console.log(`Comparando: microrutaFrecuencia=${f.microrutaFrecuencia} con rut_ideregistro_rec=${this.props.informacion.rut_ideregistro_rec}`);
                        return String(f.microrutaFrecuencia) === String(this.props.informacion.rut_ideregistro_rec) || 
                               f.microrutaFrecuencia === parseInt(this.props.informacion.rut_ideregistro_rec);
                    });
                }
                
                await this.setState({
                    microRutas:valorTmp.rut_microruta,
                    frecuencias:frecuenciasFiltradas
                })
            }
        }
    }

    cargarUsarioEmpresa=async()=>
    {
        await this.setState({
            suscripcion:{
                ...this.state.suscripcion,emp_ideregistro:this.state.login.idEmpresa,usu_ideregistro:this.state.login.idUsuario
            }
        })
    }

    async cambioValor(e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>)
    {
        const {value, name}=e.target;     
        let f = this.state.estratosLista  
        if(name === "uni_tipusosuscr"){
            f = this.state.estratosLista2.filter(element => {
                return JSON.parse((element.uni_estado))?.filter((t:any) => { return t===Number(value)})[0]===Number(value) 
            })

            /** Filtramos la Liquidacion de acuerdo al Tipo Uso Actualizacion*/
            let resultTipoLiquidacion = this.state.tempoTipoUsoLiquidacion.filter(i=>i.tipouso.includes(Number(value)))
            let tipoLiquidacionComparativo = resultTipoLiquidacion.length > 0 ? resultTipoLiquidacion[0]['liquidacion'] : []
            let lix = this.state.tempoLiquidaciones.data;
            if (tipoLiquidacionComparativo.length > 0) {
                lix = this.state.tempoLiquidaciones.data.filter(c => {
                    return tipoLiquidacionComparativo.includes(c.uni_liquidacion);
                });
            }

            await this.setState({
                liquidacionLista:lix            
            })                            

        }

        await this.setState({
            suscripcion:{
                ...this.state.suscripcion,[name]:value
            },
            estratosLista:f      
        })
        
    }

    async cambioValorFecha(e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>)
    {
        const {value, name}=e.target;
        await this.setState({
            suscripcion:{
                ...this.state.suscripcion,[name]:new Date(value)
            }
        })
        
    }

    async cambioValor2(e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>)
    {
        const {value, name}=e.target;
        if(name==='uni_concepto')
        {
            let valorTmp=this.state.listaConceptos.find(e=> e.uni_concepto===Number(value));
            await this.setState({
                conceptoTmp:{
                    ...this.state.conceptoTmp,[name]:value,concepto:valorTmp.con_nombre
                },
            })
        }
        else
        {
            await this.setState({
                conceptoTmp:{
                    ...this.state.conceptoTmp,[name]:value
                },
            })
        }
        
    }

    async cambioMacroRutas(e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>)
    {
        const {value, name}=e.target;
        if(parseInt(value)>0)
        {
            let valorTmp=this.state.macroRutas.find(e=> e.rut_ideregistro===parseInt(value));           
            await this.setState({
                //rutas:{
                  //  ...this.state.rutas,[name]:valorTmp.rure_ideregistro
                //},
                suscripcion:{
                    ...this.state.suscripcion,[name]:parseInt(value),rut_ideregistro_rec:0
                },
                microRutas:valorTmp.rut_microruta,
                frecuencias:[] // Limpiamos las frecuencias hasta que se seleccione una microruta
                
            })
        }
        else{
            await this.setState({
                //rutas:{
                  //  ...this.state.rutas,[name]:value
                //},
                microRutas:[],
                frecuencias:[],
                suscripcion:{
                    ...this.state.suscripcion,[name]:0
                },
            })
        }
    }

    async cambioMicroRutas(e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>)
    {
        const {value, name}=e.target;
        
        await this.setState({
            suscripcion:{
                ...this.state.suscripcion,[name]:value
            }
        });

        // Filtrar las frecuencias según la microruta seleccionada
        if(parseInt(value) > 0)
        {
            let valorMacroRuta = this.state.macroRutas.find(e=> e.rut_ideregistro === this.state.suscripcion.rut_macroRuta);

            if(valorMacroRuta && valorMacroRuta.frecuencias)
            {
                // Filtrar las frecuencias que coincidan con la microRuta seleccionada
                // Comparar tanto como número como string por si acaso
                let frecuenciasFiltradas = valorMacroRuta.frecuencias.filter((f: any) => {
                    console.log(`Comparando frecuencia microrutaFrecuencia: ${f.microrutaFrecuencia} (tipo: ${typeof f.microrutaFrecuencia}) con value: ${value} (tipo: ${typeof value})`);
                    return String(f.microrutaFrecuencia) === String(value) || f.microrutaFrecuencia === parseInt(value);
                });
                
                
                await this.setState({
                    frecuencias: frecuenciasFiltradas
                });
            }
        }
        else
        {
            // Si no hay microruta seleccionada, limpiar las frecuencias
            await this.setState({
                frecuencias: []
            });
        }
    }

    async cambioRutaBarrido(e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>)
    {
        const {value, name}=e.target;

        let frecuenciasBarrido = this.state.rutasBarrido.filter((b:any)=>b.rut_ideregistro == Number(value))

            if(frecuenciasBarrido.length > 0){
                this.setState({
                    frecuencias2:frecuenciasBarrido[0].frecuencias.length===0 ? [] : frecuenciasBarrido[0].frecuencias
                })   
            }else{
                this.setState({
                    frecuencias2:[]
                }) 
            }     

        await this.setState({
            suscripcion:{
                ...this.state.suscripcion,[name]:value
            }
        });
        //await this.cargarFrecuenciaBarrido();
          
    }

    /*
    async cambioMicroRutas(e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>)
    {
        const {value, name}=e.target;       
            await this.setState({
                rutas:{
                    ...this.state.rutas,[name]:value
                }
            })
    }
    */

    async cambioValorApr(e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>)
    {
        const {value, name}=e.target;
        
        await this.setState({
            aprovechamiento:{
                ...this.state.aprovechamiento,[name]:value
            }
        })
        
    }

    validarAprovechamiento=()=>
    {
        // Validación: Si se seleccionó incentivo, aforado, ruta o asociación, validar que estén completos
        // Convertir a boolean de manera robusta para manejar tanto strings como booleans
        const tieneIncentivo = this.state.aprovechamiento.rutapr_incentivo === 'true' || this.state.aprovechamiento.rutapr_incentivo === true;
        const tieneAforado = this.state.aprovechamiento.rutapr_aforado === 'true' || this.state.aprovechamiento.rutapr_aforado === true;
        const tieneRuta = this.state.aprovechamiento.rut_ideregistro && 
                          this.state.aprovechamiento.rut_ideregistro !== 0 && 
                          this.state.aprovechamiento.rut_ideregistro !== '0';
        const tieneAsociacion = this.state.aprovechamiento.ter_aprovechamiento && 
                                this.state.aprovechamiento.ter_aprovechamiento !== 0 && 
                                this.state.aprovechamiento.ter_aprovechamiento !== '0';
        
        // Si se seleccionó incentivo, aforado, ruta o asociación, todos los campos son obligatorios
        if (tieneIncentivo || tieneAforado || tieneRuta || tieneAsociacion) {
            if (!tieneRuta) {
                toast.error('Debe seleccionar una Ruta de Aprovechamiento');
                return false;
            }
            if (!tieneAsociacion) {
                toast.error('Debe seleccionar una Asociación de Aprovechamiento');
                return false;
            }
        }
        return true;
    }

    abrirModalGuardar=()=>
    {
        // Validar antes de abrir el modal
        if (!this.validarAprovechamiento()) {
            return; // Si la validación falla, no abrir el modal
        }
        // Si pasa la validación, abrir el modal
        this.setState({estadoModal:true});
    }

    guardar=async()=>
    {
        await this.setState({
            estadoModal:false,
            suscripcion:{
                ...this.state.suscripcion,aprovechamiento:this.state.aprovechamiento
            }
        })
        await this.cargarUsarioEmpresa();
        await this.props.guardarInfoSuscripcion(this.state.suscripcion);
    }

    agregarConcepto=async()=>
    {
        let buscar=this.state.suscripcion.conceptosRelacionados.find(e=> e.uni_concepto===Number(this.state.conceptoTmp.uni_concepto));
        try
        {
            if(buscar===undefined)
            {
                await this.setState({
                    suscripcion:{
                        ...this.state.suscripcion,conceptosRelacionados:[...this.state.suscripcion.conceptosRelacionados,this.state.conceptoTmp]
                    }
                })
            }
            else
            {
                if(buscar.cosu_ideregistr<0)
                {
                    ///filtrar para agregar positivo
                    let arrayFiltro = this.state.suscripcion.conceptosRelacionados.filter(item => item.uni_concepto !== buscar.uni_concepto);
                    let tmp= {cosu_ideregistr:Math.abs(buscar.cosu_ideregistr),uni_concepto:buscar.uni_concepto,concepto:buscar.concepto,desde:buscar.desde,hasta:buscar.hasta};
                    arrayFiltro.push(tmp);
                    await this.setState({
                        suscripcion:{
                            ...this.state.suscripcion,conceptosRelacionados:arrayFiltro
                        }
                    })
                }
            }
            await this.setState({
                conceptoTmp:{cosu_ideregistr:0,uni_concepto:0,concepto:'',desde:'',hasta:''}
            })
            
        }catch(e){console.log(e);}
        console.log(this.state.suscripcion.conceptosRelacionados);
    }

    eliminarConcepto=async(e:any)=>
    {
         ///filtrar para agregar positivo
         let arrayFiltro = this.state.suscripcion.conceptosRelacionados.filter(item => item.uni_concepto !== e.uni_concepto);
         let tmp= {cosu_ideregistr:(e.cosu_ideregistr*-1),uni_concepto:e.uni_concepto,concepto:e.concepto,desde:e.desde,hasta:e.hasta};
         if(e.cosu_ideregistr>0)
         {
            arrayFiltro.push(tmp);
         }
                    await this.setState({
                        suscripcion:{
                            ...this.state.suscripcion,conceptosRelacionados:arrayFiltro
                        }
                    })
        console.log(this.state.suscripcion.conceptosRelacionados);            
    }

    permisoVista=(e)=>
    {
        //let array=JSON.parse(this.state.vistaColumnas);
        let estado=true;
        if(this.props.validacionVista.length>0)
        {
            
           estado=false;
           let array:any=this.props.validacionVista;
           for (let tmp in array)
           {
               let valor=array[tmp];
               if(valor.columna===e)
               {
                    estado=valor.valor;
               }
           }
           
        }
        return estado;
    }

    permisoEstado=(e)=>
    {
        //let array=JSON.parse(this.state.vistaColumnas);
        let estado=false;
        if(this.props.validacionEstado.length>0)
        {
            
           estado=false;
           let array:any=this.props.validacionEstado;
           for (let tmp in array)
           {
               let valor=array[tmp];
               if(valor.columna===e)
               {
                    estado=valor.valor;
               }
           }
           
        }
        //console.log('que le llego a e',e);
        //console.log('que le llego a array',this.state.vistaColumnas);
        //console.log('que hay en parametros ',this.state.parametros);
        return estado;
    }

    mostrarModal=(): any=>
    {
        if(this.state.estadoModal)
        {
            return(
                <ModalGuardar guardar={this.guardar} cerrar={()=>this.setState({estadoModal:false})}/>
            )
        }
    }

    render()
    {
        return(
            <div>
                {this.mostrarModal()}
                <Container>
                    <Row>
                        <Col style={{ display: this.permisoVista('col-estado') ? "block" : "none" }}>
                                <div className="form-group">
                                            <label>Estado</label>
                                            <select disabled={this.permisoEstado('col-estado')} onChange={e=>this.cambioValor(e)} className="form-control" name='dsus_estado' value={this.state.suscripcion.dsus_estado} >
                                                    <option value="--" key="0"></option>
                                                    {this.state.estadoLista.map((e : any, key : number) => {
                                                        return <option key={key} value={e.uni_codigo1}>{e.uni_nombre1}</option>;
                                                    })}
                                            </select>    
                                </div> 
                        </Col>
                        <Col style={{ display: this.permisoVista('col-fechaCreacion') ? "block" : "none" }}>
                                    <div className="form-group">
                                        <label >Fecha Creacion</label>{/**this.permisoEstado('col-fechaCreacion') */}
                                        <input disabled={true} className="form-control" onChange={e=>this.cambioValor(e)} name='dsus_fecinicio' value={this.state.suscripcion.dsus_fecinicio}  type='date' placeholder=""/>
                                    </div> 
                        </Col>
                        <Col style={{ display: this.permisoVista('col-fechaModificacion') ? "block" : "none" }}>
                                    <div className="form-group">
                                        <label >Fecha Modificacion</label>{/**this.permisoEstado('col-fechaModificacion') */}
                                        <input disabled={true} className="form-control" onChange={e=>this.cambioValor(e)} name='dsus_fecexpira' value={this.state.suscripcion.dsus_fecexpira} type='date' placeholder="" />
                                    </div> 
                        </Col>
                            <Col style={{ display: this.permisoVista('col-municipio') ? "block" : "none" }}>
                                        <div className="form-group">
                                            <label>Municipio</label>
                                            <select disabled={this.permisoEstado('col-municipio')} onChange={e=>this.cambioValor(e)} className="form-control" name='uni_municipio' value={this.state.suscripcion.uni_municipio}>
                                            <option value="0" key="0"></option>
                                                    {this.state.municipioLista.map((e : any, key : number) => {
                                                        return <option key={key} value={e.proyecto_ideregistro}>{e.proyecto_nom}</option>;
                                                    })}
                                                </select>  
                                        </div> 
                            </Col>
                    </Row>
                    <Row>
                            <Col style={{ display: this.permisoVista('col-tipoUso') ? "block" : "none" }}>
                                        <div className="form-group">
                                            <label>Tipo de uso</label>
                                            <select disabled={this.permisoEstado('col-tipoUso')} onChange={e=>this.cambioValor(e)} className="form-control" name='uni_tipusosuscr' value={this.state.suscripcion.uni_tipusosuscr} >
                                                    <option value="--" key="0"></option>                                                   
                                                    {this.state.tipoUsoLista.filter((a:any)=>a.uni_estado=='A').map((e : any, key : number) => {
                                                        return <option key={key} value={e.uni_ideregistro}>{e.uni_nombre1}</option>;
                                                    })}
                                            </select>  
                                        </div> 
                            </Col>
                            <Col style={{ display: this.permisoVista('col-estrato') ? "block" : "none" }}>
                                        <div className="form-group">
                                            <label>{ this.state.suscripcion.resolCatastral }</label>
                                            <select disabled={this.permisoEstado('col-estrato')} onChange={e=>this.cambioValor(e)} className="form-control" name='pro_catestrato' value={this.state.suscripcion.pro_catestrato}>
                                                    <option value="--" key="0"></option>                                                    
                                                    {this.state.estratosLista.map((e : any, key : number) => {
                                                        return <option key={key} value={e.uni_codigo1}>{e.uni_nombre1}</option>;
                                                    })}
                                            </select>  
                                        </div> 
                            </Col>
                            <Col style={{ display: this.permisoVista('col-ciclo') ? "block" : "none" }}>
                                        <div className="form-group">
                                            <label>Ciclo Liquidacion</label>
                                            <select disabled={this.state.suscripcion.cicloAlt==299 ? true : false/*this.permisoEstado('col-ciclo')*/} onChange={e=>this.cambioValor(e)} className="form-control" name='cic_ideregistro' value={this.state.suscripcion.cic_ideregistro || ""} >
                                                    <option value="" key="0"></option>
                                                    {this.state.cicloLista.map((e : any, key : number) => {
                                                        return <option key={key} value={e.cic_ideregistro}>{e.cic_nombre}</option>;
                                                    })}
                                            </select>  
                                        </div> 
                            </Col>
                            <Col style={{ display: this.permisoVista('col-ciclo') ? "block" : "none" }}>
                                        <div className="form-group">
                                            <label>Ciclo Distribucion</label>
                                            <select disabled={this.state.suscripcion.cicloAlt==299 ? false : true} onChange={e=>this.cambioValor(e)} className="form-control" name='cicloAlt' value={this.state.suscripcion.cicloAlt} >
                                                    <option value="" key="0"></option>
                                                    {this.state.cicloLista2.map((e : any, key : number) => {
                                                        return <option key={key} value={e.cic_ideregistro}>{e.cic_nombre}</option>;
                                                    })}
                                            </select>  
                                        </div> 
                            </Col>
                    </Row>
                    <Row>
                            <Col style={{ display: this.permisoVista('col-cobroJuridico') ? "block" : "none" }}>
                                        <div className="form-group">
                                            <label>Cobro Juridico</label>
                                            <select disabled={this.permisoEstado('col-cobroJuridico')} onChange={e=>this.cambioValor(e)} className="form-control" name='iasus_cobrojuridico' value={this.state.suscripcion.iasus_cobrojuridico} >
                                                    <option value="false" key="0">NO</option>
                                                    <option value="true" key="1">SI</option>
                                            </select>  
                                        </div> 
                            </Col>
                            <Col style={{ display: this.permisoVista('col-liquidacion') ? "block" : "none" }}>
                                        <div className="form-group">
                                            <label>Liquidacion</label>
                                            <select disabled={this.permisoEstado('col-liquidacion')} onChange={e=>this.cambioValor(e)} className="form-control" name='uni_liquidacion' value={this.state.suscripcion.uni_liquidacion} >
                                                    <option value="" key="0"></option>
                                                    {this.state.liquidacionLista.map((e : any, key : number) => {
                                                        return <option key={key} value={e.uni_liquidacion}>{e.liq_nombre}</option>;
                                                    })}
                                            </select>  
                                        </div> 
                            </Col>
                    </Row>
                    <Row>
                            <Col style={{ display: this.permisoVista('col-pagaPeaje') ? "block" : "none" }}>
                                        <div className="form-group">
                                            <label>Paga peaje</label>
                                            <select disabled onChange={e=>this.cambioValor(e)} className="form-control" name='iasus_pagapeaje' value={this.state.suscripcion.iasus_pagapeaje} >
                                                    <option value="false" key="0">NO</option>
                                                    <option value="true" key="1">SI</option>
                                            </select>  
                                        </div> 
                            </Col>
                            <Col style={{ display: this.permisoVista('col-referenciaComercial') ? "block" : "none" }}>
                                    <div className="form-group">
                                        <label >Referencia Comercial</label>
                                        <input disabled={this.permisoEstado('col-referenciaComercial')} className="form-control" onChange={e=>this.cambioValor(e)} name='iasus_referenciacomercial' value={this.state.suscripcion.iasus_referenciacomercial} type='text' placeholder=""/>
                                    </div> 
                            </Col>
                    </Row>
                    <Row>
                        <Col style={{ display: this.permisoVista('col-recoleccion') ? "block" : "none" }}>
                                <div className="form-group">
                                    <Card>
                                        <Card.Header>Recoleccion</Card.Header>
                                        <Card.Body>
                                                    <Row>
                                                        <Col>
                                                            <div className="form-group">
                                                                            <label>Macro Rutas</label>
                                                                                <select disabled={this.permisoEstado('col-recoleccion')} onChange={e=>this.cambioMacroRutas(e)} className="form-control" name='rut_macroRuta' value={this.state.suscripcion.rut_macroRuta}>
                                                                                <option value="0" key="0"></option>
                                                                                        {this.state.macroRutas.map((e : any, key : number) => {
                                                                                            return <option key={key} value={e.rut_ideregistro}>{e.rut_nombre}</option>;
                                                                                        })}
                                                                                    </select>  
                                                            </div>
                                                            <div className="form-group">
                                                                            <label>Micro Rutas</label>
                                                                                <select disabled={this.permisoEstado('col-recoleccion')} onChange={e=>this.cambioMicroRutas(e)} className="form-control" name='rut_ideregistro_rec' value={this.state.suscripcion.rut_ideregistro_rec}>
                                                                                <option value="0" key="0"></option>
                                                                                        {this.state.microRutas.map((e : any, key : number) => {
                                                                                        return <option key={key} value={e.microRuta}>{e.codigo} - {e.nombre}</option>;
                                                                                        })}
                                                                                    </select>  
                                                            </div>
                                                        </Col>
                                                        <Col>
                                                            <div className="form-group">
                                                                <label>Frecuencia</label>
                                                                <ListGroup as="ul">
                                                                        {this.state.frecuencias.map((e : any) => {
                                                                        return  <ListGroup.Item key={e.uni_ideregistro} as="li" >{e.dia} : {e.horaInicio} - {e.horaFin}</ListGroup.Item> ;
                                                                        })}                                       
                                                                </ListGroup>
                                                            </div>                   
                                                        </Col>
                                                    </Row> 
                                        </Card.Body>
                                    </Card>      
                                </div>
                        </Col>
                        <Col style={{ display: this.permisoVista('col-barrido') ? "block" : "none" }}> 
                                    <div className="form-group">
                                        <Card>
                                                <Card.Header>Barrido</Card.Header>
                                                <Card.Body>
                                                    <Row>
                                                        <Col>
                                                            <div className="form-group">
                                                                            <label>Ruta</label>
                                                                                <select disabled={this.permisoEstado('col-barrido')} onChange={e=>this.cambioRutaBarrido(e)} className="form-control" name='rut_ideregistro_bar' value={this.state.suscripcion.rut_ideregistro_bar}>
                                                                                <option value="0" key="0"></option>
                                                                                        {this.state.rutasBarrido.map((e : any, key : number) => {
                                                                                            return <option key={key} value={e.rut_ideregistro}>{e.rut_nombre}</option>;
                                                                                        })}
                                                                                    </select>  
                                                            </div>
                                                        </Col>
                                                        <Col>
                                                                <div className="form-group">
                                                                    <label>Frecuencia</label>
                                                                    <ListGroup as="ul">
                                                                            {this.state.frecuencias2?.map((e : any) => {
                                                                            return  <ListGroup.Item key={e.uni_ideregistro} as="li" >{e.dia} : {e.horaInicio} - {e.horaFin}</ListGroup.Item> ;
                                                                            })}                                       
                                                                    </ListGroup>             
                                                                </div>
                                                        </Col>
                                                    </Row>
                                                </Card.Body>
                                        </Card>
                                    </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col style={{ display: this.permisoVista('col-aprovechamiento') ? "block" : "none" }}>
                                    <div className="form-group">
                                        <Card>
                                                <Card.Header>Aprovechamiento</Card.Header>
                                                <Card.Body>
                                                    <Row>
                                                        <Col>
                                                            <div className="form-group">
                                                                <label>Incentivo?</label>
                                                                <select disabled={this.permisoEstado('col-aprovechamiento')} onChange={e=>this.cambioValorApr(e)} className="form-control" name='rutapr_incentivo' value={String(this.state.aprovechamiento.rutapr_incentivo)} >
                                                                        <option value="false" key="0">NO</option>
                                                                        <option value="true" key="1">SI</option>
                                                                </select>  
                                                            </div> 
                                                        </Col>
                                                        <Col>
                                                            <div className="form-group">
                                                                <label>Aforado?</label>
                                                                <select disabled={this.permisoEstado('col-aprovechamiento')} onChange={e=>this.cambioValorApr(e)} className="form-control" name='rutapr_aforado' value={String(this.state.aprovechamiento.rutapr_aforado)} >
                                                                        <option value="false" key="0">NO</option>
                                                                        <option value="true" key="1">SI</option>
                                                                </select>  
                                                            </div> 
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col>
                                                            <div className="form-group">
                                                                            <label>Ruta</label>
                                                                                <select disabled={this.permisoEstado('col-aprovechamiento')} onChange={e=>this.cambioValorApr(e)} className="form-control" name='rut_ideregistro' value={this.state.aprovechamiento.rut_ideregistro}>
                                                                                <option value="0" key="0">Seleccione</option>
                                                                                        {this.state.rutasAprovechamiento.map((e : any, key : number) => {
                                                                                            return <option key={key} value={e.rut_ideregistro}>{e.rut_nombre}</option>;
                                                                                        })}
                                                                                    </select>  
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col>
                                                            <div className="form-group">
                                                                            <label>Aso. Aprovechamiento</label>
                                                                                <select disabled={this.permisoEstado('col-aprovechamiento')} onChange={e=>this.cambioValorApr(e)} className="form-control" name='ter_aprovechamiento' value={this.state.aprovechamiento.ter_aprovechamiento}>
                                                                                <option value="0" key="0">Seleccione</option>
                                                                                        {this.state.listaTerceros.map((e : any, key : number) => {
                                                                                            return <option key={key} value={e.ter_ideregistro}>{e.ter_nomcompleto}</option>;
                                                                                        })}
                                                                                    </select>  
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col>
                                                            <div className="form-group">
                                                                <label>Fecha Registro</label>
                                                                <input disabled={true} className="form-control"  name='terNomcompleto' value={this.state.aprovechamiento.date_created} type='date' placeholder=""/>
                                                            </div> 
                                                        </Col>
                                                        <Col>
                                                        <div className="form-group">
                                                                <label>Observacion</label>
                                                                <input disabled={true} className="form-control"  name='terNomcompleto' value={this.state.aprovechamiento.rutapr_observacion} type='text' placeholder=""/>
                                                            </div> 
                                                        </Col>
                                                    </Row>
                                                </Card.Body>
                                        </Card>
                                    </div>
                        </Col>    
                        <Col style={{ display: this.permisoVista('col-conceptosRelacionados') ? "block" : "none" }}>
                                <Card>
                                         <Card.Header>Conceptos Relacionados</Card.Header>
                                         <Card.Body>
                                                    <Row>
                                                            <Col>
                                                                    <div className="form-group">
                                                                                <label>Concepto</label>
                                                                                <select disabled={this.permisoEstado('col-conceptosRelacionados')} onChange={e=>this.cambioValor2(e)} className="form-control" name='uni_concepto' value={this.state.conceptoTmp.uni_concepto}>
                                                                                <option value="0" key="0"></option>
                                                                                        {this.state.listaConceptos.map((e : any, key : number) => {
                                                                                            return <option key={key} value={e.uni_concepto}>{e.con_nombre}</option>;
                                                                                        })}
                                                                                    </select>  
                                                                    </div> 
                                                            </Col>
                                                            <Col>
                                                                        <div className="form-group">
                                                                            <label >Vigencia desde</label>
                                                                            <input disabled={this.permisoEstado('col-conceptosRelacionados')} className="form-control" onChange={e=>this.cambioValor2(e)} name='desde' value={this.state.conceptoTmp.desde} type='date' placeholder=""/>
                                                                        </div> 
                                                            </Col>
                                                            <Col>
                                                                        <div className="form-group">
                                                                            <label >Vigencia Hasta</label>
                                                                            <input disabled={this.permisoEstado('col-conceptosRelacionados')} className="form-control" onChange={e=>this.cambioValor2(e)} name='hasta' value={this.state.conceptoTmp.hasta} type='date' placeholder=""/>
                                                                        </div> 
                                                            </Col>
                                                            <Col>
                                                                    <div className="form-group">
                                                                        <label >Agregar</label>                
                                                                        <Button variant="success" className="form-control" onClick={this.agregarConcepto} disabled={this.state.conceptoTmp.uni_concepto>0 && this.state.conceptoTmp.hasta.length>0 && this.state.conceptoTmp.desde.length>0 ? false : true}>+</Button>       
                                                                    </div>
                                                            </Col>                                                            
                                                    </Row>
                                                    <Row>
                                                            <Col>
                                                                    <div className="form-group">
                                                                                        <TableBasica validacion='cosu_ideregistr' encabezado={['concepto','desde','hasta','observacion','porcentaje']} datos={this.state.suscripcion.conceptosRelacionados} editar={this.eliminarConcepto}/>
                                                                    </div>
                                                            </Col>
                                                    </Row>
                                         </Card.Body>
                                </Card>                    
                        </Col>
                    </Row>
                    <Row>
                            <Col>
                                <div className="form-group">
                                    <br></br>                
                                    <Button disabled={!this.props.permisos?.EDIT} variant="primary" onClick={this.abrirModalGuardar}>Guardar</Button>       
                                </div>
                            </Col>
                    </Row>
                </Container>
            </div>
        )
    }     
}

export default InfoSuscripcionComponent;