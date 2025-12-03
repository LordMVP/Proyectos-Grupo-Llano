package com.bioagricola.common.util;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.atomic.AtomicReference;
import java.util.function.Function;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bioagricola.common.dto.InsertDataRetornoDTO;
import com.google.gson.Gson;

@Service
public class SQLBuilderUtil {

	@Autowired
	private Gson gson;
	private final char SPACE = ' ';
	private final String COMMA = ",";

	public String buildUpdate(String tableName, String json, Map<String, Object> rowData){
		StringBuilder build = new StringBuilder();
		build.append("UPDATE");
		build.append(SPACE);
		build.append(tableName);
		build.append(SPACE);
		build.append("SET");
		build.append(SPACE);
		build.append(this.buildUpdateColumns(json,rowData));
		build.append(SPACE);
		build.append("WHERE");
		build.append(SPACE);
		build.append(this.buildWhereCondition(json, rowData));
		build.append(SPACE);
		return build.toString();		
	}

	public String buildInsert(String tableName, String json, Map<String, Object> rowData) {
		StringBuilder build = new StringBuilder();
		build.append("INSERT INTO");
		build.append(SPACE);
		build.append(tableName);
		build.append(this.buildTableColumns(rowData));
		build.append(SPACE);
		build.append("VALUES");
		build.append(SPACE);
		build.append(this.buildTableValues(rowData));
		build.append(SPACE);
		build.append(this.validarExtra(json, rowData));
		return build.toString();
	}

	private String validarExtra(String jsonString, Map<String, Object> rowData) {
		if (jsonString != null) {
			InsertDataRetornoDTO retorno = gson.fromJson(jsonString, InsertDataRetornoDTO.class);
			// JsonObject json = JsonParser.parseString(jsonString).getAsJsonObject();
			//if (!retorno.getRetornoInsert().isEmpty()) {
			if (retorno.getRetornoInsert() != null) {
				return this.buildReturning(retorno.getRetornoInsert());
			}
			if (retorno.getRetornoPreInsert() != null) {
				return this.buildReturning(retorno.getRetornoPreInsert());
			}
		}
		return "";
	}

	private String buildWhereCondition(String jsonString, Map<String, Object> rowData){
		if (jsonString != null) {
			InsertDataRetornoDTO retorno = gson.fromJson(jsonString, InsertDataRetornoDTO.class);
			// JsonObject json = JsonParser.parseString(jsonString).getAsJsonObject();
			if (!retorno.getConditionsColumns().isEmpty()) {
				String whereValue = retorno.getConditionsColumns().stream().map(e->{					
					return e+"='"+rowData.get(e)+"'";
				}).collect(Collectors.joining("AND "));
				return whereValue;
			}
		}
		return "";
	}

	public String buildUpdateColumns(String jsonString, Map<String, Object> rowData) {
	    if (jsonString != null) {
	        InsertDataRetornoDTO retorno = gson.fromJson(jsonString, InsertDataRetornoDTO.class);
	        if (!retorno.getUpdateColumns().isEmpty()) {
	            String updateColumns = retorno.getUpdateColumns().stream()
	                .map(e -> {
	                    Object valorObj = rowData.get(e);
	                    String valor = (valorObj != null) ? valorObj.toString() : "";

	                 // Si el valor está vacío o es "null", no incluirlo
	                    if (valor.isEmpty() || "null".equalsIgnoreCase(valor)) {
	                    	rowData.remove(e);
	                        return null; // Devuelve null para filtrar en el siguiente paso
	                    }
	                    
	                    // Si el valor es "VACIO", lo convertimos en un string vacío
	                    if ("VACIO".equalsIgnoreCase(valor)) {
	                        valor = "";
	                    }

	                    return e + "='" + valor + "'";
	                })
	                .filter(Objects::nonNull) // Elimina los valores null generados por la condición anterior
	                .collect(Collectors.joining(",")); // Une solo los valores válidos con coma

	            return updateColumns;
	        }
	    }
	    return "";
	}
	
	public String buildTableColumns(Map<String, Object> rowData) {
		StringBuilder build = new StringBuilder();
		String columnsNames = String.join(COMMA, rowData.keySet());
		build.append("(");
		build.append(columnsNames);
		build.append(")");
		return build.toString();
	}

	public String buildTableValues(Map<String, Object> rowData) {
		StringBuilder build = new StringBuilder();
		String columnsValues = rowData.values().stream().map(value -> value == null ? "NULL" : "'" + value + "'")
				.collect(Collectors.joining(","));
		// String columnsValues = String.join(",",rowData.values());
		build.append("(");
		build.append(columnsValues);
		build.append(")");
		return build.toString();
	}

	public String buildReturning(List<String> retornos) {
		StringBuilder build = new StringBuilder();
		build.append(String.join(",", retornos));
		build.insert(0, "RETURNING ");
		return build.toString();
	}

	public Map<Integer, String> getColumnsNamesFromSQL(String sql) {
		String regExp = "^SELECT (.+) FROM.*$";
		if (sql.matches(regExp)) {
			Pattern pattern = Pattern.compile(regExp);
			Matcher match = pattern.matcher(sql);
			if (match.matches()) {
				String columnsText = match.group(1);
				String[] columns = columnsText.split(COMMA);
				List<String> columnsList = Arrays.asList(columns).stream()
						.map(col -> col.contains("as") ? (col.split(" as "))[1] : col).collect(Collectors.toList());
				Map<Integer, String> columnsMap = IntStream.range(0, columnsList.size()).boxed()
						.collect(Collectors.toMap(Function.identity(), columnsList::get));
				columnsMap.keySet().stream().forEach(key -> System.out.println(key + ":" + columnsMap.get(key)));
				return columnsMap;
			}
		}
		return null;
	}
	
	public Map<Integer, String> getColumnsNamesFromSQLOneDirection(List<String> columns) {
				List<String> columnsList = columns;
				Map<Integer, String> columnsMap = IntStream.range(0, columnsList.size()).boxed()
						.collect(Collectors.toMap(Function.identity(), columnsList::get));
				return columnsMap;	
	}

	public Map<Integer, String> getColumnsNamesFromSQLWithAs(String sql) {
		String regExp = "^SELECT (.+) FROM.*$".toLowerCase();
		if (sql.toLowerCase().matches(regExp)) {
			Pattern pattern = Pattern.compile(regExp);
			Matcher match = pattern.matcher(sql.toLowerCase());
			if (match.matches()) {
				String columnsText = match.group(1);
				pattern = Pattern.compile("as\\s([a-z\\._]+)",Pattern.CASE_INSENSITIVE);
				match = pattern.matcher(columnsText);
				System.out.println(columnsText);
				int i = 0;
				Map<Integer, String> columnsMap = new HashMap<Integer, String>();
				while (match.find()) {
					columnsMap.put(i, match.group(1));
					i++;
				}
				columnsMap.keySet().stream().forEach(key -> System.out.println(key + ":" + columnsMap.get(key)));
				return columnsMap;
				/*
				 * String[] columns = columnsText.split(COMMA); List<String> columnsList =
				 * Arrays.asList(columns).stream().map(col->
				 * col.contains("as")?(col.split(" as "))[1]:col).collect(Collectors.toList());
				 * Map<Integer, String> columnsMap =
				 * IntStream.range(0,columnsList.size()).boxed().collect(Collectors.toMap(
				 * Function.identity(),columnsList::get));
				 * columnsMap.keySet().stream().forEach(key ->
				 * System.out.println(key+":"+columnsMap.get(key))); return columnsMap;
				 */
			}
		}
		return null;
	}

	public Map<Integer, String> getColumnsNameFromReturning(String sql) {
		String regExp = "^INSERT.+RETURNING (.+).*$";
		if (sql.matches(regExp)) {
			Pattern pattern = Pattern.compile(regExp);
			Matcher match = pattern.matcher(sql);
			if (match.matches()) {
				String columnsText = match.group(1);
				String[] columns = columnsText.split(COMMA);
				List<String> columnsList = Arrays.asList(columns).stream()
						.map(col -> col.contains("as") ? (col.split(" as "))[1] : col).collect(Collectors.toList());
				Map<Integer, String> columnsMap = IntStream.range(0, columnsList.size()).boxed()
						.collect(Collectors.toMap(Function.identity(), columnsList::get));
				columnsMap.keySet().stream().forEach(key -> System.out.println(key + ":" + columnsMap.get(key)));
				return columnsMap;
			}
		}
		return null;
	}
	
	public Map<Integer, String> getColumnsNameFromReturningSelect(String sql) {
		String regExp = "(?i)SELECT\\s+(\\w+)\\s+FROM";
		/*if (sql.matches(regExp)) {*/
			Pattern pattern = Pattern.compile(regExp);
			Matcher match = pattern.matcher(sql);
			if (match.find()) {
				String columnsText = match.group(1);
				String[] columns = columnsText.split(COMMA);
				List<String> columnsList = Arrays.asList(columns).stream()
						.map(col -> col.contains("as") ? (col.split(" as "))[1] : col).collect(Collectors.toList());
				Map<Integer, String> columnsMap = IntStream.range(0, columnsList.size()).boxed()
						.collect(Collectors.toMap(Function.identity(), columnsList::get));
				columnsMap.keySet().stream().forEach(key -> System.out.println(key + ":" + columnsMap.get(key)));
				return columnsMap;
			}
		/*}*/
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
