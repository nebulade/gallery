"use strict";

var fs = require('fs');
var Path = require('path');
var md5 = require('md5');
var Thumbnail = require('thumbnail');
var async = require('async');

(function () {
    // -- api

    var imageTypes = [".PNG", ".JPG", ".JPEG", ".GIF"];

    function isImage(file) {
        var ext = Path.extname(file.toUpperCase());
        return (imageTypes.indexOf(ext) !== -1);
    }

    function getFirstImage(path) {
        if (path[path.length-1] !== '/') {
            path += '/';
        }

        var entries = fs.readdirSync(path);

        for (var i = 0; i < entries.length; ++i) {
            var entry = entries[i];

            try {
                var stat = fs.lstatSync(path + entry);

                if (stat.isFile() && entry[0] !== '.' && isImage(path + entry)) {
                    return path + entry;
                } else if (stat.isDirectory()) {
                    var ret = getFirstImage(path +  entry);
                    if (ret) {
                        return ret;
                    }
                }
            } catch (e) {
                console.error("Cannot stat file: ", path + entry, "Error", e);
            }
        }

        return "";
    }

    function createAlbumEntry(path, entry, callback) {
        var albumPath = path + entry;
        var stat;

        try {
            stat = fs.lstatSync(albumPath);
        } catch (e) {
            console.error("Cannot stat entry:", albumPath, "Error", e);
            callback(e);
            return;
        }

        if (stat.isDirectory()) {
            var firstImagePath = getFirstImage(albumPath);
            var firstImageDirectory = Path.dirname(firstImagePath);
            var firstImageFile = Path.basename(firstImagePath);

            if (firstImagePath) {
                var thumbnailer = new Thumbnail(firstImageDirectory, "./thumbnails/normal/");
                console.log("try to thumbnail", firstImagePath, firstImageDirectory, firstImageFile);
                thumbnailer.ensureThumbnail(firstImageFile, 265, 265, function (error, filename) {
                    console.log("ensureThumbnail", error, filename)
                    callback(null, {name: entry, path: albumPath, thumbnail: thumbnailer.rootThumbnails + filename});
                });
            } else {
                callback(null, {name: entry, path: albumPath, thumbnail: ""});
            }
        } else {
            callback(null);
        }
    }

    function getAlbums(callback) {
        var albumPath = "./pictures/";
        var entries = fs.readdirSync(albumPath);
        var ret = [];

        async.each(entries, function (entry, callback) {
            createAlbumEntry(albumPath, entry, function (error, result) {
                if (result) {
                    ret.push(result);
                }

                callback();
            });
        }, function (error) {
            if (error) {
                callback(error);
                return;
            }

            callback(null, ret);
        });
    }

    function createPictureEntry(thumbnailer, albumPath, file, callback) {
        var fullEntry = albumPath + file;

        try {
            var stat = fs.lstatSync(fullEntry);

            if (stat.isFile() && isImage(fullEntry)) {
                thumbnailer.ensureThumbnail(file, 265, 265, function (error, filename) {
                    callback(null, {name: file, image: fullEntry, thumbnail: thumbnailer.rootThumbnails + filename});
                });
            } else {
                callback(null);
            }
        } catch (e) {
            console.log("Cannot stat entry:", fullEntry, "Error", e);
            callback(e);
        }
    }

    function getPictures(albumPath, callback) {
        var entries = fs.readdirSync(albumPath);
        var ret = [];

        var thumbnailer = new Thumbnail(albumPath, "./thumbnails/normal/");

        async.each(entries, function (entry, callback) {
            createPictureEntry(thumbnailer, albumPath, entry, function (error, result) {
                if (error) {
                    console.log("error in createPictureEntry", entry, error);
                    callback(error);
                    return;
                }

                if (result) {
                    ret.push(result);
                } else {
                    // console.log("Not a picture", entry);
                }

                callback();
            });
        }, function (error) {
            if (error) {
                callback(error);
                return;
            }

            callback(null, ret);
        });
    }

    function installRoutes (app) {
        app.get('/api/albums', function (req, res) {
            console.log("Request albums");
            res.contentType('json');

            getAlbums(function (error, result) {
                if (error) {
                    console.log("Error getting albums", error);
                    res.send(JSON.stringify([]));
                } else {
                    res.send(JSON.stringify(result));
                }
            });
        });

        app.get('/api/albums/:album/pictures', function (req, res) {
            console.log("Request pictures for album", req.params.album);
            var albumPath = "./pictures/" + req.params.album + "/";
            res.contentType('json');

            getPictures(albumPath, function (error, result) {
                if (error) {
                    console.log("Error getting pictures for album", albumPath, "Error", error);
                    res.send(JSON.stringify([]));
                } else {
                    res.send(JSON.stringify(result));
                }
            });
        });
    }

    module.exports.installRoutes = installRoutes;
})();
