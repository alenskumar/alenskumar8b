window.requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function(callback) {
        window.setTimeout(callback, 1000 / 60);
      };
  })();
  var c;
  var $;
  
  var w;
  var h;
  var _w;
  var _h;
  
  var rad = Math.PI / 180;
  
  var ms = new msp(0, 0);
  
  var arr = [];
  
  var s = 20;
  
  var num = 400;
  
  var pts = [];
  var f = -500;
  var vel_x;
  var vel_y;
  
  var cnt = 0;
  var cnt_ = 0;
  
  var cols = [
    'hsla(194, 95%, 35%, 1)',
    'hsla(299, 95%, 45%, 1)',
    'hsla(60, 95%, 65%, 1)',
    'hsla(331, 95%, 45%, 1)',
    'hsla(255, 255%, 255%, 1)',
    'hsla(117, 95%, 55%, 1)'
  ];
  
  function Ln(x, y, col) {
    this.x = x;
    this.y = y;
    this.col = col;
  
    this.ang = 45;
    this.ang_ = 45;
  
    this.s = 1;
  
    this.ease = Math.random();
  
    this.draw = function($, tx, ty) {
  
      this.x += (tx - this.x) * this.ease;
      this.y += (ty - this.y) * this.ease;
  
      this.s += (s - this.s) * 0.1;
  
      var s_ = this.s * 0.5;
      var radi = this.ang * rad;
      var radi_ = this.ang_ * rad;
      var l1 = s_ * Math.cos(radi);
      var l2 = s_ * Math.sin(radi);
      var l3 = s_ * Math.cos(radi_);
      var l4 = s_ * Math.sin(radi_);
  
      this.ang += 33;
      if (this.ang >= 360) this.ang = 0;
  
      this.ang_ -= 33;
      if (this.ang_ <= 0) this.ang_ = 360;
  
      var x1 = this.x - l1;
      var y1 = this.y - l2;
      var x2 = this.x + l1;
      var y2 = this.y + l2;
      var x3 = this.x + l3;
      var y3 = this.y - l4;
      var x4 = this.x - l3;
      var y4 = this.y + l4;
  
      $.beginPath();
      $.lineWidth = 6;
      $.lineCap = 'round';
      $.globalCompositeOperation = 'difference';
  
      $.strokeStyle = this.col;
      $.moveTo(x1, y1);
      $.lineTo(x2, y2);
      $.stroke();
  
      $.beginPath();
      $.moveTo(x3, y3);
      $.lineTo(x4, y4);
      $.stroke();
  
    }
  }
  
  function Pt(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.xPos = w * 0.5;
    this.yPos = h * 0.5;
  
    this.updPos = function(x, y, z) {
      this.x = x;
      this.y = y;
      this.z = z;
  
      var sc = f / (f + this.z);
      this.xPos = vel_x + this.x * sc;
      this.yPos = vel_y + this.y * sc;
    }
  }
  
  onload = function() {
    go();
  };
  
  function go() {
    set();
  
    _Pt();
  
    _Ln();
  
    window.document.onmousemove = function(e) {
      ms.updms(msmv(e));
    };
    window.document.ontouchmove = function(e) {
      ms.updms(tcmv(e));
    };
    run();
  
    function run() {
      setTimeout(function() {
        window.requestAnimFrame(run);
        upd();
  
      }, 1000 / 30);
    }
  }
  
  function upd() {
    _upd();
  
    _updPts();
  
    _drawLn();
  
    _fin();
  
    resize();
  }
  
  function _updPts() {
    var angY = (ms.msX - vel_x) * 0.0001;
    var cosY = Math.cos(angY);
    var sinY = Math.sin(angY);
  
    var angX = (ms.msY - vel_y) * 0.0001;
    var cosX = Math.cos(angX);
    var sinX = Math.sin(angX);
  
    var len = pts.length;
    for (var i = 0; i < len; i++) {
      var p = pts[i];
  
      var x1 = p.x * cosY - p.z * sinY;
      var z1 = p.z * cosY + p.x * sinY;
  
      var y1 = p.y * cosX - z1 * sinX;
      var z2 = z1 * cosX + p.y * sinX;
  
      p.updPos(x1, y1, z2);
    }
  }
  
  function _drawLn() {
    for (var i = 0; i < cnt; i++) {
      var l = arr[i];
      var p = pts[i];
  
      l.draw($, p.xPos, p.yPos);
    }
  
    var len = arr.length;
    cnt += 5;
    if (cnt >= len) cnt = len;
  }
  
  function _Pt() {
    for (var i = 0; i < num; i++) {
      var x = w * 2 * Math.random() - w * 2 * 0.5;
      var y = h * 2 * Math.random() - h * 2 * 0.5;
      var z = Math.random() * 3000 - 1000;
  
      var p = new Pt(x, y, z);
      pts[i] = p;
    }
  }
  
  function _Ln() {
    var len = pts.length;
    for (var i = 0; i < len; i++) {
      var p = pts[i];
  
      var col = rndCol();
      var x = p.xPos;
      var y = p.yPos;
  
      var l = new Ln(x, y, col);
      arr[i] = l;
    }
  }
  
  function rndCol() {
    var len = cols.length;
  
    var hues = Math.floor(Math.random() * len);
    return cols[hues];
  }
  
  function set() {
    c = document.getElementById('canv');
    $ = c.getContext('2d');
  
    w = window.innerWidth;
    h = window.innerHeight;
  
    vel_x = w * 0.5;
    vel_y = h * 0.5;
  
    c.width = w;
    c.height = h;
  
  }
  
  function _upd() {
    $.clearRect(0, 0, w, h);
    $.save();
  }
  
  function _fin() {
    $.restore();
  }
  
  function reset() {
    set();
  
    delete ms;
    ms = new msp(0, 0);
  }
  
  function resize() {
    var rw = window.innerWidth;
    var rh = window.innerHeight;
  
    if (rw != w || rh != h) reset();
  }
  
  function msmv(e) {
    var n = {};
  
    if (e) {
      n.x = e.pageX;
      n.y = e.pageY;
    } else {
      n.x = e.x + document.body.scrollLeft;
      n.y = e.y + document.body.scrollTop;
    }
    return n;
  }
  
  function tcmv(e) {
    var n = {};
  
    if (e) {
      n.x = e.touches[0].pageX;
      n.y = e.touches[0].pageY;
    } else {
      n.x = e.x + document.body.scrollLeft;
      n.y = e.y + document.body.scrollTop;
    }
    return n;
  }
  
  function msp(msX, msY) {
    this.msX = msX;
    this.msY = msY;
  
    this.updms = function(n) {
      this.msX = n.x;
      this.msY = n.y;
    };
  }


  
