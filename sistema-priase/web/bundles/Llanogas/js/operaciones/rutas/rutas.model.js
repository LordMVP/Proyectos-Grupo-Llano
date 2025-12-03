/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var rutasModel={
    idSuscripcion: null,
    idPropiedad: null,
    idTercero: null,
    posi: null,
    postra:null,
    tipoRuta : null,
    ideRuta : null,
formatoTablaSuscriptores: {
        //el objeto debe llevar la propiedad thead, que es el arreglo de cabeceras que se mostrarán en la tabla
    thead:[
      //ejemplo de columna

      {
        'id':'thIdsuscriptor',     //id que se asignará a la cabecera
        'text':'Id Suscriptor',   //el texto se mostrará en la cabecera de la columna
        'refer':'idsuscripcion',    //se refiere a la propiedad que se debe buscar en el objeto JSON que se le pasa a la lista
        'type':'text'         //tipo de control (check, radio, button, input, select)
        //'style':{'width':'15%'} //En caso de requerir un estilo diferente para la columna
      },
      {'id':'thpCodigo', 'text':'Codigo Anterior', 'refer':'pcodigo', 'type':'text'},
      {'id':'thnomTercero', 'text':'Tercero', 'refer':'tercero', 'type':'text'},
      {'id':'thtipoPropiedad', 'text':'Tipo Propiedad', 'refer':'tipopropiedad', 'type':'text'},
      {'id':'thidPropiedad', 'text':'ide Propiedad', 'refer':'idpropiedad', 'type':'text' },
      {'id':'thDireccion', 'text':'direccion', 'refer':'direccion', 'type':'text' },
      {'id':'thBarrio', 'text':'barrio', 'refer':'barrio', 'type':'text' },
      {'id':'thMunicipio', 'text':'municipio', 'refer':'municipio', 'type':'text' }
      //{'id':'thVer', 'text':'', 'refer':'verDetalle', 'type':'radio' }
    ]
    },
    
   
    formatoTablaRutasSin: {
        //el objeto debe llevar la propiedad thead, que es el arreglo de cabeceras que se mostrarán en la tabla
    thead:[
      //ejemplo de columna

      {
        'id':'thIdsuscriptor',     //id que se asignará a la cabecera
        'text':'Id Suscriptor',   //el texto se mostrará en la cabecera de la columna
        'refer':'idSuscripcion',    //se refiere a la propiedad que se debe buscar en el objeto JSON que se le pasa a la lista
        'type':'text'         //tipo de control (check, radio, button, input, select)
        //'style':{'width':'15%'} //En caso de requerir un estilo diferente para la columna
      },
     
      {'id':'thnomTercero', 'text':'Tercero', 'refer':'nomTercero', 'type':'text'},
      {'id':'thpCodigo', 'text':'Codigo Anterior', 'refer':'pCodigo', 'type':'text'},
      {'id':'thtipoPropiedad', 'text':'Tipo Propiedad', 'refer':'tipoPropiedad', 'type':'text'},
      {'id':'thidPropiedad', 'text':'ide Propiedad', 'refer':'idPropiedad', 'type':'text' },
      {'id':'thDireccion', 'text':'direccion', 'refer':'direccion', 'type':'text' },
      {'id':'thBarrio', 'text':'barrio', 'refer':'barrio', 'type':'text' },
      {'id':'thMunicipio', 'text':'municipio', 'refer':'municipio', 'type':'text' }
      
      //{'id':'thVer', 'text':'', 'refer':'verDetalle', 'type':'radio' }
    ]
    },
    
    informacionSuscriptores: [],
    informacionRutasSin: [],
    informacionRutasAsignadas: [],
    informacionTrasladaRutas: []
    
};

