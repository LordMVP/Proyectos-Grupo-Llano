package com.bioagricola.homologaciones.dto.facade;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.apache.poi.hpsf.Array;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.bioagricola.aforos.facade.AuthenticationFacade;
import com.bioagricola.common.entity.Barrios;
import com.bioagricola.common.entity.MbcdMunbardirec;
import com.bioagricola.common.entity.MubaMunbarrio;
import com.bioagricola.common.entity.Proyectos;
import com.bioagricola.common.entity.SecSector;
import com.bioagricola.homologaciones.dto.HomologacionBuquedadResponseDTO;
import com.bioagricola.homologaciones.dto.basic.DmubaDetaMubaDTO;
import com.bioagricola.homologaciones.dto.basic.MubaMunbarrioDTO;
import com.bioagricola.homologaciones.entity.DmubaDetaMuba;
import com.bioagricola.homologaciones.repository.BarriosRepository;
import com.bioagricola.homologaciones.repository.MubaMunbarrioRepository;
import com.bioagricola.homologaciones.service.impl.UniUnidadService;

@Component
public class MubaMunbarrioDTOFacade extends AbstractDTOFacade<MubaMunbarrio, MubaMunbarrioDTO> {

	@Autowired
	private DmubaDetaMubaDTOFacade dmubaFacade;
	@Autowired
	private UniUnidadService uniUnidadService;
	@Autowired
	private AuthenticationFacade authenticationFacade;
	
	@Autowired
	private BarriosRepository barriorepo;
	@Autowired
	private MubaMunbarrioRepository mubarepo;

	public MubaMunbarrioDTOFacade() {
		// TODO Auto-generated constructor stub
		super(MubaMunbarrio.class, MubaMunbarrioDTO.class);
	}

	@Override
	public MubaMunbarrioDTO convertToDto(MubaMunbarrio entity) {
		// TODO Auto-generated method stub
		List<Long>mbruLista=new ArrayList<>();
		MubaMunbarrioDTO dto = this.mapToDto(entity);
		dto.setZonaRiesgo("NO");
		dto.setMubaSector(entity.getMubaSector().getSecIderegistro());
		Set<Long> complementos = new HashSet<Long>();
		entity.getComplementos().stream().forEach(item -> {
			complementos.add(item.getUniIderegistro().getUniIderegistro());
		});
		dto.setComplementos(complementos);
		Set<Integer> rutas = new HashSet<Integer>();
		if (entity.getDmubaActivo() != null && !entity.getDmubaActivo().isEmpty()) {
			DmubaDetaMubaDTO dmubaDTO = dmubaFacade.convertToDto(entity.getDmubaActivo().iterator().next());
			dto.setBarrioHomllanogas(dmubaDTO.getBarrioHomllanogas());
			dto.setDmubaFrecuenciasBarrido(dmubaDTO.getDmubaFrecuenciasBarrido());
			dto.setDmubaRutas(dmubaDTO.getDmubaRutas());
		}
		if(barriorepo.findBarrioZonabyBarrioIderegistro(dto.getUniBarrio().intValue())) {
			dto.setZonaRiesgo("SI");
		}
		Optional<Long> mbruResultado=mubarepo.findRutaBarrido(dto.getUniBarrio().intValue());
		if(mbruResultado.isPresent()) {
			mbruLista.add(mbruResultado.get());
		}		
		dto.setMbru(mbruLista);
		return dto;
	}

	@Override
	public MubaMunbarrio convertToEntity(MubaMunbarrioDTO dto) {
		// TODO Auto-generated method stub
		MubaMunbarrio entity = this.mapToEntity(dto);
		
		entity.setUniBarrio(new Barrios(dto.getUniBarrio()));
		entity.setUniMunicipio(new Proyectos(dto.getUniMunicipio()));
	
		if (dto.getComplementos() != null) {
			entity.setComplementos(new HashSet<MbcdMunbardirec>());
			dto.getComplementos().stream().forEach(i -> {
				MbcdMunbardirec c = new MbcdMunbardirec();
				c.setUniIderegistro(uniUnidadService.findByIdOrNull(i));
				c.setUsuIderegistro(authenticationFacade.getIdUsuario());
				c.setMubaIderegistro(entity);
				entity.getComplementos().add(c);
			});
		}
		if (entity.getDmubaActivo() != null) {
			entity.getDmubaActivo().stream().forEach(p -> {
				p.setDmubaSwtact("I");
			});
		}else {
			entity.setDmubaActivo(new HashSet<DmubaDetaMuba>());
		}

		DmubaDetaMubaDTO dmubaDto = new DmubaDetaMubaDTO();
		dmubaDto.setBarrioHomllanogas(dto.getBarrioHomllanogas());
		dmubaDto.setDmubaFrecuenciasBarrido(dto.getDmubaFrecuenciasBarrido().stream().filter(f->f!=null).collect(Collectors.toSet()));
		dmubaDto.setDmubaRutas(dto.getDmubaRutas().stream().filter(r->r!=null).collect(Collectors.toSet()));
		DmubaDetaMuba dmuba = dmubaFacade.convertToEntity(dmubaDto);
		dmuba.setBarrioHomllanogas(new Barrios(dmubaDto.getBarrioHomllanogas()));
		System.out.println(dmuba.getDmubaRutas());		
		dmuba.setMubaIderegistro(entity);
		entity.getDmubaActivo().add(dmuba);
		SecSector sector = new SecSector();
		sector.setSecIderegistro(dto.getMubaSector());
		entity.setMubaSector(sector);
		return entity;
	}

}
