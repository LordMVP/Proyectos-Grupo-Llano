package com.bioagricola.apirest.modelo.entidades;


import javax.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;
import java.util.Objects;

/**
 * The persistent class for the CATEGORIES database table.
 */
@Entity
@Table(name = "drec_detrecaudo")
@NamedQuery(name = "DrecDetrecaudo.findAll", query = "SELECT p FROM DrecDetrecaudo p")
public class DrecDetrecaudo implements Serializable {

    private static final long serialVersionUID = 1L;

    //Definicion de atributos de la entidad (Exceptuando relaciones)
    public static final String ENTIDAD_DREC_DETRECAUDO_PK = "drecIderegistr";
    public static final String ENTIDAD_DREC_DETRECAUDO_REC_IDEREGISTRO = "recIderegistro";
    public static final String ENTIDAD_DREC_DETRECAUDO_DREC_VLRTOTAL = "drecVlrtotal";
    public static final String ENTIDAD_DREC_DETRECAUDO_DREC_VLRREAL = "drecVlrreal";
    public static final String ENTIDAD_DREC_DETRECAUDO_DREC_FECHA = "drecFecha";
    public static final String ENTIDAD_DREC_DETRECAUDO_DREC_IDEORIGEN = "drecIdeorigen";
    public static final String ENTIDAD_DREC_DETRECAUDO_FAC_IDEREGISTRO = "facIderegistro";
    public static final String ENTIDAD_DREC_DETRECAUDO_CIC_IDEREGISTRO = "cicIderegistro";
    public static final String ENTIDAD_DREC_DETRECAUDO_PER_IDEREGISTRO = "perIderegistro";
    public static final String ENTIDAD_DREC_DETRECAUDO_UNI_DOCUMENTO = "uniDocumento";
    public static final String ENTIDAD_DREC_DETRECAUDO_UNI_TIPDOCUMENT = "uniTipdocument";
    public static final String ENTIDAD_DREC_DETRECAUDO_DFAC_IDEREGISTR = "dfacIderegistr";
    public static final String ENTIDAD_DREC_DETRECAUDO_DIRE_IDEREGISTR = "direIderegistr";
    public static final String ENTIDAD_DREC_DETRECAUDO_DREC_IDEPADRE = "drecIdepadre";
    public static final String ENTIDAD_DREC_DETRECAUDO_CIC_ANO = "cicAno";
    public static final String ENTIDAD_DREC_DETRECAUDO_DCSG_IDEREGISTR = "dcsgIderegistr";
    public static final String ENTIDAD_DREC_DETRECAUDO_USU_IDEREGISTRO = "usuIderegistro";
    public static final String ENTIDAD_DREC_DETRECAUDO_DREC_VERSION = "drecVersion";
    public static final String ENTIDAD_DREC_DETRECAUDO_MVMC_IDEREGISTR = "mvmcIderegistr";
    public static final String ENTIDAD_DREC_DETRECAUDO_MVRE_IDEREGISTR = "mvreIderegistr";
    public static final String ENTIDAD_DREC_DETRECAUDO_MVCS_IDEREGISTR = "mvcsIderegistr";
    public static final String ENTIDAD_DREC_DETRECAUDO_MVI_IDEREGISTRO = "mviIderegistro";
    private static final String[] ATRIBUTOS_ENTIDAD_DREC_DETRECAUDO
            = {ENTIDAD_DREC_DETRECAUDO_CIC_IDEREGISTRO, ENTIDAD_DREC_DETRECAUDO_DREC_VLRTOTAL, ENTIDAD_DREC_DETRECAUDO_PER_IDEREGISTRO, ENTIDAD_DREC_DETRECAUDO_MVI_IDEREGISTRO, ENTIDAD_DREC_DETRECAUDO_UNI_DOCUMENTO, ENTIDAD_DREC_DETRECAUDO_DREC_IDEORIGEN, ENTIDAD_DREC_DETRECAUDO_DCSG_IDEREGISTR, ENTIDAD_DREC_DETRECAUDO_MVMC_IDEREGISTR, ENTIDAD_DREC_DETRECAUDO_DREC_VLRREAL, ENTIDAD_DREC_DETRECAUDO_DFAC_IDEREGISTR, ENTIDAD_DREC_DETRECAUDO_DREC_IDEPADRE, ENTIDAD_DREC_DETRECAUDO_USU_IDEREGISTRO, ENTIDAD_DREC_DETRECAUDO_DIRE_IDEREGISTR, ENTIDAD_DREC_DETRECAUDO_REC_IDEREGISTRO, ENTIDAD_DREC_DETRECAUDO_MVCS_IDEREGISTR, ENTIDAD_DREC_DETRECAUDO_DREC_FECHA, ENTIDAD_DREC_DETRECAUDO_MVRE_IDEREGISTR, ENTIDAD_DREC_DETRECAUDO_FAC_IDEREGISTRO, ENTIDAD_DREC_DETRECAUDO_CIC_ANO, ENTIDAD_DREC_DETRECAUDO_DREC_VERSION, ENTIDAD_DREC_DETRECAUDO_PK, ENTIDAD_DREC_DETRECAUDO_UNI_TIPDOCUMENT};

    @Id
    @Column(name = "drec_ideregistr")
    private Long drecIderegistr;

    @Column(name = "rec_ideregistro")
    private Long recIderegistro;

    @Column(name = "drec_vlrtotal")
    private BigDecimal drecVlrtotal;

    @Column(name = "drec_vlrreal")
    private BigDecimal drecVlrreal;

    @Column(name = "drec_fecha")
    @Temporal(javax.persistence.TemporalType.TIMESTAMP)
    private Date drecFecha;

    @Column(name = "drec_ideorigen")
    private Long drecIdeorigen;

    @Column(name = "fac_ideregistro")
    private Long facIderegistro;

    @Column(name = "cic_ideregistro")
    private Integer cicIderegistro;

    @Column(name = "per_ideregistro")
    private Integer perIderegistro;

    @Column(name = "uni_documento")
    private Integer uniDocumento;

    @Column(name = "uni_tipdocument")
    private Integer uniTipdocument;

    @Column(name = "dfac_ideregistr")
    private Long dfacIderegistr;

    @Column(name = "dire_ideregistr")
    private Long direIderegistr;

    @Column(name = "drec_idepadre")
    private Long drecIdepadre;

    @Column(name = "cic_ano")
    private Short cicAno;

    @Column(name = "dcsg_ideregistr")
    private Long dcsgIderegistr;

    @Column(name = "usu_ideregistro")
    private Integer usuIderegistro;

    @Column(name = "drec_version")
    private Long drecVersion;

    @Column(name = "mvmc_ideregistr")
    private Long mvmcIderegistr;

    @Column(name = "mvre_ideregistr")
    private Long mvreIderegistr;

    @Column(name = "mvcs_ideregistr")
    private Long mvcsIderegistr;

    @Column(name = "mvi_ideregistro")
    private Long mviIderegistro;


    // protected region atributos adicionales on begin
    // Escriba en esta sección sus modificaciones

    // protected region atributos adicionales end

    public DrecDetrecaudo() {
        // protected region procedimientos adicionales de inicialización on begin
        // Escriba en esta sección sus modificaciones

        // protected region procedimientos adicionales de inicialización end
    }


    public Long getDrecIderegistr() {
        return this.drecIderegistr;
    }

    public void setDrecIderegistr(Long drecIderegistr) {

        this.drecIderegistr = drecIderegistr;
    }

    public Long getRecIderegistro() {
        return this.recIderegistro;
    }

    public void setRecIderegistro(Long recIderegistro) {

        this.recIderegistro = recIderegistro;
    }

    public BigDecimal getDrecVlrtotal() {
        return this.drecVlrtotal;
    }

    public void setDrecVlrtotal(BigDecimal drecVlrtotal) {

        this.drecVlrtotal = drecVlrtotal;
    }

    public BigDecimal getDrecVlrreal() {
        return this.drecVlrreal;
    }

    public void setDrecVlrreal(BigDecimal drecVlrreal) {

        this.drecVlrreal = drecVlrreal;
    }

    public Date getDrecFecha() {
        return this.drecFecha;
    }

    public void setDrecFecha(Date drecFecha) {

        this.drecFecha = drecFecha;
    }

    public Long getDrecIdeorigen() {
        return this.drecIdeorigen;
    }

    public void setDrecIdeorigen(Long drecIdeorigen) {

        this.drecIdeorigen = drecIdeorigen;
    }

    public Long getFacIderegistro() {
        return this.facIderegistro;
    }

    public void setFacIderegistro(Long facIderegistro) {

        this.facIderegistro = facIderegistro;
    }

    public Integer getCicIderegistro() {
        return this.cicIderegistro;
    }

    public void setCicIderegistro(Integer cicIderegistro) {

        this.cicIderegistro = cicIderegistro;
    }

    public Integer getPerIderegistro() {
        return this.perIderegistro;
    }

    public void setPerIderegistro(Integer perIderegistro) {

        this.perIderegistro = perIderegistro;
    }

    public Integer getUniDocumento() {
        return this.uniDocumento;
    }

    public void setUniDocumento(Integer uniDocumento) {

        this.uniDocumento = uniDocumento;
    }

    public Integer getUniTipdocument() {
        return this.uniTipdocument;
    }

    public void setUniTipdocument(Integer uniTipdocument) {

        this.uniTipdocument = uniTipdocument;
    }

    public Long getDfacIderegistr() {
        return this.dfacIderegistr;
    }

    public void setDfacIderegistr(Long dfacIderegistr) {

        this.dfacIderegistr = dfacIderegistr;
    }

    public Long getDireIderegistr() {
        return this.direIderegistr;
    }

    public void setDireIderegistr(Long direIderegistr) {

        this.direIderegistr = direIderegistr;
    }

    public Long getDrecIdepadre() {
        return this.drecIdepadre;
    }

    public void setDrecIdepadre(Long drecIdepadre) {

        this.drecIdepadre = drecIdepadre;
    }

    public Short getCicAno() {
        return this.cicAno;
    }

    public void setCicAno(Short cicAno) {

        this.cicAno = cicAno;
    }

    public Long getDcsgIderegistr() {
        return this.dcsgIderegistr;
    }

    public void setDcsgIderegistr(Long dcsgIderegistr) {

        this.dcsgIderegistr = dcsgIderegistr;
    }

    public Integer getUsuIderegistro() {
        return this.usuIderegistro;
    }

    public void setUsuIderegistro(Integer usuIderegistro) {

        this.usuIderegistro = usuIderegistro;
    }

    public Long getDrecVersion() {
        return this.drecVersion;
    }

    public void setDrecVersion(Long drecVersion) {

        this.drecVersion = drecVersion;
    }

    public Long getMvmcIderegistr() {
        return this.mvmcIderegistr;
    }

    public void setMvmcIderegistr(Long mvmcIderegistr) {

        this.mvmcIderegistr = mvmcIderegistr;
    }

    public Long getMvreIderegistr() {
        return this.mvreIderegistr;
    }

    public void setMvreIderegistr(Long mvreIderegistr) {

        this.mvreIderegistr = mvreIderegistr;
    }

    public Long getMvcsIderegistr() {
        return this.mvcsIderegistr;
    }

    public void setMvcsIderegistr(Long mvcsIderegistr) {

        this.mvcsIderegistr = mvcsIderegistr;
    }

    public Long getMviIderegistro() {
        return this.mviIderegistro;
    }

    public void setMviIderegistro(Long mviIderegistro) {

        this.mviIderegistro = mviIderegistro;
    }


    /**
     * Verifica si la entidad contiene el atributo que se pasa como parámetro
     *
     * @param atributo Nombre del atributo a validar
     * @return Verdadero si la entidad contiene al atributo.
     */
    public static boolean contieneAtributo(String atributo) {

        boolean contiene = false;
        for (final String atr : ATRIBUTOS_ENTIDAD_DREC_DETRECAUDO) {
            if (atr.equals(atributo)) {
                contiene = true;
            }
        }

        return contiene;
    }

    public static String[] getAtributosEntidadDrecDetrecaudo() {
        return ATRIBUTOS_ENTIDAD_DREC_DETRECAUDO;
    }

    /**
     * {@inheritDoc}
     *
     * @return {@inheritDoc}
     */
    @Override
    public int hashCode() {
        int hash = 3;

        hash = 37 * hash + Objects.hashCode(this.drecIderegistr);
        hash = 37 * hash + Objects.hashCode(this.recIderegistro);
        hash = 37 * hash + Objects.hashCode(this.drecVlrtotal);
        hash = 37 * hash + Objects.hashCode(this.drecVlrreal);
        hash = 37 * hash + Objects.hashCode(this.drecFecha);
        hash = 37 * hash + Objects.hashCode(this.drecIdeorigen);
        hash = 37 * hash + Objects.hashCode(this.facIderegistro);
        hash = 37 * hash + Objects.hashCode(this.cicIderegistro);
        hash = 37 * hash + Objects.hashCode(this.perIderegistro);
        hash = 37 * hash + Objects.hashCode(this.uniDocumento);
        hash = 37 * hash + Objects.hashCode(this.uniTipdocument);
        hash = 37 * hash + Objects.hashCode(this.dfacIderegistr);
        hash = 37 * hash + Objects.hashCode(this.direIderegistr);
        hash = 37 * hash + Objects.hashCode(this.drecIdepadre);
        hash = 37 * hash + Objects.hashCode(this.cicAno);
        hash = 37 * hash + Objects.hashCode(this.dcsgIderegistr);
        hash = 37 * hash + Objects.hashCode(this.usuIderegistro);
        hash = 37 * hash + Objects.hashCode(this.drecVersion);
        hash = 37 * hash + Objects.hashCode(this.mvmcIderegistr);
        hash = 37 * hash + Objects.hashCode(this.mvreIderegistr);
        hash = 37 * hash + Objects.hashCode(this.mvcsIderegistr);
        hash = 37 * hash + Objects.hashCode(this.mviIderegistro);

        return hash;
    }

    /**
     * Valida la igualdad de la instancia de la entidad DrecDetrecaudo que se pasa
     * como parámetro comprobando que comparten los mismos valores en cada uno
     * de sus atributos. Solo se tienen en cuenta los atributos simples, es
     * decir, se omiten aquellos que definen una relación con otra tabla.
     *
     * @param obj Instancia de la categoría a comprobar
     *            iguales.
     * @return Verdadero si esta instancia y la que se pasan como parámetros son
     */
    @Override
    public boolean equals(Object obj) {
        if (obj == null) {
            return false;
        }
        if (getClass() != obj.getClass()) {
            return false;
        }
        final DrecDetrecaudo other = (DrecDetrecaudo) obj;

        if (!Objects.equals(this.drecIderegistr, other.drecIderegistr)) {
            return false;
        }

        if (!Objects.equals(this.recIderegistro, other.recIderegistro)) {
            return false;
        }

        if (!Objects.equals(this.drecVlrtotal, other.drecVlrtotal)) {
            return false;
        }

        if (!Objects.equals(this.drecVlrreal, other.drecVlrreal)) {
            return false;
        }

        if (!Objects.equals(this.drecFecha, other.drecFecha)) {
            return false;
        }

        if (!Objects.equals(this.drecIdeorigen, other.drecIdeorigen)) {
            return false;
        }

        if (!Objects.equals(this.facIderegistro, other.facIderegistro)) {
            return false;
        }

        if (!Objects.equals(this.cicIderegistro, other.cicIderegistro)) {
            return false;
        }

        if (!Objects.equals(this.perIderegistro, other.perIderegistro)) {
            return false;
        }

        if (!Objects.equals(this.uniDocumento, other.uniDocumento)) {
            return false;
        }

        if (!Objects.equals(this.uniTipdocument, other.uniTipdocument)) {
            return false;
        }

        if (!Objects.equals(this.dfacIderegistr, other.dfacIderegistr)) {
            return false;
        }

        if (!Objects.equals(this.direIderegistr, other.direIderegistr)) {
            return false;
        }

        if (!Objects.equals(this.drecIdepadre, other.drecIdepadre)) {
            return false;
        }

        if (!Objects.equals(this.cicAno, other.cicAno)) {
            return false;
        }

        if (!Objects.equals(this.dcsgIderegistr, other.dcsgIderegistr)) {
            return false;
        }

        if (!Objects.equals(this.usuIderegistro, other.usuIderegistro)) {
            return false;
        }

        if (!Objects.equals(this.drecVersion, other.drecVersion)) {
            return false;
        }

        if (!Objects.equals(this.mvmcIderegistr, other.mvmcIderegistr)) {
            return false;
        }

        if (!Objects.equals(this.mvreIderegistr, other.mvreIderegistr)) {
            return false;
        }

        if (!Objects.equals(this.mvcsIderegistr, other.mvcsIderegistr)) {
            return false;
        }

        return Objects.equals(this.mviIderegistro, other.mviIderegistro);

    }

    // protected region metodos adicionales on begin
    // Escriba en esta sección sus modificaciones

    // protected region metodos adicionales end

} 

