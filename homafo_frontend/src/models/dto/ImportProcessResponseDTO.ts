
interface ImportProcessResponse {
    mensaje:string;
    codigo:number;
    validaciones?:RegistroValidacionArchivoDTO[];
    informacionImportacion?:InformacionImportacion;
}

interface RegistroValidacionArchivoDTO {
    validacion:string;
    fila:number;
    columnaIndex:number;
    columnaNombre:string;
    mensaje:string;
    valor:any;
}

interface InformacionImportacion {
    nombreArchivo:string;
    numeroFilasArchivo:number;
    numeroColumnasArchivo:number;
    tablasRelacionadas:string[];
    nombreConfiguracion:string;
    pimpId?:number;
    numeroProyecciones?:number;
    mensajesError?:string[];
}


export default ImportProcessResponse;