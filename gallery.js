"use strict";

var app = {};

function init () {
    app.pictures = [];
    app.albums = [];
    var i;

    app.albums.push({name: "2013", path: "2013", image: "./pictures/2013/DSC00019.JPG"});
    app.albums.push({name: "private", path: "2013", image: "./pictures/2013/DSC00030.JPG"});
    app.albums.push({name: "Katja", path: "2013", image: "./pictures/2013/DSC00020.JPG"});
    app.albums.push({name: "Urlaub", path: "2013", image: "./pictures/2013/DSC00041.JPG"});
    app.albums.push({name: "Bandprobe", path: "2013", image: "./pictures/2013/DSC00032.JPG"});

    for (i = 16; i < 49; ++i) {
        app.pictures.push({
            name: "DSCF18" + i,
            image: "./pictures/2013/DSC000" + i + ".JPG"
        });
    }

    Quick.useQueryFlags();
    app.ui = Quick.gallery();
    Quick.Engine.start();

    for (i = 0; i < app.albums.length; ++i) {
        app.ui.window.listView.addDelegate(app.albums[i]);
    }

    for (i = 0; i < app.pictures.length; ++i) {
        app.ui.window.gridView.addDelegate(app.pictures[i]);
    }

    app.ui.window.listView.layout();
    app.ui.window.gridView.layout();
}
