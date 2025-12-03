package com.bioagricola.apirest.modelo.utils;

import java.io.Serializable;

/**
 * Clase que reprensenta una excepción como un objeto serializable
 * que será lanzado como parte de la respuesta cuando se presente una excepción
 * @author Asesoftware
 */
public class ResponseError implements Serializable{
        
        private String errorClass;

        private String message;

        public ResponseError(){
        
        }

    public String getErrorClass() {
        return errorClass;
    }

    public void setErrorClass(String errorClass) {
        this.errorClass = errorClass;
    }

    @Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((errorClass == null) ? 0 : errorClass.hashCode());
		result = prime * result + ((message == null) ? 0 : message.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		ResponseError other = (ResponseError) obj;
		if (errorClass == null) {
			if (other.errorClass != null)
				return false;
		} else if (!errorClass.equals(other.errorClass))
			return false;
		if (message == null) {
			if (other.message != null)
				return false;
		} else if (!message.equals(other.message))
			return false;
		return true;
	}

	public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

        
}
