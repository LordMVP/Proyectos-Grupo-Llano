package com.bioagricola.apirest.modelo.manejadores.utils;

/**
 *
 * @author GeneradorCRUD
 */
public class RangoConsulta {
    
    private Integer from;
    private Integer to;

    public RangoConsulta(){
        super();
    }
    
    public RangoConsulta(Integer from, Integer to){
        this.from = from;
        this.to = to;
    }
    
    public boolean isFromValid(){
        return from>=0;
    }
    
    public boolean isToValid(){
        return to>=0 && to>=from;
    }
    
    public int getMaxResultsParameter(){
        return to-from+1;
    }
    
    /**
     * @return the from
     */
    public Integer getFrom() {
        return from;
    }

    /**
     * @param from the from to set
     */
    public void setFrom(Integer from) {
        this.from = from;
    }

    /**
     * @return the to
     */
    public Integer getTo() {
        return to;
    }

    /**
     * @param to the to to set
     */
    public void setTo(Integer to) {
        this.to = to;
    }
    
    
}