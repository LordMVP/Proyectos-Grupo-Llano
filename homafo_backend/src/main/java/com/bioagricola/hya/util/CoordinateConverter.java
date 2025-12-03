package com.bioagricola.hya.util;

import org.locationtech.proj4j.*;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class CoordinateConverter {

   public Map<String,Double> convertXYtoLatLong(double x, double y){
       // Definir el sistema de referencia de origen (EPSG:21897) Colombia
       String sourceCrsString = "EPSG:21897";
       // Definir el sistema de referencia de destino (EPSG:4326)
       String targetCrsString = "EPSG:4326";
       // Crear los objetos de CRSFactory y CoordinateTransformFactory
       CRSFactory crsFactory = new CRSFactory();
       CoordinateReferenceSystem sourceCrs = crsFactory.createFromName(sourceCrsString);
       CoordinateReferenceSystem targetCrs = crsFactory.createFromName(targetCrsString);
       CoordinateTransformFactory transformFactory = new CoordinateTransformFactory();
       // Crear la transformación de coordenadas
       CoordinateTransform transform = transformFactory.createTransform(sourceCrs, targetCrs);
       // Realizar la transformación de coordenadas
       ProjCoordinate sourceCoord = new ProjCoordinate(x, y);
       ProjCoordinate targetCoord = new ProjCoordinate();
       transform.transform(sourceCoord, targetCoord);
       // Obtener las coordenadas convertidas
       double longitude = targetCoord.x;
       double latitude = targetCoord.y;
       Map<String,Double> coordinates = new HashMap<>();
       coordinates.put("x",longitude);
       coordinates.put("y",latitude);
       return coordinates;
   }
}
