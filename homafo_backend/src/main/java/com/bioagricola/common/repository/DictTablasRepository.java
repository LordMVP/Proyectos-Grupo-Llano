package com.bioagricola.common.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bioagricola.common.entity.DictTablasEntity;

public interface DictTablasRepository extends JpaRepository<DictTablasEntity,Long> {

	
	Optional<DictTablasEntity> findByDictTabla(String dictTabla);
	
}
