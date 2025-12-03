package com.bioagricola.homologaciones.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import com.bioagricola.common.entity.RutRuta;
import com.bioagricola.homologaciones.entity.RureRutrecoleccion;
import com.bioagricola.homologaciones.entity.specs.RureRutrecoleccionSpecifications;
import com.bioagricola.homologaciones.repository.HrrHorrecoleccionRepositoryHom;
import com.bioagricola.homologaciones.repository.RureRutrecoleccionRepository;

@Service
public class RureRutrecoleccionService extends AbstractService<RureRutrecoleccion, Long> {

	
	@Autowired
	private RureRutrecoleccionRepository repository;
	@Autowired
	private RutRutaService rutaService;
	@Autowired
	private HrrHorrecoleccionRepositoryHom hrrRepository;
	
	public RureRutrecoleccionService() {
		super(RureRutrecoleccion.class);
		// TODO Auto-generated constructor stub
	}

	@Override
	protected JpaRepository<RureRutrecoleccion, Long> getRepository() {
		// TODO Auto-generated method stub
		return repository;
	}

	public Optional<RureRutrecoleccion> findByMacroruta(Long id) {
		// TODO Auto-generated method stub
		return this.repository.findByRutIdemacruta_rutIderegistroAndRureSwtact(id,"A");
	}
	
	public RureRutrecoleccion buildRureFromMacroruta(Long id) {
		RutRuta ruta = this.rutaService.findById(id);
		RureRutrecoleccion rure = new RureRutrecoleccion();
		rure.setHorariosActivos(new HashSet<>());
		rure.setRutMicroruta("[]");		
		rure.setRutIdemacruta(ruta);
		return rure;
	}
	
	public Page<RureRutrecoleccion> findAllActives(String estado,Pageable pageable,Optional<String> search){
		return this.repository.findAll(RureRutrecoleccionSpecifications.byNombreMacroRutaAndEstado(estado, search.orElse("")), pageable);
	}
	
	public List<HashMap<String, Object>> macroRutasHorarios()
	{
		List<HashMap<String, Object>> total=new ArrayList<>();
    	for(Object[] tmp2: this.repository.macrorutasGeneral())
    	{
    		HashMap<String, Object> tmp1=new HashMap<>();
    		tmp1.put("rure_ideregistro", tmp2[0]);
    		tmp1.put("rut_ideregistro", tmp2[1]);
    		tmp1.put("rut_nombre",tmp2[2]);
    		tmp1.put("rut_microruta", tmp2[3]);    		
    		tmp1.put("horario", hrrRepository.horariosRecoleccion(((Integer) tmp2[0]).intValue()));
    		total.add(tmp1);
    	}
    	return total;
	}
	
	public List<HashMap<String, Object>> macroRutasSuscripcion(Long dsus)
	{
		List<HashMap<String, Object>> total=new ArrayList<>();
    	for(Object[] tmp2: this.repository.macrorutasSuscripcion(dsus))
    	{
    		HashMap<String, Object> tmp1=new HashMap<>();
    		tmp1.put("rure_ideregistro", tmp2[0]);
    		tmp1.put("rut_ideregistro", tmp2[1]);
    		tmp1.put("rut_nombre",tmp2[2]);
    		tmp1.put("rut_microruta", tmp2[3]);
    		tmp1.put("horario", hrrRepository.horariosRecoleccion(((Integer) tmp2[0]).intValue()));
    		total.add(tmp1);
    	}
    	return total;
	}
	
	public List<RureRutrecoleccion> findRureEntityByBarrioAndEstado(Long barrio,String estado){
		return repository.findRureEntityByBarrioAndEstado(barrio,estado);
	}

}
