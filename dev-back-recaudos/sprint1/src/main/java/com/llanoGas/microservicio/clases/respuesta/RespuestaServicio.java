package com.llanoGas.microservicio.clases.respuesta;

import java.util.ArrayList;
import java.util.List;

import javassist.expr.NewArray;

public class RespuestaServicio<T> {
	
 private	int codigo;
 
 private    String mensaje;
 
 private List<T> datos ;

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


}
