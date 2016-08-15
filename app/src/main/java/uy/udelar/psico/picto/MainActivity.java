package uy.udelar.psico.picto;

import android.app.DownloadManager;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.provider.MediaStore;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Base64;
import android.util.Log;
import android.view.View;
import android.webkit.DownloadListener;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.widget.Toast;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.text.SimpleDateFormat;
import java.util.Date;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        init();
        FullScreencall();
    }

    private void init() {
        WebView webView = (WebView) findViewById(R.id.webView);

        WebSettings webSettings = webView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);
        webSettings.setAllowFileAccessFromFileURLs(true);
        webSettings.setAllowContentAccess(true);
        webSettings.setAllowFileAccess(true);
        webSettings.setAllowUniversalAccessFromFileURLs(true);
        webSettings.setLoadsImagesAutomatically(true);
        webView.setWebChromeClient(new WebChromeClient());

        try {
            String html = readAssetFile("www/pictoescribe/index.html");
            webView.loadDataWithBaseURL("file:///android_asset/www/pictoescribe/", html, "text/html", "UTF-8", null);
        } catch (IOException e) {
            Log.d("ERROR", e.getMessage());
        }


       webView.setDownloadListener(new DownloadListener(){
            public void onDownloadStart(String url, String userAgent, String contentDisposition, String mimetype, long contentLength) {
                String pureBase64Encoded = url.substring(url.indexOf(","));
                byte[] decodedBytes = Base64.decode(pureBase64Encoded, Base64.DEFAULT);
                Bitmap decodedBitmap = BitmapFactory.decodeByteArray(decodedBytes, 0, decodedBytes.length);

                String timeStamp = new SimpleDateFormat("yyyyMMdd_HHmm").format(new Date());
                String filename ="pictoescribe_"+ timeStamp +".png";
                //File sd = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS);
                File sd = getExternalCacheDir();
                File dest = new File(sd, filename);

                try {
                    FileOutputStream out = new FileOutputStream(dest);
                    decodedBitmap.compress(Bitmap.CompressFormat.PNG, 90, out);
                    out.flush();
                    out.close();
                } catch (Exception e) {
                    e.printStackTrace();
                }

                Intent intent = new Intent();
                intent.setAction(Intent.ACTION_VIEW);
                Log.d("ESTEBAN", dest.getPath().toString());
                intent.setDataAndType(Uri.parse("file://" + dest.getPath()), "image/*");
                startActivity(intent);


              /*   //for downloading directly through download manager
                DownloadManager.Request request = new DownloadManager.Request(Uri.parse("http://"+url));
                request.allowScanningByMediaScanner();
                request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED);
                request.setDestinationInExternalPublicDir(Environment.DIRECTORY_PICTURES, "download");
                DownloadManager dm = (DownloadManager) getSystemService(DOWNLOAD_SERVICE);
                dm.enqueue(request);*/
            }
        });
    }

    private String readAssetFile(String fileName) throws IOException {
        StringBuilder buffer = new StringBuilder();
        InputStream fileInputStream = getAssets().open(fileName);
        BufferedReader bufferReader = new BufferedReader(new InputStreamReader(fileInputStream, "UTF-8"));
        String str;

        while ((str=bufferReader.readLine()) != null) {
            buffer.append(str);
        }
        fileInputStream.close();

        return buffer.toString();
    }


    public void FullScreencall() {
        if(Build.VERSION.SDK_INT > 11 && Build.VERSION.SDK_INT < 19) { // lower api
            View v = this.getWindow().getDecorView();
            v.setSystemUiVisibility(View.GONE);
        } else if(Build.VERSION.SDK_INT >= 19) {
            //for new api versions.
            View decorView = getWindow().getDecorView();
            int uiOptions = View.SYSTEM_UI_FLAG_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY;
            decorView.setSystemUiVisibility(uiOptions);
        }
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus)
    {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) FullScreencall();
    }



}
