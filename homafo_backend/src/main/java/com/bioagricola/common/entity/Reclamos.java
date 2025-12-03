package com.bioagricola.common.entity;

import java.util.Date;

import javax.persistence.*;

import com.bioagricola.common.constant.SchemaConstants;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "reclamos", catalog = SchemaConstants.PUBLIC, schema = SchemaConstants.PUBLIC)
@Getter
@Setter
@NoArgsConstructor
public class Reclamos {

	@Id
	@Column(name = "reclamo_numpqr")
	private String reclamoNumpqr;

	@Column(name = "reclamo_tipsol")
	private String reclamoTipsol;

	@Column(name = "reclamo_nomsol")
	private String reclamoNomsol;

	@Column(name = "reclamo_idsol")
	private String reclamoIdsol;

	@Column(name = "reclamo_codsus")
	private String reclamoCodsus;

	@Column(name = "reclamo_telsol")
	private String reclamoTelsol;

	@Column(name = "reclamo_celsol")
	private String reclamoCelsol;

	@Column(name = "reclamo_email")
	private String reclamoEmail;

	@Column(name = "reclamo_codsec")
	private String reclamoCodsec;

	@Column(name = "reclamo_est")
	private String reclamoEst;

	@Column(name = "reclamo_codemp")
	private String reclamoCodemp;

	@Column(name = "reclamo_tipate")
	private String reclamoTipate;

	@Column(name = "reclamo_tipnot")
	private String reclamoTipnot;

	@Column(name = "reclamo_codrec")
	private String reclamoCodrec;

	@Column(name = "reclamo_codage")
	private String reclamoCodage;

	@Column(name = "reclamo_codpro")
	private String reclamoCodpro;

	@Column(name = "reclamo_codbar")
	private String reclamoCodbar;

	@Column(name = "reclamo_tiprep")
	private String reclamoTiprep;

	@Column(name = "reclamo_dir")
	private String reclamoDir;

	@Column(name = "reclamo_deprep")
	private String reclamoDeprep;

	@Column(name = "reclamo_usugra")
	private String reclamoUsugra;

	@Column(name = "reclamo_sus")
	private String reclamoSus;

	@Column(name = "reclamo_empcon")
	private String reclamoEmpcon;

	@Column(name = "reclamo_nombar")
	private String reclamoNombar;

	@Column(name = "reclamo_swtcamvlr")
	private String reclamoSwtcamvlr;

	@Column(name = "reclamo_pqrdep")
	private String reclamoPqrdep;

	@Column(name = "reclamo_camvlr")
	private String reclamoCamvlr;

	@Column(name = "reclamo_horsol")
	private String reclamoHorsol;

	@Column(name = "reclamo_fue")
	private String reclamoFue;

	@Column(name = "reclamo_det")
	private String reclamoDet;

	@Column(name = "reclamo_esteme")
	private String reclamoEsteme;

	@Column(name = "reclamo_radprev")
	private String reclamoRadprev;

	@Column(name = "reclamo_llacom")
	private String reclamoLlacom;

	@Column(name = "reclamo_numfac")
	private String reclamoNumfac;

	@Column(name = "reclamo_dirnot")
	private String reclamoDirnot;

	@Column(name = "reclamo_barnot")
	private String reclamoBarnot;

	@Column(name = "reclamo_cornot")
	private String reclamoCornot;

	@Column(name = "reclamo_telnot")
	private String reclamoTelnot;

	@Column(name = "reclamo_nompet")
	private String reclamoNompet;

	@Column(name = "reclamo_clasol")
	private String reclamoClasol;

	@Column(name = "reclamo_usuact")
	private String reclamoUsuact;

	@Column(name = "reclamo_nomter")
	private String reclamoNomter;

	@Column(name = "reclamo_cedter")
	private String reclamoCedter;

	@Column(name = "reclamo_telter")
	private String reclamoTelter;

	@Column(name = "reclamo_corter")
	private String reclamoCorter;

	@Column(name = "reclamo_medserfigas")
	private String reclamoMedserfigas;

	@Column(name = "reclamo_fecgra")
	private Date reclamoFecgra;

	@Column(name = "reclamo_fecact")
	private Date reclamoFecact;

	@Column(name = "reclamo_obssol")
	private String reclamoObssol;

	@Column(name = "reclamo_numane")
	private Double reclamoNumane;

	@Column(name = "ven_ideregistro")
	private Double venIderegistro;

	@Column(name = "reclamo_swtcontactos")
	private Long reclamoSwtcontactos;

	@Column(name = "reclamo_fecsol")
	private Date reclamoFecsol;

	@Column(name = "reclamo_fecamp")
	private Date reclamoFecamp;

	@Column(name = "reclamo_feclis")
	private Date reclamoFeclis;

	@Column(name = "reclamo_swteme")
	private Boolean reclamoSwteme;

	@Column(name = "reclamo_swtpro")
	private Boolean reclamoSwtpro;

	@Column(name = "reclamo_swtdes")
	private Boolean reclamoSwtdes;

	@Column(name = "reclamo_swtema")
	private Boolean reclamoSwtema;

	@Column(name = "reclamo_swtrepsui")
	private Boolean reclamoSwtrepsui;

	@ManyToOne
	@JoinColumn(name = "reclamo_codsus", referencedColumnName = "dsus_pcodigo", insertable = false, updatable = false)
	private DsusDetsuscrip dsusDetsuscripFK;

}
