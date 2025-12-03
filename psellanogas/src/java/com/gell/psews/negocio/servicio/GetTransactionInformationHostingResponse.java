
package com.gell.psews.negocio.servicio;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for anonymous complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType>
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="getTransactionInformationHostingResult" type="{http://www.achcolombia.com.co/PSEHostingWS}PSEHostingTransactionInformationReturn" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "", propOrder = {
    "getTransactionInformationHostingResult"
})
@XmlRootElement(name = "getTransactionInformationHostingResponse")
public class GetTransactionInformationHostingResponse {

    protected PSEHostingTransactionInformationReturn getTransactionInformationHostingResult;

    /**
     * Gets the value of the getTransactionInformationHostingResult property.
     * 
     * @return
     *     possible object is
     *     {@link PSEHostingTransactionInformationReturn }
     *     
     */
    public PSEHostingTransactionInformationReturn getGetTransactionInformationHostingResult() {
        return getTransactionInformationHostingResult;
    }

    /**
     * Sets the value of the getTransactionInformationHostingResult property.
     * 
     * @param value
     *     allowed object is
     *     {@link PSEHostingTransactionInformationReturn }
     *     
     */
    public void setGetTransactionInformationHostingResult(PSEHostingTransactionInformationReturn value) {
        this.getTransactionInformationHostingResult = value;
    }

}
