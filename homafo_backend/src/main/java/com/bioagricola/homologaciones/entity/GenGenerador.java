package com.bioagricola.homologaciones.entity;

import java.sql.Timestamp;
import java.util.Date;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.MapsId;
import javax.persistence.OneToOne;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.Fetch;
import org.springframework.format.annotation.DateTimeFormat;

import com.bioagricola.common.constant.SchemaConstants;
import com.bioagricola.common.entity.UniUnidad;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;



@Entity
@Table(name = "gen_generador", catalog=SchemaConstants.ASEO, schema=SchemaConstants.ASEO)
@Getter @Setter @NoArgsConstructor
@DynamicUpdate
public class GenGenerador {

	@Id
	@Column(name = "gen_ideregistro")
	private Long genIderegistro;
	@JoinColumn(name="uni_tipouso")
	@ManyToOne
	private UniUnidad uniTipouso;
	@Column(name = "gen_desde")
	private Double genDesde;
	@Column(name = "gen_hasta")
	private Double genHasta;

	@Column(name = "gen_factor_equivalencia")
	private Double genFactorEquivalencia;

	@MapsId
	@OneToOne(cascade = {CascadeType.PERSIST,CascadeType.MERGE})
	@JoinColumn(name = "gen_ideregistro",referencedColumnName = "uniIderegistro",insertable = false,updatable = false)
	private UniUnidad unidad;

	@Column(name = "usu_ideregistro")
	private Integer usuIderegistro;
	
	@Column(name="date_created")
	@Temporal(TemporalType.TIMESTAMP)
	private Date fechaGenerador;

	@Column(name="gen_vol_desde")
	private Double genVolumenDesde;

	@Column(name="gen_vol_hasta")
	private Double genVolumenHasta;

	@OneToOne(cascade = {CascadeType.PERSIST,CascadeType.MERGE})
	@JoinColumn(name="uni_claseaforo",referencedColumnName = "uni_ideregistro")
	private UniUnidad uniClaseAforo;

	@PrePersist
	@PreUpdate
	public void settingUser() {
		System.out.println("Pre changes" + this.getUsuIderegistro());
		if(this.getUnidad().getUsuIderegistro()==null) {
			this.getUnidad().setUsuIderegistro(this.getUsuIderegistro());
		}
		//this.getDetalles().stream().forEach((detalle)->detalle.setUsuIderegistro(this.getUsuIderegistro()));
	}
	
}
