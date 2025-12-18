package com.progracol.hya.ui.form

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.Menu
import android.view.MenuInflater
import android.view.MenuItem
import androidx.activity.viewModels
import androidx.core.view.MenuHost
import androidx.core.view.MenuProvider
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import androidx.lifecycle.Lifecycle
import androidx.viewpager2.widget.ViewPager2
import com.google.android.material.tabs.TabLayout
import com.google.android.material.tabs.TabLayoutMediator
import com.progracol.core.common.MediaStorageType
import com.progracol.core.ui.gallery.GalleryFragment
import com.progracol.core.ui.gallery.GalleryViewModel
import com.progracol.hya.R
import com.progracol.hya.ui.base.adapter.ViewPagerAdapter
import com.progracol.hya.ui.form.detail.DetailFragment
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class FormActivity : AppCompatActivity() {

    private val viewModel: FormViewModel by viewModels()
    private val galleryViewModel: GalleryViewModel by viewModels()

    private lateinit var tabLayout : TabLayout
    private lateinit var viewPager : ViewPager2

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_form)

        val isOffline = intent.getBooleanExtra("isOffline", false)
        viewModel.isOffline = isOffline

        viewModel.defaultPointId = intent.getLongExtra("pointId",0)
        viewModel.defaultFechaEncuesta = intent.getStringExtra("fechaEncuesta") ?: ""
        viewModel.defaultColaborador = intent.getStringExtra("colaborador") ?: ""
        viewModel.defaultTypeDocument = intent.getStringExtra("typeDocument") ?: ""
        viewModel.defaultDocument = intent.getStringExtra("document") ?: ""
        viewModel.defaultPhone = intent.getStringExtra("phone") ?: ""
        viewModel.defaultEmail = intent.getStringExtra("email") ?: ""
        viewModel.defaultZone = intent.getStringExtra("zone") ?: ""

        viewModel.defaultIdSuscripcion = intent.getStringExtra("idSuscripcion") ?: ""
        viewModel.defaultSubscriptionCode = intent.getStringExtra("subscriptionCode") ?: "0"
        viewModel.defaultStratum = intent.getStringExtra("stratum") ?: ""
        viewModel.defaultAddress = intent.getStringExtra("address") ?: ""
        viewModel.defaultNeighborhood = intent.getStringExtra("neighborhood") ?: ""
        viewModel.defaultCatastral = intent.getStringExtra("catastral") ?: ""

        viewModel.defaultServiceEmsa = intent.getStringExtra("serviceEmsa") ?: ""
        viewModel.defaultAlternateCodeEmsa = intent.getStringExtra("alternateCodeEmsa") ?: ""
        viewModel.defaultAlternateMeterEmsa = intent.getStringExtra("alternateMeterEmsa") ?: ""
        viewModel.defaultServiceGas = intent.getStringExtra("serviceGas") ?: ""
        viewModel.defaultAlternateCodeGas = intent.getStringExtra("alternateCodeGas") ?: ""
        viewModel.defaultAlternateMeterGas = intent.getStringExtra("alternateMeterGas") ?: ""

        viewModel.defaultPropertyUse = intent.getStringExtra("propertyUse") ?: ""
        viewModel.defaultName = intent.getStringExtra("name") ?: ""
        viewModel.defaultLatitude = intent.getStringExtra("latitude") ?: ""
        viewModel.defaultLongitude = intent.getStringExtra("longitude") ?: ""
        viewModel.defaultCatastralNacional = intent.getStringExtra("catastralNacional") ?: ""

        viewModel.defaultTipoFacturacion = intent.getStringExtra("tipoFacturacion") ?: ""
        viewModel.defaultTipoLiquidacion = intent.getStringExtra("tipoLiquidacion") ?: ""
        viewModel.defaultEstablecimiento = intent.getStringExtra("establecimiento") ?: ""
        viewModel.defaultActividadComercial = intent.getStringExtra("actividadComercial") ?: ""
        viewModel.defaultObservacion = intent.getStringExtra("observacion") ?: ""
        viewModel.defaultDeshabitado = intent.getStringExtra("deshabitado") ?: ""
        viewModel.defaultAforado = intent.getStringExtra("aforado") ?: ""
        viewModel.defaultDescuento_pap = intent.getStringExtra("descuentoPap") ?: ""

        tabLayout = findViewById(R.id.tab_layout)
        viewPager = findViewById(R.id.viewPager)

        val limiteFragments: List<String> = intent.getStringExtra("posFragments").toString().split(",")

        val viewPagerAdapter = ViewPagerAdapter(this, limiteFragments)
        viewPager.adapter = viewPagerAdapter

        TabLayoutMediator(tabLayout, viewPager) { tab, pos ->
            tab.text = viewPagerAdapter.tabTitles[pos]
        }.attach()

        setBackButton(this as MenuHost)

    }

    override fun onBackPressed() {
        super.onBackPressed()
        finish()
    }

    private fun setBackButton(menuHost: MenuHost) {
        menuHost.addMenuProvider(object : MenuProvider {
            override fun onCreateMenu(menu: Menu, menuInflater: MenuInflater) {
            }
            override fun onMenuItemSelected(menuItem: MenuItem): Boolean {
                if(menuItem.itemId == android.R.id.home) {
                    finish()
                }
                return true
            }
        }, this, Lifecycle.State.RESUMED)
    }

    fun showGallery(subscriptionId: String = "", noveltyId: Long = 0, visitId: Long = 0, pointId: Long = 0, mediaStorageType: MediaStorageType, addNote: Boolean = false, maxPhotos: Int = 50, tag: String) {

        val galleryFragment = GalleryFragment()
        //galleryFragment.setUpGallery(subscriptionId = subscriptionId, noveltyId = noveltyId, visitId = visitId,  mediaStorageType = mediaStorageType, addNote = addNote, maxPhotos = maxPhotos)
        galleryViewModel.subscriptionId = subscriptionId
        galleryViewModel.noveltyId = noveltyId
        galleryViewModel.visitId = visitId
        galleryViewModel.pointId = pointId
        galleryViewModel.mediaStorageType = mediaStorageType
        galleryViewModel.addNote = addNote
        galleryViewModel.maxPhotos = maxPhotos
        galleryFragment.show(supportFragmentManager, tag)
    }

}