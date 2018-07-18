document.addEventListener("deviceready", onDeviceReady, true);
var servidorurl="";// ruta del servidor (colocar la que se necesite)
function onDeviceReady() {
$( "#salir" ).click(function() {
  navigator.app.exitApp();
});
}
var myApp = new Framework7({
      material: true, //Activamos Material
    });
var $$ = Dom7;

var mainView = myApp.addView('.view-main', {
  // dynamicNavbar: true,
  // domCache: true //Activamos el DOM cache, para pages inline
});

var video;
myApp.onPageInit('grabar', function(page){
  video=null;

  document.addEventListener("deviceready", onDeviceReady, false);
  function onDeviceReady() {
      // console.log(navigator.device.capture);
      // start video capture
  $( "#camera" ).click(function() {
    navigator.device.capture.captureVideo(captureSuccess, captureError, {limit:1, duration:1});
  });

  $( "#enviar" ).click(function() {
    if (video!=null) {
      alert("Enviando");
      ruta = video.fullPath;
      tipo = video.type;
      alert(ruta);
      var options = new FileUploadOptions();
      options.fileKey = "video"; //Nombre del campo, como lo va a recibir el servidor
      options.fileName = ruta.substr(ruta.lastIndexOf('/')+1); //Nombre del campo, como lo va a recibir el servidor
      options.mimeType = tipo; //Tipo de video
      options.httpMethod = "POST"; //Tipo de video
      options.chunkedMode = true; //subir datos adjuntos

      //aqui es donde se cargan los demas campos
      var params = new Object();
      params.descripcion = $("#datos").val();

      options.params = params;
      var ft = new FileTransfer();
      // var percentageUpload = 0; // esto es para una barra de progreso
      
      ft.upload(ruta,servidorurl,win,fail,options);

      function win(r) { // si funciona
        alert("Respuesta del Servidor: "+ r.response);
        mainView.router.loadPage('index.html');
      }

      function fail(error) { // si ta jodio
        // alert("upload error source: "+ error.source);
        // alert("upload error target: "+ error.target);
        alert("An error has occurred Code: "+ error.code);
      }
    } else {
      alert("Debe cargar un archivo primero");
    }
  });
  }
  // capture callback
  var captureSuccess = function(mediaFiles) {
    // console.log(mediaFiles);
    // alert ("terminó");
    alert (JSON.stringify(mediaFiles));
    video =mediaFiles['0'];
    alert (video.fullPath); 
    alert (video.type); 
    // alert (mediaFiles);
   
    // $( "#video" ).html( '<video src="'+video.fullPath+'" width="320" height="240" controls>\
    //                       Este dispositivo no soporta la reproducción de video.\
    //                     </video>' );
    $( "#file" ).html( video.fullPath.substr(video.fullPath.lastIndexOf('/')+1) );
    // var i, path, len;
    // for (i = 0, len = mediaFiles.length; i < len; i += 1) {
    //     path = mediaFiles[i].fullPath;
    //     // do something interesting with the file
    // }
  };
  
  // capture error callback
  var captureError = function(error) {
    navigator.notification.alert('Error code: ' + error.code, null, 'Capture Error');
  };
});

myApp.onPageInit('cargar', function(page){

  $('input[type=file]').change(function(e){
    // alert($(this).val());
    var fileName = e.target.files[0].name;
    // alert(fileName);
    $( "#filename" ).html(fileName);
  });


  $("form#cargador").submit(function(e) {
    // e.preventDefault();
    var form_data = new FormData(this);         
    var file_data = $('input[type=file]').prop('files')[0];   

    form_data.append('file', file_data);
    archivo = $('input[type=file]').val();
    // alert(archivo);
    if(archivo!=""){
      $.ajax({
        url: servidorurl,
        type: 'post',
        cache: false,
        data: form_data,
        async: false,
        processData: false,
        contentType: false,
        success: function (data) {
          alert("Respuesta del Servidor: "+ data);
        },
        error: function () {
          // errorAjax(id);
          alert("Ocurrio un error durante la carga, Intente mas tarde");
        }
    });

    } else {
      alert("Debes cargar un video");
      e.preventDefault();
    }
});
});

// myApp.onPageInit('*', function(page){
//
// // myApp.alert("Hola");
// myApp.closePanel('left');
//
// });
