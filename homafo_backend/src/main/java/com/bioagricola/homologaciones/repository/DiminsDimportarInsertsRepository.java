package com.bioagricola.homologaciones.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.bioagricola.homologaciones.entity.DiminsDimportarInsertsEntity;

public interface DiminsDimportarInsertsRepository extends JpaRepository<DiminsDimportarInsertsEntity,Long>,JpaSpecificationExecutor<DiminsDimportarInsertsEntity> {

}
