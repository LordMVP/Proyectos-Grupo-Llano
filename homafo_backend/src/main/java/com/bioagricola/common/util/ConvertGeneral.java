package com.bioagricola.common.util;

import java.io.ByteArrayOutputStream;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import com.itextpdf.io.image.ImageData;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Image;

public class ConvertGeneral
{
	public List<HashMap<String, Object>> convertStringToArray(Object valor)
	{
		List<HashMap<String, Object>> total=new ArrayList<>();
		if(valor==null)
		{
			valor="";
		}
		try
		{
			JSONArray array=new JSONArray(String.valueOf(valor));
			for (int i=0; i < array.length(); i++) {
				JSONObject json=array.getJSONObject(i);
				total.add((HashMap)json.toMap());
			}
			return total;
		}catch (JSONException e) {
			System.out.println("Error json "+e);
			return total;
		}
		catch (Exception e) {
			System.out.println("Error normal "+e);
			return total;
		}
		
		
	}
	
	public String convertListToJson(List<?> lista)
	{
		JSONArray json = new JSONArray(lista);
		return json.toString();
	}
	
	public Date convertirStringFechas(String valor)
    {
        try
        {
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
        Date date = formatter.parse(valor);
        return date;
        }catch(ParseException e){
        	System.out.println("error "+e);
        	return null;
        }catch (NullPointerException e) {
			return null;
		}
    }
	
	public LocalDateTime convertirStringFechas2(String valor)
    {
        try
        {
        	DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        	LocalDateTime date = LocalDateTime.parse(valor, formatter);
        return date;
        }catch (NullPointerException e) {
			return null;
		}
    }
	
	public String extraerValorParametro(List<Object[]> lista,String busqueda)
	{
		String resultado="";
		for(Object[] tmp :lista)
		{
			if(tmp[0].toString().equals(busqueda))
			{
				resultado=tmp[1].toString();//((BigInteger) tmp[1]).intValue();
			}
		}
		return resultado;
	}
	
	public String convertImagesToPdf(List<String> lista)
	{
		try
		{
			String base64Encoded="";
			ByteArrayOutputStream baos = new ByteArrayOutputStream();
	        PdfWriter writer = new PdfWriter(baos);
	        PdfDocument pdf = new PdfDocument(writer);	        
	        Document document = new Document(pdf);
	       	        
	        for(String tmp:lista)
	        {
	        	byte[] deco=Base64.getDecoder().decode(tmp);
	        	ImageData datalle = ImageDataFactory.create(deco);
	        	Image imagen = new Image(datalle);
	        	document.add(imagen);
	        }
	        /*
	        Paragraph header = new Paragraph("Imagenes Adjuntadas").setFont(PdfFontFactory.createFont(StandardFonts.HELVETICA)).setFontSize(14);
	        for (int i = 1; i <= pdf.getNumberOfPages(); i++) {
	            Rectangle pageSize = pdf.getPage(i).getPageSize();
	            float x = pageSize.getWidth() / 2;
	            float y = pageSize.getTop() - 20;
	            //document.showTextAligned(header, x, y, i, TextAlignment.LEFT, VerticalAlignment.BOTTOM, 0);
	            document.showTextAligned("Titulo", x, y, TextAlignment.LEFT);
	        }
	        */
	        document.close(); 

	        byte[] bytes = baos.toByteArray();
	        base64Encoded = Base64.getEncoder().encodeToString(bytes);
	        return base64Encoded;
			
		}catch (Exception e) {
			System.out.println("Se genero Error "+e.getMessage());
			return "";
		}
	}

}
