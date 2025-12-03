import { ApiDefaultService } from '../common/ApiDefaultService';

export default class ArchivosApi extends ApiDefaultService
{
    cargarArchivo(datos)
    {
        //return this.instance.post('homologacion/archivos/adjuntar',datos);
        return this.instance.post('homologacion/archivos/adjuntar',datos,{headers: {"Content-Type": "multipart/form-data","Content-type": "image/jpeg"}});
    }

    buscarArchivo(datos)
    {
        return this.instance.post('homologacion/archivos/buscar',datos);
    }

    generarPdf(datos)
    {
        return this.instance.post('homologacion/archivos/generarPdf',datos);
    }

    cargarArchivosVisita(datos)
    {
        return this.instance.post('api/visitas/adjuntar',datos);
    }
}