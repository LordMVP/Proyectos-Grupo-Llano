package com.bioagricola.common.entity;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import com.bioagricola.common.constant.SchemaConstants;

import lombok.Data;

@Entity
@Data
@Table(name = "fmg_facturacioncarterag", catalog=SchemaConstants.ASEO, schema=SchemaConstants.ASEO)
public class FacturaMarcadaG implements Serializable{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "facmarc_ideregistro")
	private Long facmarcIderegistro;
	@Column(name = "fac_ideregistro")
	private Long facIderegistro;	
	@Column(name = "fac_estado")
	private String facEstado; 
	@Column(name = "facmarc_fecha")
	private Date facFecha;
	@Column(name = "fac_sdoreal")
	private Double facSdoreal;
	@Column(name = "fac_vlrreal")
	private Double facVlrreal;
	@Column(name = "per_ideregistro")
	private Long perIderegistro;
	@Column(name="ghom_ideregistr")
	private Long ghomIderegistr;
	@Column(name="emp_ideregistro")
	private Long empIderegistro;
	@Column(name="dsus_ideregistr")
	private Long dsusIderegistr;
	@Column(name="usu_ideregistro")
	private Long usuIderegistro;
	@Column(name = "facmarc_estado")
	private String facMarcEstado;
	
	
}
