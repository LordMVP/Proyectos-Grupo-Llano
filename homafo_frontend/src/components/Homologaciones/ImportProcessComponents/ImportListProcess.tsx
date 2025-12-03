import { Button, Card, Elevation } from '@blueprintjs/core';
import React, { Fragment, useEffect, useState } from 'react';
import ImportacionApi from '../../../api/homologaciones/ImportacionApi';
import Page, { PageableRequest } from '../../../models/dto/Pagination';
import ImportTabProps from '../../../models/dto/TabImportProps';
import DataTableComponent from '../../utils/DataTableComponent/DataTableComponent';

function ImportProcessListComponent(props?:ImportTabProps){
    const columns = [
        {
            name: 'Id',
            selector: 'pimpIderegistro',
        },
        {
            name: 'Configuracion',
            selector: 'imarcNombre',
        },
        {
            name: 'Fecha creacion',
            selector: 'pimpFechaCreacion',
        },
        {
            name: 'Numero de registros',
            selector: 'pimpNumeroRegistros',
        },
        {
            name: 'Estado',
            selector: 'pimpEstado',
        },
        {
            name: 'Opciones',        
            cell: row => <Button icon="build" onClick={() => selectRow(row)} small>Editar</Button>,
        }
    ];
    const importacionApi = new ImportacionApi();    
    const[lista,setLista] = useState<Page>();
    useEffect(()=>{
        //onUpdate(PARAMETROS.DEFAULT_PAGEABLE);
    },[])

    
    const onUpdate=(pageable:PageableRequest)=>{
        pageable.sort="pimpFechaCreacion,desc";
        importacionApi.getPimps(pageable).then(response=>{
            setLista(response.data);
        });
    }
    const selectRow=(row)=>{
        props?.handlerComplete({ type: 'complete', step: 'procesar',pimpId:row.pimpIderegistro})
    }
    return (
        <Fragment>
            <Card interactive={true} elevation={Elevation.TWO} className=".modifier">
                <DataTableComponent columns={columns} page={lista} onUpdate={onUpdate}></DataTableComponent>
                <Button icon="add" onClick={()=>props?.handlerComplete({type:'setStep',step:'seleccion'})}>Nuevo</Button>                
            </Card>
        </Fragment>
    )
}

export default ImportProcessListComponent;