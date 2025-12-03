package com.bioagricola.common.entity;

import com.bioagricola.common.constant.SchemaConstants;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.Date;

@Entity
@Table(name = "rapr_rutaaprovechamiento", catalog = SchemaConstants.ASEO, schema = SchemaConstants.ASEO)
@Getter
@Setter
@NoArgsConstructor
public class RaprRutaAprovechamiento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "rutapr_ideregistro")
    private Long rutaPrIdRegistro;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "rut_ideregistro", referencedColumnName = "rut_ideregistro")
    private RutRuta rutRuta;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "dsus_ideregistr", referencedColumnName = "dsus_ideregistr")
    private DsusDetsuscrip dsusDetsuscrip;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "ter_aprovechamiento", referencedColumnName = "ter_ideregistro")
    private TerTercero terTercero;

    @Column(name = "rutapr_incentivo")
    private Boolean incentivo;

    @Column(name = "rutapr_aforado")
    private Boolean aforado;

    @NotNull
    @Column(name = "rutapr_swtact", length = 1)
    private String rutEstado;

    @Column(name = "usu_ideregistro")
    private Long usuIderegistro;

    @Column(name = "date_created")
    private Date dateCreated;
}
