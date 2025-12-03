//import AforoApi from "../../../api/aforos/AforoApi";
import DataTableComponent from "../../../components/utils/DataTableComponent/DataTableComponent";
import UtilsFunction from "../../../components/utils/UtilsFunction";

import AforoInfoDTO from "../../../models/dto/AforoInfoDTO";
import { PageableRequest, PageT } from "../../../models/dto/Pagination";
import React, { Fragment, useEffect, useState } from "react";
import { AiOutlineAppstoreAdd } from "react-icons/ai";
//import AforoInfoComponent from "../AforoFormComponent/AforoFormComponent";
//import { SubmitHandler, useForm, UseFormMethods } from "react-hook-form";
import PARAMETROS from "../../../data/constantes";
//import AforoSuscripcionListComponent from "../AforoSuscripcionListComponent/AforoSuscripcionListComponent";
//const aforoApi = new AforoApi();

const columns = (onselect: any) => {
  return ([
    {
      cell: (row) => <a onClick={() => onselect(row)}><AiOutlineAppstoreAdd /></a>,
      width: '56px', // custom width for icon button
      style: {
        borderBottom: '1px solid #FFFFFF',
        marginBottom: '-1px',
      },
    },
    {
      name: 'Codigo Anterior',
      selector: 'dsusPcodigo',
    },
    {
      name: 'Id',
      selector: 'afoIderegistro',
      sortable: true,
      style: {
        color: '#202124',
        fontSize: '14px',
        fontWeight: 500,
      },
    },
    {
      name: 'Tipo aforo',
      selector: 'tipoAforoNombre',
    },
    {
      name: 'Clase aforo',
      selector: 'claseAforoNombre',
    },
    {
      name: 'Fecha inicio',
      selector: "afoFechainicio",
      sortable: true,
      cell: (row: AforoInfoDTO) => { return UtilsFunction.formatDate(row.afoFechaInicio) }
    },
    {
      name: 'Fecha vigencia',
      selector: (row: AforoInfoDTO) => { return UtilsFunction.formatDate(row.afoFechaVigencia) }
    },
    {
      name: 'Aforador',
      selector: 'terAforador',
      cell: (row: AforoInfoDTO) => { return row.terAforadorDocumento + ' - ' + row.terAforadorNombre },
      grow: 3,
      sortable: true,
      wrap: true
    },
    {
      name: 'Estado',
      selector: 'afoEstado',
    }
  ]);
};

type ListadoAforoProps = {
    aforos: PageT<AforoInfoDTO>;
    onUpdate: (request:PageableRequest) => void
    onSelected?: (selected:AforoInfoDTO) => void
}

function ListadoAforoComponent(props : ListadoAforoProps) {
  const [page, setPage] = useState<PageT<AforoInfoDTO>>({ content: [], totalElements: 0 });
  const [loading, setLoading] = useState(true);
  //const [selectedAforo, setSelectedAforo] = useState<AforoInfoDTO>();
  //const aforoForm: UseFormMethods<AforoInfoDTO> = useForm<AforoInfoDTO>();

  const onUpdate = (pageable: PageableRequest) => {
    setLoading(true);
    props.onUpdate(pageable);

    /*aforoApi.getAforosPage(pageable).then(response => {
      setPage(response.data);
      setLoading(false);
    });*/
  }
  useEffect(() => {
    //onUpdate(PARAMETROS.DEFAULT_PAGEABLE);
    setLoading(false);
    setPage(props.aforos);
  }, [props.aforos])

  const onSelect = (row: AforoInfoDTO) => {    
    if(props.onSelected)
      props.onSelected(row);
  }

  
  return (
    <Fragment>
      <DataTableComponent
        showSearch={true}
        columns={columns(onSelect)}
        page={page}
        loading={loading}
        onUpdate={onUpdate}
        customStyles={PARAMETROS.DATATABLES_CUSTOM_STYLE}
      />     
    </Fragment>);
}

export default ListadoAforoComponent;

