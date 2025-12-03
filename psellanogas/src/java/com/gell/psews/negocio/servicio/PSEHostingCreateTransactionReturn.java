
package com.gell.psews.negocio.servicio;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for PSEHostingCreateTransactionReturn complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="PSEHostingCreateTransactionReturn">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="ReturnCode" type="{http://www.achcolombia.com.co/PSEHostingWS}PSEHostingCreateTransactionReturnCode"/>
 *         &lt;element name="ErrorMessage" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="PaymentIdentifier" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "PSEHostingCreateTransactionReturn", propOrder = {
    "returnCode",
    "errorMessage",
    "paymentIdentifier"
})
public class PSEHostingCreateTransactionReturn {

    @XmlElement(name = "ReturnCode", required = true)
    protected PSEHostingCreateTransactionReturnCode returnCode;
    @XmlElement(name = "ErrorMessage")
    protected String errorMessage;
    @XmlElement(name = "PaymentIdentifier")
    protected String paymentIdentifier;

    /**
     * Gets the value of the returnCode property.
     * 
     * @return
     *     possible object is
     *     {@link PSEHostingCreateTransactionReturnCode }
     *     
     */
    public PSEHostingCreateTransactionReturnCode getReturnCode() {
        return returnCode;
    }

    /**
     * Sets the value of the returnCode property.
     * 
     * @param value
     *     allowed object is
     *     {@link PSEHostingCreateTransactionReturnCode }
     *     
     */
    public void setReturnCode(PSEHostingCreateTransactionReturnCode value) {
        this.returnCode = value;
    }

    /**
     * Gets the value of the errorMessage property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getErrorMessage() {
        return errorMessage;
    }

    /**
     * Sets the value of the errorMessage property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setErrorMessage(String value) {
        this.errorMessage = value;
    }

    /**
     * Gets the value of the paymentIdentifier property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getPaymentIdentifier() {
        return paymentIdentifier;
    }

    /**
     * Sets the value of the paymentIdentifier property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setPaymentIdentifier(String value) {
        this.paymentIdentifier = value;
    }

}
