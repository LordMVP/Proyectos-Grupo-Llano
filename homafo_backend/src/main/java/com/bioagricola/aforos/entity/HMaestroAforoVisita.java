package com.bioagricola.aforos.entity;

import java.util.Date;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.bioagricola.aforos.entity.base.BaseEntity;
import com.bioagricola.common.constant.SchemaConstants;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "hmafv_maestroaforovisitas", catalog=SchemaConstants.ASEO, schema=SchemaConstants.ASEO)
@Getter @Setter @NoArgsConstructor
public class HMaestroAforoVisita implements BaseEntity{

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "hmafv_ideregistro")
	private Long hmafvIderegistro;
	@Column(name = "hmafv_inicio")
	private Date hmafvInicio;
	@Column(name = "hmafv_fin")
	private Date hmafvFin;
	@Column(name = "hmafv_estado")
	private String hmafvEstado;
	@Column(name = "hmafv_fecharegistro")
	private Date hmafvFecharegistro;
	@Column(name = "hmafv_fechaactualizacion")
	private Date hmafvFechaactualizacion;
	@Column(name = "per_ideregistro")
	private Long perIderegistro;
	@Column(name = "cic_ciclo")
	private Long cicCiclo;
	@Column(name = "uni_tipogenerador")
	private Long uniTipogenerador;
	@Column(name = "hmafv_factor")
	private String hmafvFactor;
	@Column(name = "usu_ideregistro")
	private Long usuIderegistro;
	@Column(name = "per_ideregistrofin")
	private Long perIderegistrofin;
	
	@OneToMany(mappedBy = "hmaestroAforoVista",fetch = FetchType.LAZY)	
	private List<HDetalleMaestroVisita> hdetallesMaestrosVisitas;
	
	@Column(name = "afo_ideregistro")
	private Long afoIderegistro;
	
	@Override
	public String getNombreTabla() {
		return "hmafv_maestroaforovisitas";
	}
}
