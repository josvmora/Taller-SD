// app.js

// Configura AWS S3
AWS.config.update({
    accessKeyId: "", 
    secretAccessKey: '',
    sessionToken: "",
    region: 'us-east-1'
});

const s3 = new AWS.S3();
const bucketName = 'nokotanimages';
const urlLambad = "https://z1kfci7vv0.execute-api.us-east-1.amazonaws.com/default/lambdy?TableName=usuarios";

document.getElementById('upload-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Evita el envío tradicional del formulario

    // Obtén los valores del formulario
    const idCard = document.getElementById('id-card').value;
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const fileInput = document.getElementById('file-upload');
    const file = fileInput.files[0];

    if (file) {
        const params = {
            Bucket: bucketName,
            Key: `photos/${file.name}`,
            Body: file,
            ACL: 'public-read'
        };

        try {
            // Sube la foto a S3
            const data = await s3.upload(params).promise();
            console.log('Foto subida con éxito:', data.Location);
            const photoUrl = data.Location;
            // Muestra la imagen en la galería
            mostrarImagenEnGaleria(data.Location);

            /*
            postData(urlLambad, {
                TableName: "usuarios",
                Item:{ cedula: idCard, nombre: name, correo: email, photo: photoUrl}
              } )
            .then(dt => {
                console.log(dt); // JSON data parsed by `data.json()` call
                console.log("Guardado");
            });
             */

           

            const raw = JSON.stringify({
                TableName: "usuarios",
                Item:{ cedula: idCard, nombre: name, correo: email, photo: photoUrl}
              } );

            const requestOptions = {
            method: "POST",
            body: raw,
            redirect: "follow"
            };

            fetch("https://z1kfci7vv0.execute-api.us-east-1.amazonaws.com/default/lambdy?TableName=usuarios", requestOptions)
            .then((response) => response.text())
            .then((result) => alert(result))
            .catch((error) => console.error(error));


            // Aquí podrías enviar la información a tu servidor o realizar otras acciones

        } catch (err) {
            console.error('Error subiendo la foto:', err);
        }
    }
});

async function postData(url = '', data = {}) {
    // Opciones por defecto estan marcadas con un *
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }

// Función para mostrar imágenes en la galería
function mostrarImagenEnGaleria(url) {
    const gallery = document.getElementById('gallery');
    const img = document.createElement('img');
    img.src = url;
    gallery.appendChild(img);
}

// Función para cargar las imágenes del bucket al iniciar la página
function cargarImagenes() {
    const params = {
        Bucket: bucketName
    };

    s3.listObjects(params, (err, data) => {
        if (err) {
            console.error('Error obteniendo objetos:', err);
        } else {
            const objects = data.Contents;
            objects.forEach(obj => {
                const url = `https://${bucketName}.s3.amazonaws.com/${obj.Key}`;
                mostrarImagenEnGaleria(url);
            });
        }
    });
}

// Cargar imágenes al cargar la página
//document.addEventListener('DOMContentLoaded', cargarImagenes);
