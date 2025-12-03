import DetalleAforoDTO from "./DetalleAforoDTO";
import GeneradorDTO from "./GeneradorDTO";
import MaestroVisitasResource from "./MaestroVisitasResource";

export default interface AforoPreLiquidacionResponse {
    aforo:number;
	minimoVisitas:number;
	visitasTramitadas:number;
	totalVisitasConsolidado:number;
	volumenMedio:number;
	generadores: GeneradorDTO[];
	maestroVisitas:MaestroVisitasResource;
	detalleAforo: DetalleAforoDTO[]; //detalles
	valido:boolean;
	mensaje:string;
	tipoAforo:number;
	genFactorEquivalencia:number;

}