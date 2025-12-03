import { ApiDefaultService } from "../common/ApiDefaultService";
import { PageableRequest, PageT } from "models/dto/Pagination";
import RUTAS_API from "../../data/rutasApi";
import AforoPreLiquidacionResponse from "../../models/dto/AforoPreLiquidacionResponse";
import DetalleAforoDTO from "../../models/dto/DetalleAforoDTO";
import { AxiosResponse } from "axios";
import AforoLiquidacionRequest from "../../models/dto/AforoLiquidacionRequest";
import AforoLiquidacionResponse from "../../models/dto/AforoLiquidacionResponse";
import AforoLiquidacionMultiusuarioRequest from "../../models/dto/AforoLiquidacionMultiusuarioRequest";


export default class AforoApi extends ApiDefaultService {
    public apiUrl = "api/aforo";
    getAforosPage(pageable: PageableRequest) {
        return this.instance.get(this.apiUrl + '/page', { params: pageable });
    }

    getAforosLiquidacion(pageable: PageableRequest) {
        return this.instance.get(RUTAS_API.AFOROS.SELECTS.LIQUIDACION, { params: pageable });
    }
    getPreliquidacion(aforo: number): Promise<AxiosResponse<AforoPreLiquidacionResponse>> {
        return this.instance.get(RUTAS_API.AFOROS.LIQUIDACION.PRELIQUIDAR + '/' + aforo);
    }

    getDetallesAforo(aforo: number): Promise<AxiosResponse<PageT<DetalleAforoDTO>>> {
        return this.instance.get(RUTAS_API.AFOROS.NORMAL.DETALLES_AFORO + '/' + aforo);
    }

    postEnviarLiquidacion(request: AforoLiquidacionRequest): Promise<AxiosResponse<AforoLiquidacionResponse>> {
        return this.instance.post(RUTAS_API.AFOROS.LIQUIDACION.LIQUIDAR, request );
    }

    postEnviarLiquidacionMultiusuario(request: AforoLiquidacionMultiusuarioRequest): Promise<AxiosResponse<AforoLiquidacionResponse>> {
        return this.instance.post(RUTAS_API.AFOROS.LIQUIDACION.LIQUIDARMULTIUSUARIO, request );
    }
    postLiquidacionGeneral(request: string): Promise<AxiosResponse> {
        return this.instance.post(RUTAS_API.AFOROS.LIQUIDACION.LIQUIDACION_GENERAL, request );
    }
    postLiquidacionGeneralMultiusuario(request: string): Promise<AxiosResponse> {
        return this.instance.post(RUTAS_API.AFOROS.LIQUIDACION.LIQUIDACION_GENERAL_MULTIUSUARIO, request );
    }
}