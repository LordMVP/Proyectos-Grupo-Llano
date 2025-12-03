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
@Table(name = "tpmaf_temprocesomaestroaforos", catalog=SchemaConstants.ASEO, schema=SchemaConstants.ASEO)
@Getter @Setter @NoArgsConstructor
public class TemProcesoMaestroAforo implements BaseEntity{

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "tpmaf_ideregistro")
	private Long tpmafIderegistro;
	@Column(name = "per_ideregistro")
	private Long perIderegistro;
	@Column(name = "cic_ideregistro")
	private Long cicIderegistro;
	@Column(name = "hmaf_fechainicio")
	private Date hmafFechainicio;
	@Column(name = "hmaf_fechafinalizacion")
	private Date hmafFechafinalizacion;
	@Column(name = "mhac_estado")
	private String mhacEstado;
	@Column(name = "hmaf_fecharegistro")
	private Date hmafFecharegistro;
	@Column(name = "uni_tipogenerador")
	private Long uniTipogenerador;
	@Column(name = "mafv_factor")
	private String mafvFactor;
	@Column(name = "usu_ideregistro")
	private Long usuIderegistro;
	@Column(name = "ter_aforador")
	private Long terAforador;
	@Column(name = "mnaf_tafna")
	private String mnafTafna;
	@Column(name = "mnaf_trna")
	private String mnafTrna;
	@Column(name = "mnaf_peso")
	private String mnafPeso;
	
	@ManyToOne
	@JoinColumn(name = "afo_ideregistro")
	@JsonBackReference
	private Aforo aforo;
	@ManyToOne
	@JoinColumn(name = "mafv_ideregistro")
	@JsonBackReference
	private MaestroAforoVisita maestroAforoVisita;
	
	@Override
	public String getNombreTabla() {
		return "tpmaf_temprocesomaestroaforos";
	}
	
}
