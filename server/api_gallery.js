"use strict";

var fs = require('fs');

(function () {
    // -- api
    function getAlbums() {
        return fs.readdirSync("./pictures/");
    }

    function getPictures(album) {
        return fs.readdirSync("./pictures/" + album);
    }

    function installRoutes (app) {
        app.get('/api/albums', function (req, res) {
            console.log("Request albums");
            res.contentType('json');
            res.send({ albums: JSON.stringify(getAlbums()) });
        });

        app.get('/api/albums/:album/pictures', function (req, res) {
            console.log("Request pictures for album", req.params.album);
            res.contentType('json');
            res.send({ pictures: JSON.stringify(getPictures(req.params.album))});
        });
    }

    module.exports.installRoutes = installRoutes;
})();
