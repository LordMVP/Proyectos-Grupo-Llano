import { Button, Classes, Drawer, FormGroup,  MenuItem, Position } from '@blueprintjs/core';
import React, { Fragment, useEffect, useState } from 'react';
import { Col, Form } from 'react-bootstrap';
import _ from 'lodash'
import Pimins, { PiminsTabla } from '../../../models/dto/Pimins';
import DataTable from 'react-data-table-component';
import ImportacionApi from '../../../api/homologaciones/ImportacionApi';
import { ItemPredicate, ItemRenderer, Suggest } from "@blueprintjs/select";
import ImportacionSuggestRequest from '../../../models/dto/ImportacionSuggestRequest';
import DiccApi from '../../../api/homologaciones/DiccApi';

const importacionApi = new ImportacionApi();

interface ImportRowEditorComponentProps {
    data?: Pimins;
}

const diccApi = new DiccApi();
function ImportRowEditorComponent(props: ImportRowEditorComponentProps) {

    const columnas = [
        { name: 'Orden', selector: 'iminsOrden' },
        { name: 'Tabla', selector: 'etiqueta' },
        { name: 'Estado', selector: 'iminsEstado' },
        { name: 'Opciones', cell: row => <Button icon="build" onClick={() => handleEditarTabla(row.iminsIderegistro)} small>Editar</Button>, },
    ];
    const [pimins] = useState<Pimins>(props.data as Pimins);
    const [selected, setSelected] = useState<PiminsTabla>();
    const [showDrawer, setShowDrawer] = useState(false);
    useEffect(()=>{
        console.log("Effect editor"+pimins.piminsIderegistro);
        diccApi.getTableName('ter_tercero').then(response=>{console.log(response.data)});
    },[])

    const handleEditarTabla = (tabla) => {
        setSelected(tabla);
        handleEditor(true);
    }

    const handleEditor = (action) => {
        setShowDrawer(action);
    }

    const handleSaveTabla = (tabla: PiminsTabla, piminsIderegistro: number) => {
        console.log("Guardando ediccion " + tabla.nombre + " PiminsIDe :" + piminsIderegistro);
        importacionApi.updateTablePimins(tabla, piminsIderegistro);
    }
    return (
        <Fragment>
            <DataTable
                title="Tablas de proyeccion"
                columns={columnas}
                defaultSortField="iminsOrden"
                data={pimins?.piminsJson.tablas as PiminsTabla[]}
                pagination={true}
                paginationPerPage={3}
                paginationRowsPerPageOptions={[3, 5]}
                highlightOnHover={true}
                striped={true}
                dense={true}
                noHeader={true}
                fixedHeader={true}
                fixedHeaderScrollHeight="100px"
            />
            <FormEditor handleSave={handleSaveTabla} pimins={pimins} isOpen={showDrawer} tablaSeleccionada={selected as PiminsTabla} handleEditor={handleEditor} />
        </Fragment>
    );
}

interface FormEditorProps {
    handleSave(tablaActual: PiminsTabla, piminsIderegistro: number): void;
    pimins: Pimins;
    isOpen: boolean;
    tablaSeleccionada: PiminsTabla;
    handleEditor(action: boolean): void;

}



function FormEditor(props: FormEditorProps) {

    const [state, setState] = useState<FormEditorProps>({ ...props });

    const [tablaActual, setTablaActual] = useState<PiminsTabla>();

    useEffect(() => {
        setState(props);
        const tablaActual = _.find(state.pimins.piminsJson.tablas, { 'iminsIderegistro': props.tablaSeleccionada });
        setTablaActual(tablaActual);
        console.log('Effect form');
    }, [props]);

    const handleClose = () => {
        props.handleEditor(false);
    }
    const handleChange = (e) => {
        const { value, name } = e.target;
        console.log('Name: ' + name + ' Value:' + value);
        let itemCopy = JSON.parse(JSON.stringify(tablaActual));
        const columna = _.find(itemCopy?.columnas, { 'nombre': name });
        columna.valor = value;
        _.set(itemCopy, 'columnas[' + name + '].valor', value);
        console.log(itemCopy);
        setTablaActual(itemCopy);
    }
    const handleSave = () => {
        props.handleSave(tablaActual as PiminsTabla, state.pimins.piminsIderegistro);
    }

    const columnasComponent = tablaActual?.columnas?.map((col) => <ImportColumnEditorComponent handleChange={handleChange} columna={col} />);
    return (
        <Fragment>
            <Drawer
                position={Position.RIGHT}
                icon="info-sign"
                onClose={handleClose}
                title={"Ediccion de registro " + tablaActual?.etiqueta + " de la fila " + state.pimins?.piminsFila}
                isOpen={props.isOpen}
            >
                <div className={Classes.DRAWER_BODY}>
                    <div className={Classes.DIALOG_BODY}>
                        <Form className="small">
                            {columnasComponent}
                        </Form>
                        <Button onClick={handleSave} icon="saved">Guardar</Button>
                    </div>
                </div>
                <div className={Classes.DRAWER_FOOTER}>Footer</div>
            </Drawer>
        </Fragment >
    );

}

interface IItemSugerido {
    id: any;
    label: string;
}

const ItemSuggest = Suggest.ofType<IItemSugerido>();

const renderItem: ItemRenderer<IItemSugerido> = (item, { handleClick, modifiers, query }) => {

   // console.log("Query render" + query);
    if (query.length < 3) {
        return null;
    }
    if (!modifiers.matchesPredicate) {
        return null;
    }

    const text = `${item.id}. ${item.label}`;
    return (
        <MenuItem
            active={modifiers.active}
            disabled={modifiers.disabled}
            key={item.id}
            onClick={handleClick}
            text={text}
        />
    );
};

export const filterItem: ItemPredicate<IItemSugerido> = (query, item, _index, exactMatch) => {
    const normalizedTitle = item.label.toLowerCase();
    const normalizedQuery = query.toLowerCase();

    if (exactMatch) {
        return normalizedTitle === normalizedQuery;
    } else {
        return `${item.id}. ${normalizedTitle} `.indexOf(normalizedQuery) >= 0;
    }
};


function ImportColumnEditorComponent(props) {
    const [state, setState] = useState(props);
    const [items, setItems] = useState<IItemSugerido[]>([])
    useEffect(() => {
        setState(props);        
    }, [props.columna]);
    
    if (!props.columna) {
        return null;
    }

    const handleQuery = (query, event) => {
        console.log("qyery:",query)
        if (query.length > 3 && event != undefined) {
            const request: ImportacionSuggestRequest = { diminsId: props.columna.dimins, searchValue: query, limit: 10 };
            importacionApi.suggestSearch(request).then(response => {
                if (response.data != null) {
                    console.log(response.data);
                    setItems(response.data);
                }
            });
        }
    }
    const handleItemSelect = (item) => {
        console.log(item);
        props.handleChange({target:{name:state.columna.nombre,value:item.id}});
    }
    const renderInputValue = (item: IItemSugerido) => item.id + "-" + item.label;
    const itemRender = props.columna.sugerido ?
        <ItemSuggest disabled={!state.columna.editable} fill={true} onItemSelect={handleItemSelect} onQueryChange={handleQuery} popoverProps={{ minimal: true }} openOnKeyDown={true} initialContent={null} items={items as IItemSugerido[]} inputValueRenderer={renderInputValue} itemRenderer={renderItem} itemPredicate={filterItem} /> :
        <Form.Control onChange={props.handleChange} value={state.columna.valor} type="text" disabled={!state.columna.editable} name={state.columna.nombre} className="mb-2" size="sm" />
    return (
        <Form.Row>
            <Form.Group as={Col}>
                <FormGroup                    
                    label={state.columna.etiqueta}
                    labelFor="text-input"
                    labelInfo={state.columna.sugerido?'Autocompletar':''}
                >{itemRender}
                </FormGroup>
            </Form.Group>                
        </Form.Row>
    );
}
export default ImportRowEditorComponent;