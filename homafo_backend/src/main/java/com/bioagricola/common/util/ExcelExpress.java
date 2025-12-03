package com.bioagricola.common.util;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

public class ExcelExpress {
	static public final int XSS_INCREMENTA = 1;
	static private ExcelExpress excelExpress = null;
	private Workbook libro;
	private Sheet hoja;
	
	private ExcelExpress() {
		
	}
	
	static public ExcelExpress getExcelExpress () {
		if(excelExpress == null) {
			excelExpress= new ExcelExpress();
		}
		return excelExpress;
	}
	
	public void crearLibro() {
		libro = new XSSFWorkbook();		
	}
	
	public void crearHoja(String nombreHoja) {
		this.hoja = libro.createSheet(nombreHoja.length() >  0 ? nombreHoja : "Default");
	}
	
	public void addEncabezado(String[]lista,int numHoja) {
		this.hoja =  libro.getSheetAt(numHoja);
		Row fila = this.hoja.createRow(0);
		Cell celda=fila.createCell(0);
		
		for(int i = 0 ; i < lista.length ; i++) {
			fila.createCell(i).setCellValue(lista[i]);
		}
		
	}	
	public void leerHoja(int numHoja) {
		this.hoja = this.libro.getSheetAt(numHoja);
		Iterator<Row> i = this.hoja.rowIterator();
		while(i.hasNext()) {
			Row r = i.next();
			Iterator<Cell> c = r.cellIterator();
			while(c.hasNext()) {
				Cell cl = c.next();
				System.out.printf("(R%d:C%d) %s \n",cl.getRowIndex()+XSS_INCREMENTA,cl.getColumnIndex()+XSS_INCREMENTA,
						cl.getStringCellValue());
			}			
		}
	}
	
	public int numeroFilas(int numHoja) {
		this.hoja=this.libro.getSheetAt(numHoja);
		return this.hoja.getLastRowNum();
	}
	
	public void escribirHoja(int numHoja,int fila,Map<String, String> datos, Optional<List> response) {
		this.hoja=this.libro.getSheetAt(numHoja);
		Row r = this.hoja.createRow(fila+XSS_INCREMENTA);		
		int index = 0;
		for ( Map.Entry<String,String> e : datos.entrySet() ) {
				Cell c = r.createCell(index);
				c.setCellValue(e.getValue());
		    index++;
		}
		
		if(response.isPresent()) {
			Object[] resultado = (Object []) response.get().get(0);
				for(int i = 0 ; i < resultado.length ; i++)
				{
					Cell c = r.createCell(index);
					c.setCellValue(resultado[i]+"");
					index++;
				}				
		}		
	}
	
	public String evalCellValue(String dat1,String dat2) {
		String respuesta = null;
			if(dat1.replaceAll("\\s","").equalsIgnoreCase(dat2.replaceAll("\\s", ""))) {
				respuesta = "Comparados los nombres Terceros son iguales";
			}else {
				respuesta = "Comparados los nombres Terceros no son iguales";
			}
		return respuesta ;
	}
	
	public void escribirCeldaHoja(int numHoja,int numFila,int numCol,String data) {
		this.hoja = this.libro.getSheetAt(numHoja);
		Row r = this.hoja.getRow(numFila);
		Cell c = r.createCell(numCol);
		c.setCellValue(data);		
	}
	
	public HashMap<String, String> getFilaValores(int numFila) {
		 Row r = this.hoja.getRow(numFila);
		 Iterator<Cell> cl = r.cellIterator();
		 HashMap<String, String> datos = new HashMap<String, String>();
		 while(cl.hasNext()) {
			 Cell c = cl.next();
			 datos.put("Col"+c.getColumnIndex(), c.getStringCellValue());
		 }		 
		 return datos;	
	}
	
	public void escribirLibro(ByteArrayOutputStream out) throws IOException {
		this.libro.write(out);
	}
	
	public void cerrarLibro() throws IOException {
		this.libro.close();
	}
	
}
