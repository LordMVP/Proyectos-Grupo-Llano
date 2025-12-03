export default class GestionTablaModel
{
    gact_fecgestion:any;
    uni_vista:any;
    uni_liquidacion:any;
    usuario_nom:any;
    reclamo_numpqr:any;
    gact_observaciones:any;
    gact_ideregistro:any
    novedad_rep:any
    
    constructor(gact_fecgestion:any,uni_vista:any,uni_liquidacion:any,usuario_nom:any,reclamo_numpqr:any,gact_observaciones:any,gact_ideregistro:any,novedad_rep:any)
    {
        this.gact_fecgestion=gact_fecgestion;
        this.uni_vista=uni_vista;
        this.uni_liquidacion=uni_liquidacion;
        this.usuario_nom=usuario_nom;
        this.reclamo_numpqr=reclamo_numpqr;
        this.gact_observaciones=gact_observaciones;
        this.gact_ideregistro=gact_ideregistro;
        this.novedad_rep=novedad_rep
    }

}