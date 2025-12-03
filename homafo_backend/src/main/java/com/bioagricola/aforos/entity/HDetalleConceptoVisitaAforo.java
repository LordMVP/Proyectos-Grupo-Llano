package com.bioagricola.aforos.entity;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import com.bioagricola.common.constant.SchemaConstants;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "hdcva_historicodetalleconceptovisitasaforo", catalog=SchemaConstants.ASEO, schema=SchemaConstants.ASEO)
@Getter @Setter @NoArgsConstructor
public class HDetalleConceptoVisitaAforo {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "hdcva_ideregistro")
	private Long hdcvaIderegistro;

	@Column(name = "hdmaf_ideregistro")
	private Long hdmafIderegistro;

	@Column(name = "uni_concepto")
	private Long uniConcepto;

	@Column(name = "hdcva_cantidadconcepto")
	private Long hdcvaCantidadconcepto;

	@Column(name = "hdcva_volumenaforo")
	private Double hdcvaVolumenaforo;

	@Column(name = "hdcva_fecharegistro")
	private Date hdcvaFecharegistro;

	@Column(name = "hdcva_fechaactualiza")
	private Date hdcvaFechaactualiza;

	@Column(name = "hdcva_observaciones")
	private String hdcvaObservaciones;

	@Column(name = "usu_ideregistro")
	private Long usuIderegistro;

	@Column(name = "hdcva_pesoaforo")
	private Double hdcvaPesoaforo;
}
