package com.bioagricola.aforos.entity.dto;

/*
 *clase para recolectar respuesta de consulta de historicos
 */


/*@Data
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
@ToString
*/
public interface HistoricosAforoDTO {
	String getIdAforo();
	String getEstado();
	String getVigenciaDesde();
	String getVigenciaHasta();
	String getVigenciaFinal(); //JLMENDOZA
	String getHafomDescripcion();
	String getCodigoBase();
	String getFechaCreacion();
	String getFechaActualizacion();
	String getObservaciones();
	String getTipoAforo();
	String getFactor();
	String getTecnicoAforador();
	String getNumpqr();
	String getClaseSuscripcion();
	String getFrecuenciaRecoleccion();
	String getCantidadFrecuenciaRecoleccion();
	String getAforoPadre();
	
	String getIdSuscriptor();
	String getEstadoSuscriptor();
	String getCodigoSuscriptor();
	String getNombreSuscriptor();
	String getDireccion();
	String getBarrio();
	String getPorcentaje();
	String getActividad();
	String getNombreEstablecimiento();
	String getReferenciaComercial();
	String getNumpqrSuscriptor();
	String getTipoDistribucion();
	String getTafna();
	String getTipoUsoSuscriptor();
	
}

 
