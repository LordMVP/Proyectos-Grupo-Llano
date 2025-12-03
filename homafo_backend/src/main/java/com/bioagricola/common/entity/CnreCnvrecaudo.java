package com.bioagricola.common.entity;

import com.bioagricola.common.constant.SchemaConstants;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Table(name = "cnre_cnvrecaudo", catalog = SchemaConstants.PUBLIC, schema = SchemaConstants.PUBLIC)
@Getter
@Setter
@NoArgsConstructor
public class CnreCnvrecaudo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cnre_ideregistr")
    private Long cnreIderegistr;

    @Column(name = "cnre_nombre", nullable = false)
    private String cnreNombre;

    @Column(name = "cnre_estado", length = 1, nullable = false)
    private String cnreEstado;

    @Column(name = "cnre_numcontrat")
    private Integer cnreNumcontrat;

    @Column(name = "cnre_tipdistrib", length = 2, nullable = false)
    private String cnreTipdistrib;

    @Column(name = "cnre_obliga", length = 1, nullable = false)
    private String cnreObliga;

    @Column(name = "usu_ideregistro", nullable = false)
    private Long usuIderegistro;
}
