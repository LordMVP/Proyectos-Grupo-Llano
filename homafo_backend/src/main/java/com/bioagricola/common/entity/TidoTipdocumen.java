package com.bioagricola.common.entity;


import com.bioagricola.common.constant.SchemaConstants;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.Size;
import java.io.Serializable;

@Entity
@Table(name = "tido_tipdocumen", catalog = SchemaConstants.PUBLIC, schema = SchemaConstants.PUBLIC)
@Data
@NoArgsConstructor
public class TidoTipdocumen implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Column(name = "uni_tipdocument")
    private Integer uniTipdocument;

    @Column(name = "est_tipdocument")
    private Integer estTipdocument;

    @Column(name = "tido_nombre")
    @Size(min = 0, max = 100)
    private String tidoNombre;

    @Column(name = "tido_abreviatur")
    @Size(min = 0, max = 5)
    private String tidoAbreviatur;

    @Column(name = "tido_metregistr")
    @Size(min = 0, max = 1)
    private String tidoMetregistr;

    @Column(name = "tido_gensuspend")
    @Size(min = 0, max = 1)
    private String tidoGensuspend;

    @Column(name = "usu_ideregistro")
    private Integer usuIderegistro;

    @Column(name = "tido_nitcontabil")
    @Size(min = 0, max = 1)
    private String tidoNitcontabil;

    @Column(name = "tido_maxcuofinancia")
    private Short tidoMaxcuofinancia;

    @Column(name = "tido_maxcuounifica")
    private Short tidoMaxcuounifica;

    @Column(name = "tido_maxcuoreestruc")
    private Short tidoMaxcuoreestruc;

    @Column(name = "tido_maxcuoabonok")
    private Short tidoMaxcuoabonok;

    @Column(name = "tido_finvencido")
    @Size(min = 0, max = 1)
    private String tidoFinvencido;

    @Column(name = "tido_pagpriori")
    private Short tidoPagpriori;

}

