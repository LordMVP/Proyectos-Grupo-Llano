export type Tvisitas= {
    id: number;
    estado:string;
    fechaProgramacion: string;
    fechaVisita: string;
    semana: string;
    diaSemanaFechaProgramacion:string;
    consecutivo:number;
    fechaEjecucion: string;
    peso: number;
    volumen: number;
    observaciones:string;
    detalles: any[];
    usuIderegistro:number;
}[];