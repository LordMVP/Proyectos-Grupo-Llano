package com.bioagricola.apirest.modelo.entidades;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.sql.Timestamp;

@Entity
@Getter
@Setter
@Table(name="aprconc_conciliacion", schema="aseo")
public class AprconcConciliacion implements Serializable {

    @Id
    @Column(name = "aprcon_ideregistro")
    private Long aprconIderegistro;

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

    @Column(name = "ctaban_tercero")
    private String ctabanTercero;

    @Column(name = "valorpagado_tercero")
    private BigDecimal valorpagadoTercero;

    @Column(name = "numeroactacon_tercero")
    private BigDecimal numeroactaconTercero;

    @Column(name = "perprestacion_ajustado")
    private Long perprestacionAjustado;

    @Column(name = "aprconc_fechacorte")
    private Timestamp aprconcFechacorte;

    @Column(name = "aprcon_exportadoseven")
    private Boolean aprconExportadoseven;

    @Column(name = "emp_ideregistro")
    private Integer empIderegistro;

    @Column(name = "arpr_ideregistro")
    private Integer arprIderegistro;

    @Column(name = "uni_municipio")
    private Long uniMunicipio;

    @Column(name = "maprc_ideregistr")
    private Long maprcIderegistr;

    @Column(name = "sop_fecha_giro")
    private Timestamp sopFechaGiro;

    @Column(name = "observaciones")
    private String observaciones;

    @Column(name = "sop_ideregistro")
    private Long sopIderegistro;
}
