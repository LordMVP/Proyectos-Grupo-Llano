package com.bioagricola.homologaciones.entity;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.bioagricola.common.constant.SchemaConstants;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "dgact_detagestion_actualizacion", catalog=SchemaConstants.ASEO, schema=SchemaConstants.ASEO)
@Getter @Setter @NoArgsConstructor
public class DgactDetagestionActualizacion
{
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="dgact_ideregistro")
	private Integer dgactIderegistro;

	@JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
	@JoinColumn(name = "gact_ideregistro", referencedColumnName = "gact_ideregistro")
	@ManyToOne(optional = false)
	private GactGestionActualizacion gactIderegistro;
	
	@Column(name="dgact_az_id")
	private String dgactAzId;
	
	@Column(name="usu_ideregistro")
	private Integer usuIderegistro;
	
	@Column(name="date_created")
	private Date dateCreated;
}
