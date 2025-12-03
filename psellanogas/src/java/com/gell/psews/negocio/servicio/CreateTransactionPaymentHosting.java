
package com.gell.psews.negocio.servicio;

import java.math.BigDecimal;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
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
 *         &lt;element name="ticketOfficeID" type="{http://www.w3.org/2001/XMLSchema}int"/>
 *         &lt;element name="amount" type="{http://www.w3.org/2001/XMLSchema}decimal"/>
 *         &lt;element name="vatAmount" type="{http://www.w3.org/2001/XMLSchema}decimal"/>
 *         &lt;element name="paymentID" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="paymentDescription" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="referenceNumber1" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="referenceNumber2" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="referenceNumber3" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="serviceCode" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="email" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="fields" type="{http://www.achcolombia.com.co/PSEHostingWS}ArrayOfPSEHostingField" minOccurs="0"/>
 *         &lt;element name="entity_url" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
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
    "ticketOfficeID",
    "amount",
    "vatAmount",
    "paymentID",
    "paymentDescription",
    "referenceNumber1",
    "referenceNumber2",
    "referenceNumber3",
    "serviceCode",
    "email",
    "fields",
    "entityUrl"
})
@XmlRootElement(name = "createTransactionPaymentHosting")
public class CreateTransactionPaymentHosting {

    protected int ticketOfficeID;
    @XmlElement(required = true)
    protected BigDecimal amount;
    @XmlElement(required = true)
    protected BigDecimal vatAmount;
    protected String paymentID;
    protected String paymentDescription;
    protected String referenceNumber1;
    protected String referenceNumber2;
    protected String referenceNumber3;
    protected String serviceCode;
    protected String email;
    protected ArrayOfPSEHostingField fields;
    @XmlElement(name = "entity_url")
    protected String entityUrl;

    /**
     * Gets the value of the ticketOfficeID property.
     * 
     */
    public int getTicketOfficeID() {
        return ticketOfficeID;
    }

    /**
     * Sets the value of the ticketOfficeID property.
     * 
     */
    public void setTicketOfficeID(int value) {
        this.ticketOfficeID = value;
    }

    /**
     * Gets the value of the amount property.
     * 
     * @return
     *     possible object is
     *     {@link BigDecimal }
     *     
     */
    public BigDecimal getAmount() {
        return amount;
    }

    /**
     * Sets the value of the amount property.
     * 
     * @param value
     *     allowed object is
     *     {@link BigDecimal }
     *     
     */
    public void setAmount(BigDecimal value) {
        this.amount = value;
    }

    /**
     * Gets the value of the vatAmount property.
     * 
     * @return
     *     possible object is
     *     {@link BigDecimal }
     *     
     */
    public BigDecimal getVatAmount() {
        return vatAmount;
    }

    /**
     * Sets the value of the vatAmount property.
     * 
     * @param value
     *     allowed object is
     *     {@link BigDecimal }
     *     
     */
    public void setVatAmount(BigDecimal value) {
        this.vatAmount = value;
    }

    /**
     * Gets the value of the paymentID property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getPaymentID() {
        return paymentID;
    }

    /**
     * Sets the value of the paymentID property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setPaymentID(String value) {
        this.paymentID = value;
    }

    /**
     * Gets the value of the paymentDescription property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getPaymentDescription() {
        return paymentDescription;
    }

    /**
     * Sets the value of the paymentDescription property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setPaymentDescription(String value) {
        this.paymentDescription = value;
    }

    /**
     * Gets the value of the referenceNumber1 property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getReferenceNumber1() {
        return referenceNumber1;
    }

    /**
     * Sets the value of the referenceNumber1 property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setReferenceNumber1(String value) {
        this.referenceNumber1 = value;
    }

    /**
     * Gets the value of the referenceNumber2 property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getReferenceNumber2() {
        return referenceNumber2;
    }

    /**
     * Sets the value of the referenceNumber2 property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setReferenceNumber2(String value) {
        this.referenceNumber2 = value;
    }

    /**
     * Gets the value of the referenceNumber3 property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getReferenceNumber3() {
        return referenceNumber3;
    }

    /**
     * Sets the value of the referenceNumber3 property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setReferenceNumber3(String value) {
        this.referenceNumber3 = value;
    }

    /**
     * Gets the value of the serviceCode property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getServiceCode() {
        return serviceCode;
    }

    /**
     * Sets the value of the serviceCode property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setServiceCode(String value) {
        this.serviceCode = value;
    }

    /**
     * Gets the value of the email property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getEmail() {
        return email;
    }

    /**
     * Sets the value of the email property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setEmail(String value) {
        this.email = value;
    }

    /**
     * Gets the value of the fields property.
     * 
     * @return
     *     possible object is
     *     {@link ArrayOfPSEHostingField }
     *     
     */
    public ArrayOfPSEHostingField getFields() {
        return fields;
    }

    /**
     * Sets the value of the fields property.
     * 
     * @param value
     *     allowed object is
     *     {@link ArrayOfPSEHostingField }
     *     
     */
    public void setFields(ArrayOfPSEHostingField value) {
        this.fields = value;
    }

    /**
     * Gets the value of the entityUrl property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getEntityUrl() {
        return entityUrl;
    }

    /**
     * Sets the value of the entityUrl property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setEntityUrl(String value) {
        this.entityUrl = value;
    }

}
