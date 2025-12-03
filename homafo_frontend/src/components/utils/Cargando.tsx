import * as React from 'react';
import { usePromiseTracker } from "react-promise-tracker";
import Loader from "react-loader-spinner";

interface IProps{
    //agregarTarea:(tarea :ITareas)=>void;
    //lista:IAutor[];
    //eliminar: (id:number)=>void; 
    value?:any,
}

class Cargando extends React.Component<IProps,any>
{

    constructor(props:IProps)
    {
        super(props);
        this.state={
            }
    }

    componentDidMount() 
    {
    }

    render()
    {
        return(
            <div>
                <div className="col-12">
                        <Spinner/>
                </div>
           </div>
        )
    }
}

export default Cargando;

const Spinner: any = () => {
    // 2. Importamos el hook y usamos la propiedad "promiseInProgress"
    // que contiene el estado de las promesas que hay en ese área
    // En este caso, el área por defecto
    const { promiseInProgress } = usePromiseTracker();
    return promiseInProgress && <Loader type="ThreeDots" color="#4A90E2" height={100} width={100} />;
  };