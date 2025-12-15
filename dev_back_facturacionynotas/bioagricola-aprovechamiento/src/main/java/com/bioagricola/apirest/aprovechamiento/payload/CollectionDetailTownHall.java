package com.bioagricola.apirest.aprovechamiento.payload;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

/**
 * @author nagredo
 * @project dev_back_aprovechamiento
 * @class CollectionDetailTownHall
 */
@Getter
@Setter
public class CollectionDetailTownHall {
    private List<Long> idList;
    private String idPeriod;
    private String periodFact;
}
