import React, { Fragment } from 'react';
import { Accordion } from 'react-bootstrap';
import CardAccordionBasic from '../../../components/utils/CardAccordionBasic/CardAccordionBasic';
import NovedadesVisitaComponent from '../../../components/Homologaciones/NovedadesVisitaComponent/NovedadesVisitaComponent';
import NovedadesLiquidacionComponent from '../../../components/Homologaciones/NovedadesLiquidacionComponent/NovedadesLiquidacionComponent';
import MacrorutasMicrorutasComponent from '../../../components/Homologaciones/MacrorutasMicrorutasComponent/MacrorutasMicrorutasComponent';
import BarriosMunicipioComponent from '../../../components/Homologaciones/BarriosMunicipioComponent/BarriosMunicipioComponent';
import SesionApi from '../../../api/common/SesionApi';
import PermisoProgramaDto from '../../../models/dto/PermisoProgramaDto';
import PARAMETROS from '../../../data/constantes';
const sesionApi = new SesionApi();

interface IPageProps {
    location: any
}

interface SParametrizacionGeneralPageState {
    permissions: PermisoProgramaDto[]
}



class ParametrizacionGeneralPage extends React.Component<IPageProps, SParametrizacionGeneralPageState>{

    constructor(props) {
        super(props);
        this.state = { permissions: [] };
    }
    componentDidMount() {        
        sesionApi.loadPermisos(PARAMETROS.PARAMETRIZACION_BARRIOS.PROGRAMA_ID).then(response => {
            this.setState({ permissions: response.data });
        })
    }
    render() {
        const permissions = this.state.permissions;
        return (
            <Fragment>
                <Accordion>
                    <CardAccordionBasic eventKey="1" title="Parametrización novedades de visita." >
                        <NovedadesVisitaComponent permissions={permissions}>
                        </NovedadesVisitaComponent>
                    </CardAccordionBasic>
                    <CardAccordionBasic eventKey="2" title="Parametrización novedades de liquidacion.">
                        <NovedadesLiquidacionComponent permissions={permissions}>
                        </NovedadesLiquidacionComponent>
                    </CardAccordionBasic>
                    <CardAccordionBasic eventKey="9" title="Parametrizacion de barrios">
                        <BarriosMunicipioComponent permissions={permissions}></BarriosMunicipioComponent>
                    </CardAccordionBasic>
                    <CardAccordionBasic eventKey="4" title="Parametrización de microrutas, frecuencias recolección. ">
                        <MacrorutasMicrorutasComponent permissions={permissions}></MacrorutasMicrorutasComponent>
                    </CardAccordionBasic>                    
                </Accordion>
            </Fragment >
        );
    }

}
export default ParametrizacionGeneralPage;