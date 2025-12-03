
package com.gell.psews.negocio.servicio;

import java.util.ArrayList;
import java.util.List;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for ArrayOfPSEHostingField complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="ArrayOfPSEHostingField">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="PSEHostingField" type="{http://www.achcolombia.com.co/PSEHostingWS}PSEHostingField" maxOccurs="unbounded" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "ArrayOfPSEHostingField", propOrder = {
    "pseHostingField"
})
public class ArrayOfPSEHostingField {

    @XmlElement(name = "PSEHostingField", nillable = true)
    protected List<PSEHostingField> pseHostingField;

    /**
     * Gets the value of the pseHostingField property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the pseHostingField property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getPSEHostingField().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link PSEHostingField }
     * 
     * 
     */
    public List<PSEHostingField> getPSEHostingField() {
        if (pseHostingField == null) {
            pseHostingField = new ArrayList<PSEHostingField>();
        }
        return this.pseHostingField;
    }

}
