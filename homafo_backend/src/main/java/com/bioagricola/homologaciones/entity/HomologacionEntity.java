package com.bioagricola.homologaciones.entity;

import java.io.Serializable;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class HomologacionEntity implements Serializable {

	
	@Id
    private Integer susIderegistro;
}
