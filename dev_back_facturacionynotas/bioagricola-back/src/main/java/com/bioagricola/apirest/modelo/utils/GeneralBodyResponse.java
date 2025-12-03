package com.bioagricola.apirest.modelo.utils;

import org.springframework.validation.ObjectError;

import java.util.Collection;

/**
 * @author nagredo
 * @project dev_back_facturacionynotas
 * @class GeneralBodyResponse
 */

/**
 * This Class is responsable to create a uniform response to the API.
 *
 * @param <T>
 */
public class GeneralBodyResponse<T> {
	private T data;
	private String message;
	private Collection<ObjectError> errors;
	private Integer auxErrorCode;

	/**
	 * Contructor 1 : message and data response
	 *
	 * @param data    Information or main object
	 * @param message Message for alerts and toast
	 */
	public GeneralBodyResponse(T data, String message) {
		this.data = data;
		this.message = message;
	}

	public GeneralBodyResponse(String message, Integer auxErrorCode) {
		this.message = message;
		this.auxErrorCode = auxErrorCode;
	}

	/**
	 * Contructor 2 : message, data, errores this contruction works when you have to
	 * notify error to the user
	 *
	 * @param data
	 * @param message
	 * @param errors
	 */
	public GeneralBodyResponse(T data, String message, Collection<ObjectError> errors) {
		this.data = data;
		this.message = message;
		this.errors = errors;
	}

	public GeneralBodyResponse(T data, String message, Collection<ObjectError> errors, Integer auxErrorCode) {
		this.data = data;
		this.message = message;
		this.errors = errors;
		this.auxErrorCode = auxErrorCode;
	}

	/**
	 * Contructor 3: No information maybe 204 Response
	 */
	public GeneralBodyResponse() {
	}

	public T getData() {
		return data;
	}

	public void setData(T data) {
		this.data = data;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public Collection<ObjectError> getErrors() {
		return errors;
	}

	public void setErrors(Collection<ObjectError> errors) {
		this.errors = errors;
	}

	public Integer getAuxErrorCode() {
		return auxErrorCode;
	}

	public void setAuxErrorCode(Integer auxErrorCode) {
		this.auxErrorCode = auxErrorCode;
	}
}
