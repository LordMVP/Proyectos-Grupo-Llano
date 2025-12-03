export default class JasperBridgeModel
{
    jndi:String;
    format:String;
    reportName: String;
    user:String;
    password: String;
    parameters:{};

    constructor(jndi:String,format:String,reportName: String,user:String,password: String,parameters:{})
    {
        this.jndi=jndi;
        this.format=format;
        this.reportName=reportName;
        this.user=user;
        this.password=password;
        this.parameters=parameters;
    }
}