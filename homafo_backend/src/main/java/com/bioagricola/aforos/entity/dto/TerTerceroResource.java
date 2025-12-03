package com.bioagricola.aforos.entity.dto;

import lombok.Data;

import java.sql.Timestamp;
import java.util.Map;

@Data
public class TerTerceroResource {

	private Long  terIderegistro ;
	private String terDocumento ;
	private String terNombre ;
	private String terApellido ;
	private String terNomcompleto ;
	private String terSexo ;
	private String terTelcelular ;
	private String terTelfijo ;
	private Long estTiptercero ;
	private Long uniTiptercero ;
	private String terCorreo ;
	private Long usuIderegistro ;
	private String ciudadCod ;
	private Timestamp terDocexpedicion ;
	private Long uniTipidentifica ;
	private Timestamp terFecnacimiento ;
	private Integer terDigverificacion ;
	private Map<String, Object> terInfoadicional ;

}
