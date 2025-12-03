import React, { Fragment } from 'react';
import { Accordion } from 'react-bootstrap';
import TipoGeneradorComponent from '../../../components/Aforos/TipoGeneradorComponent/TipoGeneradorComponent';

import SesionApi from '../../../api/common/SesionApi';
import PARAMETROS from '../../../data/constantes';
import PermisoProgramaDto from '../../../models/dto/PermisoProgramaDto';
import CardAccordionBasic from '../../../components/utils/CardAccordionBasic/CardAccordionBasic';
import TipoAforoComponent from '../../../components/Aforos/TipoAforoComponent/TipoAforoComponent';

const sesionApi = new SesionApi();

interface IAforosParametrizacionPageProps {
    permissions: PermisoProgramaDto[]
}

class AforosParametrizacionPage extends React.Component<IAforosParametrizacionPageProps, any>{
    constructor(props) {
        super(props);
        this.state = { permissions: [] };
        }
    componentDidMount() {        
        sesionApi.loadPermisos(PARAMETROS.AFORO_PARAMETRIZACION.PROGRAMA_ID).then(response => {
            this.setState({ permissions: response.data });
        })
    }
    render() {
        const permissions = this.state.permissions;
        return (
            <Fragment>
                <Accordion>
                    <CardAccordionBasic eventKey="1" title="Tipos de Generador">
                        <TipoGeneradorComponent permissions={permissions}>
                        </TipoGeneradorComponent>
                    </CardAccordionBasic>
                    <CardAccordionBasic eventKey="2" title="Tipos de Aforos">
                        <TipoAforoComponent permissions={permissions}>
                        </TipoAforoComponent>
                    </CardAccordionBasic>                    
                </Accordion>
            </Fragment >
        );
    }

}
export default AforosParametrizacionPage;