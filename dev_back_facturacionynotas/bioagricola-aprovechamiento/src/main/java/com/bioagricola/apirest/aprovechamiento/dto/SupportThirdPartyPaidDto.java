package com.bioagricola.apirest.aprovechamiento.dto;

import java.util.Date;

/**
 * @author nagredo
 * @project dev_back_aprovechamiento
 * @class SupportThirdPartyPaidDto
 */
public class SupportThirdPartyPaidDto {
    private Integer supportId;
    private Date supportDate;
    private Integer letterId; // id Oficio
    private String letterPaid;
    private String minutes;
    private Date turnDate;
    private Integer periodId;
    private Integer userId;
    private Date registerDate;
    private String observation;

    public Date getSupportDate() {
        return supportDate;
    }

    public void setSupportDate(Date supportDate) {
        this.supportDate = supportDate;
    }

    public Integer getSupportId() {
        return supportId;
    }

    public void setSupportId(Integer supportId) {
        this.supportId = supportId;
    }

    public Integer getLetterId() {
        return letterId;
    }

    public void setLetterId(Integer letterId) {
        this.letterId = letterId;
    }

    public String getLetterPaid() {
        return letterPaid;
    }

    public void setLetterPaid(String letterPaid) {
        this.letterPaid = letterPaid;
    }

    public String getMinutes() {
        return minutes;
    }

    public void setMinutes(String minutes) {
        this.minutes = minutes;
    }

    public Date getTurnDate() {
        return turnDate;
    }

    public void setTurnDate(Date turnDate) {
        this.turnDate = turnDate;
    }

    public Integer getPeriodId() {
        return periodId;
    }

    public void setPeriodId(Integer periodId) {
        this.periodId = periodId;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Date getRegisterDate() {
        return registerDate;
    }

    public void setRegisterDate(Date registerDate) {
        this.registerDate = registerDate;
    }

    public String getObservation() {
        return observation;
    }

    public void setObservation(String observation) {
        this.observation = observation;
    }
}
