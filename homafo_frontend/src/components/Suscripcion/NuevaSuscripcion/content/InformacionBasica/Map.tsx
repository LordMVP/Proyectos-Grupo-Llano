import React, { useState, useEffect, useRef } from "react";

import View from "@arcgis/core/views/MapView";
import MapView from "@arcgis/core/views/MapView";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Map from "@arcgis/core/Map";
import LayerList from "@arcgis/core/widgets/LayerList";
import Fullscreen from "@arcgis/core/widgets/Fullscreen";
import Expand from "@arcgis/core/widgets/Expand";
import Graphic from "@arcgis/core/Graphic";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Circle from "@arcgis/core/geometry/Circle";
import Polygon from "@arcgis/core/geometry/Polygon";
import Point from "@arcgis/core/geometry/Point";
import esriConfig from "@arcgis/core/config";
type PropsTypes = {
  token: any;
  geo_data: any;
  capas: any[];
  formData: any;
  dataMapOnlyShow: number[];
  searchCaracteristicasArcgisAction: (data: any) => void;
  setFormData: (data: any) => void;
};

export default function MapViewContainer(props: PropsTypes) {
  const {
    token,
    geo_data,
    capas,
    formData,
    dataMapOnlyShow,
    searchCaracteristicasArcgisAction,
    setFormData,
  } = props;

  const [localization, setLocalization] = useState<number[]>([
    -73.6791007, 4.1247544,
  ]);
  const [isChange, setIsChange] = useState(false);

  const initializeMap = (ref: HTMLDivElement): View => {
    esriConfig.apiKey = token;
    // create map
    const map = new Map({
      basemap: "topo-vector", // Basemap layer service
    });
    const graphicsLayer = new GraphicsLayer({
      listMode: "hide",
    });

    //add layers
    if (Array.isArray(capas) && capas.length > 0) {
      capas.forEach((capa: any) => {
        const urlT = capa.requiretoken ? `${capa.url}${token}` : capa.url;

        map.add(
          new FeatureLayer({
            url: urlT,
            title: capa.name,
          })
        );
      });
    }
    const view = new MapView({
      container: ref,
      map: map,
      center: localization, // Longitude, latitude [-118.805, 34.027] [4.6543605, -74.1304557]
      zoom: 20, // Zoom level
    });
    const layerList = new LayerList({
      view: view,
    });

    const layerListExpand = new Expand({
      expandIconClass: "esri-icon-layer-list",
      view: view,
      content: layerList,
    });

    view.ui.add(layerListExpand, "top-right");
    if (geo_data) {
      console.log(geo_data);
      const geoPoint = new Point({
        x: localization[0],
        y: localization[1],
        spatialReference: { wkid: 4326 },
      });

      if (!isChange) {
        const circleGeometry = new Circle({
          center: geoPoint,
          geodesic: true,
          numberOfPoints: 100,
          radius: 10,
          radiusUnit: "meters",
        });

        const polygon = new Polygon({
          hasZ: true,
          hasM: true,
          rings: circleGeometry.rings,
          spatialReference: { wkid: 4326 },
        });

        const simpleFillSymbol = {
          type: "simple-fill",
          color: [107, 198, 255, 0.5], // color rgba [red, green, blue, transparency]
          outline: {
            color: [255, 255, 255],
            width: 1,
          },
        };

        const polygonGraphicCircle = new Graphic({
          geometry: polygon,
          symbol: simpleFillSymbol,
        });
        graphicsLayer.add(polygonGraphicCircle);
      }

      const polygonGraphic = new Graphic({
        geometry: geoPoint,
        symbol: {
          color: [226, 119, 40], // Orange
        },
        popupTemplate: {
          title: "Geolocalización",
          content: `<p>Dirección: ${geo_data.address}</p>`,
        },
      });
      graphicsLayer.add(polygonGraphic);
    } else {
      if (dataMapOnlyShow.length > 0) {
        const geoPoint = new Point({
          x: localization[0],
          y: localization[1],
          spatialReference: { wkid: 4326 },
        });
        const polygonGraphic = new Graphic({
          geometry: geoPoint,
          symbol: {
            color: [226, 119, 40], // Orange
          },
        });
        graphicsLayer.add(polygonGraphic);
      }
    }

    map.add(graphicsLayer);

    view.ui.add(
      new Fullscreen({
        view: view,
        element: ref,
      }),
      "bottom-right"
    );
    view.on("double-click", function (event) {
      const x = event.mapPoint.longitude;
      const y = event.mapPoint.latitude;
      setLocalization([x, y]);
      setIsChange(true);
    });

    return view;
  };
  const mapRef = useRef() as any;

  useEffect(() => {
    initializeMap(mapRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localization, capas]);
  useEffect(() => {
    if (geo_data) {
      const x = Number(geo_data.location.x);
      const y = Number(geo_data.location.y);
      setIsChange(false);
      if (x && y) {
        setLocalization([x, y]);
      }
    }
  }, [geo_data]);
  useEffect(() => {
    if (isChange) {
      const objGeo = {
        type: formData.proZona === "U" ? 1 : 2,
        x: localization[0],
        y: localization[1],
      };
      setFormData((prev) => ({
        ...prev,
        proGpslatitud: localization[1],
        proGpslongitud: localization[0],
      }));
      searchCaracteristicasArcgisAction(objGeo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isChange, localization]);
  useEffect(() => {
    if (dataMapOnlyShow.length > 0) {
      setLocalization(dataMapOnlyShow);
    }
  }, [dataMapOnlyShow]);

  return <div className="mapDiv" ref={mapRef}></div>;
}
