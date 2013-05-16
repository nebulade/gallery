"use strict";

var app = {};

function init () {
    var model = [];
    var i;

    for (i = 16; i < 49; ++i) {
        model.push({
            name: "DSCF18" + i,
            image: "./pictures/DSC000" + i + ".JPG"
        });
    }

    app.model = model;

    Quick.useQueryFlags();
    app.ui = Quick.gallery();
    Quick.Engine.start();

    for (i = 0; i < app.model.length; ++i) {
        app.ui.window.gridView.addDelegate(app.model[i]);
    }

    app.ui.window.gridView.layout();
}
