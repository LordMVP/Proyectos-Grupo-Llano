package com.bioagricola.common.entity;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.bioagricola.common.constant.SchemaConstants;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Table(name = "barrios", catalog=SchemaConstants.PUBLIC, schema=SchemaConstants.PUBLIC)
@Getter @Setter @NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Barrios implements Serializable {

	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "barrio_ideregistro")
    private Long barrioIderegistro;					
	@Column(name = "barrio_cod")
	private String barrioCod;
	@Column(name = "barrio_nom")
	private String barrioNom;
	@Column(name = "barrio_codpro")
	private String barrioCodpro;	
	@Column(name = "barrio_swtter")
	private Boolean barrioSwtter;
	@Column(name = "barrio_llacom")
	private String barrioLlacom;
	@Column(name = "barrio_factor")
	private Long barrioFactor;
	@Column(name = "barrio_porins")
	private Long barrioPorins;
	@Column(name = "barrio_frerec")
	private String barrioFrerec;
	@Column(name = "barrio_horrec")
	private String barrioHorrec;
	@Column(name = "barrio_sectec")
	private Long barrioSectec;
	@Column(name="barrio_zona_riesgo")
	private Boolean barrioZonaRiesgo;
	
	@JoinColumn(name = "barrio_codemp",referencedColumnName = "empresa_cod",columnDefinition = "barrio_codemp")
	@ManyToOne
	private Empresas barrioCodemp;
	
	public Barrios(Long id){
		this.barrioIderegistro = id;
	}

	@Override
	public String toString() {
		// TODO Auto-generated method stub
		return "[Barrios: ]"+barrioIderegistro+" - "+barrioCod+" - "+
		barrioNom+" - "+barrioCodpro+" - "+barrioLlacom+" - "+barrioCodemp+" - "+barrioCodemp;
	}
	
	
	
}
