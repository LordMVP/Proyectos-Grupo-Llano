package com.bioagricola.common.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bioagricola.common.entity.DiccColumnasEntity;

public interface DiccColumnasRepository extends JpaRepository<DiccColumnasEntity,Long> {

	Optional<DiccColumnasEntity> findByDiccTablaAndDiccColumna(String diccTabla,String diccColumna);
	Optional<List<DiccColumnasEntity>> findByDiccTabla(String diccTabla);
}
