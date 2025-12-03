import React, { useState } from 'react';
import { Fragment } from 'react';
import { useForm, UseFormMethods } from 'react-hook-form';
import AforoApi from '../../../api/aforos/AforoApi';
import AforoFormComponent from '../../../components/Aforos/AforoFormComponent/AforoFormComponent';
import ListadoAforoComponent from "../../../components/Aforos/ListaAforosComponent/ListadoAforoComponent";
import AforoInfoDTO from '../../../models/dto/AforoInfoDTO';
import { PageableRequest, PageT } from '../../../models/dto/Pagination';
import AforoMaestroDetalleComponent from '../../../components/Aforos/AforoMaestroDetalleComponent/AforoMaestroDetalleComponent';
import AforoPreLiquidacionResponse from '../../../models/dto/AforoPreLiquidacionResponse';
import AforoLiquidacionFormComponent from '../../../components/Aforos/AforoLiquidacionComponent/AforoLiquidacionFormComponent';
import { Tabs, Tab, Modal,Button } from 'react-bootstrap';
import DetalleAforoDTO from '../../../models/dto/DetalleAforoDTO';
import DetalleAforoListComponent from '../../../components/Aforos/DetalleAforoListComponent/DetalleAforoListComponent';
import AforoLiquidacionRequest from '../../../models/dto/AforoLiquidacionRequest';
import AforoLiquidacionMultiusuarioRequest from '../../../models/dto/AforoLiquidacionMultiusuarioRequest';
import GeneradorDTO from '../../../models/dto/GeneradorDTO';
import PARAMETROS from "../../../data/constantes";
import { Modal as ModalAnt } from 'antd';
import 'antd/dist/antd.css';
const aforoApi = new AforoApi();

type PeliquidacionDetalleType = {
  tafna: number;
  volumenGenerado: number;
  onConfirmar: any;
}

function LiquidacionAforoPage() {

  const [detallesAforo, setDetallesAforo] = useState<PageT<DetalleAforoDTO>>();
  const [page, setPage] = useState<PageT<AforoInfoDTO>>();
  const [selected, setSelected] = useState<AforoInfoDTO>();
  const aforoForm: UseFormMethods<AforoInfoDTO> = useForm<AforoInfoDTO>();
  const [preliquidacion, setPreliquidacion] = useState<AforoPreLiquidacionResponse>();
  const [step, setStep] = useState<string>("aforo");
  const [valido, setValido] = useState<boolean>(false);
  const [preliquidar, setPreliquidar] = useState<PeliquidacionDetalleType>();
  const [showModal,setShowModal] = useState<boolean>(false);
  const [generador,setGenerador] = useState<GeneradorDTO>();
  const [factorEquivalencia,setFactorEquivalencia] = useState<number>(0);
  const [tafna,setTafna] = useState<number>(0);
  const [preliquidado,setPreliquidado] = useState(false);
  const [loadingGeneral, setLoadingGeneral] = useState<boolean>(false);
  
  const onUpdate = (pageable: PageableRequest) => {
    aforoApi.getAforosPage(pageable).then(response => {
      setPage(response.data);
    });
  }

  const onSelected = (row: AforoInfoDTO) => {
    setSelected(row);

    const selectedAforo = page?.content?.find(a => a.afoIderegistro === row.afoIderegistro);
    
    setDetallesAforo(
      selectedAforo?.aforoPreLiqDTO?.detalleAforo
        ? {
            content: Array.isArray(selectedAforo.aforoPreLiqDTO.detalleAforo)
              ? selectedAforo.aforoPreLiqDTO.detalleAforo
              : [selectedAforo.aforoPreLiqDTO.detalleAforo],
            totalElements: Array.isArray(selectedAforo.aforoPreLiqDTO.detalleAforo)
              ? selectedAforo.aforoPreLiqDTO.detalleAforo.length
              : 1,
            totalPages: 1,
            size: Array.isArray(selectedAforo.aforoPreLiqDTO.detalleAforo)
              ? selectedAforo.aforoPreLiqDTO.detalleAforo.length
              : 1,
            number: 0,
            last: true,
          }
        : undefined
    );
    reset();

    setPreliquidacion(
      selectedAforo?.aforoPreLiqDTO as AforoPreLiquidacionResponse | undefined
    )
    setValido(true);
  }

  const reset = () =>{
    setPreliquidacion(undefined);
    setValido(false);
    setStep("aforo");
    setPreliquidar(undefined);
    setPreliquidado(false);
    console.log(selected);
  }

  const handleClose = () => setShowModal(false);  

  const confirmarLiquidacion = (state:number) => {   
    if(state ===1)
      setShowModal(true);
     else
     reset(); 
  }

  const enviarLiquidacion = () => {
    alert("Liquidacion enviada");
    setShowModal(false);
    console.log(preliquidacion)
    if(preliquidacion?.tipoAforo!=PARAMETROS.CLASES.CLASE_AFORO_MULTIPLE){
      const request: AforoLiquidacionRequest = {aforo : preliquidacion?.aforo as number, factor:generador?.genFactorEquivalencia as number ,generador:generador?.genIderegistro as number}
      aforoApi.postEnviarLiquidacion(request).then(response =>{
          if(response.data.codigo===1){
            alert(response.data.mensaje);
          }
      });
    }else{
      const request:AforoLiquidacionMultiusuarioRequest = {aforo : preliquidacion?.aforo as number, 
        factor:generador?.genFactorEquivalencia as number ,generador:generador?.genIderegistro as number ,tafna: preliquidar?.tafna as number}

        aforoApi.postEnviarLiquidacionMultiusuario(request).then(response =>{
          if(response.data.codigo===1){
            alert(response.data.mensaje);
          }
      });
    }
    reset();
  }

  const confirmarPreLiquidacion = (generador: GeneradorDTO,tafnaCalculado:number) => {
    console.log(preliquidacion)
    setFactorEquivalencia(generador.genFactorEquivalencia);
    setGenerador(generador);

    //const tafna: number = ((preliquidacion as AforoPreLiquidacionResponse)?.volumenMedio * generador.genFactorEquivalencia);
    const tafna: number = tafnaCalculado;
    setTafna(tafna);

    const preliquidarTmp: PeliquidacionDetalleType = { tafna: tafna, volumenGenerado: 
      preliquidacion?.tipoAforo!=PARAMETROS.CLASES.CLASE_AFORO_MULTIPLE ? (preliquidacion as AforoPreLiquidacionResponse)?.volumenMedio
      : (preliquidacion as AforoPreLiquidacionResponse)?.totalVisitasConsolidado, 
      onConfirmar: confirmarLiquidacion }
    setPreliquidar(preliquidarTmp);
    setPreliquidado(true);
    setStep("detalles");
    
  }

  const handleLiquidacion = (tipo: 'liquidacion' | 'multiusuario', title: string) => {
    ModalAnt.confirm({
      title: `Confirmación ${title}`,
      content: <p>¿Desea continuar?</p>,
      onOk: async () => {
        const loadingSetter =  setLoadingGeneral;
        loadingSetter(true);
        
        try {
          const response = tipo === 'liquidacion' 
            ? await aforoApi.postLiquidacionGeneral(tipo)
            : await aforoApi.postLiquidacionGeneralMultiusuario(tipo);
          if ( response.status === 200 && response.data.statusCode === 1) {
            ModalAnt.success({
              title,
              content:response.data.statusText + " Cantidad: " + response.data.statusCode,
            });
          } else {
            ModalAnt.error({
              title: "Error",
              content: response.data.statusText,
              onOk: () => {
                console.log(response);
              }
            });
          }
        } catch (error) {
          ModalAnt.error({
            title: "Error",
            content: <p>Error al realizar la {title.toLowerCase()}</p>,
            onOk: () => {
              console.log(error);
            }
          });
        } finally {
          loadingSetter(false);
        }
      },
      okText: "Confirmar",
      cancelText: "Cancelar",
    });
  };
  
  const liquidacionGeneral = () => handleLiquidacion('liquidacion', "Liquidación General");
  const liquidacionMultiusuarioGeneral = () => handleLiquidacion('multiusuario', "Liquidación Multiusuario General");
  
  // Filtrar aforos por estado
  const aforosConError = page?.content?.filter(a => a.afoEstado === "Error-Liquidacion") || [];
  const aforosEnProceso = page?.content?.filter(a => a.afoEstado === "En Proceso") || [];
  const aforosNormales = page?.content?.filter(a => a.afoEstado === "Pre-Liquidacion") || [];
  
  return (
    <Fragment>
      <div className="container-fluid">
        <div className="row mb-3">
          <div className="col-12 text-right justify-content-end d-flex gap-2">
            <Button 
              className="btn" 
              variant="primary" 
              size='sm' 
              onClick={() => liquidacionGeneral()} 
              disabled={loadingGeneral}
            >
              {loadingGeneral ? 'Procesando...' : 'Liquidación General'}
            </Button>

            <Button 
              className="btn ml-3" 
              variant="primary" 
              size='sm' 
              onClick={() => liquidacionMultiusuarioGeneral()} 
              disabled={loadingGeneral}
            >
              {loadingGeneral ? 'Procesando...' : 'Liquidación Multiusuario General'}
            </Button>
          </div>
        </div>

        {/* Tabs para organizar los aforos por estado */}
        <div className="row">
          <div className="col">
            <Tabs defaultActiveKey="disponibles" id="aforos-tabs" className="mb-3">
              {/* Tab de Aforos Disponibles */}
              <Tab 
                eventKey="disponibles" 
                title={
                  <span>
                    <i className="fas fa-check-circle text-info"></i> Aforos Disponibles ({aforosNormales.length})
                  </span>
                }
              >
                <ListadoAforoComponent 
                  aforos={{
                    content: aforosNormales,
                    totalElements: aforosNormales.length,
                    totalPages: 1,
                    size: aforosNormales.length,
                    number: 0,
                    last: true
                  }} 
                  onUpdate={onUpdate} 
                  onSelected={onSelected} 
                />
              </Tab>

              {/* Tab de Aforos En Proceso */}
              <Tab 
                eventKey="en-proceso" 
                title={
                  <span>
                    <i className="fas fa-clock text-warning"></i> Aforos En Proceso ({aforosEnProceso.length})
                  </span>
                }
              >
                <ListadoAforoComponent 
                  aforos={{
                    content: aforosEnProceso,
                    totalElements: aforosEnProceso.length,
                    totalPages: 1,
                    size: aforosEnProceso.length,
                    number: 0,
                    last: true
                  }} 
                  onUpdate={onUpdate} 
                  onSelected={onSelected} 
                />
              </Tab>

              {/* Tab de Aforos con Error */}
              <Tab 
                eventKey="con-error" 
                title={
                  <span>
                    <i className="fas fa-exclamation-triangle text-danger"></i> Aforos con Errores ({aforosConError.length})
                  </span>
                }
              >
                <ListadoAforoComponent 
                  aforos={{
                    content: aforosConError,
                    totalElements: aforosConError.length,
                    totalPages: 1,
                    size: aforosConError.length,
                    number: 0,
                    last: true
                  }} 
                  onUpdate={onUpdate} 
                  onSelected={onSelected} 
                />
              </Tab>
            </Tabs>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <Tabs transition={false} id="liquidacion_tabs" onSelect={(key) => setStep(key as string)} activeKey={step}>
              <Tab eventKey="aforo" title="Informacion del aforo" disabled={selected === undefined}>
                <div className="row">
                  <div className="col-12">
                    <AforoFormComponent aforo={selected as AforoInfoDTO} readonly={true} form={aforoForm} />
                  </div>
                </div>
              </Tab>
              <Tab eventKey="detalles" onSelect={(key) => setStep(key)} title="Detalles del aforo" disabled={selected === undefined}>
                <div className="row">
                  <div className="col-12">
                    <DetalleAforoListComponent detalles={detallesAforo} preliquidar={preliquidar} />
                  </div>
                </div>
              </Tab>
              <Tab eventKey="visitas" onSelect={(key) => setStep(key)} title="Detalle de visitas" disabled={!valido}>
                <div className="row">
                  <div className="col-12">
                    <AforoMaestroDetalleComponent preliquidacion={preliquidacion as AforoPreLiquidacionResponse}/>
                  </div>
                </div>
              </Tab>
              <Tab eventKey="pre-liquidacion" onSelect={(key) => setStep(key)} title="Pre Liquidacion" disabled={!valido || preliquidado}>
                <div className="row">
                  <div className="col-12">
                    <AforoLiquidacionFormComponent onConfirmar={confirmarPreLiquidacion} preliquidacion={preliquidacion as AforoPreLiquidacionResponse} />
                  </div>
                </div>
              </Tab>
            </Tabs>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
          <Modal show={showModal} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Confirmacion de la liquidacion del aforo</Modal.Title>
              </Modal.Header>

              <Modal.Body>
                <p>Va a proceder a confirmar la liquidacion del aforo {preliquidacion?.aforo}, esta operacion no puede ser reversada.</p>
                <p>Factor de equivalencia: {factorEquivalencia}</p>
                <p>Volumen total generado (Consolidado): 
                  {preliquidacion?.tipoAforo!=PARAMETROS.CLASES.CLASE_AFORO_MULTIPLE ? preliquidacion?.volumenMedio?.toFixed(6) 
                  :
                  preliquidacion?.totalVisitasConsolidado?.toFixed(6)
                  }
                  </p>
                <p>Tafna (Consolidado): {tafna?.toFixed(6)}</p>
              </Modal.Body>

              <Modal.Footer>
                <Button variant="danger" onClick={handleClose} >Cancelar</Button>
                <Button variant="success" onClick={enviarLiquidacion}>Confirmar la liquidacion</Button>
              </Modal.Footer>
            </Modal>
          </div>
        </div>
      </div>
    </Fragment>
  )

}

export default LiquidacionAforoPage;