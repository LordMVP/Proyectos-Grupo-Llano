import DetalleTipoAforoDTO from "./DetalleTipoAforoDTO";
import UnidadDTO from "./UnidadDTO";

export default interface TipoAforoDTO {
    tafoIderegistro:number | null;	
	tafoFrecuencia:number;	
	tafoVigencia:number;	
	tafoPlazoMaximo:number;	
	tafoHolgura:number;	
	tafoFactorProduccion:number;	
	tafoFactorEquivalencia:number;	
	tafoAforoPadre:boolean;
	unidad:UnidadDTO;
	uniCodigo?: string,
    uniNombre?: string,
    uniEstado?: string,
    uniClaseaforo?: number,
	detalles:DetalleTipoAforoDTO[];
	dateCreated:string;
}