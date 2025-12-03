package com.bioagricola.homologaciones.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.bioagricola.homologaciones.entity.DtafoDetaTipoAforo;

public interface DtafoDetaTipoAforoRepository extends JpaRepository<DtafoDetaTipoAforo, Long>,JpaSpecificationExecutor<DtafoDetaTipoAforo> {

	List<DtafoDetaTipoAforo> findByTafoIderegistro_TafoIderegistro(Integer tafoIderegistro);

}
