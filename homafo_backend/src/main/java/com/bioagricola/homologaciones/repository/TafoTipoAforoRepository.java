package com.bioagricola.homologaciones.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.bioagricola.homologaciones.entity.TafoTipoAforo;

public interface TafoTipoAforoRepository extends JpaRepository<TafoTipoAforo,Long>,JpaSpecificationExecutor<TafoTipoAforo> {

}
