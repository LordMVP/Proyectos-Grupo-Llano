import React from 'react';
import parametrosApi from '../../../api/homologaciones/ParParametrosApi';
import { Container, Row, Col , Button , Form } from 'react-bootstrap';
import XLSX from 'xlsx';
import { BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import paginationFactory from "react-bootstrap-table2-paginator";
import update from 'immutability-helper';
import ModalCargando from '../../../components/utils/ModalCargando/ModalCargando';
import homoApi from '../../../api/homologaciones/Homologacion';
//import uniApi from '../../../api/homologaciones/UniUnidad';
//import basicoDefault from '../../../api/homologaciones/BasicoDefault';
//import { Typeahead } from 'react-bootstrap-typeahead';
import Alerta from '../../../components/utils/AlertaComponent/AlertaComponent';

interface IProps {
    value?: any,
    informacion?:any,
    //guardarInfoGestion:(e:any)=>void
}

const SheetJSFT = [
	"xlsx", "xlsb", "xlsm", "xls", "xml", "csv", "txt", "ods", "fods", "uos", "sylk", "dif", "dbf", "prn", "qpw", "123", "wb*", "wq*", "html", "htm"
].map(function(x) { return "." + x; }).join(",");

const make_cols = refstr => {
    let o:any = [];
    let C = XLSX.utils.decode_range(refstr).e.c + 1;
	for(var i = 0; i < C; ++i) o[i] = {name:XLSX.utils.encode_col(i), key:i}
	return o;
};

class ImportacionEmsa extends React.Component<IProps, any>
{
    constructor(props: IProps) {
        super(props);
        this.state={
            estadoLista:false,
            empresa:299,
            archivo:[],
            data: [],
            cols: [],
            lista:[],
            busqueda:[],
            seleccion:0,
            cargando:false,
            barrioSeleccion:[],
            barrios:[],
            tipoArchivo:0,
            configuracionArchivo:[],
            listaEncabezado:[],
            indexColumna:'',
            tiposArchivos:[],
            alerta:{
                variante:'',
                estado:false,
                valor:''
            }
        }
        this.getEncabezado=this.getEncabezado.bind(this);
        this.formatoBotton=this.formatoBotton.bind(this);
    }
    
    async componentDidMount()
    {
        await this.cargarParametros();
        await this.cargarDefecto();
    }

    cargarDefecto=async()=>
    {
        //console.log(this.state.tipoUsoLista);
        let apiHomo:homoApi =new homoApi();
        let resultado=await apiHomo.tiposArchivoImportacion();
        await this.setState({
            tiposArchivos:resultado.data
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

    verInformacion=()=>
    {
        console.log(this.state.lista);
        console.log(this.state.seleccion);
    }

    async cambioValorGeneral(e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>)
    {
        const {value, name}=e.target;
        await this.setState({
            [name]:value
        })
    }

    async cambioValor(e: any)
    {
        const {value, name}=e.target;
        //console.log(this.state.seleccion);
        let valorTmp=this.state.lista.filter(item => item[this.state.indexColumna] === this.state.seleccion);
        //let valorTmp2=this.state.lista.filter(item => item.CODIGO === this.state.seleccion);
        valorTmp[0][name]=value;
        //let filtro2=this.state.lista.filter(item => item.CODIGO !== this.state.seleccion);
        //filtro2.push(valorTmp[0]);

        let index=this.state.lista.findIndex(item => item[this.state.indexColumna] === this.state.seleccion);
        let updateRegistro=update(this.state.lista, {$splice: [[index, 1, valorTmp[0]]]});
        await this.setState({
            lista:updateRegistro
        })
    }

    cambioValorBarrio=(e:any)=>
    {
        //console.log(e);
        let valorTmp=this.state.lista.filter(item => item[this.state.indexColumna] === this.state.seleccion);
        valorTmp[0]['BARRIO']=e[0].barrio_ideregistro;
        if(e[0]!==undefined)
        {
            let index=this.state.lista.findIndex(item => item[this.state.indexColumna] === this.state.seleccion);
            let updateRegistro=update(this.state.lista, {$splice: [[index, 1, valorTmp[0]]]});
            this.setState({
                lista:updateRegistro,
                barrioSeleccion:[e[0]]
            })
        }
        else
        {
            this.setState({
                barrioSeleccion:[]
            })
        }
    }

    cambioFile=async(e:any)=>
    {
        let tmp = e.target.files;
        //let tmp = e.target.files[0];
        if (tmp && tmp[0]) await this.setState({ archivo: tmp[0] });
        //console.log();
    }

    llamarAlerta = (tmp1: string, tmp2: string) => {
        this.setState({
            alerta: {
                estado: true, variante: tmp1, valor: tmp2
            }
        })
        setTimeout(() => {
            this.setState({
                alerta: {
                    estado: false, variante: '', valor: ''
                }
            })
        }, 3000);
    }

    async cargarArchivo() {
        
            return new Promise<any>((resolve, reject) => {
                console.log(reject)
                const reader = new FileReader();
                 const rABS = !!reader.readAsBinaryString;
                console.log(reject);
                reader.onload = (e:any) => {
                 /* Parse data */
                 const bstr = e.target.result;
                 const wb = XLSX.read(bstr, { type: rABS ? 'binary' : 'array', bookVBA : true , cellDates : true });
                 /* Get first worksheet */
                 const wsname = wb.SheetNames[0];
                 const ws = wb.Sheets[wsname];
                 //console.log(wsname);
                 //console.log(ws);
                 /* Convert array of arrays */
                 const data = XLSX.utils.sheet_to_json(ws);
                 /* Update state */
                 this.setState({ data: data, cols: make_cols(ws['!ref']) }, () => {
                     //console.log(JSON.stringify(this.state.data, null, 2));
                     resolve(JSON.stringify(this.state.data, null, 2));
                     //resolve(JSON.parse(JSON.stringify(this.state.data, null, 2)));
                 });
                 };
                 if (rABS) {
                 reader.readAsBinaryString(this.state.archivo);
                 } else {
                 reader.readAsArrayBuffer(this.state.archivo);
                 };
            }); 
        
    }
    procesarArchivo=async()=>
    {
        try
        {
            this.setState({
                cargando:true
            })

            //let filtro=this.state.tiposArchivos.filter(item => parseInt(item.imarc_ideregistro) === parseInt(this.state.tipoArchivo));
            //console.log(this.state.archivo);
            if(this.state.archivo.name.indexOf('xlsx') >= 0 || this.state.archivo.name.indexOf('XLSX')>=0 )
            {
                let apiHomo:homoApi =new homoApi();
                let resultado=await this.cargarArchivo();
                let resultado2=await apiHomo.datosArchivoImportacion(this.state.tipoArchivo);
                await this.setState({
                    configuracionArchivo:resultado2.data,
                    lista:JSON.parse(resultado)
                })
                this.ajustarLista(this.state.lista);
                this.extraerEncabezado();
                this.getEncabezado();
                await this.setState({
                    estadoLista:true,
                    cargando:false
                })
                                
            }
            else{
                await this.setState({
                    cargando:false,
                    lista:[]
                })
                this.llamarAlerta('danger', 'Error Transaccion, Solo Permite Cargar Archivos tipo XLSX...');
            } 
                  
        }catch(e){
            await this.setState({
                cargando:false
            })
            this.llamarAlerta('danger', 'Error Transaccion, Solo Permite Cargar Archivos tipo XLSX...');
        }
        
    }

    ajustarLista=async(listaTmp:any)=>
    {
        let total:any=[];
        for(let tmp in listaTmp)
        {
            let item=listaTmp[tmp];
            let arrayNombres=Object.keys(item);
            for(let tmp2 in arrayNombres)
            {
                //this.buscarDetalles(arrayNombres[tmp2],item);
                total.push(this.buscarDetalles(arrayNombres[tmp2],item));
                //console.log(this.buscarDetalles(arrayNombres[tmp2],item));
            }
        }
        let filtrado = total.filter((el, index) => total.indexOf(el) === index)
        await this.setState({
            lista:filtrado
        })
    }

    buscarDetalles=(nombre,item)=>
    {
        let itemNuevo=item;
        for(let tmp in this.state.configuracionArchivo)
        {
            let item2=this.state.configuracionArchivo[tmp];
            if(item2.impar_columna_externa === nombre && item2.impar_homologa)
            {
                //console.log('que llego '+item[nombre]+' '+this.buscarDetalle2(item[nombre],item2.detalles));
                itemNuevo[nombre]=this.buscarDetalle2(item[nombre],item2.detalles);
            }

        } 
        return itemNuevo;     
    }

    buscarDetalle2=(valor,listaDetalles)=>
    {
        for(let tmp in listaDetalles)
        {
            let item=listaDetalles[tmp]
            if(String(item.dimpa_valor_externo) === String(valor))
            {
               return item.dimpa_valor_interno;
            }
        }

    }

    extraerEncabezado=async()=>
    {
        let listaTmp:any=[];
        for(let tmp in this.state.configuracionArchivo)
        {
            let item=this.state.configuracionArchivo[tmp];
            if(item.impar_encabezado)
            {
                listaTmp.push(item.impar_columna_externa);
            }
        }
        await this.setState({
            listaEncabezado:listaTmp,
            indexColumna:listaTmp[0]  
        })
         
    }

    mostrarCargando = (): any => {
        if (this.state.cargando) {
            return (
                <ModalCargando estado={this.state.cargando}></ModalCargando>
            )
        }
    }

    mostrarAlerta = (): any => {
        if (this.state.alerta.estado) {
            return (
                <Alerta informacion={this.state.alerta}></Alerta>
            )
        }
    }

    getEncabezado()
    {
        //var encabezado = ['CODIGO','UBICACION','ESTRATO','MUNICIPIO','NOMBRE','IDENTIFICACION','DIRECCION','CICLO'];
        var encabezado = this.state.listaEncabezado;
        return encabezado.map((row : any, index : number)=>{
            var tmp=row;
            var tmp2=tmp.lastIndexOf(".");
            if(tmp2>0)
            {
                let nombre1=row.substring(0, tmp2);
                return <TableHeaderColumn key={index} dataAlign="center" dataField={nombre1} dataFormat={this.formatoGeneral2} dataSort={true} >
                    {nombre1}
                    </TableHeaderColumn>
            }
            else
            {
            return <TableHeaderColumn key={index} dataAlign="center" dataField={row} dataSort={true}>
                    {row}
                    </TableHeaderColumn>
            }        
        })
    }

    formatoGeneral2(cell:any)
    {
        let resultado='';
        for(let tmp in cell)
        {
            if(typeof cell[tmp] === 'string')
            {
                resultado=cell[tmp];
            }
        }
        return resultado;
        
        
    }

    labelCampo=(nombre,valor)=>
    {
        let filtro=this.state.configuracionArchivo.filter(item => item.impar_columna_externa === nombre);
        if(filtro[0].impar_columna_externa === nombre && filtro[0].impar_homologa)
        {
            for(let tmp2 in filtro[0].detalles)
            {
                let detalle = filtro[0].detalles[tmp2];
                if(detalle.dimpa_valor_interno === String(valor))
                return detalle.dimpa_valor_interno_nombre;
            }
        }
        else
        {
            return valor;
        }
    }

    buscarLabel=(nombre,valor)=>
    {
         for(let tmp in this.state.configuracionArchivo)
         {
             let item=this.state.configuracionArchivo[tmp];
             //console.log('valor1 '+item.impar_columna_externa+' '+ nombre);
             //console.log(item);
             if(item.impar_columna_externa === nombre && item.impar_homologa)
             {
                 //console.log('entre con '+item.impar_columna_externa);
                 for(let tmp2 in item.detalles)
                 {
                     let detalle = item.detalles[tmp2];
                     if(detalle.dimpa_valor_interno === String(valor))
                     console.log('entre en 2');
                     return detalle.dimpa_valor_interno_nombre;
                 }
             }
             else
             {
                 return valor;
             }
         }
    }

    procesarGeneral=()=>
    {
        console.log('proccesar...');
    }


    formatoBotton( cell:any,row:any)
    {
        return <Button variant="outline-danger" key={cell} onClick={this.seleccion.bind(this,row)}>Eliminar</Button>;
    }

    async seleccion(e:any)
    {
        //console.log(e);
        //let filtro=this.state.lista.filter(item => item.CODIGO !== e.CODIGO)
        let filtro=this.state.lista.filter(item => item[this.state.indexColumna] !== e[this.state.indexColumna])
        await this.setState({
            lista:filtro
        })
    }

    cargarDetalle=(e):any=>
    {
        return(
            <div>
                {Object.keys(e).map((keyName) => (
                    <Row>
                        <Col>
                                    <div className="form-group">
                                            <label >{keyName}</label>
                                            <input className="form-control" disabled={true} name={keyName} value={this.labelCampo(keyName,e[keyName])} type='text' placeholder=""/>
                                    </div>
                        </Col>
                    </Row>
                ))}
            </div>
        ) 
    }

    handleExpand=async(rowKey, isExpand)=> {
        //this.expandedRows[rowKey] = isExpand;
        //console.log('que seleccione...'+rowKey);
        //console.log('que seleccione2...'+isExpand);
        if(isExpand)
        {
            await this.setState({
                busqueda:[],
                seleccion:rowKey,
                barrioSeleccion:[]
            })
            //await this.cargarBarrios();
            //this.actualizarSeleccion(rowKey);
        }
        else
        {
           await this.setState({
                busqueda:[]
            })
        }
      }

    renderLista = (): any => {
        const tableOptions = {
            expandBy: "column",
            onExpand: this.handleExpand,
            onlyOneExpanding: true,
          };

          const expandColumnOptions = {
            //expandColumnVisible: true
          }; 

        if(this.state.estadoLista)
        {
            return(
                <div>
                        <BootstrapTable data-mobile-responsive="true" wrapperClasses="table" data={this.state.lista} striped={true} hover={true} pagination={paginationFactory({})} keyField={this.state.indexColumna}
                        options={tableOptions} expandColumnOptions={expandColumnOptions} expandableRow={() => true} expandComponent={this.cargarDetalle}>                                
                                                <TableHeaderColumn dataAlign="center" dataField="button" dataFormat={this.formatoBotton}>Eliminar</TableHeaderColumn> 
                                                {this.getEncabezado()}
                        </BootstrapTable>   
                </div>
            )
        }
        else
            return
    }    

    render() { 

        return(
            <div>
                {this.mostrarCargando()}
                <Row>
                    <Col>
                        <label>   </label>
                        {this.mostrarAlerta()}
                    </Col>
                </Row>
                <Row className="text-center">
                    <Col>
                        <h2>Importación Información Emsa</h2>
                    </Col>
                </Row>
                <Container>
                    <Row>
                        <Col>
                                <div className="form-group">
                                                        <select onChange={e=>this.cambioValorGeneral(e)} className="form-control" name='tipoArchivo' value={this.state.tipoArchivo}>
                                                            <option value="--" key="0"></option>
                                                            {this.state.tiposArchivos.map((e : any, key : number) => {
                                                                    return <option key={key} value={e.imarc_ideregistro}>{e.imarc_nombre_archivo}</option>;
                                                                })}
                                                        </select>
                                </div>
                        </Col>
                        <Col>
                                <div className="form-group">        
                                            <Form.File label={this.state.archivo.size!=null ? this.state.archivo.name : 'Cargar archivo'} data-browse="Buscar" onChange={this.cambioFile} custom accept={SheetJSFT}/>
                                </div>
                        </Col>
                        <Col>
                            <Button variant="primary" onClick={this.procesarArchivo} disabled={this.state.archivo.size!=null && this.state.tipoArchivo>0 ? false : true}>Cargar Archivo</Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Button variant="primary" onClick={this.procesarGeneral} disabled={this.state.lista[0]!=null ? false : true}>procesar</Button>
                        </Col>
                    </Row>
                    <br/>
                    <Row>
                        <Col></Col>
                    </Row>
                    <Row>
                        <Col>
                            {this.renderLista()}
                        </Col>
                        
                    </Row>
                </Container>
            </div>
        )
    }
}
export default ImportacionEmsa;

