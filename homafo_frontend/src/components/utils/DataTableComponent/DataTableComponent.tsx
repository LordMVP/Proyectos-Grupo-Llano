
import React, { Fragment } from 'react';
import DataTable from 'react-data-table-component';
import Page, { PageableRequest } from '../../../models/dto/Pagination';
import { InputGroup, FormControl, Button, Form } from 'react-bootstrap';
import { MdSearch } from 'react-icons/md';

interface IDataTableUnidadComponentProps {
    columns: any;
    onUpdate: any;
    page?: Page;
    expandableRowsComponent?: any;
    fixedHeader?: boolean;
    fixedHeaderScrollHeight?: string;
    showSearch?:boolean;
    selectableRows?:boolean;
    onSelectedRowsChange?:any;
    selectableRowSelected?:any;
    loading?:boolean;
    clearSelectedRows?:boolean;
    prefixId?:string;
    showFilter?:boolean;
    customStyles?:any

}

interface SDataTableUnidadComponentState {
    loading: boolean,
    page: Page | null,
    searchText?:string;
}
const paginationOptions = { noRowsPerPage: false, rowsPerPageText: 'Filas por página', rangeSeparatorText: 'de', selectAllRowsItem: true, selectAllRowsItemText: 'Todos' };

class DataTableComponent extends React.Component<IDataTableUnidadComponentProps, SDataTableUnidadComponentState>{
    private pageable: PageableRequest = { 'page': 0, 'size': 5, 'sort': '','search':'' ,'filter':'estado,A'};
    constructor(props: IDataTableUnidadComponentProps) {
        super(props);
        let arr: any[] = [];
        let page: Page = { content: arr };
        this.state = { loading: props.loading?props.loading:false, page: page ,searchText:''};
        this.handleOnSearch = this.handleOnSearch.bind(this);
        this.handleShowAll = this.handleShowAll.bind(this);
    }
    componentDidMount() {
        this.props.onUpdate(this.pageable);
        this.setState({ loading:  this.props.loading?this.props.loading:false, page: this.props.page as Page });
    }

    handleOnSearch(searchText:any){        
        this.setState({ loading: true });
        this.pageable.search = searchText;
        //this.pageable.size = this.pageable.size;
        this.props.onUpdate(this.pageable);
    }

    handlePageChange = async page => {
        console.log('Page change event' + page);
        this.setState({ loading: true });
        this.pageable.page = page - 1;
        this.props.onUpdate(this.pageable);
    }
    handleSortChange = (column,sortDirection) =>{
        console.log(column,sortDirection);        
        this.setState({ loading: true });
        this.pageable.sort = column.selector +","+sortDirection;
        this.props.onUpdate(this.pageable);
    }
    handlePerRowsChange = async (perPage, page) => {        
        this.setState({ loading: true });
        this.pageable.page = page - 1;
        this.pageable.size = perPage;
        this.props.onUpdate(this.pageable);
    }
    static getDerivedStateFromProps(props, state) {        
        if (state.page !== props.page) {
            
            return { page: props.page, loading: false };
        } return null;
    }
    handleShowAll(event) {
        const value = event.target.checked;              
        this.pageable.filter = !value?'estado,A':null;
        this.props.onUpdate(this.pageable);
    }
    render() {
        const { loading, page } = this.state;
        const filter = <Form.Check onChange={this.handleShowAll} id={this.props.prefixId+ '-switch'} type="switch" label="Mostrar inactivos" />; 
        const table = <DataTable
        columns={this.props.columns}
        noHeader={true}
        data={this.state.page?.content as any[]}
        progressPending={loading}
        persistTableHead
        pagination
        dense
        highlightOnHover={true}
        striped={true}
        customStyles={this.props.customStyles}
        paginationPerPage={5}
        paginationRowsPerPageOptions={[5, 10, 15]}
        paginationComponentOptions={paginationOptions}
        paginationServer
        paginationTotalRows={page?.totalElements as number}
        onChangeRowsPerPage={this.handlePerRowsChange}
        onChangePage={this.handlePageChange}
        expandableRows={this.props.expandableRowsComponent != null}
        expandableRowsComponent={this.props.expandableRowsComponent}
        fixedHeader={this.props.fixedHeader}
        fixedHeaderScrollHeight={this.props.fixedHeaderScrollHeight}
        subHeader={this.props.showSearch}
        subHeaderAlign={'right'}
        selectableRows={this.props.selectableRows}
        onSelectedRowsChange={this.props.onSelectedRowsChange}
        selectableRowSelected={this.props.selectableRowSelected}
        subHeaderComponent={<SearchComponent onSearch={e => this.handleOnSearch(e.target.value)}/>}
        clearSelectedRows={this.props.clearSelectedRows}
        onSort={this.handleSortChange}
    />;
    if(this.props.showFilter){
        return (<Fragment>{filter} {table}</Fragment>);
    }else {
        return (<Fragment>{table}</Fragment>);
    }
        
    }

}

function SearchComponent(props) {
    return (
        <div>
            <InputGroup className="mb-3"  size="sm"> 
                <FormControl
                    placeholder="Buscar elementos"
                    aria-label="buscar"
                    aria-describedby="basic-addon2"   
                    onChange={props.onSearch}                    
                />
                <InputGroup.Append>
                    <Button variant="outline-secondary">
                        <MdSearch/>
                    </Button>
                </InputGroup.Append>
            </InputGroup>
        </div>
    ); 
}

export default DataTableComponent;