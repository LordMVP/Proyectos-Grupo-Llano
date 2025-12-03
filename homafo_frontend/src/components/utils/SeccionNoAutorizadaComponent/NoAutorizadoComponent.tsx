import React, { Fragment} from 'react';
import { Empty } from 'antd';
import image from './unauthorized.png'
function NoAutorizadoComponent(){
    
    return (
        <Fragment>
                <Empty image={image} description={
                <span>
                    No autorizado, favor revisar su perfil con el administrador del sistema.
                </span>
            }>
                </Empty>
        </Fragment>        
    )

}

export default NoAutorizadoComponent;