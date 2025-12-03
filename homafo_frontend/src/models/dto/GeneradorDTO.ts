import UnidadDTO from "./UnidadDTO";

export default interface GeneradorDTO {
    genIderegistro:number | null;
    unidad:UnidadDTO;
    genNombre?:string;
    uniTipouso:number;
    uniTipousoDesc?:string;
    genDesde:number;
    genHasta:number;
    genVolumenDesde?:number;
    genVolumenHasta?:number;
    genFactorEquivalencia:number;
    uniClaseaforo?: number;
    fechaGenerador:string;
}