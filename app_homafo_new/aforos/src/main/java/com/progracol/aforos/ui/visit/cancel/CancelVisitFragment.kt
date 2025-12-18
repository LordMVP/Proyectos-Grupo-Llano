package com.progracol.aforos.ui.visit.cancel

import android.os.Bundle
import android.util.Log
import android.view.*
import androidx.core.view.MenuHost
import androidx.core.view.MenuProvider
import androidx.fragment.app.activityViewModels
import androidx.fragment.app.viewModels
import androidx.lifecycle.Lifecycle
import androidx.navigation.fragment.findNavController
import androidx.navigation.fragment.navArgs
import com.google.android.material.textfield.TextInputEditText
import com.progracol.aforos.R
import com.progracol.aforos.databinding.FragmentCancelVisitBinding
import com.progracol.aforos.ui.visit.register.RegisterVisitFragment
import com.progracol.aforos.ui.visit.register.RegisterVisitFragmentArgs
import com.progracol.core.common.MediaStorageType
import com.progracol.core.network.Resource
import com.progracol.core.ui.BaseFragment
import com.progracol.core.ui.MessageDialog
import com.progracol.core.ui.gallery.GalleryFragment
import com.progracol.core.ui.gallery.GalleryViewModel

class CancelVisitFragment : BaseFragment(
    "Cancelar"
) {

    private lateinit var binding: FragmentCancelVisitBinding
    private val viewModel: CancelVisitViewModel by viewModels()
    private val galleryViewModel: GalleryViewModel by activityViewModels()

    private val params: RegisterVisitFragmentArgs by navArgs()

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        binding = FragmentCancelVisitBinding.inflate(inflater, container, false)

        viewModel.visitId = params.id

        binding.addPhoto.setOnClickListener { showGallery() }
        binding.cancelButton.setOnClickListener {
            viewModel.note = binding.note.findViewById<TextInputEditText>(R.id.note).editableText.toString()
            cancelVisit()
        }

        setBackButton(requireActivity() as MenuHost)

        return binding.root
    }

    private fun showGallery() {
        val galleryFragment = GalleryFragment()
        //galleryFragment.setUpGallery(visitId = viewModel.visitId, mediaStorageType = MediaStorageType.AFORO_CANCELED_VISIT, addNote = true)
        galleryViewModel.visitId = viewModel.visitId
        galleryViewModel.mediaStorageType = MediaStorageType.AFORO_CANCELED_VISIT
        galleryViewModel.addNote = true
        galleryFragment.show(parentFragmentManager, RegisterVisitFragment::class.simpleName)
    }

    private fun cancelVisit() {
        viewModel.cancelVisit().observe(viewLifecycleOwner) {
            when (it.status) {
                Resource.Status.LOADING -> {
                }
                Resource.Status.SUCCESS -> { messageDialog.showMessage(resources.getString(R.string.success_cancel_visit))
                findNavController().popBackStack()
                }
                Resource.Status.ERROR -> messageDialog.showErrorMessage(resources.getString(R.string.error_cancel_visit))
            }
        }
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

}