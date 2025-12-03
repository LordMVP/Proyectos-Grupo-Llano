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
public class HDetalleMaestroVisita implements BaseEntity{

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "hdmaf_ideregistro")
	private Long hdmafIderegistro;
	
	@Column(name = "hdmav_consecutivovisita")
	private Long hdmavConsecutivovisita;
	
	@Column(name = "hdmaf_fechavisita")
	private Date hdmafFechavisita;
	
	@Column(name = "ter_aforador")
	private Long terAforador;
	
	@Column(name = "hdmaf_pesoaforo")
	private Double hdmafPesoaforo;
	
	@Column(name = "hdmaf_estado")
	private String hdmafEstado;
	
	@Column(name = "hdmaf_fecharegistro")
	private Date hdmafFecharegistro;
	
	@Column(name = "hdmaf_semanasecuencia")
	private Long hdmafSemanasecuencia;
	
	@Column(name = "hdmaf_observaciones")
	private String hdmafObservaciones;
	
	@Column(name = "usu_ideregistro")
	private Long usuIderegistro;
	
	@ManyToOne
	@JoinColumn(name = "hmafv_ideregistro")
	@JsonBackReference
	private HMaestroAforoVisita hmaestroAforoVista;

	@Override
	public String getNombreTabla() {
		return "hdmaf_detallemaestrovisitas";
	}
}
