package com.bioagricola.common.util;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

import com.bioagricola.common.exception.TechnicalException;

public final class DateUtil {
	
	private static final String BASE_FORMAT = "yyyy-MM-dd"; 
	private static final String EMPTY = ""; 

	private DateUtil() {}
	
	public static Date stringToDate(String format, String date) {
		try {
			return new SimpleDateFormat(format).parse(date);
		} catch (ParseException e) {
			throw new TechnicalException(String.format("Error convirtiendo fecha %s con formato %s", date,format), e.getCause());
		}
	}
	
	public static String dateToString(Date date) {
		if(date==null) 
			return EMPTY;
		return new SimpleDateFormat(BASE_FORMAT).format(date);
	}
	
	public static String getDayOfWeek(Date date) {
		Calendar c = Calendar.getInstance();
		c.setTime(date);
		int dayOfWeek = c.get(Calendar.DAY_OF_WEEK);
		if (dayOfWeek == 1) {
            return "Domingo";
        } else if (dayOfWeek == 2) {
            return "Lunes";
        } else if (dayOfWeek == 3) {
            return "Martes";
        } else if (dayOfWeek == 4) {
            return "Miércoles";
        } else if (dayOfWeek == 5) {
            return "Jueves";
        } else if (dayOfWeek == 6) {
            return "Viernes";
        } else {
            return "Sábado";
        }
	}
	
	public static String dateToString2 (Date fecha )
	{
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        String fechaComoCadena = sdf.format(fecha);
        return fechaComoCadena;
	}
}
