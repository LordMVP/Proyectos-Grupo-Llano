package com.bioagricola.apirest.aprovechamiento.servicio.utils;

import com.bioagricola.apirest.modelo.excepciones.NegocioException;

import javax.xml.datatype.DatatypeConfigurationException;
import javax.xml.datatype.DatatypeFactory;
import javax.xml.datatype.XMLGregorianCalendar;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Calendar;
import java.util.Date;
import java.util.Map;
import java.util.TreeMap;

import static com.bioagricola.apirest.aprovechamiento.servicio.utils.ConstantesServicios.ERROR_FORMATO_FECHA;
import java.time.format.DateTimeFormatter;
import static java.time.temporal.TemporalAdjusters.firstDayOfYear;
import static java.time.temporal.TemporalAdjusters.lastDayOfYear;

/**
 * @author jonathan
 * @class DateUtil
 */
public class DateUtil {

    public static XMLGregorianCalendar getDateGregorianCalendar(Date date) {
        String dateString = date.toInstant().toString();
        try {
            return DatatypeFactory.newInstance().newXMLGregorianCalendar(dateString);
        } catch (DatatypeConfigurationException e) {
            return null;
        }
    }

    public static Date getDate(String dateString) throws NegocioException {
        String pattern = "MM-yyyy";
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat(pattern);
        try {
            return simpleDateFormat.parse(dateString);
        } catch (ParseException e) {
            throw new NegocioException(ERROR_FORMATO_FECHA);
        }
    }
    
    public static LocalDate getLocalDate(String dateString) {
        String pattern = "yyyy-MM-dd";
        String [] fecha = dateString.split("-");
        dateString = fecha[1] + "-" + fecha[0] + "-" + "01";
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern(pattern);
        return LocalDate.parse(dateString, formatter);
    }

    /**
     * Dé dos fechas en forma de cadena, encuentre el número de meses de diferencia
     * @param dateStr1
     * @param dateStr2
     * @ regresar meses de diferencia
     * @throws ParseException
     */
    public static int getDistanceMonth(String dateStr1,String dateStr2) throws NegocioException {
        if (dateStr1.equals("") || dateStr2.equals("")){
            throw new NegocioException(ERROR_FORMATO_FECHA);
        }
        try {
            // Analiza el objeto de fecha
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
            Date date1 = sdf.parse(dateStr1);
            Date date2 = sdf.parse(dateStr2);
            // Usa el objeto Calendario para manipular el objeto de fecha
            Calendar c1 = Calendar.getInstance();
            Calendar c2= Calendar.getInstance();
            c1.setTime(date1);
            c2.setTime(date2);
            // Obtenga el número de milisegundos de la fecha, que se utiliza para comparar quién viene primero y quién sigue la fecha
            long time1 = date1.getTime();
            long time2 = date2.getTime();
            // Restar años
            int yearSubtract = c2.get(Calendar.YEAR) - c1.get(Calendar.YEAR);
            // Restar meses
            int monthSubtract = 0;
            // Aplica diferentes fórmulas según la secuencia de fechas
            if (time1 < time2) {
                monthSubtract =c2.get(Calendar.MONTH) - c1.get(Calendar.MONTH) + 1;
            } else {
                monthSubtract =c2.get(Calendar.MONTH) - c1.get(Calendar.MONTH) - 1;
            }

            return (int)Math.abs(yearSubtract * 12 + monthSubtract);
        } catch (ParseException e) {
            throw new NegocioException(ERROR_FORMATO_FECHA);
        }
    }

    public static Date convertToDate(LocalDate dateToConvert) {
        return java.util.Date.from(dateToConvert.atStartOfDay()
                .atZone(ZoneId.systemDefault())
                .toInstant());
    }

    public static Map<LocalDate, LocalDate> calculateYear(LocalDate start, LocalDate end) {
        Map<LocalDate, LocalDate> map = new TreeMap<>();

        while (!start.isAfter(end)) {
            map.put(start.with(firstDayOfYear()), start.with(lastDayOfYear()));

            start = start.plusYears(1);
        }

        map.put(end.with(firstDayOfYear()), end.with(lastDayOfYear()));
        return map;
    }

    public static LocalDate convertToLocalDate(Date date) {
        return Instant.ofEpochMilli(date.getTime())
                .atZone(ZoneId.systemDefault())
                .toLocalDate();
    }


    public static String convertToString(Date dateToConvert) {
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("dd/MM/yyyy");

        return simpleDateFormat.format(dateToConvert);
    }
}
