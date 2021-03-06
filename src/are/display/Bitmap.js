﻿/**
 * 位图，继承自DisplayObject
 * @class Bitmap
 * @constructor
 * @param {image} image
 */
define("ARE.Bitmap:ARE.DisplayObject", {
    ctor: function (img) {
        this._super();
        if (typeof img == "string") {
            var cacheImg=Bitmap[img];
            if (cacheImg) {
                this._init(cacheImg);
            } else {
                var self = this;
                this.visible = false;
                this.img = document.createElement("img");
                this.img.onload = function () {
                   
                    if (!self.rect) self.rect = [0, 0, self.img.width, self.img.height];
                    self.width = self.rect[2];
                    self.height = self.rect[3];
                    self.regX = self.width * self.originX;
                    self.regY = self.height * self.originY;
                    self.imgLoaded = true;
                    Bitmap[img] = self.img;
                    self.visible = true;
                }
                this.img.src = img;

            }
        } else {
            this._init(img);
        }
    },
    _init: function (img) {
        this.img = img;
      
        this.width = img.width;
        this.height = img.height;
        this.imgLoaded = true;

        var self = this;
        this._watch(this, "filter", function (prop, value) {
            self.setFilter.apply(self, value);
        })

        Object.defineProperty(this, "rect", {
            get: function () {
                return this["__rect"];
            },
            set: function (value) {
                this["__rect"] = value;
                this.width = value[2];
                this.height = value[3];
                this.regX = value[2] * this.originX;
                this.regY = value[3] * this.originY;
            }
        });
        this.rect = [0, 0, img.width, img.height];
    },
    /**
     * 设置滤镜
     * @method setFilter
     * @param {num} r - 红.
     * @param {num} g - 绿.
     * @param {num} b - 蓝.
     * @param {num} a - 透明度.
     */
    setFilter: function (r, g, b, a) {
        this.uncache();
        this.cache();
        var imageData = this.cacheCtx.getImageData(0, 0, this.cacheCanvas.width, this.cacheCanvas.height);

        var pix = imageData.data;
        for (var i = 0, n = pix.length; i < n; i += 4) {
            if (pix[i + 3] > 0) {
                pix[i] *=r;
                pix[i + 1] *=g;
                pix[i + 2] *= b;
                pix[i + 3] *= a;
            }
        }
        this.cacheCtx.putImageData(imageData, 0, 0);
    },
    clone: function () {
        var o = new Bitmap(this.img);
        o.rect = this.rect.slice(0);
        this.cloneProps(o);
        return o;
    }


})