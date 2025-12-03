var calificarModel = {};
var simulacionInfo = {datos:  [
	{variable: 'Edad (Años)', tipo: 'I', 'valor': 25, 'calificacion': 1},
	{variable: 'Estado civil', tipo: 'F', 'valor': 'Union libre', 'calificacion': 3},
	{variable: 'Personas a cargo', tipo: 'F', 'valor': 1, 'calificacion': 4},
	{variable: 'Hábito de pago', tipo: 'I', 'valor': 'No reportado', 'calificacion': 5}

]};

var formatoCalificaciones = {
    thead:[
        {'id':'thVariable', 'text':'Variable', 'refer':'nombrevariable', 'type':'text', valueField: 'idvariable'}, 
        {'id':'thValor', 'text':'Valor', 'refer':'valor','type':'function', tdCallback: 'calificarVista.agregarValorVariable'}, 
        {'id':'thValorCalificacion', 'text':'Calificación', 'refer':'calificacion', 'type': 'text'}
    ]
};