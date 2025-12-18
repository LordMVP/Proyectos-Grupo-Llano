package com.progracol.aforos.ui.map

import android.annotation.SuppressLint
import android.app.Dialog
import android.os.Build
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.Menu
import android.view.MenuInflater
import android.view.MenuItem
import android.view.MotionEvent
import android.view.View
import android.view.ViewGroup
import android.widget.ProgressBar
import android.widget.Toast
import androidx.annotation.RequiresApi
import androidx.core.view.MenuHost
import androidx.core.view.MenuProvider
import androidx.fragment.app.activityViewModels
import androidx.lifecycle.Lifecycle
import androidx.navigation.fragment.findNavController
import androidx.navigation.fragment.navArgs
import com.esri.arcgisruntime.ArcGISRuntimeEnvironment
import com.esri.arcgisruntime.data.Feature
import com.esri.arcgisruntime.data.QueryParameters
import com.esri.arcgisruntime.geometry.GeometryType
import com.esri.arcgisruntime.layers.FeatureLayer
import com.esri.arcgisruntime.loadable.LoadStatus
import com.esri.arcgisruntime.mapping.ArcGISMap
import com.esri.arcgisruntime.mapping.view.DefaultMapViewOnTouchListener
import com.esri.arcgisruntime.mapping.view.MapView
import com.esri.arcgisruntime.portal.Portal
import com.esri.arcgisruntime.portal.PortalItem
import com.progracol.aforos.databinding.FragmentMapVisitBinding
import android.app.AlertDialog
import android.content.DialogInterface
import com.esri.arcgisruntime.geometry.Envelope
import com.esri.arcgisruntime.mapping.view.LocationDisplay
import kotlin.math.min
import kotlin.math.max
import android.Manifest
import android.content.pm.PackageManager
import androidx.core.content.ContextCompat



import com.progracol.core.network.Resource
import com.progracol.core.ui.BaseFragment
import java.util.HashMap
import kotlin.math.roundToInt

class MapVisitFragment : BaseFragment(
    "Aforos"
) {
    private val args: MapVisitFragmentArgs by navArgs()

    private val viewModel: MapVisitViewModel by activityViewModels()
    private lateinit var binding : FragmentMapVisitBinding
    private lateinit var progressBar: ProgressBar
    private lateinit var map: ArcGISMap
    private lateinit var mapView: MapView
    private lateinit var dialog: Dialog
    private var showDetail: Boolean = false

    private lateinit var locationDisplay: LocationDisplay

    //ID PORTAL MAP ARCGIS
    private lateinit var ID_PORTAL_MAP_AFOROS: String

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        ID_PORTAL_MAP_AFOROS = args.idPortalMap
    }

    /**
     * getter function to retrieve the first available feature layer
     * [featureLayer] updates with every map click
     */
    private val featureLayer: FeatureLayer?
        get() {
            return map.operationalLayers?.filterIsInstance<FeatureLayer>()?.first {
                Log.e("ARGIS-id",it.id)
                Log.e("ARGIS-name", it.name)
                Log.e("ARGIS-description", it.description)
                Log.e("ARGIS-geometryType", it.featureTable?.geometryType.toString())
                Log.e("ARGIS-isVisible", it.isVisible.toString())
                Log.e("ARGIS-isPopupEnabled", it.isPopupEnabled.toString())
                Log.e("ARGIS-popupDefinition", it.popupDefinition.toString())
                (it.featureTable?.geometryType == GeometryType.POINT)
                    .and(it.isVisible)
                    .and(it.isPopupEnabled && it.popupDefinition != null)
            }
        }

    @RequiresApi(Build.VERSION_CODES.O)
    @SuppressLint("ClickableViewAccessibility")
    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding =  FragmentMapVisitBinding.inflate(inflater, container, false)
        val args: MapVisitFragmentArgs by navArgs()
        val receivedString = args.id
        //Toast.makeText(requireContext(),receivedString, Toast.LENGTH_LONG).show()
        loadMap(receivedString)
        setBackButton(requireActivity() as MenuHost)
        progressBar = binding.progressBar

        binding.takeMeLocation.setOnClickListener {
            // Verifica si los permisos de ubicación están activados
            if (ContextCompat.checkSelfPermission(
                    requireContext(),
                    Manifest.permission.ACCESS_FINE_LOCATION
                ) == PackageManager.PERMISSION_GRANTED
            ) {
                // Activa la localización del dispositivo en el mapa
                locationDisplay.autoPanMode = LocationDisplay.AutoPanMode.RECENTER
                if (!locationDisplay.isStarted)
                    locationDisplay.startAsync()
            } else {
                // Solicita los permisos de ubicación
                requestPermissions(arrayOf(Manifest.permission.ACCESS_FINE_LOCATION), 0)
            }
        }



        return binding.root
    }

    private fun loadMap(receivedString: String) {
        viewModel.getArgGisToken().observe(viewLifecycleOwner) {
            when(it.status){
                Resource.Status.LOADING -> {}
                Resource.Status.SUCCESS -> {
                    val token = it.data!!
                    setUpMap(token, receivedString)
                    // Inicializa el LocationDisplay con el mapView
                    locationDisplay = mapView.locationDisplay
                }
                Resource.Status.ERROR -> {}
            }
        }
    }

    private fun setUpMap(token: String, filterCode: String) {
        progressBar.visibility = View.VISIBLE
        ArcGISRuntimeEnvironment.setApiKey(token)
        val portal = Portal("https://www.arcgis.com", false)
        val portalItem = PortalItem(portal, ID_PORTAL_MAP_AFOROS)
        map = ArcGISMap(portalItem)
        mapView = binding.seeMap
        mapView.map = map
        locationDisplay = mapView.locationDisplay

        // Encuentra la capa "Usuarios Aforados Prisma" en las capas operacionales del mapa
        mapView.map.addDoneLoadingListener {
            if (map.loadStatus == LoadStatus.LOADED) {
                val layerName = "Usuarios Aforados Prisma"
                val targetLayer = map.operationalLayers.firstOrNull { it.name == layerName } as? FeatureLayer
                Log.e("ARGIS-FITLER", filterCode)
                // Crea una consulta de atributos utilizando el filtro proporcionado
                if (!filterCode.equals("")){
                    val queryString = "COD_BIOAGRICOLA IN ($filterCode)"

                    // Aplica la consulta a la capa
                    targetLayer?.let {
                        val queryParameters = QueryParameters().apply { whereClause = queryString }
                        it.definitionExpression = queryParameters.whereClause

                        zoomToLayer(targetLayer)


                        // Espera a que la capa haya terminado de cargar y se haya aplicado el filtro
                        it.addDoneLoadingListener {
                            progressBar.visibility = View.GONE
                        }
                        it.loadAsync()

                    } ?: run {
                        Log.e("SetUpMap", "No se encontró la capa: $layerName")
                        progressBar.visibility = View.GONE
                    }
                } else {
                    progressBar.visibility = View.GONE
                }

            } else {
                Log.e("SetUpMap", "Error al cargar el mapa: ${map.loadError}")
                progressBar.visibility = View.GONE
            }

            // Agrega un OnTouchListener para manejar el evento de clic en el mapa
            mapView.setOnTouchListener(object : DefaultMapViewOnTouchListener(requireContext(), mapView) {
                override fun onSingleTapConfirmed(e: MotionEvent): Boolean {
                    // Identifica las capas en el punto de clic
                    val screenPoint = android.graphics.Point(e.x.roundToInt(), e.y.roundToInt())
                    val identifyLayersFuture = mapView.identifyLayersAsync(screenPoint, 12.0, false)
                    identifyLayersFuture.addDoneListener {
                        val identifyResults = identifyLayersFuture.get()
                        // Busca un resultado que corresponda a la capa de interés
                        for (result in identifyResults) {
                            if (result.layerContent.name == "Usuarios Aforados Prisma" && result.elements.isNotEmpty()) {
                                val feature = result.elements[0] as Feature
                                val codBioagricola = feature.attributes["COD_BIOAGRICOLA"].toString()
                                val nombreUsuario = feature.attributes["NOMBRE_SUSCRIPTOR"].toString()
                                val direccion = feature.attributes["DIRECCION"].toString()

                                // Muestra el cuadro de diálogo con la información del atributo
                                showDialog(codBioagricola, nombreUsuario, direccion)
                                break
                            }
                        }
                    }
                    return super.onSingleTapConfirmed(e)
                }
            })

        }
    }

    private fun zoomToLayer(targetLayer: FeatureLayer) {
        val featureTable = targetLayer.featureTable
        val queryParams = QueryParameters().apply {
            whereClause = "1=1"
        }

        val future = featureTable.queryFeaturesAsync(queryParams)
        future.addDoneListener {
            val result = future.get()
            val features = result.iterator()

            if (features.hasNext()) {
                // Calcula la extensión total de todos los elementos
                var firstFeatureExtent = features.next().geometry.extent
                var xMin = firstFeatureExtent.xMin
                var yMin = firstFeatureExtent.yMin
                var xMax = firstFeatureExtent.xMax
                var yMax = firstFeatureExtent.yMax

                while (features.hasNext()) {
                    val featureExtent = features.next().geometry.extent
                    xMin = min(xMin, featureExtent.xMin)
                    yMin = min(yMin, featureExtent.yMin)
                    xMax = max(xMax, featureExtent.xMax)
                    yMax = max(yMax, featureExtent.yMax)
                }

                // Aumenta la extensión total en un 20% para agregar un margen alrededor de los puntos
                val width = xMax - xMin
                val height = yMax - yMin
                xMin -= width * 0.1
                xMax += width * 0.1
                yMin -= height * 0.1
                yMax += height * 0.1
                val expandedExtent = Envelope(xMin, yMin, xMax, yMax, firstFeatureExtent.spatialReference)

                // Centra la vista del mapa en la extensión total y ajusta el zoom
                mapView.setViewpointGeometryAsync(expandedExtent, 5.0)
            }
        }
    }


    private fun toggleLocationDisplay() {
        if (!locationDisplay.isStarted) {
            locationDisplay.autoPanMode = LocationDisplay.AutoPanMode.RECENTER
            locationDisplay.startAsync()
        } else {
            locationDisplay.stop()
        }
    }

    private fun findNearestPointAndRoute() {
        // Obtén la ubicación actual del usuario
        val currentLocation = locationDisplay.location

        if (currentLocation != null) {
            // Implementa la lógica para encontrar el punto más cercano y trazar la ruta
            // ...
        } else {
            Toast.makeText(requireContext(), "No se pudo obtener la ubicación del usuario.", Toast.LENGTH_SHORT).show()
        }
    }





    private fun showDialog(codBioagricola: String, nombreUsuario: String, direccion: String) {
        val alertDialogBuilder = AlertDialog.Builder(requireContext())
        alertDialogBuilder.setTitle("Información del punto")
        alertDialogBuilder.setMessage("""
                                        COD_BIOAGRICOLA: $codBioagricola
                                        NOMBRE_USUARIO: $nombreUsuario
                                        DIRECCION: $direccion
                                    """.trimIndent())
        alertDialogBuilder.setPositiveButton("Aceptar") { dialog: DialogInterface, _: Int ->
            dialog.dismiss()
        }
        alertDialogBuilder.show()
    }

    override fun setBackButton(menuHost: MenuHost) {
        menuHost.addMenuProvider(object : MenuProvider {
            override fun onCreateMenu(menu: Menu, menuInflater: MenuInflater) {
            }
            override fun onMenuItemSelected(menuItem: MenuItem): Boolean {
                if(menuItem.itemId == android.R.id.home) {
                    findNavController().popBackStack()
                }
                return true
            }
        }, viewLifecycleOwner, Lifecycle.State.RESUMED)
    }

    private fun getLongitude(cordinates: String): String {
        val split = cordinates.split(" ")
        if(split[1] == "") return "NA"
        val replace = split[1].replace("W", "")
        val newCordinate =  replace.toDouble()
        val newCordinateNegative = newCordinate*-1.0
        return newCordinateNegative.toString()
    }

    private fun getLatitude(cordinates: String): String {
        val split = cordinates.split(" ")
        if(split[0] == "") return "NA"
        val replace = split[0].replace("N", "")
        val newCordinate =  replace.toDouble()
        return newCordinate.toString()
    }

    private fun resetIdentifyResult() {
        featureLayer?.clearSelection()
    }

    override fun onRequestPermissionsResult(
        requestCode: Int,
        permissions: Array<String>,
        grantResults: IntArray
    ) {
        if (grantResults.isNotEmpty() && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
            // Permiso concedido
            if (locationDisplay != null && !locationDisplay.isStarted)
                locationDisplay.startAsync()
        } else {
            // Permiso denegado
            // Considera decirle al usuario que la función no puede ser habilitada sin el permiso
        }
    }

}


