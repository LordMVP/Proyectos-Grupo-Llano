package com.bioagricola.aforos.entity;

import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

import com.bioagricola.common.constant.SchemaConstants;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "liafoco_liquidacionaforoconceptosadicional", catalog = SchemaConstants.ASEO, schema = SchemaConstants.ASEO)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Liafoco {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "liafoco_seq")
    @SequenceGenerator(name = "liafoco_seq", sequenceName = "aseo.sq_liaofoco_ideregistr", allocationSize = 1)
    @Column(name = "liafoco_ideregistro")
    private Integer liafocoIderegistro;

    @Column(name = "hafo_ideregistro", nullable = false)
    private Integer hafoIderegistro;

    @Column(name = "emp_ideregistro", nullable = false)
    private Integer empIderegistro;

    @Column(name = "liafoco_valortotal", nullable = false)
    private BigDecimal liafocoValortotal;

    @Column(name = "liafoco_individual", nullable = false)
    private BigDecimal liafocoIndividual;

    @Column(name = "liafoco_fecha_registro", nullable = false)
    private Date liafocoFechaRegistro;

    @Column(name = "liafoco_cobro", nullable = false)
    private Boolean liafocoCobro;

    @Column(name = "liafoco_unidades_independientes", nullable = false)
    private Integer liafocoUnidadesIndependientes;

    @Column(name = "liafoco_uni_clasesuscripcionaforo", nullable = false)
    private Integer liafocoUniClasesuscripcionaforo;

    @Column(name = "usu_ideregistro", nullable = false)
    private Integer usuIderegistro;

    @Column(name = "liafoco_visitas", nullable = false)
    private Integer liafocoVisitas;
}
