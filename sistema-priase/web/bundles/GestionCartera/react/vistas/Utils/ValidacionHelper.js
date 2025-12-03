import { MODULO } from '../../store/actions/TiposAcciones';
import { MENSAJES_GESTION_CARTERA } from '../../global/constantes';
/**
 *Método para validar las variables del formulario.
*@returns objeto json
*/
export default {
    // Validaciones de formularios principales
    validaFormulariosPrincipales(formEdicion, condicion, origenComponente, clasificaciones, data) {
        let flag = 0;
        var msn = "";
        
        if (formEdicion) {
            if (origenComponente != MODULO.EDAD_CARTERA
                && origenComponente != MODULO.RESTRICCION_FINANCIACION
                && origenComponente != MODULO.NOVEDAD_VISITA
                && origenComponente != MODULO.META_GESTION
                && origenComponente != MODULO.TABLA_COMISIONAL
                && origenComponente != MODULO.EJECUTIVOS
                && origenComponente != MODULO.VARIABLES_GLOBALES) {

                if (flag > 0) msn = msn + ",";
                if (formEdicion.codigoInterno === "" || formEdicion.codigoInterno === undefined) {
                    if (flag > 0) msn = msn + ",";
                    flag++;
                    msn = msn + " Código ";
                }
                if (formEdicion.nombre === "" || formEdicion.nombre === undefined) {
                    if (flag > 0) msn = msn + ",";
                    flag++;
                    msn = msn + " Nombre ";
                }
                if (formEdicion.descripcion === "" || formEdicion.descripcion === undefined) {
                    if (flag > 0) msn = msn + ",";
                    flag++;
                    msn = msn + " Descripción ";
                }
                if (!formEdicion.idEstado || formEdicion.idEstado === "-1" || formEdicion.idEstado === -1) {
                    if (flag > 0) msn = msn + ", ";
                    flag++;
                    msn = msn + " Estado ";
                }
                if (formEdicion.observacion === "" || formEdicion.observacion === undefined) {
                    if (flag > 0) msn = msn + ",";
                    flag++;
                    msn = msn + " Observación ";
                }
                if (condicion === "" || condicion === undefined) {
                    if (flag > 0) msn = msn + ",";
                    flag++;
                    msn = msn + " Condición ";
                }
            }
            if (origenComponente == MODULO.ESTRATEGIA) {

                if (!clasificaciones || clasificaciones.length === 0) {
                    if (flag > 0) msn = msn + ",";
                    flag++;
                    msn = msn + " Asignación ";
                }
                
            }
            
            if (origenComponente == MODULO.EDAD_CARTERA) {
               
                var existeAmbiguedad = false;
                data.forEach(function (item) {
                    
                    if(formEdicion.edcar_idregistro!=undefined)
                    {
                        if(item.edcar_idregistro != formEdicion.edcar_idregistro){

                            if (item.uni_unidadestado === 3536 && parseInt(formEdicion.uni_unidadutiempo) === parseInt(item.uni_unidadutiempo) && parseFloat(formEdicion.edcar_rangodesde) >= parseFloat(item.edcar_rangodesde) && parseFloat(formEdicion.edcar_rangodesde) <= parseFloat(item.edcar_rangohasta)) {
                                existeAmbiguedad = true
                            }
        
                            if (item.uni_unidadestado === 3536 && parseInt(formEdicion.uni_unidadutiempo) === parseInt(item.uni_unidadutiempo) && parseFloat(formEdicion.edcar_rangohasta) >= parseFloat(item.edcar_rangodesde) && parseFloat(formEdicion.edcar_rangohasta) <= parseFloat(item.edcar_rangohasta)) {
                                existeAmbiguedad = true
                            }
                        }
                    }else{
                        if (item.uni_unidadestado === 3536 && parseInt(formEdicion.uni_unidadutiempo) === parseInt(item.uni_unidadutiempo) && parseFloat(formEdicion.edcar_rangodesde) >= parseFloat(item.edcar_rangodesde) && parseFloat(formEdicion.edcar_rangodesde) <= parseFloat(item.edcar_rangohasta)) {
                            existeAmbiguedad = true
                        }
    
                        if (item.uni_unidadestado === 3536 && parseInt(formEdicion.uni_unidadutiempo) === parseInt(item.uni_unidadutiempo) && parseFloat(formEdicion.edcar_rangohasta) >= parseFloat(item.edcar_rangodesde) && parseFloat(formEdicion.edcar_rangohasta) <= parseFloat(item.edcar_rangohasta)) {
                            existeAmbiguedad = true
                        }
                    }
                

                });

                if (existeAmbiguedad) {
                    if (flag > 0) msn = msn + ",";
                    flag++;
                    msn = msn + MENSAJES_GESTION_CARTERA.MSN_AMBIGUO;
                }

                if (formEdicion.edcar_descripcion === "" || formEdicion.edcar_descripcion === undefined) {
                    if (flag > 0) msn = msn + ",";
                    flag++;
                    msn = msn + " Descripción ";
                }

                if (formEdicion.uni_unidadestado === "-1" || formEdicion.uni_unidadestado === undefined || formEdicion.uni_unidadestado === -1) {
                    if (flag > 0) msn = msn + ",";
                    flag++;
                    msn = msn + " Estado ";
                }

                if (formEdicion.uni_unidadutiempo === -2 || formEdicion.uni_unidadutiempo === undefined || formEdicion.uni_unidadutiempo === "-2") {
                    if (flag > 0) msn = msn + ",";
                    flag++;
                    msn = msn + " Unidad de Tiempo ";
                }

                if (formEdicion.edcar_rangodesde === "" || formEdicion.edcar_rangodesde === undefined) {
                    if (flag > 0) msn = msn + ",";
                    flag++;
                    msn = msn + " Desde ";
                }

                if (formEdicion.edcar_rangohasta === "" || formEdicion.edcar_rangohasta === undefined) {
                    if (flag > 0) msn = msn + ",";
                    flag++;
                    msn = msn + " Hasta ";
                }

                if(parseFloat(formEdicion.edcar_rangodesde) > parseFloat(formEdicion.edcar_rangohasta)){
                    if (flag > 0) msn = msn + ",";
                    flag++;
                    msn = msn + " Hasta debe ser mayor a desde ";
                }
            }

            if (origenComponente == MODULO.RESTRICCION_FINANCIACION) {
                if (formEdicion.usu_ideregistro === "-2" || formEdicion.usu_ideregistro === undefined) {
                    if (flag > 0) msn = msn + ",";
                    flag++;
                    msn = msn + " Usuario ";
                }

                if (formEdicion.prun_ideregistr === "-1" || formEdicion.prun_ideregistr === undefined || formEdicion.prun_ideregistr === -1) {
                    if (flag > 0) msn = msn + ",";
                    flag++;
                    msn = msn + " Proceso ";
                }

                if (formEdicion.luspu_tipo === "-3" || formEdicion.luspu_tipo === undefined || formEdicion.luspu_tipo === -3) {
                    if (flag > 0) msn = msn + ",";
                    flag++;
                    msn = msn + " Tipo Proceso ";
                }
                if (formEdicion.luspu_tipo != "-3" || formEdicion.luspu_tipo != undefined || formEdicion.luspu_tipo != -3) {
                    
                    if(formEdicion.luspu_tipo === "0" || formEdicion.luspu_tipo === 0){
                        if (formEdicion.luspu_limiteporcentaje === "" || formEdicion.luspu_limiteporcentaje === undefined) {
                            if (flag > 0) msn = msn + ",";
                            flag++;
                            msn = msn + " Porcentaje";
                        }
                        if (formEdicion.luspu_limiteporcentaje < 0 || formEdicion.luspu_limiteporcentaje === 0 || formEdicion.luspu_limiteporcentaje === "0" || formEdicion.luspu_limiteporcentaje >100) {
                            if (flag > 0) msn = msn + ",";
                            flag++;
                            msn = msn + " Porcentaje debe ser mayor a cero y menor e igual a 100";
                        }
                    }
                    if(formEdicion.luspu_tipo === "1" || formEdicion.luspu_tipo === 1){
                        if (formEdicion.luspu_limitemonto === "" || formEdicion.luspu_limitemonto === undefined) {
                            if (flag > 0) msn = msn + ",";
                            flag++;
                            msn = msn + " Monto";
                        }
                        if (formEdicion.luspu_limitemonto < 0 || formEdicion.luspu_limitemonto === 0 || formEdicion.luspu_limitemonto === "0") {
                            if (flag > 0) msn = msn + ",";
                            flag++;
                            msn = msn + " Monto debe ser mayor a cero";
                        }
                    }
                    if(formEdicion.luspu_tipo === "2" || formEdicion.luspu_tipo === 2){
                        if (formEdicion.luspu_limiteporcentaje === "" || formEdicion.luspu_limiteporcentaje === undefined) {
                            if (flag > 0) msn = msn + ",";
                            flag++;
                            msn = msn + " Porcentaje";
                        }
                        if (formEdicion.luspu_limiteporcentaje < 0 || formEdicion.luspu_limiteporcentaje === 0 || formEdicion.luspu_limiteporcentaje === "0" || formEdicion.luspu_limiteporcentaje >100) {
                            if (flag > 0) msn = msn + ",";
                            flag++;
                            msn = msn + " Porcentaje debe ser mayor a cero y menor e igual a 100";
                        }
                        if (formEdicion.luspu_limitemonto === "" || formEdicion.luspu_limitemonto === undefined) {
                            if (flag > 0) msn = msn + ",";
                            flag++;
                            msn = msn + " Monto";
                        }
                        if (formEdicion.luspu_limitemonto < 0 || formEdicion.luspu_limitemonto === 0 || formEdicion.luspu_limitemonto === "0") {
                            if (flag > 0) msn = msn + ",";
                            flag++;
                            msn = msn + " Monto debe ser mayor a cero";
                        }
                    }
                }
            }

            if (origenComponente == MODULO.EJECUTIVOS) {
                if (flag > 0) msn = msn + ",";
                if (formEdicion.documento === "" || formEdicion.documento === undefined) {
                    if (flag > 0) msn = msn + ",";
                    flag++;
                    msn = msn + " Tercero Ejecutivo";
                }
                if (formEdicion.nomcompleto === undefined || formEdicion.nomcompleto === "") {
                    if (flag > 0) msn = msn + ",";
                    flag++;
                    msn = msn + " Nombres";
                }
                if (!formEdicion.uni_unidadestado || formEdicion.uni_unidadestado === "-1" || formEdicion.uni_unidadestado === -1) {
                    if (flag > 0) msn = msn + ",";
                    flag++;
                    msn = msn + " Estado";
                }
                if (!formEdicion.uni_unidadclasificacion || formEdicion.uni_unidadclasificacion === "-3" || formEdicion.uni_unidadclasificacion === -3) {
                    if (flag > 0) msn = msn + ",";
                    flag++;
                    msn = msn + " Clasificación";
                }
                if (!formEdicion.uni_unidadestadotgestion || formEdicion.uni_unidadestadotgestion === "-2" || formEdicion.uni_unidadestadotgestion === -2) {
                    if (flag > 0) msn = msn + ", ";
                    flag++;
                    msn = msn + " Tipo Gestión";
                }
                if (!formEdicion.sectores  || formEdicion.sectores.length === 0 ) {
                    if (flag > 0) msn = msn + ", ";
                    flag++;
                    msn = msn + " Sector Comuna";
                }
                if (!formEdicion.eje_fechaingreso || formEdicion.eje_fechaingreso === "") {
                    if (flag > 0) msn = msn + ",";
                    flag++;
                    msn = msn + " Fecha Ingreso";

                }
                if (!formEdicion.eje_fechavencimiento || formEdicion.eje_fechavencimiento === "") {
                    if (flag > 0) msn = msn + ",";
                    flag++;
                    msn = msn + " Fecha Vencimiento";
                }
                if (!formEdicion.tcom_idregistroArray  || formEdicion.tcom_idregistroArray.length === 0 ) {
                    if (flag > 0) msn = msn + ", ";
                    flag++;
                    msn = msn + " Tabla Comisional";
                }
                if (!formEdicion.mges_idregistroArray  || formEdicion.mges_idregistroArray.length === 0 ) {
                    if (flag > 0) msn = msn + ", ";
                    flag++;
                    msn = msn + " Tabla de Metas";
                }
               
                if (formEdicion.eje_fechavencimiento < formEdicion.eje_fechaingreso) {
                    if (flag > 0) msn = msn + ",";
                    flag++;
                    msn = msn + MENSAJES_GESTION_CARTERA.MSN_COMPARACION_FECHA;
                }
            }

            if (origenComponente == MODULO.VARIABLES_GLOBALES) {
                
                if(!formEdicion.vglo_descripcion || formEdicion.vglo_descripcion === "" || formEdicion.vglo_descripcion === undefined)
                {
                    if(flag>0) msn=msn+",";
                    flag++;
                    msn =msn+" Variable Descripción";
                }
                if (formEdicion.uni_unidadestado === "-1" || formEdicion.uni_unidadestado === undefined) {
                    if (flag > 0) msn = msn + ","; 
                    flag++;
                    msn = msn + " Estado ";
                }
                if(!formEdicion.uni_tipodato || formEdicion.uni_tipodato === -7 || formEdicion.uni_tipodato === "-7")
                {
                    if(flag>0) msn=msn+",";
                    flag++;
                    msn =msn+" Tipo Dato Salida";
                }
                if(!formEdicion.uni_unimcarga || formEdicion.uni_unimcarga === -6 || formEdicion.uni_unimcarga === "-6")
                {
                    if(flag>0) msn=msn+",";
                    flag++;
                    msn =msn+" Seleccione un Método de Carga ";
                }
                if(formEdicion.uni_unimcarga || formEdicion.uni_unimcarga != -6 || formEdicion.uni_unimcarga != "-6")
                {
                    if(formEdicion.uni_unimcarga === 3545 || formEdicion.uni_unimcarga === "3545")
                    {
                        if(!formEdicion.uni_atrmaestrocartera || formEdicion.uni_atrmaestrocartera === -2 || formEdicion.uni_atrmaestrocartera === "-2")
                        {
                            if(flag>0) msn=msn+",";
                            flag++;
                            msn =msn+" Seleccione un Atributo Maestro";
                        }
                            
                    }
                    if(formEdicion.uni_unimcarga === 3546 || formEdicion.uni_unimcarga === "3546")
                    {
                        if(!formEdicion.vglo_valorconstante || formEdicion.vglo_valorconstante === "" || formEdicion.vglo_valorconstante === undefined)
                        {
                            if(flag>0) msn=msn+",";
                            flag++;
                            msn =msn+" Valor Constante";
                        }
                            
                    }
                    if(formEdicion.uni_unimcarga === 3547 || formEdicion.uni_unimcarga === "3547")
                    {
                        if(!formEdicion.uni_tipometodo || formEdicion.uni_tipometodo === -3 || formEdicion.uni_tipometodo === "-3")
                        {
                            if(flag>0) msn=msn+",";
                            flag++;
                            msn =msn+" Seleccione un Cálculo de Gestión";
                        }
                        if(!formEdicion.fun_funcionorigen || formEdicion.fun_funcionorigen === -8 || formEdicion.fun_funcionorigen === "-8")
                        {
                            if(flag>0) msn=msn+",";
                            flag++;
                            msn =msn+" Seleccione Origen";
                        }
                    }
                    
                }
                
            }

            
            if (origenComponente == MODULO.META_GESTION) {
                if (flag > 0) msn = msn + ",";
                if (formEdicion.mege_codigointerno === "" || formEdicion.mege_codigointerno === undefined) {
                    if (flag > 0) msn = msn + ",";
                    flag++;
                    msn = msn + " Código ";
                }
                if (formEdicion.mege_descripcion === "" || formEdicion.mege_descripcion === undefined) {
                    if (flag > 0) msn = msn + ",";
                    flag++;
                    msn = msn + " Descripción ";
                }
                if (formEdicion.uni_unidadestado === "-1" || formEdicion.uni_unidadestado === undefined || formEdicion.uni_unidadestado === -1 ) {
                    if (flag > 0) msn = msn + ",";
                    flag++;
                    msn = msn + " Estado ";
                }
                if (formEdicion.uni_unidadcmeta === "-3" || formEdicion.uni_unidadcmeta === undefined) {
                    if (flag > 0) msn = msn + ",";
                    flag++;
                    msn = msn + " Concepto ";
                }
                if (formEdicion.uni_unidadutiempo === "-4" || formEdicion.uni_unidadutiempo === undefined || formEdicion.uni_unidadutiempo === -4) {
                    if (flag > 0) msn = msn + ",";
                    flag++;
                    msn = msn + " Unidad tiempo ";
                }
                if (formEdicion.uni_unidadccontrol === "-2" || formEdicion.uni_unidadccontrol === undefined || formEdicion.uni_unidadccontrol === -2) {
                    if (flag > 0) msn = msn + ",";
                    flag++;
                    msn = msn + " Ciclo Control ";
                }
                if (formEdicion.fun_funcionbmeta === "-5" || formEdicion.fun_funcionbmeta === undefined || formEdicion.fun_funcionbmeta === -5 ) {
                    if (flag > 0) msn = msn + ",";
                    flag++;
                    msn = msn + " Método base ";
                }

                if (formEdicion.fun_funcionlmeta === "-6" || formEdicion.fun_funcionlmeta === undefined || formEdicion.fun_funcionlmeta === -6) {
                    if (flag > 0) msn = msn + ",";
                    flag++;
                    msn = msn + " Método cálculo ";
                }

                if (condicion === "" || condicion === undefined) {
                    if (flag > 0) msn = msn + ",";
                    flag++;
                    msn = msn + " Condición ";
                }
            }

            if (origenComponente == MODULO.TABLA_COMISIONAL) {
                if (flag > 0) msn = msn + ",";
                if (formEdicion.tcom_codigointerno === "" || formEdicion.tcom_codigointerno === undefined) {
                    if (flag > 0) msn = msn + ",";
                    flag++;
                    msn = msn + " Código ";
                }
                if (formEdicion.tcom_descripcion === "" || formEdicion.tcom_descripcion === undefined) {
                    if (flag > 0) msn = msn + ",";
                    flag++;
                    msn = msn + " Descripción ";
                }
                if (formEdicion.uni_unidadestado === "-1" || formEdicion.uni_unidadestado === undefined || formEdicion.uni_unidadestado === -1) {
                    if (flag > 0) msn = msn + ",";
                    flag++;
                    msn = msn + " Estado ";
                }
                if (formEdicion.uni_unidadgcomision === "-3" || formEdicion.uni_unidadgcomision === undefined || formEdicion.uni_unidadgcomision === -3) {
                    if (flag > 0) msn = msn + ",";
                    flag++;
                    msn = msn + " Concepto ";
                }

                if (formEdicion.fun_funcionbcomision === "-4" || formEdicion.fun_funcionbcomision === undefined || formEdicion.fun_funcionbcomision === -4) {
                    if (flag > 0) msn = msn + ",";
                    flag++;
                    msn = msn + " Método base ";
                }

                if (formEdicion.fun_funcionmcomision === "-5" || formEdicion.fun_funcionmcomision === undefined || formEdicion.fun_funcionmcomision === -5) {
                    if (flag > 0) msn = msn + ",";
                    flag++;
                    msn = msn + " Método cálculo ";
                }
                
                if (condicion === "" || condicion === undefined) {
                    if (flag > 0) msn = msn + ",";
                    flag++;
                    msn = msn + " Condición ";
                }
            }

            if (origenComponente == MODULO.NOVEDAD_VISITA) {

                if (flag > 0) msn = msn + ",";
                if (formEdicion.nvis_codigointerno === "" || formEdicion.nvis_codigointerno === undefined) {
                    if (flag > 0) msn = msn + ",";
                    flag++;
                    msn = msn + " Código ";
                }
                if (formEdicion.nvis_nombre === "" || formEdicion.nvis_nombre === undefined) {
                    if (flag > 0) msn = msn + ",";
                    flag++;
                    msn = msn + " Nombre ";
                }
                if (formEdicion.uni_unidadestado === "-1" || formEdicion.uni_unidadestado === undefined || formEdicion.uni_unidadestado === -1 ) {
                    if (flag > 0) msn = msn + ",";
                    flag++;
                    msn = msn + " Estado ";
                }

            }


        }
        else {
            return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Por favor completar el formulario ' } };
        }


        if (existeAmbiguedad) {
            return { respuesta: false, mensaje: { titulo: 'Verifique', mensaje: msn } };
        }

        if (flag > 0) {
            return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Por favor completar:\n ' + msn } };
        } else {
            return { respuesta: true };
        }

    },

    //Validación formulario detalle Meta Gestión
    validaFormMetaGestion(formEdicion) {
        let flag = 0;
        var msn = "";
        if (formEdicion) {
            if (flag > 0) msn = msn + ",";
            if (formEdicion.megd_valorunitario === "" || formEdicion.megd_valorunitario === undefined) {
                if (flag > 0) msn = msn + ",";
                flag++;
                msn = msn + " Valor unitario ";
            }
        }
        else {
            return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Por favor completar el formulario ' } };
        }

        if (flag > 0) {
            return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Por favor completar:\n ' + msn } };
        } else {
            return { respuesta: true };
        }
    },
    //Validación formulario detalle Meta de Gestión Rango
    validaFormMGestionRango(formEdicion) {
        let flag = 0;
        var msn = "";
        if (formEdicion) {
            if (flag > 0) msn = msn + ",";
            if (formEdicion.megd_valordesde === "" || formEdicion.megd_valordesde === undefined) {
                if (flag > 0) msn = msn + ",";
                flag++;
                msn = msn + " Valor desde ";
            }
            if (formEdicion.megd_valorhasta === "" || formEdicion.megd_valorhasta === undefined) {
                if (flag > 0) msn = msn + ",";
                flag++;
                msn = msn + " Valor hasta ";
            }
            if (formEdicion.megd_valorporcentaje === "" || formEdicion.megd_valorporcentaje === undefined) {
                if (flag > 0) msn = msn + ",";
                flag++;
                msn = msn + " Valor porcentaje ";
            }
            if (formEdicion.megd_valorporcentaje != undefined) {
                
                var isValid =  formEdicion.megd_valorporcentaje.match(/^((100(\.0{1,2})?)|(\d{1,2}(\.\d{1,2})?))$/) == null ? false:true;
                if(!isValid){
                    if (flag > 0) msn = msn + ",";
                    flag++;
                    msn = msn + " Recuerde que el % reconocimiento debe ser mayor a cero y menor e igual a 100 ";
                }
                
            }
            if (formEdicion.megd_valordesde != undefined && formEdicion.megd_valordesde < "0" ) {
                if (flag > 0) msn = msn + ",";
                flag++;
                msn = msn + " Recuerde que valor desde debe ser mayor a cero ";
            }
            if (formEdicion.megd_valorhasta != undefined && formEdicion.megd_valorhasta < "0" ) {
                if (flag > 0) msn = msn + ",";
                flag++;
                msn = msn + " Recuerde que valor hasta debe ser mayor a cero ";
            }
        }
        else {
            return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Por favor completar el formulario ' } };
        }

        if (flag > 0) {
            return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Por favor completar:\n ' + msn } };
        } else {
            return { respuesta: true };
        }
    },
    //Validación formulario detalle Novedad Visita
    validaFormNovedadVisita(formEdicion) {
        let flag = 0;
        var msn = "";
        if (formEdicion) {
            if (flag > 0) msn = msn + ",";
            if (formEdicion.nvir_descripcion === "" || formEdicion.nvir_descripcion === undefined) {
                if (flag > 0) msn = msn + ",";
                flag++;
                msn = msn + " Descripción ";
            }
            if (formEdicion.uni_unidadtrecurso === "-1" || formEdicion.uni_unidadtrecurso === undefined || formEdicion.uni_unidadtrecurso === -1) {
                if (flag > 0) msn = msn + ",";
                flag++;
                msn = msn + " Tipo Recurso ";
            }
            if (formEdicion.nvir_esobligatorio === "" || formEdicion.nvir_esobligatorio === undefined) {
                if (flag > 0) msn = msn + ",";
                flag++;
                msn = msn + " Obligatorio ";
            }
        }
        else {
            return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Por favor completar el formulario ' } };
        }

        if (flag > 0) {
            return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Por favor completar:\n ' + msn } };
        } else {
            return { respuesta: true };
        }
    },
     //Validación formulario detalle Tabla comisional Rango
     validaFormTComRango(formEdicion) {
        let flag = 0;
        var msn = "";
        if (formEdicion) {
            if (flag > 0) msn = msn + ",";
            if (formEdicion.tcomd_valordesde === "" || formEdicion.tcomd_valordesde === undefined) {
                if (flag > 0) msn = msn + ",";
                flag++;
                msn = msn + " Valor desde ";
            }
            if (formEdicion.tcomd_valorhasta === "" || formEdicion.tcomd_valorhasta === undefined) {
                if (flag > 0) msn = msn + ",";
                flag++;
                msn = msn + " Valor hasta ";
            }
            if (formEdicion.tcomd_valorporcentaje === "" || formEdicion.tcomd_valorporcentaje === undefined) {
                if (flag > 0) msn = msn + ",";
                flag++;
                msn = msn + " Valor porcentaje ";
            }
            if (formEdicion.tcomd_valorporcentaje != undefined) {
                
                var isValid =  formEdicion.tcomd_valorporcentaje.match(/^((100(\.0{1,2})?)|(\d{1,2}(\.\d{1,2})?))$/) == null ? false:true;
                if(!isValid){
                    if (flag > 0) msn = msn + ",";
                    flag++;
                    msn = msn + " Recuerde que el % reconocimiento debe ser mayor a cero y menor e igual a 100 ";
                }
                
            }
            if (formEdicion.tcomd_valordesde != undefined && formEdicion.tcomd_valordesde < "0" ) {
                if (flag > 0) msn = msn + ",";
                flag++;
                msn = msn + " Recuerde que valor desde debe ser mayor a cero ";
            }
            if (formEdicion.tcomd_valorhasta != undefined && formEdicion.tcomd_valorhasta < "0" ) {
                if (flag > 0) msn = msn + ",";
                flag++;
                msn = msn + " Recuerde que valor hasta debe ser mayor a cero ";
            }
        }
        else {
            return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Por favor completar el formulario ' } };
        }

        if (flag > 0) {
            return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Por favor completar:\n ' + msn } };
        } else {
            return { respuesta: true };
        }
    },
     //Validación formulario detalle Tabla comisional valor unitario
    validaFormTComValor(formEdicion) {
        let flag = 0;
        var msn = "";
        if (formEdicion) {
            if (flag > 0) msn = msn + ",";
            if (formEdicion.tcomd_valorunitario === "" || formEdicion.tcomd_valorunitario === undefined) {
                if (flag > 0) msn = msn + ",";
                flag++;
                msn = msn + " Valor unitario ";
            }
        }
        else {
            return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Por favor completar el formulario ' } };
        }

        if (flag > 0) {
            return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Por favor completar:\n ' + msn } };
        } else {
            return { respuesta: true };
        }
    },
    //Validación formulario condicionales
    validaFormCondiciones(formEdicion) {
        let flag = 0;
        var msn = "";
        if (formEdicion) {
            if (flag > 0) msn = msn + ",";
            
            if (formEdicion.vglo_variable === "" || formEdicion.vglo_variable === undefined || formEdicion.vglo_variable === "Seleccione Variable Global") {
                if (flag > 0) msn = msn + ",";
                flag++;
                msn = msn + " Variable a Evaluar ";
            }
            if (formEdicion.uni_unidadcondicion === "" || formEdicion.uni_unidadcondicion === undefined || formEdicion.uni_unidadcondicion === "Seleccione Concepto")  {
                if (flag > 0) msn = msn + ",";
                flag++;
                msn = msn + " Condicional ";
            }
            if (formEdicion.valor === "" || formEdicion.valor === undefined) {
                if (flag > 0) msn = msn + ",";
                flag++;
                msn = msn + " Valor ";
            }
            if (formEdicion.operador === "" || formEdicion.operador === undefined) {
                if (flag > 0) msn = msn + ",";
                flag++;
                msn = msn + " Operador Lógico ";
            }
        }
        else {
            return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Por favor completar información para condición ' } };
        }

        if (flag > 0) {
            return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Por favor completar:\n ' + msn } };
        } else {
            return { respuesta: true };
        }
    },
    //Validación formulario maestro gestión filtros
    validaFormMaestroGestion(formEdicionMG, formEdicionInfoBasicaMG, formEdicionInfoGestionMG, formEdicionInfoGestionVisitaMG) {
        let flag = 0;
        var msn = "";
        
        if (formEdicionMG) {
            if (flag > 0) msn = msn + ",";
            
            if (formEdicionMG.mges_descripcion === "" || formEdicionMG.mges_descripcion === undefined) {
                if (flag > 0) msn = msn + ",";
                flag++;
                msn = msn + " Descripción Filtro ";
            }
            if (formEdicionMG.mges_filtroprivado === "" || formEdicionMG.mges_filtroprivado === undefined || formEdicionMG.mges_filtroprivado === "-1" || formEdicionMG.mges_filtroprivado === -1)  {
                if (flag > 0) msn = msn + ",";
                flag++;
                msn = msn + " Tipo Filtro ";
            }
            if (formEdicionInfoBasicaMG.mges_fechomhasta < formEdicionInfoBasicaMG.mges_fechomdesde) {
                if (flag > 0) msn = msn + ",";
                flag++;
                msn = msn + " Fecha de homolgación hasta no puede ser menor a fecha homologación desde ";
            }
            if (formEdicionInfoGestionMG.mges_deudadesde != undefined && parseFloat(formEdicionInfoGestionMG.mges_deudadesde) < "0" ) {
                if (flag > 0) msn = msn + ",";
                flag++;
                msn = msn + " Recuerde que valor deuda desde debe ser mayor a cero ";
            }
            if (formEdicionInfoGestionMG.mges_deudahasta != undefined && parseFloat(formEdicionInfoGestionMG.mges_deudahasta) < "0" ) {
                if (flag > 0) msn = msn + ",";
                flag++;
                msn = msn + " Recuerde que valor deuda hasta debe ser mayor a cero ";
            }
            if(parseFloat(formEdicionInfoGestionMG.mges_deudadesde) > parseFloat(formEdicionInfoGestionMG.mges_deudahasta)){
                if (flag > 0) msn = msn + ",";
                flag++;
                msn = msn + " Valor deuda hasta debe ser mayor a valor deuda desde ";
            }
            if (formEdicionInfoGestionMG.mges_factvencidadesde != undefined && parseFloat(formEdicionInfoGestionMG.mges_factvencidadesde) < "0" ) {
                if (flag > 0) msn = msn + ",";
                flag++;
                msn = msn + " Recuerde que cantidad factura vencida desde debe ser mayor a cero ";
            }
            if (formEdicionInfoGestionMG.mges_factvencidahasta != undefined && parseFloat(formEdicionInfoGestionMG.mges_factvencidahasta) < "0" ) {
                if (flag > 0) msn = msn + ",";
                flag++;
                msn = msn + " Recuerde que cantidad factura vencida hasta debe ser mayor a cero ";
            }
            if(parseFloat(formEdicionInfoGestionMG.mges_factvencidadesde) > parseFloat(formEdicionInfoGestionMG.mges_factvencidahasta)){
                if (flag > 0) msn = msn + ",";
                flag++;
                msn = msn + " Cantidad factura vencida hasta debe ser mayor a cantidad factura vencida desde ";
            }
            
            if (formEdicionInfoGestionVisitaMG.mges_cvisitadesde != undefined && parseFloat(formEdicionInfoGestionVisitaMG.mges_cvisitadesde) < "0" ) {
                if (flag > 0) msn = msn + ",";
                flag++;
                msn = msn + " Recuerde que cantidad visita desde debe ser mayor a cero ";
            }
            if (formEdicionInfoGestionVisitaMG.mges_cvisitahasta != undefined && parseFloat(formEdicionInfoGestionVisitaMG.mges_cvisitahasta) < "0" ) {
                if (flag > 0) msn = msn + ",";
                flag++;
                msn = msn + " Recuerde que cantidad visita hasta debe ser mayor a cero ";
            }
            if(formEdicionInfoGestionVisitaMG.mges_cvisitadesde != undefined && formEdicionInfoGestionVisitaMG.mges_cvisitahasta != undefined && parseFloat(formEdicionInfoGestionVisitaMG.mges_cvisitadesde) > parseFloat(formEdicionInfoGestionVisitaMG.mges_cvisitahasta)){
                if (flag > 0) msn = msn + ",";
                flag++;
                msn = msn + " Cantidad visita hasta debe ser mayor a cantidad visita desde ";
            }
            
            if(formEdicionInfoGestionVisitaMG.mges_fvisitadesde!= undefined && formEdicionInfoGestionVisitaMG.mges_fvisitadesde > formEdicionInfoGestionVisitaMG.mges_fvisitahasta){
                if (flag > 0) msn = msn + ",";
                flag++;
                msn = msn + " Fecha vista hasta ser mayor a fecha visita desde ";
            }
            
        }
        else {
            return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Por favor completar información del filtro' } };
        }

        if (flag > 0) {
            return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Por favor completar:\n ' + msn } };
        } else {
            return { respuesta: true };
        }
    },
    //Validación formulario buscar filtro maestro gestion
    validaBusquedaMaestroGestion(formEdicionMG) {
        let flag = 0;
        var msn = "";
        if (formEdicionMG) {
            if (flag > 0) msn = msn + ",";
            
            if (formEdicionMG.mges_idregistro === "" || formEdicionMG.mges_idregistro === undefined || formEdicionMG.mges_idregistro === "-2" || formEdicionMG.mges_idregistro === -2)  {
                if (flag > 0) msn = msn + ",";
                flag++;
                msn = msn + " Por favor seleccione un filtro para realizar la búsqueda";
            }
            
        }
        else {
            return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Por favor seleccione un filtro para realizar la búsqueda' } };
        }

        if (flag > 0) {
            return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: msn } };
        } else {
            return { respuesta: true };
        }
    },
    //Validación formulario Inicializar Gestión
    validaFormIniciarGestion(formEdicionIG) {
        let flag = 0;
        var msn = "";
        if (formEdicionIG) {
            if (flag > 0) msn = msn + ",";
            
            if (formEdicionIG.cic_ideregistro === "" || formEdicionIG.cic_ideregistro === undefined || formEdicionIG.cic_ideregistro === "-1" || formEdicionIG.cic_ideregistro === -1)  {
                if (flag > 0) msn = msn + ",";
                flag++;
                msn = msn + " Ciclo Control";
            }
            if (formEdicionIG.per_ideregistro === "" || formEdicionIG.per_ideregistro === undefined || formEdicionIG.per_ideregistro === "-2" || formEdicionIG.cic_ideregistro === -2)  {
                if (flag > 0) msn = msn + ",";
                flag++;
                msn = msn + " Periodo";
            }
            
        }
        else {
            return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Por favor completar el formulario' } };
        }

        if (flag > 0) {
            return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: msn } };
        } else {
            return { respuesta: true };
        }
    },
    //Validación formulario ejcutar filtro maestro gestion
    validaEjecutarFiltro(formEdicionMG,formEdicionFooterMG) {
        let flag = 0;
        var msn = "";
        if (formEdicionMG && formEdicionFooterMG) {
            if (flag > 0) msn = msn + ",";
            
            if (formEdicionMG.mges_idregistro === "" || formEdicionMG.mges_idregistro === undefined || formEdicionMG.mges_idregistro === "-2" || formEdicionMG.mges_idregistro === -2)  {
                if (flag > 0) msn = msn + ",";
                flag++;
                msn = msn + "filtro";
            }
            if (formEdicionFooterMG.mges_vista === "" || formEdicionFooterMG.mges_vista === undefined || formEdicionFooterMG.mges_vista === "-6" || formEdicionFooterMG.mges_vista === -6)  {
                if (flag > 0) msn = msn + ",";
                flag++;
                msn = msn + " vista";
            }
            
        }
        else {
            return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Por favor seleccione un filtro y una vista para ejcutar el filtro' } };
        }

        if (flag > 0) {
            return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: msn } };
        } else {
            return { respuesta: true };
        }
    },
    //Validación campos buscar tercero en el maestro gestion
    validaBusquedaTerceroMG(formEdicionMG) {
        let flag = 0;
        let flag1 = 0;
        
        var msn = "";
        if (formEdicionMG) {
            if (flag > 0) msn = msn + ",";
            
            if (formEdicionMG.dsus_ideregistr != "" && formEdicionMG.dsus_ideregistr != undefined )  {
                flag1++;
            }
            if (formEdicionMG.dsus_pcodigo != "" && formEdicionMG.dsus_pcodigo != undefined)  {
                flag1++;
            }
            if (formEdicionMG.ter_idregistro != "" && formEdicionMG.ter_idregistro != undefined)  {
                flag1++;
            }

            if (flag1 === 0) {
                flag++;
                msn = "Por favor diligenciar alguno de los siguientes campos: Id Suscripción, Código Cliente, Documento Cliente para realizar la busqueda";
            }
            
        }
        else {
            return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: ' Por favor diligenciar alguno de los siguientes campos: Id Suscripción, Código Cliente, Documento Cliente para realizar la busqueda' } };
        }

        if (flag > 0) {
            return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: msn } };
        } else {
            return { respuesta: true };
        }
    },
    //Validación formulario asignacion y distribución maestro gestion
    validaAsignacionMaestroGestion(formAsignacion,Seleccionados,accion) {
        
        let flag = 0;
        var msn = "";
        if(accion==="A"){
            if (formAsignacion) {
                if (flag > 0) msn = msn + ",";
                
                if (formAsignacion.ejecutivos === undefined || formAsignacion.ejecutivos.length === 0 )  {
                    if (flag > 0) msn = msn + ",";
                    flag++;
                    msn = msn + " ejecutivos";
                }

                if (Seleccionados.length === 0)  {
                    if (flag > 0) msn = msn + ",";
                    flag++;
                    msn = msn + " Selecionar registros de la tabla";
                }
                
                if (formAsignacion.checkAD1 === undefined && formAsignacion.checkAD2 === undefined && formAsignacion.checkAD3 === undefined){
                    if (flag > 0) msn = msn + ",";
                        flag++;
                        msn = msn + " Seleccionar una de las opciones para la asignación";
                }

                if (formAsignacion.checkAD1 != undefined && formAsignacion.checkAD2 != undefined && formAsignacion.checkAD3 != undefined){
                    if (!formAsignacion.checkAD1 && !formAsignacion.checkAD2 && !formAsignacion.checkAD3){
                        if (flag > 0) msn = msn + ",";
                        flag++;
                        msn = msn + " Seleccionar una de las opciones para la asignación";
                    }
                }
                if (formAsignacion.checkAD2 != undefined && (formAsignacion.checkAD2 === "true" || formAsignacion.checkAD2 === true))  {
                    if (formAsignacion.cantidadDias === undefined || formAsignacion.cantidadDias === "")  {
                        if (flag > 0) msn = msn + ",";
                        flag++;
                        msn = msn + " Tiempo de Precedencia Dias";
                    }
                   
                    let dato=parseFloat(formAsignacion.cantidadDias)
                    if (formAsignacion.cantidadDias != undefined)  {
                        if (dato <= 0)  {
                            if (flag > 0) msn = msn + ",";
                            flag++;
                            msn = msn + " Tiempo de Precedencia Dias debe ser mayor a cero";
                        }
                        
                        
                    }
                }
            }
            else {
                return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Por favor seleccione un filtro para realizar la búsqueda' } };
            }
        }
        if(accion==="C" || accion==="R" ){
           
            if (Seleccionados.length === 0)  {
                if (flag > 0) msn = msn + ",";
                flag++;
                msn = msn + " Selecionar registros de la tabla";
            }
        
        }

        if (flag > 0) {
            return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: msn } };
        } else {
            return { respuesta: true };
        }
    },
    //Validación formulario gestion de visitamaestro gestion
    validaFormGestionVisita(formGestionV) {
        let flag = 0;
        var msn = "";
       
            if (formGestionV) {
                if (flag > 0) msn = msn + ",";
                
                if (formGestionV.nvis_idregistro === "" || formGestionV.nvis_idregistro === undefined || formGestionV.nvis_idregistro === "-2" || formGestionV.nvis_idregistro === -2)  {
                    if (flag > 0) msn = msn + ",";
                    flag++;
                    msn = msn + "Novedad Visita";
                }

                if (formGestionV.gvis_fechavisita === "" || formGestionV.gvis_fechavisita === undefined || formGestionV.gvis_fechavisita === " " )  {
                    if (flag > 0) msn = msn + ",";
                    flag++;
                    msn = msn + "Fecha Visita";
                }

                if (formGestionV.gvis_observacion === "" || formGestionV.gvis_observacion === undefined || formGestionV.gvis_observacion === " ")  {
                    if (flag > 0) msn = msn + ",";
                    flag++;
                    msn = msn + "Observación";
                }
     
            }
            else {
                return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Por favor seleccione un filtro para realizar la búsqueda' } };
            }
        

        if (flag > 0) {
            return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: msn } };
        } else {
            return { respuesta: true };
        }
    },
    //Validación generación de Cartas Masivas
    validaGenerarCarta(formEdicionFooterMG,Seleccionados) {
        let flag = 0;
        var msn = "";
       
            if (formEdicionFooterMG) {
                if (flag > 0) msn = msn + ",";
                
                if (formEdicionFooterMG.mges_carta === "" || formEdicionFooterMG.mges_carta === undefined || formEdicionFooterMG.mges_carta === "-8" || formEdicionFooterMG.mges_carta === -8)  {
                    if (flag > 0) msn = msn + ",";
                    flag++;
                    msn = msn + " Tipo Carta";
                }

                if (Seleccionados.length === 0)  {
                    if (flag > 0) msn = msn + ",";
                    flag++;
                    msn = msn + " Selecionar registros de la tabla";
                }
     
            }
            else {
                return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Por favor seleccione una carta' } };
            }
        

        if (flag > 0) {
            return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: msn } };
        } else {
            return { respuesta: true };
        }
    },
    //Validación par generación de IVR
    validaGenerarIvr(Seleccionados) {
        let flag = 0;
        var msn = "";
       if (Seleccionados.length === 0)  {
            if (flag > 0) msn = msn + ",";
            flag++;
            msn = msn + " Selecionar registros de la tabla";
        }
        if (flag > 0) {
            return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: msn } };
        } else {
            return { respuesta: true };
        }
    },
    //Validación formulario Inicializar Gestión
    validaFormIniciarLiquidacion(formEdicion) {
        let flag = 0;
        var msn = "";
        if (formEdicion) {
            if (flag > 0) msn = msn + ",";
            
            if (formEdicion.mliq_ciclo === "" || formEdicion.mliq_ciclo === undefined || formEdicion.mliq_ciclo === "-1" || formEdicion.mliq_ciclo === -1)  {
                if (flag > 0) msn = msn + ",";
                flag++;
                msn = msn + " Ciclo Control";
            }
            if (formEdicion.mliq_periodo === "" || formEdicion.mliq_periodo === undefined || formEdicion.mliq_periodo === "-2" || formEdicion.mliq_periodo === -2)  {
                if (flag > 0) msn = msn + ",";
                flag++;
                msn = msn + " Periodo";
            }
            
        }
        else {
            return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Por favor completar el formulario' } };
        }

        if (flag > 0) {
            return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: msn } };
        } else {
            return { respuesta: true };
        }
    },
    //Validación formulario Modal Abono para liquidación comisión
    validaFormAbonoLC(formEdicion) {
        let flag = 0;
        var msn = "";
        if (formEdicion) {
            if (flag > 0) msn = msn + ",";
            
            if (formEdicion.mliq_valorbono === "" || formEdicion.mliq_valorbono === undefined)  {
                if (flag > 0) msn = msn + ",";
                flag++;
                msn = msn + " Valor Abono";
            }
            
        }
        else {
            return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Por favor completar el formulario' } };
        }

        if (flag > 0) {
            return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: msn } };
        } else {
            return { respuesta: true };
        }
    },
    //Validación formulario consulta liquidación comisiones
    validaFormConsultaLC(formEdicion) {
        let flag = 0;
        var msn = "";
        if (formEdicion) {
            if (flag > 0) msn = msn + ",";
            
            if (formEdicion.mliq_periodo === "" || formEdicion.mliq_periodo === undefined || formEdicion.mliq_periodo === "-2" || formEdicion.mliq_periodo === -2)  {
                if (flag > 0) msn = msn + ",";
                flag++;
                msn = msn + " Seleccionar Periodo";
            }
            if (formEdicion.ejecutivos === undefined || formEdicion.ejecutivos.length === 0)  {
                if (flag > 0) msn = msn + ",";
                flag++;
                msn = msn + " Seleccionar personas liquidadas";
            }
            
        }
        else {
            return { respuesta: false, mensaje: { titulo: 'Datos incompletos para consultar', mensaje: 'Por favor completar el formulario' } };
        }

        if (flag > 0) {
            return { respuesta: false, mensaje: { titulo: 'Datos incompletos para consultar', mensaje: msn } };
        } else {
            return { respuesta: true };
        }
    },
    //Validación formulario recalcular liquidación comisiones
    validaFormRecalcularLC(formEdicion,seleccionados) {
        let flag = 0;
        var msn = "";
        if (formEdicion) {
            if (flag > 0) msn = msn + ",";
            
            if (formEdicion.mliq_periodo === "" || formEdicion.mliq_periodo === undefined || formEdicion.mliq_periodo === "-2" || formEdicion.mliq_periodo === -2)  {
                if (flag > 0) msn = msn + ",";
                flag++;
                msn = msn + " Seleccionar Periodo";
            }
            if (seleccionados.length === 0)  {
                if (flag > 0) msn = msn + ",";
                flag++;
                msn = msn + " Seleccionar registros de la tabla";
            }
            
        }
        else {
            return { respuesta: false, mensaje: { titulo: 'Datos incompletos para consultar', mensaje: 'Por favor completar el formulario' } };
        }

        if (flag > 0) {
            return { respuesta: false, mensaje: { titulo: 'Datos incompletos para consultar', mensaje: msn } };
        } else {
            return { respuesta: true };
        }
    },//Validación formulario recalcular liquidación comisiones
    validaFormConfirmarLC(Seleccionados) {
        let flag = 0;
        var msn = "";
       if (Seleccionados.length === 0)  {
            if (flag > 0) msn = msn + ",";
            flag++;
            msn = msn + " Selecionar registros de la tabla";
        }
        if (flag > 0) {
            return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: msn } };
        } else {
            return { respuesta: true };
        }
    },
    //Validación formulario Inicializar Gestión
    validaFormIniciarDeterioro(formEdicion) {
        let flag = 0;
        var msn = "";
        if (formEdicion) {
            if (flag > 0) msn = msn + ",";
            
            if (formEdicion.per_ideregistro === "" || formEdicion.per_ideregistro === undefined || formEdicion.per_ideregistro === "-2" || formEdicion.cic_ideregistro === -2)  {
                if (flag > 0) msn = msn + ",";
                flag++;
                msn = msn + " Ciclo Periodo Procesar";
            }
            
        }
        else {
            return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Por favor completar el formulario' } };
        }

        if (flag > 0) {
            return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: msn } };
        } else {
            return { respuesta: true };
        }
    },
    //Validación formulario reporte consulta deterioro
    validaFormConsultaDeterioro(formEdicion) {
        let flag = 0;
        var msn = "";
        
        if (formEdicion) {
            if (flag > 0) msn = msn + ",";
            
            if (formEdicion.per_ideregistro===undefined || formEdicion.per_ideregistro.length === 0 )  {
                if (flag > 0) msn = msn + ",";
                flag++;
                msn = msn + " Ciclo Periodo Consultar";
            }
            if (formEdicion.tipo_deterioro===undefined || formEdicion.tipo_deterioro.length === 0)  {
                if (flag > 0) msn = msn + ",";
                flag++;
                msn = msn + " Tipo Deterioro";
            }
            
        }
        else {
            return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Por favor completar el formulario' } };
        }

        if (flag > 0) {
            return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: msn } };
        } else {
            return { respuesta: true };
        }
    },
    //Validación formulario reporte comparacion deterioro
    validaFormCompararDeterioro(formEdicion) {
        let flag = 0;
        var msn = "";
        
        if (formEdicion) {
            if (flag > 0) msn = msn + ",";
            
            if (formEdicion.per_ideregistroA === "" || formEdicion.per_ideregistroA === undefined || formEdicion.per_ideregistroA === "-1" || formEdicion.per_ideregistroA === -1)  {
                 if (flag > 0) msn = msn + ",";
                flag++;
                msn = msn + " Ciclo Periodo Consultar A";
            }
            if (formEdicion.per_ideregistroB === "" || formEdicion.per_ideregistroB === undefined || formEdicion.per_ideregistroB === "-2" || formEdicion.per_ideregistroB === -2)  {
                if (flag > 0) msn = msn + ",";
                flag++;
                msn = msn + " Ciclo Periodo Consultar B";
            }
            if (formEdicion.tipo_deterioro===undefined || formEdicion.tipo_deterioro.length === 0)  {
                if (flag > 0) msn = msn + ",";
                flag++;
                msn = msn + " Tipo Deterioro";
            }
            
        }
        else {
            return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Por favor completar el formulario' } };
        }

        if (flag > 0) {
            return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: msn } };
        } else {
            return { respuesta: true };
        }
    },
    //Validación formulario Inicializar Gestión
    validaFormConsolidarMetas(formEdicion) {
        let flag = 0;
        var msn = "";
        if (formEdicion) {
            if (flag > 0) msn = msn + ",";
            
            if (formEdicion.periodos===undefined || formEdicion.periodos.length === 0 )  {
                if (flag > 0) msn = msn + ",";
                flag++;
                msn = msn + " Meta Gestión";
            }
        }
        else {
            return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: 'Por favor completar el formulario' } };
        }

        if (flag > 0) {
            return { respuesta: false, mensaje: { titulo: 'Datos incompletos', mensaje: msn } };
        } else {
            return { respuesta: true };
        }
    },
     //Validación formulario consulta liquidación comisiones
     validaFormConsultaMH(formEdicion) {
        let flag = 0;
        var msn = "";
        if (formEdicion) {
            if (flag > 0) msn = msn + ",";
            
            
            if (formEdicion.metas === undefined || formEdicion.metas.length === 0)  {
                if (flag > 0) msn = msn + ",";
                flag++;
                msn = msn + " Meta Gestión";
            }
            if (formEdicion.per_desde === "" || formEdicion.per_desde === undefined || formEdicion.per_desde === "-1" || formEdicion.per_desde === -1)  {
                if (flag > 0) msn = msn + ",";
                flag++;
                msn = msn + " Periodo Desde";
            }
            if (formEdicion.per_hasta === "" || formEdicion.per_hasta === undefined || formEdicion.per_hasta === "-1" || formEdicion.per_hasta === -1)  {
                if (flag > 0) msn = msn + ",";
                flag++;
                msn = msn + " Periodo Hasta";
            }
            
            if (formEdicion.per_desde != undefined  && formEdicion.per_hasta != undefined && formEdicion.metas.length >1)  {
                var item1=parseFloat(formEdicion.per_hasta) ;
                var item2=parseFloat(formEdicion.per_desde) ;
                if( item1 === item2 || item1 <  item2){
                    if (flag > 0) msn = msn + ",";
                    flag++;
                    msn = msn + " Recuerde que Periodo Hasta debe ser mayor al Periodo Desde";
                }
               
            }
            
        }
        else {
            return { respuesta: false, mensaje: { titulo: 'Datos incompletos para consultar', mensaje: 'Por favor completar el formulario' } };
        }

        if (flag > 0) {
            return { respuesta: false, mensaje: { titulo: 'Datos incompletos para consultar', mensaje: msn } };
        } else {
            return { respuesta: true };
        }
    },
}