if (!window.Quick) {
    window.Quick = {};
}

window.Quick.gallery = function () {
    'use strict';

    var e = { 
        children: [],
        addChild: function(child) {
            this[child.id] = child;
            for (var i in this.children) {
                if (this.children.hasOwnProperty(i)) {
                    this.children[i][child.id] = child;
                    child[this.children[i].id] = this.children[i];
                }
            }
            e.children.push(child);
            Quick.Engine.addElement(child);
            return child;
        },
        initializeBindings: function() {
            for (var i = 0; i < e.children.length; ++i) { e.children[i].initializeBindings(); }
        },
        render: function() {
            for (var i = 0; i < e.children.length; ++i) { e.children[i].render(); }
        }
    };

    Quick.ListDelegate = function (id, parent) {
        var e = new Quick.Item(id, parent);
        e.addProperty("width", function () {return this.parent.width;});
        e.addProperty("height", function () {return 100;});
        e.addProperty("backgroundColor", function () {return this.ma.mousePressed ? "#3C7DC1" : (this.modelIndex % 2 ? "#0f0f0f" : "black");});
        e.addProperty("overflow", function () {return "hidden";});
        e.addChild((function() {
            var e = new Quick.Label();
            e.addProperty("left", function () {return 10;});
            e.addProperty("top", function () {return this.parent.height/2 - this.height/2;});
            e.addProperty("text", function () {return this.parent.modelData.name;});
            e.addProperty("color", function () {return this.ma.mousePressed ? "white" : "#3C7DC1";});
            return e;
        })());
        e.addChild((function() {
            var e = new Quick.InputItem("ma");
            e.addEventHandler("onactivated", function () {
            this.parent.parent.parent.showAlbum(this.parent.modelData)
            });
            return e;
        })());
        return e;
    };
    Quick.BusyIndicator = function (id, parent) {
        var e = new Quick.Item(id, parent);
        e.addProperty("height", function () {return 10;});
        e.addProperty("width", function () {return 70;});
        e.addProperty("currentActive", function () {return this.one;});
        e.addEventHandler("onload", function () {
        
        var that = this;
        setInterval(function () {
            var a = that.currentActive;
            if (a === that.one) {
                that.currentActive = that.two;
            } else if (a === that.two) {
                that.currentActive = that.three;
            } else if (a === that.three) {
                that.currentActive = that.four;
            } else if (a === that.four) {
                that.currentActive = that.one;
            }
        }, 300);
    
        });
        e.addChild((function() {
            var e = new Quick.Item("one");
            e.addProperty("top", function () {return 0;});
            e.addProperty("left", function () {return 0;});
            e.addProperty("backgroundColor", function () {return "#3C7DC1";});
            e.addProperty("width", function () {return 10;});
            e.addProperty("height", function () {return 10;});
            e.addProperty("opacity", function () {return this.parent.currentActive === this ? 1 : 0;});
            e.addChild((function() {
                var e = new Quick.Behavior();
                e.addProperty("opacity", function () {return "250ms";});
                return e;
            })());
            return e;
        })());
        e.addChild((function() {
            var e = new Quick.Item("two");
            e.addProperty("top", function () {return 0;});
            e.addProperty("left", function () {return 20;});
            e.addProperty("backgroundColor", function () {return "#3C7DC1";});
            e.addProperty("width", function () {return 10;});
            e.addProperty("height", function () {return 10;});
            e.addProperty("opacity", function () {return this.parent.currentActive === this ? 1 : 0;});
            e.addChild((function() {
                var e = new Quick.Behavior();
                e.addProperty("opacity", function () {return "250ms";});
                return e;
            })());
            return e;
        })());
        e.addChild((function() {
            var e = new Quick.Item("three");
            e.addProperty("top", function () {return 0;});
            e.addProperty("left", function () {return 40;});
            e.addProperty("backgroundColor", function () {return "#3C7DC1";});
            e.addProperty("width", function () {return 10;});
            e.addProperty("height", function () {return 10;});
            e.addProperty("opacity", function () {return this.parent.currentActive === this ? 1 : 0;});
            e.addChild((function() {
                var e = new Quick.Behavior();
                e.addProperty("opacity", function () {return "250ms";});
                return e;
            })());
            return e;
        })());
        e.addChild((function() {
            var e = new Quick.Item("four");
            e.addProperty("top", function () {return 0;});
            e.addProperty("left", function () {return 60;});
            e.addProperty("backgroundColor", function () {return "#3C7DC1";});
            e.addProperty("width", function () {return 10;});
            e.addProperty("height", function () {return 10;});
            e.addProperty("opacity", function () {return this.parent.currentActive === this ? 1 : 0;});
            e.addChild((function() {
                var e = new Quick.Behavior();
                e.addProperty("opacity", function () {return "250ms";});
                return e;
            })());
            return e;
        })());
        return e;
    };
    Quick.GridDelegate = function (id, parent) {
        var e = new Quick.Item(id, parent);
        e.addProperty("width", function () {return this.parent.delegateSize;});
        e.addProperty("height", function () {return this.parent.delegateSize;});
        e.addProperty("overflow", function () {return "hidden";});
        e.addProperty("image", function () {return "";});
        e.addChild((function() {
            var e = new Quick.BackgroundImage();
            e.addProperty("width", function () {return this.parent.width;});
            e.addProperty("height", function () {return this.parent.height;});
            e.addProperty("src", function () {return this.parent.modelData.thumbnail;});
            e.addProperty("backgroundSize", function () {return "cover";});
            return e;
        })());
        e.addChild((function() {
            var e = new Quick.InputItem();
            e.addEventHandler("onactivated", function () {
            this.parent.parent.parent.showImage(this.parent.image)
            });
            return e;
        })());
        return e;
    };
    e.addChild((function() {
        var e = new Quick.Window("window");
        e.addProperty("width", function () {return this.innerWidth;});
        e.addProperty("height", function () {return this.innerHeight;});
        e.addProperty("overflow", function () {return "hidden";});
        e.addProperty("currentView", function () {return this.listView;});
        e.addFunction("showImage", function (image) {
        
        console.log("-- load image", image);
        var that = this;
        // var i = new Image();
        // i.onload = function () {
            that.fullscreenImage.src = image;
            that.currentView = that.fullscreenImage;
        // };
        // i.src = image;
    
        });
        e.addFunction("showAlbum", function (album) {
        
        app.loadAlbum(album);
        this.currentView = this.gridView;
    
        });
        e.addFunction("back", function () {
        
        if (this.currentView === this.fullscreenImage)
            this.currentView = this.gridView;
        else if (this.currentView === this.gridView)
            this.currentView = this.listView;
    
        });
        e.addChild((function() {
            var e = new Quick.ListView("listView");
            e.addProperty("left", function () {return this.parent.currentView === this ? 0 : -this.width;});
            e.createdelegate = function () {
                return new Quick.ListDelegate();
            }
            e.addChild((function() {
                var e = new Quick.Behavior();
                e.addProperty("left", function () {return "250ms";});
                return e;
            })());
            return e;
        })());
        e.addChild((function() {
            var e = new Quick.GridView("gridView");
            e.addProperty("delegateSize", function () {return this.parent.innerWidth/(this.parent.innerWidth < 600 ? 3 : 10);});
            e.addProperty("width", function () {return this.parent.width;});
            e.addProperty("height", function () {return this.parent.height - this.backButton.height;});
            e.addProperty("left", function () {return this.parent.currentView === this ? 0 : this.width;});
            e.createdelegate = function () {
                return new Quick.GridDelegate();
            }
            e.addChild((function() {
                var e = new Quick.Behavior();
                e.addProperty("left", function () {return "250ms";});
                return e;
            })());
            return e;
        })());
        e.addChild((function() {
            var e = new Quick.Item("fullscreenImage");
            e.addProperty("src", function () {return "";});
            e.addProperty("width", function () {return this.parent.width;});
            e.addProperty("height", function () {return this.parent.height - this.backButton.height;});
            e.addProperty("left", function () {return this.parent.currentView === this ? 0 : this.width;});
            e.addProperty("opacity", function () {return this.parent.currentView === this ? 1 : 0;});
            e.addProperty("backgroundColor", function () {return "black";});
            e.addChild((function() {
                var e = new Quick.BusyIndicator();
                e.addProperty("left", function () {return this.parent.width/2 - this.width/2;});
                e.addProperty("top", function () {return this.parent.height/2 - this.height/2;});
                return e;
            })());
            e.addChild((function() {
                var e = new Quick.BackgroundImage();
                e.addProperty("src", function () {return this.parent.src;});
                e.addProperty("backgroundSize", function () {return "contain";});
                e.addProperty("width", function () {return this.parent.width;});
                e.addProperty("height", function () {return this.parent.height;});
                return e;
            })());
            e.addChild((function() {
                var e = new Quick.Behavior();
                e.addProperty("left", function () {return "250ms";});
                e.addProperty("opacity", function () {return "1000ms";});
                return e;
            })());
            return e;
        })());
        e.addChild((function() {
            var e = new Quick.Button("backButton");
            e.addProperty("width", function () {return this.parent.width;});
            e.addProperty("top", function () {return this.parent.height - (this.parent.currentView === this.listView ? 0 : this.height);});
            e.addProperty("label", function () {return "BACK";});
            e.addEventHandler("onactivated", function () {
            this.parent.back()
            });
            e.addChild((function() {
                var e = new Quick.Behavior();
                e.addProperty("top", function () {return "250ms";});
                return e;
            })());
            return e;
        })());
        return e;
    })());
    e.initializeBindings();
    e.render();
    return e;
};
