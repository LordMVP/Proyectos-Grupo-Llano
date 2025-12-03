package com.bioagricola.common.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bioagricola.common.entity.ClaClase;

@Repository
public interface ClaClaseRepository  extends JpaRepository<ClaClase, Long> {

}
