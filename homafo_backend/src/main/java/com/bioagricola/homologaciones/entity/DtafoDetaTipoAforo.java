package com.bioagricola.homologaciones.entity;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.hibernate.annotations.DynamicUpdate;

import com.bioagricola.common.constant.SchemaConstants;
import com.bioagricola.homologaciones.entity.listener.EntityUserIdListener;
import com.fasterxml.jackson.annotation.JsonBackReference;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "dtafo_deta_tipo_aforo", catalog=SchemaConstants.ASEO, schema=SchemaConstants.ASEO)
@Getter @Setter @NoArgsConstructor
@DynamicUpdate 
@EntityListeners(EntityUserIdListener.class)
public class DtafoDetaTipoAforo {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name ="dtafo_ideregistro")
	private Long dtafoIderegistro;
	
	@Column(name ="dtafo_desde")
	private Double dtafoDesde;
	
	@Column(name ="dtafo_hasta")
	private Double dtafoHasta;
	
	@Column(name ="dtafo_cantidad_visitas")
	private Integer dtafoCantidadVisitas;
	
	@Column(name ="usu_ideregistro")
	private Integer usuIderegistro;
	
	@Column(name ="date_created")
	private Date dateCreated = new Date();
	
	@ManyToOne
	@JoinColumn(name = "tafo_ideregistro",referencedColumnName = "tafo_ideregistro")
	@JsonBackReference
	private TafoTipoAforo tafoIderegistro;

	@Column(name="dtafo_frecuencia")
	private Integer dtafoFrecuencia;
	

}
