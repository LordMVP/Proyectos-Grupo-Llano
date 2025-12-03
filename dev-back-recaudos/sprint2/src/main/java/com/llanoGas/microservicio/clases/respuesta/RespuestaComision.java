package com.llanoGas.microservicio.clases.respuesta;

import java.util.List;

public class RespuestaComision<T> {
	
	 private	int codigo;
	 
	 private    String mensaje;
	 
	 private List<T> datos ;
	 
	 
	 private Object id ;


	public int getCodigo() {
		return codigo;
	}


	public void setCodigo(int codigo) {
		this.codigo = codigo;
	}


	public String getMensaje() {
		return mensaje;
	}


	public void setMensaje(String mensaje) {
		this.mensaje = mensaje;
	}


	public List<T> getDatos() {
		return datos;
	}


	public void setDatos(List<T> datos) {
		this.datos = datos;
	}


	public Object getId() {
		return id;
	}


	public void setId(Object id) {
		this.id = id;
	}



	 
	 
	 

}
