import { ApiDefaultService } from '../common/ApiDefaultService';

export default class Ghomologacion extends ApiDefaultService
{

    listaHomologaciones(dsus,condiciones,empresa) {
        console.log(empresa>0 ? '' : '');
        return this.instance.get('api/gestionhomologa/busqueda/'+dsus+'/'+condiciones+'/'+empresa);
    }

    
}