package com.bioagricola.aforos.entity.dto;

import java.util.List;

import com.bioagricola.common.entity.HrrHorrecoleccion;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class SearchResponseDTO {

	private Long idAforo;
	private Long uniActSuscripc; //codigo de la actividad del suscriptor
	private String actividad;		//De la suscripción
	private String fechaFinal;		//vigencia hasta
	private String tipoAforo;		//tipo aforo de la relación
	private String tipoGenerador;	//Tabla existente habría que ver cómo se relaciona
	private String volumenTotal;	//Aún no existe (Debe ser del consolidado)
	private String tafna;			//aún no existe 
	private String estado;			//campo plano
	private String claseSuscripcion; //clase suscripcion multiusuario o normal	
	private String terDocumento;
	private String observaciones;
	private String volumenPromedio; //Calculo promedio del volumen
	private String factorProduccion; //Factor de produccion del tipo aforo
	private String numAforoPadre; //[JLMENDOZA] aforo padre consolidado historico
	
	//Respuesta para la consulta de suscripciones
	private String nombresYapellidos;
	private String direccion;
	private String tipoUso;
	private String referenciaComercial;
	private String actividadComercial;
	private String nombreEstablecimiento;
	private Long   barrioUsuarioCodigo;
	private String barrioUsuario;
	private Long uniComplemento;
	private String cmpDireccion; //complemento de direccion de usuario
	private List<HrrHorrecoleccion> frecuenciaRecoleccion;
	private String nombreConvenio;
	private Long estrato;
	private String uniCmpdireccion;
	
	//Relaciones
	private Long idIasus;
	private Long idFrecuencia;
	private Long idSuscripcion;
	private Long idEmpresa;
	private Long idUsuario;
	private Long idPropiedad;
	private Long idTercero;
	private String codSuscripcion;
	private String numPqr;
	
	//Multiusuario
	private Long codActualizacion;
	private String nombreMultiusuario;
	private String fechaInicio;
	private Double pesoToneladas;
	private Integer cantidadUsuarios;
	private Long factura;
	private String segmento;
	private String distribucion;
	
	
	//macroruta
	private Integer rureIderegistro;
	
}
