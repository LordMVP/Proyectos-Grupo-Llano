import DetalleAforoDTO from './DetalleAforoDTO';

export default interface AforoInfoDTO {
    afoIderegistro:number;
    tipoAforoId:number;
    tipoAforoNombre:string;
    tipoAforoCodigo:string;
    afoFechaInicio: Date;
    afoFechaVigencia: Date;
    afoEstado:string;
    mafvFactor:number;
    afoObservaciones?:string;    
    afoNumpqr?:string;
    terAforadorNombre:string;
    terAforadorId:number;
    terAforadorDocumento:string;
    claseAforoId:number;
    claseAforoNombre:string;
    afoIdeAfoPadre?:number;
    conceptoAforoId:number;
    rureIderegistro:number;
    conceptoAforoNombre:string;
    afoDistribucionUniforme:boolean;
    aforoPreLiqDTO?: {
        detalleAforo: DetalleAforoDTO;
    };
}