const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
var path = require('path');

app.get('/', function (req,res) {
   res.sendFile(path.join(__dirname,'Public', 'Index.html'))
});

app.listen(3000, () => console.log("App escuchando puerto 3000"))

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose
  .connect(
    "mongodb+srv://VANGUARDIA:vanguardia2022@vanguardia.hfd2v.mongodb.net/videodb?retryWrites=true&w=majority"
  )
  .catch((error) => handleError(error));
const videodbSchema = new mongoose.Schema (
    {
        Titulo: String,
        Descripcion: String,
        Duracion: String,
        Autor: String,
        Enlace: String,
        Fecha: String,
    },
    {
        collection: "video",
    }
);
const video = mongoose.model("video", videodbSchema);

app.get("/api/videos", (req, res) => {
    video.find((err, video) => {
        if (err) res.status(500).send("Error");
        else res.status(200).json(video);
    });
});

app.get("/api/videos/:id", function (req, res) {
    video.findById(req.params.id, function (err, video) {
        if (err) res.status(500).send("Error");
        else {
          if (video != null) {
            res.status(200).json(video);
          } else res.status(404).send("No se encontro ese video");
        }
      });
});

app.post("/api/videos", function (req, res){
   const video1 = new video ({
   Titulo: req.body.Titulo,
   Descripcion: req.body.Descripcion,
   Duracion: req.body.Duracion,
   Autor: req.body.Autor,
   Enlace: req.body.Enlace,
   Fecha: req.body.Fecha,
   });

   video1.save(function (error, video1) {
    if (error) {
      res.status(500).send("No se ha podido agregar.");
    } else {
      res.status(200).json(video1);
    }
  });
});

app.delete("/api/videos/:id", function (req, res) {
    video.findById(req.params.id, function (err, video) {
        if (err) res.status(500).send("Error");
        else {
          if (video != null) {
            video.remove(function(error, result) {
            if (error) res.status(500).send("Eror");
            else{
                res.status(200).send("Registro Eliminado")
            }
            });
          } else res.status(404).send("No se encontro ese video");
        }
      });
});
