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
@Table(name = "hmafv_maestroaforovisitas", catalog=SchemaConstants.ASEO, schema=SchemaConstants.ASEO)
@Getter @Setter @NoArgsConstructor
public class HistoricoMaestroAforoVisita implements BaseEntity{

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "hmafv_ideregistro")
	private Long hmafvIderegistro;
	@Column(name = "mafv_inicio")
	private Date mafvInicio;
	@Column(name = "mafv_fin")
	private Date mafvFin;
	@Column(name = "mafv_estado")
	private String mafvEstado;
	@Column(name = "mafv_fecharegistro")
	private Date mafvFecharegistro;
	@Column(name = "mafv_fechaactualizacion")
	private Date mafvFechaactualizacion;
	@Column(name = "per_ideregistro")
	private Long perIderegistro;
	@Column(name = "cic_ciclo")
	private String cicCiclo;
	@Column(name = "uni_tipogenerador")
	private Long uniTipogenerador;
	@Column(name = "mafv_factor")
	private String mafvFactor;
	@Column(name = "usu_ideregistro")
	private Long usuIderegistro;
	
	@ManyToOne
	@JoinColumn(name = "afo_ideregistro")
	@JsonBackReference
	private Aforo aforo;
	
	@Override
	public String getNombreTabla() {
		return "hmafv_maestroaforovisitas";
	}
}
