package com.bioagricola.common.repository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.IntStream;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import javax.transaction.Transactional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bioagricola.common.util.SQLBuilderUtil;

@Service
public class GenericSQLRepository {

	@Autowired
	private EntityManager em;

	@Autowired
	private SQLBuilderUtil sqlBuilderUtil;
	
	Logger log = LoggerFactory.getLogger(this.getClass());

	public Optional<List> executeSelect(String sql) {
		Query query = em.createNativeQuery(sql);
		List result = query.getResultList();
		return !result.isEmpty() ? Optional.of(result) : Optional.empty();
	}

	public Optional<List> executeSelect(String sql, Integer limit) {
		Query query = em.createNativeQuery(sql);
		query.setMaxResults(limit);
		List result = query.getResultList();
		return !result.isEmpty() ? Optional.of(result) : Optional.empty();
	}

	public Optional<List<HashMap<String, String>>> executeSelectWithColumnsNamesOneDirection(String sql,List<String> columns) {
		Query query = em.createNativeQuery(sql);
		Map<Integer, String> columnsNames = this.sqlBuilderUtil.getColumnsNamesFromSQLOneDirection(columns);
		List result = query.getResultList();
		return !result.isEmpty() ? Optional.of(this.formatResult(result, columnsNames))
				: Optional.empty();
	}
	
	public Optional<List<HashMap<String, String>>> executeSelectWithColumnsNames(String sql, Integer limit) {
		Query query = em.createNativeQuery(sql);
		if (limit != null && limit > 0) {
			query.setMaxResults(limit);
		}
		Map<Integer, String> columnsNames = this.sqlBuilderUtil.getColumnsNamesFromSQL(sql);
		List result = query.getResultList();
		return !result.isEmpty() ? Optional.of(this.formatResult(result, columnsNames))
				: Optional.empty();
	}
	
	public Optional<List<HashMap<String, String>>> executeSelectWithColumnsNamesWithAs(String sql, Integer limit) {
		Query query = em.createNativeQuery(sql);
		if (limit != null && limit > 0) {
			query.setMaxResults(limit);
		}
		Map<Integer, String> columnsNames = this.sqlBuilderUtil.getColumnsNamesFromSQLWithAs(sql);
		
		List result = query.getResultList();
		return !result.isEmpty() ? Optional.of(this.formatResult(result, columnsNames))
				: Optional.empty();
	}

	public void test(String sql) {
		Query query = em.createNativeQuery(sql);
		query.setMaxResults(10);
		Map<Integer, String> columnsNames = this.sqlBuilderUtil.getColumnsNamesFromSQL(sql);
		List result = query.getResultList();
		this.formatResult(result, columnsNames);

	}

	@SuppressWarnings("unchecked")
	private List<HashMap<String, String>> formatResult(List resultado, Map<Integer, String> columnsNames) {
		List<HashMap<String, String>> rowList = new ArrayList<HashMap<String, String>>();
		resultado.forEach(item -> {
			String itemClass = item.getClass().getSimpleName();
			HashMap<String, String> rowData = new HashMap<String, String>();
			switch (itemClass) {
			case "String":
				rowData.put(columnsNames.get(0), procesarString(item));
				break;
			case "Object[]":
				rowData = procesarObjectArray((Object[]) item, columnsNames);
				break;
			default:
				rowData.put(columnsNames.get(0), procesarString(item));
				break;
			}
			rowList.add(rowData);
		});
		
		 /* rowList.stream().forEach(row -> { row.keySet().stream().forEach(key ->{
		  System.out.println("Key :"+key + " , Value: "+row.get(key)); }); });
		 */
		  return rowList;
	}

	private String procesarString(Object item) {
		return item.toString();
	}

	private HashMap<String, String> procesarObjectArray(Object[] items, Map<Integer, String> columnsNames) {
		HashMap<String, String> rowData = new HashMap<String, String>();
		IntStream.range(0, items.length).forEach(index -> {
			//JLMENDOZA Validar si en la lista llega un NULL
			rowData.put(columnsNames.get(index), items[index] == null ? "0" : items[index].toString());
		});
		return rowData;
	}

	public Optional<Integer> executeInsert(String sql) {
		Query query = em.createNativeQuery(sql);
		Integer lastId = (Integer) query.getSingleResult();
		return lastId != null ? Optional.of(lastId) : Optional.empty();
	}
	
	@Transactional
	public int executeInsertImport(String sql) {
		Query query = em.createNativeQuery(sql);
		int resultado = 0 ;
		resultado = query.executeUpdate();
		return resultado;
	}

	@Transactional
	public Optional<List<HashMap<String, String>>> executeInsertWithReturning(String sql) {
		Map<Integer, String> columnsNames = this.sqlBuilderUtil.getColumnsNameFromReturning(sql);
		Query query = em.createNativeQuery(sql);
		List result = query.getResultList();
		return !result.isEmpty() ? Optional.of(this.formatResult(result, columnsNames))
				: Optional.empty();
		
	}
	
	@Transactional
	public Optional<List<HashMap<String, String>>> executeSelectWithReturning(String sql) {
		Map<Integer, String> columnsNames = this.sqlBuilderUtil.getColumnsNameFromReturningSelect(sql);
		Query query = em.createNativeQuery(sql);
		List result = query.getResultList();
		return !result.isEmpty() ? Optional.of(this.formatResult(result, columnsNames))
				: Optional.empty();
		
	}

	@Transactional
	public Integer executeUpdateWithReturning(String sql) {
		Query query = em.createNativeQuery(sql);
		Integer updates = query.executeUpdate();
		return updates;
		
	}
	

}
