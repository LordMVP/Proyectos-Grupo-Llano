
package com.gell.psews.negocio.servicio;

import java.util.ArrayList;
import java.util.List;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlType;


/**
 * <p>Java class for ArrayOfPSEHostingMemberService complex type.
 * 
 * <p>The following schema fragment specifies the expected content contained within this class.
 * 
 * <pre>
 * &lt;complexType name="ArrayOfPSEHostingMemberService">
 *   &lt;complexContent>
 *     &lt;restriction base="{http://www.w3.org/2001/XMLSchema}anyType">
 *       &lt;sequence>
 *         &lt;element name="PSEHostingMemberService" type="{http://www.achcolombia.com.co/PSEHostingWS}PSEHostingMemberService" maxOccurs="unbounded" minOccurs="0"/>
 *       &lt;/sequence>
 *     &lt;/restriction>
 *   &lt;/complexContent>
 * &lt;/complexType>
 * </pre>
 * 
 * 
 */
@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "ArrayOfPSEHostingMemberService", propOrder = {
    "pseHostingMemberService"
})
public class ArrayOfPSEHostingMemberService {

    @XmlElement(name = "PSEHostingMemberService", nillable = true)
    protected List<PSEHostingMemberService> pseHostingMemberService;

    /**
     * Gets the value of the pseHostingMemberService property.
     * 
     * <p>
     * This accessor method returns a reference to the live list,
     * not a snapshot. Therefore any modification you make to the
     * returned list will be present inside the JAXB object.
     * This is why there is not a <CODE>set</CODE> method for the pseHostingMemberService property.
     * 
     * <p>
     * For example, to add a new item, do as follows:
     * <pre>
     *    getPSEHostingMemberService().add(newItem);
     * </pre>
     * 
     * 
     * <p>
     * Objects of the following type(s) are allowed in the list
     * {@link PSEHostingMemberService }
     * 
     * 
     */
    public List<PSEHostingMemberService> getPSEHostingMemberService() {
        if (pseHostingMemberService == null) {
            pseHostingMemberService = new ArrayList<PSEHostingMemberService>();
        }
        return this.pseHostingMemberService;
    }

}
