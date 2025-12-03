package com.bioagricola.aforos.entity;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.bioagricola.aforos.entity.base.BaseEntity;
import com.bioagricola.common.constant.SchemaConstants;
import com.fasterxml.jackson.annotation.JsonBackReference;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "hdafo_detaforo", catalog=SchemaConstants.ASEO, schema=SchemaConstants.ASEO)
@Getter @Setter @NoArgsConstructor
public class HdafoDetaforo implements BaseEntity{

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "hdafo_ideregistro")
	private Long hdafoIderegistro;
	
	@Column(name = "hdafo_fecharegistro")
	private Date hdafoFecharegistro;
	
	@Column(name = "hdafo_fechactualizacion")
	private Date hdafoFechactualizacion;
	
	@Column(name = "hafo_fechafinvegencia")
	private Date hafoFechafinvegencia;
	
	@Column(name = "hafo_numpqr")
	private String hafoNumpqr;
	
	@Column(name = "dsus_ideregistr")
	private Long dsusIderegistr;
	
	@Column(name = "hdafo_multiusuporcentaje")
	private String hdafoMultiusuporcentaje;
	
	@Column(name = "usu_ideregistro")
	private Long usuIderegistro;
	
	@Column(name = "hmaf_ideregistro")
	private Long hmafIderegistro;
	
	@Column(name = "volumen_producido")
	private Double volumenProducido;
	
	@Column(name = "tafna_calculado")
	private Double tafnaCalculado;
	
	@Column(name = "factor_equivalencia")
	private Double factorEquivalencia;
	
	@ManyToOne
	@JoinColumn(name = "hafo_ideregistro")
	@JsonBackReference
	private HafoAforos haforo;

	@Override
	public String getNombreTabla() {
		return "hdafo_detaforo";
	}
	
}
