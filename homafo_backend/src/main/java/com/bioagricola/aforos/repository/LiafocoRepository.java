package com.bioagricola.aforos.repository;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bioagricola.aforos.entity.Liafoco;

@Repository
@Transactional
public interface LiafocoRepository extends JpaRepository<Liafoco, Integer> {
    
    /**
     * Buscar liquidaciones por hafo_ideregistro
     */
    List<Liafoco> findByHafoIderegistro(Integer hafoIderegistro);
}

