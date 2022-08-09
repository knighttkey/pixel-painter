!(function(t) {
  var e = {};
  function i(r) {
    if (e[r]) return e[r].exports;
    var n = (e[r] = { i: r, l: !1, exports: {} });
    return t[r].call(n.exports, n, n.exports, i), (n.l = !0), n.exports;
  }
  (i.m = t), (i.c = e), (i.d = function(t, e, r) {
    i.o(t, e) || Object.defineProperty(t, e, { enumerable: !0, get: r });
  }), (i.r = function(t) {
    "undefined" != typeof Symbol &&
      Symbol.toStringTag &&
      Object.defineProperty(t, Symbol.toStringTag, {
        value: "Module"
      }), Object.defineProperty(t, "__esModule", { value: !0 });
  }), (i.t = function(t, e) {
    if ((1 & e && (t = i(t)), 8 & e)) return t;
    if (4 & e && "object" == typeof t && t && t.__esModule) return t;
    var r = Object.create(null);
    if (
      (
        i.r(r),
        Object.defineProperty(r, "default", { enumerable: !0, value: t }),
        2 & e && "string" != typeof t
      )
    )
      for (var n in t)
        i.d(
          r,
          n,
          function(e) {
            return t[e];
          }.bind(null, n)
        );
    return r;
  }), (i.n = function(t) {
    var e =
      t && t.__esModule
        ? function() {
            return t.default;
          }
        : function() {
            return t;
          };
    return i.d(e, "a", e), e;
  }), (i.o = function(t, e) {
    return Object.prototype.hasOwnProperty.call(t, e);
  }), (i.p = ""), i((i.s = 2));
})([
  function(t, e) {
    t.exports = class {
      constructor() {
        this._listeners = {};
      }
      addEventListener(t, e) {
        t in this._listeners || (this._listeners[t] = []), this._listeners[
          t
        ].push(e);
      }
      removeEventListener(t, e) {
        if (t in this._listeners)
          for (var i = this._listeners[t], r = 0, n = i.length; r < n; r++)
            if (i[r] === e) return void i.splice(r, 1);
      }
      dispatchEvent(t) {
        if (!(t.type in this._listeners)) return !0;
        for (
          var e = this._listeners[t.type].slice(), i = 0, r = e.length;
          i < r;
          i++
        )
          e[i].call(this, t);
        return !t.defaultPrevented;
      }
    };
  },
  function(t, e, i) {
    t.exports = function() {
      return i(3)(
        '!function(t){var e={};function i(r){if(e[r])return e[r].exports;var s=e[r]={i:r,l:!1,exports:{}};return t[r].call(s.exports,s,s.exports,i),s.l=!0,s.exports}i.m=t,i.c=e,i.d=function(t,e,r){i.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},i.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},i.t=function(t,e){if(1&e&&(t=i(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(i.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var s in t)i.d(r,s,function(e){return t[e]}.bind(null,s));return r},i.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return i.d(e,"a",e),e},i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},i.p="",i(i.s=3)}([function(t,e){\n/*!\n  LZWEncoder.js\n\n  Authors\n  Kevin Weiner (original Java version - kweiner@fmsware.com)\n  Thibault Imbert (AS3 version - bytearray.org)\n  Johan Nordberg (JS version - code@johan-nordberg.com)\n\n  Acknowledgements\n  GIFCOMPR.C - GIF Image compression routines\n  Lempel-Ziv compression based on \'compress\'. GIF modifications by\n  David Rowley (mgardi@watdcsu.waterloo.edu)\n  GIF Image compression - modified \'compress\'\n  Based on: compress.c - File compression ala IEEE Computer, June 1984.\n  By Authors: Spencer W. Thomas (decvax!harpo!utah-cs!utah-gr!thomas)\n  Jim McKie (decvax!mcvax!jim)\n  Steve Davies (decvax!vax135!petsd!peora!srd)\n  Ken Turkowski (decvax!decwrl!turtlevax!ken)\n  James A. Woods (decvax!ihnp4!ames!jaw)\n  Joe Orost (decvax!vax135!petsd!joe)\n*/\nvar i=-1,r=12,s=5003,o=[0,1,3,7,15,31,63,127,255,511,1023,2047,4095,8191,16383,32767,65535];t.exports=function(t,e,n,a){var h,l,u,p,f,c,y=Math.max(2,a),d=new Uint8Array(256),w=new Int32Array(s),g=new Int32Array(s),b=0,x=0,P=!1;function v(t,e){d[l++]=t,l>=254&&S(e)}function m(t){B(s),x=f+2,P=!0,F(f,t)}function B(t){for(var e=0;e<t;++e)w[e]=-1}function S(t){l>0&&(t.writeByte(l),t.writeBytes(d,0,l),l=0)}function T(t){return(1<<t)-1}function M(){return 0===remaining?i:(--remaining,255&n[curPixel++])}function F(t,e){for(h&=o[b],b>0?h|=t<<b:h=t,b+=n_bits;b>=8;)v(255&h,e),h>>=8,b-=8;if((x>u||P)&&(P?(u=T(n_bits=p),P=!1):(++n_bits,u=n_bits==r?1<<r:T(n_bits))),t==c){for(;b>0;)v(255&h,e),h>>=8,b-=8;S(e)}}this.encode=function(o){o.writeByte(y),remaining=t*e,curPixel=0,function(t,e){var o,n,a,h,y,d,b;for(p=t,P=!1,n_bits=p,u=T(n_bits),c=1+(f=1<<t-1),x=f+2,l=0,h=M(),b=0,o=s;o<65536;o*=2)++b;b=8-b,B(d=s),F(f,e);t:for(;(n=M())!=i;)if(o=(n<<r)+h,w[a=n<<b^h]!==o){if(w[a]>=0){y=d-a,0===a&&(y=1);do{if((a-=y)<0&&(a+=d),w[a]===o){h=g[a];continue t}}while(w[a]>=0)}F(h,e),h=n,x<1<<r?(g[a]=x++,w[a]=o):m(e)}else h=g[a];F(h,e),F(c,e)}(y+1,o),o.writeByte(0)}}},function(t,e){\n/*! NeuQuant Neural-Net Quantization Algorithm\n * ------------------------------------------\n *\n * Copyright (c) 1994 Anthony Dekker\n *\n * NEUQUANT Neural-Net quantization algorithm by Anthony Dekker, 1994.\n * See "Kohonen neural networks for optimal colour quantization"\n * in "Network: Computation in Neural Systems" Vol. 5 (1994) pp 351-367.\n * for a discussion of the algorithm.\n * See also  http://members.ozemail.com.au/~dekker/NEUQUANT.HTML\n *\n * Any party obtaining a copy of these files from the author, directly or\n * indirectly, is granted, free of charge, a full and unrestricted irrevocable,\n * world-wide, paid up, royalty-free, nonexclusive right and license to deal\n * in this software and documentation files (the "Software"), including without\n * limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,\n * and/or sell copies of the Software, and to permit persons who receive\n * copies from any such party to do so, with the only requirement being\n * that this copyright notice remain intact.\n *\n * (JavaScript port 2012 by Johan Nordberg)\n */\nvar i=100,r=256,s=r-1,o=4,n=16,a=1<<n,h=10,l=10,u=a>>l,p=a<<h-l,f=6,c=(r>>3)*(1<<f),y=30,d=1024,w=256,g=1<<18,b=499,x=491,P=487,v=503,m=3*v;t.exports=function(t,e){var B,S,T,M,F;function A(t,e,i,r,s){B[e][0]-=t*(B[e][0]-i)/d,B[e][1]-=t*(B[e][1]-r)/d,B[e][2]-=t*(B[e][2]-s)/d}function C(t,e,i,s,o){for(var n,a,h=Math.abs(e-t),l=Math.min(e+t,r),u=e+1,p=e-1,f=1;u<l||p>h;)a=F[f++],u<l&&((n=B[u++])[0]-=a*(n[0]-i)/g,n[1]-=a*(n[1]-s)/g,n[2]-=a*(n[2]-o)/g),p>h&&((n=B[p--])[0]-=a*(n[0]-i)/g,n[1]-=a*(n[1]-s)/g,n[2]-=a*(n[2]-o)/g)}function D(t,e,i){var s,a,f,c,y,d=~(1<<31),w=d,g=-1,b=g;for(s=0;s<r;s++)a=B[s],(f=Math.abs(a[0]-t)+Math.abs(a[1]-e)+Math.abs(a[2]-i))<d&&(d=f,g=s),(c=f-(T[s]>>n-o))<w&&(w=c,b=s),y=M[s]>>l,M[s]-=y,T[s]+=y<<h;return M[g]+=u,T[g]-=p,b}this.buildColormap=function(){!function(){var t,e;for(B=[],S=new Int32Array(256),T=new Int32Array(r),M=new Int32Array(r),F=new Int32Array(r>>3),t=0;t<r;t++)e=(t<<o+8)/r,B[t]=new Float64Array([e,e,e,0]),M[t]=a/r,T[t]=0}(),function(){var r,s,n,a,h,l,u=t.length,p=30+(e-1)/3,g=u/(3*e),B=~~(g/i),S=d,T=c,M=T>>f;for(M<=1&&(M=0),r=0;r<M;r++)F[r]=S*((M*M-r*r)*w/(M*M));u<m?(e=1,s=3):s=u%b!=0?3*b:u%x!=0?3*x:u%P!=0?3*P:3*v;var I=0;for(r=0;r<g;)if(A(S,l=D(n=(255&t[I])<<o,a=(255&t[I+1])<<o,h=(255&t[I+2])<<o),n,a,h),0!==M&&C(M,l,n,a,h),(I+=s)>=u&&(I-=u),0===B&&(B=1),++r%B==0)for(S-=S/p,(M=(T-=T/y)>>f)<=1&&(M=0),l=0;l<M;l++)F[l]=S*((M*M-l*l)*w/(M*M))}(),function(){for(var t=0;t<r;t++)B[t][0]>>=o,B[t][1]>>=o,B[t][2]>>=o,B[t][3]=t}(),function(){var t,e,i,o,n,a,h=0,l=0;for(t=0;t<r;t++){for(n=t,a=(i=B[t])[1],e=t+1;e<r;e++)(o=B[e])[1]<a&&(n=e,a=o[1]);if(o=B[n],t!=n&&(e=o[0],o[0]=i[0],i[0]=e,e=o[1],o[1]=i[1],i[1]=e,e=o[2],o[2]=i[2],i[2]=e,e=o[3],o[3]=i[3],i[3]=e),a!=h){for(S[h]=l+t>>1,e=h+1;e<a;e++)S[e]=t;h=a,l=t}}for(S[h]=l+s>>1,e=h+1;e<256;e++)S[e]=s}()},this.getColormap=function(){for(var t=[],e=[],i=0;i<r;i++)e[B[i][3]]=i;for(var s=0,o=0;o<r;o++){var n=e[o];t[s++]=B[n][0],t[s++]=B[n][1],t[s++]=B[n][2]}return t},this.lookupRGB=function(t,e,i){for(var s,o,n,a=1e3,h=-1,l=S[e],u=l-1;l<r||u>=0;)l<r&&((n=(o=B[l])[1]-e)>=a?l=r:(l++,n<0&&(n=-n),(s=o[0]-t)<0&&(s=-s),(n+=s)<a&&((s=o[2]-i)<0&&(s=-s),(n+=s)<a&&(a=n,h=o[3])))),u>=0&&((n=e-(o=B[u])[1])>=a?u=-1:(u--,n<0&&(n=-n),(s=o[0]-t)<0&&(s=-s),(n+=s)<a&&((s=o[2]-i)<0&&(s=-s),(n+=s)<a&&(a=n,h=o[3]))));return h}}},function(t,e){\n/*!\n  ByteArray.js\n\n  Authors\n  Kevin Weiner (original Java version - kweiner@fmsware.com)\n  Thibault Imbert (AS3 version - bytearray.org)\n  Johan Nordberg (JS version - code@johan-nordberg.com)\n  Ketchetwahmeegwun T. Southall (JavaScript restructure - kettek@kettek.net)\n*/\nfunction i(){this.page=-1,this.pages=[],this.newPage()}i.pageSize=4096,i.charMap={};for(var r=0;r<256;r++)i.charMap[r]=String.fromCharCode(r);i.prototype.newPage=function(){this.pages[++this.page]=new Uint8Array(i.pageSize),this.cursor=0},i.prototype.getData=function(){for(var t="",e=0;e<this.pages.length;e++)for(var r=0;r<i.pageSize;r++)t+=i.charMap[this.pages[e][r]];return t},i.prototype.writeByte=function(t){this.cursor>=i.pageSize&&this.newPage(),this.pages[this.page][this.cursor++]=t},i.prototype.writeUTFBytes=function(t){for(var e=t.length,i=0;i<e;i++)this.writeByte(t.charCodeAt(i))},i.prototype.writeBytes=function(t,e,i){for(var r=i||t.length,s=e||0;s<r;s++)this.writeByte(t[s])},t.exports=i},function(t,e,i){"use strict";i.r(e);var r=i(0),s=i.n(r),o=i(1),n=i.n(o),a=i(2),h=i.n(a);\n/*!\n  GifFrame.worker.js\n\n  Authors\n  Kevin Weiner (original Java version - kweiner@fmsware.com)\n  Thibault Imbert (AS3 version - bytearray.org)\n  Johan Nordberg (JS version - code@johan-nordberg.com)\n  Ketchetwahmeegwun T. Southall (JavaScript restructure - kettek@kettek.net)\n*/\nfunction l(t,e){this.width=~~t,this.height=~~e,this.transparent=null,this.transIndex=0,this.repeat=-1,this.delay=0,this.image=null,this.pixels=null,this.indexedPixels=null,this.colorDepth=null,this.colorTab=null,this.neuQuant=null,this.usedEntry=new Array,this.palSize=7,this.dispose=-1,this.firstFrame=!0,this.sample=10,this.dither=!1,this.globalPalette=!1,this.out=new h.a}l.prototype.setDelay=function(t){this.delay=Math.round(t/10)},l.prototype.setFrameRate=function(t){this.delay=Math.round(100/t)},l.prototype.setDispose=function(t){t>=0&&(this.dispose=t)},l.prototype.setRepeat=function(t){this.repeat=t},l.prototype.setTransparent=function(t){this.transparent=t},l.prototype.addFrame=function(t){this.image=t,this.colorTab=this.globalPalette&&this.globalPalette.slice?this.globalPalette:null,this.getImagePixels(),this.analyzePixels(),!0===this.globalPalette&&(this.globalPalette=this.colorTab),this.firstFrame&&(this.writeLSD(),this.writePalette(),this.repeat>=0&&this.writeNetscapeExt()),this.writeGraphicCtrlExt(),this.writeImageDesc(),this.firstFrame||this.globalPalette||this.writePalette(),this.writePixels(),this.firstFrame=!1},l.prototype.finish=function(){this.out.writeByte(59)},l.prototype.setQuality=function(t){t<1&&(t=1),this.sample=t},l.prototype.setDither=function(t){!0===t&&(t="FloydSteinberg"),this.dither=t},l.prototype.setGlobalPalette=function(t){this.globalPalette=t},l.prototype.getGlobalPalette=function(){return this.globalPalette&&this.globalPalette.slice&&this.globalPalette.slice(0)||this.globalPalette},l.prototype.writeHeader=function(){this.out.writeUTFBytes("GIF89a")},l.prototype.analyzePixels=function(){this.colorTab||(this.neuQuant=new n.a(this.pixels,this.sample),this.neuQuant.buildColormap(),this.colorTab=this.neuQuant.getColormap()),this.dither?this.ditherPixels(this.dither.replace("-serpentine",""),null!==this.dither.match(/-serpentine/)):this.indexPixels(),this.pixels=null,this.colorDepth=8,this.palSize=7,null!==this.transparent&&(this.transIndex=this.findClosest(this.transparent,!0))},l.prototype.indexPixels=function(t){var e=this.pixels.length/3;this.indexedPixels=new Uint8Array(e);for(var i=0,r=0;r<e;r++){var s=this.findClosestRGB(255&this.pixels[i++],255&this.pixels[i++],255&this.pixels[i++]);this.usedEntry[s]=!0,this.indexedPixels[r]=s}},l.prototype.ditherPixels=function(t,e){var i={FalseFloydSteinberg:[[3/8,1,0],[3/8,0,1],[.25,1,1]],FloydSteinberg:[[7/16,1,0],[3/16,-1,1],[5/16,0,1],[1/16,1,1]],Stucki:[[8/42,1,0],[4/42,2,0],[2/42,-2,1],[4/42,-1,1],[8/42,0,1],[4/42,1,1],[2/42,2,1],[1/42,-2,2],[2/42,-1,2],[4/42,0,2],[2/42,1,2],[1/42,2,2]],Atkinson:[[1/8,1,0],[1/8,2,0],[1/8,-1,1],[1/8,0,1],[1/8,1,1],[1/8,0,2]]};if(!t||!i[t])throw"Unknown dithering kernel: "+t;var r=i[t],s=0,o=this.height,n=this.width,a=this.pixels,h=e?-1:1;this.indexedPixels=new Uint8Array(this.pixels.length/3);for(var l=0;l<o;l++){e&&(h*=-1);for(var u=1==h?0:n-1,p=1==h?n:0;u!==p;u+=h){var f=3*(s=l*n+u),c=a[f],y=a[f+1],d=a[f+2];f=this.findClosestRGB(c,y,d),this.usedEntry[f]=!0,this.indexedPixels[s]=f,f*=3;for(var w=c-this.colorTab[f],g=y-this.colorTab[f+1],b=d-this.colorTab[f+2],x=1==h?0:r.length-1,P=1==h?r.length:0;x!==P;x+=h){var v=r[x][1],m=r[x][2];if(v+u>=0&&v+u<n&&m+l>=0&&m+l<o){var B=r[x][0];f=s+v+m*n,a[f*=3]=Math.max(0,Math.min(255,a[f]+w*B)),a[f+1]=Math.max(0,Math.min(255,a[f+1]+g*B)),a[f+2]=Math.max(0,Math.min(255,a[f+2]+b*B))}}}}},l.prototype.findClosest=function(t,e){return this.findClosestRGB((16711680&t)>>16,(65280&t)>>8,255&t,e)},l.prototype.findClosestRGB=function(t,e,i,r){if(null===this.colorTab)return-1;if(this.neuQuant&&!r)return this.neuQuant.lookupRGB(t,e,i);for(var s=0,o=16777216,n=this.colorTab.length,a=0,h=0;a<n;h++){var l=t-(255&this.colorTab[a++]),u=e-(255&this.colorTab[a++]),p=i-(255&this.colorTab[a++]),f=l*l+u*u+p*p;(!r||this.usedEntry[h])&&f<o&&(o=f,s=h)}return s},l.prototype.getImagePixels=function(){var t=this.width,e=this.height;this.pixels=new Uint8Array(t*e*3);for(var i=this.image,r=0,s=0,o=0;o<e;o++)for(var n=0;n<t;n++)this.pixels[s++]=i[r++],this.pixels[s++]=i[r++],this.pixels[s++]=i[r++],r++},l.prototype.writeGraphicCtrlExt=function(){var t,e;this.out.writeByte(33),this.out.writeByte(249),this.out.writeByte(4),null===this.transparent?(t=0,e=0):(t=1,e=2),this.dispose>=0&&(e=7&this.dispose),e<<=2,this.out.writeByte(0|e|t),this.writeShort(this.delay),this.out.writeByte(this.transIndex),this.out.writeByte(0)},l.prototype.writeImageDesc=function(){this.out.writeByte(44),this.writeShort(0),this.writeShort(0),this.writeShort(this.width),this.writeShort(this.height),this.firstFrame||this.globalPalette?this.out.writeByte(0):this.out.writeByte(128|this.palSize)},l.prototype.writeLSD=function(){this.writeShort(this.width),this.writeShort(this.height),this.out.writeByte(240|this.palSize),this.out.writeByte(0),this.out.writeByte(0)},l.prototype.writeNetscapeExt=function(){this.out.writeByte(33),this.out.writeByte(255),this.out.writeByte(11),this.out.writeUTFBytes("NETSCAPE2.0"),this.out.writeByte(3),this.out.writeByte(1),this.writeShort(this.repeat),this.out.writeByte(0)},l.prototype.writePalette=function(){this.out.writeBytes(this.colorTab);for(var t=768-this.colorTab.length,e=0;e<t;e++)this.out.writeByte(0)},l.prototype.writeShort=function(t){this.out.writeByte(255&t),this.out.writeByte(t>>8&255)},l.prototype.writePixels=function(){new s.a(this.width,this.height,this.indexedPixels,this.colorDepth).encode(this.out)},l.prototype.stream=function(){return this.out},self.onmessage=function(t){const e=t.data,i=new l(e.width,e.height);0===e.index?i.writeHeader():i.firstFrame=!1,i.setTransparent(e.transparent),i.setDispose(e.dispose),i.setRepeat(e.repeat),i.setDelay(e.delay),i.setQuality(e.quality),i.setDither(e.dither),i.setGlobalPalette(e.globalPalette),i.addFrame(e.data),e.last&&i.finish(),!0===e.globalPalette&&(e.globalPalette=i.getGlobalPalette());const r=i.stream();if(e.data=r.pages,e.cursor=r.cursor,e.pageSize=r.constructor.pageSize,e.canTransfer){const t=Array.from(e.data).map(t=>t.buffer);return self.postMessage(e,t)}return self.postMessage(e)}}]);',
        i.p + "a64f2600dfa962d9062c.worker.js"
      );
    };
  },
  function(t, e, i) {
    "use strict";
    i.r(e);
    var r = i(0),
      n = i.n(r),
      s = i(1),
      o = i.n(s);
    window.GifEncoder =
      /*!
  GifEncoder.js

  Authors
  Kevin Weiner (original Java version - kweiner@fmsware.com)
  Thibault Imbert (AS3 version - bytearray.org)
  Johan Nordberg (JS version - code@johan-nordberg.com)
  Ketchetwahmeegwun T. Southall (JavaScript restructure - kettek@kettek.net)
*/
      class extends n.a {
        constructor(t) {
          super(), (this._running = !1), (this._options = Object.assign(
            {
              workers: 2,
              repeat: 0,
              background: "#000",
              quality: 10,
              width: null,
              height: null,
              transparent: null,
              debug: !1,
              dither: !1
            },
            t
          )), (this._frames = []), (this._freeWorkers = []), (this._activeWorkers = []);
        }
        setWidth(t) {
          (this._options.width = t), null != this._canvas &&
            (this._canvas.width = t);
        }
        setHeight(t) {
          (this._options.height = t), null != this._canvas &&
            (this._canvas.height = t);
        }
        addFrame(t, e) {
          e = e || {};
          const i = Object.assign(
            {
              delay: 500,
              copy: !1,
              dispose: -1,
              transparent: this._options.transparent
            },
            e
          );
          if (
            (
              null == this._options.width && this.setWidth(t.width),
              null == this._options.height && this.setHeight(t.height),
              t instanceof ImageData
            )
          )
            i.data = t.data;
          else if (
            t instanceof CanvasRenderingContext2D ||
            t instanceof WebGLRenderingContext
          )
            e.copy ? (i.data = this.getContextData(t)) : (i.context = t);
          else {
            if (null == t.childNodes) throw new Error("Invalid image");
            e.copy ? (i.data = this.getImageData(t)) : (i.image = t);
          }
          return this._frames.push(i);
        }
        get running() {
          return this._running;
        }
        render() {
          let t;
          if (this.running) throw new Error("Already running");
          if (null == this._options.width || null == this._options.height)
            throw new Error("Width and height must be set prior to rendering");
          (this._running = !0), (this._nextFrame = 0), (this._finishedFrames = 0), (this._imageParts = (() => {
            let e, i;
            const r = [];
            for (
              t = 0, e = 0 <= (i = this._frames.length);
              e ? t < i : t > i;
              e ? t++ : t--
            )
              r.push(null);
            return r;
          })());
          const e = this.spawnWorkers();
          if (!0 === this._options.globalPalette) this.renderNextFrame();
          else {
            let i, r;
            for (t = 0, i = 0 <= (r = e); i ? t < r : t > r; i ? t++ : t--)
              this.renderNextFrame();
          }
          return this.dispatchEvent(
            new ProgressEvent("start")
          ), this.dispatchEvent(
            new ProgressEvent("progress", {
              loaded: this._finishedFrames,
              total: this._frames.length
            })
          );
        }
        abort() {
          for (;;) {
            var t = this._activeWorkers.shift();
            if (null == t) break;
            t.terminate();
          }
          (this._running = !1), this.dispatchEvent(new ProgressEvent("abort"));
        }
        spawnWorkers() {
          const t = Math.min(this._options.workers, this._frames.length);
          return (function(t, e, i) {
            let r = [],
              n = t < e,
              s = i ? (n ? e + 1 : e - 1) : e;
            for (let e = t; n ? e < s : e > s; n ? e++ : e--) r.push(e);
            return r;
          })(this._freeWorkers.length, t, !1).forEach(t => {
            const e = new o.a();
            return (e.onmessage = t => (
              this._activeWorkers.splice(this._activeWorkers.indexOf(e), 1),
              this._freeWorkers.push(e),
              this.frameFinished(t.data)
            )), this._freeWorkers.push(e);
          }), t;
        }
        frameFinished(t) {
          if (
            (
              this._finishedFrames++,
              this.dispatchEvent(
                new ProgressEvent("progress", {
                  loaded: this._finishedFrames,
                  total: this._frames.length
                })
              ),
              (this._imageParts[t.index] = t),
              !0 === this._options.globalPalette &&
                (
                  (this._options.globalPalette = t.globalPalette),
                  this._frames.length > 2
                )
            )
          )
            for (
              let t = 1, e = this._freeWorkers.length, i = 1 <= e;
              i ? t < e : t > e;
              i ? t++ : t--
            )
              this._renderNextFrame();
          return Array.from(this._imageParts).includes(null)
            ? this.renderNextFrame()
            : this.finishRendering();
        }
        finishRendering() {
          let t,
            e = 0;
          for (t of Array.from(this._imageParts))
            e += (t.data.length - 1) * t.pageSize + t.cursor;
          e += t.pageSize - t.cursor;
          const i = new Uint8Array(e);
          let r = 0;
          for (t of Array.from(this._imageParts))
            for (let e = 0; e < t.data.length; e++) {
              const n = t.data[e];
              i.set(n, r), e === t.data.length - 1
                ? (r += t.cursor)
                : (r += t.pageSize);
            }
          const n = new Blob([i], { type: "image/gif" });
          return this.dispatchEvent(new BlobEvent("finished", { data: n }));
        }
        renderNextFrame() {
          if (0 === this._freeWorkers.length)
            throw new Error("No free workers");
          if (this._nextFrame >= this._frames.length) return;
          const t = this._frames[this._nextFrame++],
            e = this._freeWorkers.shift(),
            i = this.getTask(t);
          return this._activeWorkers.push(e), e.postMessage(i);
        }
        getContextData(t) {
          return t.getImageData(0, 0, this._options.width, this._options.height)
            .data;
        }
        getImageData(t) {
          null == this._canvas &&
            (
              (this._canvas = document.createElement("canvas")),
              (this._canvas.width = this._options.width),
              (this._canvas.height = this._options.height)
            );
          const e = this._canvas.getContext("2d");
          return (e.setFill = this._options.background), e.fillRect(
            0,
            0,
            this._options.width,
            this._options.height
          ), e.drawImage(t, 0, 0), this.getContextData(e);
        }
        getTask(t) {
          const e = this._frames.indexOf(t),
            i = {
              index: e,
              last: e === this._frames.length - 1,
              delay: t.delay,
              dispose: t.dispose,
              transparent: t.transparent,
              width: this._options.width,
              height: this._options.height,
              quality: this._options.quality,
              dither: this._options.dither,
              globalPalette: this._options.globalPalette,
              repeat: this._options.repeat
            };
          if (null != t.data) i.data = t.data;
          else if (null != t.context) i.data = this._getContextData(t.context);
          else {
            if (null == t.image) throw new Error("Invalid frame");
            i.data = this._getImageData(t.image);
          }
          return i;
        }
      };
  },
  function(t, e, i) {
    "use strict";
    var r = window.URL || window.webkitURL;
    t.exports = function(t, e) {
      try {
        try {
          var i;
          try {
            (i = new (window.BlobBuilder ||
              window.WebKitBlobBuilder ||
              window.MozBlobBuilder ||
              window.MSBlobBuilder)()).append(t), (i = i.getBlob());
          } catch (e) {
            i = new Blob([t]);
          }
          return new Worker(r.createObjectURL(i));
        } catch (e) {
          return new Worker(
            "data:application/javascript," + encodeURIComponent(t)
          );
        }
      } catch (t) {
        if (!e) throw Error("Inline worker is not supported");
        return new Worker(e);
      }
    };
  }
]);
