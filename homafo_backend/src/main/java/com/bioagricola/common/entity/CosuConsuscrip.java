package com.bioagricola.common.entity;

import com.bioagricola.common.constant.SchemaConstants;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.Date;

@Entity
@Table(name = "cosu_consuscrip", catalog = SchemaConstants.PUBLIC, schema = SchemaConstants.PUBLIC)
@Getter
@Setter
@NoArgsConstructor
public class CosuConsuscrip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cosu_ideregistr", nullable = false)
    private Long cosuIdregistr;

    @Column(name = "cosu_cantidad")
    private Integer cantidad;

    @Column(name = "cosu_vlrunitari")
    private Integer vlrUnitario;

    @Column(name = "cosu_vlrtotal")
    private Integer vlrTotal;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "cosu_fecinicio")
    private Date fecInicio;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "cosu_fecfinal")
    private Date fecFinal;

    @NotNull
    @JoinColumn(name = "dsus_ideregistr", referencedColumnName = "dsus_ideregistr")
    @ManyToOne
    private DsusDetsuscrip dsusDetsuscrip;

    @NotNull
    @Column(name = "uni_liquidacion", nullable = false)
    private Long uniLiquidacion;

    @NotNull
    @Column(name = "uni_concepto", nullable = false)
    private Long uniConcepto;

    @NotNull
    @Column(name = "emp_ideregistro", nullable = false)
    private Long empIdRegistro;

    @NotNull
    @Column(name = "cosu_estado", nullable = false, length = 1)
    private String cosuEstado;

    @NotNull
    @Column(name = "usu_ideregistro", nullable = false)
    private Integer usuIderegistro;
    
    @NotNull
    @Column(name = "cosu_observacion", nullable = false)
    private String cosuObservacion;
    
    
}
