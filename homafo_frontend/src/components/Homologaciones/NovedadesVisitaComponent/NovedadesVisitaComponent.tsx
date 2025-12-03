import React from 'react';
import UnidadEditor from '../../../components/utils/UnidadEditor/UnidadEditor';
import PARAMETROS from '../../../data/constantes';
import PermisoProgramaDto from '../../../models/dto/PermisoProgramaDto';
import NoAutorizadoComponent from '../../utils/SeccionNoAutorizadaComponent/NoAutorizadoComponent';
import UtilsFunction from '../../utils/UtilsFunction';
import EffectivePermisions from '../../../models/dto/EffectivePermission';

interface INovedadesVisitaComponentProps {
  permissions:PermisoProgramaDto[]
}

interface SNovedadesVisitaComponentState {  
  effectivePermissions:EffectivePermisions;
}

class NovedadesVisitaComponent extends React.Component<INovedadesVisitaComponentProps, SNovedadesVisitaComponentState>{
   
  constructor(props){
    super(props);   
  }
  componentDidMount() {
    this.updatePemissions();
  }

  updatePemissions(){
    console.log(this.props.permissions);
    const effectivePermission = UtilsFunction.getEffectivePermissions(this.props.permissions,'PARAMETRIZACION_GENERAL.NOVEDADES_VISITA');    
    this.setState({effectivePermissions:effectivePermission});
  }

  componentDidUpdate(prevProps) {
    if (prevProps.permissions !== this.props.permissions) {
      this.updatePemissions();
    }
  }
  render() {
    if(this.state?.effectivePermissions.VIEW){
      return (
        <UnidadEditor prefixId='nov-vis' permissions={this.state?.effectivePermissions} showSearch={true} unidadTitle="Novedad de visita" unidadClase={PARAMETROS.CLASES_NOVEDADES.NOVEDADES_VISITA}></UnidadEditor>
      );  
    }else {
      return (
        <NoAutorizadoComponent/>
      );
    }    
  }
}
export default NovedadesVisitaComponent;