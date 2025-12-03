import { Callout, Card, Elevation, Intent, UL } from '@blueprintjs/core';
import React, { Fragment } from 'react';
import ImportTabProps from '../../../models/dto/TabImportProps';

function ImportResultadoComponent(props: ImportTabProps) {
    //const[state] = useState(props);
    const aciertos = props.data?.ACIERTOS?.map(item => <li>{item}</li>);
    const errores = props.data?.ERRORES?.map(item => <li>{item}</li>);
    console.log(props);
    return (
        <Fragment>
            <Card interactive={true} elevation={Elevation.TWO} className=".modifier">
                <Callout intent={Intent.SUCCESS} title="Aciertos del procesamiento ">
                    <UL>
                        {aciertos}
                    </UL>
                </Callout>
                <br/>
                <Callout intent={Intent.DANGER} title="Errores en el procesamiento">
                    <UL>
                        {errores}
                    </UL>
                </Callout>
            </Card>
        </Fragment>
    )
}

export default ImportResultadoComponent;