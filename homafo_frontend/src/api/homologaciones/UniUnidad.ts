
import { PageableRequest } from '../../models/dto/Pagination'
import BasicCompactDTO from '../../models/dto/BasicCompactDTO';
import { ApiDefaultService } from '../common/ApiDefaultService';

const NOVEDADES_VISITA_CLASS_ID = 104;
export default class UniUnidad extends ApiDefaultService{
    public apiUrl = "api/unidades";
    
    datosUnidades(clase, empresa) {
        let claseTmp=0;
        if(isNaN(clase))
        {
            claseTmp=0;
        }
        else
        {
            claseTmp=clase;
        }
        console.log(empresa>0 ? '' : '');
        //return this.instance.get(this.apiUrl + '/' + clase + '/' + 0);
        return this.instance.get(this.apiUrl + '/' + claseTmp + '/' + 0);
    }

    datosUnidadesTercero(clase, empresa, tercero) {
        let claseTmp=0;
        if(isNaN(clase))
        {
            claseTmp=0;
        }
        else
        {
            claseTmp=clase;
        }
        console.log(empresa>0 ? '' : '');
        //return this.instance.get( this.apiUrl + '/' + clase + '/' + 0 + '/' + tercero);
        return this.instance.get( this.apiUrl + '/' + claseTmp + '/' + 0 + '/' + tercero);
    }

    getNovedadesVisita(pageable: PageableRequest) {
        return this.instance.get(this.apiUrl + '/dto/' + NOVEDADES_VISITA_CLASS_ID, { params: pageable });
    }

    save(item: BasicCompactDTO) {
        console.log(item);
        if (item.id != null) {
            return this.instance.put( this.apiUrl + '/dto/' + NOVEDADES_VISITA_CLASS_ID, item)
        } else {
            return this.instance.post( this.apiUrl + '/dto/' + NOVEDADES_VISITA_CLASS_ID, item)
        }

    }

    datosUnidadesUspu(programa,clase) {
        let claseTmp=0;
        let programaTmp=0;
        if(isNaN(clase))
        {
            claseTmp=0;
        }
        else
        {
            claseTmp=clase;
        }
        if(isNaN(programa))
        {
            programaTmp=0;
        }
        else
        {
            programaTmp=programa;
        }
        return this.instance.get(this.apiUrl +'/uniUspu/'+programaTmp+'/'+ claseTmp);
    }

}