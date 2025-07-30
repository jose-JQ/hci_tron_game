package com.example.controllercarrito

import android.os.Bundle
import android.util.Log
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import okhttp3.*
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.RequestBody.Companion.toRequestBody
import java.io.IOException

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            ControllerUI()
        }
    }
}

@Composable
fun ControllerUI() {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(32.dp),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // Botón UP
        Button(onClick = { sendCommand("UP") }, modifier = Modifier.size(80.dp)) {
            Text("↑")
        }

        Spacer(modifier = Modifier.height(16.dp))

        Row {
            // Botón LEFT
            Button(onClick = { sendCommand("LEFT") }, modifier = Modifier.size(80.dp)) {
                Text("←")
            }

            Spacer(modifier = Modifier.width(16.dp))

            // Botón STOP
            Button(onClick = {  }, modifier = Modifier.size(80.dp)) {
                Text("⏹")
            }

            Spacer(modifier = Modifier.width(16.dp))

            // Botón RIGHT
            Button(onClick = { sendCommand("RIGHT") }, modifier = Modifier.size(80.dp)) {
                Text("→")
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Botón DOWN
        Button(onClick = { sendCommand("DOWN") }, modifier = Modifier.size(80.dp)) {
            Text("↓")
        }
    }
}

fun sendCommand(direction: String) {
    val client = OkHttpClient()

    val json = """{"x":"$direction"}"""
    val mediaType = "application/json".toMediaType()
    val requestBody = json.toRequestBody(mediaType)

    val request = Request.Builder()
        .url("http://192.168.1.208:8000/api/player/1")  //
        .put(requestBody)
        .build()

    client.newCall(request).enqueue(object : Callback {
        override fun onFailure(call: Call, e: IOException) {
            e.printStackTrace()
            Log.e("HTTP_ERROR", "Falló conexión", e)
        }

        override fun onResponse(call: Call, response: Response) {
            Log.d("HTTP_RESPONSE", "Código: ${response.code}")
            Log.d("HTTP_RESPONSE", "Cuerpo: ${response.body?.string()}")
        }
    })
}

