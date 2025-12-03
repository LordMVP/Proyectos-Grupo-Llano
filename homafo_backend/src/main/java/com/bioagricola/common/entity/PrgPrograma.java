package com.bioagricola.common.entity;

import com.bioagricola.common.constant.SchemaConstants;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Table(name = "prg_programa", catalog= SchemaConstants.PUBLIC, schema=SchemaConstants.PUBLIC)
@Getter
@Setter
@NoArgsConstructor
public class PrgPrograma {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "prg_ideregistro")
    private Integer prgIderegistro;

    @Column(name = "prg_nombre")
    private String prgNombre;

    @Column(name = "prg_localiza")
    private String prgLocaliza;

    @Column(name = "prg_abreviatura")
    private String prgAbreviatura;

    @Column(name = "prg_version")
    private String prgVersion;

    @Column(name = "prg_tipo")
    private String prgTipo;

    @Column(name = "usu_ideregistro")
    private Integer usuIderegistro;
}
