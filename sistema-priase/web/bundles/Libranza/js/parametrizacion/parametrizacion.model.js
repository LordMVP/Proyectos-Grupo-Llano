var parametrizacionModel = {
	variablesEnviar : []
};
var informacion = [
	{'variable': 'Edad', 'tipo': 'F', 'funcion': 'Funcion', 'idvariable': 5}
];
var formatoVariables = {
	thead: [
		{'id':'thVariable', 'text':'Variable', 'refer':'nombrevariable', 'type':'text'},
		{'id':'thTipo', 'text':'Tipo', 'refer':'tipo', 'type':'function', tdCallback: 'parametrizacionVista.tipoVariable'},
		{'id':'thFuncion', 'text':'Función', 'refer':'nombrefuncion', 'type':'text'},
		{'id':'thEliminar', 'text':'Eliminar', 'refer':'idregistro', 'type':'button', 'style':{'width':'8vw'}},
	]
}