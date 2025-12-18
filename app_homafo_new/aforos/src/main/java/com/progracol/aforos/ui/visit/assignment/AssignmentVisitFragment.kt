package com.progracol.aforos.ui.visit.assignment

import android.annotation.SuppressLint
import android.app.AlertDialog
import android.app.Dialog
import android.graphics.Color
import android.graphics.Point
import android.os.Build
import androidx.lifecycle.ViewModelProvider
import android.os.Bundle
import android.util.Log
import android.view.*
import com.google.gson.Gson
import androidx.fragment.app.Fragment
import android.widget.ProgressBar
import android.widget.Toast
import androidx.annotation.RequiresApi
import androidx.core.content.ContextCompat
import androidx.core.view.MenuHost
import androidx.core.view.MenuProvider
import androidx.fragment.app.activityViewModels
import androidx.lifecycle.Lifecycle
import androidx.navigation.fragment.findNavController
import com.esri.arcgisruntime.ArcGISRuntimeEnvironment
import com.esri.arcgisruntime.concurrent.Job
import com.esri.arcgisruntime.data.Feature
import com.esri.arcgisruntime.data.ServiceFeatureTable
import com.esri.arcgisruntime.geometry.CoordinateFormatter
import com.esri.arcgisruntime.geometry.Envelope
import com.esri.arcgisruntime.geometry.GeometryType
import com.esri.arcgisruntime.layers.FeatureLayer
import com.esri.arcgisruntime.loadable.LoadStatus
import com.esri.arcgisruntime.mapping.ArcGISMap
import com.esri.arcgisruntime.mapping.popup.PopupField
import com.esri.arcgisruntime.mapping.popup.PopupManager
import com.esri.arcgisruntime.mapping.view.DefaultMapViewOnTouchListener
import com.esri.arcgisruntime.mapping.view.Graphic
import com.esri.arcgisruntime.mapping.view.GraphicsOverlay
import com.esri.arcgisruntime.mapping.view.MapView
import com.esri.arcgisruntime.portal.Portal
import com.esri.arcgisruntime.portal.PortalItem
import com.esri.arcgisruntime.symbology.SimpleLineSymbol
import com.esri.arcgisruntime.tasks.offlinemap.GenerateOfflineMapJob
import com.esri.arcgisruntime.tasks.offlinemap.GenerateOfflineMapParameters
import com.esri.arcgisruntime.tasks.offlinemap.OfflineMapTask
import com.google.android.material.checkbox.MaterialCheckBox
import com.progracol.aforos.R
import com.progracol.aforos.common.MapDetail
import com.progracol.aforos.databinding.FragmentAssignmentVisitBinding
import com.progracol.core.database.entities.UserMap
import com.progracol.core.network.Resource
import com.progracol.core.ui.BaseFragment
import com.progracol.core.util.screenRectPx
import java.io.File
import java.time.LocalDate
import java.util.HashMap
import kotlin.math.roundToInt

class AssignmentVisitFragment : BaseFragment(
    "Mapa asignacion"
) {

    private val viewModel: AssignmentVisitViewModel by activityViewModels()
    private lateinit var binding : FragmentAssignmentVisitBinding
    private lateinit var progressBar: ProgressBar
    private lateinit var map: ArcGISMap
    private lateinit var mapView: MapView

    private lateinit var Rutas_recoleccion_layer: FeatureLayer
    private lateinit var Barrios_layer: FeatureLayer
    private lateinit var Toponimia_Villavicencio_layer: FeatureLayer
    private lateinit var U_Terreno_layer: FeatureLayer
    private lateinit var R_Terreno_layer: FeatureLayer
    private lateinit var Comunas_layer: FeatureLayer
    private lateinit var Veredas_layer: FeatureLayer
    private lateinit var dialog: Dialog

    private var isRutasEnabled:Boolean = false
    private var isBarriosEnabled:Boolean = false
    private var isToponimia_VillavicencioEnabled:Boolean = false
    private var isU_TerrenoEnabled:Boolean = false
    private var isR_TerrenoEnabled:Boolean = false
    private var isComunasEnabled:Boolean = false
    private var isVeredasEnabled:Boolean = false

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        //viewModel.mapId = args.id
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
        binding =  FragmentAssignmentVisitBinding.inflate(inflater, container, false)

        loadMap()
        setBackButton(requireActivity() as MenuHost)

        return binding.root
    }

    private fun loadMap() {
        viewModel.getArgGisToken().observe(viewLifecycleOwner) {
            when(it.status){
                Resource.Status.LOADING -> {}
                Resource.Status.SUCCESS -> {
                    setUpMap(it.data!!)
                }
                Resource.Status.ERROR -> {}
            }
        }
    }

    private fun setUpMap(token: String) {
        ArcGISRuntimeEnvironment.setApiKey(token)
        val portalItemId = "e08d3b7a8b8b449baf2d51e612ec47d0"
        val portal = Portal("https://www.arcgis.com",false)
        val portalItem = PortalItem(portal, portalItemId)
        map = ArcGISMap(portalItem)
        mapView = binding.map
        mapView.map = map

        val Rutas_recoleccion = ServiceFeatureTable("https://services7.arcgis.com/c0V1cyhKZwmv8Gtf/ArcGIS/rest/services/Rutas_Recoleccion/FeatureServer/0")
        val Barrios = ServiceFeatureTable("https://services7.arcgis.com/c0V1cyhKZwmv8Gtf/ArcGIS/rest/services/Barrios/FeatureServer/0")
        val Toponimia_Villavicencio = ServiceFeatureTable("https://services7.arcgis.com/c0V1cyhKZwmv8Gtf/ArcGIS/rest/services/Toponimia_Villavicencio/FeatureServer/0")
        val U_Terreno = ServiceFeatureTable("https://services7.arcgis.com/c0V1cyhKZwmv8Gtf/ArcGIS/rest/services/U_TERRENO/FeatureServer/1")
        val R_Terreno = ServiceFeatureTable("https://services7.arcgis.com/c0V1cyhKZwmv8Gtf/ArcGIS/rest/services/R_TERRENO/FeatureServer/1")
        val Comunas = ServiceFeatureTable("https://services7.arcgis.com/c0V1cyhKZwmv8Gtf/ArcGIS/rest/services/Comunas/FeatureServer/0?")
        val Veredas = ServiceFeatureTable("https://services7.arcgis.com/c0V1cyhKZwmv8Gtf/ArcGIS/rest/services/Veredas_2022/FeatureServer/2475")

        Rutas_recoleccion_layer = FeatureLayer(Rutas_recoleccion)
        Barrios_layer = FeatureLayer(Barrios)
        Toponimia_Villavicencio_layer = FeatureLayer(Toponimia_Villavicencio)
        U_Terreno_layer = FeatureLayer(U_Terreno)
        R_Terreno_layer = FeatureLayer(R_Terreno)
        Comunas_layer = FeatureLayer(Comunas)
        Veredas_layer = FeatureLayer(Veredas)

        /*map.operationalLayers.add(Rutas_recoleccion_layer)
        map.operationalLayers.add(Barrios_layer)
        map.operationalLayers.add(Toponimia_Villavicencio_layer)
        map.operationalLayers.add(U_Terreno_layer)
        map.operationalLayers.add(R_Terreno_layer)
        map.operationalLayers.add(Veredas_layer)*/


        binding.map.onTouchListener =
            object : DefaultMapViewOnTouchListener(requireContext(), mapView) {
                override fun onSingleTapConfirmed(event: MotionEvent): Boolean {
                    // set the progressBar visibility
//                    progressBar.visibility = View.VISIBLE
                    val screenPoint = android.graphics.Point(
                        event.x.roundToInt(),
                        event.y.roundToInt()
                    )
                    val mapPoint: com.esri.arcgisruntime.geometry.Point? = mapView.screenToLocation(screenPoint)
                    val cordinates = CoordinateFormatter.toLatitudeLongitude(mapPoint,
                        CoordinateFormatter.LatitudeLongitudeFormat.DECIMAL_DEGREES, 10)

                    // setup identifiable layer at the given screen point.
                    identifyLayer(screenPoint,cordinates)
                    return true
                }
            }

    }

    private fun finisload() {
        //Add Nuew Layer.

        //map.operationalLayers.add(Rutas_recoleccion_layer)
        //map.operationalLayers.add(Barrios_layer)
        //map.operationalLayers.add(Toponimia_Villavicencio_layer)
        //map.operationalLayers.add(U_Terreno_layer)
        //map.operationalLayers.add(R_Terreno_layer)
        //map.operationalLayers.add(Comunas_layer)
        //map.operationalLayers.add(Veredas_layer)

    }



    private fun identifyLayer(screenPoint: Point, cordinates: String) {
        featureLayer?.let {
            // clear the selected features from the feature layer
            resetIdentifyResult()
            Log.e("ARCGIS-IDENTIFY",it.toString())

            val identifyLayerResultsFuture = mapView
                .identifyLayerAsync(featureLayer, screenPoint, 12.0,false)

            identifyLayerResultsFuture.addDoneListener {
                try {
                    //Log.e("LAT-LONG", CoordinateFormatter.toLatitudeLongitud/e(screenPoint,
                    /////    CoordinateFormatter.LatitudeLongitudeFormat.DECIMAL_DEGREES, 4))

                    val identifyLayerResult = identifyLayerResultsFuture.get()
                    Log.e("ARCGIS-IDENTIFY-DONE",identifyLayerResultsFuture.get().popups.size.toString())
                    Log.e("ARCGIS-IDENTIFY-DONE",identifyLayerResultsFuture.get().popups.toString())
                    if (identifyLayerResult.popups.isNotEmpty()) {
                        val featureLayer: FeatureLayer? =
                            identifyLayerResult.layerContent as? FeatureLayer
                        featureLayer?.selectFeature(identifyLayerResult.popups.first().geoElement as Feature)
                        //bottomSheetBehavior.state = BottomSheetBehavior.STATE_HALF_EXPANDED
                        Log.e("ARG",
                            identifyLayerResult.popups.first().popupDefinition.fields.map { "${it.fieldName}" }
                                .toString()
                        )
                        val popupManager = PopupManager(context, identifyLayerResult.popups.first())
                        val fields: List<PopupField> = popupManager.displayedFields
                        var subscriptionId: String = ""
                        var fieldHashs: HashMap<String, String> = HashMap<String, String>()
                        for (field in fields) {
                            fieldHashs.put(field.label,popupManager.getFormattedValue(field).toString())

                            if(field.label == "COD_BIOAGRICOLA") subscriptionId = popupManager.getFormattedValue(field).toString()
                            Log.e("***FIELD***", field.label)
                        }
                        fieldHashs.put("latitude", getLatitude(cordinates))
                        fieldHashs.put("longitude", getLongitude(cordinates))
                        val gson = Gson()
                        val dataJson = gson.toJson(fieldHashs).toString()
                        val mapDetailFragment = AssignmentMapDetailFragment(gson.fromJson(dataJson,  MapDetail::class.java))
                        mapDetailFragment.show(parentFragmentManager, AssignmentVisitFragment::class.simpleName)

                        Log.e("FIELDS", fieldHashs.toString())


                    }
                } catch (e: Exception) {
                    val error = "Error identifying results ${e.message}"
                    Log.e("MAPA ERROR", error)
                    Toast.makeText(requireContext(), error, Toast.LENGTH_SHORT).show()
                }

                // set the progressBar visibility
                //progressBar.visibility = View.GONE
            }
        }
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


    override fun onPause() {
        //mapView.pause()
        super.onPause()
    }

    override fun onResume() {
        super.onResume()
        //mapView.resume()
    }

    override fun onDestroy() {
        //mapView.dispo se()
        super.onDestroy()
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

    /*
    private fun showLayers() {
        val builder = AlertDialog.Builder(context)
        builder.setCancelable(true)
        val inflater = LayoutInflater.from(context)
       // val view = inflater.inflate(R.layout.map_dialog_layers_maps, null) as View
        builder.setView(view)

        val check_layer_rutas: MaterialCheckBox = view.findViewById(R.id.check_layer_rutas)
        val check_toponomia: MaterialCheckBox = view.findViewById(R.id.check_toponomia)
        val check_u_terreno: MaterialCheckBox = view.findViewById(R.id.check_u_terreno)
        val check_r_terreno: MaterialCheckBox = view.findViewById(R.id.check_r_terreno)
        val check_comunas: MaterialCheckBox = view.findViewById(R.id.check_comunas)
        val check_veredas: MaterialCheckBox = view.findViewById(R.id.check_veredas)
        check_layer_rutas.isChecked = isRutasEnabled
        check_barrios.isChecked = isBarriosEnabled
        check_toponomia.isChecked = isToponimia_VillavicencioEnabled
        check_u_terreno.isChecked = isU_TerrenoEnabled
        check_r_terreno.isChecked = isR_TerrenoEnabled
        check_comunas.isChecked = isComunasEnabled
        check_veredas.isChecked = isVeredasEnabled
        dialog = builder.create().apply {
            val background = ContextCompat.getDrawable(context, com.progracol.core.R.drawable.background_dialog)
            window?.setBackgroundDrawable(background)
        }
        dialog.show()
        val size = screenRectPx.width()
        dialog.window!!.setLayout((size*0.9F).toInt(), ViewGroup.LayoutParams.WRAP_CONTENT)

        check_layer_rutas.addOnCheckedStateChangedListener { checkBox, state -> (

                if(checkBox.isChecked){
                    //Add layer
                    map.operationalLayers.add(Rutas_recoleccion_layer)
                    isRutasEnabled = true
                }else {
                    //Remove Layer
                    map.operationalLayers.remove(Rutas_recoleccion_layer)
                    isRutasEnabled = false
                }
                ) }
        check_barrios.addOnCheckedStateChangedListener { checkBox, state -> (
                if(checkBox.isChecked){
                    //Add layer
                    isBarriosEnabled = true
                    map.operationalLayers.add(Barrios_layer)
                }else {
                    isBarriosEnabled = false
                    map.operationalLayers.remove(Barrios_layer)
                }
                ) }
        check_toponomia.addOnCheckedStateChangedListener { checkBox, state -> (
                if(checkBox.isChecked){
                    //Add layer
                    map.operationalLayers.add(Toponimia_Villavicencio_layer)
                    isToponimia_VillavicencioEnabled = true
                }else {
                    //Remove Layer
                    map.operationalLayers.remove(Toponimia_Villavicencio_layer)
                    isToponimia_VillavicencioEnabled = false
                }
                ) }
        check_u_terreno.addOnCheckedStateChangedListener { checkBox, state -> (
                if(checkBox.isChecked){
                    //Add layer
                    map.operationalLayers.add(U_Terreno_layer)
                    isU_TerrenoEnabled = true
                }else {
                    //Remove Layer
                    map.operationalLayers.remove(U_Terreno_layer)
                    isU_TerrenoEnabled = false
                }
                ) }
        check_r_terreno.addOnCheckedStateChangedListener { checkBox, state -> (
                if(checkBox.isChecked){
                    //Add layer
                    map.operationalLayers.add(R_Terreno_layer)
                    isR_TerrenoEnabled = true
                }else {
                    //Remove Layer
                    map.operationalLayers.remove(R_Terreno_layer)
                    isR_TerrenoEnabled = false
                }
                ) }
        check_comunas.addOnCheckedStateChangedListener { checkBox, state -> (
                if(checkBox.isChecked){
                    //Add layer
                    map.operationalLayers.add(Comunas_layer)
                    isComunasEnabled = true
                }else {
                    //Remove Layer
                    map.operationalLayers.remove(Comunas_layer)
                    isComunasEnabled = false
                }
                ) }
        check_veredas.addOnCheckedStateChangedListener { checkBox, state -> (
                if(checkBox.isChecked){
                    //Add layer
                    map.operationalLayers.add(Veredas_layer)
                    isVeredasEnabled = true
                }else {
                    //Remove Layer
                    map.operationalLayers.remove(Veredas_layer)
                    isVeredasEnabled = false
                }
                ) }


        /*mapDeleteTextView.setOnClickListener {
            shoMapDetail()
            dialog.dismiss()
        }

        mapDetailTextView.setOnClickListener {
            mapDetail()
            dialog.dismiss()

        }*/
    }
    */
}