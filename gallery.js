"use strict";

var app = {};
var client;

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

    console.log("load album", album);

    client.readdir(album.path, function (error, result) {
        if (error) {
            console.error(error);
            return;
        }

        console.log("-- Pictures", result);

        for (var i = 0; i < result.length; ++i) {
            var fullPath = album.path + "/" + result[i];
            var thumbnailUrl = client.thumbnailUrl(fullPath, { size: "large" });
            var imageUrl = client.thumbnailUrl(fullPath, { size: "xl" });
            app.ui.window.gridView.addDelegate({name: result[i], image: imageUrl, thumbnail: thumbnailUrl});
        }

        app.ui.window.gridView.layout();
    });
};

function listAlbums (albumRoot) {
    client.readdir(albumRoot ? albumRoot : "/", function (error, result) {
        if (error) {
            console.error(error);
            return;
        }

        console.log("-- Albums " + result.join(", "));

        for (var i = 0; i < result.length; ++i) {
            app.ui.window.listView.addDelegate({name: result[i], path: albumRoot + "/" + result[i], thumbnail: ""});
        }

        app.ui.window.listView.layout();
    });
}

function init () {
    // get('/albums', function (error, result) {
    //     if (error) {
    //         console.error(error);
    //         return;
    //     }

    //     console.log("-- Albums", result);

    //     for (var j = 0; j < result.length; ++j) {
    //         app.ui.window.listView.addDelegate(result[j]);
    //     }

    //     app.ui.window.listView.layout();
    // });

    client = new Dropbox.Client({
        key: "wSDThTFVZRA=|jB82mur0JL3wTQY3QlxRLiX2HbVeA+yqsSpsG0kMZQ=="
    });
    client.authDriver(new Dropbox.Drivers.Redirect({ rememberUser: true }));

    client.authenticate(function (error, client) {
        if (error) {
            console.error(error);
            return;
        }

        console.log(client);

        if (!client.isAuthenticated()) {
            initAuthenticated();
        } else {
            client.authenticate(function (error, client) {
                if (error) {
                    console.error(error);
                    return;
                }

                console.log(client);
                initAuthenticated();
            });
        }
    });

    Quick.useQueryFlags();
    app.ui = Quick.gallery();
    Quick.Engine.start();
}

function initAuthenticated() {
    client.getUserInfo(function(error, userInfo) {
        if (error) {
            console.error(error);
            return;
        }

        console.log("Hello, " + userInfo.name + "!");
    });

    listAlbums("Photos");
}
