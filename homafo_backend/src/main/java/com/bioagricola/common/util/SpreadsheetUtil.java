package com.bioagricola.common.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

import javax.annotation.PostConstruct;

import lombok.extern.log4j.Log4j2;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.DateUtil;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
//import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.apache.poi.ss.usermodel.WorkbookFactory;
@Log4j2
public class SpreadsheetUtil {
	private File spreadsheet;
	private Sheet currentSheet;
	private Map<String, Integer> columns;
	private InputStream inputStream;

	public SpreadsheetUtil(File file) {
		spreadsheet = file;
		columns = new HashMap<String, Integer>();
		try {
			this.inputStream = new FileInputStream(file);
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}

	public SpreadsheetUtil(InputStream inputStream) {
		this.inputStream = inputStream;
		columns = new HashMap<String, Integer>();
	}

	@PostConstruct
	public void switchToSheet(Integer sheetNum) {
		try (Workbook workbooks = WorkbookFactory.create(inputStream)) {
			currentSheet = workbooks.getSheetAt(sheetNum);
			currentSheet.getRow(0).forEach(cell -> {
				columns.put(cell.getStringCellValue(), cell.getColumnIndex());
			});
		} catch (Exception e) {
			e.printStackTrace();
		}

	}

	public String getCellData(String column, int row) {
		Row dataRow = currentSheet.getRow(row);
		if (dataRow == null) {
			return "";
		}
		return getCellDataAsString(dataRow.getCell(columns.get(column)));
	}

	public Map<String, String> getRowData(int row) {
		Map<String, String> rowInfo = new HashMap<String, String>();
		this.columns.keySet().stream().forEach(col -> {
			rowInfo.put(col, getCellData(col, row));
		});
		return rowInfo;
	}

	public List<Map<String, String>> getDataMatrix(int filaInicio, int filaFin) {
		List<Map<String, String>> matriz = new ArrayList<>();
		List<String> columnas = new ArrayList<>(this.columns.keySet());

		for (int row = filaInicio; row < filaFin; row++) {
			Map<String, String> rowInfo = new HashMap<>();
			for (String col : columnas) {
				rowInfo.put(col, getCellData(col, row));
			}
			matriz.add(rowInfo);
		}

		return matriz;
	}

	private String getCellDataAsString(Cell cell) {
		if (cell == null) {
			return "";
		}else {
			switch (cell.getCellType()) {
			case STRING:
				return cell.getStringCellValue();
			case NUMERIC:
				if (DateUtil.isCellDateFormatted(cell)) {
					SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
					return dateFormat.format(cell.getDateCellValue());
				} else {
					return String.valueOf((long) cell.getNumericCellValue());
				}
			default:
				return "";
			}
		}

	}

	public Map<String, Integer> getColumnsName() {
		return this.columns;
	}

	public Integer getNumRows() {
		//System.out.println("Numero de filas" + currentSheet.getLastRowNum());
		return getNumRowsValidateFirstColumn();
	}

	public Integer getNumRowsValidateFirstColumn() {
		int rowCount = 0;
		Iterator<Row> rowIterator = currentSheet.rowIterator();
		rowCount = 0;
		while (rowIterator.hasNext()) {
			Row row = (Row) rowIterator.next();
			Cell cell = row.getCell(0);
			String cellValue = getCellDataAsString(cell);
			if (cellValue.isEmpty()) {
				break;
			}
			rowCount++;
		}
		//System.out.println("Numero de filas validando la primera columna" + rowCount);
		return rowCount;
	}

	public Integer getFirstRowNum() {
		return currentSheet.getFirstRowNum();
	}
}
