
import React from 'react';
import UnidadEditor from '../../../components/utils/UnidadEditor/UnidadEditor';
import PARAMETROS from '../../../data/constantes';
import EffectivePermisions from '../../../models/dto/EffectivePermission';
import PermisoProgramaDto from '../../../models/dto/PermisoProgramaDto';
import NoAutorizadoComponent from '../../utils/SeccionNoAutorizadaComponent/NoAutorizadoComponent';
import UtilsFunction from '../../utils/UtilsFunction';

interface INovedadesLiquidacionComponentProps {    
    permissions:PermisoProgramaDto[]
}

interface SNovedadesLiquidacionComponentState {
  effectivePermissions:EffectivePermisions;
  }
class NovedadesLiquidacionComponent extends React.Component<INovedadesLiquidacionComponentProps,SNovedadesLiquidacionComponentState>{
    constructor(props:INovedadesLiquidacionComponentProps){
        super(props);
    }
    componentDidMount() {
      this.updatePemissions();
    }
  
    updatePemissions(){      
      const effectivePermission = UtilsFunction.getEffectivePermissions(this.props.permissions,'PARAMETRIZACION_GENERAL.NOVEDADES_LIQUIDACION');    
      this.setState({effectivePermissions:effectivePermission});
    }
  
    componentDidUpdate(prevProps) {
      if (prevProps.permissions !== this.props.permissions) {
        this.updatePemissions();
      }
    }
    render()
    {
        if(this.state?.effectivePermissions.VIEW){
            return (
                <UnidadEditor prefixId='nov-liq' permissions={this.state?.effectivePermissions} showSearch={true} unidadTitle="Novedades de liquidacion" unidadClase={PARAMETROS.CLASES_NOVEDADES.NOVEDADES_LIQUIDACION}></UnidadEditor>
            );  
          }else {
            return (
              <NoAutorizadoComponent/>
            );
          }
    }
    
}
export default NovedadesLiquidacionComponent;