package com.bioagricola.homologaciones.service.business;

import java.io.InputStream;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import javax.activation.DataSource;
import javax.persistence.EntityManager;

import org.springframework.jdbc.datasource.DataSourceUtils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.annotation.RequestScope;

import com.bioagricola.common.dto.RegistroValidacionArchivoDTO;
import com.bioagricola.common.util.ENUM_TIPO_VALIDACION;
import com.bioagricola.common.util.SpreadsheetUtil;
import com.bioagricola.homologaciones.entity.ImarcArchivosImportacion;
import com.bioagricola.homologaciones.entity.ImcdsusImpcontdsuscripcion;
import com.bioagricola.homologaciones.entity.ImcolImportarColumnaEntity;
import com.bioagricola.homologaciones.service.impl.ImcdsusImpcontdsuscripcionService;


@Service
@RequestScope
public class ImportacionValidacionServiceBusiness extends ImportacionAbstractService {
	
	@Autowired
	private EntityManager em;
	
	@Autowired
	private ImcdsusImpcontdsuscripcionService imcdserService;

	private String value = "Inicial";
	private Integer count = 0;

	public void init(SpreadsheetUtil spreadsheetUtil, ImarcArchivosImportacion imarc) {
		this.spreadsheetUtil = spreadsheetUtil;		
		this.columnsSwap = new HashMap<>();
		this.imarc = imarc;
	}
	public void init(InputStream inputStream, ImarcArchivosImportacion imarc) {
		this.spreadsheetUtil = new SpreadsheetUtil(inputStream);
		this.spreadsheetUtil.switchToSheet(0);
		this.columnsSwap = new HashMap<>();
		this.imarc = imarc;
	}

	public Optional<RegistroValidacionArchivoDTO> validarColumnas() throws Exception {

		
		if (this.spreadsheetUtil != null) {
			//System.out.println("Validando columnas");
			Map<String, Integer> columnsFile = this.spreadsheetUtil.getColumnsName();
			boolean columnasCheck = imarc.getImcolList().stream()
					.allMatch(col -> col.getImcolObligatorio() ? columnsFile.containsKey(col.getImcolNombre()) : true);
			
			if (!columnasCheck) {
				//System.err.println("Error en nombre de columnas");
				RegistroValidacionArchivoDTO registro = new RegistroValidacionArchivoDTO(
						ENUM_TIPO_VALIDACION.NUM_COLUMNS, 1, -1, "Columnas varias",
						"El archivo no cumple con las columnas necesarias", null);
				return Optional.of(registro);
			}
			return Optional.empty();
		} else {
			throw new Exception("Error al leer el archivo");
		}
	}

	public Optional<List<RegistroValidacionArchivoDTO>> validarTiposDatosColumnas(int numeroFilas) {
		int numeroFilasArchivo = this.spreadsheetUtil.getNumRowsValidateFirstColumn();
		numeroFilas = numeroFilasArchivo > numeroFilas ? numeroFilas : numeroFilasArchivo;
		List<RegistroValidacionArchivoDTO> validaciones = new ArrayList<RegistroValidacionArchivoDTO>();
		for (int i = this.spreadsheetUtil.getFirstRowNum()+1; i < numeroFilas; i++) {
				validaciones.addAll(this.validarFila(i));
		}		
		return validaciones.isEmpty()?Optional.empty():Optional.of(validaciones);
	}

	private List<RegistroValidacionArchivoDTO> validarFila(int fila) {
		List<RegistroValidacionArchivoDTO> registros = new ArrayList<RegistroValidacionArchivoDTO>();	
		for (ImcolImportarColumnaEntity columna : 
		     this.imarc.getImcolList().stream()
		         .filter(col -> col.getImcolObligatorio())
		         .collect(Collectors.toList())) {
			String columnaFileValor = this.spreadsheetUtil.getCellData(columna.getImcolNombre(), fila);
			
			//Es una validacion solo para el proceso de actualizacion para no actualizar algunas columnas del archivo
			if (this.imarc.getImarcTipoProceso() == 2 && (columnaFileValor == null || columnaFileValor.trim().isEmpty())) {
	            continue;
	        }
			
			switch (columna.getImcolTipoDato()) {
				case TEXTO:
					if (columnaFileValor == null) {
						registros.add(RegistroValidacionArchivoDTO.buildFormatDataMessage(fila, 0,
								columna.getImcolNombre() + ":" + columna.getImcolTipoDato(), columnaFileValor));
					}
					break;
				case NUMERO:
					if (columnaFileValor != null && !isNumeric(columnaFileValor)) {
						registros.add(RegistroValidacionArchivoDTO.buildFormatDataMessage(fila, 0,
								columna.getImcolNombre() + columna.getImcolTipoDato(), columnaFileValor));
					}
					break;
				case FECHA:
					if (columnaFileValor != null && !isValidDate(columnaFileValor)) {
						registros.add(RegistroValidacionArchivoDTO.buildFormatDataMessage(fila, 0,
								columna.getImcolNombre() + columna.getImcolTipoDato(), columnaFileValor));
					}
					break;
				default:
					break;
			}
		}
		
		return registros;

	}

	private boolean isNumeric(String strNum) {
		Pattern pattern = Pattern.compile("-?\\d+(\\.\\d+)?");
		if (strNum == null) {
			return false;
		}
		return pattern.matcher(strNum).matches();
	}

	private boolean isValidDate(String inDate) {
		SimpleDateFormat dateFormat = new SimpleDateFormat("yy-MM-dd");
		dateFormat.setLenient(false);
		try {
			dateFormat.parse(inDate.trim());
		} catch (ParseException pe) {
			return false;
		}
		return true;
	}
	
	@Transactional
	public Integer uploadRecords(Long usuario,Long imarc) {
	    int batchSize = 1000;
	    int totalFilas = spreadsheetUtil.getNumRows();

	    AtomicInteger insertados = new AtomicInteger();

	    IntStream.range(1, totalFilas+1)  
	        .forEach(i -> {
	            String codigo = spreadsheetUtil.getRowData(i).get("CODIGO");

	            if (codigo != null && !codigo.isEmpty()) {
	                ImcdsusImpcontdsuscripcion entidad = new ImcdsusImpcontdsuscripcion();
	                entidad.setDsusPcodigo(codigo);
	                entidad.setImarcIderegistro(imarc);
	                entidad.setUsuIderegistro(usuario);
	                entidad.setImcdFila(i);	
	                em.persist(entidad);

	                int count = insertados.incrementAndGet();

	                if (count % batchSize == 0) {
	                    em.flush();
	                    //em.clear();
	                }
	            }
	        });

	    em.flush(); 
	    //em.clear();

	    return insertados.get();
	}
	
	@Transactional
	public Integer limpiarImcdsusCompleto(Long usuario,Long imarc) {
		return imcdserService.limpiarImcdsusCompleto(usuario,imarc);
	}
	




}
