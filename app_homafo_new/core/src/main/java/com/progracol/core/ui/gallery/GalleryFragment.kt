package com.progracol.core.ui.gallery

import android.app.Activity
import android.app.Dialog
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.view.Window
import android.widget.*
import androidx.activity.result.ActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.fragment.app.activityViewModels
import com.github.dhaval2404.imagepicker.ImagePicker
import com.google.android.material.bottomsheet.BottomSheetDialogFragment
import com.progracol.core.databinding.FragmentGalleryBinding
import androidx.fragment.app.viewModels
import androidx.recyclerview.widget.LinearLayoutManager
import com.bumptech.glide.Glide
import com.bumptech.glide.load.resource.bitmap.RoundedCorners
import com.bumptech.glide.request.RequestOptions
import com.google.android.material.textfield.TextInputEditText
import com.progracol.core.R
import com.progracol.core.common.MediaStorageType
import com.progracol.core.database.entities.MediaStorage
import com.progracol.core.ui.PhotoAdapter
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class GalleryFragment : BottomSheetDialogFragment() {

    private val viewModel: GalleryViewModel by activityViewModels()
    private lateinit var binding: FragmentGalleryBinding

    private lateinit var photosAdapter: PhotoAdapter

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding = FragmentGalleryBinding.inflate(inflater, container, false)

        photosAdapter = PhotoAdapter(requireContext(), addNote = viewModel.addNote) {
            deletePhoto(it)
        }
        binding.listPhotos.adapter = photosAdapter

        if (viewModel.addNote) {
            binding.listPhotos.layoutManager = LinearLayoutManager(requireContext())
        }

        binding.addPhoto.setOnClickListener {
            loadPhoto()
        }

        addObserver()
        viewModel.loadPhotos()

        return binding.root
    }

    private fun addObserver() {
        viewModel.photosLiveData.observe(viewLifecycleOwner) {
            photosAdapter.submitList(it)
        }
    }

    private fun loadPhoto() {
        viewModel.photosLiveData.value?.let {
            if (it.size >= viewModel.maxPhotos) {
                Toast.makeText(requireContext(), "Superó el número máximo de fotos.", Toast.LENGTH_SHORT).show()
                return
            }
        }

        ImagePicker.with(requireActivity())
            .crop()	    			//Crop image(Optional), Check Customization for more option
            .compress(1024)			//Final image size will be less than 1 MB(Optional)
            .maxResultSize(1080, 1080) //Final image resolution will be less than
            .createIntent { intent ->
                 startForProfileImageResult.launch(intent)
           }
    }

    private fun addPhoto(uri: Uri, note: String = "") {
        viewModel.addPhoto(uri = uri, note)
    }

    private fun deletePhoto(mediaStorage: MediaStorage) {
        viewModel.deletePhoto(mediaStorage)
    }

    private val startForProfileImageResult =
        registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result: ActivityResult ->
            val resultCode = result.resultCode
            val data = result.data
            when(resultCode) {
                Activity.RESULT_OK -> {
                    val fileUri = data?.data!!
                    if (viewModel.addNote) {
                        showNoteDialog(fileUri)
                    } else {
                        addPhoto(fileUri)
                    }
                }
                ImagePicker.RESULT_ERROR -> {
                    Toast.makeText(requireContext(), ImagePicker.getError(data), Toast.LENGTH_SHORT).show()
                }
                else -> Toast.makeText(requireContext(), "Task Cancelled", Toast.LENGTH_SHORT).show()
            }
        }

    private fun showNoteDialog(uri: Uri) {
        val dialog = Dialog(requireContext())
        dialog.requestWindowFeature(Window.FEATURE_NO_TITLE)
        dialog.setCancelable(false)
        dialog.setContentView(R.layout.note_photo_dialog)

        val photoImageView: ImageView = dialog.findViewById(R.id.photo)
        val noteEditText: TextInputEditText = dialog.findViewById(R.id.note)
        val saveButton: Button = dialog.findViewById(R.id.save_button)
        val cancelButton: Button = dialog.findViewById(R.id.cancel_button)

        Glide
            .with(requireContext())
            .load(uri)
            .centerCrop()
            .apply(RequestOptions.bitmapTransform(RoundedCorners(14)))
            .placeholder(R.drawable.placeholder)
            .into(photoImageView)

        saveButton.setOnClickListener {
            val note = noteEditText.text.toString()
            addPhoto(uri, note)
            dialog.dismiss()
        }

        cancelButton.setOnClickListener {
            dialog.dismiss()
        }

        dialog.show()
    }

}