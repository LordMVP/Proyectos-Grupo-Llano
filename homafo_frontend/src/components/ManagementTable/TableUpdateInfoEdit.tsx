import React, { useState } from "react";
import { Table, Button} from "react-bootstrap";
import { TiDelete } from "react-icons/ti";
import { FaEdit, FaPlusCircle } from "react-icons/fa";
import { connect } from "react-redux";
import { toast } from "react-toastify";

import ModalEditForm from '../../pages/homologaciones/tablaActualizacion/modal_edit_form';

type Props = {
  data?: any;
  submitShowData: (data: any) => void;
  submitDeleteData: (data: any) => void;
  submitApproveData: (data: any) => void;
  submitUpdateData: (data: any) => void;
};

export const TableUpdateInfoEdit = (props: Props) => {
  const { data = [], submitShowData, submitDeleteData, submitApproveData, submitUpdateData } = props;

  const [showModal, setShowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);

  const [regEditados, setRegEditados] = useState<number[]>([]);

  const handleEditClick = (item: any) => {
    setSelectedRow({ ...item });
    setShowModal(true);
  };

  const handleSave = (formData) => {
    let resultado = validarCampos(formData);

    if (!resultado.success) {
      toast.warn(resultado.message, {
        autoClose: false,
        closeOnClick: false,
        draggable: false,
      });
    }else{
      console.log("Datos actualizados:", resultado.formData);
      setShowModal(false);
      submitUpdateData(resultado.formData);
      setRegEditados([...regEditados, formData.actsusIderegistro]);
    }
  };

  const validarCampos = (formDataRaw) => {
    let validacion = {
      message: "",
      success: true,
      formData: formDataRaw
    };
  
    // Validaciones individuales
    if (formDataRaw.fechaEncuesta === undefined || formDataRaw.fechaEncuesta === null || formDataRaw.fechaEncuesta === "") {
      validacion.success = false;
      validacion.message += "• El campo 'Fecha de encuesta' es requerido.\n";
    }

    if (formDataRaw.usuIderegistro === undefined || formDataRaw.usuIderegistro === null || formDataRaw.usuIderegistro === "") {
      validacion.success = false;
      validacion.message += "• El campo 'Usuario (Colaborador)' es requerido.\n";
    }

    if (formDataRaw.facturacion === undefined || formDataRaw.facturacion === null || formDataRaw.facturacion === "") {
      validacion.success = false;
      validacion.message += "• El campo 'Facturacion' es requerido.\n";
    }

    if (formDataRaw.terNombre === undefined || formDataRaw.terNombre === null || formDataRaw.terNombre === "") {
      validacion.success = false;
      validacion.message += "• El campo 'Nombre del tercero' es requerido.\n";
    }
  
    if (formDataRaw.terTipoDocumento === undefined || formDataRaw.terTipoDocumento === null || formDataRaw.terTipoDocumento === "") {
      validacion.success = false;
      validacion.message += "• El campo 'Tipo documento' es requerido.\n";
    }

    if (formDataRaw.terDocumento === undefined || formDataRaw.terDocumento === null || formDataRaw.terDocumento === "") {
      validacion.success = false;
      validacion.message += "• El campo 'Número de documento' es requerido.\n";
    }

    //NO REQUERIDO
    if (formDataRaw.terTelcelular === undefined || formDataRaw.terTelcelular === null || formDataRaw.terTelcelular === "") {
      formDataRaw.terTelcelular = "0";
    }

    //NO REQUERIDO
    if (formDataRaw.terCorreo === undefined || formDataRaw.terCorreo === null || formDataRaw.terCorreo === "") {
      formDataRaw.terCorreo = "SINCORREO@CORREO.COM";
    }

    if (formDataRaw.proDireccion === undefined || formDataRaw.proDireccion === null || formDataRaw.proDireccion === "") {
      validacion.success = false;
      validacion.message += "• El campo 'Dirección' es requerido.\n";
    }

    if (formDataRaw.proZona === undefined || formDataRaw.proZona === null || formDataRaw.proZona === "") {
      validacion.success = false;
      validacion.message += "• El campo 'Zona' es requerido.\n";
    }

    if (formDataRaw.mubaSector === undefined || formDataRaw.mubaSector === null || formDataRaw.mubaSector === "") {
      formDataRaw.mubaSector = 0
    }

    if (formDataRaw.proSeccion === undefined || formDataRaw.proSeccion === null || formDataRaw.proSeccion === "") {
      formDataRaw.proSeccion = 0
    }

    if (formDataRaw.proManzana === undefined || formDataRaw.proManzana === null || formDataRaw.proManzana === "") {
      formDataRaw.proManzana = 0
    }
  
    if (formDataRaw.uniBarrio === undefined || formDataRaw.uniBarrio === null || formDataRaw.uniBarrio === "") {
      validacion.success = false;
      validacion.message += "• El campo 'Barrio' es requerido.\n";
    }

    if (formDataRaw.uniComplemento === undefined || formDataRaw.uniComplemento === null || formDataRaw.uniComplemento === "") {
      validacion.success = false;
      validacion.message += "• El campo 'Complemento' es requerido.\n";
    }

    //NO REQUERIDO
    if (formDataRaw.nomEstablecimiento === undefined || formDataRaw.nomEstablecimiento === null || formDataRaw.nomEstablecimiento === "") {
      formDataRaw.nomEstablecimiento = "";
    }

    //NO REQUERIDO
    if (formDataRaw.uniActcomercial === undefined || formDataRaw.uniActcomercial === null || formDataRaw.uniActcomercial === "") {
      formDataRaw.uniActcomercial = "";
    }

    if (formDataRaw.proCatestrato === undefined || formDataRaw.proCatestrato === null || formDataRaw.proCatestrato === "") {
      validacion.success = false;
      validacion.message += "• El campo 'Estrato' es requerido.\n";
    }

    if (formDataRaw.uniTipusosus === undefined || formDataRaw.uniTipusosus === null || formDataRaw.uniTipusosus === "") {
      validacion.success = false;
      validacion.message += "• El campo 'Tipo de uso' es requerido.\n";
    }

    if (formDataRaw.uniLiquidacion === undefined || formDataRaw.uniLiquidacion === null || formDataRaw.uniLiquidacion === "") {
      validacion.success = false;
      validacion.message += "• El campo 'Liquidación' es requerido.\n";
    }

    //NO REQUERIDO
    if (formDataRaw.proNumcatastral === undefined || formDataRaw.proNumcatastral === null || formDataRaw.proNumcatastral === "") {
      formDataRaw.proNumcatastral = "";
    }

    //NO REQUERIDO
    if (formDataRaw.proNumcatastralnacional === undefined || formDataRaw.proNumcatastralnacional === null || formDataRaw.proNumcatastralnacional === "") {
      formDataRaw.proNumcatastralnacional = "";
    }

    /*if (formDataRaw.servicioEmsa === undefined || formDataRaw.servicioEmsa === null || formDataRaw.servicioEmsa === "") {
      validacion.success = false;
      validacion.message += "• El campo 'Servicio EMSA' es requerido.\n";
    }

    if (formDataRaw.servicioGas === undefined || formDataRaw.servicioGas === null || formDataRaw.servicioGas === "") {
      validacion.success = false;
      validacion.message += "• El campo 'Servicio GAS' es requerido.\n";
    }*/
    
    return validacion;
  }

  const submitHandleAprobar = (item) => {
    let resultado = validarCampos(item);

    if (!resultado.success) {
      toast.warn(resultado.message, {
        autoClose: false,
        closeOnClick: false,
        draggable: false,
      });
    }else{
      submitApproveData(resultado.formData);
    }
  };

  return (
    <div className="overflow-auto w-100">
      <Table striped bordered hover>
        <thead className="bg-success text-white text-center">
          <tr>
            <th>IdOperario</th>
            <th>IdRegistro</th>
            <th>Fecha Creación</th>
            <th>Nombre</th>
            <th>Documento</th>
            <th>Datos</th>
            <th>Estado</th>
            <th>Accion</th>
            <th>Proceso</th>
          </tr>
        </thead>

        <tbody>
          {data?.content?.map((item: any, index: number) => (
            <tr className="text-center" key={`datoActualizar-${index}`}>
              <td>{item.usuIderegistro}</td>
              <td>{item.actsusIderegistro}</td>
              <td>{item.actsusFecha}</td>
              <td>{item.terNombre}</td>
              <td>{item.terDocumento}</td>

              <td>
                <Button variant="primary" onClick={() => submitShowData(item)}>
                  Ver
                </Button>
              </td>

              <td>{item?.actsusEstado === "P" ? "PENDIENTE" : "N/A"}</td>

              <td className="d-flex align-items-center gap-2">
                <Button variant="danger" className="mr-1" onClick={() => submitDeleteData(item)}>
                  <TiDelete size={20} />
                </Button>
                <Button variant="primary" className="mr-1" onClick={() => handleEditClick(item)}>
                  <FaEdit size={20} />
                </Button>
                {
                  regEditados.find((registro) => registro === item.actsusIderegistro) !== undefined &&
                  <Button variant="success" onClick={() => submitHandleAprobar(item)}>
                    <FaPlusCircle size={20} />
                  </Button>
                }                
              </td>

              <td>{item.actsusTipo}</td>

            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal de Edición */}
      <ModalEditForm
        showModal={showModal}
        setShowModal={setShowModal}
        selectedRow={selectedRow}
        handleSave={handleSave}
      />
    </div>
  );
};

const mapStateToProps = () => ({});
const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(TableUpdateInfoEdit);