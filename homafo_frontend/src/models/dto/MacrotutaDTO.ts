import RutaDTO from "./RutaDTO";

export default interface MacrorutaDTO {
    rureIderegistro: number | null | undefined;
    arprIderegistro: number  | null | undefined;
    rutIdemacruta: RutaDTO | null | undefined ;
    horarios:HorarioDTO[];
    microrutas:any[];
    rutMicroruta:any[];
}

export interface HorarioDTO {
    hrrIderegistro:number | null;
    hrrDia: string | undefined;
    rureIderegistro: number | null | undefined;
    hrrHorinicio: string | undefined;
    hrrHorfin: string | undefined;
    hrrSwtact:string | undefined;
    microruta:string | undefined | number;
}