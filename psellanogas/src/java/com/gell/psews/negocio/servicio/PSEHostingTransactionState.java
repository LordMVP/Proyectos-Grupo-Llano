
package com.gell.psews.negocio.servicio;

import javax.xml.bind.annotation.XmlEnum;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for PSEHostingTransactionState.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * <p>
 * <pre>
 * &lt;simpleType name="PSEHostingTransactionState">
 *   &lt;restriction base="{http://www.w3.org/2001/XMLSchema}string">
 *     &lt;enumeration value="CREATED"/>
 *     &lt;enumeration value="PENDING"/>
 *     &lt;enumeration value="FAILED"/>
 *     &lt;enumeration value="NOT_AUTHORIZED"/>
 *     &lt;enumeration value="OK"/>
 *   &lt;/restriction>
 * &lt;/simpleType>
 * </pre>
 * 
 */
@XmlType(name = "PSEHostingTransactionState")
@XmlEnum
public enum PSEHostingTransactionState {

    CREATED,
    PENDING,
    FAILED,
    NOT_AUTHORIZED,
    OK;

    public String value() {
        return name();
    }

    public static PSEHostingTransactionState fromValue(String v) {
        return valueOf(v);
    }

}
