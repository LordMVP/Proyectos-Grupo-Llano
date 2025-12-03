package com.bioagricola.common.util;

import java.math.BigInteger;
import java.text.SimpleDateFormat;
import java.util.Date;

public class FormaterDataUtil {

	
	public static String convertToString(Object value) {
		String className = value.getClass().getSimpleName();
		System.out.println(className);
		switch (className) {
		case "String": return value.toString();
		case "BigInteger": return ((BigInteger)value).toString();
		case "Integer": return ((Integer)value).toString();
		case "Long": return ((Long)value).toString();
		case "Short": return ((Short)value).toString();
		case "Date": SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");return format.format((Date)value);
		}
		return value.toString();
	}
	
}
