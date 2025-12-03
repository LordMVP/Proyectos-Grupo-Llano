export default interface MubaDTO {
    mubaIderegistro: number | null;
    uniMunicipio?: number;
    uniBarrio?: number ;
    mubaSector?:number;    
    mubaFactor?:number;    
    dmubaActivo?: DmubaDTO | null;
    complementos?:any[];
    mbru?:any[];
    zonaRiesgo?:string;

}

export interface DmubaDTO {
    dmubaIderegistro?: number | null;
    barrioHomllanogas?:number;
    dmubaRutas?:any[];
    dmubaFrecuenciasBarrido?:any[];
    dmubaCodigo?:string;
}

export interface MubaDTOFull {
    mubaIderegistro: number | null;
    uniMunicipio?: number;
    uniBarrio?: number ;
    mubaSector?:number;    
    mubaFactor?:number;
    complementos?:any[];
    barrioHomllanogas?:number;
    dmubaRutas?:any[];
    dmubaFrecuenciasBarrido?:any[];    
}