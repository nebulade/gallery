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
        e.addProperty("backgroundColor", function () {return "black";});
        e.addProperty("borderStyle", function () {return "solid";});
        e.addProperty("borderWidth", function () {return "1px 0 0 0";});
        e.addProperty("borderColor", function () {return "darkgray";});
        e.addChild((function() {
            var e = new Quick.Image("image");
            e.addProperty("width", function () {return this.parent.height;});
            e.addProperty("height", function () {return this.parent.height;});
            e.addProperty("src", function () {return this.parent.modelData.thumbnail;});
            e.addProperty("backgroundSize", function () {return "cover";});
            e.addProperty("backgroundPosition", function () {return "center";});
            return e;
        })());
        e.addChild((function() {
            var e = new Quick.Text();
            e.addProperty("left", function () {return this.image.left + this.image.width + 10;});
            e.addProperty("top", function () {return this.parent.height/2 - this.height/2;});
            e.addProperty("height", function () {return this.textHeight;});
            e.addProperty("text", function () {return this.parent.modelData.name;});
            e.addProperty("color", function () {return "#3C7DC1";});
            e.addProperty("fontSize", function () {return 32;});
            return e;
        })());
        e.addChild((function() {
            var e = new Quick.InputItem();
            e.addEventHandler("onactivated", function () {
            this.parent.parent.parent.showAlbum(this.parent.modelData)
            });
            return e;
        })());
        return e;
    };
    Quick.GridDelegate = function (id, parent) {
        var e = new Quick.Item(id, parent);
        e.addProperty("width", function () {return this.parent.delegateSize;});
        e.addProperty("height", function () {return this.parent.delegateSize;});
        e.addChild((function() {
            var e = new Quick.Image();
            e.addProperty("width", function () {return this.parent.width;});
            e.addProperty("height", function () {return this.parent.height;});
            e.addProperty("src", function () {return this.parent.modelData.thumbnail;});
            e.addProperty("backgroundSize", function () {return "cover";});
            e.addProperty("backgroundPosition", function () {return "center";});
            return e;
        })());
        e.addChild((function() {
            var e = new Quick.InputItem();
            e.addEventHandler("onactivated", function () {
            this.parent.parent.parent.showImage(this.parent.modelData.image)
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
        
        this.fullscreenImage.src = image;
        this.currentView = this.fullscreenImage;
    
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
            var e = new Quick.Item("listView");
            e.addProperty("left", function () {return this.parent.currentView === this ? 0 : -this.width;});
            e.addProperty("width", function () {return this.parent.width;});
            e.addProperty("height", function () {return this.parent.height;});
            e.addProperty("overflow", function () {return "scroll";});
            e.addProperty("delegateSize", function () {return this.width;});
            e.addProperty("delegates", function () {return [];});
            e.addFunction("addDelegate", function (data) {
            
            var delegate = this.createdelegate();
            this.delegates.push(delegate);
            delegate.modelData = data;
            this.addChild(delegate);
            delegate.initializeBindings();
        
            });
            e.addFunction("layout", function () {
            
            var top = 0;

            for (var i = 0; i < this.delegates.length; ++i) {
                var d = this.delegates[i];
                d.top = top;
                top += d.height;
            }
        
            });
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
            var e = new Quick.Item("gridView");
            e.addProperty("overflow", function () {return "scroll";});
            e.addProperty("delegateSize", function () {return this.parent.innerWidth/3;});
            e.addProperty("width", function () {return this.parent.width;});
            e.addProperty("height", function () {return this.parent.height;});
            e.addProperty("left", function () {return this.parent.currentView === this ? 0 : this.width;});
            e.addProperty("delegates", function () {return [];});
            e.addFunction("clear", function () {
            
            this.removeChildren();
            this.delegates = [];
        
            });
            e.addFunction("addDelegate", function (data) {
            
            var delegate = this.createdelegate();
            this.delegates.push(delegate);
            delegate.modelData = data;
            this.addChild(delegate);
            delegate.initializeBindings();
        
            });
            e.addFunction("layout", function () {
            
            var left = 0;
            var top = 0;
            var delegatesPerLine = Math.ceil(this.width / this.delegateSize);

            for (var i = 0; i < this.delegates.length; ++i) {
                var d = this.delegates[i];

                d.left = left;
                d.top = top;

                if ((i+1) % delegatesPerLine) {
                    left += d.width;
                } else {
                    top += d.height;
                    left = 0;
                }
            }
        
            });
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
            e.addProperty("width", function () {return this.parent.innerWidth;});
            e.addProperty("height", function () {return this.parent.innerHeight;});
            e.addProperty("left", function () {return this.parent.currentView === this ? 0 : this.width;});
            e.addProperty("opacity", function () {return this.parent.currentView === this ? 1 : 0;});
            e.addProperty("backgroundColor", function () {return "black";});
            e.addChild((function() {
                var e = new Quick.Image();
                e.addProperty("src", function () {return this.parent.src;});
                e.addProperty("backgroundSize", function () {return "contain";});
                e.addProperty("backgroundPosition", function () {return "center";});
                e.addProperty("background-repeat", function () {return "no-repeat";});
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
            var e = new Quick.InputItem("backButton");
            e.addProperty("backgroundColor", function () {return "#3C7DC1";});
            e.addProperty("width", function () {return this.parent.width;});
            e.addProperty("height", function () {return this.label.textHeight + 10;});
            e.addProperty("top", function () {return this.parent.height - (this.parent.currentView === this.listView ? 0 : this.height);});
            e.addEventHandler("onactivated", function () {
            this.parent.back()
            });
            e.addChild((function() {
                var e = new Quick.Behavior();
                e.addProperty("top", function () {return "250ms";});
                return e;
            })());
            e.addChild((function() {
                var e = new Quick.Text("label");
                e.addProperty("left", function () {return this.parent.width/2 - this.width/2;});
                e.addProperty("top", function () {return this.parent.height/2 - this.height/2;});
                e.addProperty("height", function () {return this.textHeight;});
                e.addProperty("width", function () {return this.textWidth;});
                e.addProperty("text", function () {return "BACK";});
                e.addProperty("color", function () {return "white";});
                e.addProperty("fontSize", function () {return 32;});
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
