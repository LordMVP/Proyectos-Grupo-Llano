
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
 *         &lt;element name="createCreditCardPaymentHostingResult" type="{http://www.achcolombia.com.co/PSEHostingWS}PSEHostingCreateTransactionReturn" minOccurs="0"/>
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
    "createCreditCardPaymentHostingResult"
})
@XmlRootElement(name = "createCreditCardPaymentHostingResponse")
public class CreateCreditCardPaymentHostingResponse {

    protected PSEHostingCreateTransactionReturn createCreditCardPaymentHostingResult;

    /**
     * Gets the value of the createCreditCardPaymentHostingResult property.
     * 
     * @return
     *     possible object is
     *     {@link PSEHostingCreateTransactionReturn }
     *     
     */
    public PSEHostingCreateTransactionReturn getCreateCreditCardPaymentHostingResult() {
        return createCreditCardPaymentHostingResult;
    }

    /**
     * Sets the value of the createCreditCardPaymentHostingResult property.
     * 
     * @param value
     *     allowed object is
     *     {@link PSEHostingCreateTransactionReturn }
     *     
     */
    public void setCreateCreditCardPaymentHostingResult(PSEHostingCreateTransactionReturn value) {
        this.createCreditCardPaymentHostingResult = value;
    }

}
