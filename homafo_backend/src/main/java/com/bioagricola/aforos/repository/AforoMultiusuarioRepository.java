package com.bioagricola.aforos.repository;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bioagricola.aforos.entity.AforoMultiusuario;

@Repository
@Transactional
public interface AforoMultiusuarioRepository extends JpaRepository<AforoMultiusuario, Long>{
	public AforoMultiusuario findByAforo(Long aforo);	

}
