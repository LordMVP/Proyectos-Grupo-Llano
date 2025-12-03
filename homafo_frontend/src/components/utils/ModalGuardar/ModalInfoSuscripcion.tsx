
import * as React from 'react';
import {Button , Form, Modal, Row} from 'react-bootstrap';
import {useState, useEffect } from 'react';



function ModalInfoSuscripcion(props){
    //const liquidaciones = useSta
    const [liquidaciones] = useState<any>(props.liquidaciones);
    const [tipoUso] = useState<any>(props.tipoUso);
    const [estratos] = useState<any>(props.estratos);
    const [listaEstratos,setListaEstratos] = useState([])
    const [datos,setDatos]=useState({})

    useEffect(() => {
        //setListaEstratos(estratos)
    }, [liquidaciones,tipoUso,estratos,listaEstratos]);

    const mostrarLiquidaciones=()=>{
        return liquidaciones.map((l:any,key:number)=>{
            return (<option value={l.uni_liquidacion} key={key}>
                {l.liq_nombre}
            </option>)
        })
        
    }
    const mostrarTipoUso=()=>{        
        return tipoUso.filter((a:any)=>a.uni_estado=='A').map((e : any, key : number) => {
                return (<option key={key} value={e.uni_ideregistro}>{e.uni_nombre1}</option>);
            })       
    }
    const mostrarEstratos=()=>{
        let value = estratos.filter((s:any)=>{return Number(s.uni_codigo1) == 1})[0]?.uni_estado;
        let est = []
        if(value!=undefined){
            est = estratos.filter(element => {
                return JSON.parse((element.uni_estado))?.filter((t:any) => { return t===Number(JSON.parse(value)[0])})[0]==Number(JSON.parse(value)[0]) 
            })
        }
        console.log(est)
        return listaEstratos.map((e : any, key : number) => {
            return <option key={key} value={e.uni_ideregistro}>{e.uni_nombre1}</option>;
        })
    }

    const cambioValor2=async (e)=>{

        const {value, name}=e.target; 
        let est = estratos  
        if(name == "tipoUso"){
            est = estratos.filter(element => {
                return JSON.parse((element.uni_estado))?.filter((t:any) => { return t===Number(value)})[0]==Number(value) 
            })
        }
        await setListaEstratos(est)
        setDatos({
            ...datos,[name]:value
        }) 
    }

    const cambioValor=async (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>)=>
    {
        const {value, name}=e.target;   
        setDatos({
            ...datos,[name]:value
        })      
        console.log(datos) 
    }

    const guardar=()=>{
        props.guardar(datos)
    }
    const cerrar=()=>{
        props.cerrar()
    }

return (
        <Modal show={props.estado} onHide={props.cerrar} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Informarcion Nueva Suscripcion</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>                
                        <Form.Group className='col-auto'>
                            <Form.Label>Datos Suscripcion</Form.Label>
                        </Form.Group>
                        <Row className='row g-3'>
                        <Form.Group className='col-auto'>
                            <Form.Label> Tipos Liquidacion</Form.Label>
                                <select className='form-control' onChange={(e)=>cambioValor(e)} name="tipoLiquidacion">
                                    <option value="" key="0"></option>
                                    {mostrarLiquidaciones()}                   
                                </select>
                        </Form.Group>
                        <Form.Group className='col-auto'>
                            <Form.Label>Tipos Uso</Form.Label>
                                <select className='form-control' onChange={(e)=>cambioValor2(e)} name="tipoUso">
                                    <option value="" key="0"></option> 
                                     {mostrarTipoUso()}
                                </select>
                        </Form.Group>
                    </Row>
                    <Row className='row g-3'>
                    <Form.Group className='col-auto'>
                            <Form.Label>Estrato</Form.Label>
                                <select className='form-control' onChange={(e)=>cambioValor(e)} name="estrato">
                                    <option value="" key="0"></option> 
                                     {mostrarEstratos()}
                                </select>
                        </Form.Group>
                    </Row>
                </Form>                
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={cerrar}>
                    CERRAR
                </Button>
                <Button variant="primary" onClick={guardar}>
                    GUARDAR
                </Button>
            </Modal.Footer>
        </Modal>

)
}

export default ModalInfoSuscripcion;