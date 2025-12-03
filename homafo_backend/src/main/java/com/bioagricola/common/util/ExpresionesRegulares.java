package com.bioagricola.common.util;

import java.util.regex.Matcher;
import java.util.regex.Pattern; 

public class ExpresionesRegulares
{
	public String expresionRegular1(String palabra,String clave)
    {
        String valor="";
        Pattern pattern = Pattern.compile("(.*?)\\"+clave);
        Matcher m = pattern.matcher(palabra);
        while(m.find())
        {
            valor=m.group(1);
            //System.out.println(m.group(1));
            break;
        }
        return valor;
    } 

}
