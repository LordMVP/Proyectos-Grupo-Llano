package com.bioagricola.common.entity;

import com.bioagricola.common.constant.SchemaConstants;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Entity
@Table(name = "rrba_rutarecoleccionbarrido", catalog = SchemaConstants.ASEO, schema = SchemaConstants.ASEO)
@Getter
@Setter
@NoArgsConstructor
public class RrbaRutaRecoleccionBarrido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "rrba_ideregistro")
    private Long rrbaIdRegistro;

    @ManyToOne
    @NotNull
    @JoinColumn(name = "rut_ideregistro", referencedColumnName = "rut_ideregistro")
    private RutRuta rutRuta;

    @ManyToOne
    @NotNull
    @JoinColumn(name = "dsus_ideregistr", referencedColumnName = "dsus_ideregistr")
    private DsusDetsuscrip dsusDetsuscrip;

    @Column(name = "rut_idemacroruta")
    private Long rutIdMacroRuta;

    @NotNull
    @Column(name = "rutrecbar_swtact", length = 1)
    private String rutEstado;

    @Column(name = "usu_ideregistro")
    private Long usuIderegistro;

    @Column(name = "rure_ideregistro")
    private Long rureIdRegistro;
}
