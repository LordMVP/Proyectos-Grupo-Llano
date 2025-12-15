package com.bioagricola.apirest.aprovechamiento.dto;

import com.google.gson.annotations.SerializedName;

/**
 * @author nagredo
 * @project dev_back_aprovechamiento
 * @class JasperParametersDto
 */
public class JasperParametersDto {
    @SerializedName("LOGO")
    private String logo;

    @SerializedName("ACTA")
    private String minutes;

    @SerializedName("MUNICIPIO")
    private String municipality;

    @SerializedName("FECHA")
    private String date;

    @SerializedName("PERSONA")
    private String person;

    @SerializedName("CARGO")
    private String job;

    @SerializedName("DIRECTIVO")
    private String executive;

    @SerializedName("ASUNTO")
    private String subject;

    @SerializedName("TEXTO")
    private String text;

    @SerializedName("NIT_LIST")
    private String listNit;

    @SerializedName("ASOCIACION_LIST")
    private String listAssociation;

    @SerializedName("VALOR_PAGO_LIST")
    private String listValuePaid;

    @SerializedName("CUENTA_BANCARIA_LIST")
    private String listAccount;

    @SerializedName("TOTAL")
    private String total;

    @SerializedName("FIRMA")
    private String sign;

    @SerializedName("NOMBRE_PERSONA_FIRMANTE")
    private String nameSigningPerson;

    @SerializedName("TITULO_PERSONA_FIRMANTE")
    private String titleSigningPerson;

    @SerializedName("CONFIG_PERSONA_FIRMANTE")
    private String configSigningPerson;

    @SerializedName("APROVADOR_PERSONA_FIRMANTE")
    private String approvedSigningPerson;

    @SerializedName("PR_STR_ROOT_PATH")
    private String strRootPath;

    @SerializedName("PR_STR_IMAGES_PATH")
    private String strImagePath;

    @SerializedName("USE_SWAP")
    private boolean useSwap;

    public String getLogo() {
        return logo;
    }

    public void setLogo(String logo) {
        this.logo = logo;
    }

    public String getMinutes() {
        return minutes;
    }

    public void setMinutes(String minutes) {
        this.minutes = minutes;
    }

    public String getDate() {
        return date;
    }

    public String getMunicipality() {
        return municipality;
    }

    public void setMunicipality(String municipality) {
        this.municipality = municipality;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getPerson() {
        return person;
    }

    public void setPerson(String person) {
        this.person = person;
    }

    public String getJob() {
        return job;
    }

    public void setJob(String job) {
        this.job = job;
    }

    public String getExecutive() {
        return executive;
    }

    public void setExecutive(String executive) {
        this.executive = executive;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getListNit() {
        return listNit;
    }

    public void setListNit(String listNit) {
        this.listNit = listNit;
    }

    public String getListAssociation() {
        return listAssociation;
    }

    public void setListAssociation(String listAssociation) {
        this.listAssociation = listAssociation;
    }

    public String getListValuePaid() {
        return listValuePaid;
    }

    public void setListValuePaid(String listValuePaid) {
        this.listValuePaid = listValuePaid;
    }

    public String getListAccount() {
        return listAccount;
    }

    public void setListAccount(String listAccount) {
        this.listAccount = listAccount;
    }

    public String getTotal() {
        return total;
    }

    public void setTotal(String total) {
        this.total = total;
    }

    public String getSign() {
        return sign;
    }

    public void setSign(String sign) {
        this.sign = sign;
    }

    public String getNameSigningPerson() {
        return nameSigningPerson;
    }

    public void setNameSigningPerson(String nameSigningPerson) {
        this.nameSigningPerson = nameSigningPerson;
    }

    public String getTitleSigningPerson() {
        return titleSigningPerson;
    }

    public void setTitleSigningPerson(String titleSigningPerson) {
        this.titleSigningPerson = titleSigningPerson;
    }

    public String getConfigSigningPerson() {
        return configSigningPerson;
    }

    public void setConfigSigningPerson(String configSigningPerson) {
        this.configSigningPerson = configSigningPerson;
    }

    public String getApprovedSigningPerson() {
        return approvedSigningPerson;
    }

    public void setApprovedSigningPerson(String approvedSigningPerson) {
        this.approvedSigningPerson = approvedSigningPerson;
    }

    public String getStrRootPath() {
        return strRootPath;
    }

    public void setStrRootPath(String strRootPath) {
        this.strRootPath = strRootPath;
    }

    public String getStrImagePath() {
        return strImagePath;
    }

    public void setStrImagePath(String strImagePath) {
        this.strImagePath = strImagePath;
    }

    public boolean isUseSwap() {
        return useSwap;
    }

    public void setUseSwap(boolean useSwap) {
        this.useSwap = useSwap;
    }
}
