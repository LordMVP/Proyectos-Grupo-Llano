package com.bioagricola.aforos.service.impl;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.bioagricola.aforos.entity.Aforo;
import com.bioagricola.aforos.entity.DetalleAforo;
import com.bioagricola.aforos.entity.dto.NewAforoDTO;
import com.bioagricola.aforos.repository.DetalleAforoRepository;
import com.bioagricola.common.repository.DsusDetsuscripRepository;


@Service
public class DetalleAforoServiceImpl {

	@Autowired
	private DetalleAforoRepository detalleAforoRepository;
	@Autowired
	private DsusDetsuscripRepository dsusRepository;

	@Transactional
	public DetalleAforo saveDetalleAforoNormal(Aforo aforoBD,NewAforoDTO newAforoDTO) {
		DetalleAforo dA = new DetalleAforo();
					 dA.setAforo(aforoBD);
					 dA.setDafoFecharegistro(aforoBD.getAfoFecha());
					 dA.setAfoNumpqr(aforoBD.getAfoNumpqr());
					 dA.setDsusIderegistr(dsusRepository.findById(newAforoDTO.getIdSuscripcion()).orElse(null));
					 dA.setUsuIderegistro(aforoBD.getUsuIderegistro());
		return detalleAforoRepository.save(dA);
	}


	public List<DetalleAforo> findDetallesAforo(Long aforo){
		return  this.detalleAforoRepository.findByAforo_afoIderegistro(aforo);
	}
	
	public Iterable<DetalleAforo> SaveAllListaAforos (List<DetalleAforo> listAforos){
		return this.detalleAforoRepository.saveAll(listAforos);
	}
}
