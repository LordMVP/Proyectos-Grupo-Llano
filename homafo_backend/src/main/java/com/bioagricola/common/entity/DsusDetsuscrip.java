package com.bioagricola.common.entity;

import com.bioagricola.common.constant.SchemaConstants;
import com.bioagricola.homologaciones.entity.SusSuscripcion;
import com.bioagricola.hya.dto.CosuConsuscripDTO;
import com.bioagricola.hya.dto.IasusInforadicionalsuscripcionDTO;
import com.bioagricola.hya.dto.RaprRutaAprovechamientoDTO;
import com.bioagricola.hya.dto.RrbaRutaRecoleccionBarridoDTO;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import uk.co.jemos.podam.annotations.PodamExclude;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "dsus_detsuscrip", catalog = SchemaConstants.PUBLIC, schema = SchemaConstants.PUBLIC)
@Getter
@Setter
@NoArgsConstructor
public class DsusDetsuscrip implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "dsus_ideregistr", nullable = false)
    private Long dsusIderegistr;
    @NotNull
    @Column(name = "dsus_estado", nullable = false, length = 1)
    private String dsusEstado;

    @NotNull
    @Column(name = "dsus_descripcion", nullable = false, length = 50)
    private String dsusDescripcion;

    @NotNull
    @Column(name = "dsus_pcodigo", nullable = false, length = 20)
    private String dsusPcodigo;

    @ManyToOne
    @JoinColumn(name = "sus_ideregistro", referencedColumnName = "sus_ideregistro", insertable = false, updatable = false)
    private SusSuscripcion susSuscripcion;

    @NotNull
    @Column(name = "sus_ideregistro", nullable = false)
    private Long susIderegistro;

    @NotNull
    @JoinColumn(name = "ter_ideregistro", nullable = false)
    @ManyToOne
    private TerTercero terIderegistro;

    @NotNull
    @Column(name = "pro_ideregistro", nullable = false)
    private Long proIderegistro;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @ManyToOne
    @JoinColumn(name = "pro_ideregistro", referencedColumnName = "pro_ideregistro", insertable = false, updatable = false)
    private ProPropiedad proPropiedad;

    @NotNull
    @Column(name = "uni_municipio", nullable = false)
    private Long uniMunicipio;

    @NotNull
    @Column(name = "est_tipsuscripc", nullable = false)
    private Long estTipsuscripc;

    @NotNull
    @Column(name = "uni_tipsuscripc", nullable = false)
    private Long uniTipsuscripc;

    @NotNull
    @Column(name = "est_tipusosuscr", nullable = false)
    private Integer estTipusosuscr;

    @NotNull
    @Column(name = "uni_tipusosuscr", nullable = false)
    private Long uniTipusosuscr;

    @NotNull
    @Column(name = "emp_ideregistro", nullable = false)
    private Integer empIderegistro;

    @NotNull
    @Column(name = "est_liquidacion", nullable = false)
    private Integer estLiquidacion;

    @NotNull
    @Column(name = "uni_liquidacion", nullable = false)
    private Long uniLiquidacion;

    @NotNull
    @Column(name = "cic_ideregistro", nullable = false)
    private Long cicIderegistro;

    @NotNull
    @Temporal(TemporalType.DATE)
    @Column(name = "dsus_fecinicio", nullable = false)
    private Date dsusFecinicio;

    @Temporal(TemporalType.DATE)
    @Column(name = "dsus_fecexpira")
    private Date dsusFecexpira;

    @NotNull
    @Column(name = "pro_catestrato", nullable = false)
    private Integer proCatestrato;

    @Temporal(TemporalType.DATE)
    @Column(name = "dsus_iniestado")
    private Date dsusIniestado;

    @Temporal(TemporalType.DATE)
    @Column(name = "dsus_finestado")
    private Date dsusFinestado;

    @NotNull
    @Column(name = "dsus_factor", nullable = false)
    private BigDecimal dsusFactor;

    @NotNull
    @Column(name = "usu_ideregistro", nullable = false)
    private Long usuIderegistro;

    @Column(name = "uni_actsuscripc")
    private Long uniActsuscripc;

    @Column(name = "dsus_resolestrato", length = 50)
    private String dsusResolestrato;

    @NotNull
    @Column(name = "dsus_fecact", nullable = false)
    private Timestamp dsusFecact;

    @JoinColumn(name = "uni_barrio", referencedColumnName = "barrio_ideregistro")
    @ManyToOne
    private Barrios uniBarrio;

    @JsonIgnore
    @OneToMany(mappedBy = "dsusDetsuscripFK")
    private List<Reclamos> reclamos;

    @Transient
    private String uniTipsuscripNombre;

    @Transient
    private String cicNombre;

    @Transient
    private String uniTipusosusNombre;

    @Transient
    private String uniLiquidacionNombre;

    @Transient
    private String uniActsuscripcNombre;

    @Transient
    private String proDireccion;

    @Transient
    private Long proSecuencia;

    @Transient
    private Integer perIderegistro;

    @Transient
    private IasusInforadicionalsuscripcionDTO inforadicionalsuscripcion;

    @Transient
    private RrbaRutaRecoleccionBarridoDTO rutaRecoleccionBarrido;

    @Transient
    private RaprRutaAprovechamientoDTO rutaAprovechamiento;

    @Transient
    private List<CosuConsuscripDTO> conceptos;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    @JoinColumn(name = "ter_ideregistro", referencedColumnName = "ter_ideregistro", insertable = false, updatable = false)
    @PodamExclude
    private TerTercero terTercerodsusDetsuscripTerIderegistroFkey;

    @Transient
    private List<Integer> empAlternasId;

}
