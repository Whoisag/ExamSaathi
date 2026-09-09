package com.whoisag.examsaathi;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Bitmap;
import android.graphics.Color;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.KeyEvent;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

public class MainActivity extends Activity {

    private static final String PREFS_NAME = "examsaathi_prefs";
    private static final String KEY_SERVER_URL = "server_url";
    private static final String DEFAULT_URL = "https://examsaathi.app";

    private WebView webView;
    private ProgressBar progressBar;
    private View splashView;
    private View errorView;
    private TextView tvErrorDetail;
    private Button btnRetry;
    private Button btnOfflineGuide;
    private Button btnChangeServer;

    private SharedPreferences prefs;
    private String currentServerUrl;
    private boolean isErrorState = false;
    private boolean doubleBackToExitPressedOnce = false;

    private ValueCallback<Uri[]> fileUploadCallback;
    private static final int FILE_CHOOSER_REQUEST_CODE = 1001;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Configure Brutalist Status Bar & Navigation Bar Colors
        setupSystemBars();

        setContentView(R.layout.activity_main);

        prefs = getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        currentServerUrl = prefs.getString(KEY_SERVER_URL, DEFAULT_URL);

        // Bind Views
        webView = findViewById(R.id.web_view);
        progressBar = findViewById(R.id.progress_bar);
        splashView = findViewById(R.id.splash_view);
        errorView = findViewById(R.id.error_view);
        tvErrorDetail = findViewById(R.id.tv_error_detail);
        btnRetry = findViewById(R.id.btn_retry);
        btnOfflineGuide = findViewById(R.id.btn_offline_guide);
        btnChangeServer = findViewById(R.id.btn_change_server);

        setupButtons();
        setupWebView();

        loadTargetUrl(currentServerUrl);
    }

    private void setupSystemBars() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            Window window = getWindow();
            window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
            window.clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
            window.setStatusBarColor(Color.parseColor("#FF4D00"));
            window.setNavigationBarColor(Color.parseColor("#000000"));
        }
    }

    private void setupButtons() {
        btnRetry.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                retryConnection();
            }
        });

        btnOfflineGuide.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                openOfflineCheatsheet();
            }
        });

        btnChangeServer.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                showServerConfigDialog();
            }
        });
    }

    @SuppressLint("SetJavaScriptEnabled")
    private void setupWebView() {
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(true);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);
        settings.setSupportZoom(true);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            settings.setMixedContentMode(WebSettings.MIXED_CONTENT_COMPATIBILITY_MODE);
        }

        // Add custom identifier to User-Agent
        String defaultUa = settings.getUserAgentString();
        settings.setUserAgentString(defaultUa + " ExamSaathiApp/1.0.0 (Android Mobile)");

        // Cache settings for high performance
        if (isNetworkAvailable()) {
            settings.setCacheMode(WebSettings.LOAD_DEFAULT);
        } else {
            settings.setCacheMode(WebSettings.LOAD_CACHE_ELSE_NETWORK);
        }

        // Bridge to allow JS in offline.html to trigger retry or config
        webView.addJavascriptInterface(new WebAppInterface(), "AndroidApp");

        webView.setWebViewClient(new CustomWebViewClient());
        webView.setWebChromeClient(new CustomWebChromeClient());
    }

    private void loadTargetUrl(String url) {
        isErrorState = false;
        errorView.setVisibility(View.GONE);
        webView.setVisibility(View.VISIBLE);
        webView.loadUrl(url);
    }

    public void retryConnection() {
        if (!isNetworkAvailable()) {
            Toast.makeText(this, "No internet connection detected. Check Wi-Fi or mobile data.", Toast.LENGTH_SHORT).show();
        }
        loadTargetUrl(currentServerUrl);
    }

    public void openOfflineCheatsheet() {
        errorView.setVisibility(View.GONE);
        splashView.setVisibility(View.GONE);
        webView.setVisibility(View.VISIBLE);
        webView.loadUrl("file:///android_asset/offline.html");
    }

    public void showServerConfigDialog() {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle(getString(R.string.server_dialog_title));
        builder.setMessage(getString(R.string.server_dialog_message));

        final EditText input = new EditText(this);
        input.setText(currentServerUrl);
        input.setSelection(currentServerUrl.length());
        input.setPadding(32, 24, 32, 24);
        builder.setView(input);

        builder.setPositiveButton(getString(R.string.btn_save), new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                String newUrl = input.getText().toString().trim();
                if (!newUrl.isEmpty()) {
                    if (!newUrl.startsWith("http://") && !newUrl.startsWith("https://")) {
                        newUrl = "https://" + newUrl;
                    }
                    currentServerUrl = newUrl;
                    prefs.edit().putString(KEY_SERVER_URL, currentServerUrl).apply();
                    Toast.makeText(MainActivity.this, "Server URL updated!", Toast.LENGTH_SHORT).show();
                    loadTargetUrl(currentServerUrl);
                }
            }
        });

        builder.setNegativeButton(getString(R.string.btn_cancel), null);

        builder.setNeutralButton(getString(R.string.btn_reset_default), new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                currentServerUrl = DEFAULT_URL;
                prefs.edit().putString(KEY_SERVER_URL, DEFAULT_URL).apply();
                Toast.makeText(MainActivity.this, "Reset to default: " + DEFAULT_URL, Toast.LENGTH_SHORT).show();
                loadTargetUrl(currentServerUrl);
            }
        });

        builder.show();
    }

    private boolean isNetworkAvailable() {
        ConnectivityManager cm = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
        if (cm != null) {
            NetworkInfo activeNetwork = cm.getActiveNetworkInfo();
            return activeNetwork != null && activeNetwork.isConnected();
        }
        return false;
    }

    // Custom WebViewClient for routing & error detection
    private class CustomWebViewClient extends WebViewClient {

        @Override
        public void onPageStarted(WebView view, String url, Bitmap favicon) {
            super.onPageStarted(view, url, favicon);
            progressBar.setVisibility(View.VISIBLE);
        }

        @Override
        public void onPageFinished(WebView view, String url) {
            super.onPageFinished(view, url);
            progressBar.setVisibility(View.GONE);
            if (!isErrorState) {
                // Fade out / dismiss splash view once page renders
                splashView.animate().alpha(0f).setDuration(250).withEndAction(new Runnable() {
                    @Override
                    public void run() {
                        splashView.setVisibility(View.GONE);
                    }
                }).start();
            }
        }

        @Override
        public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
            super.onReceivedError(view, request, error);
            if (request.isForMainFrame()) {
                isErrorState = true;
                progressBar.setVisibility(View.GONE);
                splashView.setVisibility(View.GONE);
                webView.setVisibility(View.GONE);
                errorView.setVisibility(View.VISIBLE);
                tvErrorDetail.setText("Unable to reach " + currentServerUrl + "\nVerify internet connectivity or tap CONFIG SERVER IP.");
            }
        }

        @SuppressWarnings("deprecation")
        @Override
        public boolean shouldOverrideUrlLoading(WebView view, String url) {
            if (url == null) return false;

            // Handle external schemes (tel, mailto, whatsapp, intent)
            if (url.startsWith("tel:") || url.startsWith("mailto:") || url.startsWith("whatsapp:") || url.startsWith("intent:")) {
                try {
                    Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                    startActivity(intent);
                    return true;
                } catch (Exception e) {
                    Toast.makeText(MainActivity.this, "No supported app installed for this action.", Toast.LENGTH_SHORT).show();
                    return true;
                }
            }

            // Keep in-app navigation within the app
            return false;
        }
    }

    // Custom WebChromeClient for progress bar and file chooser
    private class CustomWebChromeClient extends WebChromeClient {
        @Override
        public void onProgressChanged(WebView view, int newProgress) {
            super.onProgressChanged(view, newProgress);
            progressBar.setProgress(newProgress);
            if (newProgress == 100) {
                progressBar.setVisibility(View.GONE);
            }
        }

        @Override
        public boolean onShowFileChooser(WebView webView, ValueCallback<Uri[]> filePathCallback, FileChooserParams fileChooserParams) {
            if (fileUploadCallback != null) {
                fileUploadCallback.onReceiveValue(null);
            }
            fileUploadCallback = filePathCallback;

            Intent intent = fileChooserParams.createIntent();
            try {
                startActivityForResult(intent, FILE_CHOOSER_REQUEST_CODE);
            } catch (Exception e) {
                fileUploadCallback = null;
                Toast.makeText(MainActivity.this, "Cannot open file chooser", Toast.LENGTH_SHORT).show();
                return false;
            }
            return true;
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == FILE_CHOOSER_REQUEST_CODE) {
            if (fileUploadCallback != null) {
                Uri[] results = WebChromeClient.FileChooserParams.parseResult(resultCode, data);
                fileUploadCallback.onReceiveValue(results);
                fileUploadCallback = null;
            }
        }
    }

    // JavaScript Bridge
    public class WebAppInterface {
        @JavascriptInterface
        public void retryOnline() {
            new Handler(Looper.getMainLooper()).post(new Runnable() {
                @Override
                public void run() {
                    retryConnection();
                }
            });
        }

        @JavascriptInterface
        public void changeServerUrl() {
            new Handler(Looper.getMainLooper()).post(new Runnable() {
                @Override
                public void run() {
                    showServerConfigDialog();
                }
            });
        }
    }

    // Hardware Back Button navigation & double-tap to exit
    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_BACK) {
            if (errorView.getVisibility() == View.VISIBLE) {
                openOfflineCheatsheet();
                return true;
            }
            if (webView.canGoBack()) {
                webView.goBack();
                return true;
            }

            if (doubleBackToExitPressedOnce) {
                finish();
                return true;
            }

            this.doubleBackToExitPressedOnce = true;
            Toast.makeText(this, getString(R.string.toast_back_exit), Toast.LENGTH_SHORT).show();

            new Handler(Looper.getMainLooper()).postDelayed(new Runnable() {
                @Override
                public void run() {
                    doubleBackToExitPressedOnce = false;
                }
            }, 2000);

            return true;
        }
        return super.onKeyDown(keyCode, event);
    }
}
