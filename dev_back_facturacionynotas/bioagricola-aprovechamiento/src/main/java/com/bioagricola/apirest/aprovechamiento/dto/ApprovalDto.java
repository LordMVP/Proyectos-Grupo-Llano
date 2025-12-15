package com.bioagricola.apirest.aprovechamiento.dto;

/**
 * @author nagredo
 * @project dev_back_aprovechamiento
 * @class ApprovalDto
 */
public class ApprovalDto {
    private Boolean state;
    private String message;

    public ApprovalDto() {
    }

    public ApprovalDto(Boolean state, String message) {
        this.state = state;
        this.message = message;
    }

    public Boolean getState() {
        return state;
    }

    public void setState(Boolean state) {
        this.state = state;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
