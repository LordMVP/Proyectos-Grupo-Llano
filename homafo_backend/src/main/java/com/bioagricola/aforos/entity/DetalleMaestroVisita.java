package com.bioagricola.aforos.entity;


import java.util.Date;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import com.bioagricola.aforos.entity.base.BaseEntity;
import com.bioagricola.common.constant.SchemaConstants;
import com.bioagricola.common.entity.TerTercero;
import com.fasterxml.jackson.annotation.JsonBackReference;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "dmaf_detallemaestrovisitas", catalog = SchemaConstants.ASEO, schema = SchemaConstants.ASEO)
@Getter
@Setter
@NoArgsConstructor
public class DetalleMaestroVisita implements BaseEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "dmaf_ideregistro", nullable = false)
	private Long dmafIderegistro;


	@NotNull
	@Column(name = "dmav_consecutivovisita", nullable = false)
	private Long dmavConsecutivovisita;

	@NotNull
	@Column(name = "dmaf_fechavisita", nullable = false)
	private Date dmafFechavisita;

	@NotNull
	@JoinColumn(name = "ter_aforador", nullable = false)
	@ManyToOne
	private TerTercero terAforador;

	@Column(name = "dmaf_pesoaforo")
	private Double dmafPesoaforo;

	@Column(name = "dmaf_estado", length = 2)
	private String dmafEstado;

	@Column(name = "dmaf_fecharegistro")
	private Date dmafFecharegistro;

	@Column(name = "dmaf_semanasecuencia")
	private Long dmafSemanasecuencia;

	@Column(name = "dmaf_observaciones", length = 150)
	private String dmafObservaciones;

	@NotNull
	@Column(name = "usu_ideregistro", nullable = false)
	private Long usuIderegistro;

	@ManyToOne
	@JoinColumn(name = "mafv_ideregistro")
	@JsonBackReference
	private MaestroAforoVisita maestroAforoVista;

	@OneToMany(cascade = CascadeType.ALL, mappedBy = "dmafIderegistro", orphanRemoval = true)
	private List<DetalleConceptoVisitaAforo> detalleConceptosList;

	@Override
	public String getNombreTabla() {
		return "dmaf_detallemaestrovisitas";
	}
}
