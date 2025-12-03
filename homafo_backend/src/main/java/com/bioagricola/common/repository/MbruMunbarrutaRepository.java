package com.bioagricola.common.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bioagricola.common.entity.MbruMunbarruta;
import com.bioagricola.common.entity.MubaMunbarrio;

public interface MbruMunbarrutaRepository extends JpaRepository<MbruMunbarruta, Long>{
	
	public Optional<MbruMunbarruta> findByMubaIderegistro(MubaMunbarrio muba);

}
