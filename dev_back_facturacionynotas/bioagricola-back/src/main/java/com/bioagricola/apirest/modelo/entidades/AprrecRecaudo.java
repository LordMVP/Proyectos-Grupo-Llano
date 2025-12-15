package com.bioagricola.apirest.modelo.entidades;

import javax.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.sql.Timestamp;

@Entity
@Table(name="aprrec_recaudo", schema="aseo")
public class AprrecRecaudo implements Serializable {

    @Id
    @Column(name = "aprfac_ideregistro")
    private Long aprfacIderegistro;

    @Column(name = "aprcon_tipo")
    private Integer aprconTipo;

    @Column(name = "ter_ideregistro")
    private Long terIderegistro;

    @Column(name = "per_facturacion")
    private Integer perFacturacion;

    @Column(name = "per_prestacion")
    private Integer perPrestacion;

    @Column(name = "ta_valor")
    private BigDecimal taValor;

    @Column(name = "ta_porcentaje")
    private BigDecimal taPorcentaje;

    @Column(name = "cc_valor")
    private BigDecimal ccValor;

    @Column(name = "cc_porcentaje")
    private BigDecimal ccPorcentaje;

    @Column(name = "tadinc_valor")
    private BigDecimal tadincValor;

    @Column(name = "tadinc_porcentaje")
    private BigDecimal tadincPorcentaje;

    @Column(name = "taajuste_valor")
    private BigDecimal taajusteValor;

    @Column(name = "taajuste_porcentaje")
    private BigDecimal taajustePorcentaje;

    @Column(name = "ccajuste_valor")
    private BigDecimal ccajusteValor;

    @Column(name = "ccajuste_porcentaje")
    private BigDecimal ccajustePorcentaje;

    @Column(name = "tadincajuste_valor")
    private BigDecimal tadincajusteValor;

    @Column(name = "tadincajuste_porcentaje")
    private BigDecimal tadincajustePorcentaje;

    @Column(name = "iat_valor")
    private BigDecimal iatValor;

    @Column(name = "iat_porcentaje")
    private BigDecimal iatPorcentaje;

    @Column(name = "iatajuste_valor")
    private BigDecimal iatajusteValor;

    @Column(name = "iatajuste_porcentaje")
    private BigDecimal iatajustePorcentaje;

    @Column(name = "aud_fecha")
    private Timestamp audFecha;

    @Column(name = "varper_ide")
    private Long varperIde;

    @Column(name = "per_ideregistro")
    private Long perIderegistro;

    @Column(name = "usu_ideregistro")
    private Integer usuIderegistro;

    @Column(name = "aprcon_estado")
    private String aprconEstado;

    @Column(name = "taaforado_valor")
    private BigDecimal taaforadoValor;

    @Column(name = "ccfin_valor")
    private BigDecimal ccfinValor;

    @Column(name = "tafin_valor")
    private BigDecimal tafinValor;

    @Column(name = "tamora_valor")
    private BigDecimal tamoraValor;

    @Column(name = "iatmora_valor")
    private BigDecimal iatmoraValor;

    @Column(name = "taintcorriente_valor")
    private BigDecimal taintcorrienteValor;

    @Column(name = "iatintcorriente_valor")
    private BigDecimal iatintcorrienteValor;

    @Column(name = "perprestacion_ajustado")
    private Long perprestacionAjustado;

    @Column(name = "aprcons_fecha")
    private Timestamp aprconsFecha;

    @Column(name = "aprcons_ideregistr")
    private Long aprconsIderegistr;

    @Column(name = "maprc_ideregistr")
    private Long maprcIderegistr;

    @Column(name = "emp_ideregistro")
    private Integer empIderegistro;


    public Long getAprfacIderegistro() {
        return aprfacIderegistro;
    }

    public void setAprfacIderegistro(Long aprfacIderegistro) {
        this.aprfacIderegistro = aprfacIderegistro;
    }

    public Integer getAprconTipo() {
        return aprconTipo;
    }

    public void setAprconTipo(Integer aprconTipo) {
        this.aprconTipo = aprconTipo;
    }

    public Long getTerIderegistro() {
        return terIderegistro;
    }

    public void setTerIderegistro(Long terIderegistro) {
        this.terIderegistro = terIderegistro;
    }

    public Integer getPerFacturacion() {
        return perFacturacion;
    }

    public void setPerFacturacion(Integer perFacturacion) {
        this.perFacturacion = perFacturacion;
    }

    public Integer getPerPrestacion() {
        return perPrestacion;
    }

    public void setPerPrestacion(Integer perPrestacion) {
        this.perPrestacion = perPrestacion;
    }

    public BigDecimal getTaValor() {
        return taValor;
    }

    public void setTaValor(BigDecimal taValor) {
        this.taValor = taValor;
    }

    public BigDecimal getTaPorcentaje() {
        return taPorcentaje;
    }

    public void setTaPorcentaje(BigDecimal taPorcentaje) {
        this.taPorcentaje = taPorcentaje;
    }

    public BigDecimal getCcValor() {
        return ccValor;
    }

    public void setCcValor(BigDecimal ccValor) {
        this.ccValor = ccValor;
    }

    public BigDecimal getCcPorcentaje() {
        return ccPorcentaje;
    }

    public void setCcPorcentaje(BigDecimal ccPorcentaje) {
        this.ccPorcentaje = ccPorcentaje;
    }

    public BigDecimal getTadincValor() {
        return tadincValor;
    }

    public void setTadincValor(BigDecimal tadincValor) {
        this.tadincValor = tadincValor;
    }

    public BigDecimal getTadincPorcentaje() {
        return tadincPorcentaje;
    }

    public void setTadincPorcentaje(BigDecimal tadincPorcentaje) {
        this.tadincPorcentaje = tadincPorcentaje;
    }

    public BigDecimal getTaajusteValor() {
        return taajusteValor;
    }

    public void setTaajusteValor(BigDecimal taajusteValor) {
        this.taajusteValor = taajusteValor;
    }

    public BigDecimal getTaajustePorcentaje() {
        return taajustePorcentaje;
    }

    public void setTaajustePorcentaje(BigDecimal taajustePorcentaje) {
        this.taajustePorcentaje = taajustePorcentaje;
    }

    public BigDecimal getCcajusteValor() {
        return ccajusteValor;
    }

    public void setCcajusteValor(BigDecimal ccajusteValor) {
        this.ccajusteValor = ccajusteValor;
    }

    public BigDecimal getCcajustePorcentaje() {
        return ccajustePorcentaje;
    }

    public void setCcajustePorcentaje(BigDecimal ccajustePorcentaje) {
        this.ccajustePorcentaje = ccajustePorcentaje;
    }

    public BigDecimal getTadincajusteValor() {
        return tadincajusteValor;
    }

    public void setTadincajusteValor(BigDecimal tadincajusteValor) {
        this.tadincajusteValor = tadincajusteValor;
    }

    public BigDecimal getTadincajustePorcentaje() {
        return tadincajustePorcentaje;
    }

    public void setTadincajustePorcentaje(BigDecimal tadincajustePorcentaje) {
        this.tadincajustePorcentaje = tadincajustePorcentaje;
    }

    public BigDecimal getIatValor() {
        return iatValor;
    }

    public void setIatValor(BigDecimal iatValor) {
        this.iatValor = iatValor;
    }

    public BigDecimal getIatPorcentaje() {
        return iatPorcentaje;
    }

    public void setIatPorcentaje(BigDecimal iatPorcentaje) {
        this.iatPorcentaje = iatPorcentaje;
    }

    public BigDecimal getIatajusteValor() {
        return iatajusteValor;
    }

    public void setIatajusteValor(BigDecimal iatajusteValor) {
        this.iatajusteValor = iatajusteValor;
    }

    public BigDecimal getIatajustePorcentaje() {
        return iatajustePorcentaje;
    }

    public void setIatajustePorcentaje(BigDecimal iatajustePorcentaje) {
        this.iatajustePorcentaje = iatajustePorcentaje;
    }

    public Timestamp getAudFecha() {
        return audFecha;
    }

    public void setAudFecha(Timestamp audFecha) {
        this.audFecha = audFecha;
    }

    public Long getVarperIde() {
        return varperIde;
    }

    public void setVarperIde(Long varperIde) {
        this.varperIde = varperIde;
    }

    public Long getPerIderegistro() {
        return perIderegistro;
    }

    public void setPerIderegistro(Long perIderegistro) {
        this.perIderegistro = perIderegistro;
    }

    public Integer getUsuIderegistro() {
        return usuIderegistro;
    }

    public void setUsuIderegistro(Integer usuIderegistro) {
        this.usuIderegistro = usuIderegistro;
    }

    public String getAprconEstado() {
        return aprconEstado;
    }

    public void setAprconEstado(String aprconEstado) {
        this.aprconEstado = aprconEstado;
    }

    public BigDecimal getTaaforadoValor() {
        return taaforadoValor;
    }

    public void setTaaforadoValor(BigDecimal taaforadoValor) {
        this.taaforadoValor = taaforadoValor;
    }

    public BigDecimal getCcfinValor() {
        return ccfinValor;
    }

    public void setCcfinValor(BigDecimal ccfinValor) {
        this.ccfinValor = ccfinValor;
    }

    public BigDecimal getTafinValor() {
        return tafinValor;
    }

    public void setTafinValor(BigDecimal tafinValor) {
        this.tafinValor = tafinValor;
    }

    public BigDecimal getTamoraValor() {
        return tamoraValor;
    }

    public void setTamoraValor(BigDecimal tamoraValor) {
        this.tamoraValor = tamoraValor;
    }

    public BigDecimal getIatmoraValor() {
        return iatmoraValor;
    }

    public void setIatmoraValor(BigDecimal iatmoraValor) {
        this.iatmoraValor = iatmoraValor;
    }

    public BigDecimal getTaintcorrienteValor() {
        return taintcorrienteValor;
    }

    public void setTaintcorrienteValor(BigDecimal taintcorrienteValor) {
        this.taintcorrienteValor = taintcorrienteValor;
    }

    public BigDecimal getIatintcorrienteValor() {
        return iatintcorrienteValor;
    }

    public void setIatintcorrienteValor(BigDecimal iatintcorrienteValor) {
        this.iatintcorrienteValor = iatintcorrienteValor;
    }

    public Long getPerprestacionAjustado() {
        return perprestacionAjustado;
    }

    public void setPerprestacionAjustado(Long perprestacionAjustado) {
        this.perprestacionAjustado = perprestacionAjustado;
    }

    public Timestamp getAprconsFecha() {
        return aprconsFecha;
    }

    public void setAprconsFecha(Timestamp aprconsFecha) {
        this.aprconsFecha = aprconsFecha;
    }

    public Long getAprconsIderegistr() {
        return aprconsIderegistr;
    }

    public void setAprconsIderegistr(Long aprconsIderegistr) {
        this.aprconsIderegistr = aprconsIderegistr;
    }

    public Long getMaprcIderegistr() {
        return maprcIderegistr;
    }

    public void setMaprcIderegistr(Long maprcIderegistr) {
        this.maprcIderegistr = maprcIderegistr;
    }

    public Integer getEmpIderegistro() {
        return empIderegistro;
    }

    public void setEmpIderegistro(Integer empIderegistro) {
        this.empIderegistro = empIderegistro;
    }
}
