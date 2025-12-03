package com.bioagricola.common.entity;

import com.bioagricola.common.constant.SchemaConstants;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Table(name = "dicn_disconven", catalog = SchemaConstants.PUBLIC, schema = SchemaConstants.PUBLIC)
@Getter
@Setter
@NoArgsConstructor
public class DicnDisconven {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "dicn_ideregistr", nullable = false)
    private Long dicnIderegistr;

    @JoinColumn(name = "cnre_ideregistr", referencedColumnName = "cnre_ideregistr", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    private CnreCnvrecaudo cnreCnvrecaudo;

    @Column(name = "emp_ideregistro", nullable = false)
    private Long empIderegistro;

    @Column(name = "uni_tipsuscripc", nullable = false)
    private Long uniTipsuscripc;

    @Column(name = "dicn_valor", nullable = false)
    private Integer dicnValor;

    @Column(name = "usu_ideregistro", nullable = false)
    private Long usuIderegistro;

    @Column(name = "dicn_pagprioridad")
    private Integer dicnPagprioridad;

    @Column(name = "dicn_proprioridad", nullable = false)
    private Integer dicnProprioridad;

    @Column(name = "dicn_empfactura", nullable = false, length = 1)
    private String dicnEmpfactura;
}
