import { ApiDefaultService } from "../common/ApiDefaultService";

export default class VisitasApi extends ApiDefaultService
{
    crudConceptosDmaf(datos)
    {

        return this.instance.post('/api/visitas/crudConceptosdmaf',datos);
    }

    buscarConceptos(dmafIderegistro)
    {
        return this.instance.get('/api/visitas/buscarConceptos/'+dmafIderegistro);
    }

    ListaDmafEstado(idAforo)
    {
        return this.instance.get('/api/visitas/ListaDmafEstado/'+idAforo);
    }
}