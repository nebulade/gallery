"use strict";

var app = {};

app.loadAlbum = function (album) {
    app.ui.window.gridView.clear();

    console.log("load album", album);

    app.client.readdir(album.path, function (error, result) {
        if (error) {
            console.error(error);
            return;
        }

        console.log("-- Pictures", result);

        for (var i = 0; i < result.length; ++i) {
            var fullPath = album.path + "/" + result[i];
            var thumbnailUrl = app.client.thumbnailUrl(fullPath, { size: "large" });
            var imageUrl = app.client.thumbnailUrl(fullPath, { size: "xl" });
            app.ui.window.gridView.addDelegate({name: result[i], image: imageUrl, thumbnail: thumbnailUrl});
        }

        app.ui.window.gridView.layout();
    });
};

function listAlbums (albumRoot) {
    app.client.readdir(albumRoot ? albumRoot : "/", function (error, result) {
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
    app.client = new Dropbox.Client({ key: "wSDThTFVZRA=|jB82mur0JL3wTQY3QlxRLiX2HbVeA+yqsSpsG0kMZQ==" });
    app.client.authDriver(new Dropbox.Drivers.Redirect({ rememberUser: true }));

    app.client.authenticate(function (error, client) {
        if (error) {
            console.error(error);
            return;
        }

        console.log(client);

        if (!app.client.isAuthenticated()) {
            initAuthenticated();
        } else {
            app.client.authenticate(function (error, client) {
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
    Quick.nebulon();
    app.ui = Quick.gallery();
    Quick.Engine.start();
}

function initAuthenticated() {
    app.client.getUserInfo(function(error, userInfo) {
        if (error) {
            console.error(error);
            return;
        }

        console.log("Hello, " + userInfo.name + "!");
    });

    listAlbums("Photos");
}
