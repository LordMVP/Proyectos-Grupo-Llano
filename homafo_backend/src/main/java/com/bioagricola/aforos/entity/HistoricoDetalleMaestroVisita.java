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
@Table(name = "hdmaf_detallemaestrovisitas", catalog=SchemaConstants.ASEO, schema=SchemaConstants.ASEO)
@Getter @Setter @NoArgsConstructor
public class HistoricoDetalleMaestroVisita implements BaseEntity{

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "hdmaf_ideregistro")
	private Long hdmafIderegistro;
	
	@Column(name = "dmav_consecutivovisita")
	private Long dmavConsecutivovisita;
	
	@Column(name = "dmaf_fechavisita")
	private Date dmafFechavisita;
	
	@Column(name = "ter_aforador")
	private Long terAforador;
	
	@Column(name = "uni_conceptoaforo")
	private Long uniConceptoaforo;
	
	@Column(name = "dmaf_volumenaforo")
	private Double dmafVolumenaforo;
	
	@Column(name = "dmaf_pesoaforo")
	private Double dmafPesoaforo;
	
	@Column(name = "dmaf_estado")
	private String dmafEstado;
	
	@Column(name = "dmaf_fecharegistro")
	private Date dmafFecharegistro;
	
	@Column(name = "dmaf_semanasecuencia")
	private String dmafSemanasecuencia;
	
	@Column(name = "dmaf_observaciones")
	private String dmafObservaciones;
	
	@Column(name = "usu_ideregistro")
	private Long usuIderegistro;	
	
	@ManyToOne
	@JoinColumn(name = "mafv_ideregistro")
	@JsonBackReference
	private MaestroAforoVisita maestroAforoVista;

	@Override
	public String getNombreTabla() {
		return "hdmaf_detallemaestrovisitas";
	}
}
