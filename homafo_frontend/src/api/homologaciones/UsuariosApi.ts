import { ApiDefaultService } from '../common/ApiDefaultService';

export default class UsuariosApi extends ApiDefaultService
{
    listaUsuarios()
    {
        return this.instance.get('api/usuarios/listaCompleta');
    }

    datosReportes(idUsuario)
    {
        console.log(idUsuario>0 ? '' : '');
        return this.instance.get('api/usuarios/datosReportes/'+0);
    }

    terceroUsuario(idTercero)
    {
        return this.instance.get('api/usuarios/terceroUsuario/'+idTercero);
    }
}