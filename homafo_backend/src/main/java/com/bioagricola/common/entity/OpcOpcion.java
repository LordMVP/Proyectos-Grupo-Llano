package com.bioagricola.common.entity;

import com.bioagricola.common.constant.SchemaConstants;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "opc_opcion", catalog= SchemaConstants.PUBLIC, schema=SchemaConstants.PUBLIC)
@Getter
@Setter
@NoArgsConstructor
public class OpcOpcion implements Serializable {

    @Id
    @Column(name="opc_ideregistro")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long opcIderegistro ;

    @Column(name="opc_nombre")
    private String opcNombre;

    @Column(name="opc_descripcion")
    private String opcDescripcion;

    @ManyToOne
    @JoinColumn(name="prg_ideregistro")
    private PrgPrograma prgPrograma;

    @Column(name="opc_idepadre")
    private Integer opcIdepadre;

    @Column(name = "usu_ideregistro")
    private Integer usuIderegistro;

    @Column(name = "opc_tipo")
    private Integer opcTipo;

}
