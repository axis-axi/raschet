(function(root){
"use strict";
function dsum(n){ var s = 0; String(Math.abs(n)).split("").forEach(function(c){ s += +c; }); return s; }
function red(n){ n = Math.abs(n); while(n > 9){ n = dsum(n); } return n; }
// Расчёт Компаса души: день, месяц, две последние цифры года, весь год, вся дата.
function compass(d, m, y){
  var steps = [], v = {};
  v.soul = red(d);
  v.karma = red(m);
  v.gifts = red((y % 100));
  v.fate = red(y);
  v.way = red(dsum(d) + dsum(m) + dsum(y));
  return v;
}
function trace(d, m, y){
  function sumLine(parts){ return parts.join(" + "); }
  function chain(n){
    var out = [String(n)], cur = n;
    while(cur > 9){ var ds = String(cur).split(""); var s = dsum(cur); out.push(ds.join(" + ") + " = " + s); cur = s; }
    return out;
  }
  function line(label, num, base){ // base: строка из чисел, например "1 + 4"
    var parts = []; if(base) parts.push(base);
    return label;
  }
  var yy = y % 100, yy2 = (yy < 10 ? "0" : "") + yy;
  return {
    soul: String(d).split("").join(" + ") + " = " + dsum(d) + (dsum(d) > 9 ? ", затем " + String(dsum(d)).split("").join(" + ") + " = " + red(d) : ""),
    karma: String(m).split("").join(" + ") + " = " + dsum(m) + (dsum(m) > 9 ? ", затем " + String(dsum(m)).split("").join(" + ") + " = " + red(m) : ""),
    gifts: yy2.split("").join(" + ") + " = " + dsum(yy) + (dsum(yy) > 9 ? ", затем " + String(dsum(yy)).split("").join(" + ") + " = " + red(yy) : ""),
    fate: String(y).split("").join(" + ") + " = " + dsum(y) + (dsum(y) > 9 ? ", затем " + String(dsum(y)).split("").join(" + ") + " = " + red(y) : ""),
    way: ((d < 10 ? "0" : "") + d + (m < 10 ? "0" : "") + m + y).split("").join(" + ") + " = " + (dsum(d) + dsum(m) + dsum(y)) + ((dsum(d) + dsum(m) + dsum(y)) > 9 ? ", затем " + String(dsum(d) + dsum(m) + dsum(y)).split("").join(" + ") + " = " + red(dsum(d) + dsum(m) + dsum(y)) : "")
  };
}
root.Compass = {compass:compass, trace:trace, red:red, dsum:dsum};
})(typeof window !== "undefined" ? window : module.exports);
