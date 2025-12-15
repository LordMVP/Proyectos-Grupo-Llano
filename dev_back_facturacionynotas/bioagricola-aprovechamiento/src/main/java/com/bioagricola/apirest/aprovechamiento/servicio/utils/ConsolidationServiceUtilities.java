package com.bioagricola.apirest.aprovechamiento.servicio.utils;

import javax.xml.bind.DatatypeConverter;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.regex.Pattern;

import static com.bioagricola.apirest.aprovechamiento.servicio.utils.ConstantesServicios.*;

public class ConsolidationServiceUtilities {
    private static String[] unitsArray = {"", "un ", "dos ", "tres ", "cuatro ", "cinco ", "seis ", "siete ", "ocho ", "nueve "};
    private static String[] tensArray = {"diez ", "once ", "doce ", "trece ", "catorce ", "quince ", "dieciseis ", "diecisiete ", "dieciocho ", "diecinueve", "veinte ", "treinta ", "cuarenta ", "cincuenta ", "sesenta ", "setenta ", "ochenta ", "noventa "};
    private static String[] hundredsArray = {"", "ciento ", "doscientos ", "trecientos ", "cuatrocientos ", "quinientos ", "seiscientos ", "setecientos ", "ochocientos ", "novecientos "};

    private ConsolidationServiceUtilities() {
    }

    public static YearMonth getYearMonth(String period) {
        return YearMonth.of(Integer.parseInt(period.substring(3)), Integer.parseInt(period.substring(0, 2)));
    }

    public static Date getDateFromYearMonth(String period) {
        return Date.from(getYearMonth(period).atEndOfMonth().atStartOfDay(ZoneId.systemDefault()).toInstant());
    }

    public static Date getDateFromYearMonth(YearMonth yearMonth) {
        return Date.from(yearMonth.atEndOfMonth().atStartOfDay(ZoneId.systemDefault()).toInstant());
    }

    public static String getConstantTypeUse(String typeUse) {
        typeUse = typeUse == null ? TIPO_APROVECHAMIENTO : typeUse;

        if (typeUse.equals("TIPO_INCENTIVO_APROVECHAMIENTO")) {
            return TIPO_INCENTIVO_APROVECHAMIENTO;
        } else {
            return TIPO_APROVECHAMIENTO;
        }
    }

    public static List<String> getInvoiceStates() {
        List<String> invoiceStates = new ArrayList<>();

        invoiceStates.add(FAC_EST_ACTIVA);
        invoiceStates.add(FAC_EST_CASTIGADA);
        invoiceStates.add(FAC_EST_FINANCIADA);
        invoiceStates.add(FAC_EST_PARAM);
        return invoiceStates;
    }

    public static String convertNumberToString(String number, boolean upperCase) {
        String literal = "";
        String decimalPart;
        number = number.replace(".", ",");

        if (!number.contains(","))
            number = number + ",0";

        if (Pattern.matches("\\d{1,9},\\d{1,2}", number)) {
            String[] num = number.split(",");
            decimalPart = num[1];

            if (Integer.parseInt(num[0]) == 0)
                literal = "cero ";
            else if (Integer.parseInt(num[0]) > 999999)
                literal = getMillions(num[0]);
            else if (Integer.parseInt(num[0]) > 999)
                literal = getMiles(num[0]);
            else if (Integer.parseInt(num[0]) > 99)
                literal = getHundreds(num[0]);
            else if (Integer.parseInt(num[0]) > 9)
                literal = getTens(num[0]);
            else
                literal = getUnits(num[0]);

            if (upperCase)
                return (literal + decimalPart).toUpperCase();
            else
                return (literal + decimalPart);
        } else {
            return null;
        }
    }

    private static String getMillions(String number) {
        String thousands = number.substring(number.length() - 6);
        String million = number.substring(0, number.length() - 6);
        String auxNumber;

        if (million.length() > 1)
            auxNumber = getHundreds(million) + "millones ";
        else
            auxNumber = getUnits(million) + "millon ";

        return auxNumber + getMiles(thousands);
    }

    private static String getMiles(String number) {
        String hundreds = number.substring(number.length() - 3);
        String mile = number.substring(0, number.length() - 3);
        String auxNumber;

        if (Integer.parseInt(mile) > 0) {
            auxNumber = getHundreds(mile);
            return auxNumber + "mil " + getHundreds(hundreds);
        } else {
            return "" + getHundreds(hundreds);
        }

    }

    private static String getHundreds(String num) {
        if (Integer.parseInt(num) > 99) {
            if (Integer.parseInt(num) == 100)
                return " cien ";
            else
                return hundredsArray[Integer.parseInt(num.substring(0, 1))] + getTens(num.substring(1));

        } else {
            return getTens(Integer.parseInt(num) + "");
        }
    }

    private static String getUnits(String number) {
        String num = number.substring(number.length() - 1);

        return unitsArray[Integer.parseInt(num)];
    }

    private static String getTens(String number) {
        int n = Integer.parseInt(number);

        if (n < 10) {
            return getUnits(number);
        } else if (n > 19) {
            String u = getUnits(number);

            if (u.equals(""))
                return tensArray[Integer.parseInt(number.substring(0, 1)) + 8];
            else
                return tensArray[Integer.parseInt(number.substring(0, 1)) + 8] + "y " + u;

        } else {
            return tensArray[n - 10];
        }
    }

    public static String asHex(byte[] bytes) throws NoSuchAlgorithmException {
        MessageDigest md5 = MessageDigest.getInstance("MD5");

        md5.update(bytes);
        return DatatypeConverter.printHexBinary(md5.digest()).toLowerCase();
    }

    public static LocalDate convertToLocalDateViaMillisecond(Date dateToConvert) {
        return Instant.ofEpochMilli(dateToConvert.getTime())
                .atZone(ZoneId.systemDefault())
                .toLocalDate();
    }
}
