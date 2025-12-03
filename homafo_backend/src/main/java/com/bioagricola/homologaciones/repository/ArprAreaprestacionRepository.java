package com.bioagricola.homologaciones.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.bioagricola.homologaciones.entity.ArprAreaprestacion;

public interface ArprAreaprestacionRepository extends JpaRepository<ArprAreaprestacion,Long>,JpaSpecificationExecutor<ArprAreaprestacion> {

}
