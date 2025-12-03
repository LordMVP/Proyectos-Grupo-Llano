package com.bioagricola.arcgis.dto;

/**
 * Clase dto de info basica del mapa
 * @author cperez@progracol.com
 */
public class BasicMapDto {

    private String id;

    private String title;

    private String image;

    public BasicMapDto() {
    }

    public BasicMapDto(String id, String title) {
        this.id = id;
        this.title = title;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }
}
