package com.bioagricola.homologaciones.repository;

import com.bioagricola.common.entity.DghoDetallegestionhomologa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface DghoDetallegestionhomologaRepository extends JpaRepository<DghoDetallegestionhomologa, Long>, JpaSpecificationExecutor<DghoDetallegestionhomologa> {
}
