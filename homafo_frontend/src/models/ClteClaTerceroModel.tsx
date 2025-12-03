export default class ClteClaTerceroModel
{

    clte_ideregistr:number;
    uni_ideregistro:number;
    uni_nombre1:String;
    uni_orden:number;
    uni_codigo1:String;
    ter_ideregistro:number;

    constructor(clte_ideregistr:number,uni_ideregistro:number,uni_nombre1:String,uni_orden:number,uni_codigo1:String,ter_ideregistro:number)
    {
        this.clte_ideregistr=clte_ideregistr;
        this.uni_ideregistro=uni_ideregistro;
        this.uni_nombre1=uni_nombre1;
        this.uni_orden=uni_orden;
        this.uni_codigo1=uni_codigo1;
        this.ter_ideregistro=ter_ideregistro;
    }
}