import DsusSuscripcionResource from "./DsusSuscripcionResource";

export default interface DetalleAforoDTO {

    dafoIderegistro:number;
    dafoFecharegistro:Date;
    dafoFechactualizacion:Date;
    afoFechafinvegencia:Date;
    afoNumpqr:String;
    dsusIderegistr:number;
    dsusResource:DsusSuscripcionResource;
    dafoMultiusuporcentaje:String;
    usuIderegistro:number;
    aforo:number;
}