var draw2d = {geo: {}, io: {json: {}, png: {}, svg: {}}, util: {spline: {}}, shape: {basic: {}, arrow: {}, node: {}, note: {}, diagram: {}, analog: {}, icon: {}, layout: {}, pert: {}, state: {}, widget: {}}, policy: {canvas: {}, line: {}, port: {}, figure: {}}, command: {}, decoration: {connection: {}}, layout: {connection: {}, anchor: {}, mesh: {}, locator: {}}, ui: {}, isTouchDevice: ((navigator.platform.indexOf("iPhone") != -1) || (navigator.platform.indexOf("iPod") != -1) || (navigator.platform.indexOf("iPad") != -1))};
var node = $("#draw2d_script");
console.log(node);
draw2d.util.Color = Class.extend({init: function (red, green, blue) {
    this.hashString = null;
    if (typeof red === "undefined" || red === null) {
        this.hashString = "none";
    } else {
        if (red instanceof draw2d.util.Color) {
            this.red = red.red;
            this.green = red.green;
            this.blue = red.blue;
        } else {
            if (typeof green === "undefined") {
                var rgb = this.hex2rgb(red);
                this.red = rgb[0];
                this.green = rgb[1];
                this.blue = rgb[2];
            } else {
                this.red = red;
                this.green = green;
                this.blue = blue;
            }
        }
    }
}, getHTMLStyle: function () {
    return"rgb(" + this.red + "," + this.green + "," + this.blue + ")";
}, getRed: function () {
    return this.red;
}, getGreen: function () {
    return this.green;
}, getBlue: function () {
    return this.blue;
}, getIdealTextColor: function () {
    var nThreshold = 105;
    var bgDelta = (this.red * 0.299) + (this.green * 0.587) + (this.blue * 0.114);
    return(255 - bgDelta < nThreshold) ? new draw2d.util.Color(0, 0, 0) : new draw2d.util.Color(255, 255, 255);
}, hex2rgb: function (hexcolor) {
    hexcolor = hexcolor.replace("#", "");
    return({0: parseInt(hexcolor.substr(0, 2), 16), 1: parseInt(hexcolor.substr(2, 2), 16), 2: parseInt(hexcolor.substr(4, 2), 16)});
}, hex: function () {
    return(this.int2hex(this.red) + this.int2hex(this.green) + this.int2hex(this.blue));
}, hash: function () {
    if (this.hashString === null) {
        this.hashString = "#" + this.hex();
    }
    return this.hashString;
}, int2hex: function (v) {
    v = Math.round(Math.min(Math.max(0, v), 255));
    return("0123456789ABCDEF".charAt((v - v % 16) / 16) + "0123456789ABCDEF".charAt(v % 16));
}, darker: function (fraction) {
    if (this.hashString === "none") {
        return this;
    }
    var red = parseInt(Math.round(this.getRed() * (1 - fraction)));
    var green = parseInt(Math.round(this.getGreen() * (1 - fraction)));
    var blue = parseInt(Math.round(this.getBlue() * (1 - fraction)));
    if (red < 0) {
        red = 0;
    } else {
        if (red > 255) {
            red = 255;
        }
    }
    if (green < 0) {
        green = 0;
    } else {
        if (green > 255) {
            green = 255;
        }
    }
    if (blue < 0) {
        blue = 0;
    } else {
        if (blue > 255) {
            blue = 255;
        }
    }
    return new draw2d.util.Color(red, green, blue);
}, lighter: function (fraction) {
    if (this.hashString === "none") {
        return this;
    }
    var red = parseInt(Math.round(this.getRed() * (1 + fraction)));
    var green = parseInt(Math.round(this.getGreen() * (1 + fraction)));
    var blue = parseInt(Math.round(this.getBlue() * (1 + fraction)));
    if (red < 0) {
        red = 0;
    } else {
        if (red > 255) {
            red = 255;
        }
    }
    if (green < 0) {
        green = 0;
    } else {
        if (green > 255) {
            green = 255;
        }
    }
    if (blue < 0) {
        blue = 0;
    } else {
        if (blue > 255) {
            blue = 255;
        }
    }
    return new draw2d.util.Color(red, green, blue);
}, fadeTo: function (color, pc) {
    var r = Math.floor(this.red + (pc * (color.red - this.red)) + 0.5);
    var g = Math.floor(this.green + (pc * (color.green - this.green)) + 0.5);
    var b = Math.floor(this.blue + (pc * (color.blue - this.blue)) + 0.5);
    return new draw2d.util.Color(r, g, b);
}});
draw2d.util.ArrayList = Class.extend({init: function (a) {
    this.increment = 10;
    this.size = 0;
    this.data = new Array(this.increment);
    if (typeof a !== "undefined") {
        $.each(a, $.proxy(function (i, e) {
            this.add(e);
        }, this));
    }
}, reverse: function () {
    var newData = new Array(this.size);
    for (var i = 0; i < this.size; i++) {
        newData[i] = this.data[this.size - i - 1];
    }
    this.data = newData;
    return this;
}, getCapacity: function () {
    return this.data.length;
}, getSize: function () {
    return this.size;
}, isEmpty: function () {
    return this.getSize() === 0;
}, getLastElement: function () {
    if (this.data[this.getSize() - 1] !== null) {
        return this.data[this.getSize() - 1];
    }
    return null;
}, asArray: function () {
    this.trimToSize();
    return this.data;
}, getFirstElement: function () {
    if (this.data[0] !== null && typeof this.data[0] !== "undefined") {
        return this.data[0];
    }
    return null;
}, get: function (i) {
    return this.data[i];
}, add: function (obj) {
    if (this.getSize() == this.data.length) {
        this.resize();
    }
    this.data[this.size++] = obj;
    return this;
}, grep: function (func) {
    this.data = $.grep(this.data, func);
    this.data = $.grep(this.data, function (e) {
        return(typeof e !== "undefined");
    });
    this.size = this.data.length;
    return this;
}, addAll: function (list, avoidDuplicates) {
    if (!(list instanceof draw2d.util.ArrayList)) {
        throw"Unable to handle unknown object type in ArrayList.addAll";
    }
    var _this = this;
    if (typeof avoidDuplicates === "undefined" || avoidDuplicates === false) {
        list.each(function (i, e) {
            _this.add(e);
        });
    } else {
        list.each(function (i, e) {
            if (!_this.contains(e)) {
                _this.add(e);
            }
        });
    }
    return this;
}, pop: function () {
    return this.removeElementAt(this.getSize() - 1);
}, push: function (path) {
    this.add(path);
}, remove: function (obj) {
    var index = this.indexOf(obj);
    if (index >= 0) {
        return this.removeElementAt(index);
    }
    return null;
}, insertElementAt: function (obj, index) {
    if (this.size == this.capacity) {
        this.resize();
    }
    for (var i = this.getSize(); i > index; i--) {
        this.data[i] = this.data[i - 1];
    }
    this.data[index] = obj;
    this.size++;
    return this;
}, removeElementAt: function (index) {
    var element = this.data[index];
    for (var i = index; i < (this.size - 1); i++) {
        this.data[i] = this.data[i + 1];
    }
    this.data[this.size - 1] = null;
    this.size--;
    return element;
}, removeAll: function (elements) {
    $.each(elements, $.proxy(function (i, e) {
        this.remove(e);
    }, this));
    return this;
}, indexOf: function (obj) {
    for (var i = 0; i < this.getSize(); i++) {
        if (this.data[i] == obj) {
            return i;
        }
    }
    return -1;
}, contains: function (obj) {
    for (var i = 0; i < this.getSize(); i++) {
        if (this.data[i] == obj) {
            return true;
        }
    }
    return false;
}, resize: function () {
    newData = new Array(this.data.length + this.increment);
    for (var i = 0; i < this.data.length; i++) {
        newData[i] = this.data[i];
    }
    this.data = newData;
    return this;
}, trimToSize: function () {
    if (this.data.length == this.size) {
        return this;
    }
    var temp = new Array(this.getSize());
    for (var i = 0; i < this.getSize(); i++) {
        temp[i] = this.data[i];
    }
    this.size = temp.length;
    this.data = temp;
    return this;
}, sort: function (f) {
    var i, j;
    var currentValue;
    var currentObj;
    var compareObj;
    var compareValue;
    for (i = 1; i < this.getSize(); i++) {
        currentObj = this.data[i];
        currentValue = currentObj[f];
        j = i - 1;
        compareObj = this.data[j];
        compareValue = compareObj[f];
        while (j >= 0 && compareValue > currentValue) {
            this.data[j + 1] = this.data[j];
            j--;
            if (j >= 0) {
                compareObj = this.data[j];
                compareValue = compareObj[f];
            }
        }
        this.data[j + 1] = currentObj;
    }
    return this;
}, clone: function () {
    var newVector = new draw2d.util.ArrayList();
    for (var i = 0; i < this.size; i++) {
        newVector.add(this.data[i]);
    }
    return newVector;
}, each: function (func) {
    for (var i = 0; i < this.size; i++) {
        if (func(i, this.data[i]) === false) {
            break;
        }
    }
}, overwriteElementAt: function (obj, index) {
    this.data[index] = obj;
    return this;
}, getPersistentAttributes: function () {
    return{data: this.data, increment: this.increment, size: this.getSize()};
}, setPersistentAttributes: function (memento) {
    this.data = memento.data;
    this.increment = memento.increment;
    this.size = memento.size;
}});
draw2d.util.ArrayList.EMPTY_LIST = new draw2d.util.ArrayList();
Raphael.fn.polygon = function (pointString) {
    var poly = ["M"], point = pointString.split(" ");
    for (var i = 0; i < point.length; i++) {
        var c = point[i].split(",");
        for (var j = 0; j < c.length; j++) {
            var d = parseFloat(c[j]);
            if (d) {
                poly.push(d);
            }
        }
        if (i == 0) {
            poly.push("L");
        }
    }
    poly.push("Z");
    return this.path(poly);
};
draw2d.util.UUID = function () {
};
draw2d.util.UUID.create = function () {
    var segment = function () {
        return(((1 + Math.random()) * 65536) | 0).toString(16).substring(1);
    };
    return(segment() + segment() + "-" + segment() + "-" + segment() + "-" + segment() + "-" + segment() + segment() + segment());
};
draw2d.util.spline.Spline = Class.extend({NAME: "draw2d.util.spline.Spline", init: function () {
}, generate: function (controlPoints, parts) {
    throw"inherit classes must implement the method 'draw2d.util.spline.Spline.generate()'";
}});
draw2d.util.spline.CubicSpline = draw2d.util.spline.Spline.extend({NAME: "draw2d.util.spline.CubicSpline", init: function () {
    this._super();
}, generate: function (controlPoints, parts) {
    var cp = new draw2d.util.ArrayList();
    cp.add(controlPoints.get(0));
    cp.addAll(controlPoints);
    cp.add(controlPoints.get(controlPoints.getSize() - 1));
    var n = cp.getSize();
    var spline = new draw2d.util.ArrayList();
    spline.add(controlPoints.get(0));
    spline.add(this.p(1, 0, cp));
    for (var i = 1; i < n - 2; i++) {
        for (var j = 1; j <= parts; j++) {
            spline.add(this.p(i, j / parts, cp));
        }
    }
    spline.add(controlPoints.get(controlPoints.getSize() - 1));
    return spline;
}, p: function (i, t, cp) {
    var x = 0;
    var y = 0;
    var k = i - 1;
    for (var j = -2; j <= 1; j++) {
        var b = this.blend(j, t);
        var p = cp.get(k++);
        x += b * p.x;
        y += b * p.y;
    }
    return new draw2d.geo.Point(x, y);
}, blend: function (i, t) {
    if (i === -2) {
        return(((-t + 3) * t - 3) * t + 1) / 6;
    } else {
        if (i === -1) {
            return(((3 * t - 6) * t) * t + 4) / 6;
        } else {
            if (i === 0) {
                return(((-3 * t + 3) * t + 3) * t + 1) / 6;
            }
        }
    }
    return(t * t * t) / 6;
}});
draw2d.util.spline.CatmullRomSpline = draw2d.util.spline.CubicSpline.extend({NAME: "draw2d.util.spline.CatmullRomSpline", init: function () {
    this._super();
}, blend: function (i, t) {
    if (i == -2) {
        return((-t + 2) * t - 1) * t / 2;
    } else {
        if (i == -1) {
            return(((3 * t - 5) * t) * t + 2) / 2;
        } else {
            if (i == 0) {
                return((-3 * t + 4) * t + 1) * t / 2;
            } else {
                return((t - 1) * t * t) / 2;
            }
        }
    }
}});
draw2d.util.spline.BezierSpline = draw2d.util.spline.Spline.extend({NAME: "draw2d.util.spline.BezierSpline", init: function () {
    this._super();
}, generate: function (controlPoints, parts) {
    var n = controlPoints.getSize();
    var spline = new draw2d.util.ArrayList();
    spline.add(this.p(0, 0, controlPoints));
    for (var i = 0; i < n - 3; i += 3) {
        for (var j = 1; j <= parts; j++) {
            spline.add(this.p(i, j / parts, controlPoints));
        }
    }
    return spline;
}, p: function (i, t, cp) {
    var x = 0;
    var y = 0;
    var k = i;
    for (var j = 0; j <= 3; j++) {
        var b = this.blend(j, t);
        var p = cp.get(k++);
        x += b * p.x;
        y += b * p.y;
    }
    return new draw2d.geo.Point(x, y);
}, blend: function (i, t) {
    if (i == 0) {
        return(1 - t) * (1 - t) * (1 - t);
    } else {
        if (i == 1) {
            return 3 * t * (1 - t) * (1 - t);
        } else {
            if (i == 2) {
                return 3 * t * t * (1 - t);
            } else {
                return t * t * t;
            }
        }
    }
}});
draw2d.geo.PositionConstants = function () {
};
draw2d.geo.PositionConstants.NORTH = 1;
draw2d.geo.PositionConstants.SOUTH = 4;
draw2d.geo.PositionConstants.WEST = 8;
draw2d.geo.PositionConstants.EAST = 16;
draw2d.geo.Point = Class.extend({NAME: "draw2d.geo.Point", init: function (x, y) {
    if (x instanceof draw2d.geo.Point) {
        this.x = x.x;
        this.y = x.y;
    } else {
        this.x = x;
        this.y = y;
    }
    this.bx = null;
    this.by = null;
    this.bw = null;
    this.bh = null;
}, setBoundary: function (bx, by, bw, bh) {
    if (bx instanceof draw2d.geo.Rectangle) {
        this.bx = bx.x;
        this.by = bx.y;
        this.bw = bx.w;
        this.bh = bx.h;
    } else {
        this.bx = bx;
        this.by = by;
        this.bw = bw;
        this.bh = bh;
    }
    this.adjustBoundary();
    return this;
}, adjustBoundary: function () {
    if (this.bx === null) {
        return;
    }
    this.x = Math.min(Math.max(this.bx, this.x), this.bw);
    this.y = Math.min(Math.max(this.by, this.y), this.bh);
    return this;
}, translate: function (dx, dy) {
    this.x += dx;
    this.y += dy;
    this.adjustBoundary();
    return this;
}, getX: function () {
    return this.x;
}, getY: function () {
    return this.y;
}, setX: function (x) {
    this.x = x;
    this.adjustBoundary();
    return this;
}, setY: function (y) {
    this.y = y;
    this.adjustBoundary();
    return this;
}, setPosition: function (x, y) {
    if (x instanceof draw2d.geo.Point) {
        this.x = x.x;
        this.y = x.y;
    } else {
        this.x = x;
        this.y = y;
    }
    this.adjustBoundary();
    return this;
}, getPosition: function (p) {
    var dx = p.x - this.x;
    var dy = p.y - this.y;
    if (Math.abs(dx) > Math.abs(dy)) {
        if (dx < 0) {
            return draw2d.geo.PositionConstants.WEST;
        }
        return draw2d.geo.PositionConstants.EAST;
    }
    if (dy < 0) {
        return draw2d.geo.PositionConstants.NORTH;
    }
    return draw2d.geo.PositionConstants.SOUTH;
}, equals: function (p) {
    return this.x === p.x && this.y === p.y;
}, getDistance: function (other) {
    return Math.sqrt((this.x - other.x) * (this.x - other.x) + (this.y - other.y) * (this.y - other.y));
}, length: function () {
    return Math.sqrt(this.x * this.x + this.y * this.y);
}, getTranslated: function (other) {
    return new draw2d.geo.Point(this.x + other.x, this.y + other.y);
}, getScaled: function (factor) {
    return new draw2d.geo.Point(this.x * factor, this.y * factor);
}, getPersistentAttributes: function () {
    return{x: this.x, y: this.y};
}, setPersistentAttributes: function (memento) {
    this.x = memento.x;
    this.y = memento.y;
}, subtract: function (that) {
    return new draw2d.geo.Point(this.x - that.x, this.y - that.y);
}, dot: function (that) {
    return this.x * that.x + this.y * that.y;
}, cross: function (that) {
    return this.x * that.y - this.y * that.x;
}, lerp: function (that, t) {
    return new draw2d.geo.Point(this.x + (that.x - this.x) * t, this.y + (that.y - this.y) * t);
}, clone: function () {
    return new draw2d.geo.Point(this.x, this.y);
}});
draw2d.geo.Rectangle = draw2d.geo.Point.extend({NAME: "draw2d.geo.Rectangle", init: function (x, y, w, h) {
    this._super(x, y);
    this.w = w;
    this.h = h;
}, adjustBoundary: function () {
    if (this.bx === null) {
        return;
    }
    this.x = Math.min(Math.max(this.bx, this.x), this.bw - this.w);
    this.y = Math.min(Math.max(this.by, this.y), this.bh - this.h);
    this.w = Math.min(this.w, this.bw);
    this.h = Math.min(this.h, this.bh);
}, resize: function (dw, dh) {
    this.w += dw;
    this.h += dh;
    this.adjustBoundary();
    return this;
}, scale: function (dw, dh) {
    this.w += (dw);
    this.h += (dh);
    this.x -= (dw / 2);
    this.y -= (dh / 2);
    this.adjustBoundary();
    return this;
}, setBounds: function (rect) {
    this.setPosition(rect.x, rect.y);
    this.w = rect.w;
    this.h = rect.h;
    return this;
}, isEmpty: function () {
    return this.w <= 0 || this.h <= 0;
}, getWidth: function () {
    return this.w;
}, setWidth: function (w) {
    this.w = w;
    this.adjustBoundary();
    return this;
}, getHeight: function () {
    return this.h;
}, setHeight: function (h) {
    this.h = h;
    this.adjustBoundary();
    return this;
}, getLeft: function () {
    return this.x;
}, getRight: function () {
    return this.x + this.w;
}, getTop: function () {
    return this.y;
}, getBottom: function () {
    return this.y + this.h;
}, getTopLeft: function () {
    return new draw2d.geo.Point(this.x, this.y);
}, getTopCenter: function () {
    return new draw2d.geo.Point(this.x + (this.w / 2), this.y);
}, getTopRight: function () {
    return new draw2d.geo.Point(this.x + this.w, this.y);
}, getBottomLeft: function () {
    return new draw2d.geo.Point(this.x, this.y + this.h);
}, getBottomCenter: function () {
    return new draw2d.geo.Point(this.x + (this.w / 2), this.y + this.h);
}, getCenter: function () {
    return new draw2d.geo.Point(this.x + this.w / 2, this.y + this.h / 2);
}, getBottomRight: function () {
    return new draw2d.geo.Point(this.x + this.w, this.y + this.h);
}, getPoints: function () {
    var result = new draw2d.util.ArrayList();
    result.add(this.getTopLeft());
    result.add(this.getTopRight());
    result.add(this.getBottomRight());
    result.add(this.getBottomLeft());
    return result;
}, moveInside: function (rect) {
    var newRect = new draw2d.geo.Rectangle(rect.x, rect.y, rect.w, rect.h);
    newRect.x = Math.max(newRect.x, this.x);
    newRect.y = Math.max(newRect.y, this.y);
    if (newRect.w < this.w) {
        newRect.x = Math.min(newRect.x + newRect.w, this.x + this.w) - newRect.w;
    } else {
        newRect.x = this.x;
    }
    if (newRect.h < this.h) {
        newRect.y = Math.min(newRect.y + newRect.h, this.y + this.h) - newRect.h;
    } else {
        newRect.y = this.y;
    }
    return newRect;
}, getDistance: function (pointOrRectangle) {
    var cx = this.x;
    var cy = this.y;
    var cw = this.w;
    var ch = this.h;
    var ox = pointOrRectangle.getX();
    var oy = pointOrRectangle.getY();
    var ow = 1;
    var oh = 1;
    if (pointOrRectangle instanceof draw2d.geo.Rectangle) {
        ow = pointOrRectangle.getWidth();
        oh = pointOrRectangle.getHeight();
    }
    var oct = 9;
    if (cx + cw <= ox) {
        if ((cy + ch) <= oy) {
            oct = 0;
        } else {
            if (cy >= (oy + oh)) {
                oct = 6;
            } else {
                oct = 7;
            }
        }
    } else {
        if (cx >= ox + ow) {
            if (cy + ch <= oy) {
                oct = 2;
            } else {
                if (cy >= oy + oh) {
                    oct = 4;
                } else {
                    oct = 3;
                }
            }
        } else {
            if (cy + ch <= oy) {
                oct = 1;
            } else {
                if (cy >= oy + oh) {
                    oct = 5;
                } else {
                    return 0;
                }
            }
        }
    }
    switch (oct) {
        case 0:
            cx = (cx + cw) - ox;
            cy = (cy + ch) - oy;
            return -(cx + cy);
        case 1:
            return -((cy + ch) - oy);
        case 2:
            cx = (ox + ow) - cx;
            cy = (cy + ch) - oy;
            return -(cx + cy);
        case 3:
            return -((ox + ow) - cx);
        case 4:
            cx = (ox + ow) - cx;
            cy = (oy + oh) - cy;
            return -(cx + cy);
        case 5:
            return -((oy + oh) - cy);
        case 6:
            cx = (cx + cw) - ox;
            cy = (oy + oh) - cy;
            return -(cx + cy);
        case 7:
            return -((cx + cw) - ox);
    }
    throw"Unknown data type of parameter for distance calculation in draw2d.geo.Rectangle.getDistnace(..)";
}, determineOctant: function (r2) {
    var HISTERESE = 3;
    var ox = this.x + HISTERESE;
    var oy = this.y + HISTERESE;
    var ow = this.w - (HISTERESE * 2);
    var oh = this.h - (HISTERESE * 2);
    var cx = r2.x;
    var cy = r2.y;
    var cw = 2;
    var ch = 2;
    if (r2 instanceof draw2d.geo.Rectangle) {
        cw = r2.w;
        ch = r2.h;
    }
    var oct = 0;
    if (cx + cw <= ox) {
        if ((cy + ch) <= oy) {
            oct = 0;
        } else {
            if (cy >= (oy + oh)) {
                oct = 6;
            } else {
                oct = 7;
            }
        }
    } else {
        if (cx >= ox + ow) {
            if (cy + ch <= oy) {
                oct = 2;
            } else {
                if (cy >= oy + oh) {
                    oct = 4;
                } else {
                    oct = 3;
                }
            }
        } else {
            if (cy + ch <= oy) {
                oct = 1;
            } else {
                if (cy >= oy + oh) {
                    oct = 5;
                } else {
                    oct = 8;
                }
            }
        }
    }
    return oct;
}, getDirection: function (other) {
    var current = this.getTopLeft();
    switch (this.determineOctant(other)) {
        case 0:
            if ((current.x - other.x) < (current.y - other.y)) {
                return 0;
            }
            return 3;
        case 1:
            return 0;
        case 2:
            current = this.getTopRight();
            if ((other.x - current.x) < (current.y - other.y)) {
                return 0;
            }
            return 1;
        case 3:
            return 1;
        case 4:
            current = this.getBottomRight();
            if ((other.x - current.x) < (other.y - current.y)) {
                return 2;
            }
            return 1;
        case 5:
            return 2;
        case 6:
            current = this.getBottomLeft();
            if ((current.x - other.x) < (other.y - current.y)) {
                return 2;
            }
            return 3;
        case 7:
            return 3;
        case 8:
            if (other.y > this.y) {
                return 2;
            }
            return 0;
    }
    return 0;
}, equals: function (o) {
    return this.x == o.x && this.y == o.y && this.w == o.w && this.h == o.h;
}, hitTest: function (iX, iY) {
    if (iX instanceof draw2d.geo.Point) {
        iY = iX.y;
        iX = iX.x;
    }
    var iX2 = this.x + this.getWidth();
    var iY2 = this.y + this.getHeight();
    return(iX >= this.x && iX <= iX2 && iY >= this.y && iY <= iY2);
}, isInside: function (rect) {
    return rect.hitTest(this.getTopLeft()) && rect.hitTest(this.getTopRight()) && rect.hitTest(this.getBottomLeft()) && rect.hitTest(this.getBottomRight());
}, intersects: function (rect) {
    x11 = rect.x, y11 = rect.y, x12 = rect.x + rect.w, y12 = rect.y + rect.h, x21 = this.x, y21 = this.y, x22 = this.x + this.w, y22 = this.y + this.h;
    x_overlap = Math.max(0, Math.min(x12, x22) - Math.max(x11, x21));
    y_overlap = Math.max(0, Math.min(y12, y22) - Math.max(y11, y21));
    return x_overlap * y_overlap !== 0;
}, toJSON: function () {
    return{width: this.w, height: this.h, x: this.x, y: this.y};
}});
draw2d.geo.Ray = draw2d.geo.Point.extend({NAME: "draw2d.geo.Ray", init: function (x, y) {
    this._super(x, y);
}, isHorizontal: function () {
    return this.x != 0;
}, similarity: function (otherRay) {
    return Math.abs(this.dot(otherRay));
}, getAveraged: function (otherRay) {
    return new draw2d.geo.Ray((this.x + otherRay.x) / 2, (this.y + otherRay.y) / 2);
}});
draw2d.command.CommandType = Class.extend({NAME: "draw2d.command.CommandType", init: function (policy) {
    this.policy = policy;
}, getPolicy: function () {
    return this.policy;
}});
draw2d.command.CommandType.DELETE = "DELETE";
draw2d.command.CommandType.MOVE = "MOVE";
draw2d.command.CommandType.CONNECT = "CONNECT";
draw2d.command.CommandType.MOVE_BASEPOINT = "MOVE_BASEPOINT";
draw2d.command.CommandType.MOVE_JUNCTION = "MOVE_JUNCTION";
draw2d.command.CommandType.MOVE_GHOST_JUNCTION = "MOVE_GHOST_JUNCTION";
draw2d.command.CommandType.RESIZE = "RESIZE";
draw2d.command.CommandType.RESET = "RESET";
draw2d.command.Command = Class.extend({NAME: "draw2d.command.Command", init: function (label) {
    this.label = label;
}, getLabel: function () {
    return this.label;
}, canExecute: function () {
    return true;
}, execute: function () {
}, cancel: function () {
}, undo: function () {
}, redo: function () {
}});
draw2d.command.CommandCollection = draw2d.command.Command.extend({NAME: "draw2d.command.CommandCollection", init: function () {
    this._super("Execute Commands");
    this.commands = new draw2d.util.ArrayList();
}, add: function (command) {
    this.commands.add(command);
}, canExecute: function () {
    var canExec = false;
    this.commands.each(function (i, cmd) {
        canExec = canExec || cmd.canExecute();
    });
    return canExec;
}, execute: function () {
    this.commands.each(function (i, cmd) {
        cmd.execute();
    });
}, redo: function () {
    this.commands.each(function (i, cmd) {
        cmd.redo();
    });
}, undo: function () {
    this.commands.reverse();
    this.commands.each(function (i, cmd) {
        cmd.undo();
    });
    this.commands.reverse();
}});
draw2d.command.CommandStack = Class.extend({NAME: "draw2d.command.CommandStack", init: function () {
    this.undostack = [];
    this.redostack = [];
    this.maxundo = 50;
    this.transactionCommand = null;
    this.eventListeners = new draw2d.util.ArrayList();
    window.onpopstate = $.proxy(function (event) {
        if (event.state === null) {
            return;
        }
    }, this);
}, setUndoLimit: function (count) {
    this.maxundo = count;
}, markSaveLocation: function () {
    this.undostack = [];
    this.redostack = [];
    this.notifyListeners(new draw2d.command.Command(), draw2d.command.CommandStack.POST_EXECUTE);
}, execute: function (command) {
    if (command === null) {
        return;
    }
    if (typeof command === "undefined") {
        throw"Missing parameter [command] for method call CommandStack.execute";
    }
    if (command.canExecute() === false) {
        return;
    }
    if (this.transactionCommand !== null) {
        this.transactionCommand.add(command);
        return;
    }
    this.notifyListeners(command, draw2d.command.CommandStack.PRE_EXECUTE);
    this.undostack.push(command);
    command.execute();
    this.redostack = [];
    if (this.undostack.length > this.maxundo) {
        this.undostack = this.undostack.slice(this.undostack.length - this.maxundo);
    }
    this.notifyListeners(command, draw2d.command.CommandStack.POST_EXECUTE);
}, startTransaction: function () {
    this.transactionCommand = new draw2d.command.CommandCollection();
}, commitTransaction: function () {
    if (this.transactionCommand === null) {
        return;
    }
    var cmd = this.transactionCommand;
    this.transactionCommand = null;
    this.execute(cmd);
}, undo: function () {
    var command = this.undostack.pop();
    if (command) {
        this.notifyListeners(command, draw2d.command.CommandStack.PRE_UNDO);
        this.redostack.push(command);
        command.undo();
        this.notifyListeners(command, draw2d.command.CommandStack.POST_UNDO);
    }
}, redo: function () {
    var command = this.redostack.pop();
    if (command) {
        this.notifyListeners(command, draw2d.command.CommandStack.PRE_REDO);
        this.undostack.push(command);
        command.redo();
        this.notifyListeners(command, draw2d.command.CommandStack.POST_REDO);
    }
}, getRedoLabel: function () {
    if (this.redostack.lenght === 0) {
        return"";
    }
    var command = this.redostack[this.redostack.length - 1];
    if (command) {
        return command.getLabel();
    }
    return"";
}, getUndoLabel: function () {
    if (this.undostack.lenght === 0) {
        return"";
    }
    var command = this.undostack[this.undostack.length - 1];
    if (command) {
        return command.getLabel();
    }
    return"";
}, canRedo: function () {
    return this.redostack.length > 0;
}, canUndo: function () {
    return this.undostack.length > 0;
}, addEventListener: function (listener) {
    if (listener instanceof draw2d.command.CommandStackEventListener) {
        this.eventListeners.add(listener);
    } else {
        if (typeof listener.stackChanged === "function") {
            this.eventListeners.add(listener);
        } else {
            if (typeof listener === "function") {
                this.eventListeners.add({stackChanged: listener});
            } else {
                throw"Object doesn't implement required callback interface [draw2d.command.CommandStackListener]";
            }
        }
    }
}, removeEventListener: function (listener) {
    for (var i = 0; i < size; i++) {
        var entry = this.eventListeners.get(i);
        if (entry === listener || entry.stackChanged === listener) {
            this.eventListeners.remove(entry);
            return;
        }
    }
}, notifyListeners: function (command, state) {
    var event = new draw2d.command.CommandStackEvent(this, command, state);
    var size = this.eventListeners.getSize();
    for (var i = 0; i < size; i++) {
        this.eventListeners.get(i).stackChanged(event);
    }
}});
draw2d.command.CommandStack.PRE_EXECUTE = 1;
draw2d.command.CommandStack.PRE_REDO = 2;
draw2d.command.CommandStack.PRE_UNDO = 4;
draw2d.command.CommandStack.POST_EXECUTE = 8;
draw2d.command.CommandStack.POST_REDO = 16;
draw2d.command.CommandStack.POST_UNDO = 32;
draw2d.command.CommandStack.POST_INIT = 64;
draw2d.command.CommandStack.POST_MASK = draw2d.command.CommandStack.POST_EXECUTE | draw2d.command.CommandStack.POST_UNDO | draw2d.command.CommandStack.POST_REDO;
draw2d.command.CommandStack.PRE_MASK = draw2d.command.CommandStack.PRE_EXECUTE | draw2d.command.CommandStack.PRE_UNDO | draw2d.command.CommandStack.PRE_REDO;
draw2d.command.CommandStackEvent = Class.extend({NAME: "draw2d.command.CommandStackEvent", init: function (stack, command, details) {
    this.stack = stack;
    this.command = command;
    this.details = details;
}, getStack: function () {
    return this.stack;
}, getCommand: function () {
    return this.command;
}, getDetails: function () {
    return this.details;
}, isPostChangeEvent: function () {
    return 0 != (this.getDetails() & draw2d.command.CommandStack.POST_MASK);
}, isPreChangeEvent: function () {
    return 0 != (this.getDetails() & draw2d.command.CommandStack.PRE_MASK);
}});
draw2d.command.CommandStackEventListener = Class.extend({NAME: "draw2d.command.CommandStackEventListener", init: function () {
}, stackChanged: function (event) {
}});
draw2d.command.CommandMove = draw2d.command.Command.extend({NAME: "draw2d.command.CommandMove", init: function (figure, x, y) {
    this._super("Shape moved");
    this.figure = figure;
    if (typeof x === "undefined") {
        this.oldX = figure.getX();
        this.oldY = figure.getY();
    } else {
        this.oldX = x;
        this.oldY = y;
    }
}, setStartPosition: function (x, y) {
    this.oldX = x;
    this.oldY = y;
}, setPosition: function (x, y) {
    this.newX = x;
    this.newY = y;
}, canExecute: function () {
    return this.newX != this.oldX || this.newY != this.oldY;
}, execute: function () {
    this.redo();
}, undo: function () {
    this.figure.setPosition(this.oldX, this.oldY);
}, redo: function () {
    this.figure.setPosition(this.newX, this.newY);
}});
draw2d.command.CommandMoveLine = draw2d.command.Command.extend({NAME: "draw2d.command.CommandMoveLine", init: function (figure) {
    this._super("Line moved");
    this.line = figure;
    this.dx = 0;
    this.dy = 0;
}, setTranslation: function (dx, dy) {
    this.dx = dx;
    this.dy = dy;
}, canExecute: function () {
    return this.dx !== 0 && this.dy !== 0;
}, execute: function () {
    this.redo();
}, undo: function () {
    this.line.getPoints().each($.proxy(function (i, e) {
        e.translate(-this.dx, -this.dy);
    }, this));
    this.line.svgPathString = null;
    this.line.repaint();
}, redo: function () {
    this.line.getPoints().each($.proxy(function (i, e) {
        e.translate(this.dx, this.dy);
    }, this));
    this.line.svgPathString = null;
    this.line.repaint();
}});
draw2d.command.CommandMoveJunction = draw2d.command.Command.extend({NAME: "draw2d.command.CommandMoveJunction", init: function (line) {
    this._super("Junction moved");
    this.line = line;
    this.index = -1;
    this.newPoint = null;
}, setIndex: function (index) {
    this.index = index;
    this.origPoint = this.line.getPoints().get(this.index).clone();
}, updatePosition: function (x, y) {
    this.newPoint = new draw2d.geo.Point(x, y);
}, canExecute: function () {
    return this.index !== -1 && this.newPoint !== null;
}, execute: function () {
    this.redo();
}, undo: function () {
    this.line.setJunctionPoint(this.index, this.origPoint.x, this.origPoint.y);
}, redo: function () {
    this.line.setJunctionPoint(this.index, this.newPoint.x, this.newPoint.y);
}});
draw2d.command.CommandResize = draw2d.command.Command.extend({NAME: "draw2d.command.CommandResize", init: function (figure, width, height) {
    this._super("Resize Shape");
    this.figure = figure;
    if (typeof width === "undefined") {
        this.oldWidth = figure.getWidth();
        this.oldHeight = figure.getHeight();
    } else {
        this.oldWidth = width;
        this.oldHeight = height;
    }
}, setDimension: function (width, height) {
    this.newWidth = width | 0;
    this.newHeight = height | 0;
}, canExecute: function () {
    return this.newWidth != this.oldWidth || this.newHeight != this.oldHeight;
}, execute: function () {
    this.redo();
}, undo: function () {
    this.figure.setDimension(this.oldWidth, this.oldHeight);
}, redo: function () {
    this.figure.setDimension(this.newWidth, this.newHeight);
}});
draw2d.command.CommandConnect = draw2d.command.Command.extend({NAME: "draw2d.command.CommandConnect", init: function (canvas, source, target, dropTarget) {
    this._super("Connecting Ports");
    this.canvas = canvas;
    this.source = source;
    this.target = target;
    this.connection = null;
    this.dropTarget = dropTarget;
}, setConnection: function (connection) {
    this.connection = connection;
}, execute: function () {
    var optionalCallback = $.proxy(function (conn) {
        this.connection = conn;
        this.connection.setSource(this.source);
        this.connection.setTarget(this.target);
        this.canvas.addFigure(this.connection);
    }, this);
    if (this.connection === null) {
        var result = draw2d.Connection.createConnection(this.source, this.target, optionalCallback, this.dropTarget);
        if (typeof result === "undefined") {
            return;
        } else {
            this.connection = result;
        }
    }
    optionalCallback(this.connection);
}, redo: function () {
    this.canvas.addFigure(this.connection);
    this.connection.reconnect();
}, undo: function () {
    this.canvas.removeFigure(this.connection);
}});
draw2d.command.CommandReconnect = draw2d.command.Command.extend({NAME: "draw2d.command.CommandReconnect", init: function (con) {
    this._super("Connecting Ports");
    this.con = con;
    this.oldSourcePort = con.getSource();
    this.oldTargetPort = con.getTarget();
    this.oldRouter = con.getRouter();
}, canExecute: function () {
    return true;
}, setNewPorts: function (source, target) {
    this.newSourcePort = source;
    this.newTargetPort = target;
}, execute: function () {
    this.redo();
}, cancel: function () {
    this.con.setSource(this.oldSourcePort);
    this.con.setTarget(this.oldTargetPort);
    this.con.setRouter(this.oldRouter);
}, undo: function () {
    this.con.setSource(this.oldSourcePort);
    this.con.setTarget(this.oldTargetPort);
    this.con.setRouter(this.oldRouter);
}, redo: function () {
    this.con.setSource(this.newSourcePort);
    this.con.setTarget(this.newTargetPort);
    this.con.setRouter(this.oldRouter);
}});
draw2d.command.CommandDelete = draw2d.command.Command.extend({init: function (figure) {
    this._super("Deleting Shape");
    this.parent = figure.getParent();
    this.figure = figure;
    this.canvas = figure.getCanvas();
    this.connections = null;
}, execute: function () {
    this.redo();
}, undo: function () {
    this.canvas.addFigure(this.figure);
    if (this.figure instanceof draw2d.Connection) {
        this.figure.reconnect();
    }
    this.canvas.setCurrentSelection(this.figure);
    if (this.parent !== null) {
        this.parent.addChild(this.figure);
    }
    for (var i = 0; i < this.connections.getSize(); ++i) {
        this.canvas.addFigure(this.connections.get(i));
        this.connections.get(i).reconnect();
    }
}, redo: function () {
    this.canvas.setCurrentSelection(null);
    if (this.figure instanceof draw2d.shape.node.Node && this.connections === null) {
        this.connections = new draw2d.util.ArrayList();
        var ports = this.figure.getPorts();
        for (var i = 0; i < ports.getSize(); i++) {
            var port = ports.get(i);
            for (var c = 0, c_size = port.getConnections().getSize(); c < c_size; c++) {
                if (!this.connections.contains(port.getConnections().get(c))) {
                    this.connections.add(port.getConnections().get(c));
                }
            }
        }
        for (var i = 0; i < ports.getSize(); i++) {
            var port = ports.get(i);
            port.setCanvas(null);
        }
    }
    this.canvas.removeFigure(this.figure);
    if (this.connections === null) {
        this.connections = new draw2d.util.ArrayList();
    }
    if (this.parent !== null) {
        this.parent.removeChild(this.figure);
    }
    for (var i = 0; i < this.connections.getSize(); ++i) {
        this.canvas.removeFigure(this.connections.get(i));
    }
}});
draw2d.command.CommandAdd = draw2d.command.Command.extend({init: function (canvas, figure, x, y) {
    this._super("Add Shape");
    this.figure = figure;
    this.canvas = canvas;
    this.x = x;
    this.y = y;
}, execute: function () {
    this.canvas.addFigure(this.figure, this.x, this.y);
}, redo: function () {
    this.execute();
}, undo: function () {
    this.canvas.removeFigure(this.figure);
}});
draw2d.command.CommandAddJunctionPoint = draw2d.command.Command.extend({NAME: "draw2d.command.CommandAddJunctionPoint", init: function (line, index, x, y) {
    this._super("Junction point add");
    this.line = line;
    this.index = index;
    this.newPoint = new draw2d.geo.Point(x, y);
}, canExecute: function () {
    return true;
}, execute: function () {
    this.redo();
}, undo: function () {
    this.line.removeJunctionPointAt(this.index);
}, redo: function () {
    this.line.insertJunctionPointAt(this.index, this.newPoint.x, this.newPoint.y);
}});
draw2d.command.CommandRemoveJunctionPoint = draw2d.command.Command.extend({NAME: "draw2d.command.CommandRemoveJunctionPoint", init: function (line, index) {
    this._super("Junction point removed");
    this.line = line;
    this.index = index;
    this.oldPoint = line.getPoints().get(index).clone();
}, canExecute: function () {
    return true;
}, execute: function () {
    this.redo();
}, undo: function () {
    this.line.insertJunctionPointAt(this.index, this.oldPoint.x, this.oldPoint.y);
}, redo: function () {
    this.line.removeJunctionPointAt(this.index);
}});
draw2d.layout.connection.ConnectionRouter = Class.extend({NAME: "draw2d.layout.connection.ConnectionRouter", init: function () {
}, route: function (connection, oldJunctionPoints) {
    throw"subclasses must implement the method [ConnectionRouter.route]";
}, onInstall: function (connection) {
}, onUninstall: function (connection) {
}, getPersistentAttributes: function (line, memento) {
    return memento;
}, setPersistentAttributes: function (line, memento) {
}});
draw2d.layout.connection.DirectRouter = draw2d.layout.connection.ConnectionRouter.extend({NAME: "draw2d.layout.connection.DirectRouter", init: function () {
    this._super();
}, invalidate: function () {
}, route: function (connection, oldJunctionPoints) {
    var start = connection.getStartPoint();
    var end = connection.getEndPoint();
    connection.addPoint(start);
    connection.addPoint(end);
    var path = ["M", start.x, " ", start.y];
    path.push("L", end.x, " ", end.y);
    connection.svgPathString = path.join("");
}});
draw2d.layout.connection.JunctionRouter = draw2d.layout.connection.ConnectionRouter.extend({NAME: "draw2d.layout.connection.JunctionRouter", init: function () {
    this._super();
}, invalidate: function () {
}, route: function (connection, oldJunctionPoints) {
    var start = connection.getStartPoint();
    var end = connection.getEndPoint();
    var count = oldJunctionPoints.getSize() - 1;
    connection.addPoint(start);
    for (var i = 1; i < count; i++) {
        connection.addPoint(oldJunctionPoints.get(i));
    }
    connection.addPoint(end);
    var ps = connection.getPoints();
    length = ps.getSize();
    var p = ps.get(0);
    var path = ["M", p.x, " ", p.y];
    for (var i = 1; i < length; i++) {
        p = ps.get(i);
        path.push("L", p.x, " ", p.y);
    }
    connection.svgPathString = path.join("");
}, getPersistentAttributes: function (line, memento) {
    memento.junction = [];
    line.getPoints().each(function (i, e) {
        memento.junction.push({x: e.x, y: e.y});
    });
    return memento;
}, setPersistentAttributes: function (line, memento) {
    if (typeof memento.junction !== "undefined") {
        line.oldPoint = null;
        line.lineSegments = new draw2d.util.ArrayList();
        line.basePoints = new draw2d.util.ArrayList();
        $.each(memento.junction, $.proxy(function (i, e) {
            line.addPoint(e.x, e.y);
        }, this));
    }
}});
draw2d.layout.connection.ManhattanConnectionRouter = draw2d.layout.connection.ConnectionRouter.extend({NAME: "draw2d.layout.connection.ManhattanConnectionRouter", MINDIST: 20, TOL: 0.1, TOLxTOL: 0.01, TOGGLE_DIST: 5, init: function () {
    this._super();
}, route: function (conn, oldJunctionPoints) {
    var fromPt = conn.getStartPoint();
    var fromDir = conn.getSource().getConnectionDirection(conn, conn.getTarget());
    var toPt = conn.getEndPoint();
    var toDir = conn.getTarget().getConnectionDirection(conn, conn.getSource());
    this._route(conn, toPt, toDir, fromPt, fromDir);
    var ps = conn.getPoints();
    var p = ps.get(0);
    var path = ["M", (p.x | 0) + 0.5, " ", (p.y | 0) + 0.5];
    for (var i = 1; i < ps.getSize(); i++) {
        p = ps.get(i);
        path.push("L", (p.x | 0) + 0.5, " ", (p.y | 0) + 0.5);
    }
    conn.svgPathString = path.join("");
}, _route: function (conn, fromPt, fromDir, toPt, toDir) {
    var UP = 0;
    var RIGHT = 1;
    var DOWN = 2;
    var LEFT = 3;
    var xDiff = fromPt.x - toPt.x;
    var yDiff = fromPt.y - toPt.y;
    var point;
    var dir;
    if (((xDiff * xDiff) < (this.TOLxTOL)) && ((yDiff * yDiff) < (this.TOLxTOL))) {
        conn.addPoint(new draw2d.geo.Point(toPt.x, toPt.y));
        return;
    }
    if (fromDir === LEFT) {
        if ((xDiff > 0) && ((yDiff * yDiff) < this.TOL) && (toDir === RIGHT)) {
            point = toPt;
            dir = toDir;
        } else {
            if (xDiff < 0) {
                point = new draw2d.geo.Point(fromPt.x - this.MINDIST, fromPt.y);
            } else {
                if (((yDiff > 0) && (toDir === DOWN)) || ((yDiff < 0) && (toDir === UP))) {
                    point = new draw2d.geo.Point(toPt.x, fromPt.y);
                } else {
                    if (fromDir == toDir) {
                        var pos = Math.min(fromPt.x, toPt.x) - this.MINDIST;
                        point = new draw2d.geo.Point(pos, fromPt.y);
                    } else {
                        point = new draw2d.geo.Point(fromPt.x - (xDiff / 2), fromPt.y);
                    }
                }
            }
            if (yDiff > 0) {
                dir = UP;
            } else {
                dir = DOWN;
            }
        }
    } else {
        if (fromDir === RIGHT) {
            if ((xDiff < 0) && ((yDiff * yDiff) < this.TOL) && (toDir === LEFT)) {
                point = toPt;
                dir = toDir;
            } else {
                if (xDiff > 0) {
                    point = new draw2d.geo.Point(fromPt.x + this.MINDIST, fromPt.y);
                } else {
                    if (((yDiff > 0) && (toDir === DOWN)) || ((yDiff < 0) && (toDir === UP))) {
                        point = new draw2d.geo.Point(toPt.x, fromPt.y);
                    } else {
                        if (fromDir === toDir) {
                            var pos = Math.max(fromPt.x, toPt.x) + this.MINDIST;
                            point = new draw2d.geo.Point(pos, fromPt.y);
                        } else {
                            point = new draw2d.geo.Point(fromPt.x - (xDiff / 2), fromPt.y);
                        }
                    }
                }
                if (yDiff > 0) {
                    dir = UP;
                } else {
                    dir = DOWN;
                }
            }
        } else {
            if (fromDir === DOWN) {
                if (((xDiff * xDiff) < this.TOL) && (yDiff < 0) && (toDir === UP)) {
                    point = toPt;
                    dir = toDir;
                } else {
                    if (yDiff > 0) {
                        point = new draw2d.geo.Point(fromPt.x, fromPt.y + this.MINDIST);
                    } else {
                        if (((xDiff > 0) && (toDir === RIGHT)) || ((xDiff < 0) && (toDir === LEFT))) {
                            point = new draw2d.geo.Point(fromPt.x, toPt.y);
                        } else {
                            if (fromDir === toDir) {
                                var pos = Math.max(fromPt.y, toPt.y) + this.MINDIST;
                                point = new draw2d.geo.Point(fromPt.x, pos);
                            } else {
                                point = new draw2d.geo.Point(fromPt.x, fromPt.y - (yDiff / 2));
                            }
                        }
                    }
                    if (xDiff > 0) {
                        dir = LEFT;
                    } else {
                        dir = RIGHT;
                    }
                }
            } else {
                if (fromDir === UP) {
                    if (((xDiff * xDiff) < this.TOL) && (yDiff > 0) && (toDir === DOWN)) {
                        point = toPt;
                        dir = toDir;
                    } else {
                        if (yDiff < 0) {
                            point = new draw2d.geo.Point(fromPt.x, fromPt.y - this.MINDIST);
                        } else {
                            if (((xDiff > 0) && (toDir === RIGHT)) || ((xDiff < 0) && (toDir === LEFT))) {
                                point = new draw2d.geo.Point(fromPt.x, toPt.y);
                            } else {
                                if (fromDir === toDir) {
                                    var pos = Math.min(fromPt.y, toPt.y) - this.MINDIST;
                                    point = new draw2d.geo.Point(fromPt.x, pos);
                                } else {
                                    point = new draw2d.geo.Point(fromPt.x, fromPt.y - (yDiff / 2));
                                }
                            }
                        }
                        if (xDiff > 0) {
                            dir = LEFT;
                        } else {
                            dir = RIGHT;
                        }
                    }
                }
            }
        }
    }
    this._route(conn, point, dir, toPt, toDir);
    conn.addPoint(fromPt);
}});
draw2d.layout.connection.ManhattanBridgedConnectionRouter = draw2d.layout.connection.ManhattanConnectionRouter.extend({NAME: "draw2d.layout.connection.ManhattanBridgedConnectionRouter", BRIDGE_HORIZONTAL_LR: " r 0 0 3 -4 7 -4 10 0 13 0 ", BRIDGE_HORIZONTAL_RL: " r 0 0 -3 -4 -7 -4 -10 0 -13 0 ", init: function () {
    this._super();
}, route: function (conn, oldJunctionPoints) {
    var fromPt = conn.getStartPoint();
    var fromDir = conn.getSource().getConnectionDirection(conn, conn.getTarget());
    var toPt = conn.getEndPoint();
    var toDir = conn.getTarget().getConnectionDirection(conn, conn.getSource());
    this._route(conn, toPt, toDir, fromPt, fromDir);
    var intersectionsASC = conn.getCanvas().getIntersection(conn).sort("x");
    var intersectionsDESC = intersectionsASC.clone().reverse();
    var intersectionForCalc = intersectionsASC;
    var i = 0;
    var ps = conn.getPoints();
    var p = ps.get(0);
    var path = ["M", (p.x | 0) + 0.5, " ", (p.y | 0) + 0.5];
    var oldP = p;
    for (i = 1; i < ps.getSize(); i++) {
        p = ps.get(i);
        var bridgeWidth = 5;
        var bridgeCode = this.BRIDGE_HORIZONTAL_LR;
        if (oldP.x > p.x) {
            intersectionForCalc = intersectionsDESC;
            bridgeCode = this.BRIDGE_HORIZONTAL_RL;
            bridgeWidth = -bridgeWidth;
        }
        intersectionForCalc.each(function (ii, interP) {
            if (interP.justTouching == false && draw2d.shape.basic.Line.hit(1, oldP.x, oldP.y, p.x, p.y, interP.x, interP.y) === true) {
                if (p.y === interP.y) {
                    path.push(" L", ((interP.x - bridgeWidth) | 0) + 0.5, " ", (interP.y | 0) + 0.5);
                    path.push(bridgeCode);
                }
            }
        });
        path.push(" L", (p.x | 0) + 0.5, " ", (p.y | 0) + 0.5);
        oldP = p;
    }
    conn.svgPathString = path.join("");
}});
draw2d.layout.connection.CircuitConnectionRouter = draw2d.layout.connection.ManhattanConnectionRouter.extend({NAME: "draw2d.layout.connection.CircuitConnectionRouter", init: function () {
    this._super();
    this.setBridgeRadius(4);
    this.setJunctionRadius(2);
    this.abortRoutingOnFirstJunctionNode = false;
}, onInstall: function (connection) {
}, onUninstall: function (connection) {
    if (typeof connection.junctionNodes !== "undefined" && connection.junctionNodes !== null) {
        connection.junctionNodes.remove();
        connection.junctionNodes = null;
    }
}, setJunctionRadius: function (radius) {
    this.junctionRadius = radius;
}, setBridgeRadius: function (radius) {
    this.bridgeRadius = radius;
    this.bridge_LR = [" r", 0.5, -0.5, radius - (radius / 2), -(radius - radius / 4), radius, -radius, radius + (radius / 2), -(radius - radius / 4), radius * 2, "0 "].join(" ");
    this.bridge_RL = [" r", -0.5, -0.5, -(radius - (radius / 2)), -(radius - radius / 4), -radius, -radius, -(radius + (radius / 2)), -(radius - radius / 4), -radius * 2, "0 "].join(" ");
}, route: function (conn, oldJunctionPoints) {
    var fromPt = conn.getStartPoint();
    var fromDir = conn.getSource().getConnectionDirection(conn, conn.getTarget());
    var toPt = conn.getEndPoint();
    var toDir = conn.getTarget().getConnectionDirection(conn, conn.getSource());
    this._route(conn, toPt, toDir, fromPt, fromDir);
    var intersectionsASC = conn.getCanvas().getIntersection(conn).sort("x");
    var intersectionsDESC = intersectionsASC.clone().reverse();
    var intersectionForCalc = intersectionsASC;
    var i = 0;
    if (typeof conn.junctionNodes !== "undefined" && conn.junctionNodes !== null) {
        conn.junctionNodes.remove();
    }
    conn.junctionNodes = conn.canvas.paper.set();
    var ps = conn.getPoints();
    var p = ps.get(0);
    var path = ["M", (p.x | 0) + 0.5, " ", (p.y | 0) + 0.5];
    var oldP = p;
    var bridgeWidth = null;
    var bridgeCode = null;
    var lastJunctionNode = null;
    for (i = 1; i < ps.getSize(); i++) {
        p = ps.get(i);
        if (oldP.x > p.x) {
            intersectionForCalc = intersectionsDESC;
            bridgeCode = this.bridge_RL;
            bridgeWidth = -this.bridgeRadius;
        } else {
            intersectionForCalc = intersectionsASC;
            bridgeCode = this.bridge_LR;
            bridgeWidth = this.bridgeRadius;
        }
        intersectionForCalc.each($.proxy(function (ii, interP) {
            if (draw2d.shape.basic.Line.hit(1, oldP.x, oldP.y, p.x, p.y, interP.x, interP.y) === true) {
                if (conn.sharingPorts(interP.other)) {
                    var other = interP.other;
                    var otherZ = other.getZOrder();
                    var connZ = conn.getZOrder();
                    if (connZ < otherZ) {
                        var junctionNode = conn.canvas.paper.ellipse(interP.x, interP.y, this.junctionRadius, this.junctionRadius).attr({fill: conn.lineColor.hash()});
                        conn.junctionNodes.push(junctionNode);
                        if (this.abortRoutingOnFirstJunctionNode === true) {
                            if (conn.getSource() == other.getSource() || conn.getSource() == other.getTarget()) {
                                path = ["M", (interP.x | 0) + 0.5, " ", (interP.y | 0) + 0.5];
                                if (lastJunctionNode !== null) {
                                    lastJunctionNode.remove();
                                    conn.junctionNodes.exclude(lastJunctionNode);
                                }
                            }
                            lastJunctionNode = junctionNode;
                        }
                    }
                } else {
                    if (p.y === interP.y) {
                        path.push(" L", ((interP.x - bridgeWidth) | 0) + 0.5, " ", (interP.y | 0) + 0.5);
                        path.push(bridgeCode);
                    }
                }
            }
        }, this));
        path.push(" L", (p.x | 0) + 0.5, " ", (p.y | 0) + 0.5);
        oldP = p;
    }
    conn.svgPathString = path.join("");
}});
draw2d.layout.connection.SplineConnectionRouter = draw2d.layout.connection.ManhattanConnectionRouter.extend({NAME: "draw2d.layout.connection.SplineConnectionRouter", init: function () {
    this._super();
    this.spline = new draw2d.util.spline.CubicSpline();
    this.MINDIST = 50, this.cheapRouter = null;
}, route: function (conn, oldJunctionPoints) {
    var i = 0;
    var fromPt = conn.getStartPoint();
    var fromDir = conn.getSource().getConnectionDirection(conn, conn.getTarget());
    var toPt = conn.getEndPoint();
    var toDir = conn.getTarget().getConnectionDirection(conn, conn.getSource());
    this._route(conn, toPt, toDir, fromPt, fromDir);
    var ps = conn.getPoints();
    conn.oldPoint = null;
    conn.lineSegments = new draw2d.util.ArrayList();
    conn.basePoints = new draw2d.util.ArrayList();
    var splinePoints = this.spline.generate(ps, 8);
    splinePoints.each(function (i, e) {
        conn.addPoint(e);
    });
    var ps = conn.getPoints();
    length = ps.getSize();
    var p = ps.get(0);
    var path = ["M", p.x, " ", p.y];
    for (i = 1; i < length; i++) {
        p = ps.get(i);
        path.push("L", p.x, " ", p.y);
    }
    conn.svgPathString = path.join("");
}});
draw2d.layout.connection.FanConnectionRouter = draw2d.layout.connection.DirectRouter.extend({NAME: "draw2d.layout.connection.FanConnectionRouter", init: function () {
    this._super();
}, route: function (conn, oldJunctionPoints) {
    var lines = conn.getSource().getConnections();
    var connections = new draw2d.util.ArrayList();
    var index = 0;
    for (var i = 0; i < lines.getSize(); i++) {
        var figure = lines.get(i);
        if (figure.getTarget() === conn.getTarget() || figure.getSource() === conn.getTarget()) {
            connections.add(figure);
            if (conn === figure) {
                index = connections.getSize();
            }
        }
    }
    if (connections.getSize() > 1) {
        this.routeCollision(conn, index);
    } else {
        this._super(conn);
    }
}, routeCollision: function (conn, index) {
    var start = conn.getStartPoint();
    var end = conn.getEndPoint();
    var separation = 15;
    var midPoint = new draw2d.geo.Point((end.x + start.x) / 2, (end.y + start.y) / 2);
    var position = end.getPosition(start);
    var ray;
    if (position == draw2d.geo.PositionConstants.SOUTH || position == draw2d.geo.PositionConstants.EAST) {
        ray = new draw2d.geo.Point(end.x - start.x, end.y - start.y);
    } else {
        ray = new draw2d.geo.Point(start.x - end.x, start.y - end.y);
    }
    var length = Math.sqrt(ray.x * ray.x + ray.y * ray.y);
    var xSeparation = separation * ray.x / length;
    var ySeparation = separation * ray.y / length;
    var bendPoint;
    if (index % 2 === 0) {
        bendPoint = new draw2d.geo.Point(midPoint.x + (index / 2) * (-1 * ySeparation), midPoint.y + (index / 2) * xSeparation);
    } else {
        bendPoint = new draw2d.geo.Point(midPoint.x + (index / 2) * ySeparation, midPoint.y + (index / 2) * (-1 * xSeparation));
    }
    conn.addPoint(start);
    conn.addPoint(bendPoint);
    conn.addPoint(end);
    var ps = conn.getPoints();
    var p = ps.get(0);
    var path = ["M", p.x, " ", p.y];
    for (var i = 1; i < ps.getSize(); i++) {
        p = ps.get(i);
        path.push("L", p.x, " ", p.y);
    }
    conn.svgPathString = path.join("");
}});
var ROUTER_RECTS = null;
draw2d.layout.connection.MazeConnectionRouter = draw2d.layout.connection.ConnectionRouter.extend({NAME: "draw2d.layout.connection.MazeConnectionRouter", init: function () {
    this._super();
    this.useSpline = false;
    this.useSimplify = true;
    this.useSimplifyValue = 2;
    this.useDebug = false;
    this.useShift = 4;
    // [Modification] modified by disi 13-10-15T09:05
    // [Reason/] bigger portOutletOffset brings longer in/out horizontal line
    // [Original]
    // this.portOutletOffset = 15;
    // [/Original]
    this.portOutletOffset = 24;
    // [/Modification] 13-10-15T09:05
    this.finder = new PF.JumpPointFinder({allowDiagonal: false, dontCrossCorners: true});
}, route: function (conn, oldJunctionPoints) {
    var fromPt = conn.getStartPoint();
    var fromDir = conn.getSource().getConnectionDirection(conn, conn.getTarget());
    var toPt = conn.getEndPoint();
    var toDir = conn.getTarget().getConnectionDirection(conn, conn.getSource());
    this._route(conn, toPt, toDir, fromPt, fromDir);
    var ps = conn.getPoints();
    var p = ps.get(0);
    var path = ["M", (p.x | 0) + 0.5, " ", (p.y | 0) + 0.5];
    for (var i = 1; i < ps.getSize(); i++) {
        p = ps.get(i);
        path.push("L", (p.x | 0) + 0.5, " ", (p.y | 0) + 0.5);
    }
    conn.svgPathString = path.join("");
}, _route: function (conn, fromPt, fromDir, toPt, toDir) {
    var shift = this.useShift;
    oldToPt = toPt;
    oldFromPt = fromPt;
    fromPt = this.getAddjustedPoint(fromPt, fromDir, this.portOutletOffset);
    toPt = this.getAddjustedPoint(toPt, toDir, this.portOutletOffset);
    var grid = this.generateNoGoGrid(conn, fromPt, fromDir, toPt, toDir);
    var path = this.finder.findPath(fromPt.x >> shift, fromPt.y >> shift, toPt.x >> shift, toPt.y >> shift, grid);
    $.each(path, function (i, e) {
        e.x = e[0] = e[0] << shift;
        e.y = e[1] = e[1] << shift;
    });
    if (this.useDebug) {
        if (ROUTER_RECTS !== null) {
            ROUTER_RECTS.remove();
        }
        ROUTER_RECTS = conn.canvas.paper.set();
        for (var i = 0; i < grid.width; i++) {
            for (var j = 0; j < grid.height; j++) {
                if (!grid.isWalkableAt(i, j)) {
                    ROUTER_RECTS.push(conn.canvas.paper.rect(i << shift, j << shift, 1 << shift, 1 << shift).attr({"fill": "red", "opacity": "0.1"}));
                }
            }
        }
        ROUTER_RECTS.push(conn.canvas.paper.rect(fromPt.x - 3, fromPt.y - 3, 6, 6).attr({"fill": "#ff0000", "opacity": "0.8"}));
        ROUTER_RECTS.push(conn.canvas.paper.rect(toPt.x - 3, toPt.y - 3, 6, 6).attr({"fill": "#ff0000", "opacity": "0.8"}));
        $.each(path, function (i, e) {
            ROUTER_RECTS.push(conn.canvas.paper.rect(e.x - 3, e.y - 3, 6, 6).attr({"fill": "#0000ff", "opacity": "0.8"}));
        });
        var p = path[0];
        var svgPathBefore = ["M", p.x, " ", p.y];
        for (var i = 1; i < path.length; i++) {
            p = path[i];
            svgPathBefore.push("L", p.x, " ", p.y);
        }
        svgPathBefore = svgPathBefore.join("");
        ROUTER_RECTS.push(conn.canvas.paper.path(svgPathBefore).attr({"stroke": "#0000ff"}));
    }
    this.adjustPath(fromPt, path, fromDir);
    path.reverse();
    this.adjustPath(toPt, path, toDir);
    path.reverse();
    $.each(path, function (i, e) {
        e.x = e[0];
        e.y = e[1];
    });
    if (this.useSpline) {
        var p = new draw2d.util.ArrayList();
        p.add(oldFromPt);
        $.each(path, function (i, e) {
            p.add(new draw2d.geo.Point(e[0], e[1]));
        });
        p.add(oldToPt);
        if (this.useDebug) {
            $.each(path, function (i, e) {
                ROUTER_RECTS.push(conn.canvas.paper.rect(e.x - 3, e.y - 3, 6, 6).attr({"fill": "#00ff00", "opacity": "0.8"}));
            });
            var pt = path[0];
            var svgPathBefore = ["M", pt.x, " ", pt.y];
            for (var i = 1; i < path.length; i++) {
                pt = path[i];
                svgPathBefore.push("L", pt.x, " ", pt.y);
            }
            svgPathBefore = svgPathBefore.join("");
            ROUTER_RECTS.push(conn.canvas.paper.path(svgPathBefore).attr({"stroke": "#00ff00"}));
        }
        this.spline = new draw2d.util.spline.CubicSpline();
        var splinePoints = this.spline.generate(p, 8);
        if (this.useSimplify) {
            path = [];
            splinePoints.each(function (i, e) {
                path.push({x: e.x, y: e.y});
            });
            path = this.simplify(path, this.useSimplifyValue, true);
            $.each(path, function (i, e) {
                conn.addPoint(e.x, e.y);
            });
        } else {
            splinePoints.each(function (i, e) {
                conn.addPoint(e);
            });
        }
    } else {
        if (this.useSimplify) {
            path = this.simplify(path, this.useSimplifyValue, true);
        }
        if (this.useDebug) {
            $.each(path, function (i, e) {
                ROUTER_RECTS.push(conn.canvas.paper.rect(e.x - 3, e.y - 3, 6, 6).attr({"fill": "#00ff00", "opacity": "0.8"}));
            });
            var p = path[0];
            var svgPathBefore = ["M", p.x, " ", p.y];
            for (var i = 1; i < path.length; i++) {
                p = path[i];
                svgPathBefore.push("L", p.x, " ", p.y);
            }
            svgPathBefore = svgPathBefore.join("");
            ROUTER_RECTS.push(conn.canvas.paper.path(svgPathBefore).attr({"stroke": "#00ff00"}));
        }
        conn.addPoint(oldFromPt);
        $.each(path, function (i, e) {
            conn.addPoint(e[0], e[1]);
        });
        conn.addPoint(oldToPt);
    }
}, generateNoGoGrid: function (conn, fromPt, fromDir, toPt, toDir) {
    var shift = this.useShift;
    var oneShift2 = (1 << shift) / 2;
    var canvasWidth = conn.getCanvas().paper.width >> shift;
    var canvasHeight = conn.getCanvas().paper.height >> shift;
    var grid = new PF.Grid(canvasWidth, canvasHeight);
    var figures = conn.getCanvas().getFigures();
    figures.each(function (i, e) {
        var box = e.getBoundingBox();
        if (box.hitTest(fromPt.x, fromPt.y) === true || box.hitTest(toPt.x, toPt.y)) {
            return;
        }
        var x = box.x >> shift;
        var y = box.y >> shift;
        if (x < 1 || y < 1) {
            return;
        }
        var r_orig = (box.x + box.w + oneShift2) >> shift;
        var b_orig = (box.y + box.h + oneShift2) >> shift;
        for (var i = x; i <= r_orig; i++) {
            for (var j = y; j <= b_orig; j++) {
                grid.setWalkableAt(i, j, false);
            }
        }
    });
    var box = conn.getSource().getParent().getBoundingBox();
    if (toDir === 1 || toDir === 3) {
        var y = box.y >> shift;
        if (y > 0) {
            var b_orig = box.y + box.h;
            var i = (toPt.x >> shift);
            for (var j = y - 1; j << shift <= b_orig; j++) {
                grid.setWalkableAt(i, j, true);
            }
        }
    } else {
        var x = box.x >> shift;
        if (x > 0) {
            var r_orig = box.x + box.w;
            var j = (toPt.x >> shift);
            for (var i = x - 1; i << shift <= r_orig; i++) {
                grid.setWalkableAt(i, j, true);
            }
        }
    }
    box = conn.getTarget().getParent().getBoundingBox();
    if (fromDir === 1 || fromDir === 3) {
        var y = box.y >> shift;
        if (y > 0) {
            var b_orig = box.y + box.h;
            var i = (fromPt.x >> shift);
            for (var j = y - 1; j << shift <= b_orig; j++) {
                grid.setWalkableAt(i, j, true);
            }
        }
    } else {
        var x = box.x >> shift;
        if (x > 0) {
            var r_orig = box.x + box.w;
            var j = (fromPt.x >> shift);
            for (var i = x - 1; i << shift <= r_orig; i++) {
                grid.setWalkableAt(i, j, true);
            }
        }
    }
    return grid;
}, getAddjustedPoint: function (pt, direction, adjustment) {
    switch (direction) {
        case 0:
            return new draw2d.geo.Point(pt.x, pt.y - adjustment);
        case 1:
            return new draw2d.geo.Point(pt.x + adjustment, pt.y);
        case 2:
            return new draw2d.geo.Point(pt.x, pt.y + adjustment);
        case 3:
            return new draw2d.geo.Point(pt.x - adjustment, pt.y);
    }
}, adjustPath: function (pt, path, direction) {
    var shift = this.useShift;
    var x = pt.x >> shift;
    var y = pt.y >> shift;
    $.each(path, function (i, e) {
        if (y === (e[1] >> shift)) {
            e[1] = pt.y;
        } else {
            return false;
        }
    });
    $.each(path, function (i, e) {
        if (x === (e[0] >> shift)) {
            e[0] = pt.x;
        } else {
            return false;
        }
    });
}, getSquareDistance: function (p1, p2) {
    var dx = p1.x - p2.x, dy = p1.y - p2.y;
    return dx * dx + dy * dy;
}, getSquareSegmentDistance: function (p, p1, p2) {
    var x = p1.x, y = p1.y, dx = p2.x - x, dy = p2.y - y, t;
    if (dx !== 0 || dy !== 0) {
        t = ((p.x - x) * dx + (p.y - y) * dy) / (dx * dx + dy * dy);
        if (t > 1) {
            x = p2.x;
            y = p2.y;
        } else {
            if (t > 0) {
                x += dx * t;
                y += dy * t;
            }
        }
    }
    dx = p.x - x;
    dy = p.y - y;
    return dx * dx + dy * dy;
}, simplifyRadialDistance: function (points, sqTolerance) {
    var i, len = points.length, point = null, prevPoint = points[0], newPoints = [prevPoint];
    for (i = 1; i < len; i++) {
        point = points[i];
        if (this.getSquareDistance(point, prevPoint) > sqTolerance) {
            newPoints.push(point);
            prevPoint = point;
        }
    }
    if (prevPoint !== point) {
        newPoints.push(point);
    }
    return newPoints;
}, simplifyDouglasPeucker: function (points, sqTolerance) {
    var len = points.length, MarkerArray = (typeof Uint8Array !== undefined + "") ? Uint8Array : Array, markers = new MarkerArray(len), first = 0, last = len - 1, i, maxSqDist, sqDist, index, firstStack = [], lastStack = [], newPoints = [];
    markers[first] = markers[last] = 1;
    while (last) {
        maxSqDist = 0;
        for (i = first + 1; i < last; i++) {
            sqDist = this.getSquareSegmentDistance(points[i], points[first], points[last]);
            if (sqDist > maxSqDist) {
                index = i;
                maxSqDist = sqDist;
            }
        }
        if (maxSqDist > sqTolerance) {
            markers[index] = 1;
            firstStack.push(first);
            lastStack.push(index);
            firstStack.push(index);
            lastStack.push(last);
        }
        first = firstStack.pop();
        last = lastStack.pop();
    }
    for (i = 0; i < len; i++) {
        if (markers[i]) {
            newPoints.push(points[i]);
        }
    }
    return newPoints;
}, simplify: function (points, tolerance, highestQuality) {
    var sqTolerance = (tolerance !== undefined) ? tolerance * tolerance : 1;
    if (!highestQuality) {
        points = this.simplifyRadialDistance(points, sqTolerance);
    }
    points = this.simplifyDouglasPeucker(points, sqTolerance);
    return points;
}});
draw2d.layout.connection.MuteableManhattanConnectionRouter = draw2d.layout.connection.ManhattanConnectionRouter.extend({NAME: "draw2d.layout.connection.MuteableManhattanConnectionRouter", UP: new draw2d.geo.Ray(0, -1), DOWN: new draw2d.geo.Ray(0, 1), LEFT: new draw2d.geo.Ray(-1, 0), RIGHT: new draw2d.geo.Ray(1, 0), init: function () {
    this._super();
    this.rowsUsed = {};
    this.colsUsed = {};
    this.constraints = {};
    this.reservedInfo = {};
}, route: function (conn, oldJunctionPoints) {
    this.rowsUsed = {};
    this.colsUsed = {};
    this.constraints = {};
    this.reservedInfo = {};
    var canvas = conn.getCanvas();
    var i;
    var startPoint = conn.getStartPoint();
    var endPoint = conn.getEndPoint();
    var start = new draw2d.geo.Ray(startPoint);
    var end = new draw2d.geo.Ray(endPoint);
    var average = new draw2d.geo.Ray((start.x + end.x) / 2, (start.y + end.y) / 2);
    var direction = new draw2d.geo.Ray(end.x - start.x, end.y - start.y);
    var startNormal = this.getStartDirection(conn);
    var endNormal = this.getEndDirection(conn);
    var positions = new draw2d.util.ArrayList();
    var horizontal = startNormal.isHorizontal();
    if (horizontal) {
        positions.add(start.y);
    } else {
        positions.add(start.x);
    }
    horizontal = !horizontal;
    if (startNormal.dot(endNormal) === 0) {
        if ((startNormal.dot(direction) >= 0) && (endNormal.dot(direction) <= 0)) {
        } else {
            if (startNormal.dot(direction) < 0) {
                i = startNormal.similarity(start.getTranslated(startNormal.getScaled(10)));
            } else {
                if (horizontal) {
                    i = average.y;
                } else {
                    i = average.x;
                }
            }
            positions.add(i);
            horizontal = !horizontal;
            if (endNormal.dot(direction) > 0) {
                i = endNormal.similarity(end.getTranslated(endNormal.getScaled(10)));
            } else {
                if (horizontal) {
                    i = average.y;
                } else {
                    i = average.x;
                }
            }
            positions.add(i);
            horizontal = !horizontal;
        }
    } else {
        if (startNormal.dot(endNormal) > 0) {
            if (startNormal.dot(direction) >= 0) {
                i = startNormal.similarity(start.getTranslated(startNormal.getScaled(10)));
            } else {
                i = endNormal.similarity(end.getTranslated(endNormal.getScaled(10)));
            }
            positions.add(i);
            horizontal = !horizontal;
        } else {
            if (startNormal.dot(direction) < 0) {
                i = startNormal.similarity(start.getTranslated(startNormal.getScaled(10)));
                positions.add(i);
                horizontal = !horizontal;
            }
            if (this.isCycle(conn)) {
                if (horizontal) {
                    i = conn.getSource().getParent().getBoundingBox().getTop() - 10;
                } else {
                    i = conn.getSource().getParent().getBoundingBox().getRight() + 10;
                }
            } else {
                if (horizontal) {
                    var j = average.y;
                    var next = endNormal.similarity(end.getTranslated(endNormal.getScaled(10)));
                    var trial = new draw2d.geo.Ray((positions.get(positions.getSize() - 1)), j);
                    var figure = this.findFirstFigureAtStraightLine(canvas, trial, this.LEFT, draw2d.util.ArrayList.EMPTY_LIST);
                    while (figure != null && figure.getBoundingBox().x + figure.getBoundingBox().width > next) {
                        j = figure.getBoundingBox().y + figure.getBoundingBox().height + 5;
                        trial.y = j;
                        figure = this.findFirstFigureAtStraightLine(canvas, trial, this.LEFT, Collections.EMPTY_LIST);
                    }
                    i = j;
                } else {
                    var figure = this.findFirstFigureAtStraightLine(canvas, start, this.RIGHT, this.getExcludingFigures(conn));
                    if (figure == null) {
                        i = average.x;
                    } else {
                        i = Math.min(average.x, start.getTranslated(new draw2d.geo.Ray(3 * (figure.getBoundingBox().x - start.x) / 4, 0)).x);
                        i = Math.max(start.x, i);
                    }
                    i = this.adjust(conn, i);
                }
            }
            positions.add(i);
            horizontal = !horizontal;
        }
    }
    if (horizontal) {
        positions.add(end.y);
    } else {
        positions.add(end.x);
    }
    this.processPositions(start, end, positions, startNormal.isHorizontal(), conn);
    var ps = conn.getPoints();
    var p = ps.get(0);
    var path = ["M", (p.x | 0) + 0.5, " ", (p.y | 0) + 0.5];
    for (var i = 1; i < ps.getSize(); i++) {
        p = ps.get(i);
        path.push("L", (p.x | 0) + 0.5, " ", (p.y | 0) + 0.5);
    }
    conn.svgPathString = path.join("");
}, getColumnNear: function (connection, r, n, x) {
    var min = Math.min(n, x);
    var max = Math.max(n, x);
    if (min > r) {
        max = min;
        min = r - (min - r);
    }
    if (max < r) {
        min = max;
        max = r + (r - max);
    }
    var proximity = 0;
    var direction = -1;
    if (r % 6 != 0) {
        r = r - (r % 6);
    }
    var i;
    while (proximity < r) {
        i = parseInt(r + proximity * direction);
        if (!(i in this.colsUsed)) {
            this.colsUsed[i] = i;
            this.reserveColumn(connection, i);
            return i;
        }
        if (i <= min) {
            return i + 6;
        }
        if (i >= max) {
            return i - 6;
        }
        if (direction === 1) {
            direction = -1;
        } else {
            direction = 1;
            proximity += 6;
        }
    }
    return r;
}, getRowNear: function (connection, r, n, x) {
    var min = Math.min(n, x);
    var max = Math.max(n, x);
    if (min > r) {
        max = min;
        min = r - (min - r);
    }
    if (max < r) {
        min = max;
        max = r + (r - max);
    }
    var proximity = 0;
    var direction = -1;
    if (r % 6 != 0) {
        r = r - (r % 6);
    }
    var i;
    while (proximity < r) {
        i = parseInt(r + proximity * direction);
        if (!(i in this.rowsUsed)) {
            this.rowsUsed[i] = i;
            this.reserveRow(connection, i);
            return i;
        }
        if (i <= min) {
            return i + 6;
        }
        if (i >= max) {
            return i - 6;
        }
        if (direction == 1) {
            direction = -1;
        } else {
            direction = 1;
            proximity += 6;
        }
    }
    return r;
}, getEndDirection: function (conn) {
    var p = conn.getEndPoint();
    var rect = conn.getTarget().getParent().getBoundingBox();
    return this.getDirection(rect, p);
}, getStartDirection: function (conn) {
    var p = conn.getStartPoint();
    var rect = conn.getSource().getParent().getBoundingBox();
    return this.getDirection(rect, p);
}, getDirection: function (r, p) {
    var i = Math.abs(r.y - p.y);
    var distance = Math.abs(r.x - p.x);
    var direction = this.LEFT;
    if (i <= distance) {
        distance = i;
        direction = this.UP;
    }
    i = Math.abs(r.getBottom() - p.y);
    if (i <= distance) {
        distance = i;
        direction = this.DOWN;
    }
    i = Math.abs(r.getRight() - p.x);
    if (i < distance) {
        distance = i;
        direction = this.RIGHT;
    }
    return direction;
}, processPositions: function (start, end, positions, horizontal, conn) {
    this.removeReservedLines(conn);
    var pos = [];
    if (horizontal) {
        pos.push(start.x);
    } else {
        pos.oush(start.y);
    }
    var i;
    for (i = 0; i < positions.getSize(); i++) {
        pos.push(positions.get(i));
    }
    if (horizontal == (positions.getSize() % 2 == 1)) {
        pos.push(end.x);
    } else {
        pos.push(end.y);
    }
    conn.addPoint(new draw2d.geo.Point(start.x, start.y));
    var p;
    var current, prev, min, max;
    var adjust;
    for (i = 2; i < pos.length - 1; i++) {
        horizontal = !horizontal;
        prev = pos[i - 1];
        current = pos[i];
        adjust = (i !== pos.length - 2);
        if (horizontal) {
            if (adjust) {
                min = pos[i - 2];
                max = pos[i + 2];
                pos[i] = current = this.getRowNear(conn, current, min, max);
            }
            p = new draw2d.geo.Point(prev, current);
        } else {
            if (adjust) {
                min = pos[i - 2];
                max = pos[i + 2];
                pos[i] = current = this.getColumnNear(conn, current, min, max);
            }
            p = new draw2d.geo.Point(current, prev);
        }
        conn.addPoint(p);
    }
    conn.addPoint(new draw2d.geo.Point(end.x, end.y));
}, removeReservedLines: function (connection) {
    var rInfo = this.reservedInfo[connection];
    if (typeof rInfo === "undefined" || rInfo === null) {
        return;
    }
    for (var i = 0; i < rInfo.reservedRows.getSize(); i++) {
        delete this.rowsUsed[rInfo.reservedRows.get(i)];
    }
    for (var i = 0; i < rInfo.reservedCols.getSize(); i++) {
        delete this.colsUsed[rInfo.reservedCols.get(i)];
    }
    delete this.reservedInfo[connection];
}, reserveColumn: function (connection, column) {
    var info = this.reservedInfo[connection];
    if (typeof info === "undefined" || info === null) {
        info = {reservedCols: new draw2d.util.ArrayList(), reservedRows: new draw2d.util.ArrayList()};
        this.reservedInfo[connection] = info;
    }
    info.reservedCols.add(column);
}, reserveRow: function (connection, row) {
    var info = this.reservedInfo[connection];
    if (typeof info === "undefined" || info === null) {
        info = {reservedCols: new draw2d.util.ArrayList(), reservedRows: new draw2d.util.ArrayList()};
        this.reservedInfo[connection] = info;
    }
    info.reservedRows.add(row);
}, getConstraint: function (connection) {
    return this.constraints[connection];
}, setConstraint: function (connection, constraint) {
    this.constraints[connection] = constraint;
}, isCycle: function (conn) {
    var source = conn.getSource().getParent();
    var target = conn.getTarget().getParent();
    return source.id === target.id;
}, getExcludingFigures: function (conn) {
    var excluding = new draw2d.util.ArrayList();
    excluding.add(conn.getSource().getParent());
    excluding.add(conn.getTarget().getParent());
    return excluding;
}, findFirstFigureAtStraightLine: function (canvas, start, direction, excluding) {
    var figure = null;
    var figures = canvas.getFigures();
    figures.each($.proxy(function (i, child) {
        try {
            if (!excluding.contains(child)) {
                var rect = child.getBoundingBox();
                if (this.LEFT.equals(direction)) {
                    if (start.x > rect.x && start.y >= rect.y && start.y <= rect.y + rect.h) {
                        if (figure === null || rect.x > figure.getBoundingBox().x) {
                            figure = child;
                        }
                    }
                } else {
                    if (this.RIGHT.equals(direction)) {
                        if (start.x < rect.x + rect.w && start.y >= rect.y && start.y <= rect.y + rect.h) {
                            if (figure == null || rect.x < figure.getBoundingBox().x) {
                                figure = child;
                            }
                        }
                    } else {
                        if (this.UP.equals(direction)) {
                            if (start.y > rect.y && start.x >= rect.x && start.x <= rect.x + rect.w) {
                                if (figure === null || rect.y > figure.getBoundingBox().y) {
                                    figure = child;
                                }
                            }
                        } else {
                            if (this.DOWN.equals(direction)) {
                                if (start.y < rect.y + rect.h && start.x >= rect.x && start.x <= rect.x + rect.w) {
                                    if (figure === null || rect.y < figure.getBoundingBox().y) {
                                        figure = child;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        } catch (exc) {
            console.log(exc);
        }
    }, this));
    return figure;
}, adjust: function (connection, col) {
    var column = col;
    var start = connection.getSource().getPosition();
    var connections = connection.getCanvas().getLines();
    connections.each(function (i, conn) {
        try {
            if (conn === connection) {
                return;
            }
            var end = conn.getTarget().getPosition();
            if (start.x < end.x && start.y == end.y) {
                if (conn.getPoints().getMidpoint().x <= col) {
                    column = conn.getPoints().getMidpoint().x - 5;
                }
            }
        } catch (exc) {
            console.log(exc);
        }
    });
    return column;
}});
draw2d.layout.connection.SketchConnectionRouter = draw2d.layout.connection.MazeConnectionRouter.extend({NAME: "draw2d.layout.connection.SketchConnectionRouter", init: function () {
    this._super();
    this.useSpline = true;
    this.useShift = 5;
    this.useSimplifyValue = 0.2;
    this.finder = new PF.JumpPointFinder({allowDiagonal: false, dontCrossCorners: true});
}});
draw2d.layout.mesh.MeshLayouter = Class.extend({init: function () {
}, add: function (canvas, figure) {
    return new draw2d.util.ArrayList();
}});
draw2d.layout.mesh.ExplodeLayouter = draw2d.layout.mesh.MeshLayouter.extend({MIN_MARGIN: 40, init: function () {
}, add: function (canvas, figureToAdd) {
    var changes = [];
    changes[0] = {x: 0, y: 0};
    changes[1] = {x: 0, y: 0};
    changes[2] = {x: 0, y: 0};
    changes[3] = {x: 0, y: 0};
    changes[4] = {x: 0, y: 0};
    changes[5] = {x: 0, y: 0};
    changes[6] = {x: 0, y: 0};
    changes[7] = {x: 0, y: 0};
    changes[8] = {x: 0, y: 0};
    var boundingBox = figureToAdd.getBoundingBox();
    var figures = canvas.getFigures();
    var figure = null;
    var dis = 0;
    var oct = 0;
    var currentOctChanges = null;
    var i = 0;
    for (i = 0; i < figures.getSize(); i++) {
        figure = figures.get(i);
        if (figure !== figureToAdd) {
            dis = figure.getBoundingBox().getDistance(boundingBox);
            if (dis < this.MIN_MARGIN) {
                oct = this.determineOctant(boundingBox, figure.getBoundingBox());
                switch (oct) {
                    case 2:
                        changes[2].x = Math.max(changes[2].x, this.MIN_MARGIN - dis);
                        changes[3].x = Math.max(changes[3].x, this.MIN_MARGIN - dis);
                        changes[4].x = Math.max(changes[4].x, this.MIN_MARGIN - dis);
                        break;
                    case 3:
                        changes[2].x = Math.max(changes[2].x, this.MIN_MARGIN - dis);
                        changes[3].x = Math.max(changes[3].x, this.MIN_MARGIN - dis);
                        changes[4].x = Math.max(changes[4].x, this.MIN_MARGIN - dis);
                        break;
                    case 4:
                        changes[2].x = Math.max(changes[2].x, this.MIN_MARGIN - dis);
                        changes[3].x = Math.max(changes[3].x, this.MIN_MARGIN - dis);
                        changes[4].x = Math.max(changes[4].x, this.MIN_MARGIN - dis);
                        changes[4].y = Math.max(changes[4].y, this.MIN_MARGIN - dis);
                        changes[5].y = Math.max(changes[5].y, this.MIN_MARGIN - dis);
                        changes[6].y = Math.max(changes[6].y, this.MIN_MARGIN - dis);
                        break;
                    case 5:
                        changes[4].y = Math.max(changes[4].y, this.MIN_MARGIN - dis);
                        changes[5].y = Math.max(changes[5].y, this.MIN_MARGIN - dis);
                        changes[6].y = Math.max(changes[6].y, this.MIN_MARGIN - dis);
                        break;
                    case 6:
                        changes[4].y = Math.max(changes[4].y, this.MIN_MARGIN - dis);
                        changes[5].y = Math.max(changes[5].y, this.MIN_MARGIN - dis);
                        changes[6].y = Math.max(changes[6].y, this.MIN_MARGIN - dis);
                        break;
                    case 8:
                        dis = (boundingBox.getBottomRight().getDistance(figure.getBoundingBox().getTopLeft())) | 0;
                        changes[2].x = Math.max(changes[2].x, this.MIN_MARGIN + dis);
                        changes[3].x = Math.max(changes[3].x, this.MIN_MARGIN + dis);
                        changes[4].x = Math.max(changes[4].x, this.MIN_MARGIN + dis);
                        changes[4].y = Math.max(changes[4].y, this.MIN_MARGIN + dis);
                        changes[5].y = Math.max(changes[5].y, this.MIN_MARGIN + dis);
                        changes[6].y = Math.max(changes[6].y, this.MIN_MARGIN + dis);
                        changes[8].x = Math.max(changes[8].x, this.MIN_MARGIN + dis);
                }
            }
        }
    }
    var result = new draw2d.util.ArrayList();
    for (i = 0; i < figures.getSize(); i++) {
        figure = figures.get(i);
        if (figure !== figureToAdd) {
            oct = this.determineOctant(boundingBox, figure.getBoundingBox());
            currentOctChanges = changes[oct];
            if (currentOctChanges.x !== 0 || currentOctChanges.y !== 0) {
                result.add(new draw2d.layout.mesh.ProposedMeshChange(figure, currentOctChanges.x, currentOctChanges.y));
            }
        }
    }
    return result;
}, determineOctant: function (r1, r2) {
    var ox = r1.x;
    var oy = r1.y;
    var ow = r1.w;
    var oh = r1.h;
    var cx = r2.x;
    var cy = r2.y;
    var cw = r2.w;
    var ch = r2.h;
    var oct = 0;
    if (cx + cw <= ox) {
        if ((cy + ch) <= oy) {
            oct = 0;
        } else {
            if (cy >= (oy + oh)) {
                oct = 6;
            } else {
                oct = 7;
            }
        }
    } else {
        if (cx >= ox + ow) {
            if (cy + ch <= oy) {
                oct = 2;
            } else {
                if (cy >= oy + oh) {
                    oct = 4;
                } else {
                    oct = 3;
                }
            }
        } else {
            if (cy + ch <= oy) {
                oct = 1;
            } else {
                if (cy >= oy + oh) {
                    oct = 5;
                } else {
                    oct = 8;
                }
            }
        }
    }
    return oct;
}});
draw2d.layout.mesh.ProposedMeshChange = Class.extend({init: function (figure, x, y) {
    this.figure = figure;
    this.x = x;
    this.y = y;
}, getFigure: function () {
    return this.figure;
}, getX: function () {
    return this.x;
}, getY: function () {
    return this.y;
}});
draw2d.layout.locator.Locator = Class.extend({NAME: "draw2d.layout.locator.Locator", init: function (parentShape) {
    this.parent = parentShape;
}, getParent: function () {
    return this.parent;
}, setParent: function (parentShape) {
    this.parent = parentShape;
}, relocate: function (index, figure) {
}});
draw2d.layout.locator.PortLocator = draw2d.layout.locator.Locator.extend({NAME: "draw2d.layout.locator.PortLocator", init: function () {
    this._super();
}, applyConsiderRotation: function (port, x, y) {
    var parent = port.getParent();
    var halfW = parent.getWidth() / 2;
    var halfH = parent.getHeight() / 2;
    var rotAngle = parent.getRotationAngle();
    var m = Raphael.matrix();
    m.rotate(rotAngle, halfW, halfH);
    if (rotAngle === 90 || rotAngle === 270) {
        var ratio = parent.getHeight() / parent.getWidth();
        m.scale(ratio, 1 / ratio, halfW, halfH);
    }
    port.setPosition(m.x(x, y), m.y(x, y));
}});
draw2d.layout.locator.InputPortLocator = draw2d.layout.locator.PortLocator.extend({NAME: "draw2d.layout.locator.InputPortLocator", init: function () {
    this._super();
}, relocate: function (index, figure) {
    var node = figure.getParent();
    var h = node.getHeight();
    var gap = h / (node.getInputPorts().getSize() + 1);
    this.applyConsiderRotation(figure, 0, gap * (index + 1));
}});
draw2d.layout.locator.OutputPortLocator = draw2d.layout.locator.PortLocator.extend({NAME: "draw2d.layout.locator.OutputPortLocator", init: function () {
    this._super();
}, relocate: function (index, figure) {
    var node = figure.getParent();
    var gap = node.getHeight() / (node.getOutputPorts().getSize() + 1);
    this.applyConsiderRotation(figure, node.getWidth(), gap * (index + 1));
}});
draw2d.layout.locator.ConnectionLocator = draw2d.layout.locator.Locator.extend({NAME: "draw2d.layout.locator.ConnectionLocator", init: function (parentShape) {
    this._super(parentShape);
}});
draw2d.layout.locator.ManhattanMidpointLocator = draw2d.layout.locator.ConnectionLocator.extend({NAME: "draw2d.layout.locator.ManhattanMidpointLocator", init: function (c) {
    this._super(c);
}, relocate: function (index, target) {
    var conn = this.getParent();
    var points = conn.getPoints();
    var segmentIndex = Math.floor((points.getSize() - 2) / 2);
    if (points.getSize() <= segmentIndex + 1) {
        return;
    }
    var p1 = points.get(segmentIndex);
    var p2 = points.get(segmentIndex + 1);
    var x = ((p2.x - p1.x) / 2 + p1.x - target.getWidth() / 2) | 0;
    var y = ((p2.y - p1.y) / 2 + p1.y - target.getHeight() / 2) | 0;
    target.setPosition(x, y);
}});
draw2d.layout.locator.PolylineMidpointLocator = draw2d.layout.locator.ManhattanMidpointLocator.extend({NAME: "draw2d.layout.locator.PolylineMidpointLocator", init: function (c) {
    this._super(c);
}, relocate: function (index, target) {
    var conn = this.getParent();
    var points = conn.getPoints();
    if (points.getSize() % 2 === 0) {
        this._super(index, target);
    } else {
        var index = Math.floor(points.getSize() / 2);
        var p1 = points.get(index);
        target.setPosition(p1.x - (target.getWidth() / 2), p1.y - (target.getHeight() / 2));
    }
}});
draw2d.layout.locator.TopLocator = draw2d.layout.locator.Locator.extend({NAME: "draw2d.layout.locator.TopLocator", init: function (parent) {
    this._super(parent);
}, relocate: function (index, target) {
    var parent = this.getParent();
    var boundingBox = parent.getBoundingBox();
    var targetBoundingBox = target.getBoundingBox();
    if (target instanceof draw2d.Port) {
        target.setPosition(boundingBox.w / 2, 2);
    } else {
        target.setPosition(boundingBox.w / 2 - (targetBoundingBox.w / 2), -(targetBoundingBox.h + 2));
    }
}});
draw2d.layout.locator.BottomLocator = draw2d.layout.locator.Locator.extend({NAME: "draw2d.layout.locator.BottomLocator", init: function (parent) {
    this._super(parent);
}, relocate: function (index, target) {
    var parent = this.getParent();
    var boundingBox = parent.getBoundingBox();
    var targetBoundingBox = target.getBoundingBox();
    if (target instanceof draw2d.Port) {
        target.setPosition(boundingBox.w / 2, boundingBox.h - 2);
    } else {
        target.setPosition(boundingBox.w / 2 - targetBoundingBox.w / 2, 2 + boundingBox.h);
    }
}});
draw2d.layout.locator.LeftLocator = draw2d.layout.locator.Locator.extend({NAME: "draw2d.layout.locator.LeftLocator", init: function (parent) {
    this._super(parent);
}, relocate: function (index, target) {
    var parent = this.getParent();
    var boundingBox = parent.getBoundingBox();
    var targetBoundingBox = target.getBoundingBox();
    target.setPosition(-targetBoundingBox.w - 5, (boundingBox.h / 2) - (targetBoundingBox.h / 2));
}});
draw2d.layout.locator.RightLocator = draw2d.layout.locator.Locator.extend({NAME: "draw2d.layout.locator.RightLocator", init: function (parent) {
    this._super(parent);
}, relocate: function (index, target) {
    var parent = this.getParent();
    var boundingBox = parent.getBoundingBox();
    var targetBoundingBox = target.getBoundingBox();
    target.setPosition(boundingBox.w + 5, (boundingBox.h / 2) - (targetBoundingBox.h / 2));
}});
draw2d.layout.locator.CenterLocator = draw2d.layout.locator.Locator.extend({NAME: "draw2d.layout.locator.CenterLocator", init: function (parent) {
    this._super(parent);
}, relocate: function (index, target) {
    var parent = this.getParent();
    var boundingBox = parent.getBoundingBox();
    if (target instanceof draw2d.Port) {
        target.setPosition(boundingBox.w / 2, boundingBox.h / 2);
    } else {
        var targetBoundingBox = target.getBoundingBox();
        target.setPosition(boundingBox.w / 2 - targetBoundingBox.w / 2, boundingBox.h / 2 - (targetBoundingBox.h / 2));
    }
}});
draw2d.policy.EditPolicy = Class.extend({NAME: "draw2d.policy.EditPolicy", init: function () {
}, onInstall: function (host) {
}, onUninstall: function (host) {
}});
draw2d.policy.canvas.CanvasPolicy = draw2d.policy.EditPolicy.extend({NAME: "draw2d.policy.canvas.CanvasPolicy", init: function () {
    this._super();
}, onInstall: function (canvas) {
}, onUninstall: function (canvas) {
}, onClick: function (figure, mousePosition) {
}, onMouseMove: function (canvas, x, y) {
}, snap: function (canvas, figure, clientPos) {
    return clientPos;
}, onMouseDown: function (canvas, x, y) {
}, onMouseDrag: function (canvas, dx, dy, dx2, dy2) {
}, onMouseUp: function (figure, x, y) {
}});
draw2d.policy.canvas.SelectionPolicy = draw2d.policy.canvas.CanvasPolicy.extend({NAME: "draw2d.policy.canvas.SelectionPolicy", init: function () {
    this._super();
}, unselect: function (canvas, figure) {
    figure.unselect();
    canvas.getSelection().remove(figure);
}});
draw2d.policy.canvas.SingleSelectionPolicy = draw2d.policy.canvas.SelectionPolicy.extend({NAME: "draw2d.policy.canvas.SingleSelectionPolicy", init: function () {
    this._super();
    this.mouseMovedDuringMouseDown = false;
    this.mouseDraggingElement = null;
    this.mouseDownElement = null;
}, select: function (canvas, figure) {
    if (canvas.getSelection().getAll().contains(figure)) {
        return;
    }
    if (canvas.getSelection().getPrimary() !== null) {
        this.unselect(canvas, canvas.getSelection().getPrimary());
    }
    if (figure !== null) {
        figure.select(true);
    }
    canvas.getSelection().setPrimary(figure);
    canvas.selectionListeners.each(function (i, w) {
        w.onSelectionChanged(figure);
    });
}, onMouseDown: function (canvas, x, y) {
    this.mouseMovedDuringMouseDown = false;
    var canDragStart = true;
    var figure = canvas.getBestFigure(x, y);
    while ((figure !== null && figure.getParent() !== null) && !(figure instanceof draw2d.Port)) {
        figure = figure.getParent();
    }
    if (figure !== null && figure.isDraggable()) {
        canDragStart = figure.onDragStart(x - figure.getAbsoluteX(), y - figure.getAbsoluteY());
        if (canDragStart === false) {
            this.mouseDraggingElement = null;
            this.mouseDownElement = figure;
        } else {
            this.mouseDraggingElement = figure;
            this.mouseDownElement = figure;
        }
    }
    if (figure !== canvas.getSelection().getPrimary() && figure !== null && figure.isSelectable() === true) {
        this.select(canvas, figure);
        if (figure instanceof draw2d.shape.basic.Line) {
            if (!(figure instanceof draw2d.Connection)) {
                canvas.draggingLineCommand = figure.createCommand(new draw2d.command.CommandType(draw2d.command.CommandType.MOVE));
                if (canvas.draggingLineCommand !== null) {
                    canvas.draggingLine = figure;
                }
            }
        } else {
            if (canDragStart === false) {
                figure.unselect();
            }
        }
    }
}, onMouseDrag: function (canvas, dx, dy, dx2, dy2) {
    this.mouseMovedDuringMouseDown = true;
    if (this.mouseDraggingElement !== null) {
        if (canvas.linesToRepaintAfterDragDrop.isEmpty() === true && (this.mouseDraggingElement instanceof draw2d.shape.node.Node)) {
            var nodeConnections = this.mouseDraggingElement.getConnections();
            var newLineIntersections = canvas.lineIntersections.clone();
            canvas.lineIntersections.each($.proxy(function (i, inter) {
                if (nodeConnections.contains(inter.line) || nodeConnections.contains(inter.other)) {
                    newLineIntersections.remove(inter);
                    canvas.linesToRepaintAfterDragDrop.add(inter.line);
                    canvas.linesToRepaintAfterDragDrop.add(inter.other);
                }
            }, this));
            canvas.lineIntersections = newLineIntersections;
            canvas.linesToRepaintAfterDragDrop.each(function (i, line) {
                line.svgPathString = null;
                line.repaint();
            });
        }
        var sel = canvas.getSelection().getAll();
        if (!sel.contains(this.mouseDraggingElement)) {
            this.mouseDraggingElement.onDrag(dx, dy, dx2, dy2);
        } else {
            sel.each(function (i, figure) {
                figure.onDrag(dx, dy, dx2, dy2);
            });
        }
        var p = canvas.fromDocumentToCanvasCoordinate(canvas.mouseDownX + (dx / canvas.zoomFactor), canvas.mouseDownY + (dy / canvas.zoomFactor));
        var target = canvas.getBestFigure(p.x, p.y, this.mouseDraggingElement);
        if (target !== canvas.currentDropTarget) {
            if (canvas.currentDropTarget !== null) {
                canvas.currentDropTarget.onDragLeave(this.mouseDraggingElement);
                canvas.currentDropTarget = null;
            }
            if (target !== null) {
                canvas.currentDropTarget = target.onDragEnter(this.mouseDraggingElement);
            }
        }
    } else {
        if (this.mouseDownElement !== null && !(this.mouseDownElement instanceof draw2d.Connection)) {
            this.mouseDownElement.onPanning(dx, dy, dx2, dy2);
        }
    }
}, onMouseUp: function (canvas, x, y) {
    if (this.mouseDraggingElement !== null) {
        var sel = canvas.getSelection().getAll();
        if (!sel.contains(this.mouseDraggingElement)) {
            this.mouseDraggingElement.onDragEnd();
        } else {
            canvas.getCommandStack().startTransaction();
            canvas.getSelection().getAll().each(function (i, figure) {
                figure.onDragEnd();
            });
            canvas.getCommandStack().commitTransaction();
        }
        if (canvas.currentDropTarget !== null) {
            this.mouseDraggingElement.onDrop(canvas.currentDropTarget);
            canvas.currentDropTarget.onDragLeave(this.mouseDraggingElement);
            canvas.currentDropTarget = null;
        }
        this.mouseDraggingElement = null;
    }
    if (this.mouseDownElement === null && this.mouseMovedDuringMouseDown === false) {
        this.select(canvas, null);
    }
    this.mouseDownElement = null;
    this.mouseMovedDuringMouseDown = false;
}});
draw2d.policy.canvas.PanningSelectionPolicy = draw2d.policy.canvas.SingleSelectionPolicy.extend({NAME: "draw2d.policy.canvas.PanningSelectionPolicy", init: function () {
    this._super();
}, onMouseDrag: function (canvas, dx, dy, dx2, dy2) {
    this._super(canvas, dx, dy, dx2, dy2);
    if (this.mouseDraggingElement === null && this.mouseDownElement === null) {
        var area = canvas.getScrollArea();
        area.scrollTop(area.scrollTop() + dy2);
        area.scrollLeft(area.scrollLeft() + dx2);
    }
}});
draw2d.policy.canvas.BoundingboxSelectionPolicy = draw2d.policy.canvas.SingleSelectionPolicy.extend({NAME: "draw2d.policy.canvas.BoundingboxSelectionPolicy", init: function () {
    this._super();
    this.boundingBoxFigure1 = null;
    this.boundingBoxFigure2 = null;
    this.x = 0;
    this.y = 0;
}, select: function (canvas, figure) {
    if (canvas.getSelection().getAll().contains(figure)) {
        return;
    }
    if (figure !== null) {
        figure.select(true);
    }
    canvas.getSelection().setPrimary(figure);
    canvas.selectionListeners.each(function (i, w) {
        w.onSelectionChanged(figure);
    });
}, onMouseDown: function (canvas, x, y) {
    this.x = x;
    this.y = y;
    var currentSelection = canvas.getSelection().getAll();
    this._super(canvas, x, y);
    if (this.mouseDownElement !== null && this.mouseDownElement.isResizeHandle === false && !currentSelection.contains(this.mouseDownElement)) {
        currentSelection.each($.proxy(function (i, figure) {
            this.unselect(canvas, figure);
        }, this));
    }
    currentSelection = canvas.getSelection().getAll();
    currentSelection.each($.proxy(function (i, figure) {
        var canDragStart = figure.onDragStart(figure.getAbsoluteX(), figure.getAbsoluteY());
        if (figure instanceof draw2d.shape.basic.Line) {
        } else {
            if (canDragStart === false) {
                this.unselect(canvas, figure);
            }
        }
    }, this));
}, onMouseDrag: function (canvas, dx, dy, dx2, dy2) {
    this._super(canvas, dx, dy, dx2, dy2);
    if (this.mouseDraggingElement === null && this.mouseDownElement === null && this.boundingBoxFigure1 === null) {
        this.boundingBoxFigure1 = new draw2d.shape.basic.Rectangle(1, 1);
        this.boundingBoxFigure1.setPosition(this.x, this.y);
        this.boundingBoxFigure1.setCanvas(canvas);
        this.boundingBoxFigure1.setBackgroundColor("#0f0f0f");
        this.boundingBoxFigure1.setAlpha(0.1);
        this.boundingBoxFigure2 = new draw2d.shape.basic.Rectangle(1, 1);
        this.boundingBoxFigure2.setPosition(this.x, this.y);
        this.boundingBoxFigure2.setCanvas(canvas);
        this.boundingBoxFigure2.setDashArray("- ");
        this.boundingBoxFigure2.setStroke(1);
        this.boundingBoxFigure2.setColor(new draw2d.util.Color(84, 151, 220));
        this.boundingBoxFigure2.setBackgroundColor(null);
    }
    if (this.boundingBoxFigure1 !== null) {
        this.boundingBoxFigure1.setDimension(Math.abs(dx), Math.abs(dy));
        this.boundingBoxFigure1.setPosition(this.x + Math.min(0, dx), this.y + Math.min(0, dy));
        this.boundingBoxFigure2.setDimension(Math.abs(dx), Math.abs(dy));
        this.boundingBoxFigure2.setPosition(this.x + Math.min(0, dx), this.y + Math.min(0, dy));
    }
}, onMouseUp: function (canvas, x, y) {
    if (this.mouseDownElement === null) {
        canvas.getSelection().getAll().each($.proxy(function (i, figure) {
            this.unselect(canvas, figure);
        }, this));
    } else {
        if (this.mouseDownElement instanceof draw2d.ResizeHandle || (this.mouseDownElement instanceof draw2d.shape.basic.LineResizeHandle)) {
        } else {
            if (this.mouseDownElement !== null && this.mouseMovedDuringMouseDown === false) {
                var sel = canvas.getSelection().getAll();
                if (!sel.contains(this.mouseDownElement)) {
                    canvas.getSelection().getAll().each($.proxy(function (i, figure) {
                        this.unselect(canvas, figure);
                    }, this));
                }
            }
        }
    }
    this._super(canvas, x, y);
    if (this.boundingBoxFigure1 !== null) {
        var selectionRect = this.boundingBoxFigure1.getBoundingBox();
        canvas.getFigures().each($.proxy(function (i, figure) {
            if (figure.getBoundingBox().isInside(selectionRect)) {
                var canDragStart = figure.onDragStart(figure.getAbsoluteX(), figure.getAbsoluteY());
                if (canDragStart === true) {
                    this.select(canvas, figure, false);
                }
            }
        }, this));
        var selection = canvas.getSelection();
        canvas.getLines().each($.proxy(function (i, line) {
            if (line instanceof draw2d.Connection) {
                if (selection.contains(line.getSource().getParent()) && selection.contains(line.getTarget().getParent())) {
                    this.select(canvas, line, false);
                }
            }
        }, this));
        this.boundingBoxFigure1.setCanvas(null);
        this.boundingBoxFigure1 = null;
        this.boundingBoxFigure2.setCanvas(null);
        this.boundingBoxFigure2 = null;
    }
}});

draw2d.policy.canvas.ReadOnlySelectionPolicy = draw2d.policy.canvas.SelectionPolicy.extend({NAME: "draw2d.policy.canvas.ReadOnlySelectionPolicy", init: function () {
    this._super();
}, onInstall: function (canvas) {
    canvas.getAllPorts().each($.proxy(function (i, port) {
        port.setVisible(false);
    }, this));
}, onUninstall: function (canvas) {
    canvas.getAllPorts().each($.proxy(function (i, port) {
        port.setVisible(true);
    }, this));
}, onMouseDrag: function (canvas, dx, dy, dx2, dy2) {
    var area = canvas.getScrollArea();
    area.scrollTop(area.scrollTop() + dy2);
    area.scrollLeft(area.scrollLeft() + dx2);
}});
draw2d.policy.canvas.DecorationPolicy = draw2d.policy.canvas.CanvasPolicy.extend({NAME: "draw2d.policy.canvas.DecorationPolicy", init: function () {
    this._super();
}});
draw2d.policy.canvas.FadeoutDecorationPolicy = draw2d.policy.canvas.DecorationPolicy.extend({NAME: "draw2d.policy.canvas.FadeoutDecorationPolicy", DEFAULT_FADEOUT_DURATION: 30, TARGET_COLOR: new draw2d.util.Color("#707070"), init: function () {
    this._super();
    this.alpha = 1;
    this.hidePortsCounter = this.DEFAULT_FADEOUT_DURATION;
    this.canvas = null;
}, onInstall: function (canvas) {
    this.canvas = canvas;
    this.timerId = window.setInterval($.proxy(this.onTimer, this), 100);
    this.hidePortsCounter = 1;
    this.alpha = 0.1;
}, onUninstall: function (canvas) {
    window.clearInterval(this.timerId);
    this.canvas.getAllPorts().each($.proxy(function (i, port) {
        port.setAlpha(1);
    }, this));
}, onTimer: function () {
    this.hidePortsCounter--;
    if (this.hidePortsCounter <= 0 && this.alpha > 0) {
        this.alpha = Math.max(0, this.alpha - 0.05);
        this.canvas.getAllPorts().each($.proxy(function (i, port) {
            port.setAlpha(this.alpha);
        }, this));
        this.canvas.getSelection().getAll().each($.proxy(function (i, figure) {
            figure.selectionHandles.each($.proxy(function (i, handle) {
                handle.setAlpha(this.alpha);
            }, this));
        }, this));
    } else {
        if (this.hidePortsCounter > 0 && this.alpha !== 1) {
            this.alpha = 1;
            this.duringHide = false;
            this.canvas.getAllPorts().each($.proxy(function (i, port) {
                port.setAlpha(this.alpha);
            }, this));
            this.canvas.getSelection().getAll().each($.proxy(function (i, figure) {
                figure.selectionHandles.each($.proxy(function (i, handle) {
                    handle.setAlpha(this.alpha);
                }, this));
            }, this));
        }
    }
}, onMouseDown: function (canvas, x, y) {
    this.hidePortsCounter = this.DEFAULT_FADEOUT_DURATION;
}, onMouseMove: function (canvas, x, y) {
    this.hidePortsCounter = this.DEFAULT_FADEOUT_DURATION;
}, onMouseDrag: function (canvas, dx, dy, dx2, dy2) {
    this.hidePortsCounter = this.DEFAULT_FADEOUT_DURATION;
}, onMouseUp: function (figure, x, y) {
    this.hidePortsCounter = this.DEFAULT_FADEOUT_DURATION;
}});
draw2d.policy.canvas.CoronaDecorationPolicy = draw2d.policy.canvas.DecorationPolicy.extend({NAME: "draw2d.policy.canvas.CoronaDecorationPolicy", init: function () {
    this._super();
    this.startDragX = 0;
    this.startDragY = 0;
}, onInstall: function (canvas) {
    var figures = canvas.getFigures();
    figures.each(function (i, figure) {
        figure.getPorts().each(function (i, p) {
            p.setVisible(false);
        });
    });
}, onUninstall: function (canvas) {
    var figures = canvas.getFigures();
    figures.each(function (i, figure) {
        figure.getPorts().each(function (i, p) {
            p.setVisible(true);
        });
    });
}, onMouseDown: function (canvas, x, y) {
    this.startDragX = x;
    this.startDragY = y;
}, onMouseMove: function (canvas, x, y) {
    this.updatePorts(canvas, x, y);
}, onMouseDrag: function (canvas, dx, dy, dx2, dy2) {
    this.updatePorts(canvas, this.startDragX + dx, this.startDragY + dy);
}, updatePorts: function (canvas, x, y) {
    var figures = canvas.getFigures();
    figures.each(function (i, figure) {
        if (figure.isVisible() === true && figure.hitTest(x, y, 50) === true && figure instanceof draw2d.shape.node.Node) {
            figure.getPorts().each(function (i, p) {
                p.setVisible(true);
            });
        } else {
            figure.getPorts().each(function (i, p) {
                p.setVisible(false);
            });
        }
    });
}});
draw2d.policy.canvas.SnapToEditPolicy = draw2d.policy.canvas.CanvasPolicy.extend({NAME: "draw2d.policy.canvas.SnapToEditPolicy", init: function (grid) {
    this._super();
    this.grid = grid;
}, snap: function (canvas, figure, clientPos) {
    return clientPos;
}});
draw2d.policy.canvas.SnapToGridEditPolicy = draw2d.policy.canvas.SnapToEditPolicy.extend({NAME: "draw2d.policy.canvas.SnapToGridEditPolicy", GRID_COLOR: "#e0e0f0", GRID_WIDTH: 10, init: function (grid) {
    this._super();
    this.canvas = null;
    this.lines = null;
    if (grid) {
        this.grid = grid;
    } else {
        this.grid = this.GRID_WIDTH;
    }
}, onInstall: function (canvas) {
    this.canvas = canvas;
    this.showGrid();
}, onUninstall: function (canvas) {
    this.canvas = null;
    this.lines.remove();
}, snap: function (canvas, figure, pos) {
    var snapPoint = figure.getSnapToGridAnchor();
    pos.x = pos.x + snapPoint.x;
    pos.y = pos.y + snapPoint.y;
    pos.x = this.grid * Math.floor(((pos.x + this.grid / 2) / this.grid));
    pos.y = this.grid * Math.floor(((pos.y + this.grid / 2) / this.grid));
    pos.x = pos.x - snapPoint.x;
    pos.y = pos.y - snapPoint.y;
    return pos;
}, showGrid: function () {
    var w = this.canvas.initialWidth;
    var h = this.canvas.initialHeight;
    this.lines = this.canvas.paper.set();
    for (var x = this.grid; x < w; x += this.grid) {
        this.lines.push(this.canvas.paper.path("M " + x + " 0 l 0 " + h));
    }
    for (var y = this.grid; y < h; y += this.grid) {
        this.lines.push(this.canvas.paper.path("M 0 " + y + " l " + w + " 0"));
    }
    this.lines.attr({"stroke": this.GRID_COLOR});
    this.lines.toBack();
}});
draw2d.policy.canvas.ShowGridEditPolicy = draw2d.policy.canvas.SnapToEditPolicy.extend({NAME: "draw2d.policy.canvas.ShowGridEditPolicy", GRID_COLOR: "#e0e0f0", GRID_WIDTH: 10, init: function (grid) {
    this._super();
    this.canvas = null;
    this.lines = null;
    if (grid) {
        this.grid = grid;
    } else {
        this.grid = this.GRID_WIDTH;
    }
}, onInstall: function (canvas) {
    this.canvas = canvas;
    this.showGrid();
}, onUninstall: function (canvas) {
    this.canvas = null;
    this.lines.remove();
}, snap: function (canvas, figure, pos) {
    return pos;
}, showGrid: function () {
    var w = this.canvas.initialWidth;
    var h = this.canvas.initialHeight;
    this.lines = this.canvas.paper.set();
    for (var x = this.grid; x < w; x += this.grid) {
        this.lines.push(this.canvas.paper.path("M " + x + " 0 l 0 " + h));
    }
    for (var y = this.grid; y < h; y += this.grid) {
        this.lines.push(this.canvas.paper.path("M 0 " + y + " l " + w + " 0"));
    }
    this.lines.attr({"stroke": this.GRID_COLOR});
    this.lines.toBack();
}});
draw2d.SnapToHelper = {};
draw2d.SnapToHelper.NORTH = 1;
draw2d.SnapToHelper.SOUTH = 4;
draw2d.SnapToHelper.WEST = 8;
draw2d.SnapToHelper.EAST = 16;
draw2d.SnapToHelper.CENTER = 32;
draw2d.SnapToHelper.NORTH_EAST = draw2d.SnapToHelper.NORTH | draw2d.SnapToHelper.EAST;
draw2d.SnapToHelper.NORTH_WEST = draw2d.SnapToHelper.NORTH | draw2d.SnapToHelper.WEST;
draw2d.SnapToHelper.SOUTH_EAST = draw2d.SnapToHelper.SOUTH | draw2d.SnapToHelper.EAST;
draw2d.SnapToHelper.SOUTH_WEST = draw2d.SnapToHelper.SOUTH | draw2d.SnapToHelper.WEST;
draw2d.SnapToHelper.NORTH_SOUTH = draw2d.SnapToHelper.NORTH | draw2d.SnapToHelper.SOUTH;
draw2d.SnapToHelper.EAST_WEST = draw2d.SnapToHelper.EAST | draw2d.SnapToHelper.WEST;
draw2d.SnapToHelper.NSEW = draw2d.SnapToHelper.NORTH_SOUTH | draw2d.SnapToHelper.EAST_WEST;
draw2d.policy.canvas.SnapToGeometryEditPolicy = draw2d.policy.canvas.SnapToEditPolicy.extend({
    NAME: "draw2d.policy.canvas.SnapToGeometryEditPolicy",
    // [Modification] modified by disi 13-08-11T20:45
    // [Reason] bigger SNAP_THRESHOLD is better for usage
    // [Original]:
    // SNAP_THRESHOLD: 3,
    // [End of Original]
    SNAP_THRESHOLD: 5,
    // [End of Modification] modified by disi 13-08-11T20:45
    LINE_COLOR: "#1387E6", FADEOUT_DURATION: 300, init: function () {
    this._super();
    this.rows = null;
    this.cols = null;
    this.vline = null;
    this.hline = null;
    this.canvas = null;
}, onInstall: function (canvas) {
    this.canvas = canvas;
}, onUninstall: function (canvas) {
    this.canvas = null;
}, onMouseUp: function (figure, x, y) {
    this.rows = null;
    this.cols = null;
    this.hideVerticalLine();
    this.hideHorizontalLine();
}, snap: function (canvas, figure, pos) {
    if (figure instanceof draw2d.ResizeHandle) {
        var snapPoint = figure.getSnapToGridAnchor();
        pos.x += snapPoint.x;
        pos.y += snapPoint.y;
        var result = new draw2d.geo.Point(pos.x, pos.y);
        var snapDirections = figure.getSnapToDirection();
        var direction = this.snapPoint(snapDirections, pos, result);
        if ((snapDirections & draw2d.SnapToHelper.EAST_WEST) && !(direction & draw2d.SnapToHelper.EAST_WEST)) {
            this.showVerticalLine(result.x);
        } else {
            this.hideVerticalLine();
        }
        if ((snapDirections & draw2d.SnapToHelper.NORTH_SOUTH) && !(direction & draw2d.SnapToHelper.NORTH_SOUTH)) {
            this.showHorizontalLine(result.y);
        } else {
            this.hideHorizontalLine();
        }
        result.x -= snapPoint.x;
        result.y -= snapPoint.y;
        return result;
    } else {
        var inputBounds = new draw2d.geo.Rectangle(pos.x, pos.y, figure.getWidth(), figure.getHeight());
        var result = new draw2d.geo.Rectangle(pos.x, pos.y, figure.getWidth(), figure.getHeight());
        var snapDirections = draw2d.SnapToHelper.NSEW;
        var direction = this.snapRectangle(inputBounds, result);
        if ((snapDirections & draw2d.SnapToHelper.WEST) && !(direction & draw2d.SnapToHelper.WEST)) {
            this.showVerticalLine(result.x);
        } else {
            if ((snapDirections & draw2d.SnapToHelper.EAST) && !(direction & draw2d.SnapToHelper.EAST)) {
                this.showVerticalLine(result.getX() + result.getWidth());
            } else {
                this.hideVerticalLine();
            }
        }
        if ((snapDirections & draw2d.SnapToHelper.NORTH) && !(direction & draw2d.SnapToHelper.NORTH)) {
            this.showHorizontalLine(result.y);
        } else {
            if ((snapDirections & draw2d.SnapToHelper.SOUTH) && !(direction & draw2d.SnapToHelper.SOUTH)) {
                this.showHorizontalLine(result.getY() + result.getHeight());
            } else {
                this.hideHorizontalLine();
            }
        }
        return result.getTopLeft();
    }
    return pos;
}, snapRectangle: function (inputBounds, resultBounds) {
    var topLeftResult = inputBounds.getTopLeft();
    var bottomRightResult = inputBounds.getBottomRight();
    var snapDirectionsTopLeft = this.snapPoint(draw2d.SnapToHelper.NORTH_WEST, inputBounds.getTopLeft(), topLeftResult);
    resultBounds.x = topLeftResult.x;
    resultBounds.y = topLeftResult.y;
    var snapDirectionsBottomRight = this.snapPoint(draw2d.SnapToHelper.SOUTH_EAST, inputBounds.getBottomRight(), bottomRightResult);
    if (snapDirectionsTopLeft & draw2d.SnapToHelper.WEST) {
        resultBounds.x = bottomRightResult.x - inputBounds.getWidth();
    }
    if (snapDirectionsTopLeft & draw2d.SnapToHelper.NORTH) {
        resultBounds.y = bottomRightResult.y - inputBounds.getHeight();
    }
    return snapDirectionsTopLeft | snapDirectionsBottomRight;
}, snapPoint: function (snapOrientation, inputPoint, resultPoint) {
    if (this.rows === null || this.cols === null) {
        this.populateRowsAndCols();
    }
    if ((snapOrientation & draw2d.SnapToHelper.EAST) !== 0) {
        var rightCorrection = this.getCorrectionFor(this.cols, inputPoint.getX() - 1, 1);
        if (rightCorrection !== this.SNAP_THRESHOLD) {
            snapOrientation &= ~draw2d.SnapToHelper.EAST;
            resultPoint.x += rightCorrection;
        }
    }
    if ((snapOrientation & draw2d.SnapToHelper.WEST) !== 0) {
        var leftCorrection = this.getCorrectionFor(this.cols, inputPoint.getX(), -1);
        if (leftCorrection !== this.SNAP_THRESHOLD) {
            snapOrientation &= ~draw2d.SnapToHelper.WEST;
            resultPoint.x += leftCorrection;
        }
    }
    if ((snapOrientation & draw2d.SnapToHelper.SOUTH) !== 0) {
        var bottomCorrection = this.getCorrectionFor(this.rows, inputPoint.getY() - 1, 1);
        if (bottomCorrection !== this.SNAP_THRESHOLD) {
            snapOrientation &= ~draw2d.SnapToHelper.SOUTH;
            resultPoint.y += bottomCorrection;
        }
    }
    if ((snapOrientation & draw2d.SnapToHelper.NORTH) !== 0) {
        var topCorrection = this.getCorrectionFor(this.rows, inputPoint.getY(), -1);
        if (topCorrection !== this.SNAP_THRESHOLD) {
            snapOrientation &= ~draw2d.SnapToHelper.NORTH;
            resultPoint.y += topCorrection;
        }
    }
    return snapOrientation;
}, populateRowsAndCols: function () {
    var selection = this.canvas.getSelection();
    this.rows = [];
    this.cols = [];
    var figures = this.canvas.getFigures();
    var index = 0;
    for (var i = 0; i < figures.getSize(); i++) {
        var figure = figures.get(i);
        if (!selection.contains(figure)) {
            var bounds = figure.getBoundingBox();
            this.cols[index * 3] = {type: -1, location: bounds.getX()};
            this.rows[index * 3] = {type: -1, location: bounds.getY()};
            this.cols[index * 3 + 1] = {type: 0, location: bounds.x + (bounds.getWidth() - 1) / 2};
            this.rows[index * 3 + 1] = {type: 0, location: bounds.y + (bounds.getHeight() - 1) / 2};
            this.cols[index * 3 + 2] = {type: 1, location: bounds.getRight() - 1};
            this.rows[index * 3 + 2] = {type: 1, location: bounds.getBottom() - 1};
            index++;
        }
    }
}, getCorrectionFor: function (entries, value, side) {
    var resultMag = this.SNAP_THRESHOLD;
    var result = this.SNAP_THRESHOLD;
    for (var i = 0; i < entries.length; i++) {
        var entry = entries[i];
        var magnitude;
        if (entry.type === -1 && side !== 0) {
            magnitude = Math.abs(value - entry.location);
            if (magnitude < resultMag) {
                resultMag = magnitude;
                result = entry.location - value;
            }
        } else {
            if (entry.type === 0 && side === 0) {
                magnitude = Math.abs(value - entry.location);
                if (magnitude < resultMag) {
                    resultMag = magnitude;
                    result = entry.location - value;
                }
            } else {
                if (entry.type === 1 && side !== 0) {
                    magnitude = Math.abs(value - entry.location);
                    if (magnitude < resultMag) {
                        resultMag = magnitude;
                        result = entry.location - value;
                    }
                }
            }
        }
    }
    return result;
}, showVerticalLine: function (x) {
    if (this.vline != null) {
        return;
    }
    this.vline = this.canvas.paper.path("M " + x + " 0 l 0 " + this.canvas.getHeight()).attr({"stroke": this.LINE_COLOR, "stroke-width": 1});
}, hideVerticalLine: function () {
    if (this.vline == null) {
        return;
    }
    var tmp = this.vline;
    tmp.animate({opacity: 0.1}, this.FADEOUT_DURATION, function () {
        tmp.remove();
    });
    this.vline = null;
}, showHorizontalLine: function (y) {
    if (this.hline != null) {
        return;
    }
    this.hline = this.canvas.paper.path("M 0 " + y + " l " + this.canvas.getWidth() + " 0").attr({"stroke": this.LINE_COLOR, "stroke-width": 1});
}, hideHorizontalLine: function () {
    if (this.hline == null) {
        return;
    }
    var tmp = this.hline;
    tmp.animate({opacity: 0.1}, this.FADEOUT_DURATION, function () {
        tmp.remove();
    });
    this.hline = null;
}});
draw2d.policy.figure.DragDropEditPolicy = draw2d.policy.EditPolicy.extend({NAME: "draw2d.policy.figure.DragDropEditPolicy", init: function () {
    this._super();
}, onDragStart: function (canvas, figure) {
    figure.shape.attr({cursor: "move"});
    figure.isMoving = false;
    figure.originalAlpha = figure.getAlpha();
}, onDrag: function (canvas, figure) {
    if (figure.isMoving === false) {
        figure.isMoving = true;
        figure.setAlpha(figure.originalAlpha * 0.4);
    }
}, onDragEnd: function (canvas, figure) {
    figure.shape.attr({cursor: "default"});
    figure.isMoving = false;
}, adjustPosition: function (figure, x, y) {
    if (x instanceof draw2d.geo.Point) {
        return x;
    }
    return new draw2d.geo.Point(x, y);
}, adjustDimension: function (figure, w, h) {
    return new draw2d.geo.Rectangle(0, 0, w, h);
}, moved: function (canvas, figure) {
}});
draw2d.policy.figure.RegionEditPolicy = draw2d.policy.figure.DragDropEditPolicy.extend({NAME: "draw2d.policy.figure.RegionEditPolicy", init: function (x, y, w, h) {
    this._super();
    if (x instanceof draw2d.geo.Rectangle) {
        this.constRect = x;
    } else {
        if (typeof h === "number") {
            this.constRect = new draw2d.geo.Rectangle(x, y, w, h);
        } else {
            throw"Invalid parameter. RegionConstraintPolicy need a rectangle as parameter in the constructor";
        }
    }
}, adjustPosition: function (figure, x, y) {
    var r = null;
    if (x instanceof draw2d.geo.Point) {
        r = new draw2d.geo.Rectangle(x.x, x.y, figure.getWidth(), figure.getHeight());
    } else {
        r = new draw2d.geo.Rectangle(x, y, figure.getWidth(), figure.getHeight());
    }
    r = this.constRect.moveInside(r);
    return r.getTopLeft();
}});
draw2d.policy.figure.HorizontalEditPolicy = draw2d.policy.figure.DragDropEditPolicy.extend({NAME: "draw2d.policy.figure.HorizontalEditPolicy", init: function () {
    this._super();
}, adjustPosition: function (figure, x, y) {
    return new draw2d.geo.Point(x, figure.getY());
}});
draw2d.policy.figure.VerticalEditPolicy = draw2d.policy.figure.DragDropEditPolicy.extend({NAME: "draw2d.policy.figure.VerticalEditPolicy", init: function () {
    this._super();
}, adjustPosition: function (figure, x, y) {
    return new draw2d.geo.Point(figure.getX(), y);
}});
draw2d.policy.figure.SelectionFeedbackPolicy = draw2d.policy.figure.DragDropEditPolicy.extend({NAME: "draw2d.policy.figure.SelectionFeedbackPolicy", init: function () {
    this._super();
}, onSelect: function (canvas, figure, isPrimarySelection) {
}, onUnselect: function (canvas, figure) {
    figure.selectionHandles.each(function (i, e) {
        e.hide();
    });
    figure.selectionHandles = new draw2d.util.ArrayList();
}});
draw2d.policy.figure.RectangleSelectionFeedbackPolicy = draw2d.policy.figure.SelectionFeedbackPolicy.extend({NAME: "draw2d.policy.figure.RectangleSelectionFeedbackPolicy", init: function () {
    this._super();
}, onSelect: function (canvas, figure, isPrimarySelection) {
    if (figure.selectionHandles.isEmpty()) {
        var box = new draw2d.shape.basic.Rectangle();
        box.setBackgroundColor(null);
        box.setDashArray("- ");
        box.setColor("#2096fc");
        box.setStroke(0.5);
        box.hide = function () {
            box.setCanvas(null);
        };
        box.show = function (canvas) {
            box.setCanvas(canvas);
            box.shape.toFront();
        };
        box.show(canvas);
        var r1 = new draw2d.ResizeHandle(figure, 1);
        var r2 = new draw2d.ResizeHandle(figure, 2);
        var r3 = new draw2d.ResizeHandle(figure, 3);
        var r4 = new draw2d.ResizeHandle(figure, 4);
        var r5 = new draw2d.ResizeHandle(figure, 5);
        var r6 = new draw2d.ResizeHandle(figure, 6);
        var r7 = new draw2d.ResizeHandle(figure, 7);
        var r8 = new draw2d.ResizeHandle(figure, 8);
        figure.selectionHandles.add(r1);
        figure.selectionHandles.add(r2);
        figure.selectionHandles.add(r3);
        figure.selectionHandles.add(r4);
        figure.selectionHandles.add(r5);
        figure.selectionHandles.add(r6);
        figure.selectionHandles.add(r7);
        figure.selectionHandles.add(r8);
        r1.show(canvas);
        r3.show(canvas);
        r5.show(canvas);
        r7.show(canvas);
        r1.setDraggable(figure.isResizeable());
        r3.setDraggable(figure.isResizeable());
        r5.setDraggable(figure.isResizeable());
        r7.setDraggable(figure.isResizeable());
        if (figure.isResizeable() === true) {
            r1.setBackgroundColor(r1.DEFAULT_COLOR);
            r3.setBackgroundColor(r3.DEFAULT_COLOR);
            r5.setBackgroundColor(r5.DEFAULT_COLOR);
            r7.setBackgroundColor(r7.DEFAULT_COLOR);
        } else {
            r1.setBackgroundColor(null);
            r3.setBackgroundColor(null);
            r5.setBackgroundColor(null);
            r7.setBackgroundColor(null);
        }
        if (figure.isStrechable() && figure.isResizeable()) {
            r2.setDraggable(figure.isResizeable());
            r4.setDraggable(figure.isResizeable());
            r6.setDraggable(figure.isResizeable());
            r8.setDraggable(figure.isResizeable());
            r2.show(canvas);
            r4.show(canvas);
            r6.show(canvas);
            r8.show(canvas);
        }
        figure.selectionHandles.add(box);
    }
    this.moved(canvas, figure);
}, moved: function (canvas, figure) {
    if (figure.selectionHandles.isEmpty()) {
        return;
    }
    var objHeight = figure.getHeight();
    var objWidth = figure.getWidth();
    var xPos = figure.getX();
    var yPos = figure.getY();
    var r1 = figure.selectionHandles.get(0);
    var r3 = figure.selectionHandles.get(2);
    var r5 = figure.selectionHandles.get(4);
    var r7 = figure.selectionHandles.get(6);
    r1.setPosition(xPos - r1.getWidth(), yPos - r1.getHeight());
    r3.setPosition(xPos + objWidth, yPos - r3.getHeight());
    r5.setPosition(xPos + objWidth, yPos + objHeight);
    r7.setPosition(xPos - r7.getWidth(), yPos + objHeight);
    if (figure.isStrechable()) {
        var r2 = figure.selectionHandles.get(1);
        var r4 = figure.selectionHandles.get(3);
        var r6 = figure.selectionHandles.get(5);
        var r8 = figure.selectionHandles.get(7);
        r2.setPosition(xPos + (objWidth / 2) - (r2.getWidth() / 2), yPos - r2.getHeight());
        r4.setPosition(xPos + objWidth, yPos + (objHeight / 2) - (r4.getHeight() / 2));
        r6.setPosition(xPos + (objWidth / 2) - (r6.getWidth() / 2), yPos + objHeight);
        r8.setPosition(xPos - r8.getWidth(), yPos + (objHeight / 2) - (r8.getHeight() / 2));
    }
    var box = figure.selectionHandles.get(8);
    box.setPosition(figure.getPosition().translate(-2, -2));
    box.setDimension(figure.getWidth() + 4, figure.getHeight() + 4);
    box.setRotationAngle(figure.getRotationAngle());
}});
draw2d.policy.figure.BigRectangleSelectionFeedbackPolicy = draw2d.policy.figure.RectangleSelectionFeedbackPolicy.extend({NAME: "draw2d.policy.figure.BigRectangleSelectionFeedbackPolicy", init: function () {
    this._super();
}, onSelect: function (canvas, figure, isPrimarySelection) {
    this._super(canvas, figure, isPrimarySelection);
    if (!figure.selectionHandles.isEmpty()) {
        figure.selectionHandles.each(function (i, e) {
            e.setDimension(15, 15);
        });
    }
    this.moved(canvas, figure);
}});
draw2d.policy.figure.RoundRectangleSelectionFeedbackPolicy = draw2d.policy.figure.RectangleSelectionFeedbackPolicy.extend({NAME: "draw2d.policy.figure.RoundRectangleSelectionFeedbackPolicy", init: function () {
    this._super();
}, onSelect: function (canvas, figure, isPrimarySelection) {
    this._super(canvas, figure, isPrimarySelection);
    if (!figure.selectionHandles.isEmpty()) {
        figure.selectionHandles.each(function (i, e) {
            e.setDimension(12, 12);
            e.setRadius(4);
        });
    }
    this.moved(canvas, figure);
}});
draw2d.policy.figure.BusSelectionFeedbackPolicy = draw2d.policy.figure.SelectionFeedbackPolicy.extend({NAME: "draw2d.policy.figure.BusSelectionFeedbackPolicy", init: function () {
    this._super();
}, onSelect: function (canvas, figure, isPrimarySelection) {
    if (figure.selectionHandles.isEmpty()) {
        var r2 = new draw2d.ResizeHandle(figure, 2);
        var r4 = new draw2d.ResizeHandle(figure, 4);
        var r6 = new draw2d.ResizeHandle(figure, 6);
        var r8 = new draw2d.ResizeHandle(figure, 8);
        figure.selectionHandles.add(r2);
        figure.selectionHandles.add(r4);
        figure.selectionHandles.add(r6);
        figure.selectionHandles.add(r8);
        r2.setDraggable(figure.isResizeable());
        r4.setDraggable(figure.isResizeable());
        r6.setDraggable(figure.isResizeable());
        r8.setDraggable(figure.isResizeable());
        r2.show(canvas);
        r4.show(canvas);
        r6.show(canvas);
        r8.show(canvas);
    }
    this.moved(canvas, figure);
}, moved: function (canvas, figure) {
    if (figure.selectionHandles.isEmpty()) {
        return;
    }
    var r2 = figure.selectionHandles.get(0);
    var r4 = figure.selectionHandles.get(1);
    var r6 = figure.selectionHandles.get(2);
    var r8 = figure.selectionHandles.get(3);
    var objHeight = figure.getHeight();
    var objWidth = figure.getWidth();
    var xPos = figure.getX();
    var yPos = figure.getY();
    r2.setPosition(xPos + (objWidth / 2) - (r2.getWidth() / 2), yPos - r2.getHeight());
    r4.setPosition(xPos + objWidth, yPos + (objHeight / 2) - (r4.getHeight() / 2));
    r6.setPosition(xPos + (objWidth / 2) - (r6.getWidth() / 2), yPos + objHeight);
    r8.setPosition(xPos - r8.getWidth(), yPos + (objHeight / 2) - (r8.getHeight() / 2));
}});
draw2d.policy.figure.VBusSelectionFeedbackPolicy = draw2d.policy.figure.BusSelectionFeedbackPolicy.extend({NAME: "draw2d.policy.figure.VBusSelectionFeedbackPolicy", init: function () {
    this._super();
}, moved: function (canvas, figure) {
    if (figure.selectionHandles.isEmpty()) {
        return;
    }
    var r2 = figure.selectionHandles.get(0);
    var r6 = figure.selectionHandles.get(2);
    var objWidth = figure.getWidth();
    r2.setDimension(objWidth, r2.getHeight());
    r6.setDimension(objWidth, r6.getHeight());
    this._super(canvas, figure);
}});
draw2d.policy.figure.HBusSelectionFeedbackPolicy = draw2d.policy.figure.BusSelectionFeedbackPolicy.extend({NAME: "draw2d.policy.figure.HBusSelectionFeedbackPolicy", init: function () {
    this._super();
}, moved: function (canvas, figure) {
    if (figure.selectionHandles.isEmpty()) {
        return;
    }
    var r4 = figure.selectionHandles.get(1);
    var r8 = figure.selectionHandles.get(3);
    r4.setDimension(r4.getWidth(), figure.getHeight());
    r8.setDimension(r4.getWidth(), figure.getHeight());
    this._super(canvas, figure);
}});
draw2d.policy.figure.AntSelectionFeedbackPolicy = draw2d.policy.figure.SelectionFeedbackPolicy.extend({NAME: "draw2d.policy.figure.AntSelectionFeedbackPolicy", init: function () {
    this._super();
}, onSelect: function (canvas, figure, isPrimarySelection) {
    if (figure.selectionHandles.isEmpty()) {
        var box = new draw2d.shape.basic.Rectangle();
        box.setBackgroundColor(null);
        box.setDashArray("- ");
        box.setColor("#00bdee");
        box.hide = function () {
            box.setCanvas(null);
        };
        box.show = function (canvas) {
            box.setCanvas(canvas);
            box.shape.toFront();
        };
        box.show(canvas);
        figure.selectionHandles.add(box);
    }
    this.moved(canvas, figure);
}, moved: function (canvas, figure) {
    if (figure.selectionHandles.isEmpty()) {
        return;
    }
    var box = figure.selectionHandles.get(0);
    box.setPosition(figure.getPosition().translate(-2, -2));
    box.setDimension(figure.getWidth() + 4, figure.getHeight() + 4);
    box.setRotationAngle(figure.getRotationAngle());
}});
draw2d.policy.figure.GlowSelectionFeedbackPolicy = draw2d.policy.figure.SelectionFeedbackPolicy.extend({NAME: "draw2d.policy.figure.GlowSelectionFeedbackPolicy", init: function () {
    this._super();
}, onSelect: function (canvas, figure, isPrimarySelection) {
    figure.setGlow(true);
    this.moved(canvas, figure);
}, onUnselect: function (canvas, figure) {
    this._super(canvas, figure);
    figure.setGlow(false);
}});
draw2d.policy.figure.SlimSelectionFeedbackPolicy = draw2d.policy.figure.RectangleSelectionFeedbackPolicy.extend({NAME: "draw2d.policy.figure.SlimSelectionFeedbackPolicy", init: function () {
    this._super();
}, onSelect: function (canvas, figure, isPrimarySelection) {
    this._super(canvas, figure, isPrimarySelection);
    if (!figure.selectionHandles.isEmpty()) {
        figure.selectionHandles.each(function (i, e) {
            e.setDimension(6, 6);
            e.setRadius(0);
        });
    }
    this.moved(canvas, figure);
}});
draw2d.policy.line.LineSelectionFeedbackPolicy = draw2d.policy.figure.SelectionFeedbackPolicy.extend({NAME: "draw2d.policy.line.LineSelectionFeedbackPolicy", init: function () {
    this._super();
}, onSelect: function (canvas, figure, isPrimarySelection) {
    if (figure.selectionHandles.isEmpty()) {
        figure.selectionHandles.add(new draw2d.shape.basic.LineStartResizeHandle(figure));
        figure.selectionHandles.add(new draw2d.shape.basic.LineEndResizeHandle(figure));
        figure.selectionHandles.each(function (i, e) {
            e.setDraggable(figure.isResizeable());
            e.show(canvas);
        });
    }
    this.moved(canvas, figure);
}, moved: function (canvas, figure) {
    figure.selectionHandles.each(function (i, e) {
        e.relocate();
    });
}});
draw2d.policy.line.JunctionSelectionFeedbackPolicy = draw2d.policy.line.LineSelectionFeedbackPolicy.extend({NAME: "draw2d.policy.line.JunctionSelectionFeedbackPolicy", init: function () {
    this._super();
}, onSelect: function (canvas, connection, isPrimarySelection) {
    this._super(canvas, connection, isPrimarySelection);
    var points = connection.getPoints();
    var i = 1;
    for (; i < (points.getSize() - 1); i++) {
        var handle = new draw2d.shape.basic.JunctionResizeHandle(connection, i);
        connection.selectionHandles.add(handle);
        handle.setDraggable(connection.isResizeable());
        handle.show(canvas);
        var handle = new draw2d.shape.basic.GhostJunctionResizeHandle(connection, i - 1);
        connection.selectionHandles.add(handle);
        handle.setDraggable(connection.isResizeable());
        handle.show(canvas);
    }
    var handle = new draw2d.shape.basic.GhostJunctionResizeHandle(connection, i - 1);
    connection.selectionHandles.add(handle);
    handle.setDraggable(connection.isResizeable());
    handle.show(canvas);
    this.moved(canvas, connection);
}});
draw2d.policy.port.PortFeedbackPolicy = draw2d.policy.figure.DragDropEditPolicy.extend({NAME: "draw2d.policy.port.PortFeedbackPolicy", init: function () {
    this._super();
}, onHoverEnter: function (canvas, draggedFigure, hoverFigure) {
}, onHoverLeave: function (canvas, draggedFigure, hoverFigure) {
}});
draw2d.policy.port.ElasticStrapFeedbackPolicy = draw2d.policy.port.PortFeedbackPolicy.extend({NAME: "draw2d.policy.port.ElasticStrapFeedbackPolicy", init: function () {
    this._super();
    this.connectionLine = null;
}, onDragStart: function (canvas, figure) {
    this.connectionLine = new draw2d.shape.basic.Line();
    this.connectionLine.setCanvas(canvas);
    this.connectionLine.getShapeElement();
    this.onDrag(canvas, figure);
}, onDrag: function (canvas, figure) {
    var x1 = figure.ox + figure.getParent().getAbsoluteX();
    var y1 = figure.oy + figure.getParent().getAbsoluteY();
    this.connectionLine.setStartPoint(x1, y1);
    this.connectionLine.setEndPoint(figure.getAbsoluteX(), figure.getAbsoluteY());
}, onDragEnd: function (canvas, figure) {
    this.connectionLine.setCanvas(null);
    this.connectionLine = null;
}, onHoverEnter: function (canvas, draggedFigure, hoverFiger) {
    this.connectionLine.setGlow(true);
    hoverFiger.setGlow(true);
}, onHoverLeave: function (canvas, draggedFigure, hoverFiger) {
    hoverFiger.setGlow(false);
    this.connectionLine.setGlow(false);
}});
draw2d.policy.port.IntrusivePortsFeedbackPolicy = draw2d.policy.port.PortFeedbackPolicy.extend({NAME: "draw2d.policy.port.IntrusivePortsFeedbackPolicy", init: function () {
    this._super();
    this.connectionLine = null;
    this.tweenable = null;
}, onDragStart: function (canvas, figure) {
    var start = 0;
    figure.getDropTargets().each(function (i, element) {
        element.__beforeInflate = element.getWidth();
        start = element.__beforeInflate;
    });
    var portsToGrow = figure.getDropTargets();
    portsToGrow.grep(function (p) {
        return(p.NAME != figure.NAME && p.parent !== figure.parent) || (p instanceof draw2d.HybridPort) || (figure instanceof draw2d.HybridPort);
    });
    this.tweenable = new Tweenable();
    this.tweenable.tween({from: {"size": start / 2}, to: {"size": start}, duration: 200, easing: "easeOutSine", step: function (params) {
        portsToGrow.each(function (i, element) {
            element.shape.attr({rx: params.size, ry: params.size});
            element.width = element.height = params.size * 2;
        });
    }});
    this.connectionLine = new draw2d.shape.basic.Line();
    this.connectionLine.setCanvas(canvas);
    this.connectionLine.getShapeElement();
    this.connectionLine.setDashArray("- ");
    this.connectionLine.setColor("#30c48a");
    this.onDrag(canvas, figure);
}, onDrag: function (canvas, figure) {
    var x1 = figure.ox + figure.getParent().getAbsoluteX();
    var y1 = figure.oy + figure.getParent().getAbsoluteY();
    this.connectionLine.setStartPoint(x1, y1);
    this.connectionLine.setEndPoint(figure.getAbsoluteX(), figure.getAbsoluteY());
}, onDragEnd: function (canvas, figure) {
    this.tweenable.stop(false);
    this.tweenable = null;
    figure.getDropTargets().each(function (i, element) {
        element.shape.attr({rx: element.__beforeInflate / 2, ry: element.__beforeInflate / 2});
        element.width = element.height = element.__beforeInflate;
    });
    this.connectionLine.setCanvas(null);
    this.connectionLine = null;
}, onHoverEnter: function (canvas, draggedFigure, hoverFiger) {
    this.connectionLine.setGlow(true);
    hoverFiger.setGlow(true);
}, onHoverLeave: function (canvas, draggedFigure, hoverFiger) {
    hoverFiger.setGlow(false);
    this.connectionLine.setGlow(false);
}});
draw2d.Canvas = Class.extend({NAME: "draw2d.Canvas", init: function (canvasId) {
    if ($.browser.msie && parseInt($.browser.version, 10) === 8) {
        this.fromDocumentToCanvasCoordinate = this._fromDocumentToCanvasCoordinate_IE8_HACK;
    }
    this.setScrollArea(document.body);
    this.canvasId = canvasId;
    this.html = $("#" + canvasId);
    this.html.css({"cursor": "default"});
    this.initialWidth = this.getWidth();
    this.initialHeight = this.getHeight();
    this.html.css({"-webkit-tap-highlight-color": "rgba(0,0,0,0)"});
    this.html.droppable({accept: ".draw2d_droppable", over: $.proxy(function (event, ui) {
        this.onDragEnter(ui.draggable);
    }, this), out: $.proxy(function (event, ui) {
        this.onDragLeave(ui.draggable);
    }, this), drop: $.proxy(function (event, ui) {
        event = this._getEvent(event);
        var pos = this.fromDocumentToCanvasCoordinate(event.clientX, event.clientY);
        this.onDrop(ui.draggable, pos.getX(), pos.getY());
    }, this)});
    $(".draw2d_droppable").draggable({appendTo: "body", stack: "body", zIndex: 27000, helper: "clone", drag: $.proxy(function (event, ui) {
        event = this._getEvent(event);
        var pos = this.fromDocumentToCanvasCoordinate(event.clientX, event.clientY);
        this.onDrag(ui.draggable, pos.getX(), pos.getY());
    }, this), stop: function (e, ui) {
        this.isInExternalDragOperation = false;
    }, start: function (e, ui) {
        this.isInExternalDragOperation = true;
        $(ui.helper).addClass("shadow");
    }});
    this.paper = Raphael(canvasId, this.getWidth(), this.getHeight());
    this.paper.canvas.style.position = "absolute";
    this.zoomFactor = 1;
    this.selection = new draw2d.Selection();
    this.currentDropTarget = null;
    this.isInExternalDragOperation = false;
    this.currentHoverFigure = null;
    this.editPolicy = new draw2d.util.ArrayList();
    this.figures = new draw2d.util.ArrayList();
    this.lines = new draw2d.util.ArrayList();
    this.commonPorts = new draw2d.util.ArrayList();
    this.dropTargets = new draw2d.util.ArrayList();
    this.resizeHandles = new draw2d.util.ArrayList();
    this.selectionListeners = new draw2d.util.ArrayList();
    this.commandStack = new draw2d.command.CommandStack();
    this.linesToRepaintAfterDragDrop = new draw2d.util.ArrayList();
    this.lineIntersections = new draw2d.util.ArrayList();
    this.installEditPolicy(new draw2d.policy.canvas.BoundingboxSelectionPolicy());
    this.commandStack.addEventListener($.proxy(function (event) {
        if (event.isPostChangeEvent() === true) {
            this.calculateConnectionIntersection();
            this.linesToRepaintAfterDragDrop.each(function (i, line) {
                line.svgPathString = null;
                line.repaint();
            });
            this.linesToRepaintAfterDragDrop = new draw2d.util.ArrayList();
        }
    }, this));
    this.mouseDown = false;
    this.mouseDownX = 0;
    this.mouseDownY = 0;
    this.mouseDragDiffX = 0;
    this.mouseDragDiffY = 0;
    this.html.bind("mouseup touchend", $.proxy(function (event) {
        if (this.mouseDown === false) {
            return;
        }
        event = this._getEvent(event);
        this.calculateConnectionIntersection();
        this.mouseDown = false;
        var pos = this.fromDocumentToCanvasCoordinate(event.clientX, event.clientY);
        this.editPolicy.each($.proxy(function (i, policy) {
            policy.onMouseUp(this, pos.x, pos.y);
        }, this));
        this.mouseDragDiffX = 0;
        this.mouseDragDiffY = 0;
    }, this));
    this.html.bind("mousemove touchmove", $.proxy(function (event) {
        event = this._getEvent(event);
        if (this.mouseDown === false) {
            var pos = this.fromDocumentToCanvasCoordinate(event.clientX, event.clientY);
            try {
                var hover = this.getBestFigure(pos.x, pos.y);
                if (hover !== this.currentHoverFigure && this.currentHoverFigure !== null) {
                    this.currentHoverFigure.onMouseLeave();
                }
                if (hover !== this.currentHoverFigure && hover !== null) {
                    hover.onMouseEnter();
                }
                this.currentHoverFigure = hover;
            } catch (exc) {
                console.log(exc);
            }
            this.editPolicy.each($.proxy(function (i, policy) {
                policy.onMouseMove(this, pos.x, pos.y);
            }, this));
        } else {
            var diffXAbs = (event.clientX - this.mouseDownX) * this.zoomFactor;
            var diffYAbs = (event.clientY - this.mouseDownY) * this.zoomFactor;
            this.editPolicy.each($.proxy(function (i, policy) {
                policy.onMouseDrag(this, diffXAbs, diffYAbs, diffXAbs - this.mouseDragDiffX, diffYAbs - this.mouseDragDiffY);
            }, this));
            this.mouseDragDiffX = diffXAbs;
            this.mouseDragDiffY = diffYAbs;
        }
    }, this));
    this.html.bind("mousedown touchstart", $.proxy(function (event) {
        var pos = null;
        switch (event.which) {
            case 1:
            case 0:
                event.preventDefault();
                event = this._getEvent(event);
                this.mouseDownX = event.clientX;
                this.mouseDownY = event.clientY;
                this.mouseDragDiffX = 0;
                this.mouseDragDiffY = 0;
                pos = this.fromDocumentToCanvasCoordinate(event.clientX, event.clientY);
                this.mouseDown = true;
                this.editPolicy.each($.proxy(function (i, policy) {
                    policy.onMouseDown(this, pos.x, pos.y);
                }, this));
                break;
            case 3:
                event.preventDefault();
                event = this._getEvent(event);
                // [Modification] added by disi 13-08-24T16:34
                // [Reason] make selecting figure by right mousedown available
                this.mouseDownX = event.clientX;
                this.mouseDownY = event.clientY;
                this.mouseDragDiffX = 0;
                this.mouseDragDiffY = 0;
                // [End of Modification] 13-08-24T16:34
                pos = this.fromDocumentToCanvasCoordinate(event.clientX, event.clientY);
                // [Modification] added by disi 13-08-24T16:34
                this.mouseDown = true;
                this.editPolicy.each($.proxy(function (i, policy) {
                    policy.onMouseDown(this, pos.x, pos.y);
                }, this));
                // [End of Modification] 13-08-24T16:34
                this.onRightMouseDown(pos.x, pos.y);
                break;
            case 2:
                break;
            default:
        }
    }, this));
    $(document).bind("dblclick", $.proxy(function (event) {
        // [Modification] removed by disi 13-09-26T14:30
        // [Reason] do not want change port position feature
//        event = this._getEvent(event);
//        this.mouseDownX = event.clientX;
//        this.mouseDownY = event.clientY;
//        var pos = this.fromDocumentToCanvasCoordinate(event.clientX, event.clientY);
//        this.onDoubleClick(pos.x, pos.y);
        // [End of Modification] 13-09-26T14:30
    }, this));
    $(document).bind("click", $.proxy(function (event) {
        event = this._getEvent(event);
        if (this.mouseDownX === event.clientX || this.mouseDownY === event.clientY) {
            var pos = this.fromDocumentToCanvasCoordinate(event.clientX, event.clientY);
            this.onClick(pos.x, pos.y);
        }
    }, this));
    $(document).bind("keydown", $.proxy(function (event) {
        if (!$(event.target).is("input")) {
            var ctrl = event.ctrlKey;
            this.onKeyDown(event.keyCode, ctrl);
        }
    }, this));
}, calculateConnectionIntersection: function () {
    this.lineIntersections = new draw2d.util.ArrayList();
    var lines = this.getLines().clone();
    while (lines.getSize() > 0) {
        var l1 = lines.removeElementAt(0);
        lines.each($.proxy(function (ii, l2) {
            var partInter = l1.intersection(l2);
            if (partInter.getSize() > 0) {
                this.lineIntersections.add({line: l1, other: l2, intersection: partInter});
                this.lineIntersections.add({line: l2, other: l1, intersection: partInter});
            }
        }, this));
    }
}, clear: function () {
    this.lines.clone().each($.proxy(function (i, e) {
        this.removeFigure(e);
    }, this));
    this.figures.clone().each($.proxy(function (i, e) {
        this.removeFigure(e);
    }, this));
    this.zoomFactor = 1;
    this.selection.clear();
    this.currentDropTarget = null;
    this.isInExternalDragOperation = false;
    this.figures = new draw2d.util.ArrayList();
    this.lines = new draw2d.util.ArrayList();
    this.commonPorts = new draw2d.util.ArrayList();
    this.dropTargets = new draw2d.util.ArrayList();
    this.commandStack.markSaveLocation();
    this.linesToRepaintAfterDragDrop = new draw2d.util.ArrayList();
    this.lineIntersections = new draw2d.util.ArrayList();
    this.selectionListeners.each(function (i, w) {
        w.onSelectionChanged(null);
    });
}, installEditPolicy: function (policy) {
    if (policy instanceof draw2d.policy.canvas.SelectionPolicy) {
        this.getSelection().getAll().each(function (i, figure) {
            figure.unselect();
        });
        this.editPolicy.grep($.proxy(function (p) {
            var stay = !(p instanceof draw2d.policy.canvas.SelectionPolicy);
            if (stay === false) {
                p.onUninstall(this);
            }
            return stay;
        }, this));
    } else {
        if (policy instanceof draw2d.policy.canvas.SnapToEditPolicy) {
            this.editPolicy.grep($.proxy(function (p) {
                var stay = !(p instanceof draw2d.policy.canvas.SnapToEditPolicy);
                if (stay === false) {
                    p.onUninstall(this);
                }
                return stay;
            }, this));
        }
    }
    policy.onInstall(this);
    this.editPolicy.add(policy);
}, uninstallEditPolicy: function (policy) {
    if (!(policy instanceof draw2d.policy.EditPolicy)) {
        return;
    }
    this.editPolicy.grep($.proxy(function (p) {
        if (p === policy) {
            p.onUninstall(this);
            return false;
        }
        return true;
    }, this));
}, setZoom: function (zoomFactor, animated) {
    var _zoom = $.proxy(function (z) {
        this.zoomFactor = Math.min(Math.max(0.01, z), 10);
        var viewBoxWidth = (this.initialWidth * this.zoomFactor) | 0;
        var viewBoxHeight = (this.initialHeight * this.zoomFactor) | 0;
        this.paper.setViewBox(0, 0, viewBoxWidth, viewBoxHeight);
    }, this);
    if (animated) {
        var myTweenable = new Tweenable();
        myTweenable.tween({from: {"x": this.zoomFactor}, to: {"x": zoomFactor}, duration: 300, easing: "easeOutSine", step: function (params) {
            _zoom(params.x);
        }});
    } else {
        _zoom(zoomFactor);
    }
}, getZoom: function () {
    return this.zoomFactor;
}, fromDocumentToCanvasCoordinate: function (x, y) {
    return new draw2d.geo.Point((x - this.getAbsoluteX() + this.getScrollLeft()) * this.zoomFactor, (y - this.getAbsoluteY() + this.getScrollTop()) * this.zoomFactor);
}, _fromDocumentToCanvasCoordinate_IE8_HACK: function (x, y) {
    return new draw2d.geo.Point((x - this.getAbsoluteX()) * this.zoomFactor, (y - this.getAbsoluteY()) * this.zoomFactor);
}, fromCanvasToDocumentCoordinate: function (x, y) {
    return new draw2d.geo.Point((x + this.getAbsoluteX() - this.getScrollLeft()) * this.zoomFactor, (y + this.getAbsoluteY() - this.getScrollTop()) * this.zoomFactor);
}, getHtmlContainer: function () {
    return this.html;
}, _getEvent: function (event) {
    if (typeof event.originalEvent !== "undefined") {
        if (event.originalEvent.touches && event.originalEvent.touches.length) {
            return event.originalEvent.touches[0];
        } else {
            if (event.originalEvent.changedTouches && event.originalEvent.changedTouches.length) {
                return event.originalEvent.changedTouches[0];
            }
        }
    }
    return event;
}, setScrollArea: function (elementSelector) {
    this.scrollArea = $(elementSelector);
}, getScrollArea: function () {
    return this.scrollArea;
}, getScrollLeft: function () {
    return this.scrollArea.scrollLeft();
}, getScrollTop: function () {
    return this.scrollArea.scrollTop();
}, getAbsoluteX: function () {
    return this.html.offset().left;
}, getAbsoluteY: function () {
    return this.html.offset().top;
}, getWidth: function () {
    return this.html.width();
}, getHeight: function () {
    return this.html.height();
}, addFigure: function (figure, x, y) {
    if (figure.getCanvas() === this) {
        return;
    }
    figure.setCanvas(this);
    figure.getShapeElement();
    if (figure instanceof draw2d.shape.basic.Line) {
        this.lines.add(figure);
        this.linesToRepaintAfterDragDrop = this.lines;
    } else {
        this.figures.add(figure);
        if (typeof y !== "undefined") {
            figure.setPosition(x, y);
        }
    }
    figure.repaint();
    figure.fireMoveEvent();
}, removeFigure: function (figure) {
    this.editPolicy.each($.proxy(function (i, policy) {
        if (typeof policy.unselect === "function") {
            policy.unselect(this, figure);
        }
    }, this));
    if (figure instanceof draw2d.shape.basic.Line) {
        this.lines.remove(figure);
    } else {
        this.figures.remove(figure);
    }
    figure.setCanvas(null);
    if (figure instanceof draw2d.Connection) {
        figure.disconnect();
    }
}, getLines: function () {
    return this.lines;
}, getFigures: function () {
    return this.figures;
}, getLine: function (id) {
    var count = this.lines.getSize();
    for (var i = 0; i < count; i++) {
        var line = this.lines.get(i);
        if (line.getId() === id) {
            return line;
        }
    }
    return null;
}, getFigure: function (id) {
    var figure = null;
    this.figures.each(function (i, e) {
        if (e.id === id) {
            figure = e;
            return false;
        }
    });
    return figure;
}, getIntersection: function (line) {
    var result = new draw2d.util.ArrayList();
    this.lineIntersections.each($.proxy(function (i, entry) {
        if (entry.line === line) {
            entry.intersection.each(function (i, p) {
                result.add({x: p.x, y: p.y, justTouching: p.justTouching, other: entry.other});
            });
        }
    }, this));
    return result;
}, snapToHelper: function (figure, pos) {
    this.editPolicy.each($.proxy(function (i, policy) {
        pos = policy.snap(this, figure, pos);
    }, this));
    return pos;
}, registerPort: function (port) {
    port.targets = this.dropTargets;
    this.commonPorts.add(port);
    this.dropTargets.add(port);
}, unregisterPort: function (port) {
    port.targets = null;
    this.commonPorts.remove(port);
    this.dropTargets.remove(port);
}, getAllPorts: function () {
    return this.commonPorts;
}, getCommandStack: function () {
    return this.commandStack;
}, getCurrentSelection: function () {
    return this.selection.getPrimary();
}, getSelection: function () {
    return this.selection;
}, setCurrentSelection: function (figure) {
    this.editPolicy.each($.proxy(function (i, policy) {
        if (typeof policy.select === "function") {
            policy.select(this, figure);
        }
    }, this));
}, addSelectionListener: function (w) {
    if (w !== null) {
        if (typeof w === "function") {
            this.selectionListeners.add({onSelectionChanged: w});
        } else {
            if (typeof w.onSelectionChanged === "function") {
                this.selectionListeners.add(w);
            } else {
                throw"Object doesn't implement required callback method [onSelectionChanged]";
            }
        }
    }
}, removeSelectionListener: function (w) {
    this.selectionListeners = this.selectionListeners.grep(function (listener) {
        return listener !== w && listener.onSelectionChanged !== w;
    });
}, getBestFigure: function (x, y, figureToIgnore) {
    var result = null;
    var testFigure = null;
    var i = 0;
    var children = null;
    for (i = 0, len = this.resizeHandles.getSize(); i < len; i++) {
        testFigure = this.resizeHandles.get(i);
        if (testFigure.isVisible() === true && testFigure.hitTest(x, y) === true && testFigure !== figureToIgnore) {
            return testFigure;
        }
    }
    for (i = 0, len = this.commonPorts.getSize(); i < len; i++) {
        testFigure = this.commonPorts.get(i);
        if (testFigure !== figureToIgnore) {
            if (testFigure.isVisible() === true && testFigure.hitTest(x, y) === true) {
                return testFigure;
            }
        }
    }
    result = this.getBestLine(x, y, figureToIgnore);
    if (result !== null) {
        return result;
    }
    for (i = (this.figures.getSize() - 1); i >= 0; i--) {
        var figure = this.figures.get(i);
        var checkRecursive = function (children) {
            children.each(function (i, e) {
                checkRecursive(e.getChildren());
                if (result === null && e.isVisible() === true && e.hitTest(x, y) === true) {
                    result = e;
                }
                return result === null;
            });
        };
        checkRecursive(figure.getChildren());
        if (result === null && figure.isVisible() === true && figure.hitTest(x, y) === true && figure !== figureToIgnore) {
            if (result === null) {
                result = figure;
            } else {
                if (result.getZOrder() < figure.getZOrder()) {
                    result = figure;
                }
            }
        }
        if (result !== null) {
            return result;
        }
    }
    var count = this.lines.getSize();
    for (i = 0; i < count; i++) {
        var line = this.lines.get(i);
        children = line.getChildren();
        children.each(function (i, e) {
            if (e.isVisible() === true && e.hitTest(x, y) === true) {
                result = e;
                return false;
            }
            return true;
        });
    }
    return result;
}, getBestLine: function (x, y, lineToIgnore) {
    var result = null;
    var count = this.lines.getSize();
    for (var i = 0; i < count; i++) {
        var line = this.lines.get(i);
        if (line.isVisible() === true && line.hitTest(x, y) === true && line !== lineToIgnore) {
            if (result === null) {
                result = line;
                break;
            }
        }
    }
    return result;
}, hideSnapToHelperLines: function () {
    this.hideSnapToHelperLineHorizontal();
    this.hideSnapToHelperLineVertical();
}, hideSnapToHelperLineHorizontal: function () {
}, hideSnapToHelperLineVertical: function () {
}, onDragEnter: function (draggedDomNode) {
}, onDrag: function (draggedDomNode, x, y) {
}, onDragLeave: function (draggedDomNode) {
}, onDrop: function (droppedDomNode, x, y) {
}, onKeyDown: function (keyCode, ctrl) {
    // [Modification] removed by disi 13-08-10T08:30
    // [Reason] it seems that here has some bugs when application using multiple canvases (close and reopen)
//    if (keyCode == 46 && this.selection.getPrimary() !== null) {
//        this.commandStack.execute(this.selection.getPrimary().createCommand(new draw2d.command.CommandType(draw2d.command.CommandType.DELETE)));
//    } else {
//        if (keyCode == 90 && ctrl) {
//            this.commandStack.undo();
//        } else {
//            if (keyCode == 89 && ctrl) {
//                this.commandStack.redo();
//            } else {
//                if (keyCode === 107) {
//                    this.setZoom(this.zoomFactor * 0.95);
//                } else {
//                    if (keyCode === 109) {
//                        this.setZoom(this.zoomFactor * 1.05);
//                    }
//                }
//            }
//        }
//    }
    // [End of Modification] removed by disi 13-08-10T08:30
}, onDoubleClick: function (x, y) {
    var figure = this.getBestFigure(x, y);
    if (figure !== null) {
        figure.onDoubleClick();
    }
}, onClick: function (x, y) {
    var figure = this.getBestFigure(x, y);
    if (figure !== null) {
        figure.onClick();
    }
}, onRightMouseDown: function (x, y) {
    var figure = this.getBestFigure(x, y);
    if (figure !== null) {
        figure.onContextMenu(x, y);
    }
}});
draw2d.Selection = Class.extend({NAME: "draw2d.Selection", init: function () {
    this.primary = null;
    this.all = new draw2d.util.ArrayList();
}, clear: function () {
    this.primary = null;
    this.all = new draw2d.util.ArrayList();
}, getPrimary: function () {
    return this.primary;
}, setPrimary: function (figure) {
    this.primary = figure;
    if (figure !== null && !this.all.contains(figure)) {
        this.all.add(figure);
    }
}, remove: function (figure) {
    this.all.remove(figure);
    if (this.primary === figure) {
        this.primary = null;
    }
}, contains: function (figure) {
    return this.all.contains(figure);
}, getAll: function () {
    return this.all.clone();
}});
draw2d.Figure = Class.extend({NAME: "draw2d.Figure", MIN_TIMER_INTERVAL: 50, init: function (width, height) {
    this.id = draw2d.util.UUID.create();
    this.isResizeHandle = false;
    this.command = null;
    this.canvas = null;
    this.shape = null;
    this.children = new draw2d.util.ArrayList();
    this.selectable = true;
    this.deleteable = true;
    this.resizeable = true;
    this.draggable = true;
    this.visible = true;
    this.canSnapToHelper = true;
    this.snapToGridAnchor = new draw2d.geo.Point(0, 0);
    this.editPolicy = new draw2d.util.ArrayList();
    this.timerId = -1;
    this.timerInterval = 0;
    this.parent = null;
    this.userData = null;
    this.x = 0;
    this.y = 0;
    this.minHeight = 5;
    this.minWidth = 5;
    this.rotationAngle = 0;
    this.cssClass = null;
    if (typeof height !== "undefined") {
        this.width = width;
        this.height = height;
    } else {
        this.width = this.getMinWidth();
        this.height = this.getMinHeight();
    }
    this.alpha = 1;
    this.isInDragDrop = false;
    this.originalAlpha = this.alpha;
    this.ox = 0;
    this.oy = 0;
    this.repaintBlocked = false;
    this.selectionHandles = new draw2d.util.ArrayList();
    this.moveListener = new draw2d.util.ArrayList();
    this.resizeListener = new draw2d.util.ArrayList();
    this.installEditPolicy(new draw2d.policy.figure.RectangleSelectionFeedbackPolicy());
}, select: function (asPrimarySelection) {
    if (typeof asPrimarySelection === "undefined") {
        asPrimarySelection = true;
    }
    this.editPolicy.each($.proxy(function (i, e) {
        if (e instanceof draw2d.policy.figure.SelectionFeedbackPolicy) {
            e.onSelect(this.canvas, this, asPrimarySelection);
        }
    }, this));
    return this;
}, unselect: function () {
    this.editPolicy.each($.proxy(function (i, e) {
        if (e instanceof draw2d.policy.figure.SelectionFeedbackPolicy) {
            e.onUnselect(this.canvas, this);
        }
    }, this));
    return this;
}, setUserData: function (object) {
    this.userData = object;
}, getUserData: function () {
    return this.userData;
}, getId: function () {
    return this.id;
}, setId: function (id) {
    this.id = id;
    return this;
}, getCssClass: function () {
    return this.cssClass;
}, setCssClass: function (cssClass) {
    this.cssClass = cssClass === null ? null : $.trim(cssClass);
    if (this.shape === null) {
        return this;
    }
    if (this.cssClass === null) {
        this.shape.node.removeAttribute("class");
    } else {
        this.shape.node.setAttribute("class", this.cssClass);
    }
    return this;
}, hasCssClass: function (className) {
    if (this.cssClass === null) {
        return false;
    }
    return new RegExp(" " + $.trim(className) + " ").test(" " + this.cssClass + " ");
}, addCssClass: function (className) {
    className = $.trim(className);
    if (!this.hasCssClass(className)) {
        if (this.cssClass === null) {
            this.setCssClass(className);
        } else {
            this.setCssClass(this.cssClass + " " + className);
        }
    }
    return this;
}, removeCssClass: function (className) {
    className = $.trim(className);
    var newClass = " " + this.cssClass.replace(/[\t\r\n]/g, " ") + " ";
    if (this.hasCssClass(className)) {
        while (newClass.indexOf(" " + className + " ") >= 0) {
            newClass = newClass.replace(" " + className + " ", " ");
        }
        this.setCssClass(newClass.replace(/^\s+|\s+$/g, ""));
    }
    return this;
}, toggleCssClass: function (className) {
    className = $.trim(className);
    var newClass = " " + this.cssClass.replace(/[\t\r\n]/g, " ") + " ";
    if (this.hasCssClass(className)) {
        while (newClass.indexOf(" " + className + " ") >= 0) {
            newClass = newClass.replace(" " + className + " ", " ");
        }
        this.setCssClass(newClass.replace(/^\s+|\s+$/g, ""));
    } else {
        this.setCssClass(this.cssClass + " " + className);
    }
    return this;
}, setCanvas: function (canvas) {
    if (canvas === null && this.shape !== null) {
        this.unselect();
        this.shape.remove();
        this.shape = null;
    }
    this.canvas = canvas;
    if (this.canvas !== null) {
        this.getShapeElement();
    }
    if (canvas === null) {
        this.stopTimer();
    } else {
        if (this.timerInterval >= this.MIN_TIMER_INTERVAL) {
            this.startTimer(this.timerInterval);
        }
    }
    this.children.each(function (i, e) {
        e.figure.setCanvas(canvas);
    });
    return this;
}, getCanvas: function () {
    return this.canvas;
}, startTimer: function (milliSeconds) {
    this.stopTimer();
    this.timerInterval = Math.max(this.MIN_TIMER_INTERVAL, milliSeconds);
    if (this.canvas !== null) {
        this.timerId = window.setInterval($.proxy(this.onTimer, this), this.timerInterval);
    }
    return this;
}, stopTimer: function () {
    if (this.timerId >= 0) {
        window.clearInterval(this.timerId);
        this.timerId = -1;
    }
    return this;
}, onTimer: function () {
}, installEditPolicy: function (policy) {
    if (policy instanceof draw2d.policy.figure.SelectionFeedbackPolicy) {
        this.editPolicy.grep($.proxy(function (p) {
            var stay = !(p instanceof draw2d.policy.figure.SelectionFeedbackPolicy);
            if (!stay) {
                p.onUninstall(this);
            }
            return stay;
        }, this));
    }
    policy.onInstall(this);
    this.editPolicy.add(policy);
    return this;
}, addFigure: function (child, locator) {
    child.setDraggable(false);
    child.setSelectable(false);
    child.setParent(this);
    this.children.add({figure: child, locator: locator});
    if (this.canvas !== null) {
        child.setCanvas(this.canvas);
    }
    this.repaint();
    return this;
}, getChildren: function () {
    var shapes = new draw2d.util.ArrayList();
    this.children.each(function (i, e) {
        shapes.add(e.figure);
    });
    return shapes;
}, resetChildren: function () {
    this.children.each(function (i, e) {
        e.figure.setCanvas(null);
    });
    this.children = new draw2d.util.ArrayList();
    this.repaint();
    return this;
}, getShapeElement: function () {
    if (this.shape !== null) {
        return this.shape;
    }
    this.shape = this.createShapeElement();
    if (this.cssClass !== null) {
        this.shape.node.setAttribute("class", this.cssClass);
    }
    return this.shape;
}, createShapeElement: function () {
    throw"Inherited class [" + this.NAME + "] must override the abstract method createShapeElement";
}, repaint: function (attributes) {
    if (this.visible === true) {
        this.shape.show();
    } else {
        this.shape.hide();
        return;
    }
    attributes.opacity = this.alpha;
    this.shape.attr(attributes);
    this.applyTransformation();
    this.children.each(function (i, e) {
        e.locator.relocate(i, e.figure);
    });
}, applyTransformation: function () {
}, setGlow: function (flag) {
    return this;
}, onDragStart: function (relativeX, relativeY) {
    this.isInDragDrop = false;
    this.command = this.createCommand(new draw2d.command.CommandType(draw2d.command.CommandType.MOVE));
    if (this.command !== null) {
        this.ox = this.x;
        this.oy = this.y;
        this.isInDragDrop = true;
        this.editPolicy.each($.proxy(function (i, e) {
            if (e instanceof draw2d.policy.figure.DragDropEditPolicy) {
                e.onDragStart(this.canvas, this);
            }
        }, this));
        return true;
    }
    return false;
}, onDrag: function (dx, dy, dx2, dy2) {
    this.editPolicy.each($.proxy(function (i, e) {
        if (e instanceof draw2d.policy.figure.DragDropEditPolicy) {
            var newPos = e.adjustPosition(this, this.ox + dx, this.oy + dy);
            dx = newPos.x - this.ox;
            dy = newPos.y - this.oy;
        }
    }, this));
    this.x = this.ox + dx;
    this.y = this.oy + dy;
    if (this.getCanSnapToHelper()) {
        var p = new draw2d.geo.Point(this.x, this.y);
        p = this.getCanvas().snapToHelper(this, p);
        this.x = p.x;
        this.y = p.y;
    }
    this.setPosition(this.x, this.y);
    this.editPolicy.each($.proxy(function (i, e) {
        if (e instanceof draw2d.policy.figure.DragDropEditPolicy) {
            e.onDrag(this.canvas, this);
        }
    }, this));
}, onPanning: function (dx, dy, dx2, dy2) {
}, onDragEnd: function () {
    this.setAlpha(this.originalAlpha);
    this.command.setPosition(this.x, this.y);
    this.isInDragDrop = false;
    this.canvas.getCommandStack().execute(this.command);
    this.command = null;
    this.editPolicy.each($.proxy(function (i, e) {
        if (e instanceof draw2d.policy.figure.DragDropEditPolicy) {
            e.onDragEnd(this.canvas, this);
        }
    }, this));
    this.fireMoveEvent();
}, onDragEnter: function (draggedFigure) {
    return null;
}, onDragLeave: function (draggedFigure) {
}, onDrop: function (dropTarget) {
}, onMouseEnter: function () {
}, onMouseLeave: function () {
}, onDoubleClick: function () {
}, onClick: function () {
}, onContextMenu: function (x, y) {
}, setAlpha: function (percent) {
    percent = Math.min(1, Math.max(0, parseFloat(percent)));
    if (percent === this.alpha) {
        return;
    }
    this.alpha = percent;
    this.repaint();
    return this;
}, getAlpha: function () {
    return this.alpha;
}, setRotationAngle: function (angle) {
    this.rotationAngle = angle;
    this.editPolicy.each($.proxy(function (i, e) {
        if (e instanceof draw2d.policy.figure.DragDropEditPolicy) {
            e.moved(this.canvas, this);
        }
    }, this));
    this.repaint();
    return this;
}, getRotationAngle: function () {
    return this.rotationAngle;
}, setVisible: function (flag) {
    this.visible = !!flag;
    this.repaint();
    return this;
}, isVisible: function () {
    return this.visible && this.shape !== null;
}, getZOrder: function () {
    if (this.shape === null) {
        return -1;
    }
    var i = 0;
    var child = this.shape.node;
    while ((child = child.previousSibling) !== null) {
        i++;
    }
    return i;
}, setCanSnapToHelper: function (flag) {
    this.canSnapToHelper = !!flag;
    return this;
}, getCanSnapToHelper: function () {
    return this.canSnapToHelper;
}, getSnapToGridAnchor: function () {
    return this.snapToGridAnchor;
}, setSnapToGridAnchor: function (point) {
    this.snapToGridAnchor = point;
}, getWidth: function () {
    return this.width;
}, getHeight: function () {
    return this.height;
}, getMinWidth: function () {
    return this.minWidth;
}, setMinWidth: function (w) {
    this.minWidth = parseFloat(w);
    return this;
}, getMinHeight: function () {
    return this.minHeight;
    return this;
}, setMinHeight: function (h) {
    this.minHeight = parseFloat(h);
    return this;
}, getX: function () {
    return this.x;
}, getY: function () {
    return this.y;
}, getAbsoluteX: function () {
    if (this.parent === null) {
        return this.x || 0;
    }
    return this.x + this.parent.getAbsoluteX();
}, getAbsoluteY: function () {
    if (this.parent === null) {
        return this.y || 0;
    }
    return this.y + this.parent.getAbsoluteY();
}, getAbsolutePosition: function () {
    return new draw2d.geo.Point(this.getAbsoluteX(), this.getAbsoluteY());
}, getAbsoluteBounds: function () {
    return new draw2d.geo.Rectangle(this.getAbsoluteX(), this.getAbsoluteY(), this.getWidth(), this.getHeight());
}, setPosition: function (x, y) {
    if (x instanceof draw2d.geo.Point) {
        this.x = x.x;
        this.y = x.y;
    } else {
        this.x = x;
        this.y = y;
    }
    this.repaint();
    this.editPolicy.each($.proxy(function (i, e) {
        if (e instanceof draw2d.policy.figure.DragDropEditPolicy) {
            e.moved(this.canvas, this);
        }
    }, this));
    this.fireMoveEvent();
    return this;
}, getPosition: function () {
    return new draw2d.geo.Point(this.x, this.y);
}, translate: function (dx, dy) {
    this.setPosition(this.x + dx, this.y + dy);
    return this;
}, setDimension: function (w, h) {
    w = Math.max(this.getMinWidth(), w);
    h = Math.max(this.getMinHeight(), h);
    if (this.width === w && this.height === h) {
        return;
    }
    this.editPolicy.each($.proxy(function (i, e) {
        if (e instanceof draw2d.policy.figure.DragDropEditPolicy) {
            var newDim = e.adjustDimension(this, w, h);
            w = newDim.w;
            h = newDim.h;
        }
    }, this));
    this.width = Math.max(this.getMinWidth(), w);
    this.height = Math.max(this.getMinHeight(), h);
    this.repaint();
    this.fireResizeEvent();
    this.fireMoveEvent();
    this.editPolicy.each($.proxy(function (i, e) {
        if (e instanceof draw2d.policy.figure.DragDropEditPolicy) {
            e.moved(this.canvas, this);
        }
    }, this));
    return this;
}, getBoundingBox: function () {
    return new draw2d.geo.Rectangle(this.getAbsoluteX(), this.getAbsoluteY(), this.getWidth(), this.getHeight());
}, hitTest: function (iX, iY, corona) {
    if (typeof corona === "number") {
        return this.getBoundingBox().scale(corona, corona).hitTest(iX, iY);
    }
    return this.getBoundingBox().hitTest(iX, iY);
}, setDraggable: function (flag) {
    this.draggable = !!flag;
    return this;
}, isDraggable: function () {
    return this.draggable;
}, isResizeable: function () {
    return this.resizeable;
}, setResizeable: function (flag) {
    this.resizeable = !!flag;
    return this;
}, isSelectable: function () {
    return this.selectable;
}, setSelectable: function (flag) {
    this.selectable = !!flag;
    return this;
}, isStrechable: function () {
    return true;
}, isDeleteable: function () {
    return this.deleteable;
}, setDeleteable: function (flag) {
    this.deleteable = !!flag;
    return this;
}, setParent: function (parent) {
    this.parent = parent;
    return this;
}, getParent: function () {
    return this.parent;
}, attachResizeListener: function (listener) {
    if (listener === null) {
        return;
    }
    this.resizeListener.add(listener);
    return this;
}, detachResizeListener: function (figure) {
    if (figure === null) {
        return;
    }
    this.resizeListener.remove(figure);
    return this;
}, fireResizeEvent: function () {
    this.resizeListener.each($.proxy(function (i, item) {
        item.onOtherFigureIsResizing(this);
    }, this));
    return this;
}, onOtherFigureIsResizing: function (figure) {
}, attachMoveListener: function (listener) {
    if (listener === null) {
        return;
    }
    if (!this.moveListener.contains(listener)) {
        this.moveListener.add(listener);
    }
    return this;
}, detachMoveListener: function (figure) {
    if (figure === null) {
        return;
    }
    this.moveListener.remove(figure);
    return this;
}, fireMoveEvent: function () {
    this.moveListener.each($.proxy(function (i, item) {
        item.onOtherFigureIsMoving(this);
    }, this));
    return this;
}, onOtherFigureIsMoving: function (figure) {
}, createCommand: function (request) {
    if (request === null) {
        return null;
    }
    if (request.getPolicy() === draw2d.command.CommandType.MOVE) {
        if (!this.isDraggable()) {
            return null;
        }
        return new draw2d.command.CommandMove(this);
    }
    if (request.getPolicy() === draw2d.command.CommandType.DELETE) {
        if (!this.isDeleteable()) {
            return null;
        }
        return new draw2d.command.CommandDelete(this);
    }
    if (request.getPolicy() === draw2d.command.CommandType.RESIZE) {
        if (!this.isResizeable()) {
            return null;
        }
        return new draw2d.command.CommandResize(this);
    }
    return null;
}, getPersistentAttributes: function () {
    var memento = {type: this.NAME, id: this.id, x: this.x, y: this.y, width: this.width, height: this.height, userData: this.userData};
    if (this.cssClass !== null) {
        memento.cssClass = this.cssClass;
    }
    return memento;
}, setPersistentAttributes: function (memento) {
    this.id = memento.id;
    this.x = memento.x;
    this.y = memento.y;
    if (typeof memento.width !== "undefined") {
        this.width = memento.width;
    }
    if (typeof memento.height !== "undefined") {
        this.height = memento.height;
    }
    if (typeof memento.userData !== "undefined") {
        this.userData = memento.userData;
    }
    if (typeof memento.cssClass !== "undefined") {
        this.setCssClass(memento.cssClass);
    }
    return this;
}});
draw2d.shape.node.Node = draw2d.Figure.extend({NAME: "draw2d.shape.node.Node", init: function (width, height) {
    this.inputPorts = new draw2d.util.ArrayList();
    this.outputPorts = new draw2d.util.ArrayList();
    this.hybridPorts = new draw2d.util.ArrayList();
    this.portRelayoutRequired = true;
    this.cachedPorts = null;
    this._super(width, height);
}, onDoubleClick: function () {
    var w = this.getWidth();
    var h = this.getHeight();
    this.setRotationAngle((this.getRotationAngle() + 90) % 360);
    this.setDimension(h, w);
    this.portRelayoutRequired = true;
}, getPorts: function () {
    if (this.cachedPorts === null) {
        this.cachedPorts = new draw2d.util.ArrayList();
        this.cachedPorts.addAll(this.inputPorts);
        this.cachedPorts.addAll(this.outputPorts);
        this.cachedPorts.addAll(this.hybridPorts);
        this.children.each($.proxy(function (i, e) {
            this.cachedPorts.addAll(e.figure.getPorts());
        }, this));
    }
    return this.cachedPorts;
}, getInputPorts: function () {
    return this.inputPorts.clone().addAll(this.hybridPorts);
}, getOutputPorts: function () {
    return this.outputPorts.clone().addAll(this.hybridPorts);
}, getPort: function (portName) {
    var port = null;
    this.getPorts().each(function (i, e) {
        if (e.getName() === portName) {
            port = e;
            return false;
        }
    });
    return port;
}, getInputPort: function (portNameOrIndex) {
    if (typeof portNameOrIndex === "number") {
        return this.inputPorts.get(portNameOrIndex);
    }
    for (var i = 0; i < this.inputPorts.getSize(); i++) {
        var port = this.inputPorts.get(i);
        if (port.getName() === portNameOrIndex) {
            return port;
        }
    }
    return null;
}, getOutputPort: function (portNameOrIndex) {
    if (typeof portNameOrIndex === "number") {
        return this.outputPorts.get(portNameOrIndex);
    }
    for (var i = 0; i < this.outputPorts.getSize(); i++) {
        var port = this.outputPorts.get(i);
        if (port.getName() === portNameOrIndex) {
            return port;
        }
    }
    return null;
}, getHybridPort: function (portNameOrIndex) {
    if (typeof portNameOrIndex === "number") {
        return this.hybridPorts.get(portNameOrIndex);
    }
    for (var i = 0; i < this.hybridPorts.getSize(); i++) {
        var port = this.hybridPorts.get(i);
        if (port.getName() === portNameOrIndex) {
            return port;
        }
    }
    return null;
}, addPort: function (port, locator) {
    if (!(port instanceof draw2d.Port)) {
        throw"Argument is not typeof 'draw2d.Port'. \nFunction: draw2d.shape.node.Node#addPort";
    }
    this.cachedPorts = null;
    this.portRelayoutRequired = true;
    if (port instanceof draw2d.InputPort) {
        this.inputPorts.add(port);
    } else {
        if (port instanceof draw2d.OutputPort) {
            this.outputPorts.add(port);
        } else {
            if (port instanceof draw2d.HybridPort) {
                this.hybridPorts.add(port);
            }
        }
    }
    if ((typeof locator !== "undefined") && (locator instanceof draw2d.layout.locator.Locator)) {
        port.setLocator(locator);
    }
    port.setParent(this);
    port.setCanvas(this.canvas);
    port.setDeleteable(false);
    if (this.canvas !== null) {
        port.getShapeElement();
        this.canvas.registerPort(port);
    }
}, removePort: function (port) {
    this.portRelayoutRequired = true;
    this.inputPorts.remove(port);
    this.outputPorts.remove(port);
    this.hybridPorts.remove(port);
    if (port.getCanvas() !== null) {
        port.getCanvas().unregisterPort(port);
        var connections = port.getConnections();
        for (var i = 0; i < connections.getSize(); ++i) {
            port.getCanvas().removeFigure(connections.get(i));
        }
    }
    port.setCanvas(null);
}, createPort: function (type, locator) {
    var newPort = null;
    var count = 0;
    switch (type) {
        case"input":
            newPort = new draw2d.InputPort();
            count = this.inputPorts.getSize();
            break;
        case"output":
            newPort = new draw2d.OutputPort();
            count = this.outputPorts.getSize();
            break;
        case"hybrid":
            newPort = new draw2d.HybridPort();
            count = this.hybridPorts.getSize();
            break;
        default:
            throw"Unknown type [" + type + "] of port requested";
    }
    newPort.setName(type + count);
    this.addPort(newPort, locator);
    this.setDimension(this.width, this.height);
    this.layoutPorts();
    return newPort;
}, getConnections: function () {
    var connections = new draw2d.util.ArrayList();
    var ports = this.getPorts();
    for (var i = 0; i < ports.getSize(); i++) {
        var port = ports.get(i);
        for (var c = 0, c_size = port.getConnections().getSize(); c < c_size; c++) {
            if (!connections.contains(port.getConnections().get(c))) {
                connections.add(port.getConnections().get(c));
            }
        }
    }
    return connections;
}, setCanvas: function (canvas) {
    var oldCanvas = this.canvas;
    this._super(canvas);
    var ports = this.getPorts();
    if (oldCanvas !== null) {
        ports.each(function (i, port) {
            oldCanvas.unregisterPort(port);
        });
    }
    if (canvas !== null) {
        ports.each(function (i, port) {
            port.setCanvas(canvas);
            canvas.registerPort(port);
        });
        this.setDimension(this.width, this.height);
    } else {
        ports.each(function (i, port) {
            port.setCanvas(null);
        });
    }
}, setRotationAngle: function (angle) {
    this.portRelayoutRequired = true;
    this._super(angle);
    this.layoutPorts();
}, setDimension: function (w, h) {
    this.portRelayoutRequired = true;
    this._super(w, h);
}, onPortValueChanged: function (relatedPort) {
}, repaint: function (attributes) {
    if (this.repaintBlocked === true || this.shape === null) {
        return;
    }
    this._super(attributes);
    this.layoutPorts();
}, layoutPorts: function () {
    if (this.portRelayoutRequired === false) {
        return;
    }
    this.portRelayoutRequired = false;
    this.outputPorts.each(function (i, port) {
        port.locator.relocate(i, port);
    });
    this.inputPorts.each(function (i, port) {
        port.locator.relocate(i, port);
    });
    this.hybridPorts.each(function (i, port) {
        port.locator.relocate(i, port);
    });
}});
draw2d.VectorFigure = draw2d.shape.node.Node.extend({NAME: "draw2d.VectorFigure", init: function () {
    this.stroke = 1;
    this.bgColor = new draw2d.util.Color(255, 255, 255);
    this.lineColor = new draw2d.util.Color(128, 128, 255);
    this.color = new draw2d.util.Color(128, 128, 128);
    this.strokeBeforeGlow = this.stroke;
    this.glowIsActive = false;
    this._super();
}, setGlow: function (flag) {
    if (flag === this.glowIsActive) {
        return this;
    }
    this.glowIsActive = flag;
    if (flag === true) {
        this.strokeBeforeGlow = this.getStroke();
        this.setStroke(this.strokeBeforeGlow * 2.5);
    } else {
        this.setStroke(this.strokeBeforeGlow);
    }
    return this;
}, repaint: function (attributes) {
    if (this.repaintBlocked === true || this.shape === null) {
        return;
    }
    if (typeof attributes === "undefined") {
        attributes = {};
    }
    attributes.x = this.getAbsoluteX();
    attributes.y = this.getAbsoluteY();
    if (typeof attributes.stroke === "undefined") {
        if (this.color === null || this.stroke === 0) {
            attributes.stroke = "none";
        } else {
            attributes.stroke = this.color.hash();
        }
    }
    attributes["stroke-width"] = this.stroke;
    if (typeof attributes.fill === "undefined") {
        attributes.fill = this.bgColor.hash();
    }
    this._super(attributes);
}, setBackgroundColor: function (color) {
    this.bgColor = new draw2d.util.Color(color);
    this.repaint();
    return this;
}, getBackgroundColor: function () {
    return this.bgColor;
}, setStroke: function (w) {
    this.stroke = w;
    this.repaint();
    return this;
}, getStroke: function () {
    return this.stroke;
}, setColor: function (color) {
    this.color = new draw2d.util.Color(color);
    this.repaint();
    return this;
}, getColor: function () {
    return this.color;
}});
draw2d.shape.basic.Rectangle = draw2d.VectorFigure.extend({NAME: "draw2d.shape.basic.Rectangle", init: function (width, height) {
    this.radius = 2;
    this.dasharray = null;
    this._super();
    this.setBackgroundColor(new draw2d.util.Color(100, 100, 100));
    this.setColor("#1B1B1B");
    if (typeof width === "undefined") {
        this.setDimension(50, 90);
    } else {
        this.setDimension(width, height);
    }
}, repaint: function (attributes) {
    if (this.repaintBlocked === true || this.shape === null) {
        return;
    }
    if (typeof attributes === "undefined") {
        attributes = {};
    }
    if (this.dasharray !== null) {
        attributes["stroke-dasharray"] = this.dasharray;
    }
    attributes.width = this.getWidth();
    attributes.height = this.getHeight();
    attributes.r = this.radius;
    this._super(attributes);
}, applyTransformation: function () {
    this.shape.transform("R" + this.rotationAngle);
    if (this.getRotationAngle() === 90 || this.getRotationAngle() === 270) {
        var ratio = this.getHeight() / this.getWidth();
        var rs = "...S" + ratio + "," + 1 / ratio + "," + (this.getAbsoluteX() + this.getWidth() / 2) + "," + (this.getAbsoluteY() + this.getHeight() / 2);
        this.shape.transform(rs);
    }
}, createShapeElement: function () {
    return this.canvas.paper.rect(this.getAbsoluteX(), this.getAbsoluteY(), this.getWidth(), this.getHeight());
}, setRadius: function (radius) {
    this.radius = radius;
    this.repaint();
}, getRadius: function () {
    return this.radius;
}, setDashArray: function (dash) {
    this.dasharray = dash;
}, getPersistentAttributes: function () {
    var memento = this._super();
    memento.radius = this.radius;
    return memento;
}, setPersistentAttributes: function (memento) {
    this._super(memento);
    if (typeof memento.radius === "number") {
        this.radius = memento.radius;
    }
}});
draw2d.SetFigure = draw2d.shape.basic.Rectangle.extend({NAME: "draw2d.SetFigure", init: function (width, height) {
    this.svgNodes = null;
    this.originalWidth = null;
    this.originalHeight = null;
    this.scaleX = 1;
    this.scaleY = 1;
    this._super(width, height);
    this.setStroke(0);
    this.setBackgroundColor(null);
}, setCanvas: function (canvas) {
    if (canvas === null && this.svgNodes !== null) {
        this.svgNodes.remove();
        this.svgNodes = null;
    }
    this._super(canvas);
}, setCssClass: function (cssClass) {
    this._super(cssClass);
    if (this.svgNodes === null) {
        return this;
    }
    if (this.cssClass === null) {
        this.svgNodes.forEach(function (e) {
            e.node.removeAttribute("class");
        });
    } else {
        this.svgNodes.forEach(function (e) {
            e.node.setAttribute("class", cssClass);
        });
    }
    return this;
}, repaint: function (attributes) {
    if (this.repaintBlocked === true || this.shape === null) {
        return;
    }
    if (this.originalWidth !== null) {
        this.scaleX = this.width / this.originalWidth;
        this.scaleY = this.height / this.originalHeight;
    }
    if (typeof attributes === "undefined") {
        attributes = {};
    }
    if (this.visible === true) {
        this.svgNodes.show();
    } else {
        this.svgNodes.hide();
    }
    this._super(attributes);
}, applyTransformation: function () {
    var s = "S" + this.scaleX + "," + this.scaleY + ",0,0 " + "R" + this.rotationAngle + "," + ((this.getWidth() / 2) | 0) + "," + ((this.getHeight() / 2) | 0) + "T" + this.getAbsoluteX() + "," + this.getAbsoluteY() + "";
    this.svgNodes.transform(s);
    if (this.rotationAngle === 90 || this.rotationAngle === 270) {
        var before = this.svgNodes.getBBox(true);
        var ratio = before.height / before.width;
        var reverseRatio = before.width / before.height;
        var rs = "...S" + ratio + "," + reverseRatio + "," + (this.getAbsoluteX() + this.getWidth() / 2) + "," + (this.getAbsoluteY() + this.getHeight() / 2);
        this.svgNodes.transform(rs);
    }
}, createShapeElement: function () {
    var shape = this.canvas.paper.rect(this.getX(), this.getY(), this.getWidth(), this.getHeight());
    this.svgNodes = this.createSet();
    if (typeof this.svgNodes.forEach === "undefined") {
        var set = this.canvas.paper.set();
        set.push(this.svgNodes);
        this.svgNodes = set;
    }
    this.setCssClass(this.cssClass);
    var bb = this.svgNodes.getBBox();
    this.originalWidth = bb.width;
    this.originalHeight = bb.height;
    return shape;
}, createSet: function () {
    return this.canvas.paper.set();
}});
draw2d.SVGFigure = draw2d.SetFigure.extend({NAME: "draw2d.SVGFigure", init: function (width, height) {
    this._super(width, height);
}, createSet: function () {
    return this.importSVG(this.canvas, this.getSVG());
}, importSVG: function (canvas, rawSVG) {
    var set = canvas.paper.set();
    try {
        if (typeof rawSVG === "undefined") {
            throw"No data was provided.";
        }
        var svgDOM = $(rawSVG);
        if (svgDOM.attr("width") && svgDOM.attr("height")) {
            this.setDimension(svgDOM.attr("width"), svgDOM.attr("height"));
        }
        var findStyle = new RegExp("([a-z0-9-]+) ?: ?([^ ;]+)[ ;]?", "gi");
        svgDOM.children().each(function (i, element) {
            var shape = null;
            var style = null;
            var attr = {};
            var node = element.tagName;
            var index = node.indexOf(":");
            if (index != -1) {
                node = node.substr(index + 1);
            }
            $(element.attributes).each(function () {
                switch (this.nodeName) {
                    case"stroke-dasharray":
                        attr[this.nodeName] = "- ";
                        break;
                    case"style":
                        style = this.nodeValue;
                        break;
                    case"id":
                    case"xml:space":
                        break;
                    default:
                        attr[this.nodeName] = this.nodeValue;
                        break;
                }
            });
            if (style !== null) {
                while (findStyle.exec(style)) {
                    attr[RegExp.$1] = RegExp.$2;
                }
            }
            if (typeof attr["stroke-width"] === "undefined") {
                attr["stroke-width"] = (typeof attr.stroke === "undefined" ? 0 : 1.2);
            }
            switch (node) {
                case"rect":
                    shape = canvas.paper.rect();
                    break;
                case"circle":
                    shape = canvas.paper.circle();
                    break;
                case"ellipse":
                    shape = canvas.paper.ellipse();
                    break;
                case"path":
                    attr.fill = "none";
                    shape = canvas.paper.path(attr.d);
                    break;
                case"line":
                    attr.d = "M " + attr.x1 + " " + attr.y1 + "L" + attr.x2 + " " + attr.y2;
                    attr.fill = "none";
                    shape = canvas.paper.path(attr.d);
                    break;
                case"polyline":
                    var path = attr.points;
                    attr.d = "M " + path.replace(" ", " L");
                    shape = canvas.paper.path(attr.d);
                    break;
                case"polygon":
                    shape = canvas.paper.polygon(attr.points);
                    break;
                case"image":
                    shape = canvas.paper.image();
                    break;
                case"tspan":
                case"text":
                    if (element.childNodes.length > 0) {
                        var child = element.firstChild;
                        do {
                            switch (child.nodeType) {
                                case 2:
                                case 3:
                                case 4:
                                case 5:
                                case 6:
                                case 7:
                                case 8:
                                case 9:
                                case 10:
                                case 11:
                                case 12:
                                    return;
                                case 1:
                            }
                            var subShape = canvas.paper.text(0, 0, $(child).text());
                            var subAttr = {"x": parseFloat(child.attributes.x.value), "y": parseFloat(child.attributes.y.value)};
                            subAttr["text-anchor"] = "start";
                            if (typeof child.attributes["font-size"] !== "undefined") {
                                subAttr["font-size"] = parseInt(child.attributes["font-size"].value);
                            } else {
                                if (typeof attr["font-size"] !== "undefined") {
                                    subAttr["font-size"] = parseInt(attr["font-size"]);
                                }
                            }
                            if (typeof child.attributes["font-family"] !== "undefined") {
                                subAttr["font-family"] = child.attributes["family-family"].value;
                            } else {
                                if (typeof attr["font-family"] !== "undefined") {
                                    subAttr["font-family"] = attr["font-family"];
                                }
                            }
                            subAttr["fill"] = "#000000";
                            if (typeof child.attributes["fill"] !== "undefined") {
                                subAttr["fill"] = child.attributes["fill"].value;
                            } else {
                                if (typeof attr["fill"] !== "undefined") {
                                    subAttr["fill"] = attr["fill"];
                                }
                            }
                            subAttr.y = subAttr.y + subShape.getBBox().height / 2;
                            subShape.attr(subAttr);
                            set.push(subShape);
                        } while (child = child.nextSibling);
                    } else {
                        shape = canvas.paper.text(0, 0, $(element).html());
                        if (typeof attr["fill"] === "undefined") {
                            attr["fill"] = "#000000";
                        }
                        if (typeof attr["text-anchor"] === "undefined") {
                            attr["text-anchor"] = "start";
                        }
                        if (typeof attr["font-size"] !== "undefined") {
                            attr["font-size"] = parseInt(attr["font-size"]);
                        }
                        if (typeof attr["font-family"] !== "undefined") {
                            attr["font-family"] = parseInt(attr["font-family"]);
                        }
                        attr.y = parseFloat(attr.y) + shape.getBBox().height / 2;
                    }
                    break;
            }
            if (shape !== null) {
                shape.attr(attr);
                set.push(shape);
            }
        });
    } catch (error) {
        alert("The SVG data you entered was invalid! (" + error + ")");
    }
    return set;
}});
draw2d.shape.node.Hub = draw2d.shape.basic.Rectangle.extend({NAME: "draw2d.shape.node.Hub", DEFAULT_COLOR: new draw2d.util.Color("#4DF0FE"), BACKGROUND_COLOR: new draw2d.util.Color("#29AA77"), init: function (width, height, label) {
    this.label = null;
    this._super(width, height);
    this.port = this.createPort("hybrid", new draw2d.layout.locator.CenterLocator(this));
    this.CONNECTION_DIR_STRATEGY = [$.proxy(function (conn, relatedPort) {
        return this.getParent().getBoundingBox().getDirection(relatedPort.getAbsolutePosition());
    }, this.port), $.proxy(function (conn, relatedPort) {
        return this.getAbsoluteY() > relatedPort.getAbsoluteY() ? 0 : 2;
    }, this.port), $.proxy(function (conn, relatedPort) {
        return this.getAbsoluteX() > relatedPort.getAbsoluteX() ? 3 : 1;
    }, this.port)];
    this.port.setGlow = $.proxy(this.setGlow, this);
    this.port._orig_hitTest = this.port.hitTest;
    this.port.hitTest = $.proxy(this.hitTest, this);
    this.port.setConnectionAnchor(new draw2d.layout.anchor.ShortesPathConnectionAnchor(this.port));
    this.port.setVisible(false);
    if (typeof height === "undefined") {
        this.setDimension(150, 50);
    }
    this.setConnectionDirStrategy(0);
    this.setColor(this.DEFAULT_COLOR.darker());
    this.setBackgroundColor(this.BACKGROUND_COLOR);
    if (typeof label !== "undefined") {
        this.label = new draw2d.shape.basic.Label(label);
        this.label.setColor("#0d0d0d");
        this.label.setFontColor("#0d0d0d");
        this.label.setStroke(0);
        this.addFigure(this.label, new draw2d.layout.locator.CenterLocator(this));
    }
}, onDragEnter: function (draggedFigure) {
    return this.getHybridPort(0).onDragEnter(draggedFigure);
}, getMinWidth: function () {
    if (this.label !== null) {
        return Math.max(this.label.getMinWidth(), this._super());
    } else {
        return this._super();
    }
}, repaint: function (attributes) {
    if (this.repaintBlocked === true || this.shape === null) {
        return;
    }
    if (typeof attributes === "undefined") {
        attributes = {};
    }
    if (typeof attributes.fill === "undefined") {
        if (this.bgColor !== null) {
            attributes.fill = "90-" + this.bgColor.hash() + ":5-" + this.bgColor.lighter(0.3).hash() + ":95";
        } else {
            attributes.fill = "none";
        }
    }
    this._super(attributes);
}, setConnectionDirStrategy: function (strategy) {
    switch (strategy) {
        case 0:
        case 1:
        case 2:
            this.port.getConnectionDirection = this.CONNECTION_DIR_STRATEGY[strategy];
            break;
    }
}, getPersistentAttributes: function () {
    var memento = this._super();
    memento.dirStrategy = this.CONNECTION_DIR_STRATEGY.indexOf(this.port.getConnectionDirection);
    return memento;
}, setPersistentAttributes: function (memento) {
    this._super(memento);
    if (typeof memento.dirStrategy === "number") {
        this.setConnectionDirStrategy(memento.dirStrategy);
    }
}});
draw2d.shape.node.HorizontalBus = draw2d.shape.node.Hub.extend({NAME: "draw2d.shape.node.HorizontalBus", init: function (width, height, label) {
    this._super(width, height, label);
    this.setConnectionDirStrategy(1);
    this.installEditPolicy(new draw2d.policy.figure.HBusSelectionFeedbackPolicy());
}});
draw2d.shape.node.VerticalBus = draw2d.shape.node.Hub.extend({NAME: "draw2d.shape.node.VerticalBus", init: function (width, height, label) {
    this._super(width, height, label);
    if (this.label !== null) {
        this.label.setRotationAngle(90);
    }
    this.setConnectionDirStrategy(2);
    this.installEditPolicy(new draw2d.policy.figure.VBusSelectionFeedbackPolicy());
}, getMinHeight: function () {
    if (this.shape === null && this.label === null) {
        return 0;
    }
    return this.label.getMinWidth();
}, getMinWidth: function () {
    if (this.shape === null && this.label === null) {
        return 0;
    }
    return this.label.getMinHeight();
}});
draw2d.shape.node.Fulcrum = draw2d.shape.node.Hub.extend({NAME: "draw2d.shape.node.Fulcrum", init: function () {
    this._super(40, 40);
    this.port.setConnectionAnchor(new draw2d.layout.anchor.ConnectionAnchor(this.port));
    this.port.setVisible(true);
    this.port.hitTest = this.port._orig_hitTest;
    this.setConnectionDirStrategy(0);
    this.setColor(null);
    this.setRadius(10);
    this.setBackgroundColor(null);
    this.setStroke(0);
    this.installEditPolicy(new draw2d.policy.figure.AntSelectionFeedbackPolicy());
}, repaint: function (attributes) {
    if (this.repaintBlocked === true || this.shape === null) {
        return;
    }
    if (typeof attributes === "undefined") {
        attributes = {};
    }
    if (typeof attributes.fill === "undefined") {
        attributes.fill = this.bgColor.hash();
    }
    this._super(attributes);
}});
draw2d.shape.basic.Oval = draw2d.VectorFigure.extend({NAME: "draw2d.shape.basic.Oval", init: function (width, height) {
    this._super();
    this.setBackgroundColor("#C02B1D");
    this.setColor("#1B1B1B");
    if ((typeof height === "number") && (typeof width === "number")) {
        this.setDimension(width, height);
    } else {
        this.setDimension(50, 50);
    }
}, createShapeElement: function () {
    var halfW = this.getWidth() / 2;
    var halfH = this.getHeight() / 2;
    return this.canvas.paper.ellipse(this.getAbsoluteX() + halfW, this.getAbsoluteY() + halfH, halfW, halfH);
}, repaint: function (attributes) {
    if (this.repaintBlocked === true || this.shape === null) {
        return;
    }
    if (typeof attributes === "undefined") {
        attributes = {};
    }
    if (typeof attributes.rx === "undefined") {
        attributes.rx = this.width / 2;
        attributes.ry = this.height / 2;
    }
    if (typeof attributes.cx === "undefined") {
        attributes.cx = this.getAbsoluteX() + attributes.rx;
        attributes.cy = this.getAbsoluteY() + attributes.ry;
    }
    this._super(attributes);
}, intersectionWithLine: function (a1, a2) {
    var rx = this.getWidth() / 2;
    var ry = this.getHeight() / 2;
    var result = new draw2d.util.ArrayList();
    var origin = new draw2d.geo.Point(a1.x, a1.y);
    var dir = a2.subtract(a1);
    var center = new draw2d.geo.Point(this.getAbsoluteX() + rx, this.getAbsoluteY() + ry);
    var diff = origin.subtract(center);
    var mDir = new draw2d.geo.Point(dir.x / (rx * rx), dir.y / (ry * ry));
    var mDiff = new draw2d.geo.Point(diff.x / (rx * rx), diff.y / (ry * ry));
    var a = dir.dot(mDir);
    var b = dir.dot(mDiff);
    var c = diff.dot(mDiff) - 1;
    var d = b * b - a * c;
    if (d < 0) {
    } else {
        if (d > 0) {
            var root = Math.sqrt(d);
            var t_a = (-b - root) / a;
            var t_b = (-b + root) / a;
            if ((t_a < 0 || 1 < t_a) && (t_b < 0 || 1 < t_b)) {
                if ((t_a < 0 && t_b < 0) || (t_a > 1 && t_b > 1)) {
                } else {
                }
            } else {
                if (0 <= t_a && t_a <= 1) {
                    result.add(a1.lerp(a2, t_a));
                }
                if (0 <= t_b && t_b <= 1) {
                    result.add(a1.lerp(a2, t_b));
                }
            }
        } else {
            var t = -b / a;
            if (0 <= t && t <= 1) {
                result.add(a1.lerp(a2, t));
            } else {
            }
        }
    }
    return result;
}});
draw2d.shape.basic.Circle = draw2d.shape.basic.Oval.extend({NAME: "draw2d.shape.basic.Circle", init: function (radius) {
    this._super();
    if (typeof radius === "number") {
        this.setDimension(radius, radius);
    } else {
        this.setDimension(40, 40);
    }
}, setDimension: function (w, h) {
    if (w > h) {
        this._super(w, w);
    } else {
        this._super(h, h);
    }
}, isStrechable: function () {
    return false;
}});
draw2d.shape.basic.Label = draw2d.SetFigure.extend({NAME: "draw2d.shape.basic.Label", FONT_FALLBACK: {"Georgia": "Georgia, serif", "Palatino Linotype": '"Palatino Linotype", "Book Antiqua", Palatino, serif', "Times New Roman": '"Times New Roman", Times, serif', "Arial": "Arial, Helvetica, sans-serif", "Arial Black": '"Arial Black", Gadget, sans-serif', "Comic Sans MS": '"Comic Sans MS", cursive, sans-serif', "Impact": "Impact, Charcoal, sans-serif", "Lucida Sans Unicode": '"Lucida Sans Unicode", "Lucida Grande", sans-serif', "Tahoma, Geneva": "Tahoma, Geneva, sans-seri", "Trebuchet MS": '"Trebuchet MS", Helvetica, sans-serif', "Verdana": "Verdana, Geneva, sans-serif", "Courier New": '"Courier New", Courier, monospace', "Lucida Console": '"Lucida Console", Monaco, monospace'}, init: function (text) {
    this._super();
    if (typeof text === "string") {
        this.text = text;
    } else {
        this.text = "";
    }
    this.cachedWidth = null;
    this.cachedHeight = null;
    this.cachedMinWidth = null;
    this.cachedMinHeight = null;
    this.fontSize = 12;
    this.fontColor = new draw2d.util.Color("#080808");
    this.fontFamily = null;
    this.padding = 4;
    this.bold = false;
    this.setStroke(1);
    this.setDimension(10, 10);
    this.editor = null;
    this.installEditPolicy(new draw2d.policy.figure.AntSelectionFeedbackPolicy());
}, createSet: function () {
    return this.canvas.paper.text(0, 0, this.text);
}, repaint: function (attributes) {
    if (this.repaintBlocked === true || this.shape === null) {
        return;
    }
    this.cachedWidth = null;
    this.cachedHeight = null;
    this.cachedMinWidth = null;
    this.cachedMinHeight = null;
    var lattr = {};
    lattr.text = this.text;
    lattr.x = this.padding;
    lattr.y = this.getHeight() / 2;
    lattr["font-weight"] = (this.bold === true) ? "bold" : "normal";
    lattr["text-anchor"] = "start";
    lattr["font-size"] = this.fontSize;
    if (this.fontFamily !== null) {
        lattr["font-family"] = this.fontFamily;
    }
    lattr.fill = this.fontColor.hash();
    this.svgNodes.attr(lattr);
    this._super(attributes);
}, applyTransformation: function () {
    this.shape.transform("R" + this.rotationAngle);
    this.svgNodes.transform("R" + this.rotationAngle + "T" + this.getAbsoluteX() + "," + this.getAbsoluteY());
}, isResizeable: function () {
    return false;
}, setFontSize: function (size) {
    this.cachedMinWidth = null;
    this.cachedMinHeight = null;
    this.fontSize = size;
    this.repaint();
}, setBold: function (bold) {
    this.cachedMinWidth = null;
    this.cachedMinHeight = null;
    this.bold = bold;
    this.repaint();
}, setFontColor: function (color) {
    this.fontColor = new draw2d.util.Color(color);
    this.repaint();
}, getFontColor: function () {
    return this.fontColor;
}, setPadding: function (padding) {
    this.cachedMinWidth = null;
    this.cachedMinHeight = null;
    this.cachedWidth = null;
    this.cachedHeight = null;
    this.padding = padding;
    this.repaint();
}, setFontFamily: function (font) {
    this.cachedMinWidth = null;
    this.cachedMinHeight = null;
    this.cachedWidth = null;
    this.cachedHeight = null;
    if ((typeof font !== "undefined") && font !== null && typeof this.FONT_FALLBACK[font] !== "undefined") {
        font = this.FONT_FALLBACK[font];
    }
    this.fontFamily = font;
    this.repaint();
}, setDimension: function (w, h) {
    this.cachedWidth = null;
    this.cachedHeight = null;
    this._super(w, h);
}, getMinWidth: function () {
    if (this.shape === null) {
        return 0;
    }
    if (this.cachedMinWidth === null) {
        this.cachedMinWidth = this.svgNodes.getBBox(true).width + 2 * this.padding + 2 * this.getStroke();
    }
    return this.cachedMinWidth;
}, getMinHeight: function () {
    if (this.shape === null) {
        return 0;
    }
    if (this.cachedMinHeight === null) {
        this.cachedMinHeight = this.svgNodes.getBBox(true).height + 2 * this.padding + 2 * this.getStroke();
    }
    return this.cachedMinHeight;
}, getWidth: function () {
    if (this.shape === null) {
        return 0;
    }
    if (this.cachedWidth === null) {
        this.cachedWidth = Math.max(this.width, this.getMinWidth());
    }
    return this.cachedWidth;
}, getHeight: function () {
    if (this.shape === null) {
        return 0;
    }
    if (this.cachedHeight === null) {
        this.cachedHeight = Math.max(this.height, this.getMinHeight());
    }
    return this.cachedHeight;
}, installEditor: function (editor) {
    this.editor = editor;
}, onDoubleClick: function () {
    if (this.editor !== null) {
        this.editor.start(this);
    }
}, getText: function () {
    return this.text;
}, setText: function (text) {
    this.cachedWidth = null;
    this.cachedHeight = null;
    this.cachedMinWidth = null;
    this.cachedMinHeight = null;
    this.text = text;
    this.repaint();
    this.editPolicy.each($.proxy(function (i, e) {
        if (e instanceof draw2d.policy.figure.DragDropEditPolicy) {
            e.moved(this.canvas, this);
        }
    }, this));
    this.fireResizeEvent();
    if (this.parent !== null) {
        this.parent.repaint();
    }
}, hitTest: function (x, y) {
    if (this.rotationAngle === 0) {
        return this._super(x, y);
    }
    var matrix = this.shape.matrix;
    var points = this.getBoundingBox().getPoints();
    points.each(function (i, point) {
        var x = matrix.x(point.x, point.y);
        var y = matrix.y(point.x, point.y);
        point.x = x;
        point.y = y;
    });
    var polySides = 4;
    var i = 0;
    var j = polySides - 1;
    var oddNodes = false;
    for (i = 0; i < polySides; i++) {
        var pi = points.get(i);
        var pj = points.get(j);
        if ((pi.y < y && pj.y >= y || pj.y < y && pi.y >= y) && (pi.x <= x || pj.x <= x)) {
            if (pi.x + (y - pi.y) / (pj.y - pi.y) * (pj.x - pi.x) < x) {
                oddNodes = !oddNodes;
            }
        }
        j = i;
    }
    return oddNodes;
}, getPersistentAttributes: function () {
    var memento = this._super();
    memento.text = this.text;
    memento.fontSize = this.fontSize;
    memento.fontColor = this.fontColor.hash();
    memento.fontFamily = this.fontFamily;
    return memento;
}, setPersistentAttributes: function (memento) {
    this._super(memento);
    if (typeof memento.text !== "undefined") {
        this.setText(memento.text);
    }
    if (typeof memento.fontFamily !== "undefined") {
        this.setFontFamily(memento.fontFamily);
    }
    if (typeof memento.fontSize !== "undefined") {
        this.setFontSize(memento.fontSize);
    }
    if (typeof memento.fontColor !== "undefined") {
        this.setFontColor(memento.fontColor);
    }
}});
draw2d.shape.basic.Line = draw2d.Figure.extend({NAME: "draw2d.shape.basic.Line", DEFAULT_COLOR: new draw2d.util.Color(0, 0, 0), init: function (startX, startY, endX, endY) {
    this.repaintBlocked = false;
    this.corona = 10;
    this.isGlowing = false;
    this.lineColor = this.DEFAULT_COLOR;
    this.stroke = 1;
    this.dasharray = null;
    if (typeof endY === "number") {
        this.start = new draw2d.geo.Point(startX, startY);
        this.end = new draw2d.geo.Point(endX, endY);
    } else {
        this.start = new draw2d.geo.Point(30, 30);
        this.end = new draw2d.geo.Point(100, 100);
    }
    this.basePoints = new draw2d.util.ArrayList();
    this.basePoints.add(this.start);
    this.basePoints.add(this.end);
    this._super();
    this.installEditPolicy(new draw2d.policy.line.LineSelectionFeedbackPolicy());
    this.setSelectable(true);
    this.setDeleteable(true);
}, onDrag: function (dx, dy, dx2, dy2) {
    if (this.command === null) {
        return;
    }
    this.command.setTranslation(dx, dy);
    this.getPoints().each(function (i, e) {
        e.translate(dx2, dy2);
    });
    this._super(dx, dy, dx2, dy2);
    this.svgPathString = null;
    this.repaint();
}, onDragEnd: function () {
    this.setAlpha(this.originalAlpha);
    this.isInDragDrop = false;
    if (this.command === null) {
        return;
    }
    this.getPoints().each($.proxy(function (i, e) {
        e.translate(-this.command.dx, -this.command.dy);
    }, this));
    this.canvas.getCommandStack().execute(this.command);
    this.command = null;
    this.isMoving = false;
    this.editPolicy.each($.proxy(function (i, e) {
        if (e instanceof draw2d.policy.figure.DragDropEditPolicy) {
            e.onDragEnd(this.canvas, this);
        }
    }, this));
    this.fireMoveEvent();
}, setDashArray: function (dash) {
    this.dasharray = dash;
    return this;
}, setCoronaWidth: function (width) {
    this.corona = width;
    return this;
}, createShapeElement: function () {
    return this.canvas.paper.path("M" + this.start.x + " " + this.start.y + "L" + this.end.x + " " + this.end.y);
}, repaint: function (attributes) {
    if (this.repaintBlocked === true || this.shape === null) {
        return;
    }
    if (typeof attributes === "undefined") {
        attributes = {"stroke": "#" + this.lineColor.hex(), "stroke-width": this.stroke, "path": ["M", this.start.x, this.start.y, "L", this.end.x, this.end.y].join(" ")};
    } else {
        if (typeof attributes.path === "undefined") {
            attributes.path = ["M", this.start.x, this.start.y, "L", this.end.x, this.end.y].join(" ");
        }
        attributes.stroke = this.lineColor.hash();
        attributes["stroke-width"] = this.stroke;
    }
    if (this.dasharray !== null) {
        attributes["stroke-dasharray"] = this.dasharray;
    }
    this._super(attributes);
}, setGlow: function (flag) {
    if (this.isGlowing === flag) {
        return;
    }
    if (flag === true) {
        this._lineColor = this.lineColor;
        this._stroke = this.stroke;
        this.setColor(draw2d.util.Color("#3f72bf"));
        this.setStroke((this.stroke * 4) | 0);
    } else {
        this.setColor(this._lineColor);
        this.setStroke(this._stroke);
    }
    this.isGlowing = flag;
    return this;
}, isResizeable: function () {
    return true;
}, setStroke: function (w) {
    this.stroke = w;
    this.repaint();
    return this;
}, setColor: function (color) {
    this.lineColor = new draw2d.util.Color(color);
    this.repaint();
    return this;
}, getColor: function () {
    return this.lineColor;
}, setStartPoint: function (x, y) {
    if (this.start.x === x && this.start.y === y) {
        return;
    }
    this.start.setPosition(x, y);
    this.repaint();
    this.editPolicy.each($.proxy(function (i, e) {
        if (e instanceof draw2d.policy.figure.DragDropEditPolicy) {
            e.moved(this.canvas, this);
        }
    }, this));
    return this;
}, setEndPoint: function (x, y) {
    if (this.end.x === x && this.end.y === y) {
        return;
    }
    this.end.setPosition(x, y);
    this.repaint();
    this.editPolicy.each($.proxy(function (i, e) {
        if (e instanceof draw2d.policy.figure.DragDropEditPolicy) {
            e.moved(this.canvas, this);
        }
    }, this));
    return this;
}, getStartX: function () {
    return this.start.x;
}, getStartY: function () {
    return this.start.y;
}, getStartPoint: function () {
    return this.start.clone();
}, getEndX: function () {
    return this.end.x;
}, getEndY: function () {
    return this.end.y;
}, getEndPoint: function () {
    return this.end.clone();
}, getPoints: function () {
    return this.basePoints;
}, getSegments: function () {
    var result = new draw2d.util.ArrayList();
    result.add({start: this.getStartPoint(), end: this.getEndPoint()});
    return result;
}, getLength: function () {
    if (this.shape !== null) {
        return this.shape.getTotalLength();
    }
    return Math.sqrt((this.start.x - this.end.x) * (this.start.x - this.end.x) + (this.start.y - this.end.y) * (this.start.y - this.end.y));
}, getAngle: function () {
    var length = this.getLength();
    var angle = -(180 / Math.PI) * Math.asin((this.start.y - this.end.y) / length);
    if (angle < 0) {
        if (this.end.x < this.start.x) {
            angle = Math.abs(angle) + 180;
        } else {
            angle = 360 - Math.abs(angle);
        }
    } else {
        if (this.end.x < this.start.x) {
            angle = 180 - angle;
        }
    }
    return angle;
}, createCommand: function (request) {
    if (request.getPolicy() === draw2d.command.CommandType.MOVE) {
        if (this.isDraggable()) {
            return new draw2d.command.CommandMoveLine(this);
        }
    }
    if (request.getPolicy() === draw2d.command.CommandType.DELETE) {
        if (this.isDeleteable() === false) {
            return null;
        }
        return new draw2d.command.CommandDelete(this);
    }
    return null;
}, hitTest: function (px, py) {
    return draw2d.shape.basic.Line.hit(this.corona, this.start.x, this.start.y, this.end.x, this.end.y, px, py);
}, intersection: function (other) {
    var result = new draw2d.util.ArrayList();
    if (other === this) {
        return result;
    }
    var segments1 = this.getSegments();
    var segments2 = other.getSegments();
    segments1.each(function (i, s1) {
        segments2.each(function (j, s2) {
            var p = draw2d.shape.basic.Line.intersection(s1.start, s1.end, s2.start, s2.end);
            if (p !== null) {
                result.add(p);
            }
        });
    });
    return result;
}, getPersistentAttributes: function () {
    var memento = this._super();
    delete memento.x;
    delete memento.y;
    delete memento.width;
    delete memento.height;
    memento.stroke = this.stroke;
    memento.color = this.getColor().hash();
    if (this.editPolicy.getSize() > 0) {
        memento.policy = this.editPolicy.getFirstElement().NAME;
    }
    return memento;
}, setPersistentAttributes: function (memento) {
    this._super(memento);
    if (typeof memento.stroke !== "undefined") {
        this.setStroke(parseInt(memento.stroke));
    }
    if (typeof memento.color !== "undefined") {
        this.setColor(memento.color);
    }
    if (typeof memento.policy !== "undefined") {
        this.installEditPolicy(eval("new " + memento.policy + "()"));
    }
}});
draw2d.shape.basic.Line.intersection = function (a1, a2, b1, b2) {
    var result = null;
    var ua_t = (b2.x - b1.x) * (a1.y - b1.y) - (b2.y - b1.y) * (a1.x - b1.x);
    var ub_t = (a2.x - a1.x) * (a1.y - b1.y) - (a2.y - a1.y) * (a1.x - b1.x);
    var u_b = (b2.y - b1.y) * (a2.x - a1.x) - (b2.x - b1.x) * (a2.y - a1.y);
    if (u_b != 0) {
        var ua = ua_t / u_b;
        var ub = ub_t / u_b;
        if (0 <= ua && ua <= 1 && 0 <= ub && ub <= 1) {
            result = new draw2d.geo.Point((a1.x + ua * (a2.x - a1.x)) | 0, (a1.y + ua * (a2.y - a1.y)) | 0);
            result.justTouching = (0 == ua || ua == 1 || 0 == ub || ub == 1);
        }
    }
    return result;
};
draw2d.shape.basic.Line.hit = function (coronaWidth, X1, Y1, X2, Y2, px, py) {
    X2 -= X1;
    Y2 -= Y1;
    px -= X1;
    py -= Y1;
    var dotprod = px * X2 + py * Y2;
    var projlenSq;
    if (dotprod <= 0) {
        projlenSq = 0;
    } else {
        px = X2 - px;
        py = Y2 - py;
        dotprod = px * X2 + py * Y2;
        if (dotprod <= 0) {
            projlenSq = 0;
        } else {
            projlenSq = dotprod * dotprod / (X2 * X2 + Y2 * Y2);
        }
    }
    var lenSq = px * px + py * py - projlenSq;
    if (lenSq < 0) {
        lenSq = 0;
    }
    return Math.sqrt(lenSq) < coronaWidth;
};
draw2d.shape.basic.PolyLine = draw2d.shape.basic.Line.extend({NAME: "draw2d.shape.basic.PolyLine", init: function (router) {
    this.svgPathString = null;
    this.oldPoint = null;
    this.router = router || draw2d.shape.basic.PolyLine.DEFAULT_ROUTER;
    this.routingRequired = true;
    this.lineSegments = new draw2d.util.ArrayList();
    this._super();
}, setStartPoint: function (x, y) {
    this.repaintBlocked = true;
    this._super(x, y);
    this.calculatePath();
    this.repaintBlocked = false;
    this.repaint();
}, setEndPoint: function (x, y) {
    this.repaintBlocked = true;
    this._super(x, y);
    this.calculatePath();
    this.repaintBlocked = false;
    this.repaint();
}, setJunctionPoint: function (index, x, y) {
    var junctionPoint = this.basePoints.get(index);
    if (junctionPoint === null || (junctionPoint.x === x && junctionPoint.y === y)) {
        return;
    }
    junctionPoint.x = x;
    junctionPoint.y = y;
    this.svgPathString = null;
    this.repaint();
    this.editPolicy.each($.proxy(function (i, e) {
        if (e instanceof draw2d.policy.figure.DragDropEditPolicy) {
            e.moved(this.canvas, this);
        }
    }, this));
    return this;
}, insertJunctionPointAt: function (index, x, y) {
    var junctionPoint = new draw2d.geo.Point(x, y);
    this.basePoints.insertElementAt(junctionPoint, index);
    this.svgPathString = null;
    this.repaint();
    if (!this.selectionHandles.isEmpty()) {
        this.editPolicy.each($.proxy(function (i, e) {
            if (e instanceof draw2d.policy.figure.SelectionFeedbackPolicy) {
                e.onUnselect(this.canvas, this);
                e.onSelect(this.canvas, this);
            }
        }, this));
    }
    return this;
}, removeJunctionPointAt: function (index) {
    var removedPoint = this.basePoints.removeElementAt(index);
    this.svgPathString = null;
    this.repaint();
    if (!this.selectionHandles.isEmpty()) {
        this.editPolicy.each($.proxy(function (i, e) {
            if (e instanceof draw2d.policy.figure.SelectionFeedbackPolicy) {
                e.onUnselect(this.canvas, this);
                e.onSelect(this.canvas, this);
            }
        }, this));
    }
    return removedPoint;
}, setRouter: function (router) {
    if (this.router !== null) {
        this.router.onUninstall(this);
    }
    if (typeof router === "undefined" || router === null) {
        this.router = new draw2d.layout.connection.NullRouter();
    } else {
        this.router = router;
    }
    this.router.onInstall(this);
    this.routingRequired = true;
    this.repaint();
}, getRouter: function () {
    return this.router;
}, calculatePath: function () {
    if (this.shape === null) {
        return;
    }
    this.svgPathString = null;
    var oldBasePoints = this.basePoints;
    this.oldPoint = null;
    this.lineSegments = new draw2d.util.ArrayList();
    this.basePoints = new draw2d.util.ArrayList();
    this.router.route(this, oldBasePoints);
    this.routingRequired = false;
}, repaint: function () {
    if (this.repaintBlocked === true || this.shape === null) {
        return;
    }
    if (this.svgPathString === null || this.routingRequired === true) {
        this.calculatePath();
    }
    this._super({path: this.svgPathString, "stroke-linejoin": "round"});
}, onDragEnter: function (draggedFigure) {
    this.setGlow(true);
    return this;
}, onDragLeave: function (draggedFigure) {
    this.setGlow(false);
}, getSegments: function () {
    return this.lineSegments;
}, addPoint: function (p, y) {
    if (typeof y !== "undefined") {
        p = new draw2d.geo.Point(p, y);
    }
    this.basePoints.add(p);
    if (this.oldPoint !== null) {
        this.lineSegments.add({start: this.oldPoint, end: p});
    }
    this.svgPathString = null;
    this.oldPoint = p;
}, onOtherFigureIsMoving: function (figure) {
    this.repaintBlocked = true;
    this._super(figure);
    this.calculatePath();
    this.repaintBlocked = false;
    this.repaint();
}, hitTest: function (px, py) {
    for (var i = 0; i < this.lineSegments.getSize(); i++) {
        var line = this.lineSegments.get(i);
        if (draw2d.shape.basic.Line.hit(this.corona, line.start.x, line.start.y, line.end.x, line.end.y, px, py)) {
            return true;
        }
    }
    return false;
}, createCommand: function (request) {
    if (request.getPolicy() === draw2d.command.CommandType.DELETE) {
        if (this.isDeleteable() === true) {
            return new draw2d.command.CommandDelete(this);
        }
    } else {
        if (request.getPolicy() === draw2d.command.CommandType.MOVE_JUNCTION) {
            if (this.isResizeable() === true) {
                return new draw2d.command.CommandMoveJunction(this);
            }
        }
    }
    return this._super(request);
}, getPersistentAttributes: function () {
    var memento = this._super();
    memento.router = this.router.NAME;
    memento = this.router.getPersistentAttributes(this, memento);
    return memento;
}, setPersistentAttributes: function (memento) {
    this._super(memento);
    if (typeof memento.router !== "undefined") {
        this.setRouter(eval("new " + memento.router + "()"));
    }
    this.router.setPersistentAttributes(this, memento);
}});
draw2d.shape.basic.PolyLine.DEFAULT_ROUTER = new draw2d.layout.connection.ManhattanConnectionRouter();
draw2d.shape.basic.Diamond = draw2d.VectorFigure.extend({NAME: "draw2d.shape.basic.Diamond", init: function (width, height) {
    this._super();
    this.setBackgroundColor("#00a3f6");
    this.setColor("#1B1B1B");
    if (typeof width === "undefined") {
        this.setDimension(50, 90);
    } else {
        this.setDimension(width, height);
    }
}, repaint: function (attributes) {
    if (this.repaintBlocked === true || this.shape === null) {
        return;
    }
    if (typeof attributes === "undefined") {
        attributes = {};
    }
    var box = this.getBoundingBox();
    var path = ["M", box.x + (box.w / 2), " ", box.y];
    path.push("L", box.x + box.w, " ", box.y + box.h / 2);
    path.push("L", box.x + box.w / 2, " ", box.y + box.h);
    path.push("L", box.x, " ", box.y + box.h / 2);
    path.push("L", box.x + box.w / 2, " ", box.y);
    attributes.path = path.join("");
    this._super(attributes);
}, createShapeElement: function () {
    return this.canvas.paper.path("M0 0L1 1");
}});
draw2d.shape.basic.Image = draw2d.shape.node.Node.extend({NAME: "draw2d.shape.basic.Image", init: function (path, width, height) {
    this.path = path;
    this._super(width, height);
}, setPath: function (path) {
    this.path = path;
    this.repaint();
    return this;
}, getPath: function () {
    return this.path;
}, repaint: function (attributes) {
    if (this.repaintBlocked === true || this.shape === null) {
        return;
    }
    if (typeof attributes === "undefined") {
        attributes = {};
    }
    attributes.x = this.getAbsoluteX();
    attributes.y = this.getAbsoluteY();
    attributes.width = this.getWidth();
    attributes.height = this.getHeight();
    attributes.src = this.path;
    this._super(attributes);
}, createShapeElement: function () {
    return this.canvas.paper.image(this.path, this.getX(), this.getY(), this.getWidth(), this.getHeight());
}, getPersistentAttributes: function () {
    var memento = this._super();
    memento.path = this.path;
    return memento;
}, setPersistentAttributes: function (memento) {
    this._super(memento);
    if (typeof memento.path !== "undefined") {
        this.setPath(memento.path);
    }
}});
draw2d.Connection = draw2d.shape.basic.PolyLine.extend({NAME: "draw2d.Connection", init: function (router) {
    this._super(router);
    this.sourcePort = null;
    this.targetPort = null;
    this.oldPoint = null;
    this.sourceDecorator = null;
    this.targetDecorator = null;
    this.sourceDecoratorNode = null;
    this.targetDecoratorNode = null;
    this.setColor("#1B1B1B");
    this.setStroke(1);
    this.isMoving = false;
}, disconnect: function () {
    if (this.sourcePort !== null) {
        this.sourcePort.detachMoveListener(this);
        this.fireSourcePortRouteEvent();
    }
    if (this.targetPort !== null) {
        this.targetPort.detachMoveListener(this);
        this.fireTargetPortRouteEvent();
    }
}, reconnect: function () {
    if (this.sourcePort !== null) {
        this.sourcePort.attachMoveListener(this);
        this.fireSourcePortRouteEvent();
    }
    if (this.targetPort !== null) {
        this.targetPort.attachMoveListener(this);
        this.fireTargetPortRouteEvent();
    }
    this.routingRequired = true;
    this.repaint();
}, isResizeable: function () {
    return this.isDraggable();
}, addFigure: function (child, locator) {
    if (!(locator instanceof draw2d.layout.locator.ConnectionLocator)) {
        throw"Locator must implement the class draw2d.layout.locator.ConnectionLocator";
    }
    this._super(child, locator);
}, setSourceDecorator: function (decorator) {
    this.sourceDecorator = decorator;
    this.routingRequired = true;
    if (this.sourceDecoratorNode !== null) {
        this.sourceDecoratorNode.remove();
        this.sourceDecoratorNode = null;
    }
    this.repaint();
}, getSourceDecorator: function () {
    return this.sourceDecorator;
}, setTargetDecorator: function (decorator) {
    this.targetDecorator = decorator;
    this.routingRequired = true;
    if (this.targetDecoratorNode !== null) {
        this.targetDecoratorNode.remove();
        this.targetDecoratorNode = null;
    }
    this.repaint();
}, getTargetDecorator: function () {
    return this.targetDecorator;
}, calculatePath: function () {
    if (this.sourcePort === null || this.targetPort === null) {
        return;
    }
    this._super();
}, repaint: function (attributes) {
    if (this.repaintBlocked === true || this.shape === null) {
        return;
    }
    if (this.sourcePort === null || this.targetPort === null) {
        return;
    }
    this._super(attributes);
    if (this.targetDecorator !== null && this.targetDecoratorNode === null) {
        this.targetDecoratorNode = this.targetDecorator.paint(this.getCanvas().paper);
    }
    if (this.sourceDecorator !== null && this.sourceDecoratorNode === null) {
        this.sourceDecoratorNode = this.sourceDecorator.paint(this.getCanvas().paper);
    }
    if (this.sourceDecoratorNode !== null) {
        var start = this.getPoints().get(0);
        this.sourceDecoratorNode.transform("r" + this.getStartAngle() + "," + start.x + "," + start.y + " t" + start.x + "," + start.y);
        this.sourceDecoratorNode.attr({"stroke": "#" + this.lineColor.hex(), opacity: this.alpha});
        this.sourceDecoratorNode.forEach($.proxy(function (shape) {
            shape.node.setAttribute("class", this.cssClass !== null ? this.cssClass : "");
        }, this));
    }
    if (this.targetDecoratorNode !== null) {
        var end = this.getPoints().getLastElement();
        this.targetDecoratorNode.transform("r" + this.getEndAngle() + "," + end.x + "," + end.y + " t" + end.x + "," + end.y);
        this.targetDecoratorNode.attr({"stroke": "#" + this.lineColor.hex(), opacity: this.alpha});
        this.targetDecoratorNode.forEach($.proxy(function (shape) {
            shape.node.setAttribute("class", this.cssClass !== null ? this.cssClass : "");
        }, this));
    }
}, getAbsoluteX: function () {
    return 0;
}, getAbsoluteY: function () {
    return 0;
}, postProcess: function (postProcessCache) {
    this.router.postProcess(this, this.getCanvas(), postProcessCache);
}, onDragEnter: function (draggedFigure) {
    if (draggedFigure instanceof draw2d.shape.basic.LineResizeHandle) {
        return null;
    }
    return this;
}, onDragLeave: function (draggedFigure) {
}, getStartPoint: function () {
    if (this.isMoving === false) {
        return this.sourcePort.getConnectionAnchorLocation(this.targetPort.getConnectionAnchorReferencePoint());
    } else {
        return this._super();
    }
}, getEndPoint: function () {
    if (this.isMoving === false) {
        return this.targetPort.getConnectionAnchorLocation(this.sourcePort.getConnectionAnchorReferencePoint());
    } else {
        return this._super();
    }
}, setSource: function (port) {
    if (this.sourcePort !== null) {
        this.sourcePort.detachMoveListener(this);
        this.sourcePort.onDisconnect(this);
    }
    this.sourcePort = port;
    if (this.sourcePort === null) {
        return;
    }
    this.routingRequired = true;
    this.fireSourcePortRouteEvent();
    this.sourcePort.attachMoveListener(this);
    if (this.canvas !== null) {
        this.sourcePort.onConnect(this);
    }
    this.setStartPoint(port.getAbsoluteX(), port.getAbsoluteY());
}, getSource: function () {
    return this.sourcePort;
}, setTarget: function (port) {
    if (this.targetPort !== null) {
        this.targetPort.detachMoveListener(this);
        this.targetPort.onDisconnect(this);
    }
    this.targetPort = port;
    if (this.targetPort === null) {
        return;
    }
    this.routingRequired = true;
    this.fireTargetPortRouteEvent();
    this.targetPort.attachMoveListener(this);
    if (this.canvas !== null) {
        this.targetPort.onConnect(this);
    }
    this.setEndPoint(port.getAbsoluteX(), port.getAbsoluteY());
}, getTarget: function () {
    return this.targetPort;
}, sharingPorts: function (other) {
    return this.sourcePort == other.sourcePort || this.sourcePort == other.targetPort || this.targetPort == other.sourcePort || this.targetPort == other.targetPort;
}, setCanvas: function (canvas) {
    this._super(canvas);
    if (this.sourceDecoratorNode !== null) {
        this.sourceDecoratorNode.remove();
        this.sourceDecoratorNode = null;
    }
    if (this.targetDecoratorNode !== null) {
        this.targetDecoratorNode.remove();
        this.targetDecoratorNode = null;
    }
    if (this.canvas === null) {
        this.router.onUninstall(this);
        if (this.sourcePort !== null) {
            this.sourcePort.detachMoveListener(this);
            this.sourcePort.onDisconnect(this);
        }
        if (this.targetPort !== null) {
            this.targetPort.detachMoveListener(this);
            this.targetPort.onDisconnect(this);
        }
    } else {
        this.router.onInstall(this);
        if (this.sourcePort !== null) {
            this.sourcePort.attachMoveListener(this);
            this.sourcePort.onConnect(this);
        }
        if (this.targetPort !== null) {
            this.targetPort.attachMoveListener(this);
            this.targetPort.onConnect(this);
        }
    }
}, onOtherFigureIsMoving: function (figure) {
    if (figure === this.sourcePort) {
        this.setStartPoint(this.sourcePort.getAbsoluteX(), this.sourcePort.getAbsoluteY());
    } else {
        this.setEndPoint(this.targetPort.getAbsoluteX(), this.targetPort.getAbsoluteY());
    }
    this._super(figure);
}, getStartAngle: function () {
    if (this.lineSegments.getSize() === 0) {
        return 0;
    }
    var p1 = this.lineSegments.get(0).start;
    var p2 = this.lineSegments.get(0).end;
    if (this.router instanceof draw2d.layout.connection.SplineConnectionRouter) {
        p2 = this.lineSegments.get(5).end;
    }
    var length = Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));
    var angle = -(180 / Math.PI) * Math.asin((p1.y - p2.y) / length);
    if (angle < 0) {
        if (p2.x < p1.x) {
            angle = Math.abs(angle) + 180;
        } else {
            angle = 360 - Math.abs(angle);
        }
    } else {
        if (p2.x < p1.x) {
            angle = 180 - angle;
        }
    }
    return angle;
}, getEndAngle: function () {
    if (this.lineSegments.getSize() === 0) {
        return 90;
    }
    var p1 = this.lineSegments.get(this.lineSegments.getSize() - 1).end;
    var p2 = this.lineSegments.get(this.lineSegments.getSize() - 1).start;
    if (this.router instanceof draw2d.layout.connection.SplineConnectionRouter) {
        p2 = this.lineSegments.get(this.lineSegments.getSize() - 5).end;
    }
    var length = Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));
    var angle = -(180 / Math.PI) * Math.asin((p1.y - p2.y) / length);
    if (angle < 0) {
        if (p2.x < p1.x) {
            angle = Math.abs(angle) + 180;
        } else {
            angle = 360 - Math.abs(angle);
        }
    } else {
        if (p2.x < p1.x) {
            angle = 180 - angle;
        }
    }
    return angle;
}, fireSourcePortRouteEvent: function () {
    var connections = this.sourcePort.getConnections();
    for (var i = 0; i < connections.getSize(); i++) {
        connections.get(i).repaint();
    }
}, fireTargetPortRouteEvent: function () {
    var connections = this.targetPort.getConnections();
    for (var i = 0; i < connections.getSize(); i++) {
        connections.get(i).repaint();
    }
}, createCommand: function (request) {
    if (request.getPolicy() === draw2d.command.CommandType.MOVE_BASEPOINT) {
        return new draw2d.command.CommandReconnect(this);
    }
    return this._super(request);
}, getPersistentAttributes: function () {
    var memento = this._super();
    var parentNode = this.getSource().getParent();
    while (parentNode.getParent() !== null) {
        parentNode = parentNode.getParent();
    }
    memento.source = {node: parentNode.getId(), port: this.getSource().getName()};
    var parentNode = this.getTarget().getParent();
    while (parentNode.getParent() !== null) {
        parentNode = parentNode.getParent();
    }
    memento.target = {node: parentNode.getId(), port: this.getTarget().getName()};

    return memento;
}, setPersistentAttributes: function (memento) {
    this._super(memento);
    // [Modification] added by disi 13-08-11T16:49
    // [Reason]1 make targetDecorator persistable
    // [Reason]2 make modelLevel persistable
    // [Reason]3 make domainId persistable
    // [Reason]4 make entityType persistable
    // [Reason]5 make lineType persistable
    // [Reason]5 make dashType persistable
    // [Reason]5 make alias persistable
    this.targetDecoratorName = memento.targetDecoratorName;
    this.modelLevel = memento.modelLevel;
    this.domainId = memento.domainId;
    this.entityType = 'connection';
    this.userData = memento.userData ?  memento.userData : {};
    this.lineType = memento.lineType;
    this.dashType = memento.dashType;
    this.docId = memento.docId;
    this.alias = 'connection';
    if(this.targetDecoratorName === 'ArrowDecorator'){
        if(this.lineType === 'sqc'){
            this.setSourceDecorator(new draw2d.decoration.connection.ArrowDecorator());
        }else{
            this.setTargetDecorator(new draw2d.decoration.connection.ArrowDecorator());
        }

    }
    if(this.dashType){
        this.setDashArray(this.dashType);
    }
    // [End of Modification] added by disi 13-08-11T16:49
}});
draw2d.Connection.createConnection = function (sourcePort, targetPort) {
    return new draw2d.Connection();
};
draw2d.Connection.DEFAULT_ROUTER = new draw2d.layout.connection.ManhattanConnectionRouter();
draw2d.VectorFigure = draw2d.shape.node.Node.extend({NAME: "draw2d.VectorFigure", init: function () {
    this.stroke = 1;
    this.bgColor = new draw2d.util.Color(255, 255, 255);
    this.lineColor = new draw2d.util.Color(128, 128, 255);
    this.color = new draw2d.util.Color(128, 128, 128);
    this.strokeBeforeGlow = this.stroke;
    this.glowIsActive = false;
    this._super();
}, setGlow: function (flag) {
    if (flag === this.glowIsActive) {
        return this;
    }
    this.glowIsActive = flag;
    if (flag === true) {
        this.strokeBeforeGlow = this.getStroke();
        this.setStroke(this.strokeBeforeGlow * 2.5);
    } else {
        this.setStroke(this.strokeBeforeGlow);
    }
    return this;
}, repaint: function (attributes) {
    if (this.repaintBlocked === true || this.shape === null) {
        return;
    }
    if (typeof attributes === "undefined") {
        attributes = {};
    }
    attributes.x = this.getAbsoluteX();
    attributes.y = this.getAbsoluteY();
    if (typeof attributes.stroke === "undefined") {
        if (this.color === null || this.stroke === 0) {
            attributes.stroke = "none";
        } else {
            attributes.stroke = this.color.hash();
        }
    }
    attributes["stroke-width"] = this.stroke;
    if (typeof attributes.fill === "undefined") {
        attributes.fill = this.bgColor.hash();
    }
    this._super(attributes);
}, setBackgroundColor: function (color) {
    this.bgColor = new draw2d.util.Color(color);
    this.repaint();
    return this;
}, getBackgroundColor: function () {
    return this.bgColor;
}, setStroke: function (w) {
    this.stroke = w;
    this.repaint();
    return this;
}, getStroke: function () {
    return this.stroke;
}, setColor: function (color) {
    this.color = new draw2d.util.Color(color);
    this.repaint();
    return this;
}, getColor: function () {
    return this.color;
}});
draw2d.ResizeHandle = draw2d.shape.basic.Rectangle.extend({NAME: "draw2d.ResizeHandle", DEFAULT_COLOR: "#00bdee", init: function (figure, type) {
    this._super();
    this.isResizeHandle = true;
    this.owner = figure;
    this.type = type;
    this.command = null;
    this.commandMove = null;
    this.commandResize = null;
    this.setDimension();
    this.setBackgroundColor(this.DEFAULT_COLOR);
    this.setColor("#7A7A7A");
    this.setStroke(1);
    this.setSelectable(false);
    this.setRadius(0);
}, select: function (asPrimarySelection) {
}, unselect: function () {
}, getSnapToDirection: function () {
    switch (this.type) {
        case 1:
            return draw2d.SnapToHelper.NORTH_WEST;
        case 2:
            return draw2d.SnapToHelper.NORTH;
        case 3:
            return draw2d.SnapToHelper.NORTH_EAST;
        case 4:
            return draw2d.SnapToHelper.EAST;
        case 5:
            return draw2d.SnapToHelper.SOUTH_EAST;
        case 6:
            return draw2d.SnapToHelper.SOUTH;
        case 7:
            return draw2d.SnapToHelper.SOUTH_WEST;
        case 8:
            return draw2d.SnapToHelper.WEST;
        case 9:
            return draw2d.SnapToHelper.NSEW;
        default:
            return draw2d.SnapToHelper.EAST;
    }
}, createShapeElement: function () {
    var shape = this._super();
    switch (this.type) {
        case 1:
            shape.attr({"cursor": "nw-resize"});
            break;
        case 2:
            shape.attr({"cursor": "n-resize"});
            break;
        case 3:
            shape.attr({"cursor": "ne-resize"});
            break;
        case 4:
            shape.attr({"cursor": "e-resize"});
            break;
        case 5:
            shape.attr({"cursor": "se-resize"});
            break;
        case 6:
            shape.attr({"cursor": "s-resize"});
            break;
        case 7:
            shape.attr({"cursor": "sw-resize"});
            break;
        case 8:
            shape.attr({"cursor": "w-resize"});
            break;
    }
    return shape;
}, onDragStart: function () {
    if (!this.isDraggable()) {
        return false;
    }
    this.ox = this.getAbsoluteX();
    this.oy = this.getAbsoluteY();
    this.commandMove = this.owner.createCommand(new draw2d.command.CommandType(draw2d.command.CommandType.MOVE));
    this.commandResize = this.owner.createCommand(new draw2d.command.CommandType(draw2d.command.CommandType.RESIZE));
    return true;
}, onDrag: function (dx, dy, dx2, dy2) {
    if (this.isDraggable() === false) {
        return;
    }
    var oldX = this.getAbsoluteX();
    var oldY = this.getAbsoluteY();
    this._super(dx, dy, dx2, dy2);
    var diffX = this.getAbsoluteX() - oldX;
    var diffY = this.getAbsoluteY() - oldY;
    var obj = this.owner;
    var objPosX = obj.getAbsoluteX();
    var objPosY = obj.getAbsoluteY();
    var objWidth = obj.getWidth();
    var objHeight = obj.getHeight();
    switch (this.type) {
        case 1:
            obj.setDimension(objWidth - diffX, objHeight - diffY);
            obj.setPosition(objPosX + (objWidth - obj.getWidth()), objPosY + (objHeight - obj.getHeight()));
            break;
        case 2:
            obj.setDimension(objWidth, objHeight - diffY);
            obj.setPosition(objPosX, objPosY + (objHeight - obj.getHeight()));
            break;
        case 3:
            obj.setDimension(objWidth + diffX, objHeight - diffY);
            obj.setPosition(objPosX, objPosY + (objHeight - obj.getHeight()));
            break;
        case 4:
            obj.setDimension(objWidth + diffX, objHeight);
            break;
        case 5:
            obj.setDimension(objWidth + diffX, objHeight + diffY);
            break;
        case 6:
            obj.setDimension(objWidth, objHeight + diffY);
            break;
        case 7:
            obj.setDimension(objWidth - diffX, objHeight + diffY);
            obj.setPosition(objPosX + (objWidth - obj.getWidth()), objPosY);
            break;
        case 8:
            obj.setDimension(objWidth - diffX, objHeight);
            obj.setPosition(objPosX + (objWidth - obj.getWidth()), objPosY);
            break;
    }
}, onDragEnd: function () {
    if (!this.isDraggable()) {
        return;
    }
    if (this.commandMove !== null) {
        this.commandMove.setPosition(this.owner.getX(), this.owner.getY());
        this.canvas.getCommandStack().execute(this.commandMove);
        this.commandMove = null;
    }
    if (this.commandResize !== null) {
        this.commandResize.setDimension(this.owner.getWidth(), this.owner.getHeight());
        this.canvas.getCommandStack().execute(this.commandResize);
        this.commandResize = null;
    }
    this.canvas.hideSnapToHelperLines();
}, setPosition: function (x, y) {
    if (x instanceof draw2d.geo.Point) {
        this.x = x.x;
        this.y = x.y;
    } else {
        this.x = x;
        this.y = y;
    }
    this.repaint();
}, setDimension: function (width, height) {
    if (typeof height !== "undefined") {
        this._super(width, height);
    } else {
        if (draw2d.isTouchDevice) {
            this._super(15, 15);
        } else {
            this._super(8, 8);
        }
    }
    var offset = this.getWidth();
    var offset2 = offset / 2;
    switch (this.type) {
        case 1:
            this.setSnapToGridAnchor(new draw2d.geo.Point(offset, offset));
            break;
        case 2:
            this.setSnapToGridAnchor(new draw2d.geo.Point(offset2, offset));
            break;
        case 3:
            this.setSnapToGridAnchor(new draw2d.geo.Point(0, offset));
            break;
        case 4:
            this.setSnapToGridAnchor(new draw2d.geo.Point(0, offset2));
            break;
        case 5:
            this.setSnapToGridAnchor(new draw2d.geo.Point(0, 0));
            break;
        case 6:
            this.setSnapToGridAnchor(new draw2d.geo.Point(offset2, 0));
            break;
        case 7:
            this.setSnapToGridAnchor(new draw2d.geo.Point(offset, 0));
            break;
        case 8:
            this.setSnapToGridAnchor(new draw2d.geo.Point(offset, offset2));
            break;
        case 9:
            this.setSnapToGridAnchor(new draw2d.geo.Point(offset2, offset2));
            break;
    }
}, show: function (canvas) {
    this.setCanvas(canvas);
    this.canvas.resizeHandles.add(this);
    this.shape.toFront();
}, hide: function () {
    if (this.shape === null) {
        return;
    }
    this.canvas.resizeHandles.remove(this);
    this.setCanvas(null);
}, repaint: function (attributes) {
    if (this.repaintBlocked === true || this.shape === null) {
        return;
    }
    if (typeof attributes === "undefined") {
        attributes = {};
    }
    if (this.getAlpha() < 0.9) {
        attributes.fill = "#e6e6e8";
    } else {
        attributes.fill = "90-#b8c8ec-#e6e6e8";
    }
    this._super(attributes);
}, supportsSnapToHelper: function () {
    return true;
}, onKeyDown: function (keyCode, ctrl) {
    this.canvas.onKeyDown(keyCode, ctrl);
}, fireMoveEvent: function () {
}});
draw2d.shape.basic.LineResizeHandle = draw2d.shape.basic.Circle.extend({NAME: "draw2d.shape.basic.LineResizeHandle", init: function (figure) {
    this._super();
    this.owner = figure;
    this.isResizeHandle = true;
    if (draw2d.isTouchDevice) {
        this.setDimension(20, 20);
    } else {
        this.setDimension(10, 10);
    }
    this.setBackgroundColor("#00bdee");
    this.setColor("#7A7A7A");
    this.setStroke(1);
    this.setSelectable(false);
    this.currentTarget = null;
}, createShapeElement: function () {
    var shape = this._super();
    shape.attr({"cursor": "move"});
    return shape;
}, select: function (asPrimarySelection) {
}, unselect: function () {
}, getRelatedPort: function () {
    return null;
}, getOppositePort: function () {
    return null;
}, repaint: function (attributes) {
    if (this.repaintBlocked === true || this.shape === null) {
        return;
    }
    if (typeof attributes === "undefined") {
        attributes = {};
    }
    if (this.getAlpha() < 0.9) {
        attributes.fill = "#b4e391";
    } else {
        attributes.fill = "r(.4,.3)#b4e391-#61c419:60-#299a0b";
    }
    this._super(attributes);
}, onDragStart: function () {
    this.command = this.getCanvas().getCurrentSelection().createCommand(new draw2d.command.CommandType(draw2d.command.CommandType.MOVE_BASEPOINT));
    return true;
}, onDrag: function (dx, dy, dx2, dy2) {
    this.setPosition(this.x + dx2, this.y + dy2);
    var port = this.getOppositePort();
    var target = port !== null ? port.getDropTarget(this.getX(), this.getY(), null) : null;
    if (target !== this.currentTarget) {
        if (this.currentTarget !== null) {
            this.currentTarget.onDragLeave(port);
            this.currentTarget.setGlow(false);
        }
        if (target !== null) {
            this.currentTarget = target.onDragEnter(port);
            if (this.currentTarget !== null) {
                this.currentTarget.setGlow(true);
            }
        }
    }
    return true;
}, onDragEnd: function () {
    if (!this.isDraggable()) {
        return false;
    }
    var port = this.getOppositePort();
    if (port !== null) {
        if (this.currentTarget !== null) {
            this.onDrop(this.currentTarget);
            this.currentTarget.onDragLeave(port);
            this.currentTarget.setGlow(false);
            this.currentTarget = null;
        }
    }
    this.owner.isMoving = false;
    if (this.getCanvas().getCurrentSelection() instanceof draw2d.Connection) {
        if (this.command !== null) {
            this.command.cancel();
        }
    } else {
        if (this.command !== null) {
            this.getCanvas().getCommandStack().execute(this.command);
        }
    }
    this.command = null;
    this.getCanvas().hideSnapToHelperLines();
    return true;
}, relocate: function () {
}, supportsSnapToHelper: function () {
    if (this.getCanvas().getCurrentSelection() instanceof draw2d.Connection) {
        return false;
    }
    return true;
}, show: function (canvas, x, y) {
    this.setCanvas(canvas);
    this.setPosition(x, y);
    this.shape.toFront();
    this.canvas.resizeHandles.add(this);
}, hide: function () {
    if (this.shape === null) {
        return;
    }
    this.canvas.resizeHandles.remove(this);
    this.setCanvas(null);
}, onKeyDown: function (keyCode, ctrl) {
    this.canvas.onKeyDown(keyCode, ctrl);
}, fireMoveEvent: function () {
}});
draw2d.shape.basic.LineStartResizeHandle = draw2d.shape.basic.LineResizeHandle.extend({NAME: "draw2d.shape.basic.LineStartResizeHandle", init: function (figure) {
    this._super(figure);
}, getRelatedPort: function () {
    if (this.owner instanceof draw2d.Connection) {
        return this.owner.getSource();
    }
    return null;
}, getOppositePort: function () {
    if (this.owner instanceof draw2d.Connection) {
        return this.owner.getTarget();
    }
    return null;
}, onDrag: function (dx, dy, dx2, dy2) {
    this._super(dx, dy, dx2, dy2);
    var objPos = this.owner.getStartPoint();
    objPos.translate(dx2, dy2);
    this.owner.setStartPoint(objPos.x, objPos.y);
    this.owner.isMoving = true;
    return true;
}, onDrop: function (dropTarget) {
    this.owner.isMoving = false;
    if (this.owner instanceof draw2d.Connection && this.command !== null) {
        this.command.setNewPorts(dropTarget, this.owner.getTarget());
        this.getCanvas().getCommandStack().execute(this.command);
    }
    this.command = null;
}, relocate: function () {
    var resizeWidthHalf = this.getWidth() / 2;
    var resizeHeightHalf = this.getHeight() / 2;
    var anchor = this.owner.getStartPoint();
    this.setPosition(anchor.x - resizeWidthHalf, anchor.y - resizeHeightHalf);
}});
draw2d.shape.basic.LineEndResizeHandle = draw2d.shape.basic.LineResizeHandle.extend({NAME: "draw2d.shape.basic.LineEndResizeHandle", init: function (figure) {
    this._super(figure);
}, getRelatedPort: function () {
    if (this.owner instanceof draw2d.Connection) {
        return this.owner.getTarget();
    }
    return null;
}, getOppositePort: function () {
    if (this.owner instanceof draw2d.Connection) {
        return this.owner.getSource();
    }
    return null;
}, onDrag: function (dx, dy, dx2, dy2) {
    this._super(dx, dy, dx2, dy2);
    var objPos = this.owner.getEndPoint();
    objPos.translate(dx2, dy2);
    this.owner.setEndPoint(objPos.x, objPos.y);
    this.owner.isMoving = true;
    return true;
}, onDrop: function (dropTarget) {
    this.owner.isMoving = false;
    if (this.owner instanceof draw2d.Connection && this.command !== null) {
        this.command.setNewPorts(this.owner.getSource(), dropTarget);
        this.getCanvas().getCommandStack().execute(this.command);
    }
    this.command = null;
}, relocate: function () {
    var resizeWidthHalf = this.getWidth() / 2;
    var resizeHeightHalf = this.getHeight() / 2;
    var anchor = this.owner.getEndPoint();
    this.setPosition(anchor.x - resizeWidthHalf, anchor.y - resizeHeightHalf);
}});
draw2d.shape.basic.JunctionResizeHandle = draw2d.shape.basic.LineResizeHandle.extend({NAME: "draw2d.shape.basic.JunctionResizeHandle", SNAP_THRESHOLD: 3, LINE_COLOR: "#1387E6", FADEOUT_DURATION: 300, init: function (figure, index) {
    this._super(figure);
    this.index = index;
    this.isDead = false;
    this.vline = null;
    this.hline = null;
}, onDoubleClick: function () {
    var cmd = new draw2d.command.CommandRemoveJunctionPoint(this.owner, this.index);
    this.getCanvas().getCommandStack().execute(cmd);
    this.isDead = true;
}, onDragStart: function () {
    if (this.isDead === true) {
        return;
    }
    this._super();
    this.command = this.getCanvas().getCurrentSelection().createCommand(new draw2d.command.CommandType(draw2d.command.CommandType.MOVE_JUNCTION));
    if (this.command != null) {
        this.command.setIndex(this.index);
    }
    this.junctionPoint = this.owner.getPoints().get(this.index).clone();
}, onDrag: function (dx, dy, dx2, dy2) {
    if (this.isDead === true || this.command == null) {
        return false;
    }
    this.setPosition(this.x + dx2, this.y + dy2);
    this.junctionPoint.translate(dx2, dy2);
    this.owner.setJunctionPoint(this.index, this.junctionPoint.x, this.junctionPoint.y);
    this.command.updatePosition(this.junctionPoint.x, this.junctionPoint.y);
    var points = this.owner.getPoints();
    var left = points.get(this.index - 1);
    var right = points.get(this.index + 1);
    if (Math.abs(left.x - this.junctionPoint.x) < this.SNAP_THRESHOLD) {
        this.showVerticalLine(left.x);
    } else {
        if (Math.abs(right.x - this.junctionPoint.x) < this.SNAP_THRESHOLD) {
            this.showVerticalLine(right.x);
        } else {
            this.hideVerticalLine();
        }
    }
    if (Math.abs(left.y - this.junctionPoint.y) < this.SNAP_THRESHOLD) {
        this.showHorizontalLine(left.y);
    } else {
        if (Math.abs(right.y - this.junctionPoint.y) < this.SNAP_THRESHOLD) {
            this.showHorizontalLine(right.y);
        } else {
            this.hideHorizontalLine();
        }
    }
    return true;
}, onDragEnd: function () {
    if (this.isDead === true || this.command === null) {
        return false;
    }
    this.hideVerticalLine();
    this.hideHorizontalLine();
    var points = this.owner.getPoints();
    var left = points.get(this.index - 1);
    var right = points.get(this.index + 1);
    if (Math.abs(left.x - this.junctionPoint.x) < this.SNAP_THRESHOLD) {
        this.command.updatePosition(left.x, this.junctionPoint.y);
    } else {
        if (Math.abs(right.x - this.junctionPoint.x) < this.SNAP_THRESHOLD) {
            this.command.updatePosition(right.x, this.junctionPoint.y);
        }
    }
    if (Math.abs(left.y - this.junctionPoint.y) < this.SNAP_THRESHOLD) {
        this.command.updatePosition(this.junctionPoint.x, left.y);
    } else {
        if (Math.abs(right.y - this.junctionPoint.y) < this.SNAP_THRESHOLD) {
            this.command.updatePosition(this.junctionPoint.x, right.y);
        }
    }
    var stack = this.getCanvas().getCommandStack();
    stack.startTransaction();
    try {
        stack.execute(this.command);
        this.command = null;
        this.getCanvas().hideSnapToHelperLines();
        var angle = this.getEnclosingAngle();
        if (angle > 178) {
            var cmd = new draw2d.command.CommandRemoveJunctionPoint(this.owner, this.index);
            stack.execute(cmd);
        }
    } finally {
        stack.commitTransaction();
    }
    return true;
}, relocate: function () {
    var resizeWidthHalf = this.getWidth() / 2;
    var resizeHeightHalf = this.getHeight() / 2;
    var anchor = this.owner.getPoints().get(this.index);
    this.setPosition(anchor.x - resizeWidthHalf, anchor.y - resizeHeightHalf);
}, getEnclosingAngle: function () {
    var points = this.owner.getPoints();
    var trans = this.junctionPoint.getScaled(-1);
    var left = points.get(this.index - 1).getTranslated(trans);
    var right = points.get(this.index + 1).getTranslated(trans);
    var dot = left.dot(right);
    var acos = Math.acos(dot / (left.length() * right.length()));
    return acos * 180 / Math.PI;
}, showVerticalLine: function (x) {
    if (this.vline != null) {
        return;
    }
    this.vline = this.canvas.paper.path("M " + x + " 0 l 0 " + this.canvas.getHeight()).attr({"stroke": this.LINE_COLOR, "stroke-width": 1});
}, hideVerticalLine: function () {
    if (this.vline == null) {
        return;
    }
    var tmp = this.vline;
    tmp.animate({opacity: 0.1}, this.FADEOUT_DURATION, function () {
        tmp.remove();
    });
    this.vline = null;
}, showHorizontalLine: function (y) {
    if (this.hline != null) {
        return;
    }
    this.hline = this.canvas.paper.path("M 0 " + y + " l " + this.canvas.getWidth() + " 0").attr({"stroke": this.LINE_COLOR, "stroke-width": 1});
}, hideHorizontalLine: function () {
    if (this.hline == null) {
        return;
    }
    var tmp = this.hline;
    tmp.animate({opacity: 0.1}, this.FADEOUT_DURATION, function () {
        tmp.remove();
    });
    this.hline = null;
}});
draw2d.shape.basic.GhostJunctionResizeHandle = draw2d.shape.basic.LineResizeHandle.extend({NAME: "draw2d.shape.basic.GhostJunctionResizeHandle", init: function (figure, precursorIndex) {
    this._super(figure);
    this.precursorIndex = precursorIndex;
    this.setAlpha(0.35);
}, createShapeElement: function () {
    var shape = this._super();
    shape.attr({"cursor": "pointer"});
    return shape;
}, onClick: function () {
    var cmd = new draw2d.command.CommandAddJunctionPoint(this.owner, this.precursorIndex + 1, this.getAbsoluteX() + this.getWidth() / 2, this.getAbsoluteY() + this.getHeight() / 2);
    this.getCanvas().getCommandStack().execute(cmd);
}, onDrag: function (dx, dy, dx2, dy2) {
    return true;
}, onDragEnd: function () {
    return true;
}, relocate: function () {
    var p1 = this.owner.getPoints().get(this.precursorIndex);
    var p2 = this.owner.getPoints().get(this.precursorIndex + 1);
    var x = ((p2.x - p1.x) / 2 + p1.x - this.getWidth() / 2) | 0;
    var y = ((p2.y - p1.y) / 2 + p1.y - this.getHeight() / 2) | 0;
    this.setPosition(x, y);
}});
draw2d.Port = draw2d.shape.basic.Circle.extend({NAME: "draw2d.Port", DEFAULT_BORDER_COLOR: new draw2d.util.Color("#1B1B1B"), init: function (name) {
    this.locator = null;
    this.lighterBgColor = null;
    this._super();
    if (draw2d.isTouchDevice) {
        this.setDimension(25, 25);
    } else {
        this.setDimension(10, 10);
    }
    this.ox = this.x;
    this.oy = this.y;
    this.coronaWidth = 5;
    this.corona = null;
    this.currentTargetPort = null;
    this.currentTarget = null;
    this.setBackgroundColor("#4f6870");
    this.setStroke(1);
    this.setColor(this.DEFAULT_BORDER_COLOR);
    this.setSelectable(false);
    if (typeof name === "undefined") {
        this.name = null;
    } else {
        this.name = name;
    }
    this.connectionAnchor = new draw2d.layout.anchor.ConnectionAnchor(this);
    this.value = null;
    this.maxFanOut = Number.MAX_VALUE;
    this.setCanSnapToHelper(false);
    this.installEditPolicy(new draw2d.policy.port.IntrusivePortsFeedbackPolicy());
}, setMaxFanOut: function (count) {
    this.maxFanOut = Math.max(1, count);
    return this;
}, getMaxFanOut: function () {
    return this.maxFanOut;
}, setConnectionAnchor: function (anchor) {
    if (typeof anchor === "undefined" || anchor === null) {
        anchor = new draw2d.layout.anchor.ConnectionAnchor();
    }
    this.connectionAnchor = anchor;
    this.connectionAnchor.setOwner(this);
    return this;
}, getConnectionAnchorLocation: function (referencePoint) {
    return this.connectionAnchor.getLocation(referencePoint);
}, getConnectionAnchorReferencePoint: function () {
    return this.connectionAnchor.getReferencePoint();
}, getConnectionDirection: function (conn, relatedPort) {
    return this.getParent().getBoundingBox().getDirection(this.getAbsolutePosition());
}, setLocator: function (locator) {
    this.locator = locator;
    return this;
}, setBackgroundColor: function (color) {
    this._super(color);
    this.lighterBgColor = this.bgColor.lighter(0.3).hash();
    return this;
}, setValue: function (value) {
    this.value = value;
    if (this.getParent() !== null) {
        this.getParent().onPortValueChanged(this);
    }
    return this;
}, getValue: function () {
    return this.value;
}, repaint: function (attributes) {
    if (this.repaintBlocked === true || this.shape === null) {
        return;
    }
    if (typeof attributes === "undefined") {
        attributes = {};
    }
    attributes.cx = this.getAbsoluteX();
    attributes.cy = this.getAbsoluteY();
    attributes.rx = this.width / 2;
    attributes.ry = attributes.rx;
    attributes.cursor = "move";
    if (this.getAlpha() < 0.9) {
        attributes.fill = this.bgColor.hash();
    } else {
        attributes.fill = ["90", this.bgColor.hash(), this.lighterBgColor].join("-");
    }
    this._super(attributes);
}, onMouseEnter: function () {
    this.setStroke(2);
}, onMouseLeave: function () {
    this.setStroke(1);
}, getConnections: function () {
    var result = new draw2d.util.ArrayList();
    var size = this.moveListener.getSize();
    for (var i = 0; i < size; i++) {
        var target = this.moveListener.get(i);
        if (target instanceof draw2d.Connection) {
            result.add(target);
        }
    }
    return result;
}, setParent: function (parent) {
    this._super(parent);
    if (this.parent !== null) {
        this.parent.detachMoveListener(this);
    }
    if (this.parent !== null) {
        this.parent.attachMoveListener(this);
    }
}, getCoronaWidth: function () {
    return this.coronaWidth;
}, setCoronaWidth: function (width) {
    this.coronaWidth = width;
}, onDragStart: function () {
    if (this.getConnections().getSize() >= this.maxFanOut) {
        return false;
    }
    if (this.isInDragDrop === true) {
        this.onDragEnd();
    }
    this.getShapeElement().toFront();
    this.ox = this.x;
    this.oy = this.y;
    this.editPolicy.each($.proxy(function (i, e) {
        if (e instanceof draw2d.policy.figure.DragDropEditPolicy) {
            e.onDragStart(this.canvas, this);
        }
    }, this));
    return true;
}, onDrag: function (dx, dy) {
    this.isInDragDrop = true;
    this._super(dx, dy);
    var target = this.getDropTarget(this.getAbsoluteX(), this.getAbsoluteY(), this);
    if (target !== this.currentTarget) {
        if (this.currentTarget !== null) {
            this.currentTarget.onDragLeave(this);
            this.editPolicy.each($.proxy(function (i, e) {
                if (e instanceof draw2d.policy.port.PortFeedbackPolicy) {
                    e.onHoverLeave(this.canvas, this, this.currentTarget);
                }
            }, this));
        }
        if (target !== null) {
            this.currentTarget = target.onDragEnter(this);
            if (this.currentTarget !== null) {
                this.currentTargetPort = target;
                this.editPolicy.each($.proxy(function (i, e) {
                    if (e instanceof draw2d.policy.port.PortFeedbackPolicy) {
                        e.onHoverEnter(this.canvas, this, this.currentTarget);
                    }
                }, this));
            }
        } else {
            this.currentTarget = null;
        }
    }
}, onDragEnd: function () {
    this.setAlpha(1);
    this.setPosition(this.ox, this.oy);
    this.isInDragDrop = false;
    if (this.currentTarget) {
        this.editPolicy.each($.proxy(function (i, e) {
            if (e instanceof draw2d.policy.port.PortFeedbackPolicy) {
                e.onHoverLeave(this.canvas, this, this.currentTarget);
            }
        }, this));
    }
    this.editPolicy.each($.proxy(function (i, e) {
        if (e instanceof draw2d.policy.figure.DragDropEditPolicy) {
            e.onDragEnd(this.canvas, this);
        }
    }, this));
    this.currentTarget = null;
}, onDragEnter: function (draggedFigure) {
    if (!(draggedFigure instanceof draw2d.Port)) {
        return null;
    }
    if (this.getConnections().getSize() >= this.maxFanOut) {
        return null;
    }
    var request = new draw2d.command.CommandType(draw2d.command.CommandType.CONNECT);
    request.canvas = this.parent.getCanvas();
    request.source = this;
    request.target = draggedFigure;
    var command = draggedFigure.createCommand(request);
    if (command === null) {
        return null;
    }
    return this;
}, onDragLeave: function (figure) {
    if (!(figure instanceof draw2d.Port)) {
        return;
    }
}, onDrop: function (dropTarget) {
    if (!(dropTarget instanceof draw2d.Port)) {
        return;
    }
    var request = new draw2d.command.CommandType(draw2d.command.CommandType.CONNECT);
    request.canvas = this.parent.getCanvas();
    request.source = dropTarget;
    request.target = this;
    var command = this.createCommand(request);
    if (command !== null) {
        this.parent.getCanvas().getCommandStack().execute(command);
    }
    this.setGlow(false);
}, onConnect: function (connection) {
}, onDisconnect: function (connection) {
}, onOtherFigureIsMoving: function (figure) {
    this.repaint();
    this.fireMoveEvent();
}, getName: function () {
    return this.name;
}, setName: function (name) {
    this.name = name;
}, hitTest: function (iX, iY) {
    var x = this.getAbsoluteX() - (this.coronaWidth * 2) - this.getWidth() / 2;
    var y = this.getAbsoluteY() - (this.coronaWidth * 2) - this.getHeight() / 2;
    var iX2 = x + this.width + (this.coronaWidth * 2);
    var iY2 = y + this.height + (this.coronaWidth * 2);
    return(iX >= x && iX <= iX2 && iY >= y && iY <= iY2);
}, setGlow: function (flag) {
    if (flag === true && this.corona === null) {
        this.corona = new draw2d.Corona();
        this.corona.setDimension(this.getWidth() + (this.getCoronaWidth() * 2), this.getWidth() + (this.getCoronaWidth() * 2));
        this.corona.setPosition(this.getAbsoluteX() - this.getCoronaWidth() - this.getWidth() / 2, this.getAbsoluteY() - this.getCoronaWidth() - this.getHeight() / 2);
        this.corona.setCanvas(this.getCanvas());
        this.corona.getShapeElement();
        this.corona.repaint();
    } else {
        if (flag === false && this.corona !== null) {
            this.corona.setCanvas(null);
            this.parent.getCanvas().removeFigure(this.corona);
            this.corona = null;
        }
    }
    return this;
}, createCommand: function (request) {
    if (request.getPolicy() === draw2d.command.CommandType.MOVE) {
        if (!this.isDraggable()) {
            return null;
        }
        return new draw2d.command.CommandMovePort(this);
    }
    if (request.getPolicy() === draw2d.command.CommandType.CONNECT) {
        if (request.source.parent.id === request.target.parent.id) {
            return null;
        } else {
            return new draw2d.command.CommandConnect(request.canvas, request.source, request.target, request.source);
        }
    }
    return null;
}, fireMoveEvent: function () {
    if (this.isInDragDrop === true) {
        return;
    }
    this._super();
}, getDropTarget: function (x, y, portToIgnore) {
    for (var i = 0; i < this.targets.getSize(); i++) {
        var target = this.targets.get(i);
        if (target !== portToIgnore) {
            if (target.hitTest(x, y) === true) {
                return target;
            }
        }
    }
    return null;
}, getDropTargets: function () {
    return this.targets.clone().grep($.proxy(function (element) {
        return element !== this;
    }, this));
}});
draw2d.Corona = draw2d.shape.basic.Circle.extend({init: function () {
    this._super();
    this.setAlpha(0.3);
    this.setBackgroundColor(new draw2d.util.Color(178, 225, 255));
    this.setColor(new draw2d.util.Color(102, 182, 252));
}, setAlpha: function (percent) {
    this._super(Math.min(0.3, percent));
    this.setDeleteable(false);
    this.setDraggable(false);
    this.setResizeable(false);
    this.setSelectable(false);
    return this;
}});
draw2d.InputPort = draw2d.Port.extend({NAME: "draw2d.InputPort", init: function (name) {
    this._super(name);
    this.locator = new draw2d.layout.locator.InputPortLocator();
}, onDragEnter: function (figure) {
    if (figure instanceof draw2d.OutputPort) {
        return this._super(figure);
    }
    if (figure instanceof draw2d.HybridPort) {
        return this._super(figure);
    }
    return null;
}, onDragLeave: function (figure) {
    if (figure instanceof draw2d.OutputPort) {
        this._super(figure);
    } else {
        if (figure instanceof draw2d.HybridPort) {
            this._super(figure);
        }
    }
}, createCommand: function (request) {
    if (request.getPolicy() === draw2d.command.CommandType.CONNECT) {
        if (request.source.getParent().getId() === request.target.getParent().getId()) {
            return null;
        }
        if (request.source instanceof draw2d.OutputPort) {
            return new draw2d.command.CommandConnect(request.canvas, request.source, request.target, request.source);
        }
        if (request.source instanceof draw2d.HybridPort) {
            return new draw2d.command.CommandConnect(request.canvas, request.source, request.target, request.source);
        }
        return null;
    }
    return this._super(request);
}});
draw2d.OutputPort = draw2d.Port.extend({NAME: "draw2d.OutputPort", init: function (name) {
    this._super(name);
    this.locator = new draw2d.layout.locator.OutputPortLocator();
}, onDragEnter: function (figure) {
    if (figure instanceof draw2d.InputPort) {
        return this._super(figure);
    }
    if (figure instanceof draw2d.HybridPort) {
        return this._super(figure);
    }
    return null;
}, onDragLeave: function (figure) {
    if (figure instanceof draw2d.InputPort) {
        this._super(figure);
    } else {
        if (figure instanceof draw2d.HybridPort) {
            this._super(figure);
        }
    }
}, createCommand: function (request) {
    if (request.getPolicy() === draw2d.command.CommandType.CONNECT) {
        if (request.source.getParent().getId() === request.target.getParent().getId()) {
            return null;
        }
        if (request.source instanceof draw2d.InputPort) {
            return new draw2d.command.CommandConnect(request.canvas, request.target, request.source, request.source);
        }
        if (request.source instanceof draw2d.HybridPort) {
            return new draw2d.command.CommandConnect(request.canvas, request.target, request.source, request.source);
        }
        return null;
    }
    return this._super(request);
}});
draw2d.HybridPort = draw2d.Port.extend({NAME: "draw2d.HybridPort", init: function (name) {
    this._super(name);
    this.locator = new draw2d.layout.locator.InputPortLocator();
}, onDragEnter: function (figure) {
    if (figure instanceof draw2d.Port) {
        return this._super(figure);
    }
    return null;
}, onDragLeave: function (figure) {
    if (!(figure instanceof draw2d.Port)) {
        return;
    }
    if (figure instanceof draw2d.Port) {
        this._super(figure);
    }
}, createCommand: function (request) {
    if (request.getPolicy() === draw2d.command.CommandType.CONNECT) {
        if (request.source.getParent().getId() === request.target.getParent().getId()) {
            return null;
        }
        if (request.source instanceof draw2d.InputPort) {
            return new draw2d.command.CommandConnect(request.canvas, request.target, request.source, request.source);
        } else {
            if (request.source instanceof draw2d.OutputPort) {
                return new draw2d.command.CommandConnect(request.canvas, request.source, request.target, request.source);
            } else {
                if (request.source instanceof draw2d.HybridPort) {
                    return new draw2d.command.CommandConnect(request.canvas, request.target, request.source, request.source);
                }
            }
        }
        return null;
    }
    return this._super(request);
}});
draw2d.layout.anchor.ConnectionAnchor = Class.extend({NAME: "draw2d.layout.anchor.ConnectionAnchor", init: function (owner) {
    this.owner = owner;
}, getLocation: function (reference) {
    return this.getReferencePoint();
}, getOwner: function () {
    return this.owner;
}, setOwner: function (owner) {
    if (typeof owner === "undefined") {
        throw"Missing parameter for 'owner' in ConnectionAnchor.setOwner";
    }
    this.owner = owner;
}, getBox: function () {
    return this.getOwner().getAbsoluteBounds();
}, getReferencePoint: function () {
    return this.getOwner().getAbsolutePosition();
}});
draw2d.layout.anchor.ChopboxConnectionAnchor = draw2d.layout.anchor.ConnectionAnchor.extend({NAME: "draw2d.layout.anchor.ChopboxConnectionAnchor", init: function (owner) {
    this._super(owner);
}, getLocation: function (reference) {
    var r = new draw2d.geo.Rectangle(0, 0);
    r.setBounds(this.getBox());
    r.translate(-1, -1);
    r.resize(1, 1);
    var center = r.getCenter();
    if (r.isEmpty() || (reference.x == center.x && reference.y == center.y)) {
        return center;
    }
    var dx = reference.x - center.x;
    var dy = reference.y - center.y;
    var scale = 0.5 / Math.max(Math.abs(dx) / r.w, Math.abs(dy) / r.h);
    dx *= scale;
    dy *= scale;
    center.translate(dx, dy);
    return center;
}, getBox: function () {
    return this.getOwner().getParent().getBoundingBox();
}, getReferencePoint: function () {
    return this.getBox().getCenter();
}});
draw2d.layout.anchor.ShortesPathConnectionAnchor = draw2d.layout.anchor.ConnectionAnchor.extend({NAME: "draw2d.layout.anchor.ShortesPathConnectionAnchor", init: function (owner) {
    this._super(owner);
}, getLocation: function (ref) {
    var r = this.getOwner().getParent().getBoundingBox();
    var center = r.getCenter();
    if (this.getOwner().getParent() instanceof draw2d.shape.basic.Oval) {
        var result = this.getOwner().getParent().intersectionWithLine(ref, center);
        if (result.getSize() == 1) {
            return result.get(0);
        } else {
            console.log("error");
        }
    }
    var octant = r.determineOctant(new draw2d.geo.Rectangle(ref.x, ref.y, 2, 2));
    switch (octant) {
        case 0:
            return r.getTopLeft();
        case 1:
            return new draw2d.geo.Point(ref.x, r.getTop());
        case 2:
            return r.getTopRight();
        case 3:
            return new draw2d.geo.Point(r.getRight(), ref.y);
        case 4:
            return r.getBottomRight();
        case 5:
            return new draw2d.geo.Point(ref.x, r.getBottom());
        case 6:
            return r.getBottomLeft();
        case 7:
            return new draw2d.geo.Point(r.getLeft(), ref.y);
    }
    return r.getTopLeft();
}, getBox: function () {
    return this.getOwner().getParent().getBoundingBox();
}, getReferencePoint: function () {
    return this.getBox().getCenter();
}});
draw2d.layout.anchor.CenterEdgeConnectionAnchor = draw2d.layout.anchor.ConnectionAnchor.extend({NAME: "draw2d.layout.anchor.CenterEdgeConnectionAnchor", init: function (owner) {
    this._super(owner);
}, getLocation: function (ref) {
    var r = this.getOwner().getParent().getBoundingBox();
    var dir = r.getDirection(ref);
    var center = r.getCenter();
    switch (dir) {
        case 0:
            center.y = r.y;
            break;
        case 1:
            center.x = r.x + r.w;
            break;
        case 2:
            center.y = r.y + r.h;
            break;
        case 3:
            center.x = r.x;
    }
    return center;
}, getBox: function () {
    return this.getOwner().getParent().getBoundingBox();
}, getReferencePoint: function () {
    return this.getBox().getCenter();
}});
draw2d.shape.arrow.CalligrapherArrowLeft = draw2d.SVGFigure.extend({NAME: "draw2d.shape.arrow.CalligrapherArrowLeft", init: function () {
    this._super();
}, getSVG: function () {
    return'<svg width="230" height="60" xmlns="http://www.w3.org/2000/svg" version="1.1">' + '  <path style="fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none" id="path3024" d="m 218.87943,27.464763 c -1.21088,-0.0563 -2.42064,-0.14616 -3.63262,-0.16893 c -5.82495,-0.10948 -18.61676,-0.0226 -22.97385,0.0122 c -7.12848,0.057 -14.25673,0.14021 -21.38495,0.22333 c -9.03765,0.10539 -18.07511,0.22813 -27.11266,0.3422 c -10.2269,0.11878 -20.4538,0.23756 -30.6807,0.35634 c -35.488759,0.4089 -70.975849,0.82793 -106.4669238,0.95195 c 0,0 7.9718628,-5.70244 7.9718628,-5.70244 l 0,0 c 6.374241,0.28694 12.745594,0.64561 19.122722,0.86083 c 28.09499,0.94816 56.21338,0.92473 84.315959,0.32205 c 10.51273,-0.32805 21.0288,-0.56402 31.53819,-0.98412 c 27.47361,-1.09824 54.91405,-2.91665 82.28177,-5.53697 c 0,0 -12.9788,9.32351 -12.9788,9.32351 z" inkscape:connector-curvature="0" />' + '  <path style="fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none" id="path3026" d="m 100.75066,1.6309831 c -7.165239,3.9571 -14.284929,7.47866 -22.036659,10.2707299 c -5.00195,1.80163 -10.10374,3.31886 -15.2402,4.79424 c -8.25878,2.37815 -16.55626,4.65805 -24.9012,6.79479 c -2.89107,0.71593 -5.74687,1.56407 -8.66266,2.20424 c -3.211679,0.70512 -6.49468,1.17333 -9.752959,1.6747 c -5.447101,0.92112 -10.9044008,1.81762 -16.3983488,2.50082 c -1.608931,0.0814 -0.850754,0.10697 -2.275834,-0.0365 C 20.004071,21.041553 19.256899,21.517873 32.515691,19.216243 c 6.21537,-1.05913 12.34875,-2.37668 18.3945,-4.03234 c 8.12719,-2.02803 16.23765,-4.1157 24.26421,-6.4321199 c 5.23574,-1.55053 10.41682,-3.15473 15.46857,-5.12875 c 1.38953,-0.54295 2.7579,-1.12682 4.12253,-1.71603 c 0.98421,-0.42496 3.86537,-1.81801999 2.92296,-1.32600999 C 93.642191,2.6934931 89.529511,4.7073031 85.450031,6.7704531 l 15.300629,-5.1394 z" inkscape:connector-curvature="0" sodipodi:nodetypes="csccsccccccsssccc" />' + '  <path style="fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none" id="path3028" d="m 80.764281,58.068863 c -2.45498,-3.50762 -6.58178,-6.10525 -10.40324,-8.66732 c -4.30614,-2.72676 -7.93958,-6.28283 -12.6021,-8.28702 c -7.39912,-4.50257 -11.70055,-7.85592 -20.85866,-9.23429 c -4.9257,-0.85706 -17.294247,-1.32043 -22.226462,-2.15427 c -3.445882,-0.42869 -6.2035918,0.70541 -9.6845138,0.57715 c -1.496337,-0.0586 -2.99355,-0.0965 -4.491229,-0.12472 l 13.9525278,-6.24562 l 3.25,-1.17153 c 1.441459,0.0813 -1.116338,0.15309 0.325505,0.23016 c 3.574557,0.17902 7.211864,0.0695 10.712655,0.73822 c 4.723107,1.08097 9.443947,2.1624 14.234177,3.05317 c 2.76739,0.64203 3.92627,0.87082 6.64127,1.66289 c 4.42146,1.28993 8.60075,3.01513 12.86503,4.58129 c 1.90199,0.73446 5.05193,1.93181 6.89302,2.7216 c 4.92005,2.11061 9.5916,4.57045 13.9716,7.31023 c 4.16708,2.62011 8.48023,5.20033 11.72012,8.56863 z" inkscape:connector-curvature="0" sodipodi:nodetypes="ccccccccccccscsccc" />' + "</svg>";
}, repaint: function (attributes) {
    if (this.repaintBlocked === true || this.shape === null) {
        return;
    }
    if (this.svgNodes !== null) {
        this.svgNodes.attr({fill: this.color.hash()});
    }
    this._super(attributes);
}});
draw2d.shape.arrow.CalligrapherArrowDownLeft = draw2d.SVGFigure.extend({NAME: "draw2d.shape.arrow.CalligrapherArrowDownLeft", init: function () {
    this._super();
}, getSVG: function () {
    return'<svg width="180" height="300" xmlns="http://www.w3.org/2000/svg" version="1.1">' + '     <path style="fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none" id="path3084" d="m 159.63578,17.846597 c 0.43137,9.44641 -0.0636,18.88035 -0.8284,28.30165 c -1.73211,18.38336 -4.05381,36.71698 -6.08253,55.075313 c -1.61738,13.7075 -3.03402,27.43467 -3.97611,41.19113 c -1.09101,11.16584 -1.31019,22.36559 -1.28541,33.56466 c -0.1328,4.82188 0.3218,9.6468 0.14332,14.46812 c -0.0888,2.39977 -0.28315,3.73625 -0.55012,6.12095 c -0.85848,4.73147 -2.27416,9.40019 -4.7769,13.68272 c -1.47003,2.51544 -3.78493,5.6647 -5.47739,8.05048 c -5.02888,6.66256 -11.08555,12.65652 -18.10552,17.75963 c -4.23302,3.07716 -7.74942,5.12065 -12.22081,7.86298 c -13.253319,6.72606 -25.889792,15.11686 -40.84124,18.60576 c -3.016829,0.7039 -4.431417,0.8157 -7.450859,1.2076 c -6.983246,0.5774 -14.009174,0.3375 -21.010676,0.2509 c -3.278795,-0.033 -6.55749,0.01 -9.835897,0.045 c 0,0 20.838833,-13.2364 20.838833,-13.2364 l 0,0 c 3.147056,0.093 6.294483,0.1852 9.443646,0.2007 c 6.966697,0.011 13.971433,0.1301 20.897176,-0.6344 c 3.732439,-0.5577 7.321215,-1.2431 10.881203,-2.4145 c 1.517208,-0.4992 5.830867,-2.43339 4.487902,-1.6386 c -6.098183,3.6088 -25.104875,12.8748 -9.52514,5.223 c 4.40875,-2.5927 8.262057,-4.7459 12.425175,-7.65986 c 6.839117,-4.78709 12.633657,-10.50427 17.500607,-16.86761 c 2.53518,-3.56692 5.24684,-7.12748 7.07617,-11.03446 c 1.42357,-3.0404 2.21532,-6.28727 2.91146,-9.50152 c 0.91919,-6.88822 1.03991,-13.81392 1.25118,-20.74151 c 0.47683,-11.27871 0.96259,-22.55877 1.61689,-33.83062 c 1.21127,-14.03392 3.64191,-27.94339 5.46543,-41.92167 c 2.26899,-18.186603 4.6835,-36.384373 5.4487,-54.679643 c 0.0788,-2.46092 0.23808,-4.92087 0.23618,-7.38276 c -0.005,-6.45916 -0.62194,-13.00218 -2.13821,-19.32664 c 0,0 23.48134,-10.73998 23.48134,-10.73998 z" inkscape:connector-curvature="0" />' + '     <path style="fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none" id="path3086" d="m 41.271518,252.40239 c 2.465518,-0.7264 4.879503,-1.7726 7.145328,-2.9859 c 0.955597,-0.5117 3.736822,-2.1986 2.791991,-1.6673 c -5.218817,2.9348 -10.409826,5.9187 -15.61474,8.878 c 5.366557,-3.4898 10.227818,-7.6685 14.119927,-12.75576 c 3.507157,-5.09382 4.097613,-11.17122 4.301158,-17.17644 c 0.02635,-3.95844 -0.31227,-7.90612 -0.635377,-11.84752 c 0,0 19.920693,-10.3059 19.920693,-10.3059 l 0,0 c 0.171761,4.05015 0.409899,8.09777 0.50079,12.15101 c -0.185739,6.23619 -0.347804,12.66862 -3.492579,18.24747 c -0.503375,0.75197 -0.961922,1.53596 -1.510126,2.25591 c -3.478528,4.56826 -8.226837,8.04586 -12.757403,11.47443 c -7.345206,4.3297 -14.671333,8.692 -22.035619,12.9891 c -3.551305,2.0723 -7.368692,3.8726 -11.394645,4.7773 c 0,0 18.660602,-14.0344 18.660602,-14.0344 z" inkscape:connector-curvature="0" />' + '     <path style="fill:#000000;fill-opacity:1;fill-rule:nonzero;stroke:none" id="path3088" d="m 37.815923,255.49919 c 3.41111,0.1581 6.814569,0.2213 10.182693,0.8184 c 6.92998,2.6928 13.533527,6.2357 20.043462,9.8162 c 3.912139,2.1362 7.91195,4.4644 10.690321,8.0298 c 1.039962,1.2802 1.510411,2.7604 1.893523,4.3313 c 0,0 -20.370847,10.9259 -20.370847,10.9259 l 0,0 c -0.225419,-1.2711 -0.55067,-2.4558 -1.329618,-3.5184 c -2.332229,-3.3633 -5.869056,-5.6279 -9.247191,-7.8233 c -6.335066,-3.7106 -12.98611,-7.1834 -20.232784,-8.6836 c -3.497247,-0.3814 -7.011372,-0.4307 -10.521829,-0.1703 c 0,0 18.89227,-13.726 18.89227,-13.726 z" inkscape:connector-curvature="0" />' + "</svg>";
}, repaint: function (attributes) {
    if (this.repaintBlocked === true || this.shape === null) {
        return;
    }
    if (this.svgNodes !== null) {
        this.svgNodes.attr({fill: this.color.hash()});
    }
    this._super(attributes);
}});
draw2d.shape.node.Start = draw2d.shape.basic.Rectangle.extend({NAME: "draw2d.shape.node.Start", DEFAULT_COLOR: new draw2d.util.Color("#4D90FE"), init: function () {
    this._super();
    this.createPort("output");
    this.setDimension(50, 50);
    this.setBackgroundColor(this.DEFAULT_COLOR);
    this.setColor(this.DEFAULT_COLOR.darker());
}});
draw2d.shape.node.End = draw2d.shape.basic.Rectangle.extend({NAME: "draw2d.shape.node.End", DEFAULT_COLOR: new draw2d.util.Color("#4D90FE"), init: function () {
    this._super();
    this.createPort("input");
    this.setDimension(50, 50);
    this.setBackgroundColor(this.DEFAULT_COLOR);
    this.setColor(this.DEFAULT_COLOR.darker());
}});
draw2d.shape.node.Between = draw2d.shape.basic.Rectangle.extend({NAME: "draw2d.shape.node.Between", DEFAULT_COLOR: new draw2d.util.Color("#4D90FE"), init: function () {
    this._super();
    this.setDimension(50, 50);
    this.setBackgroundColor(this.DEFAULT_COLOR);
    this.setColor(this.DEFAULT_COLOR.darker());
    this.createPort("output");
    this.createPort("input");
}});
draw2d.shape.note.PostIt = draw2d.shape.basic.Label.extend({NAME: "draw2d.shape.note.PostIt", init: function (text) {
    this._super(text);
    this.setStroke(1);
    this.setBackgroundColor("#5b5b5b");
    this.setColor("#FFFFFF");
    this.setFontColor("#ffffff");
    this.setFontSize(14);
    this.setPadding(5);
    this.setRadius(5);
}});
draw2d.shape.widget.Widget = draw2d.SetFigure.extend({init: function (width, height) {
    this._super(width, height);
}, getWidth: function () {
    return this.width;
}, getHeight: function () {
    return this.height;
}});
draw2d.shape.widget.Slider = draw2d.shape.widget.Widget.extend({NAME: "draw2d.shape.widget.Slider", DEFAULT_COLOR_THUMB: new draw2d.util.Color("#bddf69"), DEFAULT_COLOR_BG: new draw2d.util.Color("#d3d3d3"), init: function (width, height) {
    if (typeof width === "undefined") {
        width = 120;
        height = 15;
    }
    this.currentValue = 0;
    this.slideBoundingBox = new draw2d.geo.Rectangle(0, 0, 10, 20);
    this._super(width, height);
    this.setBackgroundColor(this.DEFAULT_COLOR_BG);
    this.setColor(this.DEFAULT_COLOR_THUMB);
    this.setStroke(1);
    this.setRadius(4);
    this.setResizeable(true);
    this.setMinHeight(10);
    this.setMinWidth(80);
}, createSet: function () {
    var result = this.canvas.paper.set();
    var thumb = this.canvas.paper.rect(5, 5, 10, 20);
    thumb.node.style.cursor = "col-resize";
    result.push(thumb);
    return result;
}, setDimension: function (w, h) {
    this._super(w, h);
    this.slideBoundingBox.setBoundary(0, 0, this.getWidth() - 10, this.getHeight());
    this.slideBoundingBox.setHeight(this.getHeight() + 1);
    this.repaint();
}, onValueChange: function (value) {
}, onDragStart: function (relativeX, relativeY) {
    if (this.slideBoundingBox.hitTest(relativeX, relativeY)) {
        this.origX = this.slideBoundingBox.getX();
        this.origY = this.slideBoundingBox.getY();
        return false;
    }
    return this._super(relativeX, relativeY);
}, onPanning: function (dx, dy, dx2, dy2) {
    this.slideBoundingBox.setPosition(this.origX + dx, this.origY + dy);
    this.setValue(100 / (this.slideBoundingBox.bw - this.slideBoundingBox.getWidth()) * this.slideBoundingBox.getX());
}, setValue: function (value) {
    this.currentValue = Math.min(Math.max(0, (value | 0)), 100);
    this.repaint();
    this.onValueChange(this.currentValue);
}, repaint: function (attributes) {
    if (this.repaintBlocked === true || this.shape === null) {
        return;
    }
    if (typeof attributes === "undefined") {
        attributes = {};
    }
    var thumbX = ((this.slideBoundingBox.bw - this.slideBoundingBox.getWidth()) / 100 * this.currentValue) | 0;
    this.slideBoundingBox.setX(thumbX);
    if (this.svgNodes !== null) {
        var attr = this.slideBoundingBox.toJSON();
        attr.y = attr.y - 5;
        attr.height = attr.height + 10;
        attr.fill = this.getColor().hash();
        attr.stroke = this.getColor().darker(0.2).hash();
        attr.r = 4;
        this.svgNodes.attr(attr);
    }
    attributes.fill = "90-" + this.bgColor.hash() + ":5-" + this.bgColor.lighter(0.3).hash() + ":95";
    attributes.stroke = this.bgColor.darker(0.1).hash();
    this._super(attributes);
}, applyTransformation: function () {
    this.svgNodes.transform("T" + this.getAbsoluteX() + "," + this.getAbsoluteY());
}});
draw2d.shape.diagram.Diagram = draw2d.SetFigure.extend({init: function (width, height) {
    this.data = [];
    this.padding = 5;
    this.cache = {};
    this._super(width, height);
    this.setBackgroundColor("#8dabf2");
    this.setStroke(1);
    this.setColor("#f0f0f0");
    this.setRadius(2);
    this.setResizeable(true);
}, setData: function (data) {
    this.data = data;
    this.cache = {};
    if (this.svgNodes !== null) {
        this.svgNodes.remove();
        this.svgNodes = this.createSet();
    }
    this.repaint();
}, setDimension: function (w, h) {
    this.cache = {};
    this._super(w, h);
}, getWidth: function () {
    return this.width;
}, getHeight: function () {
    return this.height;
}, repaint: function (attributes) {
    if (this.repaintBlocked === true || this.shape == null) {
        return;
    }
    if (typeof attributes === "undefined") {
        attributes = {};
    }
    if (typeof attributes.fill === "undefined") {
        attributes.fill = "none";
    }
    this._super(attributes);
}, applyTransformation: function () {
    if (this.isResizeable() === true) {
        this.svgNodes.transform("S" + this.scaleX + "," + this.scaleY + "," + this.getAbsoluteX() + "," + this.getAbsoluteY() + "t" + this.getAbsoluteX() + "," + this.getAbsoluteY());
    } else {
        this.svgNodes.transform("T" + this.getAbsoluteX() + "," + this.getAbsoluteY());
    }
}});
draw2d.shape.diagram.Pie = draw2d.shape.diagram.Diagram.extend({COLORS: ["#00A8F0", "#b9dd69", "#f3546a", "#4DA74D", "#9440ED"], TWO_PI: Math.PI * 2, init: function (diameter) {
    this._super(diameter, diameter);
    this.setStroke(0);
}, setData: function (data) {
    this.sum = 0;
    $.each(data, $.proxy(function (i, val) {
        this.sum += val;
    }, this));
    var _sum = 1 / this.sum;
    $.each(data, $.proxy(function (i, val) {
        data[i] = _sum * val;
    }, this));
    this._super(data);
}, createSet: function () {
    var radius = this.getWidth() / 2;
    var length = this.data.length;
    var pie = this.canvas.paper.set();
    var offsetAngle = 0;
    for (var i = 0; i < length; i++) {
        var angle = this.TWO_PI * this.data[i];
        var color = this.COLORS[i % length];
        var seg = this.drawSegment(radius, angle, offsetAngle, 0.1);
        seg.attr({stroke: this.color.hash(), fill: color});
        pie.push(seg);
        offsetAngle += angle;
    }
    return pie;
}, setDimension: function (w, h) {
    if (w > h) {
        this._super(w, w);
    } else {
        this._super(h, h);
    }
    if (this.svgNodes !== null) {
        this.svgNodes.remove();
        this.svgNodes = this.createSet();
    }
    this.repaint();
}, polarPath: function (radius, theta, rotation) {
    var x, y;
    x = radius * Math.cos(theta + rotation) + radius;
    y = radius * Math.sin(theta + rotation) + radius;
    return"L " + x + " " + y + " ";
}, drawSegment: function (radius, value, rotation, resolution) {
    var path = "M " + radius + " " + radius;
    for (var i = 0; i < value; i += resolution) {
        path += this.polarPath(radius, i, rotation);
    }
    path += this.polarPath(radius, value, rotation);
    path += "L " + radius + " " + radius;
    return this.getCanvas().paper.path(path);
}, applyTransformation: function () {
    this.svgNodes.transform("T" + this.getAbsoluteX() + "," + this.getAbsoluteY());
}});
draw2d.shape.diagram.Sparkline = draw2d.shape.diagram.Diagram.extend({init: function (width, height) {
    this.min = 0;
    this.max = 10;
    if (typeof width === "undefined") {
        width = 180;
        height = 50;
    }
    this._super(width, height);
}, setData: function (data) {
    this.min = Math.min.apply(Math, data);
    this.max = Math.max.apply(Math, data);
    if (this.max == this.min) {
        this.max = this.min + 1;
    }
    this._super(data);
}, createSet: function () {
    return this.canvas.paper.path("M0 0 l0 0");
}, repaint: function (attributes) {
    if (this.repaintBlocked === true || this.shape === null) {
        return;
    }
    if (typeof attributes === "undefined") {
        attributes = {};
    }
    attributes.fill = "90-#000:5-#4d4d4d:95";
    var padding = this.padding;
    var width = this.getWidth() - 2 * +this.padding;
    var height = this.getHeight() - 2 * +this.padding;
    var length = this.data.length;
    var min = this.min;
    var max = this.max;
    var toCoords = function (value, idx) {
        var step = 1;
        if (length > 1) {
            step = (width / (length - 1));
        }
        return{y: -((value - min) / (max - min) * height) + height + padding, x: padding + idx * step};
    };
    if (this.svgNodes !== null && (typeof this.cache.pathString === "undefined")) {
        var prev_pt = null;
        $.each(this.data, $.proxy(function (idx, item) {
            var pt = toCoords(item, idx);
            if (prev_pt === null) {
                this.cache.pathString = ["M", pt.x, pt.y].join(" ");
            } else {
                this.cache.pathString = [this.cache.pathString, "L", pt.x, pt.y].join(" ");
            }
            prev_pt = pt;
        }, this));
        this.svgNodes.attr({path: this.cache.pathString, stroke: "#f0f0f0"});
    }
    this._super(attributes);
}});

draw2d.shape.layout.Layout = draw2d.shape.basic.Rectangle.extend({NAME: "draw2d.shape.layout.Layout", init: function () {
    this._super();
    this.setBackgroundColor(null);
    this.setRadius(0);
    this.setStroke(0);
    this.installEditPolicy(new draw2d.policy.figure.AntSelectionFeedbackPolicy());
}, addFigure: function (child, locator) {
    this._super(child, this.locator);
    child.attachResizeListener(this);
}, onOtherFigureIsResizing: function (figure) {
    if (this.getParent() instanceof draw2d.shape.layout.Layout) {
        this.fireResizeEvent();
    } else {
        this.setDimension(1, 1);
    }
}, onDoubleClick: function (angle) {
}});
draw2d.shape.layout.HorizontalLayout = draw2d.shape.layout.Layout.extend({NAME: "draw2d.shape.layout.HorizontalLayout", init: function () {
    this._super();
    var _this = this;
    this.locator = {relocate: function (index, target) {
        var stroke = _this.getStroke();
        var xPos = stroke;
        for (var i = 0; i < index; i++) {
            var child = _this.children.get(i).figure;
            xPos += child.getWidth() + _this.gap;
        }
        target.setPosition(xPos, stroke);
    }};
    this.setDimension(1, 1);
    this.gap = 0;
}, setGap: function (gap) {
    this.gap = gap;
    this.setDimension(1, 1);
}, getMinWidth: function () {
    var width = this.stroke * 2 + Math.max(0, this.children.getSize() - 1) * this.gap;
    this.children.each(function (i, e) {
        width += e.figure.getMinWidth();
    });
    return width;
}, getMinHeight: function () {
    var height = 10;
    this.children.each(function (i, e) {
        height = Math.max(height, e.figure.getMinHeight());
    });
    return height + this.stroke * 2;
}, setDimension: function (w, h) {
    this._super(w, h);
    var diff = this.width - this.getMinWidth();
    if (diff > 0) {
        diff = (diff / this.children.getSize()) | 0;
        this.children.each(function (i, e) {
            e.figure.setDimension(e.figure.getMinWidth() + diff, e.figure.getHeight());
        });
    } else {
        this.children.each(function (i, e) {
            e.figure.setDimension(1, 1);
        });
    }
}});
draw2d.shape.layout.VerticalLayout = draw2d.shape.layout.Layout.extend({NAME: "draw2d.shape.layout.VerticalLayout", init: function () {
    this._super();
    this.gap = 0;
    var _this = this;
    this.locator = {relocate: function (index, target) {
        var stroke = _this.getStroke() / 2;
        var yPos = stroke;
        for (var i = 0; i < index; i++) {
            var child = _this.children.get(i).figure;
            yPos = yPos + child.getHeight() + _this.gap;
        }
        target.setPosition(stroke, yPos);
    }};
    this.setDimension(10, 10);
}, setGap: function (gap) {
    this.gap = gap;
    this.setDimension(1, 1);
}, getMinWidth: function () {
    var width = 10;
    this.children.each(function (i, e) {
        width = Math.max(width, e.figure.getMinWidth());
    });
    return width + this.stroke;
}, getMinHeight: function () {
    var height = +this.stroke + Math.max(0, this.children.getSize() - 1) * this.gap;
    this.children.each(function (i, e) {
        height += e.figure.getMinHeight();
    });
    return height;
}, setDimension: function (w, h) {
    this._super(w, h);
    var width = this.width - this.stroke;
    this.children.each(function (i, e) {
        e.figure.setDimension(width, e.figure.getHeight());
    });
}});
draw2d.shape.icon.Icon = draw2d.SetFigure.extend({NAME: "draw2d.shape.icon.Icon", init: function (width, height) {
    this._super(width, height);
    this.setBackgroundColor("#333333");
}, repaint: function (attributes) {
    if (this.repaintBlocked === true || this.shape === null) {
        return;
    }
    if (typeof attributes === "undefined") {
        attributes = {};
    }
    attributes.fill = "none";
    if (this.svgNodes !== null) {
        this.svgNodes.attr({fill: this.bgColor.hash(), stroke: "none"});
    }
    this._super(attributes);
}, applyTransformation: function () {
    if (this.isResizeable() === true) {
        this.svgNodes.transform("S" + this.scaleX + "," + this.scaleY + "," + this.getAbsoluteX() + "," + this.getAbsoluteY() + "t" + (this.getAbsoluteX() - this.offsetX) + "," + (this.getAbsoluteY() - this.offsetY));
    } else {
        this.svgNodes.transform("T" + (this.getAbsoluteX() - this.offsetX) + "," + (this.getAbsoluteY() - this.offsetY));
    }
}, createShapeElement: function () {
    var shape = this._super();
    var bb = this.svgNodes.getBBox();
    this.offsetX = bb.x;
    this.offsetY = bb.y;
    return shape;
}, setDimension: function (w, h) {
    if (w > h) {
        this._super(w, w);
    } else {
        this._super(h, h);
    }
}});

draw2d.shape.pert.Activity = draw2d.shape.layout.VerticalLayout.extend({NAME: "draw2d.shape.pert.Activity", init: function () {
    this._super();
    var _this = this;
    this.mementoValues = {duration: null};
    this.lighterBgColor = null;
    this.darkerBgColor = null;
    this.setBackgroundColor("#f3f3f3");
    this.setStroke(2);
    this.setColor(this.darkerBgColor);
    this.setRadius(5);
    var top = new draw2d.shape.layout.HorizontalLayout();
    top.setStroke(0);
    this.earlyStartLabel = this.createLabel("Early Start").setStroke(0);
    this.durationLabel = new draw2d.shape.basic.Label("Duration");
    this.durationLabel.setStroke(1);
    this.durationLabel.setColor(this.darkerBgColor);
    this.durationLabel.setRadius(0);
    this.durationLabel.setBackgroundColor(null);
    this.durationLabel.setPadding(5);
    this.durationLabel.setColor(this.bgColor.darker(0.2));
    this.durationLabel.installEditor(new draw2d.ui.LabelEditor({onCommit: function (value) {
        _this.setDuration(parseFloat(value));
    }}));
    this.earlyEndLabel = this.createLabel("Early End").setStroke(0);
    top.addFigure(this.earlyStartLabel);
    top.addFigure(this.durationLabel);
    top.addFigure(this.earlyEndLabel);
    this.activityLabel = new draw2d.shape.basic.Label("Activity Name");
    this.activityLabel.setRadius(0);
    this.activityLabel.setPadding(10);
    this.activityLabel.setColor(this.darkerBgColor);
    this.activityLabel.setBackgroundColor(null);
    this.activityLabel.installEditor(new draw2d.ui.LabelInplaceEditor());
    this.inputPort = this.activityLabel.createPort("input");
    this.inputPort.getActivity = function () {
        return _this;
    };
    this.inputPort.onConnect = function () {
        _this.setDuration(_this.mementoValues.duration);
    };
    this.inputPort.onDisconnect = function () {
        _this.setDuration(_this.mementoValues.duration);
    };
    this.inputPort.setValue = function (anyValue) {
        _this.setDuration(_this.mementoValues.duration);
    };
    this.outputPort = this.activityLabel.createPort("output");
    this.outputPort.getActivity = function () {
        return _this;
    };
    this.outputPort.onConnect = function () {
        _this.setDuration(_this.mementoValues.duration);
    };
    this.outputPort.onDisconnect = function () {
        _this.setDuration(_this.mementoValues.duration);
    };
    var bottom = new draw2d.shape.layout.HorizontalLayout();
    bottom.setStroke(0);
    this.lateStartLabel = this.createLabel("Late Start").setStroke(0);
    this.stackLabel = this.createLabel("Stack");
    this.lateEndLabel = this.createLabel("Late End").setStroke(0);
    bottom.addFigure(this.lateStartLabel);
    bottom.addFigure(this.stackLabel);
    bottom.addFigure(this.lateEndLabel);
    this.addFigure(top);
    this.addFigure(this.activityLabel);
    this.addFigure(bottom);
    this.setDuration(1);
}, setDuration: function (duration) {
    if (this.mementoValues.duration !== duration) {
        this.mementoValues.duration = duration;
        this.durationLabel.setText(this.mementoValues.duration);
    }
    var start = this.getEarlyStart();
    this.earlyStartLabel.setText(start);
    this.earlyEndLabel.setText(start + this.mementoValues.duration);
    var connections = this.outputPort.getConnections();
    connections.each($.proxy(function (i, conn) {
        var targetPort = conn.getTarget();
        targetPort.setValue();
    }, this));
    if (connections.getSize() === 0) {
        var lateFinish = parseFloat(this.earlyEndLabel.getText());
        this.setLateFinish(lateFinish);
    }
}, getEarlyEnd: function () {
    return this.getEarlyStart() + this.mementoValues.duration;
}, getEarlyStart: function () {
    var latestEarlyEnd = 0;
    this.inputPort.getConnections().each(function (i, conn) {
        var parentActivity = conn.getSource().getActivity();
        latestEarlyEnd = Math.max(latestEarlyEnd, parentActivity.getEarlyEnd());
    });
    return latestEarlyEnd;
}, setLateFinish: function (value) {
    var lateStart = value - this.mementoValues.duration;
    this.lateEndLabel.setText(value);
    this.lateStartLabel.setText(lateStart);
    this.stackLabel.setText(lateStart - parseFloat(this.earlyStartLabel.getText()));
    var connections = this.inputPort.getConnections();
    connections.each($.proxy(function (i, conn) {
        var sourcePort = conn.getSource();
        sourcePort.getActivity().setLateFinish(lateStart);
    }, this));
}, createLabel: function (txt) {
    var label = new draw2d.shape.basic.Label(txt);
    label.setStroke(1);
    label.setColor(this.darkerBgColor);
    label.setRadius(0);
    label.setBackgroundColor(null);
    label.setPadding(5);
    label.setColor(this.bgColor.darker(0.2));
    label.onDoubleClick = function (angle) {
    };
    return label;
}, setBackgroundColor: function (color) {
    this._super(color);
    this.lighterBgColor = this.bgColor.lighter(0.2).hash();
    this.darkerBgColor = this.bgColor.darker(0.2).hash();
}, repaint: function (attributes) {
    if (this.repaintBlocked === true || this.shape === null) {
        return;
    }
    if (typeof attributes === "undefined") {
        attributes = {};
    }
    if (this.getAlpha() < 0.9) {
        attributes.fill = this.bgColor.hash();
    } else {
        attributes.fill = ["90", this.bgColor.hash(), this.lighterBgColor].join("-");
    }
    this._super(attributes);
}});
draw2d.shape.state.Start = draw2d.shape.basic.Circle.extend({NAME: "draw2d.shape.state.Start", DEFAULT_COLOR: new draw2d.util.Color("#3369E8"), init: function () {
    this._super();
    this.port = this.createPort("output", new draw2d.layout.locator.BottomLocator(this));
    this.port.setConnectionAnchor(new draw2d.layout.anchor.ShortesPathConnectionAnchor(this.port));
    this.setDimension(50, 50);
    this.setBackgroundColor(this.DEFAULT_COLOR);
    this.installEditPolicy(new draw2d.policy.figure.AntSelectionFeedbackPolicy());
    this.setStroke(0);
    var label = new draw2d.shape.basic.Label("START");
    label.setStroke(0);
    label.setFontColor("#ffffff");
    label.setFontFamily('"Open Sans",sans-serif');
    this.addFigure(label, new draw2d.layout.locator.CenterLocator(this));
}});
draw2d.shape.state.End = draw2d.shape.basic.Circle.extend({NAME: "draw2d.shape.state.End", DEFAULT_COLOR: new draw2d.util.Color("#4D90FE"), init: function () {
    this.innerCircle = new draw2d.shape.basic.Circle(20);
    this._super();
    this.port = this.createPort("input", new draw2d.layout.locator.TopLocator(this));
    this.port.setConnectionAnchor(new draw2d.layout.anchor.ShortesPathConnectionAnchor(this.port));
    this.setDimension(50, 50);
    this.setBackgroundColor(this.DEFAULT_COLOR);
    this.installEditPolicy(new draw2d.policy.figure.AntSelectionFeedbackPolicy());
    this.innerCircle.setStroke(2);
    this.innerCircle.setBackgroundColor(null);
    this.addFigure(this.innerCircle, new draw2d.layout.locator.CenterLocator(this));
    this.setStroke(0);
}, setDimension: function (w, h) {
    this._super(w, h);
    this.innerCircle.setDimension(this.getWidth() - 10, this.getHeight() - 10);
}});
draw2d.shape.state.State = draw2d.shape.layout.VerticalLayout.extend({NAME: "draw2d.shape.state.State", init: function () {
    this._super();
    this.port = this.createPort("hybrid", new draw2d.layout.locator.BottomLocator(this));
    this.port.setConnectionAnchor(new draw2d.layout.anchor.ChopboxConnectionAnchor(this.port));
    this.setBackgroundColor("#f3f3f3");
    this.setStroke(1);
    this.setColor("#e0e0e0");
    this.setRadius(5);
    var top = this.createLabel("State").setStroke(0);
    this.label = top;
    var center = new draw2d.shape.basic.Rectangle();
    center.getHeight = function () {
        return 1;
    };
    center.setMinWidth(90);
    center.setColor("#e0e0e0");
    var bottom = new draw2d.shape.basic.Rectangle();
    bottom.setMinHeight(30);
    bottom.setStroke(0);
    bottom.setBackgroundColor(null);
    this.addFigure(top);
    this.addFigure(center);
    this.addFigure(bottom);
}, setLabel: function (text) {
    this.label.setText(text);
    return this;
}, getLabel: function () {
    return this.label.getText();
}, createLabel: function (txt) {
    var label = new draw2d.shape.basic.Label(txt);
    label.setStroke(1);
    label.setColor(this.darkerBgColor);
    label.setRadius(0);
    label.setBackgroundColor(null);
    label.setPadding(5);
    label.setColor(this.bgColor.darker(0.2));
    label.onDoubleClick = function (angle) {
    };
    return label;
}, getPersistentAttributes: function () {
    var memento = this._super();
    memento.label = this.getLabel();
    return memento;
}, setPersistentAttributes: function (memento) {
    this._super(memento);
    if (typeof memento.label !== "undefined") {
        this.setLabel(memento.label);
    }
}});
draw2d.shape.state.Connection = draw2d.Connection.extend({NAME: "draw2d.shape.state.Connection", DEFAULT_COLOR: new draw2d.util.Color("#4D90FE"), init: function () {
    this._super();
    this.setRouter(draw2d.shape.state.Connection.DEFAULT_ROUTER);
    this.setStroke(2);
    this.setTargetDecorator(new draw2d.decoration.connection.ArrowDecorator(17, 8));
    this.label = new draw2d.shape.basic.Label("label");
    this.label.setStroke(1);
    this.label.setPadding(2);
    this.label.setBackgroundColor("#f0f0f0");
    this.addFigure(this.label, new draw2d.layout.locator.PolylineMidpointLocator(this));
}, setLabel: function (text) {
    this.label.setText(text);
    this.label.setVisible(!(text === null || text === ""));
    return this;
}, getLabel: function () {
    return this.label.getText();
}, getPersistentAttributes: function () {
    var memento = this._super();
    memento.label = this.getLabel();
    return memento;
}, setPersistentAttributes: function (memento) {
    this._super(memento);
    if (typeof memento.label !== "undefined") {
        this.setLabel(memento.label);
    }
}});
draw2d.shape.state.Connection.DEFAULT_ROUTER = new draw2d.layout.connection.FanConnectionRouter();
draw2d.ui.LabelEditor = Class.extend({init: function (listener) {
    this.listener = $.extend({onCommit: function () {
    }, onCancel: function () {
    }}, listener);
}, start: function (label) {
    var newText = prompt("Label: ", label.getText());
    if (newText) {
        label.setText(newText);
        this.listener.onCommit(label.getText());
    } else {
        this.listener.onCancel();
    }
}});
draw2d.ui.LabelInplaceEditor = draw2d.ui.LabelEditor.extend({init: function (listener) {
    this._super();
    this.listener = $.extend({onCommit: function () {
    }, onCancel: function () {
    }}, listener);
}, start: function (label) {
    this.label = label;
    this.commitCallback = $.proxy(this.commit, this);
    $("body").bind("click", this.commitCallback);
    this.html = $('<input id="inplaceeditor">');
    this.html.val(label.getText());
    this.html.hide();
    $("body").append(this.html);
    this.html.autoResize({animate: false});
    this.html.bind("keyup", $.proxy(function (e) {
        switch (e.which) {
            case 13:
                this.commit();
                break;
            case 27:
                this.cancel();
                break;
        }
    }, this));
    this.html.bind("blur", this.commitCallback);
    this.html.bind("click", function (e) {
        e.stopPropagation();
        e.preventDefault();
    });
    var canvas = this.label.getCanvas();
    var bb = this.label.getBoundingBox();
    bb.setPosition(canvas.fromCanvasToDocumentCoordinate(bb.x, bb.y));
    var scrollDiv = canvas.getScrollArea();
    if (scrollDiv.is($("body"))) {
        bb.translate(canvas.getScrollLeft(), canvas.getScrollTop());
    }
    bb.translate(-1, -1);
    bb.resize(2, 2);
    this.html.css({position: "absolute", top: bb.y, left: bb.x, "min-width": bb.w, height: bb.h});
    this.html.fadeIn($.proxy(function () {
        this.html.focus();
    }, this));
}, commit: function () {
    this.html.unbind("blur", this.commitCallback);
    $("body").unbind("click", this.commitCallback);
    var label = this.html.val();
    this.label.setText(label);
    this.html.fadeOut($.proxy(function () {
        this.html.remove();
        this.html = null;
        this.listener.onCommit(this.label.getText());
    }, this));
}, cancel: function () {
    this.html.unbind("blur", this.commitCallback);
    $("body").unbind("click", this.commitCallback);
    this.html.fadeOut($.proxy(function () {
        this.html.remove();
        this.html = null;
        this.listener.onCancel();
    }, this));
}});
draw2d.decoration.connection.Decorator = Class.extend({NAME: "draw2d.decoration.connection.Decorator", init: function (width, height) {
    if (typeof width === "undefined" || width < 1) {
        this.width = 20;
    } else {
        this.width = width;
    }
    if (typeof height === "undefined" || height < 1) {
        this.height = 15;
    } else {
        this.height = height;
    }
    this.color = new draw2d.util.Color(0, 0, 0);
    this.backgroundColor = new draw2d.util.Color(250, 250, 250);
}, paint: function (paper) {
}, setColor: function (c) {
    this.color = new draw2d.util.Color(c);
    return this;
}, setBackgroundColor: function (c) {
    this.backgroundColor = new draw2d.util.Color(c);
    return this;
}, setDimension: function (width, height) {
    this.width = width;
    this.height = height;
    return this;
}});
draw2d.decoration.connection.ArrowDecorator = draw2d.decoration.connection.Decorator.extend({NAME: "draw2d.decoration.connection.ArrowDecorator", init: function (width, height) {
    this._super(width, height);
}, paint: function (paper) {
    var st = paper.set();
    st.push(paper.path(["M0 0", "L", this.width, " ", -this.height / 2, "L", this.width, " ", this.height / 2, "L0 0"].join("")));
    st.attr({fill: this.backgroundColor.hash(), stroke: this.color.hash()});
    return st;
}});
draw2d.decoration.connection.DiamondDecorator = draw2d.decoration.connection.Decorator.extend({NAME: "draw2d.decoration.connection.DiamondDecorator", init: function (width, height) {
    this._super(width, height);
}, paint: function (paper) {
    var st = paper.set();
    st.push(paper.path(["M", this.width / 2, " ", -this.height / 2, "L", this.width, " ", 0, "L", this.width / 2, " ", this.height / 2, "L", 0, " ", 0, "L", this.width / 2, " ", -this.height / 2, "Z"].join("")));
    st.attr({fill: this.backgroundColor.hash(), stroke: this.color.hash()});
    return st;
}});
draw2d.decoration.connection.CircleDecorator = draw2d.decoration.connection.Decorator.extend({NAME: "draw2d.decoration.connection.CircleDecorator", init: function (width, height) {
    this._super(width, height);
}, paint: function (paper) {
    var shape = paper.circle(0, 0, this.width / 2);
    shape.attr({fill: this.backgroundColor.hash(), stroke: this.color.hash()});
    return shape;
}});
draw2d.decoration.connection.BarDecorator = draw2d.decoration.connection.Decorator.extend({NAME: "draw2d.decoration.connection.BarDecorator", init: function (width, height) {
    this._super(width, height);
}, paint: function (paper) {
    var st = paper.set();
    var path = ["M", this.width / 2, " ", -this.height / 2];
    path.push("L", this.width / 2, " ", this.height / 2);
    st.push(paper.path(path.join("")));
    st.attr({fill: this.backgroundColor.hash(), stroke: this.color.hash()});
    return st;
}});
draw2d.io.Reader = Class.extend({init: function () {
}, unmarshal: function (canvas, document) {
}});
draw2d.io.Writer = Class.extend({init: function () {
}, marshal: function (canvas) {
    return"";
}, formatXml: function (xml) {
    var formatted = "";
    var reg = /(>)(<)(\/*)/g;
    xml = xml.replace(reg, "$1\r\n$2$3");
    var pad = 0;
    jQuery.each(xml.split("\r\n"), function (index, node) {
        var indent = 0;
        if (node.match(/.+<\/\w[^>]*>$/)) {
            indent = 0;
        } else {
            if (node.match(/^<\/\w/)) {
                if (pad != 0) {
                    pad -= 1;
                }
            } else {
                if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
                    indent = 1;
                } else {
                    indent = 0;
                }
            }
        }
        var padding = "";
        for (var i = 0; i < pad; i++) {
            padding += "  ";
        }
        formatted += padding + node + "\r\n";
        pad += indent;
    });
    return formatted;
}});
draw2d.io.svg.Writer = draw2d.io.Writer.extend({init: function () {
    this._super();
}, marshal: function (canvas) {
    var s = canvas.getCurrentSelection();
    canvas.setCurrentSelection(null);
    var svg = canvas.getHtmlContainer().html().replace(/>\s+/g, ">").replace(/\s+</g, "<");
    svg = this.formatXml(svg);
    svg = svg.replace(/<desc>.*<\/desc>/g, "<desc>Create with draw2d JS graph library and RaphaelJS</desc>");
    canvas.setCurrentSelection(s);
    return svg;
}});
draw2d.io.png.Writer = draw2d.io.Writer.extend({init: function () {
    this._super();
}, marshal: function (canvas) {
    var svg = canvas.getHtmlContainer().html().replace(/>\s+/g, ">").replace(/\s+</g, "<");
    svg = svg.replace(/xmlns=\"http:\/\/www\.w3\.org\/2000\/svg\"/, "");
    svg = svg.replace("<image", '<image xmlns:xlink="http://www.w3.org/1999/xlink" ');
    var canvasDomNode = $('<canvas id="canvas" width="1000px" height="600px"></canvas>');
    $("body").append(canvasDomNode);
    canvg("canvas", svg, {ignoreMouse: true, ignoreAnimation: true});
    var img = document.getElementById("canvas").toDataURL("image/png");
    canvasDomNode.remove();
    return img;
}});
draw2d.io.json.Writer = draw2d.io.Writer.extend({init: function () {
    this._super();
}, marshal: function (canvas) {
    var result = [];
    var figures = canvas.getFigures();
    var i = 0;
    var f = null;
    for (i = 0; i < figures.getSize(); i++) {
        f = figures.get(i);
        result.push(f.getPersistentAttributes());
    }
    var lines = canvas.getLines();
    lines.each(function (i, element) {
        result.push(element.getPersistentAttributes());
    });
    return result;
}});
draw2d.io.json.Reader = draw2d.io.Reader.extend({init: function () {
    this._super();
}, unmarshal: function (canvas, json) {
    var node = null;
    $.each(json, function (i, element) {
        var o = eval("new " + element.type + "()");
        var source = null;
        var target = null;
        for (i in element) {
            var val = element[i];
            if (i === "source") {
                node = canvas.getFigure(val.node);
                source = node.getPort(val.port);
            } else {
                if (i === "target") {
                    node = canvas.getFigure(val.node);
                    target = node.getPort(val.port);
                }
            }
        }
        if (source !== null && target !== null) {
            o.setSource(source);
            o.setTarget(target);
        }
        o.setPersistentAttributes(element);
        canvas.addFigure(o);
    });
    canvas.calculateConnectionIntersection();
    canvas.getLines().each(function (i, line) {
        line.svgPathString = null;
        line.repaint();
    });
    canvas.linesToRepaintAfterDragDrop = canvas.getLines().clone();
}});
document.ontouchmove = function (e) {
    e.preventDefault();
};
document.oncontextmenu = function () {
    return false;
};
(function () {
    Raphael.fn.group = function (f, g) {
        var enabled = document.getElementsByTagName("svg").length > 0;
        if (!enabled) {
            return{add: function () {
            }};
        }
        var i;
        this.svg = "http://www.w3.org/2000/svg";
        this.defs = document.getElementsByTagName("defs")[f];
        this.svgcanv = document.getElementsByTagName("svg")[f];
        this.group = document.createElementNS(this.svg, "g");
        for (i = 0; i < g.length; i++) {
            this.group.appendChild(g[i].node);
        }
        this.svgcanv.appendChild(this.group);
        this.group.translate = function (c, a) {
            this.setAttribute("transform", "translate(" + c + "," + a + ") scale(" + this.getAttr("scale").x + "," + this.getAttr("scale").y + ")");
        };
        this.group.rotate = function (c, a, e) {
            this.setAttribute("transform", "translate(" + this.getAttr("translate").x + "," + this.getAttr("translate").y + ") scale(" + this.getAttr("scale").x + "," + this.getAttr("scale").y + ") rotate(" + c + "," + a + "," + e + ")");
        };
        this.group.scale = function (c, a) {
            this.setAttribute("transform", "scale(" + c + "," + a + ") translate(" + this.getAttr("translate").x + "," + this.getAttr("translate").y + ")");
        };
        this.group.push = function (c) {
            this.appendChild(c.node);
        };
        this.group.getAttr = function (c) {
            this.previous = this.getAttribute("transform") ? this.getAttribute("transform") : "";
            var a = [], e, h, j;
            a = this.previous.split(" ");
            for (i = 0; i < a.length; i++) {
                if (a[i].substring(0, 1) == "t") {
                    var d = a[i], b = [];
                    b = d.split("(");
                    d = b[1].substring(0, b[1].length - 1);
                    b = [];
                    b = d.split(",");
                    e = b.length === 0 ? {x: 0, y: 0} : {x: b[0], y: b[1]};
                } else {
                    if (a[i].substring(0, 1) === "r") {
                        d = a[i];
                        b = d.split("(");
                        d = b[1].substring(0, b[1].length - 1);
                        b = d.split(",");
                        h = b.length === 0 ? {x: 0, y: 0, z: 0} : {x: b[0], y: b[1], z: b[2]};
                    } else {
                        if (a[i].substring(0, 1) === "s") {
                            d = a[i];
                            b = d.split("(");
                            d = b[1].substring(0, b[1].length - 1);
                            b = d.split(",");
                            j = b.length === 0 ? {x: 1, y: 1} : {x: b[0], y: b[1]};
                        }
                    }
                }
            }
            if (typeof e === "undefined") {
                e = {x: 0, y: 0};
            }
            if (typeof h === "undefined") {
                h = {x: 0, y: 0, z: 0};
            }
            if (typeof j === "undefined") {
                j = {x: 1, y: 1};
            }
            if (c == "translate") {
                var k = e;
            } else {
                if (c == "rotate") {
                    k = h;
                } else {
                    if (c == "scale") {
                        k = j;
                    }
                }
            }
            return k;
        };
        this.group.copy = function (el) {
            this.copy = el.node.cloneNode(true);
            this.appendChild(this.copy);
        };
        return this.group;
    };
})();
Math.sign = function () {
    if (this < 0) {
        return -1;
    }
    return 1;
};