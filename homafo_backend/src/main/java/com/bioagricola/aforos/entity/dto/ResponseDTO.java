package com.bioagricola.aforos.entity.dto;

public class ResponseDTO<T> {
	
	private Boolean success;

	private String message;
	
	private T data;
	
	public ResponseDTO() {
		this.success = Boolean.TRUE;
	}
	
	public ResponseDTO(Boolean success, T data) { 
		this(success, null, data);
	}

	public ResponseDTO(Boolean success, String message) {
		this(success, message, null);
	}
	
	public ResponseDTO(Boolean success, String message, T data) {
		this.success = success;
		this.message = message;
		this.data = data;
	}

	public Boolean getSuccess() {
		return success;
	}

	public void setSuccess(Boolean success) {
		this.success = success;
	}

	public String getMessage() {
		return message;
	}
 
	public void setMessage(String message) {
		this.message = message;
	}

	public T getData() {
		return data;
	}

	public void setData(T data) {
		this.data = data;
	}

}
