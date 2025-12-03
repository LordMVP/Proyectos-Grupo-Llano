import DetalleConceptoVisitaResource from "./DetalleConceptoVisitaResource";

export default interface DetalleMaestroVisita {
    dmafIderegistro:number;
	dmavConsecutivovisita:number;
	dmafFechavisita:Date;
	terAforador:number;
    terAforadorNombre:string;
	dmafPesoaforo:number;
	dmafEstado:string;
	dmafFecharegistro:Date;
	dmafSemanasecuencia:number;
	dmafObservaciones:string;
	detalles:DetalleConceptoVisitaResource[];
}