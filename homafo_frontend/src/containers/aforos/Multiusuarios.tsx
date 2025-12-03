import React, {  lazy, Suspense, Fragment } from 'react'
import { Route, Link } from 'react-router-dom'
import Loading from '../../components/loader/Init'

import { ButtonToolbar, Button } from 'react-bootstrap'

const Consultar = lazy(() => import('./multiusuario/Consultar'))
const Nuevo = lazy(() => import('./multiusuario/Nuevo'))




const Multiusuarios = () => {


    return (
        <Fragment>
             <h2>Aforos Bioagricola del Llano</h2>
            <ButtonToolbar >
                <Link to="/aforos/multiusuario/consultar"> <Button variant="primary" className="mr-2" >Consultar</Button></Link>
                <Link to="/aforos/multiusuario/nuevo"> <Button variant="primary" >Nuevo</Button></Link>
            </ButtonToolbar>

            <Suspense fallback={<Loading />}>                               
                <Route  path='/aforos/multiusuario/nuevo' component={(Nuevo)} />
                <Route  path='/aforos/multiusuario/consultar' component={(Consultar)} />
            </Suspense>
        </Fragment>
    )

}


export default Multiusuarios