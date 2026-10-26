(function(){
"use strict";
var K = window.Compass, TAGS = window.TAGS;
var PLANETS = {1:"Солнце",2:"Луна",3:"Юпитер",4:"Раху",5:"Меркурий",6:"Венера",7:"Кету",8:"Сатурн",9:"Марс"};
var MONTHS = ["января","февраля","марта","апреля","мая","июня","июля","августа","сентября","октября","ноября","декабря"];
var POS = [
  {k:"soul", t:"Душа", d:"Ваши отношения с собой: что вы думаете о себе и о жизни.", h:"Число дня рождения"},
  {k:"karma", t:"Карма", d:"Препятствия, которые приходят через людей и обстоятельства, и для чего они.", h:"Число месяца рождения"},
  {k:"gifts", t:"Дары", d:"Что вам дано от рождения и почему оно может быть закрыто.", h:"Две последние цифры года"},
  {k:"fate", t:"Судьба", d:"Какой опыт наработан раньше и какой предстоит нарабатывать.", h:"Все цифры года"},
  {k:"way", t:"Путь", d:"Какие шаги ведут к результату и что мешает.", h:"Все цифры даты рождения"},
  {k:"way", t:"Планета", d:"Какая сила стоит за вашим числом и чему она учит.", h:"То же число, что и в Пути", planet:true}
];
function $(id){ return document.getElementById(id); }
function esc(s){ return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
function parse(str){
  var m = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/.exec(String(str).trim());
  if(!m) return null;
  var d = +m[1], mo = +m[2], y = +m[3], dt = new Date(y, mo - 1, d);
  if(dt.getFullYear() !== y || dt.getMonth() !== mo - 1 || dt.getDate() !== d) return null;
  if(y < 1900 || dt > new Date()) return null;
  return {d:d, m:mo, y:y};
}
function render(o){
  var v = K.compass(o.d, o.m, o.y), tr = K.trace(o.d, o.m, o.y), h = "";
  h += '<div class="card rhead"><div class="logo">Точка опоры</div><h2>Компас души</h2><div class="sub">' + o.d + " " + MONTHS[o.m - 1] + " " + o.y + ' года</div><div class="six">';
  POS.forEach(function(p){
    var n = v[p.k];
    h += '<div class="cell"><b>' + p.t + '</b><div class="disc">' + n + '</div><i>' + (p.planet ? PLANETS[n] : "число " + n) + '</i></div>';
  });
  h += '</div></div>';
  POS.forEach(function(p, i){
    var n = v[p.k];
    h += '<section class="card sec"><div class="eb">Позиция ' + (i + 1) + '</div><h3>' + p.t + ': ' + (p.planet ? PLANETS[n] + ", число " + n : "число " + n) + '</h3><hr>';
    h += '<p>' + esc(p.d) + '</p>';
    h += '<p><b>' + esc(TAGS[n]) + '</b></p>';
    h += '<p class="hint">' + p.h + (p.planet ? "" : ": " + tr[p.k]) + '.</p></section>';
  });
  h += '<section class="card club"><div class="eb">Полный разбор</div><h2>Что стоит за этими числами</h2><p>В полном разборе каждая позиция описана подробно: светлый и трудный варианты, вопросы для размышления и практика на баланс вашего главного числа. Его можно скачать в PDF или Word.</p><div class="acts"><a class="btn" href="https://axis-axi.github.io/karta-dushi/" target="_blank" rel="noopener">Получить полный разбор</a><button class="btn alt" id="print">Сохранить расчёт в PDF</button></div></section>';
  var res = $("result"); res.innerHTML = h; res.hidden = false;
  $("print").onclick = function(){ window.print(); };
  res.scrollIntoView({behavior:"smooth", block:"start"});
}
function init(){
  var inp = $("date");
  inp.addEventListener("input", function(){
    var v = inp.value.replace(/\D/g, "").slice(0, 8), o = v;
    if(v.length > 4) o = v.slice(0,2) + "." + v.slice(2,4) + "." + v.slice(4);
    else if(v.length > 2) o = v.slice(0,2) + "." + v.slice(2);
    inp.value = o;
  });
  function go(){
    var e = $("err"), o = parse(inp.value);
    if(!o){ e.textContent = "Проверьте дату: нужен формат ДД.ММ.ГГГГ, например 14.10.2002."; e.hidden = false; return; }
    e.hidden = true; render(o);
  }
  inp.addEventListener("keydown", function(ev){ if(ev.key === "Enter") go(); });
  $("go").onclick = go;
  Array.prototype.forEach.call(document.querySelectorAll(".pal button"), function(b){
    b.onclick = function(){
      document.body.setAttribute("data-pal", b.getAttribute("data-p"));
      Array.prototype.forEach.call(document.querySelectorAll(".pal button"), function(x){ x.classList.toggle("on", x === b); });
    };
  });
}
init();
})();
