import { ApiDefaultService } from '../common/ApiDefaultService';

export default class FacFactura extends ApiDefaultService
{

    saldoFacturas(dsus,empresa) {
        console.log(empresa>0 ? '' : '');
        return this.instance.get('api/facFactura/busquedaSaldos/'+dsus+'/'+0);
    }

    
}