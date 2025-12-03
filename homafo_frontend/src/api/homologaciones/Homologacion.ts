import { ApiDefaultService } from '../common/ApiDefaultService';

export default class HomologacionApi extends ApiDefaultService
{

    listaProyectos (empresa) {
        console.log(empresa>0 ? '' : '');
        return this.instance.get('api/proyectos/lista');
    }

    listaProyectosDepart (depart,empresa) {
        console.log(empresa>0 ? '' : '');
        return this.instance.get('api/proyectos/listaDepart/'+depart+'/'+0);
    }

    listaBarrios(codpro)
    {
        //return this.instance.get('api/barrios/'+codpro);
        return this.instance.get('api/barrios/nativo/'+codpro);
    }

    listaCiclos(empresa)
    {
        console.log(empresa>0 ? '' : '');
        return this.instance.get('api/cicCiclo/lista/'+0);
    }

    listaRutas(codCic)
    {
        //return axios.get(this.servidor()+'api/homologacion/busquedaDsus/'+codCic);
        return this.instance.get('api/rutRuta/'+codCic);
    }

    listaLiquidaciones(empresa)
    {
        console.log(empresa>0 ? '' : '');
        return this.instance.get('api/liqLiquidacion/'+0);
    }

    listaBusquedaGeneralPageable(datos,pageable)
    {

        return this.instance.post('api/homologacion/busqueda/page',datos,{params:pageable});
        //return axios.get(this.servidor()+'api/homologacion/ruta/'+codRuta);
    }
    listaBusquedaGeneral(datos)
    {

        return this.instance.post('api/homologacion/busqueda',datos);
        //return axios.get(this.servidor()+'api/homologacion/ruta/'+codRuta);
    }
    listaBusquedaGeneralCruceInformacion(datos)
    {

        return this.instance.post('api/homologacion/busquedaCruceInformacion',datos);
        //return axios.get(this.servidor()+'api/homologacion/ruta/'+codRuta);
    }

    informacionBasica(dsus)
    {
        return this.instance.get('api/homologacion/infoBasica/'+dsus);
    }

    guardarInfobasica(basica)
    {
        return this.instance.post('api/homologacion/infoBasicaUpdate',basica);
    }

    informacionSuscripcion(dsus)
    {
        return this.instance.get('api/homologacion/infoSuscripcion/'+dsus);
    }

    listaBarriosNativo(codpro)
    {
        return this.instance.get('api/barrios/nativo/'+codpro);
    }

    listaBarrioNativo(codpro,codemp)
    {
        return this.instance.get('api/barrios/nativo/'+codpro+'/'+codemp);
    }

    complementoPropiedad(municipio,barrio)
    {
        return this.instance.get('api/barrios/complementoPropiedad/'+municipio+'/'+barrio);
    }

    busquedaDsusHomo(datos)
    {
        return this.instance.post('api/homologacion/consultaDsusHomo',datos);
    }

    informacionHomologacion(dsus)
    {
        return this.instance.get('api/homologacion/infoHomologacion/'+dsus);
    }

    guardarInfoSuscripcion(suscripcion)
    {
        return this.instance.post('api/homologacion/infoSuscripcionUpdate',suscripcion);
    }

    guardarInfoHomologacion(homologacion)
    {
        return this.instance.post('api/homologacion/crearHomologacion',homologacion);
    }

    informacionMacrosRutas(empresa,barrio)
    {
        console.log(empresa>0 ? '' : '');
        return this.instance.get('api/rutRuta/macroRutas/'+barrio);
    }

    tipoTerceros(unidad)
    {
        return this.instance.get('api/terTercero/tiposTerceros/'+unidad);
    }

    rutasTipo(tipo)
    {
        return this.instance.get('api/rutRuta/rutasTipo/'+tipo);
    }

    buscarFrecuenciaRuta(ruta)
    {
        return this.instance.get('api/rutRuta/buscardMubaRuta/'+ruta);
    }

    informacionGestion(dsus)
    {
        return this.instance.get('api/homologacion/infoGestion/'+dsus);
    }

    guardarGestion(gestion)
    {
        return this.instance.post('api/homologacion/infoGestionInsert',gestion);
    }

    buscarGestion(condiciones)
    {
        return this.instance.post('api/homologacion/busquedaGestion',condiciones);
    }

    informacionReclamos(dsus,empresa)
    {
        console.log(empresa>0 ? '' : '');
        return this.instance.get('api/homologacion/infoReclamos/'+dsus+'/'+0);
    }

    buscarCruceInformacion(condiciones)
    {
        return this.instance.post('api/homologacion/busquedaCruce',condiciones);
    }

    buscarNombreTercero(nombre)
    {
        return this.instance.get('api/terTercero/buscarTerceroNombre/'+nombre);
    }

    listaCiclosOtros(empresa)
    {
        return this.instance.get('api/cicCiclo/lista2/'+empresa);
    }

    datosArchivoImportacion(tipoArchivo)
    {
        return this.instance.get('api/homoImportacion/busqueda/'+tipoArchivo);
    }

    datosLlanogas(fecha1,fecha2,ciclo)
    {
        return this.instance.get('api/homoImportacion/busquedaGas/'+fecha1+'/'+fecha2+'/'+ciclo);
    }

    tiposArchivoImportacion()
    {
        return this.instance.get('api/homoImportacion/tiposArchivos');
    }

    datosArchivoImportacion2(tipoArchivo)
    {
        return this.instance.get('api/homoImportacion/busqueda2/'+tipoArchivo);
    }

    columnasTabla(tabla)
    {
        return this.instance.get('api/homologacion/columnasTabla/'+tabla);
    }

    insertarparametrizaion(datos)
    {
        return this.instance.post('api/homoImportacion/insertarImarc',datos);
    }

    buscarParametrizacion(idmarc)
    {
        return this.instance.get('api/homoImportacion/consultarImarc/'+idmarc);
    }

    actualizarparametrizaion(datos)
    {
        return this.instance.post('api/homoImportacion/actualizarImarc',datos);
    }

    rutasBarrioTipo(tipo,barrio)
    {
        return this.instance.get('api/rutRuta/rutasBarrioTipo/'+tipo+'/'+barrio);
    }

    macrorutasRecoleccion()
    {
        return this.instance.get('api/macrorutas/dto/macrorutasHora');
    }

    macrorutasRecoleccionSuscripcion(dsus)
    {
        return this.instance.get('api/macrorutas/dto/macrorutasSuscripcion/'+dsus);
    }

    listaNovedadesRadicado()
    {
        return this.instance.get('api/reclamos/novedadesRadicado');
    }

    listaCuadrillas()
    {
        return this.instance.get('api/reclamos/listaCuadrillas');
    }

    listaNovedadesReporte()
    {
        return this.instance.get('api/reclamos/novedadesReporte');
    }
    crearSuscripcion(datos)
    {
        return this.instance.post('api/suscripcion/creaSuscripcion',datos);
    }
    listaEmpresas(){
        return this.instance.get('api/empresas/alternasHomologable/0')
    }

}