package com.bioagricola.aforos.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import com.bioagricola.common.constant.SchemaConstants;

import lombok.Data;

@Entity
@Data
@Table(name = "dliham_detliqaforomultiusuario", catalog=SchemaConstants.ASEO, schema=SchemaConstants.ASEO)
public class DlihamDetliqaforomultiusuario {
	
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "dliham_ideregistro")
    private Long dliham_ideregistro;  

    @Column(name = "liafoco_ideregistro")
    private Long liafocoIderegistro;

    @Column(name = "uni_concepto")
    private Integer uniConcepto;

    @Column(name = "con_valor")
    private BigDecimal conValor;

}
