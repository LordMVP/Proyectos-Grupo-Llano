package com.bioagricola.homologaciones.controller;

import java.util.*;
import java.util.stream.Collectors;

import com.bioagricola.common.repository.HrrHorrecoleccionRepository;
import com.bioagricola.homologaciones.entity.HrrHorrecoleccionEntity;
import com.bioagricola.homologaciones.repository.HrrHorrecoleccionRepositoryHom;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bioagricola.aforos.facade.AuthenticationFacade;
import com.bioagricola.homologaciones.controller.generic.AbstractHomogacionesRestController;
import com.bioagricola.homologaciones.dto.basic.HrrHorrecoleccionDTO;
import com.bioagricola.homologaciones.dto.basic.RureRutrecoleccionDTO;
import com.bioagricola.homologaciones.dto.facade.AbstractDTOFacade;
import com.bioagricola.homologaciones.dto.facade.RureRutrecoleccionDTOFacade;
import com.bioagricola.homologaciones.entity.RureRutrecoleccion;
import com.bioagricola.homologaciones.service.impl.RureRutrecoleccionService;

import javax.transaction.Transactional;

@RestController
@RequestMapping(path = "api/macrorutas")
public class RureRutrecoleccionRestController extends AbstractHomogacionesRestController<RureRutrecoleccion, RureRutrecoleccionDTO> {

	@Autowired
	private RureRutrecoleccionDTOFacade rureFacade;
	@Autowired
	private RureRutrecoleccionService rureService;
	@Autowired
	private AuthenticationFacade authFacade;
	
	@Override
	protected AbstractDTOFacade<RureRutrecoleccion, RureRutrecoleccionDTO> getFacade() {
		// TODO Auto-generated method stub
		return rureFacade;
	}
	
	
	@GetMapping(path = "/dto/page")
	public ResponseEntity<Page<RureRutrecoleccionDTO>> getMacrorutas(Pageable pageable,@RequestParam("search") Optional<String> search){		
		Page<RureRutrecoleccion> rures = this.rureService.findAllActives("A",pageable,search);
		Page<RureRutrecoleccionDTO> ruresDto = this.convertPageToPageDto(rures);
		return ResponseEntity.ok(ruresDto);
	}
	
	@GetMapping(path = "/dto/macroruta/{id}")
	public ResponseEntity<RureRutrecoleccionDTO> getByMacroruta(@PathVariable(name="id") Long id){
		RureRutrecoleccionDTO dto = this.rureFacade.convertToDto(this.rureService.findByMacroruta(id).orElse(this.rureService.buildRureFromMacroruta(id)));
		return ResponseEntity.ok(dto);
	}
	
	@PostMapping(path = "/dto")
	@Transactional
	public ResponseEntity<RureRutrecoleccionDTO> saveMacroruta(@RequestBody RureRutrecoleccionDTO dto){
		RureRutrecoleccion entity = new RureRutrecoleccion();		
		if(dto.getRureIderegistro()!=null) {
			entity = this.rureService.findById(dto.getRureIderegistro());
			JSONArray newMicroruta = getJsonArray(dto, entity);
			RureRutrecoleccion newEntity = this.rureFacade.convertToEntity(dto);
			entity.setRutMicroruta(newMicroruta.toString());

			entity.setUsuIderegistroGb(authFacade.getIdUsuario());
			entity.setUsuIderegistroAc(authFacade.getIdUsuario());
			entity.setRureFecgrabacion(new Date());
			entity.setRureFecact(new Date());
			Set<HrrHorrecoleccionEntity> existingHorarios = entity.getHorariosActivos(); // Colección actual
			Set<HrrHorrecoleccionEntity> nuevosHorarios = newEntity.getHorariosActivos(); // Nuevos elementos
			String microruta = String.valueOf(new JSONArray(dto.getRutMicroruta()).getJSONObject(0).get("microRuta"));

			existingHorarios.removeIf(horario -> microruta.equals(horario.getMicroruta()));

			existingHorarios.addAll(nuevosHorarios);

			entity.setHorariosActivos(existingHorarios);

			// Guardar la entidad con la colección actualizada
			entity = this.rureService.save(entity);

			return ResponseEntity.ok( this.rureFacade.convertToDto(entity));

		}
		dto.setRureIderegistro(null);
		RureRutrecoleccion newEntity = this.rureFacade.convertToEntity(dto);
		newEntity.getHorariosActivos().stream().forEach(h->h.setHrrIderegistro(null));
		newEntity.setUsuIderegistroGb(authFacade.getIdUsuario());
		newEntity.setUsuIderegistroAc(authFacade.getIdUsuario());
		newEntity.setRureFecgrabacion(new Date());
		newEntity.setRureFecact(new Date());		
		newEntity = this.rureService.save(newEntity);
		return ResponseEntity.ok(this.rureFacade.convertToDto(newEntity));		
		
	}

	private static JSONArray getJsonArray(RureRutrecoleccionDTO dto, RureRutrecoleccion entity) {
		JSONArray existingMicroruta = new JSONArray( dto.getRutMicroruta());

		JSONArray newMicroruta = new JSONArray(entity.getRutMicroruta());


		// Crear un Set para almacenar las claves únicas de newMicroruta
		Set<String> uniqueKeys = new HashSet<>();

		// Poblar el Set con las claves únicas de newMicroruta
		for (int i = 0; i < newMicroruta.length(); i++) {
			JSONObject newItem = newMicroruta.getJSONObject(i);
			uniqueKeys.add(String.valueOf(newItem.getInt("microRuta")));
		}

		// Validar los elementos de existingMicroruta
		for (int i = 0; i < existingMicroruta.length(); i++) {
			JSONObject existingItem = existingMicroruta.getJSONObject(i);
			String key = String.valueOf(existingItem.getInt("microRuta"));

			// Si no está en el Set, agregarlo a newMicroruta
			if (!uniqueKeys.contains(key)) {
				newMicroruta.put(existingItem);
				uniqueKeys.add(key); // Actualizar el Set
			}
		}
		return newMicroruta;
	}

	@GetMapping(path = "/dto/test")
	public String test() {
		HrrHorrecoleccionDTO dto = new HrrHorrecoleccionDTO();
		dto.setHrrDia("Martes");
		//dto.setHrrHorfin(hrrHorfin);
		return null;
	}
	
	@CrossOrigin(origins = "*", methods= {RequestMethod.GET})
	@GetMapping("/dto/macrorutasHora")
	public List<HashMap<String, Object>> macroRutasHorarios() 
	{
		return rureService.macroRutasHorarios();
	}
	
	@CrossOrigin(origins = "*", methods= {RequestMethod.GET})
	@GetMapping("/dto/macrorutasSuscripcion/{dsus}")
	public List<HashMap<String, Object>> macroRutasSuscripcion(@PathVariable(name="dsus") Long dsus) 
	{
		return rureService.macroRutasSuscripcion(dsus);
	}

}
