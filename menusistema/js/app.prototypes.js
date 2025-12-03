/*
String.prototype.simplificarMayus = function() {
	var from = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç",
 	    to   = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc",
      	mapping = {},
      	str = this;
	for(var i = 0, j = from.length; i < j; i++ ){
		mapping[ from.charAt( i ) ] = to.charAt( i );
	}
  	var ret = [];
  	for( var i = 0, j = str.length; i < j; i++ ) {
    	var c = str.charAt( i );
  		if( mapping.hasOwnProperty(str.charAt(i))){
        	ret.push(mapping[c]);
  		}
      	else{
        	ret.push(c);
      	}
  	}
  	var simple = ret.join('');
	return simple.toUpperCase();
};

Array.prototype.compact = function() {
  var item, _i, _len, _results;
  _results = [];
  for (_i = 0; _i < this.length; _i++) {
	item = this[_i];
	if (item) {
	  _results.push(item);
	}
  }
  return _results;
};

Array.prototype.validarExistenciaStrings = function(arrayComparar){
	var coincidencias = 0;
	for (var i = 0; i < this.length; i++) {
		for (var j = 0; j < arrayComparar.length; j++) {
			if (this[i].indexOf(arrayComparar[j])!==-1) {
				coincidencias++;
			}
		}
	}
	//return (coincidencias === arrayComparar.length);
	return (coincidencias >= arrayComparar.length);
};
*/
/** 
 * Obtiene la última letra de una cadena de texto 
 * return{string} Último caracter del string
 **/
if (!String.prototype.endsWith) {
  String.prototype.endsWith = function(searchString, position) {
      var subjectString = this.toString();
      if (position === undefined || position > subjectString.length) {
        position = subjectString.length;
      }
      position -= searchString.length;
      var lastIndex = subjectString.indexOf(searchString, position);
      return lastIndex !== -1 && lastIndex === position;
  };
}

/** 
 * Convierte un número entero a número decimal con 7 decimales
 * return{number} Número decimal
 **/
var parseFloatOriginal = parseFloat;
parseFloat = function(numero){
  return parseFloatOriginal(parseFloatOriginal(numero).toFixed(7));
}

