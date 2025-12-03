package com.bioagricola.common.util;

import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.log;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicReference;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bioagricola.common.dto.ColumnDataViewDTO;
import com.bioagricola.common.dto.DefaultTipoResolucionDTO;
import com.bioagricola.common.dto.TipoProcesoHomologacionDTO;
import com.bioagricola.common.dto.TipoProcesoHomologacionItemDTO;
import com.bioagricola.common.dto.TipoProcesoSQLDTO;
import com.bioagricola.common.repository.GenericSQLRepository;
import com.bioagricola.homologaciones.entity.DiminsDimportarInsertsEntity;
import com.bioagricola.homologaciones.entity.ImcolImportarColumnaEntity;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

@Service
public class ImcolTipoProcesoResolucionUtil {

	@Autowired
	private Gson gson;

	@Autowired
	private GenericSQLRepository genericSqlRepository;

	public String resolvColumn(ColumnDataViewDTO column, Map<String, String> rowData) {
		String resultado = null;
		switch (column.getTipoResolucion()) {
		case DIRECTA:
			resultado = this.resolverArchivo(column, rowData);
			break;
		case CONSTANTE:
			resultado = this.resolverConstante(column, rowData);
			break;
		case HOMOLOGACION:
			resultado = this.resolverHomologacion(column, rowData);
			break;
		case SQL_SINGLE_SELECT:
			resultado = this.resolverSqlSingleSelect(column, rowData);
			break;
		case REFERENCIA:
			resultado = this.resolverReferencia(column, rowData);
			break;
		case SQL_VARIANTE_SELECT:
			resultado = this.resolverSqlVarianteSelect(column, rowData);
			break;
		default:
			break;
		}
		if (resultado  == null || resultado .isEmpty()) {

		}else {
			return resultado ;
		}

		return null;
	}
	
	public String resolvColumn(ColumnDataViewDTO column, Map<String, String> rowData,List<Map<String, Object>> mapGlobal) {

		String resultado = null;

		switch (column.getTipoResolucion()) {
		case DIRECTA:
			resultado = this.resolverArchivo(column, rowData);
			break;
		case CONSTANTE:
			resultado = this.resolverConstante(column, rowData);
			break;
		case HOMOLOGACION:
			resultado = this.resolverHomologacion(column, rowData);
			break;
		case SQL_SINGLE_SELECT:
			resultado = this.resolverSqlSingleSelect(column, rowData);
			break;
		case REFERENCIA:
			resultado = this.resolverReferencia(column, rowData);
			break;
		case SQL_VARIANTE_SELECT:
			resultado = this.resolverSqlVarianteSelect(column, rowData);
			break;
		case MAP_GLOBAL:
			resultado = this.resolverMapGlobal(column, rowData,mapGlobal);
			break;
		default:
			break;
		}

		if (resultado  == null || resultado.isEmpty()) {
			String valor = column.getColumnaDefault();
			if(column.getColumnaDefault() != null && !column.getColumnaDefault().isEmpty()) {
				if (mapGlobal.get(0).get(valor) != null) {
					return String.valueOf(mapGlobal.get(0).get(valor));
				}
			}
		}
		return resultado ;

	}

	public String resolv(DiminsDimportarInsertsEntity dimins, Map<String, String> rowData) {
		ColumnDataViewDTO column = new ColumnDataViewDTO();
		column.setColumDataType(dimins.getDiminsTipoDato());
		column.setColumnJson(dimins.getDiminsJson());
		column.setColumnName(dimins.getDiminsColumnName());
		column.setTipoResolucion(dimins.getDiminsTipoResolucion());
		column.setColumnValidator(dimins.getDiminsValidador());
		return this.resolvColumn(column, rowData);
	}

	public String resolv(ImcolImportarColumnaEntity imcol, Map<String, String> rowData) {
		ColumnDataViewDTO column = new ColumnDataViewDTO();
		column.setColumDataType(imcol.getImcolTipoDato());
		column.setColumnName(imcol.getImcolNombre());
		column.setColumnJson(imcol.getImcolJson());
		column.setColumnValidator(imcol.getImcolValidador());
		column.setTipoResolucion(imcol.getImcolTipoResolucion());
		return this.resolvColumn(column, rowData);
	}
	
	public String resolv(ImcolImportarColumnaEntity imcol, Map<String, String> rowData,List<Map<String, Object>> mapGlobal) { //sobrecarga
		ColumnDataViewDTO column = new ColumnDataViewDTO();
		column.setColumDataType(imcol.getImcolTipoDato());
		column.setColumnName(imcol.getImcolNombre());
		column.setColumnJson(imcol.getImcolJson());
		column.setColumnValidator(imcol.getImcolValidador());
		column.setTipoResolucion(imcol.getImcolTipoResolucion());
		column.setColumnaDefault(imcol.getImcolColumnaDefault());
		return this.resolvColumn(column, rowData,mapGlobal);
	}

	private String resolverArchivo(ColumnDataViewDTO column, Map<String, String> rowData) {
		return rowData.containsKey(column.getColumnName()) ? rowData.get(column.getColumnName()) : null;
	}

	private String resolverConstante(ColumnDataViewDTO column, Map<String, String> rowData) {
		JsonObject json = JsonParser.parseString(column.getColumnJson()).getAsJsonObject();
		return json.get("valor").getAsString();
	}

	private String resolverHomologacion(ColumnDataViewDTO column, Map<String, String> rowData) {//VALOR
		//System.out.println("Resolviendo "+column.getColumnName());
		TipoProcesoHomologacionDTO dto = gson.fromJson(column.getColumnJson(), TipoProcesoHomologacionDTO.class);		
		String columnaReferencia = dto.getColumnaReferencia()!=null?dto.getColumnaReferencia():column.getColumnName();
		Optional<TipoProcesoHomologacionItemDTO> itemFind = dto.getValor().stream()
				.filter(item -> item.getExterno().equals(rowData.get(columnaReferencia))).findFirst();
		return itemFind.map(item -> item.getInterno()).orElse(null);

	}

	private String resolverSqlSingleSelect(ColumnDataViewDTO column, Map<String, String> rowData) {
		TipoProcesoSQLDTO dto = gson.fromJson(column.getColumnJson(), TipoProcesoSQLDTO.class);
		String sql = dto.getValor();
		sql = this.setParametersSQL(sql, rowData);	
		//System.out.println("SENTENCIA SQL:->"+sql);
		if (sql.contains("FROM")) {
			return genericSqlRepository.executeSelect(sql, 1).map(list -> FormaterDataUtil.convertToString(list.get(0))).orElse(null);
		} else {
			return genericSqlRepository.executeSelect(sql).map(list -> FormaterDataUtil.convertToString(list.get(0))).orElse(null);
		}
	}
	private String resolverSqlVarianteSelect(ColumnDataViewDTO column, Map<String, String> rowData) {
		TipoProcesoSQLDTO dto = gson.fromJson(column.getColumnJson(), TipoProcesoSQLDTO.class);
		String sql = dto.getValor();
		sql = this.setParametersSQL(sql, rowData);	
		String str = "";
		//System.out.println("SENTENCIA SQL:->"+sql);
		
		List<Object> lista = genericSqlRepository.executeSelect(sql, 1).get();
			if(lista.size() > 0 ) {
				for(int x = 0 ; x < lista.size() ; x++) {
					for(int i  = 0 ; i < ((Object [])lista.get(x)).length ; i++) {
						str+=((Object [])lista.get(x))[i]+",";
					}
				}
			}
		return str;
	}
	
	private String resolverMapGlobal(ColumnDataViewDTO column, Map<String, String> rowData,List<Map<String, Object>> mapGlobal) {
		JsonObject json = JsonParser.parseString(column.getColumnJson()).getAsJsonObject();
		String valor = json.get("valor").getAsString();
		Integer fila = 0 ;//Integer.parseInt(rowData.get("Fila"));		
		return String.valueOf(mapGlobal.get(fila).get(valor));
	}
	

	private String resolverReferencia(ColumnDataViewDTO column, Map<String, String> rowData) {
		DefaultTipoResolucionDTO dto = gson.fromJson(column.getColumnJson(), DefaultTipoResolucionDTO.class);
		return rowData.containsKey(dto.getValor()) ? rowData.get(dto.getValor()) : null;
	}
	
	private Object resolverFuncion() {
		return null;
	}

	public String setParametersSQL(String sql, Map<String, String> rowData) {
		AtomicReference<String> sqlAtomic = new AtomicReference<>(sql);
		rowData.keySet().stream().forEach(col -> {	
			if (rowData.containsKey(col) && rowData.get(col) != null) {
				sqlAtomic.set(sqlAtomic.get().replaceAll("<" + col + ">",
						rowData.get(col) != null ? rowData.get(col).toString() : null));
			}
		});
		return sqlAtomic.get();
	}
}
