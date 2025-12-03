/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function validar(){
    var correo = $("#ter_correo").val();
    var documento = $("#ter_documento").val();  
    var telefono_celular =$("#ter_telcelular").val(); 
    var expr = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

if(!(/^[1-9]+/.test(documento)) || isNaN(documento))
{alert("El documento no es valido "+documento);
      return false;
}

if(!(/^[1-9]+/.test(telefono_celular)) || isNaN(telefono_celular))
{alert("El telefono celular no es valido "+documento);
      return false;
}
if( !expr.test(correo) ) {
    alert("El correo no es valido"+correo);
  return false;
}
}


