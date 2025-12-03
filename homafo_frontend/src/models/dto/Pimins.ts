interface Pimins {
    piminsFila:number;
    piminsJson:PiminsJson;
    pimpIderegistro:number;
    piminsIderegistro:number;
}
export interface PiminsJson {
    fila:number;
    pimpIderegistro;
    tablas:PiminsTabla[];
}

export interface PiminsTabla {
    iminsIderegistro:number;
    iminsOrden:number;
    nombre:string;
    sql:string;
    columnas:PiminsColumna[];
    etiqueta?:string;
}

export interface PiminsColumna {
    dimins:number;
    editable:boolean;
    nombre:string;
    sugerido:boolean;
    valor:string;
    etiqueta?:string;
}

export default Pimins;