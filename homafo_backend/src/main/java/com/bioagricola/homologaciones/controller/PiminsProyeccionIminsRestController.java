package com.bioagricola.homologaciones.controller;

import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.log;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.function.Predicate;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import javax.persistence.EntityManagerFactory;
import javax.persistence.PersistenceUnit;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bioagricola.homologaciones.controller.generic.AbstractHomogacionesRestController;
import com.bioagricola.homologaciones.dto.PiminsActualizarTablaRequest;
import com.bioagricola.homologaciones.dto.basic.PiminsProyeccionGroupDTO;
import com.bioagricola.homologaciones.dto.basic.PiminsProyeccionIminsDTO;
import com.bioagricola.homologaciones.dto.basic.PiminsProyeccionTablaDTO;
import com.bioagricola.homologaciones.dto.facade.AbstractDTOFacade;
import com.bioagricola.homologaciones.dto.facade.PiminsProyeccionIminsDTOFacade;
import com.bioagricola.homologaciones.dto.facade.PimpProcesoImportacionDTOFacade;
import com.bioagricola.homologaciones.entity.PiminsProyeccionImins;
import com.bioagricola.homologaciones.entity.PimpProcesoImportacion;
import com.bioagricola.homologaciones.service.business.ImportacionEjecutorService;
import com.bioagricola.homologaciones.service.impl.PiminsProyeccionIminsService;
import com.bioagricola.homologaciones.service.impl.PimpProcesoImportacionService;
import com.google.gson.Gson;

@RestController
@RequestMapping(path = "api/pimins")
public class PiminsProyeccionIminsRestController
		extends AbstractHomogacionesRestController<PiminsProyeccionImins, PiminsProyeccionIminsDTO> {

	@Autowired
	private PiminsProyeccionIminsDTOFacade facade;

	@Autowired
	private PimpProcesoImportacionDTOFacade pimpFacade;

	@Autowired
	private PiminsProyeccionIminsService piminsService;	

	@Autowired
	private PimpProcesoImportacionService pimpService;
	
	@Autowired
	private Gson gson;

	@PersistenceUnit()
	private EntityManagerFactory entityManagerFactory;
	
	@Autowired
	private ImportacionEjecutorService ejecutorService;
	
	Logger logger = LoggerFactory.getLogger(this.getClass());	

	@Override
	protected AbstractDTOFacade<PiminsProyeccionImins, PiminsProyeccionIminsDTO> getFacade() {
		// TODO Auto-generated method stub
		return facade;
	}

	@RequestMapping(path = "/proyecciones/{pimp}", method = RequestMethod.GET)
	public ResponseEntity<Page<PiminsProyeccionIminsDTO>> getProyecciones(@PathVariable(name = "pimp") Long pimp,
			Pageable pageable) {
		Page<PiminsProyeccionImins> page = piminsService.findByPimpAnEstado(pimp, "P", pageable);
		Page<PiminsProyeccionIminsDTO> pageDto = this.convertPageToPageDto(page);
		return ResponseEntity.ok(pageDto);
	}

	@RequestMapping(path = "/proyecciones/actualizar", method = RequestMethod.POST)
	public void actualizarProyeccion(@RequestBody PiminsActualizarTablaRequest request) {

		//System.out.println("Actualizando tabla " + request.getTabla() + " del registro " + request.getPiminsIderegistro());
		PiminsProyeccionImins pimins = this.piminsService.findById(request.getPiminsIderegistro());
		PiminsProyeccionGroupDTO proyeccionesJson = gson.fromJson(pimins.getPiminsJson(),
				PiminsProyeccionGroupDTO.class);
		Predicate<? super PiminsProyeccionTablaDTO> predicate = value -> request.getTabla().getNombre()
				.equals(value.getNombre());
		List<PiminsProyeccionTablaDTO> tablaPimins = proyeccionesJson.getTablas().stream().filter(predicate.negate())
				.collect(Collectors.toList());
		tablaPimins.add(request.getTabla());
		proyeccionesJson.setTablas(tablaPimins);

		if (pimins.getPiminsJson().equals(gson.toJson(proyeccionesJson))) {
			//System.out.println("Sin cambios en el JSON");
		} else {
			//System.out.println("Con cambios en el JSON");
			pimins.setPiminsJson(gson.toJson(proyeccionesJson));
			pimins.setPiminsEstado("E");
			this.piminsService.save(pimins);
		}		

	}

	@RequestMapping(path = "/proyecciones/procesar", method = RequestMethod.POST)
	public ResponseEntity<HashMap<String,List<String>>> procesarPimp(@RequestParam(name = "pimpIderegistro") Long pimpIderegistro) {
		//System.out.println("Procesando Registros del id " + pimpIderegistro);
		PimpProcesoImportacion pimp = this.pimpService.findById(pimpIderegistro);
		HashMap<String,List<String>> resultados =ejecutorService.procesar(pimp);
		pimp.setPimpFechaActualizacion(LocalDateTime.now());
		pimp.setPimpEstado("C");
		this.pimpService.save(pimp);
		return ResponseEntity.ok(resultados);
		/*

		HashMap<String, Object> memory = new HashMap<String, Object>();
		EntityManager em2 = entityManagerFactory.createEntityManager();
		em2.getTransaction().begin();

		try {
			pimp.getProyecciones().stream().forEach(proyeccion -> {

				PiminsProyeccionGroupDTO json = gson.fromJson(proyeccion.getPiminsJson(),
						PiminsProyeccionGroupDTO.class);

				json.getTablas().stream().sorted((c1, c2) -> c1.getIminsOrden().compareTo(c2.getIminsOrden()))
						.forEach(tabla -> {
							System.out.println("Procesando " + tabla.getNombre() + " Orden: " + tabla.getIminsOrden());
							tabla.getColumnas().stream().filter(col -> col.getValor() == null).forEach(col -> {
								System.out.println(
										"Procesando columna " + col.getNombre() + ": dimins " + col.getDimins());
								DiminsDimportarInsertsEntity columna = diminsService.findById(col.getDimins());
								if (columna.getDiminsTipoResolucion() == ENUM_IMCOL_TIPO_RESOLUCION.REFERENCIA
										&& columna.getDiminsJson().matches(".+insert\\:.+")) {
									JsonObject jsonValor = JsonParser.parseString(columna.getDiminsJson())
											.getAsJsonObject();
									System.out.println("La columna " + columna.getDiminsColumnName()
											+ " depende del insert " + jsonValor.get("valor").getAsString());
									col.setValor(memory.get(jsonValor.get("valor").getAsString()));
								}
							});

							IminsImportarInsertsEntity imins = this.iminsService.findById(tabla.getIminsIderegistro());
							String sql = importacionService.buildInsert(tabla, imins);
							InsertDataRetornoDTO retorno = gson.fromJson(imins.getIminsJson(),InsertDataRetornoDTO.class);
							System.out.println(sql);
							if (retorno.getRetornoInsert() != null && !retorno.getRetornoInsert().isEmpty()) {
								
								Optional<List<HashMap<String, String>>> returning = genericSQL.executeInsertWithReturning(sql);
								
								if (returning.isPresent()) {
									returning.get().stream().forEach(result -> {
										result.keySet().stream().forEach(key -> {
											memory.put("insert:" + key + ":" + imins.getIminsOrden(),
													FormaterDataUtil.convertToString(result.get(key)));
											System.out.println("Memory put: " + "insert:" + key + ":"
													+ imins.getIminsOrden() + " : "
													+ FormaterDataUtil.convertToString(result.get(key)));
										});
									});
								}
							} else {
								genericSQL.executeInsert(sql);
							}
						});

			});
		} catch (Exception e) {
			em2.getTransaction().rollback();
		}
		em2.getTransaction().rollback();*/

	}

}
