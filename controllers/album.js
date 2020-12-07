"use strict"

var Album = require("../models/album");

function getAlbum(req, res){
    var albumId = req.params.id;

    Album.findById(albumId, (err, album)=>{
        if (err) {
            res.status(500).send({mensaje: "error en la petición..."});
        } else {
            if (!album) {
                res.status(404).send({mensaje: "el Album no existe.."});
            }else{
                res.status(200).send({album});
            }
        }
    });
}

function getAlbums(req, res) {
    Album.find((err, albums)=>{
        if (err) {
            res.status(500).send({mensaje: "error en la petición..."});
        } else {
            if (!albums) {
                res.status(404).send({mensaje: "no hay albums.."});
            }else{
                res.status(200).send({albums});
            }           
        }
    });
}

function saveAlbum(req, res) {
    var _album = new Album();
    var params = req.body; 

    _album.title = params.title;
	_album.description = params.description;

    console.log(req.body);

    _album.save((err, guardado)=>{
        if (err) {
            res.status(500).send({mensaje: "error al guardar ALBUM..."});
        } else {
            if (!guardado) {
                res.status(404).send({mensaje: "no se ha guadado e album..."});
            } else {
                res.status(200).send({album: guardado});
            }
        }
    });
} 

function updateAlbum(req, res) {
    var id = req.params.id;
    var params = req.body;

    Album.findByIdAndUpdate(id, params, (err, actulizado)=>{
        if (err) {
            res.status(500).send({mensaje: "error al actualizar ALBUM..."});            
        } else {
            if (!actulizado) {
                res.status(404).send({mensaje: "no se ha actualizado el album..."});
            } else {
                res.status(200).send({album: actulizado});
            }
        }
    });

}

function deleteAlbum(req, res) {
    var id = req.params.id;
    var params = req.body;

    Album.findByIdAndRemove(id, (err, borrado)=>{
        if (err) {
            res.status(500).send({mensaje: "error al borrar ALBUM..."});            
        } else {
            if (!borrado) {
                res.status(404).send({mensaje: "no se ha borrado el album..."});
            } else {
                res.status(200).send({album: borrado});
            }
        }
    });
}

module.exports = {
    getAlbum,
    getAlbums,
    saveAlbum,
    updateAlbum,
    deleteAlbum
};