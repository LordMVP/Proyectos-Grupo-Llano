package com.bioagricola.config;

import java.util.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.bioagricola.aforos.facade.AuthenticationFacade;
import com.bioagricola.common.util.SpreadsheetUtil;
import com.bioagricola.homologaciones.entity.ImarcArchivosImportacion;
import com.bioagricola.homologaciones.entity.PiminsProyeccionImins;
import com.bioagricola.homologaciones.entity.PimpProcesoImportacion;
import com.bioagricola.homologaciones.service.business.ImportacionServiceBusiness;
import com.bioagricola.homologaciones.service.business.ProcesoValidacionService;
import com.bioagricola.homologaciones.service.impl.PimpProcesoImportacionService;

import lombok.extern.log4j.Log4j;
import lombok.extern.slf4j.Slf4j;

//@Slf4j
public class ImportacionControlService implements Runnable {

	private final int filaIni;
	private final int filaFin;
	private final ImportacionServiceBusiness importService;
	private static final Logger log = LoggerFactory.getLogger(ImportacionControlService.class);
	private final List<PiminsProyeccionImins> allProyecciones;
	private final SpreadsheetUtil spreadsheetUtil;
	private final ImarcArchivosImportacion imarc;
	private final Long usuario;
	private final Integer empresa;
	private final PimpProcesoImportacion pimp;
	private final List<Map<String, Object>> subImcdGlobal;
	private final ProcesoValidacionService procesoValidacionService;

	public ImportacionControlService(int filaIni, int filaFin,
									 ImportacionServiceBusiness importService,
									 List<PiminsProyeccionImins> allProyecciones,
									 SpreadsheetUtil spreadsheetUtil,
									 ImarcArchivosImportacion imarc,
									 Long usuario, Integer empresa,
									 PimpProcesoImportacion pimp,
									 List<Map<String, Object>> subImcdGlobal,
									 ProcesoValidacionService procesoValidacionService) {
		super();
		this.filaIni = filaIni;
		this.filaFin = filaFin;
		this.importService = importService;
		this.allProyecciones = allProyecciones;
		this.spreadsheetUtil = spreadsheetUtil;
		this.imarc = imarc;
		this.usuario = usuario;
		this.empresa = empresa;
		this.pimp = pimp;
		this.subImcdGlobal = subImcdGlobal;
		this.procesoValidacionService = procesoValidacionService;
	}

	@Override
	public void run() {
		try {
			Optional<PiminsProyeccionImins> proyecciones =
					this.importService.resolverGrupo(filaIni,filaFin,usuario,empresa,subImcdGlobal);
			proyecciones.ifPresent(p -> this.allProyecciones.add(p));

		} catch (Exception e) {
			log.error("Error procesando batch {}-{}: {}", filaIni, filaFin, e.getMessage(), e);
			// Crear proyección de error
			PiminsProyeccionImins errorProyeccion = new PiminsProyeccionImins();
			errorProyeccion.setPiminsEstado("ERROR");
			errorProyeccion.setMensaje(
                    Collections.singletonList("Error en registros " + filaIni + "-" + filaFin + ": " + e.getMessage())
			);
			this.allProyecciones.add(errorProyeccion);
		}
	}
}
