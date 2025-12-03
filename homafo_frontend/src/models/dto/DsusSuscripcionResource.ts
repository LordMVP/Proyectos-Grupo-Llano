import TerTerceroResource from "./TerTerceroResource";

export default interface DsusSuscripcionResource {

    dsusIderegistr:number;
	dsusEstado:String;
	dsusDescripcion:String;
	dsusPcodigo:String;
	susIderegistro:number;
	terIderegistro:number;
	terTerceroResource:TerTerceroResource[];
	proIderegistro:number;
	uniMunicipio:number;
	estTipsuscripc:number;
	uniTipsuscripc:number;
	estTipusosuscr:number;
	uniTipusosuscr:number;
	empIderegistro:number;
	estLiquidacion:number;
	uniLiquidacion:number;
	cicIderegistro:number;
	dsusFecinicio:Date;
	dsusFecexpira:Date;
	proCatestrato:number;
	dsusIniestado:Date;
	dsusFinestado:Date;
	dsusFactor:number;
	usuIderegistro:number;
	uniActsuscripc:number;
	dsusResolestrato:String;
	dsusFecact:Date;
	terceroNombreCompleto:string;
	terceroDocumento:string;
}