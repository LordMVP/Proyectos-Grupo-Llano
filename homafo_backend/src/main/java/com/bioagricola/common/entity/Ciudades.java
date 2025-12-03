package com.bioagricola.common.entity;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.io.Serializable;

@Entity
@Table(name = "ciudades")
@Data
@NoArgsConstructor
public class Ciudades implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @Column(name = "ciudad_cod")
    private String ciudadCod;

    @Column(name = "ciudad_nom")
    private String ciudadNom;

    @Column(name = "ciudad_coddep")
    private String ciudadCoddep;

    @Column(name = "ciudad_codemp")
    private String ciudadCodemp;
}
