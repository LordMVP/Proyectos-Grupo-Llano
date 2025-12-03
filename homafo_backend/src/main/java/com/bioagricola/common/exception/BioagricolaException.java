package com.bioagricola.common.exception;

public abstract class BioagricolaException extends RuntimeException {
	
	private static final long serialVersionUID = -2216197270619945170L;
	
	public BioagricolaException(String message) {
		this(message, null);
	}
	
	public BioagricolaException(Throwable cause) {
		this(null, cause);
	}
	
	public BioagricolaException(String message, Throwable cause) {
		super(message, cause);
	}
	
}
