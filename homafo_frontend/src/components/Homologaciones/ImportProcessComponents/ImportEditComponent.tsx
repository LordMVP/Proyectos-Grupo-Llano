import { Button, Card, Elevation, Tag } from '@blueprintjs/core';
import React, { Fragment, useEffect, useState } from 'react';
import _ from 'lodash'
import ImportacionApi from '../../../api/homologaciones/ImportacionApi';
import Page, { PageableRequest } from '../../../models/dto/Pagination';
import ImportTabProps from '../../../models/dto/TabImportProps';
import DataTableComponent from '../../utils/DataTableComponent/DataTableComponent';
import ImportRowEditorComponent from './ImportRowEditorComponent';
import { Col, Row } from 'react-bootstrap';
import NewLoader from '../../loader/NewLoader';

function ImportEditComponent(props: ImportTabProps) {
    const columnsDetalle = [
        { name: 'Fila', selector: 'piminsFila', grow: 1 },
        { name: 'Tablas', selector: 'tablas', grow: 4, cell: row => row.piminsJson.tablas.map((tabla) => <Tag round={true} key={tabla.iminsIderegistro}>{tabla.nombre}</Tag>) },
        { name: 'Proceso Importacion', selector: 'pimpIderegistro', grow: 1 },
        { name: 'Estado', selector: 'piminsEstado', grow: 1 }
    ];
    const [pimpId, setPimpId] = useState(props.pimpId);
    const importacionApi = new ImportacionApi();
    const [data, setData] = useState<Page>();
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        setPimpId(props.pimpId);
    }, [props]);

    const updateTable = (pageable: PageableRequest) => {
        if (props.pimpId) {
            pageable.sort = "piminsFila,asc";
            importacionApi.obtenerPimp(props.pimpId as number, pageable).then(response => {
                setData(response.data);
            });
        }
    }
    const handleProcesarPimp = () => {
        console.log("Procesando");
        setLoading(true);
        importacionApi.procesarPimp(pimpId as number).then(response => {
            setLoading(false);
            props.handlerComplete({ type: 'complete', step: 'resultado', data: response.data });            
        });
    }
    return (
        <Fragment>
            {loading ?<NewLoader/>                :
                <Card interactive={true} elevation={Elevation.TWO} className=".modifier">
                    <Row>
                        <Col md={{ span: 2, offset: 10 }} className="mb-2" >
                            <Button onClick={handleProcesarPimp} icon="database">Procesar Proyecciones</Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <DataTableComponent expandableRowsComponent={<ImportRowEditorComponent />} page={data as Page} columns={columnsDetalle} onUpdate={(pageable) => updateTable(pageable)}>
                            </DataTableComponent>
                        </Col>
                    </Row>
                </Card>
            }
        </Fragment>
    )
}

export default ImportEditComponent;