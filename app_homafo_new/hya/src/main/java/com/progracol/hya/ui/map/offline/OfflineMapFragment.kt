package com.progracol.hya.ui.map.offline

import android.app.AlertDialog
import android.app.Dialog
import android.content.Intent
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Point
import android.graphics.drawable.BitmapDrawable
import android.graphics.drawable.Drawable
import android.os.Bundle
import android.util.Log
import android.view.*
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import androidx.core.content.ContextCompat
import androidx.core.view.MenuHost
import androidx.core.view.MenuProvider
import androidx.fragment.app.viewModels
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.lifecycleScope
import androidx.navigation.fragment.findNavController
import androidx.navigation.fragment.navArgs
import androidx.recyclerview.widget.LinearLayoutManager
import com.esri.arcgisruntime.ArcGISRuntimeEnvironment
import com.esri.arcgisruntime.data.Feature
import com.esri.arcgisruntime.geometry.CoordinateFormatter
import com.esri.arcgisruntime.geometry.GeometryType
import com.esri.arcgisruntime.geometry.SpatialReferences
import com.esri.arcgisruntime.layers.FeatureLayer
import com.esri.arcgisruntime.mapping.ArcGISMap
import com.esri.arcgisruntime.mapping.MobileMapPackage
import com.esri.arcgisruntime.mapping.popup.PopupField
import com.esri.arcgisruntime.mapping.popup.PopupManager
import com.esri.arcgisruntime.mapping.view.DefaultMapViewOnTouchListener
import com.esri.arcgisruntime.mapping.view.Graphic
import com.esri.arcgisruntime.mapping.view.GraphicsOverlay
import com.esri.arcgisruntime.mapping.view.MapView
import com.esri.arcgisruntime.symbology.PictureMarkerSymbol
import com.esri.arcgisruntime.symbology.TextSymbol
import com.google.gson.Gson
import com.progracol.core.database.entities.Independence
import com.progracol.core.database.entities.MarkerPointMap
import com.progracol.core.database.entities.SubscriptionDetail
import com.progracol.core.database.entities.UserMap
import com.progracol.core.network.Resource
import com.progracol.core.ui.BaseFragment
import com.progracol.core.util.screenRectPx
import com.progracol.hya.R
import com.progracol.hya.data.MapDetail
import com.progracol.hya.databinding.FragmentOfflineMapBinding
import com.progracol.hya.ui.base.adapter.IndependenceAdapter
import com.progracol.hya.ui.base.adapter.MarkerPointAdapter
import com.progracol.hya.ui.base.adapter.PointAdapter
import com.progracol.hya.ui.base.adapter.SubscriptionDetailAdapter
import com.progracol.hya.ui.form.FormActivity
import com.progracol.hya.ui.map.MapFragment
import com.progracol.hya.ui.map.MapRepository
import com.progracol.hya.ui.map.detail.MapDetailFragment
import com.progracol.hya.ui.map.search.datasync.MapDataPendingFragment
import com.progracol.hya.ui.map.sync.SyncFragment
import kotlinx.android.synthetic.main.fragment_data_sync.view.message
import kotlinx.android.synthetic.main.map_markers_point_list.message_markers
import kotlinx.android.synthetic.main.map_markers_point_list.view.btnDeleteAllMarkers
import kotlinx.android.synthetic.main.map_markers_point_list.view.btnHideAllMarkers
import kotlinx.android.synthetic.main.map_markers_point_list.view.list_of_markers
import kotlinx.coroutines.launch
import kotlin.math.roundToInt

class OfflineMapFragment : BaseFragment() {

    private lateinit var binding: FragmentOfflineMapBinding
    private val viewModel: OfflineMapViewModel by viewModels()
    private lateinit var userMap: UserMap
    private lateinit var map: ArcGISMap

    private lateinit var markerAdapter: MarkerPointAdapter

    private val args: OfflineMapFragmentArgs by navArgs()

    private val graphicsOverlay by lazy { GraphicsOverlay()}

    private lateinit var mapView: MapView
    private var showDetail: Boolean = false

    private var movableGraphic: Graphic? = null

    private lateinit var dialog: Dialog

    private var showDataPending: Boolean = false

    private var showMarkersMap: Boolean = true

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

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding = FragmentOfflineMapBinding.inflate(inflater, container, false)

        setBackButton(requireActivity() as MenuHost)

        markerAdapter = MarkerPointAdapter(
            requireContext(),
            deleteMarker = {
                val marker: MarkerPointMap = it

                viewModel.deleteMarkerPointMap(marker).observe(viewLifecycleOwner) {
                    when (it.status) {
                        Resource.Status.LOADING -> {}
                        Resource.Status.SUCCESS -> {
                            val graphics = graphicsOverlay.graphics
                            val iterator = graphics.iterator()
                            while (iterator.hasNext()) {
                                val graphic = iterator.next()
                                val nameAttr = graphic.attributes["id"]
                                if (nameAttr == marker.id.toString()) {
                                    iterator.remove() // elimina el marcador
                                }
                            }
                            val nuevaLista = markerAdapter.currentList.toMutableList()
                            nuevaLista.remove(marker)
                            if(nuevaLista.isEmpty() == true) {
                                loadMarkers()
                            }
                            markerAdapter.submitList(nuevaLista)
                            Toast.makeText(requireContext(),"Se elimino el marcador.",Toast.LENGTH_SHORT).show()
                        }
                        Resource.Status.ERROR -> {
                            Toast.makeText(requireContext(),"Error al eliminar el marcador.",Toast.LENGTH_SHORT).show()
                        }
                    }
                }
            },
            hideMarker = {
                val marker: MarkerPointMap = it
                val graphics = graphicsOverlay.graphics
                val iterator = graphics.iterator()
                while (iterator.hasNext()) {
                    val graphic = iterator.next()
                    val nameAttr = graphic.attributes["id"]
                    if (nameAttr == marker.id.toString()) {
                        graphic.isVisible = !graphic.isVisible // Oculta el marcador
                    }
                }
            }
        )

        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        loadMarkers()
        loadMap()

        binding.btnAddNewPoint.setOnClickListener {
            if(MapRepository.markerCoordinates == null){
                Toast.makeText(
                    requireContext(),
                    resources.getString(R.string.advertencia_coordenadas),
                    Toast.LENGTH_LONG
                ).show()
            } else {
                val intent = Intent(this.requireContext(), FormActivity::class.java)
                intent.putExtra("posFragments", "3")
                startActivity(intent)
            }
        }
    }

    private fun loadMarkers() {
        viewModel.getMarkersPointMap().observe(viewLifecycleOwner) {
            Toast.makeText(requireContext(),resources.getString(R.string.search_markers_point_map),Toast.LENGTH_SHORT).show()

            if (it.data?.isEmpty() == true) {
                dialog.message_markers.visibility = View.VISIBLE
                dialog.message_markers.text = resources.getString(R.string.not_markers_point_results)
                markerAdapter.submitList(listOf())
            } else {
                markerAdapter.submitList(it.data)
            }
        }
    }

    private fun loadMap() {
        viewModel.getArgGisToken().observe(viewLifecycleOwner) {
            when(it.status){
                Resource.Status.LOADING -> {}
                Resource.Status.SUCCESS -> {
                    loadMapOffline(it.data!!)
                }
                Resource.Status.ERROR -> {}
            }
        }
    }

    private fun loadMapOffline(token: String) {
        ArcGISRuntimeEnvironment.setApiKey(token)
        viewModel.getMap(args.id.toLong()).observe(viewLifecycleOwner) { it ->
            mapView = binding.map

            val mapPackage = MobileMapPackage(it?.path)
            mapPackage.loadAsync()
            mapPackage.addDoneLoadingListener {
                mapView.map = mapPackage.maps[0]
                map = mapPackage.maps[0]
                loadLayout()
            }
            userMap = it!!

        }
    }

    private fun loadLayout() {
        binding.map.onTouchListener =
            object : DefaultMapViewOnTouchListener(requireContext(), mapView) {
                override fun onSingleTapConfirmed(event: MotionEvent): Boolean {
                    val screenPoint = android.graphics.Point(
                        event.x.roundToInt(),
                        event.y.roundToInt()
                    )
                    val mapPoint: com.esri.arcgisruntime.geometry.Point? = mapView.screenToLocation(screenPoint)
                    val cordinates = CoordinateFormatter.toLatitudeLongitude(mapPoint,CoordinateFormatter.LatitudeLongitudeFormat.DECIMAL_DEGREES, 10)

                    // setup identifiable layer at the given screen point.
                    identifyLayer(screenPoint,cordinates)
                    return true
                }

                override fun onLongPress(event: MotionEvent) {
                    super.onLongPress(event)

                    val screenPoint = android.graphics.Point(event.x.roundToInt(), event.y.roundToInt())
                    val mapPoint = mapView.screenToLocation(screenPoint)

                    // Mover marcador existente o agregar uno si no existe
                    addMarkerMap(mapPoint)
                }

                override fun onDoubleTap(event: MotionEvent): Boolean {
                    super.onDoubleTap(event)

                    val screenPoint = android.graphics.Point(event.x.roundToInt(), event.y.roundToInt())
                    val mapPoint = mapView.screenToLocation(screenPoint)

                    // Puedes pedir un nombre para el marcador o generar uno por defecto
                    showInputDialog(mapPoint)

                    return true
                }
            }

        mapView.apply {
            try {
                if(markerAdapter.currentList != null && !markerAdapter.currentList.isEmpty()) {
                    markerAdapter.currentList.forEach { marker ->
                        val point = com.esri.arcgisruntime.geometry.Point(marker.longitude?.toDoubleOrNull() as Double, marker.latitude?.toDoubleOrNull() as Double, SpatialReferences.getWebMercator())
                        addNamedMarker(point,marker.name.toString(), false, marker.id.toString())
                        /*val graphic = graphicsOverlay.graphics.firstOrNull { item ->
                            item.attributes["id"] == marker.id.toString()
                        }
                        if(graphic == null) {
                            addNamedMarker(point,marker.name.toString(), false, marker.id.toString())
                        }*/
                    }
                }
                graphicsOverlays.add(graphicsOverlay)
            } catch (exception: Exception) {
                Log.e(MapFragment::class.simpleName, exception.stackTraceToString())
            }
        }
    }

    private fun showInputDialog(location: com.esri.arcgisruntime.geometry.Point) {
        val input = EditText(requireContext())
        input.hint = "Nombre del marcador"

        AlertDialog.Builder(requireContext())
            .setTitle("Nuevo marcador")
            .setView(input)
            .setPositiveButton("Agregar") { _, _ ->
                val name = input.text.toString()
                addNamedMarker(location, name, true,"")
            }
            .setNegativeButton("Cancelar", null)
            .show()
    }

    private fun addNamedMarker(location: com.esri.arcgisruntime.geometry.Point, name: String, create: Boolean, id_created: String) {
        fun crearGrafica(id: String) {
            // Icono personalizado (usa un vector convertido a BitmapDrawable)
            val drawable = ContextCompat.getDrawable(requireContext(), R.drawable.ic_marker_favorite)
            val bitmap = getBitmapFromVectorDrawable(drawable!!)
            val bitmapDrawable = BitmapDrawable(resources, bitmap)

            PictureMarkerSymbol.createAsync(bitmapDrawable).addDoneListener {
                val symbol = PictureMarkerSymbol(bitmapDrawable)
                symbol.offsetY = 20f

                var markerGraphic = Graphic(location, symbol)
                if (create) {
                    markerGraphic.attributes.set("id",id)
                }else{
                    markerGraphic.attributes.set("id",id_created)
                }
                markerGraphic.attributes.set("name","marcador")
                graphicsOverlay.graphics.add(markerGraphic)

                // Agregar texto
                val textSymbol = TextSymbol(
                    12f,
                    name,
                    Color.BLACK,
                    TextSymbol.HorizontalAlignment.CENTER,
                    TextSymbol.VerticalAlignment.BOTTOM
                ).apply {
                    fontWeight = TextSymbol.FontWeight.BOLD
                    haloColor = Color.WHITE
                    haloWidth = 2f
                }
                var textGraphic = Graphic(location, textSymbol)
                if (create) {
                    textGraphic.attributes.set("id",id)
                }else{
                    textGraphic.attributes.set("id",id_created)
                }
                textGraphic.attributes.set("name","marcador")
                graphicsOverlay.graphics.add(textGraphic)
            }
        }

        if(create) {
            val newMarkerPoint = MarkerPointMap(
                id = null,
                name = name,
                longitude = location.x.toString(),
                latitude = location.y.toString()
            )
            viewModel.saveMarkerPointMap(newMarkerPoint).observe(viewLifecycleOwner) {
                when (it.status) {
                    Resource.Status.LOADING -> {}
                    Resource.Status.SUCCESS -> {
                        val id = it.data.toString()
                        crearGrafica(id)
                        Toast.makeText(requireContext(),resources.getString(R.string.marker_point_map),Toast.LENGTH_SHORT).show()
                    }
                    Resource.Status.ERROR -> {
                        Toast.makeText(requireContext(),resources.getString(R.string.error_marker_point_map),Toast.LENGTH_SHORT).show()
                    }
                }
            }
        } else {
            crearGrafica(id_created)
        }
    }


    private fun addMarkerMap(point: com.esri.arcgisruntime.geometry.Point) {
        val drawable = ContextCompat.getDrawable(requireContext(), R.drawable.ic_point)

        // Asegura que el drawable no sea nulo
        if (drawable != null) {
            val bitmap = getBitmapFromVectorDrawable(drawable)
            val bitmapDrawable = BitmapDrawable(resources, bitmap)

            val symbolFuture = PictureMarkerSymbol.createAsync(bitmapDrawable)

            symbolFuture.addDoneListener {
                val symbol = symbolFuture.get()
                symbol.offsetY = 20f // Para ajustar el anclaje visual

                if (movableGraphic == null) {
                    movableGraphic = Graphic(point, symbol)
                    graphicsOverlay.graphics.add(movableGraphic)
                } else {
                    movableGraphic?.geometry = point
                }

                //Se guardan las coordenadas del marcador para poder crear un punto o para crear una independencia
                Log.e("MapFragment", "Guardado en ViewModel: ${point.x}, ${point.y}")
                MapRepository.markerCoordinates = point
            }
        }
    }

    private fun getBitmapFromVectorDrawable(drawable: Drawable): Bitmap {
        val bitmap = Bitmap.createBitmap(
            drawable.intrinsicWidth,
            drawable.intrinsicHeight,
            Bitmap.Config.ARGB_8888
        )
        val canvas = Canvas(bitmap)
        drawable.setBounds(0, 0, canvas.width, canvas.height)
        drawable.draw(canvas)
        return bitmap
    }

    private fun identifyLayer(screenPoint: Point, cordinates: String) {
        Log.e("ARGIS-point", screenPoint.toString())
        featureLayer?.let {
            Log.e("ARCGIS-IDENTIFY",it.toString())

            val identifyLayerResultsFuture = mapView
                .identifyLayerAsync(featureLayer, screenPoint, 12.0,false)

            identifyLayerResultsFuture.addDoneListener {
                try {
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
                        var fieldHashs:HashMap<String, String> = HashMap<String, String>()
                        for (field in fields) {
                            val fieldName = field.fieldName // Nombre interno del campo
                            val fieldLabel = field.label // Etiqueta visible
                            val fieldValue = popupManager.getFormattedValue(field).toString()

                            Log.e("***FIELD***", "Nombre: $fieldName, Etiqueta: $fieldLabel, Valor: $fieldValue")
                            if(fieldLabel == "COD_BIOAGRICOLA") subscriptionId = fieldValue
                            fieldHashs.put(fieldName,fieldValue)
                        }
                        val gson = Gson()
                        fieldHashs.put("latitude", getLatitude(cordinates))
                        fieldHashs.put("longitude", getLongitude(cordinates))

                        val dataJson = gson.toJson(fieldHashs).toString()

                        Log.e("JSON_STRING_FIELDS", dataJson)

                        if(!showDetail) {
                            showDetail = true
                            val mapDetailFragment =
                                MapDetailFragment(gson.fromJson(dataJson, MapDetail::class.java),
                                    true,
                                    closeDialog = {showDetail=false})
                            mapDetailFragment.show(
                                parentFragmentManager,
                                MapFragment::class.simpleName
                            )

                            Log.e("FIELDS", fieldHashs.toString())
                        }
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

    override fun setBackButton(menuHost: MenuHost) {
        super.setBackButton(menuHost)
        menuHost.addMenuProvider(object : MenuProvider {
            override fun onCreateMenu(menu: Menu, menuInflater: MenuInflater) {
                menuInflater.inflate(R.menu.nav_menu_map_offline, menu)
            }
            override fun onMenuItemSelected(menuItem: MenuItem): Boolean {
                when(menuItem.itemId) {
                    android.R.id.home -> findNavController().popBackStack()
                    R.id.edit_layout -> showListPending()
                    R.id.markers_layout -> {
                        showListMarkers()
                        loadMarkers()
                    }
                    R.id.sync -> showSync()
                }
                return true
            }
        }, viewLifecycleOwner, Lifecycle.State.RESUMED)
    }

    private fun showListPending() {
        val mapDataPendingFragment = MapDataPendingFragment(closeDialog = {showDataPending = false})
        mapDataPendingFragment.show(
            parentFragmentManager,
            MapFragment::class.simpleName
        )
    }

    private fun showListMarkers() {
        val builder = AlertDialog.Builder(context)
        builder.setCancelable(true)

        val inflater = LayoutInflater.from(requireContext())
        val rootLayoutMarketList = inflater.inflate(R.layout.map_markers_point_list, null) as View

        rootLayoutMarketList.list_of_markers.layoutManager = LinearLayoutManager(requireContext())
        rootLayoutMarketList.list_of_markers.adapter = markerAdapter

        rootLayoutMarketList.btnDeleteAllMarkers.setOnClickListener {
            viewModel.deleteAllMarkerPointMap().observe(viewLifecycleOwner) {
                when (it.status) {
                    Resource.Status.LOADING -> {}
                    Resource.Status.SUCCESS -> {
                        val graphics = graphicsOverlay.graphics
                        val iterator = graphics.iterator()
                        while (iterator.hasNext()) {
                            val graphic = iterator.next()
                            val nameAttr = graphic.attributes["name"]
                            if (nameAttr == "marcador") {
                                iterator.remove() // elimina el marcador
                            }
                        }
                        loadMarkers()
                        Toast.makeText(requireContext(),"Se eliminaron los marcadores.",Toast.LENGTH_SHORT).show()
                    }
                    Resource.Status.ERROR -> {
                        Toast.makeText(requireContext(),"Error al eliminar los marcadores.",Toast.LENGTH_SHORT).show()
                    }
                }
            }
        }

        rootLayoutMarketList.btnHideAllMarkers.setOnClickListener {
            showMarkersMap = !showMarkersMap
            val graphics = graphicsOverlay.graphics
            val iterator = graphics.iterator()
            while (iterator.hasNext()) {
                val graphic = iterator.next()
                val nameAttr = graphic.attributes["name"]
                graphic.isVisible = true
                if (nameAttr == "marcador") {
                    graphic.isVisible = showMarkersMap
                }
            }
            Toast.makeText(requireContext(),"Se ocultaron los marcadores.",Toast.LENGTH_SHORT).show()
        }

        // Establecer la vista inflada en el AlertDialog
        builder.setView(rootLayoutMarketList)

        dialog = builder.create().apply {
            val background = ContextCompat.getDrawable(context, com.progracol.core.R.drawable.background_dialog_v2)
            window?.setBackgroundDrawable(background)
        }
        dialog.show()
        val size = screenRectPx.width()
        dialog.window!!.setLayout((size*0.9F).toInt(), ViewGroup.LayoutParams.WRAP_CONTENT)

    }

    fun showSync() {
        val syncFragment = SyncFragment()
        syncFragment.show(parentFragmentManager, MapFragment::class.simpleName)
    }

    override fun onDestroy() {
        super.onDestroy()
        MapRepository.markerCoordinates = null
    }

}