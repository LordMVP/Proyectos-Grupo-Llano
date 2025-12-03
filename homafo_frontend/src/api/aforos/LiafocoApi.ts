import { ApiDefaultService } from '../common/ApiDefaultService';

export default class LiafocoApi extends ApiDefaultService {
    /**
     * Obtiene las liquidaciones asociadas a un aforo específico
     * @param hafoId - ID del aforo (hafo_ideregistro)
     * @returns Promise con la respuesta del backend { mensaje, data }
     */
    obtenerLiquidacionesPorHafo(hafoId: number) {
        return this.instance.get(`api/liafoco/${hafoId}`);
    }

    /**
     * Cambia el estado de cobro de una liquidación
     * @param liafocoId - ID de la liquidación
     * @param cobro - Nuevo estado de cobro (true/false)
     * @returns Promise con la respuesta del backend
     */
    cambiarEstadoCobro(liafocoId: number, cobro: boolean) {
        return this.instance.put(`api/liafoco/${liafocoId}/cambiar-estado-cobro`, { cobro });
    }
}
