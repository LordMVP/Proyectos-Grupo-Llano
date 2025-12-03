package com.bioagricola.homologaciones.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.bioagricola.homologaciones.entity.ImcolImportarColumnaEntity;

public interface ImcolImportarColumnaRepository extends JpaRepository<ImcolImportarColumnaEntity, Long>,JpaSpecificationExecutor<ImcolImportarColumnaEntity> {

}
