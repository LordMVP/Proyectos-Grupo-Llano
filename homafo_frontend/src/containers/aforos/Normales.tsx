import React, { lazy, Suspense, Fragment } from 'react'
import { Route, Link } from 'react-router-dom'
import Loading from '../../components/loader/Init'

import { ButtonToolbar, Button } from 'react-bootstrap'

const Consultar = lazy(() => import('./normal/Consultar'))
const Nuevo = lazy(() => import('./normal/Nuevo'))



function Normales() {    

    return (
        <Fragment>
            <h2>Aforos Bioagricola del Llano</h2>           
            <ButtonToolbar >
                <Link to="/aforos/normal/consultar">
                    <Button variant="primary" className="mr-2" >Consultar</Button>
                </Link>
                <Link to="/aforos/normal/nuevo">
                    <Button variant="primary" className="mr-2" >Nuevo</Button>
                </Link>
            </ButtonToolbar>

            <Suspense fallback={<Loading />}>
                <Route path='/aforos/normal/nuevo' component={(Nuevo)} />
                <Route path='/aforos/normal/consultar' component={(Consultar)} />
            </Suspense>
        </Fragment>
    )

}


export default Normales