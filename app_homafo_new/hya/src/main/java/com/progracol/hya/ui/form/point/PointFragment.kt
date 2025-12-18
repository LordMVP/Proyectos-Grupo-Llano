package com.progracol.hya.ui.form.point

import android.annotation.SuppressLint
import android.graphics.Color
import android.graphics.Paint
import android.graphics.drawable.ShapeDrawable
import android.graphics.drawable.shapes.OvalShape
import android.os.Build
import android.os.Bundle
import android.text.SpannableString
import android.text.style.ImageSpan
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.*
import androidx.annotation.RequiresApi
import androidx.core.text.HtmlCompat
import androidx.core.view.children
import androidx.fragment.app.activityViewModels
import androidx.lifecycle.lifecycleScope
import com.progracol.core.common.MediaStorageType
import com.progracol.core.common.UploadStatus
import com.progracol.core.database.entities.Independence
import com.progracol.core.database.entities.ParamCommercialActivity
import com.progracol.core.database.entities.ParamFacturacion
import com.progracol.core.database.entities.ParamNeighborhood
import com.progracol.core.database.entities.Point
import com.progracol.core.network.Resource
import com.progracol.core.ui.BaseFragment
import com.progracol.core.ui.BasicAdapter
import com.progracol.hya.R
import com.progracol.hya.databinding.FragmentCrearPuntoBinding
import com.progracol.hya.ui.base.adapter.CommercialActivityAdapter
import com.progracol.hya.ui.base.adapter.NeighborhoodAdapter
import com.progracol.hya.ui.form.FormActivity
import com.progracol.hya.ui.form.FormViewModel
import com.progracol.hya.ui.form.detail.DetailFragment
import com.progracol.hya.ui.map.MapRepository
import kotlinx.coroutines.launch
import java.time.LocalDate

class PointFragment : BaseFragment() {

    private val viewModel: FormViewModel by activityViewModels()
    private lateinit var binding: FragmentCrearPuntoBinding

    private lateinit var stratumAdapter : BasicAdapter
    private lateinit var useTypeAdapter : BasicAdapter
    private lateinit var settlementAdapter : BasicAdapter
    private lateinit var facturacionAdapter : BasicAdapter
    private lateinit var serviceAdapter: ArrayAdapter<String>
    private lateinit var coordenadasAdapter: ArrayAdapter<String>
    private lateinit var zoneAdapter: ArrayAdapter<String>
    private lateinit var tipoDocAdapter: ArrayAdapter<String>
    private lateinit var neighborhoodAdapter: NeighborhoodAdapter
    private lateinit var commercialActivityAdapter : CommercialActivityAdapter

    var pointId: Long? = null
    var pointIdAux: Long? = null

    @RequiresApi(Build.VERSION_CODES.O)
    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding = FragmentCrearPuntoBinding.inflate(inflater, container, false)

        crearCamposObligatorios()

        stratumAdapter = BasicAdapter(requireContext(), com.progracol.core.R.layout.list_popup_window_item, listOf())
        useTypeAdapter = BasicAdapter(requireContext(), com.progracol.core.R.layout.list_popup_window_item, listOf())
        settlementAdapter = BasicAdapter(requireContext(), com.progracol.core.R.layout.list_popup_window_item, listOf())
        facturacionAdapter = BasicAdapter(requireContext(), com.progracol.core.R.layout.list_popup_window_item, listOf())
        serviceAdapter = ArrayAdapter(requireContext(), com.progracol.core.R.layout.list_popup_window_item, listOf("SI","NO"))
        coordenadasAdapter = ArrayAdapter(requireContext(), com.progracol.core.R.layout.list_popup_window_item, listOf("SI","NO"))
        zoneAdapter = ArrayAdapter(requireContext(), com.progracol.core.R.layout.list_popup_window_item, listOf("U","R"))
        tipoDocAdapter = ArrayAdapter(requireContext(), com.progracol.core.R.layout.list_popup_window_item, listOf("CC","NIT"))
        neighborhoodAdapter = NeighborhoodAdapter(requireActivity(), android.R.layout.simple_dropdown_item_1line, mutableListOf())
        commercialActivityAdapter = CommercialActivityAdapter(requireActivity(), android.R.layout.simple_dropdown_item_1line, mutableListOf())

        setSpinner((binding.estratoLayout.editText as AutoCompleteTextView), stratumAdapter)
        setSpinner((binding.tipoUsoLayout.editText as AutoCompleteTextView), useTypeAdapter)
        setSpinner((binding.tipoLiquidacionLayout.editText as AutoCompleteTextView), settlementAdapter)
        setSpinner((binding.tipoFacturacionLayout.editText as AutoCompleteTextView), facturacionAdapter)

        binding.servicioEmsa.setAdapter(serviceAdapter)
        binding.servicioGas.setAdapter(serviceAdapter)
        binding.zona.setAdapter(zoneAdapter)
        binding.tipoDocumento.setAdapter(tipoDocAdapter)

        binding.coordenadasSeleccionadas.setAdapter(coordenadasAdapter)
        binding.coordenadasSeleccionadas.setOnItemClickListener { _, _, position, _ ->
            val valor = coordenadasAdapter.getItem(position) as String?
            if (valor.equals("SI")) {
                if(MapRepository.markerCoordinates != null){
                    binding.longitude.setText(MapRepository.markerCoordinates?.x.toString())
                    binding.latitude.setText(MapRepository.markerCoordinates?.y.toString())
                } else {
                    messageDialog.showWarningMessage(resources.getString(R.string.advertencia_coordenadas))
                    binding.coordenadasSeleccionadas.setText("NO", false)
                    if (viewModel.tipoPoint == 1) {
                        binding.longitude.setText(viewModel.point.value?.longitude)
                        binding.latitude.setText(viewModel.point.value?.latitude)
                    }
                }
            }
        }

        binding.tipoFacturacion.setAdapter(facturacionAdapter)
        binding.tipoFacturacion.setOnItemClickListener { _, _, position, _ ->
            val facturacion = facturacionAdapter.getItem(position) as ParamFacturacion?
            facturacionAdapter.selectedItem = facturacionAdapter.getItem(position)
            addColoredCircle(binding.tipoFacturacion, facturacion?.color.toString(), facturacion?.name.toString())
        }

        binding.barrio.setAdapter(neighborhoodAdapter)
        binding.barrio.setOnItemClickListener { _, _, position, _ ->
            val neighborhood = neighborhoodAdapter.getItem(position) as ParamNeighborhood?
            neighborhoodAdapter.neighborhoodSelected = neighborhoodAdapter.getItem(position)
            binding.barrio.setText(neighborhood?.name)
        }

        binding.actividadComercial.setAdapter(commercialActivityAdapter)
        binding.actividadComercial.setOnItemClickListener { _, _, position, _ ->
            val commercialActivity = commercialActivityAdapter.getItem(position) as ParamCommercialActivity?
            commercialActivityAdapter.commercialActivitySelected = commercialActivityAdapter.getItem(position)
            binding.actividadComercial.setText(commercialActivity?.name)
        }

        binding.servicioEmsa.setOnItemClickListener { _, _, position, _ ->
            val item = serviceAdapter.getItem(position) ?: return@setOnItemClickListener

            if (item == "SI") {
                binding.medidorAlternoEmsaLayout.isEnabled = true
                binding.medidorAlternoEmsaLayout.visibility = View.VISIBLE
                binding.codigoAlternoEmsaLayout.isEnabled = true
                binding.codigoAlternoEmsaLayout.visibility = View.VISIBLE
            } else {
                binding.medidorAlternoEmsaLayout.isEnabled = false
                binding.medidorAlternoEmsaLayout.visibility = View.GONE
                binding.codigoAlternoEmsaLayout.isEnabled = false
                binding.codigoAlternoEmsaLayout.visibility = View.GONE
            }
        }

        binding.servicioGas.setOnItemClickListener { _, _, position, _ ->
            val item = serviceAdapter.getItem(position) ?: return@setOnItemClickListener

            if(item == "SI"){
                binding.medidorAlternoGasLayout.isEnabled = true
                binding.medidorAlternoGasLayout.visibility = View.VISIBLE
                binding.codigoAlternoGasLayout.isEnabled = true
                binding.codigoAlternoGasLayout.visibility = View.VISIBLE
            }else{
                binding.medidorAlternoGasLayout.isEnabled = false
                binding.medidorAlternoGasLayout.visibility = View.GONE
                binding.codigoAlternoGasLayout.isEnabled = false
                binding.codigoAlternoGasLayout.visibility = View.GONE
            }
        }

        loadFormData()
        loadPropertyConditionCheck()

        binding.saveButton.setOnClickListener { save() }
        binding.addPhoto.setOnClickListener { addPhoto() }

        return binding.root
    }

    @RequiresApi(Build.VERSION_CODES.O)
    private fun loadFormData() {
        lifecycleScope.launch {
            try {
                viewModel.getPointById()
                loadFormSelectors {
                    addObservers()
                }
            } catch (e: Exception) {
                Log.e("ERROR", e.message.toString())
                loadFormSelectors {
                    pointId = null
                    pointIdAux = (10000..99999).random().toLong()
                    binding.fechaEncuesta.setText(LocalDate.now().toString())
                    binding.usuarioColaborador.setText("0000")

                    val facturacionTemp = facturacionAdapter.data.find { item -> item.name.equals("BIOAGRICOLA") }
                    if (facturacionTemp != null) { loadSelectedFacturacion(facturacionTemp.name.toString()) }

                    binding.servicioEmsa.setText("NO", false)
                    binding.servicioGas.setText("NO", false)

                    if(MapRepository.markerCoordinates == null){
                        Log.e("SharedViewModel", "No Recibí el punto")
                        messageDialog.showWarningMessage(resources.getString(R.string.advertencia_coordenadas))
                    } else {
                        Log.e("SharedViewModel", "Recibí el punto")
                        binding.longitude.setText(MapRepository.markerCoordinates?.x.toString())
                        binding.latitude.setText(MapRepository.markerCoordinates?.y.toString())
                    }
                }
            }
        }
    }

    private fun addObservers() {
        viewModel.point.observe(viewLifecycleOwner) {
            pointId = it.id
            pointIdAux = it.id
            binding.fechaEncuesta.setText(it.fechaEncuesta)
            binding.usuarioColaborador.setText(it.colaborador)

            binding.nombre.setText(it.name)
            binding.tipoDocumento.setText(it.typeDocument, false)
            binding.numeroDocumento.setText(it.document)
            binding.telefono.setText(it.phone)
            binding.correoElectronico.setText(it.email)
            binding.direccion.setText(it.address)
            binding.zona.setText(it.zone,false)
            binding.nombreEstablecimiento.setText(it.propertyName)
            binding.catastral.setText(it.catastralCode)
            binding.catastralNacional.setText(it.catastralCodeNacional)
            binding.servicioEmsa.setText(it.serviceEmsa, false)
            if (it.serviceEmsa == "SI") {
                binding.medidorAlternoEmsaLayout.isEnabled = true
                binding.medidorAlternoEmsaLayout.visibility = View.VISIBLE
                binding.codigoAlternoEmsaLayout.isEnabled = true
                binding.codigoAlternoEmsaLayout.visibility = View.VISIBLE
            } else {
                binding.medidorAlternoEmsaLayout.isEnabled = false
                binding.medidorAlternoEmsaLayout.visibility = View.GONE
                binding.codigoAlternoEmsaLayout.isEnabled = false
                binding.codigoAlternoEmsaLayout.visibility = View.GONE
            }
            binding.codigoAlternoEmsa.setText(it.alternateCodeEmsa)
            binding.medidorAlternoEmsa.setText(it.alternateMeterEmsa)

            binding.servicioGas.setText(it.serviceGas, false)
            if(it.serviceGas == "SI"){
                binding.medidorAlternoGasLayout.isEnabled = true
                binding.medidorAlternoGasLayout.visibility = View.VISIBLE
                binding.codigoAlternoGasLayout.isEnabled = true
                binding.codigoAlternoGasLayout.visibility = View.VISIBLE
            }else{
                binding.medidorAlternoGasLayout.isEnabled = false
                binding.medidorAlternoGasLayout.visibility = View.GONE
                binding.codigoAlternoGasLayout.isEnabled = false
                binding.codigoAlternoGasLayout.visibility = View.GONE
            }
            binding.codigoAlternoGas.setText(it.alternateCodeGas)
            binding.medidorAlternoGas.setText(it.alternateMeterGas)

            binding.radioButtonDeshabitado.isChecked = it.deshabitado != null
            binding.radioButtonDescuentoPAP.isChecked = it.descuento_pap != null
            binding.observacion.setText(it.observacion)
            binding.longitude.setText(it.longitude)
            binding.latitude.setText(it.latitude)
        }
    }

    private fun loadFormSelectors(onLoaded: () -> Unit) {
        var loadsCompleted = 0
        val totalLoads = 7  // Cambia esto si agregas más .observe()

        fun checkIfAllLoaded() {
            loadsCompleted++
            if (loadsCompleted == totalLoads) {
                onLoaded()
            }
        }

        viewModel.getNeighborhoods().observe(viewLifecycleOwner) {
            neighborhoodAdapter.updateData(it)
            val neighborhood = it.firstOrNull { item -> item.code == viewModel.point.value?.neighborhood }
            if (neighborhood != null) {
                neighborhoodAdapter.neighborhoodSelected = neighborhood
                binding.barrio.setText(neighborhood.name)
            }
            checkIfAllLoaded()
        }

        viewModel.getStratums().observe(viewLifecycleOwner) {
            setDataSpinner(stratumAdapter, it.sortedBy { ac -> ac.name }, viewModel.point.value?.stratum ?: "", (binding.estratoLayout.editText as AutoCompleteTextView))
            checkIfAllLoaded()
        }

        viewModel.getUseType().observe(viewLifecycleOwner) {
            setDataSpinner(useTypeAdapter, it.sortedBy { ac -> ac.name }, viewModel.point.value?.useType ?: "", (binding.tipoUsoLayout.editText as AutoCompleteTextView))
            checkIfAllLoaded()
        }

        viewModel.getLandCondition().observe(viewLifecycleOwner) {
            setDataSpinner(settlementAdapter, it.sortedBy { ac -> ac.name }, viewModel.point.value?.settlement ?: "", (binding.tipoLiquidacionLayout.editText as AutoCompleteTextView))
            checkIfAllLoaded()
        }

        viewModel.getCommercialActivities().observe(viewLifecycleOwner) {
            commercialActivityAdapter.updateData(it)
            val commercialActivity = it.firstOrNull { item -> item.code == viewModel.point.value?.commercialActivity }
            if (commercialActivity != null) {
                commercialActivityAdapter.commercialActivitySelected = commercialActivity
                binding.actividadComercial.setText(commercialActivity.name)
            }
            checkIfAllLoaded()
        }

        viewModel.getTiposFacturacion().observe(viewLifecycleOwner) {
            setDataSpinner(facturacionAdapter, it.sortedBy { ac -> ac.name }, viewModel.point.value?.facturacion ?: "", (binding.tipoFacturacionLayout.editText as AutoCompleteTextView))
            loadSelectedFacturacion(null)
            checkIfAllLoaded()
        }

        viewModel.getMarcaciones().observe(viewLifecycleOwner) {
            it.forEach { paramMarcacion ->
                when (paramMarcacion.orden) {
                    1 -> {
                        binding.radioButtonDeshabitado.tag = paramMarcacion.code
                        binding.radioButtonDeshabitado.text = paramMarcacion.name
                        binding.radioButtonDeshabitado.contentDescription = paramMarcacion.orden.toString()
                    }
                    3 -> {
                        binding.radioButtonDescuentoPAP.tag = paramMarcacion.code
                        binding.radioButtonDescuentoPAP.text = paramMarcacion.name
                        binding.radioButtonDescuentoPAP.contentDescription = paramMarcacion.orden.toString()
                    }
                }
            }
            checkIfAllLoaded()
        }

        binding.coordenadasSeleccionadas.setText("NO", false)
    }

    private fun loadPropertyConditionCheck() {
        viewModel.getPropertyConditions().observe(viewLifecycleOwner) {
            //setDataSpinner(propertyConditionAdapter, it, viewModel.subscriptionDetail.value?.propertyCondition ?: "", (binding.propertyCondition.editText as AutoCompleteTextView))
            it.forEach{ propertyCondition ->

                val checkBox = CheckBox(requireContext())
                checkBox.layoutParams = LinearLayout.LayoutParams(
                    ViewGroup.LayoutParams.MATCH_PARENT,
                    ViewGroup.LayoutParams.WRAP_CONTENT
                )
                checkBox.text = propertyCondition.name
                checkBox.id = propertyCondition.code.toInt()
                binding.propertyCondition.addView(checkBox)
            }
        }
    }

    private fun crearCamposObligatorios() {
        binding.fechaEncuestaLayout.hint = HtmlCompat.fromHtml("${resources.getString(R.string.fecha_encuesta)} <font color='#FF0000'>(*)</font>", HtmlCompat.FROM_HTML_MODE_LEGACY)
        binding.usuarioColaboradorLayout.hint = HtmlCompat.fromHtml("${resources.getString(R.string.colaborador)} <font color='#FF0000'>(*)</font>", HtmlCompat.FROM_HTML_MODE_LEGACY)
        binding.tipoFacturacionLayout.hint = HtmlCompat.fromHtml("${resources.getString(R.string.facturacion)} <font color='#FF0000'>(*)</font>", HtmlCompat.FROM_HTML_MODE_LEGACY)
        binding.direccionLayout.hint = HtmlCompat.fromHtml("${resources.getString(R.string.address)} <font color='#FF0000'>(*)</font>", HtmlCompat.FROM_HTML_MODE_LEGACY)
        binding.zonaLayout.hint = HtmlCompat.fromHtml("${resources.getString(R.string.zone)} <font color='#FF0000'>(*)</font>", HtmlCompat.FROM_HTML_MODE_LEGACY)
        binding.barrioLayout.hint = HtmlCompat.fromHtml("${resources.getString(R.string.neighborhood)} <font color='#FF0000'>(*)</font>", HtmlCompat.FROM_HTML_MODE_LEGACY)
        binding.estratoLayout.hint = HtmlCompat.fromHtml("${resources.getString(R.string.estrato)} <font color='#FF0000'>(*)</font>", HtmlCompat.FROM_HTML_MODE_LEGACY)
        binding.tipoUsoLayout.hint = HtmlCompat.fromHtml("${resources.getString(R.string.use_type)} <font color='#FF0000'>(*)</font>", HtmlCompat.FROM_HTML_MODE_LEGACY)
        binding.tipoLiquidacionLayout.hint = HtmlCompat.fromHtml("${resources.getString(R.string.settlement)} <font color='#FF0000'>(*)</font>", HtmlCompat.FROM_HTML_MODE_LEGACY)
        binding.longitudeLayout.hint = HtmlCompat.fromHtml("${resources.getString(R.string.longitude)} <font color='#FF0000'>(*)</font>", HtmlCompat.FROM_HTML_MODE_LEGACY)
        binding.latitudeLayout.hint = HtmlCompat.fromHtml("${resources.getString(R.string.latitude)} <font color='#FF0000'>(*)</font>", HtmlCompat.FROM_HTML_MODE_LEGACY)
    }

    private fun validate_form() {

        if (viewModel.isPointEmptyGallery(pointIdAux!!,mediaStorageType = MediaStorageType.HYA_POINT)) {
            throw Exception(resources.getString(R.string.error_add_photo))
        }

        if (binding.tipoFacturacion.text.toString() == "") {
            throw Exception(resources.getString(R.string.error_select_tipo_facturacion))
        }

        if (binding.direccion.text.toString() == "") {
            throw Exception(resources.getString(R.string.error_type_address))
        }

        if (binding.zona.text.toString() == "") {
            throw Exception(resources.getString(R.string.error_select_zone))
        }

        var barrio: ParamNeighborhood? = neighborhoodAdapter.neighborhoodSelected
        if (barrio == null) {
            throw Exception(resources.getString(R.string.error_select_neighborhood))
        }

        if (binding.estrato.text.toString() == "") {
            throw Exception(resources.getString(R.string.error_select_estrato))
        }

        if (binding.tipoUso.text.toString() == "") {
            throw Exception(resources.getString(R.string.error_select_use_type))
        }

        if (binding.tipoLiquidacion.text.toString() == "") {
            throw Exception(resources.getString(R.string.error_select_settlement))
        }

        var actividad: ParamCommercialActivity? = null
        val actividadText = binding.actividadComercial.text.toString()
        if (actividadText != "") {
            actividad = commercialActivityAdapter.commercialActivitySelected
            if (actividad == null) {
                throw Exception(resources.getString(R.string.error_select_activity_commercial))
            }
        }

        val longitude = binding.longitude.text.toString()
        val latitude = binding.latitude.text.toString()

        if ((longitude.equals("") || longitude == null) || (latitude.equals("") || latitude == null)) {
            throw Exception(resources.getString(R.string.advertencia_coordenadas))
        }
    }

    private fun save() {
        try {
            validate_form()

            var propertyConditionCheck = binding.propertyCondition.children.filter {
                (it as CheckBox).isChecked
            }.map { it.id }.joinToString(separator = ",")

            var uniDeshabitado: Int? = null
            var uniDescuento_pap: Int? = null

            for (checkConcepto in binding.groupRadioButton.children.filter { (it as CheckBox).isChecked }.iterator()) {
                Log.d("Concepto ", checkConcepto.tag.toString() + " - " + checkConcepto.contentDescription)
                when (checkConcepto.contentDescription) {
                    "1" -> uniDeshabitado = checkConcepto.tag.toString().toInt()
                    "3" ->  uniDescuento_pap = checkConcepto.tag.toString().toInt()
                }
            }

            val newPoint = Point(
                id = pointId,
                fechaEncuesta = binding.fechaEncuesta.text.toString(),
                colaborador = binding.usuarioColaborador.text.toString(),
                facturacion = facturacionAdapter.selectedItem?.name,
                name = binding.nombre.text.toString(),
                typeDocument = binding.tipoDocumento.text.toString(),
                document = binding.numeroDocumento.text.toString(),
                phone = binding.telefono.text.toString(),
                email = binding.correoElectronico.text.toString(),
                address = binding.direccion.text.toString(),
                zone = binding.zona.text.toString(),
                neighborhood = neighborhoodAdapter.neighborhoodSelected?.code ?: "1",
                propertyName = binding.nombreEstablecimiento.text.toString(),
                commercialActivity = commercialActivityAdapter.commercialActivitySelected?.code,
                //propertyCondition = propertyConditionCheck,
                stratum = stratumAdapter.selectedItem?.code,
                useType = useTypeAdapter.selectedItem?.code,
                settlement = settlementAdapter.selectedItem?.code,
                catastralCode = binding.catastral.text.toString(),
                catastralCodeNacional = binding.catastralNacional.text.toString(),
                serviceEmsa = binding.servicioEmsa.text.toString(),
                alternateMeterEmsa = binding.medidorAlternoEmsa.text.toString(),
                alternateCodeEmsa = binding.codigoAlternoEmsa.text.toString(),
                serviceGas = binding.servicioGas.text.toString(),
                alternateMeterGas = binding.medidorAlternoGas.text.toString(),
                alternateCodeGas = binding.codigoAlternoGas.text.toString(),
                deshabitado = uniDeshabitado,
                descuento_pap = uniDescuento_pap,
                observacion = binding.observacion.text.toString(),
                latitude = binding.latitude.text.toString(),
                longitude = binding.longitude.text.toString(),
                status = UploadStatus.PENDING.status,
            )
            viewModel.savePoint(newPoint, pointIdAux!!).observe(viewLifecycleOwner) {
                when (it.status) {
                    Resource.Status.LOADING -> {}
                    Resource.Status.SUCCESS -> {
                        pointId = it.data.toString().toLong()
                        pointIdAux = pointId
                        messageDialog.showMessage(resources.getString(R.string.success_saving_point))
                    }
                    Resource.Status.ERROR -> {
                        if(viewModel.mediaStorageType != MediaStorageType.HYA_POINT.ordinal) throw Exception(resources.getString(R.string.error_add_photo))
                        else throw Exception(resources.getString(R.string.error_saving_point))
                    }
                }
            }
        }catch (exception: Exception) {
            messageDialog.showWarningMessage(exception.message.toString())
        }
    }

    private fun addPhoto() {
        (requireActivity() as? FormActivity)?.showGallery(pointId = pointIdAux!!, mediaStorageType = MediaStorageType.HYA_POINT, tag = DetailFragment::class.simpleName!!)
    }

    private fun loadSelectedFacturacion(item: String?) {
        var opcionFind = item
        if(opcionFind == null) {
            opcionFind = "null"
        }
        viewModel.getSelectedFacturacion(viewModel.point.value?.facturacion ?: opcionFind).observe(viewLifecycleOwner) {
            it?.let {
                facturacionAdapter.selectedItem = it
                val autoCompleteTextView = (binding.tipoFacturacionLayout.editText as AutoCompleteTextView)
                addColoredCircle(autoCompleteTextView, it.color.toString(), it.name.toString())
            }
        }
    }

    private fun addColoredCircle(textView: AutoCompleteTextView, colorHex: String, text: String) {
        // Convertir color HEX a Int
        val colorInt = Color.parseColor(colorHex)

        // Crear un círculo del color especificado
        val size = textView.textSize.toInt() // Tamaño basado en el texto
        val drawable = ShapeDrawable(OvalShape()).apply {
            intrinsicWidth = size
            intrinsicHeight = size
            paint.color = colorInt
            paint.style = Paint.Style.FILL
        }

        // Convertir a ImageSpan
        drawable.setBounds(0, 0, size, size)
        val imageSpan = ImageSpan(drawable, ImageSpan.ALIGN_BASELINE)

        // Crear el texto con el icono
        val spannable = SpannableString("  $text") // Espacio para el icono
        spannable.setSpan(imageSpan, 0, 1, 0) // Poner círculo en la primera posición

        // Asignar al AutoCompleteTextView
        textView.setText(spannable)
    }
}