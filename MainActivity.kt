package com.example

import android.Manifest
import android.annotation.SuppressLint
import android.app.Activity
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Bundle
import android.provider.MediaStore
import android.view.View
import android.webkit.CookieManager
import android.webkit.PermissionRequest
import android.webkit.ValueCallback
import android.webkit.WebChromeClient
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.ProgressBar
import android.widget.TextView
import androidx.activity.OnBackPressedCallback
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import androidx.core.content.FileProvider
import java.io.File

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private lateinit var progressBar: ProgressBar
    private lateinit var errorView: View
    private lateinit var errorText: TextView

    private var filePathCallback: ValueCallback<Array<Uri>>? = null
    private var cameraUri: Uri? = null

    companion object {
        private const val FILE_CHOOSER_REQUEST = 1001
        private const val CAMERA_PERMISSION_REQUEST = 1002

        // Your GitHub Pages website
        private const val START_URL =
            "https://mfoysalalom7.github.io/frontend/"
    }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        setContentView(R.layout.activity_main)

        webView = findViewById(R.id.webView)
        progressBar = findViewById(R.id.progressBar)
        errorView = findViewById(R.id.errorView)
        errorText = findViewById(R.id.errorText)

        setupWebView()
        setupBackButton()

        if (savedInstanceState == null) {
            webView.loadUrl(START_URL)
        } else {
            webView.restoreState(savedInstanceState)
        }
    }

    @SuppressLint("SetJavaScriptEnabled")
    private fun setupWebView() {

        val settings = webView.settings

        // JavaScript
        settings.javaScriptEnabled = true

        // DOM Storage / localStorage
        settings.domStorageEnabled = true

        // Database storage
        settings.databaseEnabled = true

        // Allow normal website navigation
        settings.allowContentAccess = true
        settings.allowFileAccess = true

        // Better mobile experience
        settings.useWideViewPort = true
        settings.loadWithOverviewMode = false

        // Zoom
        settings.setSupportZoom(false)
        settings.builtInZoomControls = false
        settings.displayZoomControls = false

        // Media
        settings.mediaPlaybackRequiresUserGesture = false

        // Cache
        settings.cacheMode = WebSettings.LOAD_DEFAULT

        // User agent
        settings.userAgentString =
            settings.userAgentString + " FaceTubeAndroid/1.0"

        // Cookies
        CookieManager.getInstance().setAcceptCookie(true)
        CookieManager.getInstance()
            .setAcceptThirdPartyCookies(webView, true)

        /*
         * WebViewClient
         */
        webView.webViewClient = object : WebViewClient() {

            override fun onPageStarted(
                view: WebView?,
                url: String?,
                favicon: android.graphics.Bitmap?
            ) {
                super.onPageStarted(view, url, favicon)

                errorView.visibility = View.GONE
                progressBar.visibility = View.VISIBLE
                progressBar.progress = 10
            }

            override fun onPageFinished(
                view: WebView?,
                url: String?
            ) {
                super.onPageFinished(view, url)

                progressBar.progress = 100

                progressBar.postDelayed({
                    progressBar.visibility = View.GONE
                }, 300)

                errorView.visibility = View.GONE
            }

            override fun onReceivedError(
                view: WebView?,
                request: WebResourceRequest?,
                error: WebResourceError?
            ) {
                super.onReceivedError(view, request, error)

                /*
                 * Only show the full error screen for the main page.
                 * Don't replace the entire page because of a missing
                 * image/CSS/JS resource.
                 */
                if (request?.isForMainFrame == true) {
                    showError(
                        "Unable to load FaceTube.\n\n" +
                                "Please check your internet connection and try again."
                    )
                }
            }

            override fun shouldOverrideUrlLoading(
                view: WebView?,
                request: WebResourceRequest?
            ): Boolean {

                val url = request?.url ?: return false

                return when {
                    url.scheme == "http" ||
                            url.scheme == "https" -> {
                        false
                    }

                    else -> {
                        try {
                            val intent = Intent(
                                Intent.ACTION_VIEW,
                                url
                            )
                            startActivity(intent)
                        } catch (_: Exception) {
                        }

                        true
                    }
                }
            }
        }

        /*
         * WebChromeClient
         *
         * Handles:
         * - File chooser
         * - Camera permission
         * - Microphone permission
         * - WebView progress
         */
        webView.webChromeClient = object : WebChromeClient() {

            override fun onProgressChanged(
                view: WebView?,
                newProgress: Int
            ) {
                super.onProgressChanged(view, newProgress)

                progressBar.visibility = View.VISIBLE
                progressBar.progress = newProgress

                if (newProgress >= 100) {
                    progressBar.postDelayed({
                        progressBar.visibility = View.GONE
                    }, 250)
                }
            }

            override fun onPermissionRequest(
                request: PermissionRequest?
            ) {
                runOnUiThread {

                    request ?: return@runOnUiThread

                    val resources = request.resources

                    val allowedResources = mutableListOf<String>()

                    if (
                        resources.contains(
                            PermissionRequest.RESOURCE_VIDEO_CAPTURE
                        )
                    ) {
                        if (
                            ContextCompat.checkSelfPermission(
                                this@MainActivity,
                                Manifest.permission.CAMERA
                            ) == PackageManager.PERMISSION_GRANTED
                        ) {
                            allowedResources.add(
                                PermissionRequest.RESOURCE_VIDEO_CAPTURE
                            )
                        } else {
                            ActivityCompat.requestPermissions(
                                this@MainActivity,
                                arrayOf(
                                    Manifest.permission.CAMERA
                                ),
                                CAMERA_PERMISSION_REQUEST
                            )
                        }
                    }

                    if (
                        resources.contains(
                            PermissionRequest.RESOURCE_AUDIO_CAPTURE
                        )
                    ) {
                        if (
                            ContextCompat.checkSelfPermission(
                                this@MainActivity,
                                Manifest.permission.RECORD_AUDIO
                            ) == PackageManager.PERMISSION_GRANTED
                        ) {
                            allowedResources.add(
                                PermissionRequest.RESOURCE_AUDIO_CAPTURE
                            )
                        }
                    }

                    if (allowedResources.isNotEmpty()) {
                        request.grant(
                            allowedResources.toTypedArray()
                        )
                    }
                }
            }

            /*
             * HTML <input type="file">
             */
            override fun onShowFileChooser(
                webView: WebView?,
                filePathCallback: ValueCallback<Array<Uri>>?,
                fileChooserParams: FileChooserParams?
            ): Boolean {

                /*
                 * Cancel previous callback
                 */
                this@MainActivity.filePathCallback?.onReceiveValue(null)

                this@MainActivity.filePathCallback =
                    filePathCallback

                val acceptTypes =
                    fileChooserParams?.acceptTypes
                        ?.filter { it.isNotBlank() }
                        ?.toTypedArray()
                        ?: emptyArray()

                val capture =
                    fileChooserParams?.isCaptureEnabled == true

                val intent = createFileChooserIntent(
                    acceptTypes,
                    capture
                )

                try {
                    startActivityForResult(
                        intent,
                        FILE_CHOOSER_REQUEST
                    )
                } catch (_: Exception) {

                    this@MainActivity.filePathCallback
                        ?.onReceiveValue(null)

                    this@MainActivity.filePathCallback =
                        null

                    return false
                }

                return true
            }
        }
    }

    /*
     * Create file chooser.
     *
     * Supports:
     * - Gallery
     * - Images
     * - Videos
     * - Camera
     */
    private fun createFileChooserIntent(
        acceptTypes: Array<String>,
        capture: Boolean
    ): Intent {

        val contentIntent = Intent(
            Intent.ACTION_GET_CONTENT
        ).apply {

            addCategory(Intent.CATEGORY_OPENABLE)

            type = when {
                acceptTypes.any {
                    it.startsWith("image/")
                } -> "image/*"

                acceptTypes.any {
                    it.startsWith("video/")
                } -> "video/*"

                acceptTypes.any {
                    it.startsWith("audio/")
                } -> "audio/*"

                else -> "*/*"
            }

            putExtra(
                Intent.EXTRA_ALLOW_MULTIPLE,
                true
            )
        }

        /*
         * Camera intent
         */
        val cameraIntent: Intent? =
            if (
                capture ||
                acceptTypes.any {
                    it.startsWith("image/")
                }
            ) {
                createCameraIntent()
            } else {
                null
            }

        return if (cameraIntent != null) {

            Intent.createChooser(
                contentIntent,
                "Select media"
            ).apply {

                putExtra(
                    Intent.EXTRA_INITIAL_INTENTS,
                    arrayOf(cameraIntent)
                )
            }

        } else {

            Intent.createChooser(
                contentIntent,
                "Select file"
            )
        }
    }

    /*
     * Camera
     */
    private fun createCameraIntent(): Intent? {

        if (
            ContextCompat.checkSelfPermission(
                this,
                Manifest.permission.CAMERA
            ) != PackageManager.PERMISSION_GRANTED
        ) {
            ActivityCompat.requestPermissions(
                this,
                arrayOf(Manifest.permission.CAMERA),
                CAMERA_PERMISSION_REQUEST
            )

            return null
        }

        val intent = Intent(
            MediaStore.ACTION_IMAGE_CAPTURE
        )

        val photoFile = try {
            File.createTempFile(
                "facetube_camera_",
                ".jpg",
                cacheDir
            )
        } catch (_: Exception) {
            return null
        }

        cameraUri = FileProvider.getUriForFile(
            this,
            "${applicationContext.packageName}.fileprovider",
            photoFile
        )

        intent.putExtra(
            MediaStore.EXTRA_OUTPUT,
            cameraUri
        )

        intent.addFlags(
            Intent.FLAG_GRANT_WRITE_URI_PERMISSION or
                    Intent.FLAG_GRANT_READ_URI_PERMISSION
        )

        return intent
    }

    /*
     * Activity result
     */
    @Deprecated("Use Activity Result API in future versions")
    override fun onActivityResult(
        requestCode: Int,
        resultCode: Int,
        data: Intent?
    ) {
        super.onActivityResult(
            requestCode,
            resultCode,
            data
        )

        if (requestCode != FILE_CHOOSER_REQUEST) {
            return
        }

        val callback = filePathCallback

        if (callback == null) {
            return
        }

        var results: Array<Uri>? = null

        if (resultCode == Activity.RESULT_OK) {

            /*
             * Multiple selected files
             */
            if (data?.clipData != null) {

                val clipData = data.clipData!!

                results = Array(
                    clipData.itemCount
                ) { index ->
                    clipData
                        .getItemAt(index)
                        .uri
                }

            }
            /*
             * Single selected file
             */
            else if (data?.data != null) {

                results = arrayOf(
                    data.data!!
                )
            }
            /*
             * Camera
             */
            else if (cameraUri != null) {

                results = arrayOf(
                    cameraUri!!
                )
            }
        }

        callback.onReceiveValue(results)

        filePathCallback = null
        cameraUri = null
    }

    /*
     * Android Back Button
     */
    private fun setupBackButton() {

        onBackPressedDispatcher.addCallback(
            this,
            object : OnBackPressedCallback(true) {

                override fun handleOnBackPressed() {

                    if (webView.canGoBack()) {
                        webView.goBack()
                    } else {
                        finish()
                    }
                }
            }
        )
    }

    /*
     * Error screen
     */
    private fun showError(message: String) {

        progressBar.visibility = View.GONE

        errorView.visibility = View.VISIBLE

        errorText.text = message
    }

    /*
     * Retry button
     */
    fun retryPage(view: View) {

        errorView.visibility = View.GONE

        progressBar.visibility = View.VISIBLE

        webView.reload()
    }

    /*
     * Save WebView state
     */
    override fun onSaveInstanceState(
        outState: Bundle
    ) {
        webView.saveState(outState)

        super.onSaveInstanceState(outState)
    }

    /*
     * Clean up
     */
    override fun onDestroy() {

        filePathCallback
            ?.onReceiveValue(null)

        filePathCallback = null

        webView.apply {
            stopLoading()
            webChromeClient = null
            webViewClient = null
            destroy()
        }

        super.onDestroy()
    }
}
