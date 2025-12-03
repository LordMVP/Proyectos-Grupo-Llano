/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var formatoEmpleadosCertficaciones = {
    thead: [
        {'id': 'thCodigo', 'text': 'Número Identificación', 'sort': false, 'refer': 'cofi_nitempleado', 'type': 'text'},
        {'id': 'thNombreEmpleado', 'text': 'Nombre Empleado', 'sort': false, 'refer': 'cofi_nomempleado', 'type': 'text'},
        {'id': 'thCompetencia', 'text': 'Competencia', 'sort': false, 'refer': 'nombrecompetencia', 'type': 'text'},
        {'id': 'thVigenciaInicial', 'text': 'Vigencia Inicial', 'sort': false, 'refer': 'cofi_inivigencia', 'type': 'text'},
        {'id': 'thVigenciaFinal', 'text': 'Vigencia Final', 'sort': false, 'refer': 'cofi_finvigencia', 'type': 'text'},
        {'id': 'thCodigoSIC', 'text': 'Código SIC', 'sort': false, 'refer': 'cofi_codigosic', 'type': 'text'},
        {'id': 'thVigenciaInicialSIC', 'text': 'Vigencia Inicial SIC', 'sort': false, 'refer': 'cofi_inivigenciasic', 'type': 'text'},
        {'id': 'thVigenciaFinalSIC', 'text': 'Vigencia Final SIC', 'sort': false, 'refer': 'cofi_finvigenciasic', 'type': 'text'}
    ]
};
var firmasinstaladorasModelo = {
    tercero : null ,
    empleadoscertificaciones:[],
    empleadoscertificacionesGrabar:[],
}


