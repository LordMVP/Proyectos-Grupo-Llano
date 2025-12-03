
package com.gell.psews.negocio.servicio;

import java.math.BigDecimal;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlSchemaType;
import javax.xml.bind.annotation.XmlType;
import javax.xml.datatype.XMLGregorianCalendar;


/**
 * <p>Java class for PSEHostingTransactionInformationReturn complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="PSEHostingTransactionInformationReturn">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="ReturnCode" type="{http://www.achcolombia.com.co/PSEHostingWS}PSEHostingTransactionInformationReturnCode"/>
 *         &lt;element name="ErrorMessage" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="State" type="{http://www.achcolombia.com.co/PSEHostingWS}PSEHostingTransactionState"/>
 *         &lt;element name="PaymentID" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="Amount" type="{http://www.w3.org/2001/XMLSchema}decimal"/>
 *         &lt;element name="VATAmount" type="{http://www.w3.org/2001/XMLSchema}decimal"/>
 *         &lt;element name="BankCode" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="BankName" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="ServiceCode" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="TrazabilityCode" type="{http://www.w3.org/2001/XMLSchema}string" minOccurs="0"/>
 *         &lt;element name="CycleNumber" type="{http://www.w3.org/2001/XMLSchema}int"/>
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
@XmlType(name = "PSEHostingTransactionInformationReturn", propOrder = {
    "returnCode",
    "errorMessage",
    "state",
    "paymentID",
    "amount",
    "vatAmount",
    "bankCode",
    "bankName",
    "serviceCode",
    "trazabilityCode",
    "cycleNumber",
    "reference1",
    "reference2",
    "reference3",
    "solicitedDate"
})
public class PSEHostingTransactionInformationReturn {

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
    @XmlElement(name = "BankCode")
    protected String bankCode;
    @XmlElement(name = "BankName")
    protected String bankName;
    @XmlElement(name = "ServiceCode")
    protected String serviceCode;
    @XmlElement(name = "TrazabilityCode")
    protected String trazabilityCode;
    @XmlElement(name = "CycleNumber")
    protected int cycleNumber;
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
     * Gets the value of the bankCode property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getBankCode() {
        return bankCode;
    }

    /**
     * Sets the value of the bankCode property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setBankCode(String value) {
        this.bankCode = value;
    }

    /**
     * Gets the value of the bankName property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getBankName() {
        return bankName;
    }

    /**
     * Sets the value of the bankName property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setBankName(String value) {
        this.bankName = value;
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
     * Gets the value of the trazabilityCode property.
     * 
     * @return
     *     possible object is
     *     {@link String }
     *     
     */
    public String getTrazabilityCode() {
        return trazabilityCode;
    }

    /**
     * Sets the value of the trazabilityCode property.
     * 
     * @param value
     *     allowed object is
     *     {@link String }
     *     
     */
    public void setTrazabilityCode(String value) {
        this.trazabilityCode = value;
    }

    /**
     * Gets the value of the cycleNumber property.
     * 
     */
    public int getCycleNumber() {
        return cycleNumber;
    }

    /**
     * Sets the value of the cycleNumber property.
     * 
     */
    public void setCycleNumber(int value) {
        this.cycleNumber = value;
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
