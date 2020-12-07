"use strict"

var path = require("path");
var Image = require("../models/image");
var Album = require("../models/album");

function getImage(req, res) {
    var imageId = req.params.id;
    
    Image.findById(imageId).populate({path: 'album'}).exec((err, imagen) => {
        if (err) {
          res.status(500).send({message: 'Error en la petición'});
        } else {
          if (!imagen) {
            res.status(404).send({message: 'La imagen no existe'});
          } else {
            res.status(200).send({imagen});
          }
        }
    }); 
}

function saveImage(req, res) {
    var _image = new Image();
    var params = req.body;
    
    _image.title = params.title;
    _image.picture = null;
    _image.album = params.album;

    _image.save((err, guardado)=>{
        if (err) {
            res.status(500).send({mensaje: "error en la petición..."});
        } else {
            if (!guardado) {
                res.status(404).send({mensaje: "no existe la imagen..."});
            } else {
                res.status(200).send({image: guardado});
            }
        }
    });
}

function getImages(req, res) {
    var albumId = req.params.album;

    if (!albumId) {
        //todas las imagenes
        Image.find({}).sort("title").exec((err, imagenes)=>{
            if (err) {
                res.status(500).send({mensaje: "error en la petición..."});
            } else {
                if (!imagenes) {
                    res.status(404).send({mensaje: "no existen la imagenes..."});                    
                } else {
                    res.status(200).send({image: imagenes});                    
                }               
            }
        });
    }else{
        Image.find({album: albumId}).sort("title").exec((err, imagenes)=>{
            if (err) {
                res.status(500).send({mensaje: "error en la petición..."});
            } else {
                if (!imagenes) {
                    res.status(404).send({mensaje: "no existen la imagenes..."});                    
                } else {
                    Album.populate(imagenes, {path: "album"}, (err, imagenes)=>{
                        if (err) {
                            res.status(500).send({mensaje: "error en la petición..."});                            
                        }else{
                            res.status(200).send({image: imagenes});                    
                        }
                    })                   
                }               
            }
        });
    }
}

function updateImage(req, res) {
    var imagenId = req.params.id;
    var update = req.body;

    Image.findByIdAndUpdate(imagenId, update, (err, actualizado)=>{
        if (err) {
            res.status(500).send({mensaje: "error en la petición..."});
        } else {
            if (!actualizado) {
                res.status(404).send({mensaje: "no se pudo actualizar la imagen"});
            } else {
                res.status(200).send({images: actualizado});
            }
        }
    });
}
function deleteImage(req, res) {
    var imagenId = req.params.id;

    Image.findByIdAndRemove(imagenId, (err, borrado)=>{
        if (err) {
            res.status(500).send({mensaje: "error en la petición..."});
        } else {
            if (!borrado) {
                res.status(404).send({mensaje: "no se pudo borrar la imagen"});
            } else {
                res.status(200).send({image: borrado});
            }
        }
    });
}

function uploadImage(req, res) {
    var imageId = req.params.id;
    var filename = "no subido";

    if (req.files) {
        var file_path = req.files.image.path;
        //var file_split = file_path.split("\\");
        var file_split = file_path.split("/",2);
        var file_name = file_split[1];

        
        Image.findByIdAndUpdate(imageId, {picture: file_name}, (err, subido)=>{
            if (err) {
                res.status(500).send({mensaje: "error en la petición..."});
            } else {
                if (!subido) {
                    res.status(404).send({mensaje: "imagen no se pudo subir..."});
                } else {
                    res.status(200).send({image: subido});
                }
            }
        });
    } else {
        res.status(200).send({mensaje: "no ha subido ninguna imagen..." });
    } 
}
var fs = require("fs");

function getImageFile(req, res) {
    var imageFile = req.params.imageFile;

    fs.exists("./uploads/" + imageFile, (existe) =>{
        if (existe) {
            res.sendFile(path.resolve("./uploads/" + imageFile));            
        } else {
            res.status(200).send({mensaje: "no existe la imagen.."});
        }
    });
}

module.exports = {
    getImage,
    saveImage,
    getImages,
    updateImage,
    deleteImage,
    uploadImage,
    getImageFile
}