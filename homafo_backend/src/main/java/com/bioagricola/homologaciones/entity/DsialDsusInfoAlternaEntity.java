package com.bioagricola.homologaciones.entity;

import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.CreationTimestamp;

import com.bioagricola.common.constant.SchemaConstants;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "dsial_dsusinfoalterna", catalog=SchemaConstants.ASEO, schema=SchemaConstants.ASEO)
@Getter @Setter @NoArgsConstructor 
public class DsialDsusInfoAlternaEntity {

	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="dsial_ideregistr")
    private Integer dsialIderegistr;
	
	@Column(name="dsus_ideregistr")
	private Integer dsusIderegistr;
	
	@Column(name="emp_ideregistro")
	private Integer empIderegistro;
	
	@Column(name="emp_alterna")
	private Integer empAlterna;
	
	@Column(name="dsial_codigoalterna")
	private String dsialCodigoalterna;
	
	@Column(name="dsial_numerimedidor")
	private String dsialNumerimedidor;
	
	@Column(name="dial_estado")
	private String dialEstado;
	
	@Column(name="dial_observaciones")
	private String dialObservaciones;
	
	@Column(name="usu_ideregistro")
	private Integer usuIderegistro;
	
	@CreationTimestamp
	@Column(name="dsial_fecha")
	private Timestamp dsialFecha;
}
