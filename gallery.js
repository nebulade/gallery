"use strict";

var app = {};

function get(query, callback) {
    var xhr = new XMLHttpRequest();


    xhr.onreadystatechange = function () {
        if(xhr.readyState == 4 && xhr.status == 200) {
            var result;
            var error = null;

            try {
                result = JSON.parse(xhr.responseText);
            } catch (e) {
                error = e;
            }

            callback && callback(error, result);
        } else if (xhr.readyState == 4 && xhr.status != 200) {
            console.error("could not finish xhr request");
            callback && callback(xhr.status);
        }
    };

    xhr.open("GET", "/api" + query);
    xhr.send(null);
}

app.loadAlbum = function (album) {
    app.ui.window.gridView.clear();

    get('/albums/' + album.name + "/pictures", function (error, result) {
        if (error) {
            console.error(error);
            return;
        }

        console.log("-- Pictures", result);

        for (var i = 0; i < result.length; ++i) {
            app.ui.window.gridView.addDelegate(result[i]);
        }

        app.ui.window.gridView.layout();
    });
};

function init () {
    app.pictures = [];
    app.albums = [];

    get('/albums', function (error, result) {
        if (error) {
            console.error(error);
            return;
        }

        console.log("-- Albums", result);

        for (var j = 0; j < result.length; ++j) {
            app.ui.window.listView.addDelegate(result[j]);
        }

        app.ui.window.listView.layout();
    });

    for (var i = 16; i < 49; ++i) {
        app.pictures.push({
            name: "DSCF18" + i,
            image: "./pictures/2013/DSC000" + i + ".JPG"
        });
    }

    Quick.useQueryFlags();
    app.ui = Quick.gallery();
    Quick.Engine.start();
}
