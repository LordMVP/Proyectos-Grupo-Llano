package com.progracol.hya.ui.map


import android.annotation.SuppressLint
import android.app.AlertDialog
import android.app.Dialog
import android.graphics.Color
import android.graphics.Point
import android.os.Build
import android.os.Bundle
import android.util.Log
import android.view.*
import android.widget.Button
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
import com.esri.arcgisruntime.geometry.*
import com.esri.arcgisruntime.layers.FeatureLayer
import com.esri.arcgisruntime.loadable.LoadStatus
import com.esri.arcgisruntime.mapping.ArcGISMap
import com.esri.arcgisruntime.mapping.popup.PopupField
import com.esri.arcgisruntime.mapping.popup.PopupManager
import com.esri.arcgisruntime.mapping.view.DefaultMapViewOnTouchListener
import com.esri.arcgisruntime.mapping.view.Graphic
import com.esri.arcgisruntime.mapping.view.GraphicsOverlay
import com.esri.arcgisruntime.mapping.view.LocationDisplay
import com.esri.arcgisruntime.mapping.view.MapView
import com.esri.arcgisruntime.portal.Portal
import com.esri.arcgisruntime.portal.PortalItem
import com.esri.arcgisruntime.symbology.SimpleLineSymbol
import com.esri.arcgisruntime.tasks.offlinemap.GenerateOfflineMapJob
import com.esri.arcgisruntime.tasks.offlinemap.GenerateOfflineMapParameters
import com.esri.arcgisruntime.tasks.offlinemap.OfflineMapTask
import com.google.android.material.checkbox.MaterialCheckBox
import com.google.gson.Gson
import com.progracol.core.database.entities.UserMap
import com.progracol.core.network.Resource
import com.progracol.core.ui.BaseFragment
import com.progracol.core.util.screenRectPx
import com.progracol.hya.R
import com.progracol.hya.data.MapDetail
import com.progracol.hya.databinding.FragmentMapBinding
import com.progracol.hya.databinding.FragmentMapOfflineDialogBinding
import com.progracol.hya.ui.map.detail.MapDetailFragment
import com.progracol.hya.ui.map.sync.SyncFragment
import java.io.File
import java.time.LocalDate
import java.util.*
import kotlin.math.roundToInt
import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.drawable.BitmapDrawable
import android.graphics.drawable.ColorDrawable
import android.graphics.drawable.Drawable
import android.os.Handler
import android.os.Looper
import android.view.animation.AnimationUtils
import android.widget.EditText
import android.widget.LinearLayout
import android.widget.PopupWindow
import android.widget.TextView
import androidx.lifecycle.lifecycleScope
import androidx.navigation.fragment.navArgs
import androidx.recyclerview.widget.LinearLayoutManager
import com.esri.arcgisruntime.symbology.PictureMarkerSymbol
import com.esri.arcgisruntime.symbology.SimpleMarkerSymbol
import com.esri.arcgisruntime.symbology.TextSymbol
import com.progracol.core.database.entities.MarkerPointMap
import com.progracol.hya.ui.base.adapter.MarkerPointAdapter
import com.progracol.hya.ui.form.FormActivity
import com.progracol.hya.ui.map.search.MapSearchFragment
import com.progracol.hya.ui.map.search.datasync.MapDataPendingFragment
import kotlinx.android.synthetic.main.fragment_data_sync.view.message
import kotlinx.android.synthetic.main.map_markers_point_list.message_markers
import kotlinx.android.synthetic.main.map_markers_point_list.view.btnDeleteAllMarkers
import kotlinx.android.synthetic.main.map_markers_point_list.view.btnHideAllMarkers
import kotlinx.android.synthetic.main.map_markers_point_list.view.list_of_markers
import kotlinx.coroutines.launch


class MapFragment : BaseFragment(
    "H&A"
) {
    private val args: MapFragmentArgs by navArgs()
    private val viewModel: MapViewModel by activityViewModels()
    private val sharedViewModel: SharedViewModel by activityViewModels()
    private lateinit var binding : FragmentMapBinding
    private lateinit var map: ArcGISMap
    private lateinit var mapView: MapView
    private lateinit var popupWindow: PopupWindow

    private lateinit var markerAdapter: MarkerPointAdapter

    //ID PORTAL MAP ARCGIS
    private lateinit var ID_PORTAL_MAP_HYA: String

    private lateinit var dialog: Dialog

    private var showDetail: Boolean = false
    private var showSearch: Boolean = false
    private var showDataPending: Boolean = false

    private var showMarkersMap: Boolean = true

    private val graphicsOverlay: GraphicsOverlay by lazy { GraphicsOverlay() }
    private val downloadArea: Graphic by lazy { Graphic() }
    private val movableGraphic: Graphic by lazy { Graphic() }

    private val tempDirectoryPath: String by lazy {
        "${context?.cacheDir}/${Calendar.getInstance().time}"
    }

    private lateinit var locationDisplay: LocationDisplay

    @RequiresApi(Build.VERSION_CODES.O)
    @SuppressLint("ClickableViewAccessibility")
    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding =  FragmentMapBinding.inflate(inflater, container, false)

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

    @RequiresApi(Build.VERSION_CODES.O)
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        if(!args.idPortalMap.equals("")) viewModel.mapIdPortal = args.idPortalMap
        ID_PORTAL_MAP_HYA = viewModel.mapIdPortal

        loadMarkers()
        loadMap()
        setBackButton(requireActivity() as MenuHost)

        binding.btnOpciones.setOnClickListener {
            val inflater = LayoutInflater.from(context)

            if (!::popupWindow.isInitialized || !popupWindow.isShowing) {
                val rootLayoutMoreOptions = inflater.inflate(R.layout.fragment_map_more_options, null) as View

                updateButtonState(isOpen = true)
                showPopup(rootLayoutMoreOptions)

                popupWindow.setOnDismissListener {
                    updateButtonState(isOpen = false)
                }

            } else {
                closePopup()
            }
        }

    }

    private fun loadMarkers() {
        viewModel.getMarkersPointMap().observe(viewLifecycleOwner) {
            Toast.makeText(requireContext(),resources.getString(R.string.search_markers_point_map),Toast.LENGTH_LONG).show()

            if (it.data?.isEmpty() == true) {
                dialog.message_markers.visibility = View.VISIBLE
                dialog.message_markers.text = resources.getString(R.string.not_markers_point_results)
                markerAdapter.submitList(listOf())
            } else {
                markerAdapter.submitList(it.data)
            }
        }
    }

    private fun updateButtonState(isOpen: Boolean) {
        if (isOpen) {
            binding.btnOpciones.setIconResource(R.drawable.ic_close)
            binding.btnOpciones.setIconTintResource(com.progracol.core.R.color.purple_500)
            binding.btnOpciones.backgroundTintList = ContextCompat.getColorStateList(
                requireContext(),
                com.progracol.core.R.color.white
            )
        } else {
            binding.btnOpciones.setIconResource(R.drawable.ic_more_options)
            binding.btnOpciones.setIconTintResource(com.progracol.core.R.color.white)
            binding.btnOpciones.backgroundTintList = ContextCompat.getColorStateList(
                requireContext(),
                com.progracol.core.R.color.purple_500
            )
        }
    }

    @RequiresApi(Build.VERSION_CODES.O)
    private fun showPopup(anchorView: View) {
        val inflater = LayoutInflater.from(requireContext())
        val popupView = inflater.inflate(R.layout.fragment_map_more_options, null)

        popupWindow = PopupWindow(
            popupView,
            ViewGroup.LayoutParams.WRAP_CONTENT,
            ViewGroup.LayoutParams.WRAP_CONTENT,
            true
        )

        popupWindow.setBackgroundDrawable(ColorDrawable(Color.TRANSPARENT))
        popupWindow.isOutsideTouchable = true

        // Medir el popup para conocer su altura
        popupView.measure(View.MeasureSpec.UNSPECIFIED, View.MeasureSpec.UNSPECIFIED)
        val popupHeight = popupView.measuredHeight
        val popupWidth = popupView.measuredWidth

        // Obtener posición del botón en la ventana
        val location = IntArray(2)
        binding.btnOpciones.getLocationInWindow(location)
        val anchorX = location[0]
        val anchorY = location[1]

        // Calcular la posición (encima del botón, centrado horizontalmente)
        val offsetX = binding.btnOpciones.width / 2 - popupWidth / 2
        val xPos = anchorX + offsetX
        val yPos = anchorY - popupHeight // 20 px de separación arriba del botón

        // Mostrar el popup en la ubicación exacta
        popupWindow.showAtLocation(binding.btnOpciones, Gravity.NO_GRAVITY, xPos, yPos)

        // Animación al abrir
        val enterAnim = AnimationUtils.loadAnimation(requireContext(), R.anim.popup_enter)
        popupView.startAnimation(enterAnim)

        popupView.findViewById<Button>(R.id.btnSaveMap).setOnClickListener {
            closePopup()
            generateOfflineMap(it)
        }

        popupView.findViewById<Button>(R.id.btnMyLocation).setOnClickListener {
            closePopup()
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

        popupView.findViewById<Button>(R.id.btnAddNewPoint).setOnClickListener {
            if(MapRepository.markerCoordinates == null){
                Toast.makeText(
                    requireContext(),
                    resources.getString(R.string.advertencia_coordenadas),
                    Toast.LENGTH_LONG
                ).show()
            } else {
                val intent = Intent(this.requireContext(), FormActivity::class.java)
                intent.putExtra("posFragments", "3")
                closePopup()
                startActivity(intent)
            }
        }

    }

    private fun closePopup() {
        val exitAnim = AnimationUtils.loadAnimation(requireContext(), R.anim.popup_exit)
        popupWindow.contentView.startAnimation(exitAnim)
        Handler(Looper.getMainLooper()).postDelayed({
            popupWindow.dismiss()
        }, 150)
    }

    /**
     * getter function to retrieve the first available feature layer
     * [featureLayer] updates with every map click
     */
    private val featureLayer: FeatureLayer?
        get() {
            return map.operationalLayers?.filterIsInstance<FeatureLayer>()?.first {
                Log.i("ARGIS-id",it.id)
                Log.i("ARGIS-name", it.name)
                Log.i("ARGIS-description", it.description)
                Log.i("ARGIS-geometryType", it.featureTable?.geometryType.toString())
                Log.i("ARGIS-isVisible", it.isVisible.toString())
                Log.i("ARGIS-isPopupEnabled", it.isPopupEnabled.toString())
                Log.i("ARGIS-popupDefinition", it.popupDefinition.toString())
                (it.featureTable?.geometryType == GeometryType.POINT)
                    .and(it.isVisible)
                    .and(it.isPopupEnabled && it.popupDefinition != null)
            }
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

    private fun loadMap() {
        lifecycleScope.launch {
            viewModel.initMap()
            setUpMap()
        }
    }

    private fun setUpMap() {
        ArcGISRuntimeEnvironment.setApiKey(viewModel.tokenArcgis)
        val portal = Portal("https://www.arcgis.com",false)
        val portalItem = PortalItem(portal, ID_PORTAL_MAP_HYA)
        map = ArcGISMap(portalItem)
        mapView = binding.map
        mapView.map = map

        locationDisplay = mapView.locationDisplay

        mapView.onTouchListener =
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
            addViewpointChangedListener{
                if (map.loadStatus == LoadStatus.LOADED) {
                    val minScreenPoint = Point(200, 200)
                    // lower right corner of the downloaded area
                    val maxScreenPoint = Point(
                        mapView.width - 200,
                        mapView.height - 200
                    )

                    val minPoint = mapView.screenToLocation(minScreenPoint)
                    val maxPoint = mapView.screenToLocation(maxScreenPoint)

                    if (minPoint != null && maxPoint != null) {
                        val envelope = Envelope(minPoint, maxPoint)
                        downloadArea.symbol = SimpleLineSymbol(SimpleLineSymbol.Style.SOLID, Color.BLUE, 2F)
                        downloadArea.geometry = envelope
                    }
                }
            }

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
                addGraphicOverlay(downloadArea)
                sharedViewModel.selectedCoordinates.observe(viewLifecycleOwner) { point ->
                    Log.e("MapSearch", "Función ejecutada desde el MapSearchFragment, datos - Lon: " + point.x + " Lat: " + point.y )
                    locatePoint(point)
                }
                mapView.graphicsOverlays.add(graphicsOverlay)

            } catch (exception: Exception) {
                Log.e(MapFragment::class.simpleName, exception.stackTraceToString())
            }
        }
    }

    private fun addGraphicOverlay(grafica: Graphic) {
        try {
            if (!graphicsOverlay.graphics.contains(grafica)){
                graphicsOverlay.graphics.add(grafica)
            }else {
                Log.e("com.esri.arcgisruntime.ArcGISRuntimeException", "La grafica ya sido añadida")
            }
        }catch (exception: Exception) {
            Log.e(MapFragment::class.simpleName, exception.stackTraceToString())
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

                movableGraphic.symbol = symbol
                movableGraphic.geometry = point
                addGraphicOverlay(movableGraphic)

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

    fun locatePoint(point: com.esri.arcgisruntime.geometry.Point) {
        // Crear un símbolo para resaltar el punto
        val markerSymbol = SimpleMarkerSymbol(SimpleMarkerSymbol.Style.SQUARE, Color.RED, 20f)
        val graphic = Graphic(point, markerSymbol)

        // Agregar el punto a la capa de gráficos
        addGraphicOverlay(graphic)

        // Centrar el mapa en el punto con zoom
        mapView.setViewpointCenterAsync(point, 10000.0) // Ajusta el zoom según necesidad
    }

    @RequiresApi(Build.VERSION_CODES.O)
    private fun generateOfflineMap(view: View) {
        File(tempDirectoryPath).deleteRecursively()

        var minScale: Double = mapView.mapScale
        var maxScale: Double = mapView.map.maxScale

        if (minScale <= maxScale) {
            minScale = maxScale + 1
        }

        val generateOfflineMapParameters = GenerateOfflineMapParameters(
            downloadArea.geometry, minScale, maxScale
        ).apply {
            isContinueOnErrors = true
        }

        val offlineMapTask = OfflineMapTask(mapView.map)

        val offlineMapJob =
            offlineMapTask.generateOfflineMap(generateOfflineMapParameters, tempDirectoryPath)

        val progressDialogLayoutBinding = FragmentMapOfflineDialogBinding.inflate(layoutInflater)
        val progressDialog = createProgressDialog(offlineMapJob)
        progressDialog.setView(progressDialogLayoutBinding.root)
        progressDialog.show()

        offlineMapJob.apply {

            addProgressChangedListener{
                progressDialogLayoutBinding.progressBar.progress = progress
                progressDialogLayoutBinding.progressText.text = "${progress}%"
            }

            addJobDoneListener {
                if (status ==  Job.Status.SUCCEEDED) {
                    progressDialog.setCancelable(false)
                    viewModel.path = downloadDirectoryPath
                    val result = result
                    mapView.map = result.offlineMap
                    graphicsOverlay.graphics.clear()

                    progressDialogLayoutBinding.mapNameLayout.visibility = View.VISIBLE
                    progressDialogLayoutBinding.saveButton.visibility = View.VISIBLE
                    progressDialogLayoutBinding.saveButton.setOnClickListener {
                        viewModel.mapName = progressDialogLayoutBinding.mapName.text.toString()
                        val newUserMap = UserMap(
                            name = viewModel.mapName,
                            path = viewModel.path,
                            date = LocalDate.now().toString()
                        )
                        Log.e("prueba mapa", newUserMap.toString())
                        viewModel.saveUserMap(newUserMap).observe(viewLifecycleOwner) {
                            when (it.status) {
                                Resource.Status.LOADING -> {}
                                Resource.Status.SUCCESS -> {
                                    progressDialog.dismiss()
                                    messageDialog.showMessage(resources.getString(R.string.map_offline))
                                    findNavController().popBackStack()

                                }
                                Resource.Status.ERROR -> messageDialog.showErrorMessage(resources.getString(R.string.error_map_offline))
                            }
                        }
                    }


                } else {
                    val error =
                        "Error in generate offline map job: " + offlineMapJob.error.message
                    Toast.makeText(requireContext(), error, Toast.LENGTH_LONG).show()
                    Log.e("Error de map test", error)

                }
            }
            start()
        }
    }

    private fun createProgressDialog(job: GenerateOfflineMapJob): AlertDialog {
        val builder = AlertDialog.Builder(requireContext()).apply {
            setTitle("Generando Mapa")
            // provide a cancel button on the dialog

            setNegativeButton("Cancelar") { _, _ ->
                job.cancelAsync()
            }
            setCancelable(false)
            //val dialogLayoutBinding = GenerateOffline.inflate(layoutInflater)
            //setView(dialogLayoutBinding.root)
        }
        return builder.create()
    }


    private fun identifyLayer(screenPoint: Point, cordinates: String) {
        val featureLayer = featureLayer

        if(featureLayer != null) {
            // clear the selected features from the feature layer
            resetIdentifyResult()
            Log.e("ARCGIS-IDENTIFY",featureLayer.toString())

            val identifyLayerResultsFuture = mapView.identifyLayerAsync(featureLayer, screenPoint, 12.0,false)

            identifyLayerResultsFuture.addDoneListener {
                try {
                    val identifyLayerResult = identifyLayerResultsFuture.get()
                    Log.e("ARCGIS-IDENTIFY-DONE",identifyLayerResultsFuture.get().popups.size.toString())
                    Log.e("ARCGIS-IDENTIFY-DONE",identifyLayerResultsFuture.get().popups.toString())
                    if (identifyLayerResult.popups.isNotEmpty()) {
                        val featureLayer: FeatureLayer? = identifyLayerResult.layerContent as? FeatureLayer

                        featureLayer?.selectFeature(identifyLayerResult.popups.first().geoElement as Feature)

                        val popupManager = PopupManager(context, identifyLayerResult.popups.first())
                        val fields: List<PopupField> = popupManager.displayedFields
                        var subscriptionId: String = ""
                        var fieldHashs:HashMap<String, String> = HashMap<String, String>()
                        for (field in fields) {
                            fieldHashs.put(field.label,popupManager.getFormattedValue(field).toString())

                            if(field.label == "COD_BIOAGRICOLA") subscriptionId = popupManager.getFormattedValue(field).toString()
                            Log.e("***FIELD***", field.label)
                        }
                        fieldHashs.put("latitude", getLatitude(cordinates))
                        fieldHashs.put("longitude", getLongitude(cordinates))
                        val gson = Gson()
                        val dataJson = gson.toJson(fieldHashs).toString()

                        if(!showDetail) {
                            showDetail = true
                            val mapDetailFragment = MapDetailFragment(gson.fromJson(dataJson, MapDetail::class.java),closeDialog = {showDetail = false})
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

    private fun resetIdentifyResult() {
        featureLayer?.clearSelection()
    }

    override fun onPause() {
        super.onPause()
    }

    override fun onResume() {
        super.onResume()
    }

    override fun onDestroy() {
        super.onDestroy()
        MapRepository.markerCoordinates = null
    }

    override fun setBackButton(menuHost: MenuHost) {
        super.setBackButton(menuHost)
        menuHost.addMenuProvider(object : MenuProvider {
            override fun onCreateMenu(menu: Menu, menuInflater: MenuInflater) {
                menuInflater.inflate(R.menu.nav_menu_map, menu)
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
                    R.id.searcher -> showSearcher()
                    R.id.layersmap -> showLayers()
                }
                return true
            }
        }, viewLifecycleOwner, Lifecycle.State.RESUMED)
    }

    private fun showLayers() {
        val builder = AlertDialog.Builder(context)
        builder.setCancelable(true)

        // Inflar el layout que contendrá los checkboxes
        val inflater = LayoutInflater.from(context)
        val view = inflater.inflate(R.layout.map_dialog_layers_maps, null) as View

        val linearLayout: LinearLayout = view.findViewById(R.id.capas_layout)

        // Establecer la vista inflada en el AlertDialog
        builder.setView(view)

        // Iterar sobre layersMap para crear los checkboxes dinámicamente
        viewModel.layersMap.forEachIndexed { index, layer ->

            // Crear dinámicamente el MaterialCheckBox
            val checkBoxLayer = MaterialCheckBox(requireContext()).apply {
                id = View.generateViewId() // Generar un ID único para cada checkbox
                text = layer.name
            }

            checkBoxLayer.layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.WRAP_CONTENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            )

            // Añadir el checkbox al ConstraintLayout
            linearLayout.addView(checkBoxLayer)

            checkBoxLayer.isChecked = layer.checked

            // Escuchar el cambio de estado del checkbox
            checkBoxLayer.setOnCheckedChangeListener { checkBox, isChecked ->
                if (isChecked) {
                    // Añadir capa si se marca
                    var itemSearchLayer = viewModel.layersMap.find { it.name == checkBox.text.toString() }
                    if (itemSearchLayer != null) {
                        itemSearchLayer.checked = true
                    }

                    map.operationalLayers.add(layer.feature)
                } else {
                    // Eliminar capa si se desmarca
                    var itemSearchLayer = viewModel.layersMap.find { it.name == checkBox.text.toString() }
                    if (itemSearchLayer != null) {
                        itemSearchLayer.checked = false
                    }
                    map.operationalLayers.remove(layer.feature)
                }
            }
        }

        dialog = builder.create().apply {
            val background = ContextCompat.getDrawable(context, com.progracol.core.R.drawable.background_dialog_v2)
            window?.setBackgroundDrawable(background)
        }
        dialog.show()
        val size = screenRectPx.width()
        dialog.window!!.setLayout((size*0.9F).toInt(), ViewGroup.LayoutParams.WRAP_CONTENT)

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

    private fun showListPending() {
        val mapDataPendingFragment = MapDataPendingFragment(closeDialog = {showDataPending = false})
        mapDataPendingFragment.show(
            parentFragmentManager,
            MapFragment::class.simpleName
        )
    }

    fun showSearcher() {
        if(!showSearch) {
            showSearch = true
            val mapSearchFragment = MapSearchFragment(closeDialog = {showSearch = false})
            mapSearchFragment.show(
                parentFragmentManager,
                MapFragment::class.simpleName
            )
        }
    }

    fun showSync() {
        val syncFragment = SyncFragment()
        syncFragment.show(parentFragmentManager, MapFragment::class.simpleName)
    }

}