package com.bioagricola.aforos.entity.dto;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.Date;


import lombok.Data;

@Data
public class DsusSuscripcionResource {

	private Long dsusIderegistr;
	private String dsusEstado;
	private String dsusDescripcion;
	private String dsusPcodigo;
	private Long susIderegistro;
	private Long terIderegistro;
	private TerTerceroResource terTerceroResource;
	private Long proIderegistro;
	private Long uniMunicipio;
	private Long estTipsuscripc;
	private Long uniTipsuscripc;
	private Integer estTipusosuscr;
	private Long uniTipusosuscr;
	private Integer empIderegistro;
	private Long estLiquidacion;
	private Long uniLiquidacion;
	private Long cicIderegistro;
	private Date dsusFecinicio;
	private Date dsusFecexpira;
	private Integer proCatestrato;
	private Date dsusIniestado;
	private Date dsusFinestado;
	private BigDecimal dsusFactor;
	private Long usuIderegistro;
	private Long uniActsuscripc;
	private String dsusResolestrato;
	private Date dsusFecact;
	private String terceroNombreCompleto;
	private String terceroDocumento;

}
