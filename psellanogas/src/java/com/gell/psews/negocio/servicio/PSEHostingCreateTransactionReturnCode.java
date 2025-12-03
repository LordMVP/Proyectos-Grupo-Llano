
package com.gell.psews.negocio.servicio;

import javax.xml.bind.annotation.XmlEnum;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for PSEHostingCreateTransactionReturnCode.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * <p>
 * <pre>
 * &lt;simpleType name="PSEHostingCreateTransactionReturnCode">
 *   &lt;restriction base="{http://www.w3.org/2001/XMLSchema}string">
 *     &lt;enumeration value="ERRORS"/>
 *     &lt;enumeration value="OK"/>
 *   &lt;/restriction>
 * &lt;/simpleType>
 * </pre>
 * 
 */
@XmlType(name = "PSEHostingCreateTransactionReturnCode")
@XmlEnum
public enum PSEHostingCreateTransactionReturnCode {

    ERRORS,
    OK;

    public String value() {
        return name();
    }

    public static PSEHostingCreateTransactionReturnCode fromValue(String v) {
        return valueOf(v);
    }

}
