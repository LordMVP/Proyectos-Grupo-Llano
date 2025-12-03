import { ApiDefaultService } from '../common/ApiDefaultService';

export default class UniUnidadApi extends ApiDefaultService
{

    empresasAlternas(empresa) {
        console.log(empresa>0 ? '' : '');
        return this.instance.get('api/empresas/alternas/'+0);
    }

    empresasAlternasHomologable(empresa) {
        console.log(empresa>0 ? '' : '');
        return this.instance.get('api/empresas/alternasHomologable/'+0);
    }

    convenios(empresa) {
        console.log(empresa>0 ? '' : '');
        return this.instance.get('api/empresas/convenios/'+0);
    }

    conveniosHomologables(empresa,empresaAlterna) {
        console.log(empresa);
        return this.instance.get('api/empresas/conveniosHomologables/'+0+'/'+empresaAlterna);
    }

    tablasBase()
    {
        return this.instance.get('api/empresas/tablasEmpresa');
    }

}