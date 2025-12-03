package com.bioagricola.homologaciones.dto;

import java.io.Serializable;

public class HomologacionResponsePayLoad implements Serializable
{
	private String statusText;
    private Integer statusCode;
    private boolean error;
    
	public HomologacionResponsePayLoad() {
		super();
	}
	public HomologacionResponsePayLoad(String statusText, Integer statusCode, boolean error) {
		super();
		this.statusText = statusText;
		this.statusCode = statusCode;
		this.error = error;
	}
	public String getStatusText() {
		return statusText;
	}
	public void setStatusText(String statusText) {
		this.statusText = statusText;
	}
	public Integer getStatusCode() {
		return statusCode;
	}
	public void setStatusCode(Integer statusCode) {
		this.statusCode = statusCode;
	}
	public boolean isError() {
		return error;
	}
	public void setError(boolean error) {
		this.error = error;
	}
    
    

}