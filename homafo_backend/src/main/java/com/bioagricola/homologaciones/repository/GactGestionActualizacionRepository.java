package com.bioagricola.homologaciones.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.bioagricola.homologaciones.entity.GactGestionActualizacion;

public interface GactGestionActualizacionRepository extends JpaRepository<GactGestionActualizacion,Long>, JpaSpecificationExecutor<GactGestionActualizacion>
{
}
