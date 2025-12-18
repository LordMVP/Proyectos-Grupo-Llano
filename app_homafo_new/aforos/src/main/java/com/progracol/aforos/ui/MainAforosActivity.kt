package com.progracol.aforos.ui

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import com.progracol.core.R
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class MainAforosActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main_aforos)
    }

    override fun onBackPressed() {
        super.onBackPressed()
        finish()
    }
}