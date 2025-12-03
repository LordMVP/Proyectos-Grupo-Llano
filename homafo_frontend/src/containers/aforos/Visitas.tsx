import React, {  lazy, Suspense, Fragment } from 'react'
import { Route, Link } from 'react-router-dom'
import Loading from '../../components/loader/Init'

import { ButtonToolbar, Button } from 'react-bootstrap'
// import Consultar from './visitas/Consultar' 

const ConsultarRoute = lazy(() => import('./visitas/Consultar'))
const RegistroVisitas = lazy(() => import('./visitas/RegistroVisitas'))




const Visitas = () => {


    return (
        <Fragment>
             <h2>Visitas Aforos Bioagricola del Llano</h2>
            <ButtonToolbar >
                <Link  to="/aforos/visitas/consultar"> <Button variant="primary" className="mr-2" >Consultar</Button></Link>
                
            </ButtonToolbar>
            
            

            <Suspense fallback={<Loading />}>  
            {/* <Consultar />                      */}
                <Route  path='/aforos/visitas/RegistroVisitas' component={(RegistroVisitas)} />
                 <Route  path='/aforos/visitas/consultar' component={(ConsultarRoute)} /> 
            </Suspense>
            <hr/>
        </Fragment>
    )

}


export default Visitas