package com.bioagricola.common.entity;

import com.bioagricola.common.constant.SchemaConstants;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.io.Serializable;

@Data
@Entity
@Table(name = "clte_clatercero", catalog= SchemaConstants.PUBLIC, schema=SchemaConstants.PUBLIC)
@NoArgsConstructor
public class ClteClatercero implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="clte_ideregistr", nullable=false)
    private Long clteIderegistr;

    @ManyToOne
    @JoinColumn(name = "uni_clatercero", referencedColumnName = "uni_ideregistro")
    private UniUnidad uniUnidad;

    @ManyToOne
    @JoinColumn(name = "ter_ideregistro", referencedColumnName = "ter_ideregistro")
    private TerTercero terTercero;

    @Column(name = "usu_ideregistro")
    private Integer usuIderegistro;
}
