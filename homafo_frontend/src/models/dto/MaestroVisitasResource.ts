import DetalleMaestroVisita from "./DetalleMaestroVisita";

export default interface MaestroVisitasResource {
    mafvideregistro:number;
	mafvinicio:Date;
	mafvfin:Date;
	mafvestado:string;
	mafvfecharegistro:Date;
	mafvfechaactualizacion:Date;
	perideregistro:number;
	cicciclo:number;
	unitipogenerador:number;
	mafvfactor:string;
	usuideregistro:number;
	perideregistrofin:number;
	detallesMaestroVisita?:DetalleMaestroVisita[];
	mafvminimovisitas:number;
	aforo:number;
}