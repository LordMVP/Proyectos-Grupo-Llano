package com.bioagricola.homologaciones.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.bioagricola.homologaciones.entity.IminsImportarInsertsEntity;

public interface IminsImportarInsertsRepository extends JpaRepository<IminsImportarInsertsEntity,Long>,JpaSpecificationExecutor<IminsImportarInsertsEntity> {

}
