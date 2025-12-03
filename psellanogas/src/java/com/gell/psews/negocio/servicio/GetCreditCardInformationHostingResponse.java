
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
 *         &lt;element name="getCreditCardInformationHostingResult" type="{http://www.achcolombia.com.co/PSEHostingWS}PSEHostingCreditCardInformationReturn" minOccurs="0"/>
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
    "getCreditCardInformationHostingResult"
})
@XmlRootElement(name = "getCreditCardInformationHostingResponse")
public class GetCreditCardInformationHostingResponse {

    protected PSEHostingCreditCardInformationReturn getCreditCardInformationHostingResult;

    /**
     * Gets the value of the getCreditCardInformationHostingResult property.
     * 
     * @return
     *     possible object is
     *     {@link PSEHostingCreditCardInformationReturn }
     *     
     */
    public PSEHostingCreditCardInformationReturn getGetCreditCardInformationHostingResult() {
        return getCreditCardInformationHostingResult;
    }

    /**
     * Sets the value of the getCreditCardInformationHostingResult property.
     * 
     * @param value
     *     allowed object is
     *     {@link PSEHostingCreditCardInformationReturn }
     *     
     */
    public void setGetCreditCardInformationHostingResult(PSEHostingCreditCardInformationReturn value) {
        this.getCreditCardInformationHostingResult = value;
    }

}
