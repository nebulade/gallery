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

    Quick.GridDelegate = function (id, parent) {
        var e = new Quick.Item(id, parent);
        e.addProperty("width", function () {return this.parent.delegateSize;});
        e.addProperty("height", function () {return this.parent.delegateSize;});
        e.addChild((function() {
            var e = new Quick.Image();
            e.addProperty("width", function () {return this.parent.width;});
            e.addProperty("height", function () {return this.parent.height;});
            e.addProperty("src", function () {return this.parent.modelData.image;});
            e.addProperty("backgroundSize", function () {return "cover";});
            e.addProperty("backgroundPosition", function () {return "center";});
            return e;
        })());
        return e;
    };
    e.addChild((function() {
        var e = new Quick.Window("window");
        e.addProperty("width", function () {return this.innerWidth;});
        e.addProperty("height", function () {return this.innerHeight;});
        e.addProperty("backgroundColor", function () {return "lightgray";});
        e.addProperty("overlfow", function () {return "hidden";});
        e.addChild((function() {
            var e = new Quick.Item("gridView");
            e.addProperty("overflow", function () {return "scroll";});
            e.addProperty("backgroundColor", function () {return "rgba(0,0,0,0.5)";});
            e.addProperty("delegateSize", function () {return 200;});
            e.addProperty("left", function () {return 10;});
            e.addProperty("top", function () {return 10;});
            e.addProperty("width", function () {return this.parent.width - this.left*2;});
            e.addProperty("height", function () {return this.parent.height - this.top*2;});
            e.addProperty("delegates", function () {return [];});
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
            return e;
        })());
        return e;
    })());
    e.initializeBindings();
    e.render();
    return e;
};
