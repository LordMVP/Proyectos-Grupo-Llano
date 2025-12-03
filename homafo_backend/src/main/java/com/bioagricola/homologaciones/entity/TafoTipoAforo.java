package com.bioagricola.homologaciones.entity;

import java.util.Date;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.MapsId;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.persistence.Table;

import org.hibernate.annotations.DynamicUpdate;

import com.bioagricola.common.constant.SchemaConstants;
import com.bioagricola.common.entity.UniUnidad;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "tafo_tipo_aforo", catalog=SchemaConstants.ASEO, schema=SchemaConstants.ASEO)
@Getter @Setter @NoArgsConstructor
@DynamicUpdate
public class TafoTipoAforo {

	@Id
	@Column(name="tafo_ideregistro")
	private Long tafoIderegistro;

	@Column(name="tafo_vigencia")
	private Integer tafoVigencia;

	@Column(name="tafo_plazo_maximo")
	private Integer tafoPlazoMaximo;

	@Column(name="tafo_holgura")
	private Integer tafoHolgura;

	@Column(name="tafo_factor_produccion")
	private Float tafoFactorProduccion;

	@Column(name="usu_ideregistro")
	private Integer usuIderegistro;

	@Column(name="date_created")
	private Date dateCreated ;

	@OneToOne(cascade = {CascadeType.PERSIST,CascadeType.MERGE})
	@JoinColumn(name="uni_claseaforo",referencedColumnName = "uni_ideregistro")
	private UniUnidad uniClaseAforo;

	@MapsId
	@OneToOne(cascade = {CascadeType.PERSIST,CascadeType.MERGE})
	@JoinColumn(name = "tafo_ideregistro",referencedColumnName = "uniIderegistro",insertable = false,updatable = false)
	private UniUnidad unidad;

	@OneToMany(cascade = {CascadeType.PERSIST,CascadeType.MERGE,CascadeType.REMOVE},mappedBy = "tafoIderegistro",orphanRemoval = true)
	private Set<DtafoDetaTipoAforo> detalles;

	@PrePersist
	@PreUpdate
	public void settingUser() {
		if(this.getUnidad().getUsuIderegistro()==null) {
			this.getUnidad().setUsuIderegistro(this.getUsuIderegistro());
		}
		this.getDetalles().stream().forEach((detalle)->detalle.setUsuIderegistro(this.getUsuIderegistro()));
	}

	@Column(name = "tafo_aforo_padre")
	private Boolean tafoAforoPadre;
}
