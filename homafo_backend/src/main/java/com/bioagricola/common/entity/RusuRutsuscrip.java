package com.bioagricola.common.entity;

import com.bioagricola.common.constant.SchemaConstants;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.Size;

@Entity
@Table(name = "rusu_rutsuscrip", catalog = SchemaConstants.PUBLIC, schema = SchemaConstants.PUBLIC)
@Getter
@Setter
@NoArgsConstructor
public class RusuRutsuscrip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "rusu_ideregistr")
    private Long rusuIderegistr;

    @ManyToOne
    @JoinColumn(name = "rut_ideregistro", referencedColumnName = "rut_ideregistro")
    private RutRuta rutIderegistro;

    @ManyToOne
    @JoinColumn(name = "dsus_ideregistr", referencedColumnName = "dsus_ideregistr")
    private DsusDetsuscrip dsusDetsuscrip;

    @Column(name = "rusu_rutanterio")
    @Size(max = 20)
    private String rusuRutanterio;

    @Column(name = "rusu_rutsecuen")
    private Integer rusuRutsecuen;

    @Column(name = "usu_ideregistro")
    private Integer usuIderegistro;

    public RusuRutsuscrip(RutRuta rutIderegistro, DsusDetsuscrip dsusDetsuscrip, String rusuRutanterio, Integer rusuRutsecuen, Integer usuIderegistro) {
        this.rutIderegistro = rutIderegistro;
        this.dsusDetsuscrip = dsusDetsuscrip;
        this.rusuRutanterio = rusuRutanterio;
        this.rusuRutsecuen = rusuRutsecuen;
        this.usuIderegistro = usuIderegistro;
    }
}
