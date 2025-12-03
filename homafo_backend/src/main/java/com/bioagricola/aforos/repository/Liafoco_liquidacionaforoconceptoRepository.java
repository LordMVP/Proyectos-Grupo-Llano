package com.bioagricola.aforos.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bioagricola.aforos.entity.LiafocoLiquidacionAforoConceptosAdicional;

@Repository
public interface Liafoco_liquidacionaforoconceptoRepository extends JpaRepository<LiafocoLiquidacionAforoConceptosAdicional, Long>{

}
