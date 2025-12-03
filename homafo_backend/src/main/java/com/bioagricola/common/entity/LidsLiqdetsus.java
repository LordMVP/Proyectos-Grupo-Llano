package com.bioagricola.common.entity;

import com.bioagricola.common.constant.SchemaConstants;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Table(name = "lids_liqdetsusc", catalog = SchemaConstants.PUBLIC, schema = SchemaConstants.PUBLIC)
@Getter
@Setter
@NoArgsConstructor
public class LidsLiqdetsus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "lids_ideregistr")
    private Long lidsIderegistr;

    @Column(name = "dsus_ideregistr")
    private Long dsusIderegistr;

    @Column(name = "uni_liquidacion")
    private Integer uniLiquidacion;

    @Column(name = "emp_ideregistro")
    private Integer empIderegistro;

    @Column(name = "usu_ideregistro")
    private Integer usuIderegistro;

    public LidsLiqdetsus(Long dsusIderegistr, Integer uniLiquidacion, Integer empIderegistro, Integer usuIderegistro) {
        this.dsusIderegistr = dsusIderegistr;
        this.uniLiquidacion = uniLiquidacion;
        this.empIderegistro = empIderegistro;
        this.usuIderegistro = usuIderegistro;
    }
}
