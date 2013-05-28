"use strict";

var app = {};

app.loadAlbum = function (album) {
    app.ui.window.gridView.clear();

    console.log("load album", album);

    app.client.readdir(album.path, function (error, result, folderStat, resultStats) {
        if (error) {
            console.error(error);
            return;
        }

        console.log("-- Pictures", result);

        var i = 0;
        var grid = app.ui.window.gridView;

        function addDelegate() {
            if (i >= result.length) {
                return;
            }

            var stat = resultStats[i];

            // ignore folder and files without thumbnail
            if (!stat.isFolder && stat.hasThumbnail) {
                var fullPath = album.path + "/" + result[i];
                var thumbnailUrl = app.client.thumbnailUrl(fullPath, { size: "l" });
                var delegate = grid.addDelegate({name: result[i], image: "", thumbnail: thumbnailUrl});

                app.client.makeUrl(fullPath, { download: true }, function (error, result) {
                    if (error) {
                        console.error(error);
                    }

                    if (result && delegate) {
                        delegate.image = result.url;
                    }
                });

                // relayout....could be a bit smarter?
                grid.layout();
            }

            window.setTimeout(function () {
                ++i;
                addDelegate();
            }, 10);
        }

        addDelegate();
    });
};

app.signOut = function () {
    app.client.signOut(function (error) {
        if (error) {
            console.error(error);
        }

        window.location.reload();
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
            app.ui.window.listView.addDelegate({name: result[i], path: albumRoot + "/" + result[i], thumbnail: app.client.thumbnailUrl(albumRoot + "/" + result[i], { size: "l" })});
        }

        app.ui.window.listView.layout();
    });
}

function init () {
    app.client = new Dropbox.Client({ key: "dQSjZUVTKJA=|Z92Wfc8sxU2jgfl9X5J9B9PDIG42c6eePuAHT3FS3Q==" });
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

function initAuthenticated () {
    app.client.getUserInfo(function (error, userInfo) {
        if (error) {
            console.error(error);
            return;
        }

        app.ui.window.toolbar.label.text = "Hello " + userInfo.name;
    });

    listAlbums("Photos");
}
