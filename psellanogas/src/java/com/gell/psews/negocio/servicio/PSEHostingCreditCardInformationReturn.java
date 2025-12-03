
package com.gell.psews.negocio.servicio;

import java.math.BigDecimal;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlSchemaType;
import javax.xml.bind.annotation.XmlType;
import javax.xml.datatype.XMLGregorianCalendar;


/**
 * <p>Java class for PSEHostingCreditCardInformationReturn complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="PSEHostingCreditCardInformationReturn">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="ReturnCode" type="{http://www.achcolombia.com.co/PSEHostingWS}PSEHostingTransactionInformationReturnCode"/>
 *         &lt;element name="ErrorMessage" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="State" type="{http://www.achcolombia.com.co/PSEHostingWS}PSEHostingTransactionState"/>
 *         &lt;element name="PaymentID" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="Amount" type="{http://www.w3.org/2001/XMLSchema}decimal"/>
 *         &lt;element name="VATAmount" type="{http://www.w3.org/2001/XMLSchema}decimal"/>
 *         &lt;element name="PaymentDescription" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="CreditCardCUS" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="ProviderCode" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="ProviderName" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="AuthorizationOrErrorCode" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="Cardtype" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="Reference1" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="Reference2" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="Reference3" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="SolicitedDate" type="{http://www.w3.org/2001/XMLSchema}dateTime"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "PSEHostingCreditCardInformationReturn", propOrder = {
    "returnCode",
    "errorMessage",
    "state",
    "paymentID",
    "amount",
    "vatAmount",
    "paymentDescription",
    "creditCardCUS",
    "providerCode",
    "providerName",
    "authorizationOrErrorCode",
    "cardtype",
    "reference1",
    "reference2",
    "reference3",
    "solicitedDate"
})
public class PSEHostingCreditCardInformationReturn {

    @XmlElement(name = "ReturnCode", required = true)
    protected PSEHostingTransactionInformationReturnCode returnCode;
    @XmlElement(name = "ErrorMessage")
    protected String errorMessage;
    @XmlElement(name = "State", required = true)
    protected PSEHostingTransactionState state;
    @XmlElement(name = "PaymentID")
    protected String paymentID;
    @XmlElement(name = "Amount", required = true)
    protected BigDecimal amount;
    @XmlElement(name = "VATAmount", required = true)
    protected BigDecimal vatAmount;
    @XmlElement(name = "PaymentDescription")
    protected String paymentDescription;
    @XmlElement(name = "CreditCardCUS")
    protected String creditCardCUS;
    @XmlElement(name = "ProviderCode")
    protected String providerCode;
    @XmlElement(name = "ProviderName")
    protected String providerName;
    @XmlElement(name = "AuthorizationOrErrorCode")
    protected String authorizationOrErrorCode;
    @XmlElement(name = "Cardtype")
    protected String cardtype;
    @XmlElement(name = "Reference1")
    protected String reference1;
    @XmlElement(name = "Reference2")
    protected String reference2;
    @XmlElement(name = "Reference3")
    protected String reference3;
    @XmlElement(name = "SolicitedDate", required = true)
    @XmlSchemaType(name = "dateTime")
    protected XMLGregorianCalendar solicitedDate;

    /**
     * Gets the value of the returnCode property.
     * 
     * @return
     *     possible object is
     *     {@link PSEHostingTransactionInformationReturnCode }
     *     
     */
    public PSEHostingTransactionInformationReturnCode getReturnCode() {
        return returnCode;
    }

    /**
     * Sets the value of the returnCode property.
     * 
     * @param value
     *     allowed object is
     *     {@link PSEHostingTransactionInformationReturnCode }
     *     
     */
    public void setReturnCode(PSEHostingTransactionInformationReturnCode value) {
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
     * Gets the value of the state property.
     * 
     * @return
     *     possible object is
     *     {@link PSEHostingTransactionState }
     *     
     */
    public PSEHostingTransactionState getState() {
        return state;
    }

    /**
     * Sets the value of the state property.
     * 
     * @param value
     *     allowed object is
     *     {@link PSEHostingTransactionState }
     *     
     */
    public void setState(PSEHostingTransactionState value) {
        this.state = value;
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
    public BigDecimal getVATAmount() {
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
    public void setVATAmount(BigDecimal value) {
        this.vatAmount = value;
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
     * Gets the value of the creditCardCUS property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCreditCardCUS() {
        return creditCardCUS;
    }

    /**
     * Sets the value of the creditCardCUS property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCreditCardCUS(String value) {
        this.creditCardCUS = value;
    }

    /**
     * Gets the value of the providerCode property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getProviderCode() {
        return providerCode;
    }

    /**
     * Sets the value of the providerCode property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setProviderCode(String value) {
        this.providerCode = value;
    }

    /**
     * Gets the value of the providerName property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getProviderName() {
        return providerName;
    }

    /**
     * Sets the value of the providerName property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setProviderName(String value) {
        this.providerName = value;
    }

    /**
     * Gets the value of the authorizationOrErrorCode property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getAuthorizationOrErrorCode() {
        return authorizationOrErrorCode;
    }

    /**
     * Sets the value of the authorizationOrErrorCode property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setAuthorizationOrErrorCode(String value) {
        this.authorizationOrErrorCode = value;
    }

    /**
     * Gets the value of the cardtype property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getCardtype() {
        return cardtype;
    }

    /**
     * Sets the value of the cardtype property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setCardtype(String value) {
        this.cardtype = value;
    }

    /**
     * Gets the value of the reference1 property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getReference1() {
        return reference1;
    }

    /**
     * Sets the value of the reference1 property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setReference1(String value) {
        this.reference1 = value;
    }

    /**
     * Gets the value of the reference2 property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getReference2() {
        return reference2;
    }

    /**
     * Sets the value of the reference2 property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setReference2(String value) {
        this.reference2 = value;
    }

    /**
     * Gets the value of the reference3 property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getReference3() {
        return reference3;
    }

    /**
     * Sets the value of the reference3 property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setReference3(String value) {
        this.reference3 = value;
    }

    /**
     * Gets the value of the solicitedDate property.
     * 
     * @return
     *     possible object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public XMLGregorianCalendar getSolicitedDate() {
        return solicitedDate;
    }

    /**
     * Sets the value of the solicitedDate property.
     * 
     * @param value
     *     allowed object is
     *     {@link XMLGregorianCalendar }
     *     
     */
    public void setSolicitedDate(XMLGregorianCalendar value) {
        this.solicitedDate = value;
    }

}
