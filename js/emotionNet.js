var tamano = 400;
var video = document.getElementById("video");
var canvasEmotion = document.getElementById("canvas");
var otrocanvas = document.getElementById("otrocanvas");
var ctx = canvasEmotion.getContext("2d");

var resultadoDiv = document.getElementById("lista_emocions");

var currentStream = null;
var facingMode = "user";

let modelo = null;
let IAmodeActive = true; // Variable para activar/desactivar el modo IA
let emotionCounter = [0, 0, 0, 0, 0, 0]; // Contador para cada emoción


// Variable global para el nivel de zoom (1 = normal, >1 = acercar)

var zoomLevel = 2; // Puedes cambiar este valor para ajustar el zoom

// Función para cambiar el nivel de zoom
function setZoom(nuevoZoom) {
  zoomLevel = Math.max(1, nuevoZoom); // No permitir menos de 1
}

(async() => {
    console.log("Cargando modelo...");
    modelo = await tf.loadGraphModel("modelo_max/model.json");
    console.log("Modelo cargado");
})();

  window.onload = function() {
      mostrarCamara();
  }
// ----------------------
// cámara
// ----------------------

  function mostrarCamara() {
      var opciones = {
        audio: false,
        video: {
          width: tamano, height: tamano
        }
      }

      if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia(opciones)
            .then(function(stream) {
              currentStream = stream;
              video.srcObject = currentStream;
              procesarCamara();
              predecir();
            })
            .catch(function(err) {
              alert("No se pudo utilizar la camara :(");
              console.log(err);
              alert(err);
            })
      } else {
        alert("No existe la funcion getUserMedia");
      }
    }
  function cambiarCamara() {
          if (currentStream) {
              currentStream.getTracks().forEach(track => {
                  track.stop();
              });
          }

          facingMode = facingMode == "user" ? "environment" : "user";

          var opciones = {
              audio: false,
              video: {
                  facingMode: facingMode, width: tamano, height: tamano
              }
          };


          navigator.mediaDevices.getUserMedia(opciones)
              .then(function(stream) {
                  currentStream = stream;
                  video.srcObject = currentStream;
              })
              .catch(function(err) {
                  console.log("Oops, hubo un error", err);
              })
    }
  function procesarCamara() {
      // Simular zoom recortando el centro del video y escalando al canvas
      var w = video.videoWidth;
      var h = video.videoHeight;
      if (w && h) {
        var zoomW = w / zoomLevel;
        var zoomH = h / zoomLevel;
        var sx = (w - zoomW) / 2;
        var sy = (h - zoomH) / 2;
        ctx.drawImage(video, sx, sy, zoomW, zoomH, 0, 0, tamano, tamano);
      }
      setTimeout(procesarCamara, 20);
    }
// ----------------------
// predicción
// ----------------------

  function predecir() {
      if (modelo != null) {
        resample_single(canvasEmotion, 48, 48, otrocanvas);

        //Hacer la predicciónb
        var ctx2 = otrocanvas.getContext("2d");
        var imgData = ctx2.getImageData(0,0, 48, 48);

        var arr = [];
        var arr48 = [];

        for (var p=0; p < imgData.data.length; p+= 4) {
          var rojo = imgData.data[p] / 255;
          var verde = imgData.data[p+1] / 255;
          var azul = imgData.data[p+2] / 255;

          var gris = (rojo+verde+azul)/3;

          arr48.push([gris]);
          if (arr48.length == 48) {
            arr.push(arr48);
            arr48 = [];
          }
        }
        // Convertimos la imagen en un tensor 4D: [1, 48, 48, 1]
        const inputTensor = tf.tensor4d([arr], [1, 48, 48, 1]);

        // Obtener el nombre correcto del input (solo la primera vez)
        const inputName = modelo.inputs[0].name;

        // Ejecutar el modelo con execute (GraphModel)
        const resultado = modelo.execute({ [inputName]: inputTensor });

        // Obtener array con los valores
        const resultadoArray = resultado.dataSync();
        const maxIndex = resultadoArray.indexOf(Math.max(...resultadoArray));

        const emociones = ['Angry', 'Fear', 'Happy', 'Neutral', 'Sad', 'Surprise'];
        const emocion = emociones[maxIndex];

        // emotionAdding(emocion); // Incrementar el contador de la emoción detectada

        emotionCounter[maxIndex] ++;
        console.log(emocion);

        console.log(emotionCounter);
        console.log("Emoción más frecuente hasta ahora: " + maxEmotion());
        chengeBorderColor(emocion);

        // Mostrar resultados en el div
        resultadoDiv.innerHTML = `[ ${emotionCounter} ]`;

        // Limpieza de tensores para liberar memoria
        tf.dispose([inputTensor, resultado]);


      setTimeout(predecir, 1000);
    }
    }

function maxEmotion() {
    const emociones = ['Angry', 'Fear', 'Happy', 'Neutral', 'Sad', 'Surprise'];
    const maxCount = Math.max(...emotionCounter);
    const maxIndex = emotionCounter.indexOf(maxCount);
    return emociones[maxIndex];
}

  function resample_single(canvasEmotion, width, height, resize_canvas) {
    var width_source = canvasEmotion.width;
    var height_source = canvasEmotion.height;
    width = Math.round(width);
    height = Math.round(height);

    var ratio_w = width_source / width;
    var ratio_h = height_source / height;
    var ratio_w_half = Math.ceil(ratio_w / 2);
    var ratio_h_half = Math.ceil(ratio_h / 2);

    var ctx = canvasEmotion.getContext("2d");
    var ctx2 = resize_canvas.getContext("2d");
    var img = ctx.getImageData(0, 0, width_source, height_source);
    var img2 = ctx2.createImageData(width, height);
    var data = img.data;
    var data2 = img2.data;

    for (var j = 0; j < height; j++) {
        for (var i = 0; i < width; i++) {
            var x2 = (i + j * width) * 4;
            var weight = 0;
            var weights = 0;
            var weights_alpha = 0;
            var gx_r = 0;
            var gx_g = 0;
            var gx_b = 0;
            var gx_a = 0;
            var center_y = (j + 0.5) * ratio_h;
            var yy_start = Math.floor(j * ratio_h);
            var yy_stop = Math.ceil((j + 1) * ratio_h);
            for (var yy = yy_start; yy < yy_stop; yy++) {
                var dy = Math.abs(center_y - (yy + 0.5)) / ratio_h_half;
                var center_x = (i + 0.5) * ratio_w;
                var w0 = dy * dy; //pre-calc part of w
                var xx_start = Math.floor(i * ratio_w);
                var xx_stop = Math.ceil((i + 1) * ratio_w);
                for (var xx = xx_start; xx < xx_stop; xx++) {
                    var dx = Math.abs(center_x - (xx + 0.5)) / ratio_w_half;
                    var w = Math.sqrt(w0 + dx * dx);
                    if (w >= 1) {
                        //pixel too far
                        continue;
                    }
                    //hermite filter
                    weight = 2 * w * w * w - 3 * w * w + 1;
                    var pos_x = 4 * (xx + yy * width_source);
                    //alpha
                    gx_a += weight * data[pos_x + 3];
                    weights_alpha += weight;
                    //colors
                    if (data[pos_x + 3] < 255)
                        weight = weight * data[pos_x + 3] / 250;
                    gx_r += weight * data[pos_x];
                    gx_g += weight * data[pos_x + 1];
                    gx_b += weight * data[pos_x + 2];
                    weights += weight;
                }
            }
            data2[x2] = gx_r / weights;
            data2[x2 + 1] = gx_g / weights;
            data2[x2 + 2] = gx_b / weights;
            data2[x2 + 3] = gx_a / weights_alpha;
        }
    }


    ctx2.putImageData(img2, 0, 0);
} 

function mostrarOcultarCamara() {
  const camara = document.getElementsByClassName("camara")[0];
  const llista_emocions = document.getElementsByClassName("camara2")[0];
    if (camara.style.opacity === "0") {
        camara.style.opacity = "1";
        llista_emocions.style.opacity = "1";
    } else {
        camara.style.opacity = "0";
        llista_emocions.style.opacity = "0";
    }
}


function chengeBorderColor(emocion) {
  const borderElement = document.getElementById("canvas");
  const colorMap = {
      'Angry': 'red',
      'Fear': 'purple',
      'Happy': 'yellow',
      'Neutral': 'gray',
      'Sad': 'blue',
      'Surprise': 'orange'
  };
  borderElement.style.borderColor = colorMap[emocion] || 'black';
}

// function emotionAdding(emocion){
//   switch(emocion) {
//     case 'Angry':
//       emotionCounter[0] = emotionCounter[0] + 30;
//       break;
//     case 'Fear':
//       emotionCounter[1] = emotionCounter[1] + 30;
//       break;
//     case 'Happy':
//       emotionCounter[2] = emotionCounter[2] + 10;
//       break;  
//     case 'Neutral':
//       emotionCounter[3] = emotionCounter[3] + 1;
//       break;
//     case 'Sad':
//       emotionCounter[4] = emotionCounter[4] + 20;
//       break; 
//     case 'Surprise':
//       emotionCounter[5] = emotionCounter[5] + 20;
//       break; 
//   }

// }