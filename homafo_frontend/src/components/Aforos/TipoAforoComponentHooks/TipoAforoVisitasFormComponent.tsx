import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import DetalleTipoAforoDTO from '../../../models/dto/DetalleTipoAforoDTO';


type TipoAforoVisitasFormProps = {
    onAdd:any
    onFinish:any,
    columnsClass?:string,
    defaultValue:DetalleTipoAforoDTO | undefined
}

function TipoAforoVisitasFormComponent(props: TipoAforoVisitasFormProps) {
    const { register, handleSubmit,reset } = useForm<DetalleTipoAforoDTO>();    
    const [columnsClass,setColumnsClass] = useState('');    
    useEffect(()=>{
            let columnClass = props.columnsClass==undefined?'col-md-6 col-sm-12':props.columnsClass;
            setColumnsClass('form-group '+ columnClass);    
            reset(props.defaultValue);    
    },[props.defaultValue]);
    const onFinish = () =>{
        props.onFinish();
    }
    const onSubmit: SubmitHandler<DetalleTipoAforoDTO> = data => {
        props.onAdd(data);
        reset({});        
    };
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input type='hidden' name='index' ref={register({required:false})}/>
            <div className="container-fluid">
                <div className="row">
                    <div className={columnsClass}>
                        <label>Desde</label>
                        <input type="number" step="0.01" key="dtafoDesde" className="form-control form-control-sm" name="dtafoDesde" ref={register({ required: true, maxLength: 10 })} />
                    </div>
                    <div className={columnsClass}>
                        <label>Hasta</label>
                        <input type="number" step="0.01" className="form-control form-control-sm" name="dtafoHasta" key="dtafoHasta" ref={register({ required: true, maxLength: 10 })} />
                    </div>
                    <div className={columnsClass}>
                        <label>Frecuencia</label>
                        <input type="number" className="form-control form-control-sm" name="dtafoFrecuencia" key="dtafoFrecuencia" ref={register({ required: true, maxLength: 10 })} />
                    </div>
                    <div className={columnsClass}>
                        <label># Visitas</label>
                        <input type="number" className="form-control form-control-sm" name="dtafoCantidadVisitas" key="dtafoCantidadVisitas" ref={register({ required: true, maxLength: 10 })} />
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <button type="submit" className="btn btn-success btn-sm btn-block">
                            Agregar y nuevo
                        </button>
                        <button type="button" onClick={onFinish} className="btn btn-primary btn-sm btn-block">
                            Finalizar y cerrar
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
}

export default TipoAforoVisitasFormComponent;