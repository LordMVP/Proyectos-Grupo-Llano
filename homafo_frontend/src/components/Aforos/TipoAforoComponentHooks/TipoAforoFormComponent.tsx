import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import UnidadesApi from '../../../api/homologaciones/UnidadesApi';
import PARAMETROS from '../../../data/constantes';
import TipoAforoDTO from '../../../models/dto/TipoAforoDTO';
const unidadesApi = new UnidadesApi();

interface TipoAforoProps {
    onSubmit:any,
    data:TipoAforoDTO
}
/*type IFormInputs = {
    uniCodigo: string,
    uniNombre: string,
    uniEstado: string,
    uniClaseaforo: number,
    tafoFactorProduccion: number
    tafoFactorEquivalencia: number,
    tafoVigencia: number,
    tafoPlazoMaximo: number,
    tafoHolgura: number
}*/
function TipoAforoFormComponent(props: TipoAforoProps) {
    const { register, errors, handleSubmit } = useForm<TipoAforoDTO>();
    const [clasesAforo, setClasesAforo] = useState<any>();

    useEffect(() => {
        unidadesApi.getByClass(PARAMETROS.CLASES.CLASE_CLASE_AFORO).then(response => {
            const options = response.data.content.map((clase) => <option value={clase.uniIderegistro}>{clase.uniNombre1}</option>);
            setClasesAforo(options);
        });
    }, []);

    const onSubmit: SubmitHandler<TipoAforoDTO> = data => {
        console.log(data);
        console.log(props);
        props.onSubmit(data);
    };
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            
             <div className="row">
                <div className="col-md-4 col-sm-12 form-group ">
                    <label className="form-label">Codigo</label>
                    <input className="form-control form-control-sm" name="uniCodigo" type="text" ref={register({ required: true, maxLength: 10 })} ></input>
                    {errors.uniCodigo && <div className="invalid-feedback-custom">El codigo es requerido</div>}
                </div>
                <div className="col-md-4 col-sm-12 form-group">
                    <label className="form-label">Nombre</label>
                    <input className="form-control form-control-sm" name="uniNombre" type="text" ref={register({ required: true })} ></input>
                    {errors.uniNombre && <div className="invalid-feedback-custom">El nombre es requerido</div>}
                </div>
                <div className="col-md-4 col-sm-12 form-group">
                    <label className="form-label">Clase de aforo</label>
                    <select className="form-control form-control-sm" name="uniClaseaforo" ref={register({ required: true })} >
                        {clasesAforo}
                    </select>
                    {errors.uniClaseaforo && <div className="invalid-feedback-custom">La clase de aforo es requerida.</div>}
                </div>
                <div className="col-md-4 col-sm-12 form-group">
                    <label className="form-label">Estado</label>
                    <select className="form-control form-control-sm" name="uniEstado" ref={register({ required: true })} >
                        <option value="A">Activo</option>
                        <option value="A">Inactivo</option>
                    </select>
                    {errors.uniEstado && <div className="invalid-feedback-custom">El estado es requerido.</div>}
                </div>
                <div className="col-md-4 col-sm-12 form-group">
                    <label className="form-label">Plazo (dias)</label>
                    <input className="form-control form-control-sm" name="tafoPlazoMaximo" type="number" ref={register({ required: true })} ></input>
                    {errors.tafoPlazoMaximo && <div className="invalid-feedback-custom">El plazo maximo es requerido</div>}
                </div>
                <div className="col-md-4 col-sm-12 form-group">
                    <label className="form-label">Factor Produccion</label>
                    <input className="form-control form-control-sm" name="tafoFactorProduccion" type="number" ref={register({ required: true })} ></input>
                    {errors.tafoFactorProduccion && <div className="invalid-feedback-custom">El factor de produccion es requerido.</div>}
                </div>
                <div className="col-md-4 col-sm-12 form-group">
                    <label className="form-label">Factor Equivalencia</label>
                    <input className="form-control form-control-sm" name="tafoFactorEquivalencia" type="number" ref={register({ required: true })} ></input>
                    {errors.tafoFactorEquivalencia && <div className="invalid-feedback-custom">El factor de equivalencia es requerido</div>}
                </div>
                <div className="col-md-4 col-sm-12 form-group">
                    <label className="form-label">Vigencia (dias)</label>
                    <input className="form-control form-control-sm" name="tafoVigencia" type="number" ref={register({ required: true })} ></input>
                    {errors.tafoVigencia && <div className="invalid-feedback-custom">La vigencia es requerida</div>}
                </div>
                <div className="col-md-4 col-sm-12 form-group">
                    <label className="form-label">Holgura (dias)</label>
                    <input className="form-control form-control-sm" name="tafoHolgura" type="number" ref={register({ required: true })} ></input>
                    {errors.tafoHolgura && <div className="invalid-feedback-custom">La holgura es requerida</div>}
                </div>                
            </div>
            <div className="row">
            <input type="submit" value="Enviar datos" />
            </div>
        </form>
    )
}

export default TipoAforoFormComponent;