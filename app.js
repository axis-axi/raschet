(function(){
"use strict";
var KD = window.KD;
var SECT = ["Душа","Карма","Дары","Судьба","Путь","Планета"];
var PLANETS = {1:"Солнце",2:"Луна",3:"Юпитер",4:"Раху",5:"Меркурий",6:"Венера",7:"Кету",8:"Сатурн",9:"Марс"};
var INTRO = [
 "Первый сектор, главный центр вашей души. Он показывает ваши отношения с собой: почему может быть дисбаланс и как его выровнять.",
 "Второй сектор. Здесь видно, какие препятствия судьба предлагает пройти через людей и обстоятельства, и главное, для чего. Вместе с блокировками разобран способ их обойти.",
 "Третий сектор. Этими дарами вас наградили самим фактом рождения, но не всегда они проявляются. Здесь видно, что именно вам дано и как открыть то, что пока закрыто.",
 "Четвёртый сектор. В судьбе заложены ответы на вопросы, где ваш ресурс, смогли ли вы наработать опыт раньше и какие приоритеты помогают получать вознаграждение.",
 "Мы подходим к главному. Сектор пути показывает, какие шаги ведут к результату, через что вам благоприятно реализовываться и что мешает осуществить мечты. Здесь разбирается программа всей жизни, поэтому что-то может показаться не про вас: этот вариант либо ещё не проявился, либо остался в прошлом.",
 "Заключительный сектор. У каждой планеты есть число и своя программа. Здесь видно, какая планета влияет на ваш сценарий, какими качествами наделяет и что предлагает."
];
var CLUB = "Клуб Точка опоры: обучение по подписке, девять факультетов и записанные уроки, которые можно смотреть в своём темпе. Подписка: https://tochka-opory.lpxl.ru/podpiska";
var CHAN = "Телеграм-канал: https://t.me/nadin_matrix";
var NOTE = "Ваша карта составляется один раз и на всю жизнь. Описанное могло проявиться раньше или проявится позже. Если какой-то вариант вам совсем незнаком, значит, он ещё не проигрался или давно остался в прошлом. Тёмные варианты описаны не затем, чтобы они обязательно сбылись, а чтобы вы смогли их заметить и обойти.";
var PALS = {
 vino:{main:"5E1A1E",acc:"A8823C",line:"C6A15B",ink:"3A2A22",mute:"7C6B5C",rule:"DCCBAA",card:"EFE3D2"},
 lilac:{main:"5E3A8C",acc:"A8823C",line:"C6A15B",ink:"2F2A38",mute:"6F6680",rule:"E3D8EE",card:"E9E0F3"},
 tealpink:{main:"0F6B70",acc:"C94F7C",line:"E58BA8",ink:"1F3436",mute:"5B7576",rule:"CBE5E6",card:"DDF0F0"}
};
var pal = "vino", R = null;

function red(n){ while(n > 9){ var s = 0; String(n).split("").forEach(function(c){ s += +c; }); n = s; } return n; }
function digs(n){ var s = 0; String(n).split("").forEach(function(c){ s += +c; }); return s; }
function parse(str){
  var m = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/.exec(String(str).trim());
  if(!m) return null;
  var d = +m[1], mo = +m[2], y = +m[3];
  var dt = new Date(y, mo - 1, d);
  if(dt.getFullYear() !== y || dt.getMonth() !== mo - 1 || dt.getDate() !== d) return null;
  if(y < 1900 || dt > new Date()) return null;
  return {d:d, m:mo, y:y};
}
function compute(o){
  var all = digs(o.d) + digs(o.m) + digs(o.y);
  var way = red(all);
  return [red(digs(o.d)), red(digs(o.m)), red(digs(o.y % 100)), red(digs(o.y)), way, way];
}
function pad(n){ return (n < 10 ? "0" : "") + n; }
function esc(s){ return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
function $(id){ return document.getElementById(id); }

/* ---------- как посчитано ---------- */
function chain(label, digits, total){
  var s = digits.join(" + ") + " = " + total;
  if(total > 9){ var t2 = red(total); s += ", затем " + String(total).split("").join(" + ") + " = " + t2; }
  return '<li><b>' + label + ':</b> ' + s + '</li>';
}
function calcBlock(){
  var p = R.date.split("."), d = +p[0], m = +p[1], y = +p[2];
  var yy = y % 100, yy2 = (yy < 10 ? "0" : "") + yy;
  var all = (p[0] + p[1] + p[2]).split("");
  var t = '<details class="calc"><summary>Как это посчитано</summary><ul>';
  t += chain("Душа, число дня рождения", String(d).split(""), digs(d));
  t += chain("Карма, число месяца", String(m).split(""), digs(m));
  t += chain("Дары, две последние цифры года", yy2.split(""), digs(yy));
  t += chain("Судьба, все цифры года", String(y).split(""), digs(y));
  t += chain("Путь и планета, все цифры даты", all, digs(d) + digs(m) + digs(y));
  return t + '</ul></details>';
}
/* ---------- экран ---------- */
function render(){
  var nums = R.nums, h = "";
  var who = R.name ? esc(R.name) : "Ваша карта";
  h += '<div class="card rhead"><div class="logo">Точка опоры</div><h2>' + who + '</h2><div class="sub">Компас души · ' + R.date + '</div>';
  h += '<div class="six">';
  for(var i = 0; i < 6; i++){
    h += '<div class="cell"><b>' + SECT[i] + '</b><div class="disc">' + nums[i] + '</div><i>' + (i === 5 ? PLANETS[nums[i]] : "число " + nums[i]) + '</i></div>';
  }
  h += '</div><p class="how">' + esc(NOTE) + '</p>' + calcBlock() + '</div>';
  h += '<div class="acts"><button class="btn" id="pdf">Скачать PDF</button><button class="btn alt" id="doc">Скачать Word</button></div>';
  for(var k = 0; k < 6; k++){
    var D = KD[nums[k]], S = D.sec[k];
    h += '<section class="card sec"><div class="eb">Сектор ' + (k + 1) + ' · ' + SECT[k] + '</div><h3>' + esc(S.t) + '</h3><hr>';
    h += '<p><em>' + esc(INTRO[k]) + '</em></p>';
    S.p.forEach(function(p){ h += '<p>' + esc(p) + '</p>'; });
    if(S.q.length){ h += '<div class="q"><h4>Вопросы для размышления</h4><ul>' + S.q.map(function(q){ return '<li>' + esc(q) + '</li>'; }).join("") + '</ul></div>'; }
    h += '</section>';
  }
  var main = KD[nums[4]].practice;
  h += '<section class="card sec prac"><div class="eb">Практика на баланс</div><h3>' + esc(main.t) + '</h3><hr><p>' + esc(main.intro) + '</p><ol>' + main.steps.map(function(s){ return '<li>' + esc(s) + '</li>'; }).join("") + '</ol>';
  main.tail.forEach(function(t){ h += '<p>' + esc(t) + '</p>'; });
  h += '</section>';
  var res = $("result"); res.innerHTML = h; res.hidden = false;
  $("pdf").onclick = function(){ busy(this, exportPdf); };
  $("doc").onclick = function(){ busy(this, exportWord); };
  res.scrollIntoView({behavior:"smooth", block:"start"});
}
function busy(btn, fn){
  var t = btn.textContent; btn.disabled = true; btn.textContent = "Готовим файл…";
  Promise.resolve().then(fn).catch(function(e){ if(window.console) console.warn(e); }).then(function(){ btn.disabled = false; btn.textContent = t; });
}

/* ---------- общие ---------- */
function download(blob, name){
  var a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name;
  document.body.appendChild(a); a.click();
  setTimeout(function(){ URL.revokeObjectURL(a.href); document.body.removeChild(a); }, 1500);
}
function fileBase(){ return ("Компас души" + (R.name ? " " + R.name : "") + " " + R.date).replace(/[\\\/:*?"<>|]/g, ""); }
function loadScript(u){ return new Promise(function(res, rej){ var s = document.createElement("script"); s.src = u; s.onload = res; s.onerror = rej; document.head.appendChild(s); }); }
function parts(){
  var out = [];
  for(var k = 0; k < 6; k++){ var S = KD[R.nums[k]].sec[k]; out.push({eb:"Сектор " + (k + 1) + " · " + SECT[k], t:S.t, intro:INTRO[k], p:S.p, q:S.q}); }
  return out;
}

/* ---------- PDF ---------- */
function exportPdf(){
  var P = PALS[pal];
  return loadScript("pdfmake.min.js").then(function(){ return loadScript("pdf-fonts.js"); }).then(function(){
    window.pdfMake.fonts = {
      Montserrat:{normal:"mont-400.ttf",bold:"mont-600.ttf",italics:"mont-400.ttf",bolditalics:"mont-600.ttf"},
      Playfair:{normal:"play-500.ttf",bold:"play-500.ttf",italics:"play-500.ttf",bolditalics:"play-500.ttf"}};
    var c = [];
    c.push({text:"ТОЧКА ОПОРЫ", fontSize:8, bold:true, color:"#" + P.acc, characterSpacing:3, alignment:"center"});
    c.push({text:"Компас души", font:"Playfair", fontSize:30, color:"#" + P.main, alignment:"center", margin:[0,8,0,2]});
    c.push({text:"Карта вашей души по дате рождения", fontSize:9, color:"#" + P.mute, alignment:"center", margin:[0,0,0,4]});
    c.push({text:(R.name ? R.name + " · " : "") + R.date, fontSize:10, color:"#" + P.mute, alignment:"center", margin:[0,0,0,16]});
    var head = [], row = [];
    for(var i = 0; i < 6; i++){
      head.push({text:SECT[i].toUpperCase(), fontSize:7, bold:true, color:"#" + P.acc, alignment:"center", characterSpacing:1});
      row.push({text:String(R.nums[i]) + "\n" + (i === 5 ? PLANETS[R.nums[i]] : ""), font:"Playfair", fontSize:i === 5 ? 11 : 20, color:"#" + P.main, alignment:"center"});
    }
    c.push({table:{widths:["*","*","*","*","*","*"], body:[head,row]}, layout:{hLineColor:"#" + P.rule, vLineColor:"#" + P.rule, hLineWidth:function(){return .6;}, vLineWidth:function(){return .6;}, paddingTop:function(){return 8;}, paddingBottom:function(){return 8;}}, margin:[0,0,0,14]});
    c.push({text:NOTE, fontSize:9, color:"#" + P.mute, lineHeight:1.4, margin:[0,0,0,10]});
    parts().forEach(function(s){
      c.push({text:s.eb.toUpperCase(), fontSize:7.5, bold:true, color:"#" + P.acc, characterSpacing:1.6, margin:[0,16,0,3], pageBreak:null});
      c.push({text:s.t, font:"Playfair", fontSize:16, color:"#" + P.main, margin:[0,0,0,4]});
      c.push({canvas:[{type:"line", x1:0, y1:0, x2:515, y2:0, lineWidth:.8, lineColor:"#" + P.line}], margin:[0,0,0,8]});
      c.push({text:s.intro, italics:true, fontSize:9.5, color:"#" + P.mute, lineHeight:1.45, margin:[0,0,0,6]});
      s.p.forEach(function(p){ c.push({text:p, fontSize:10, color:"#" + P.ink, lineHeight:1.5, margin:[0,0,0,6]}); });
      if(s.q.length){
        c.push({text:"ВОПРОСЫ ДЛЯ РАЗМЫШЛЕНИЯ", fontSize:7.5, bold:true, color:"#" + P.acc, characterSpacing:1.4, margin:[0,6,0,3]});
        c.push({ul:s.q, fontSize:9.8, color:"#" + P.ink, lineHeight:1.45, margin:[0,0,0,4]});
      }
    });
    var m = KD[R.nums[4]].practice;
    c.push({text:"ПРАКТИКА НА БАЛАНС", fontSize:7.5, bold:true, color:"#" + P.acc, characterSpacing:1.6, margin:[0,18,0,3]});
    c.push({text:m.t, font:"Playfair", fontSize:16, color:"#" + P.main, margin:[0,0,0,6]});
    c.push({text:m.intro, fontSize:10, lineHeight:1.5, margin:[0,0,0,4]});
    c.push({ol:m.steps, fontSize:10, lineHeight:1.5, margin:[0,0,0,4]});
    m.tail.forEach(function(t){ c.push({text:t, fontSize:10, lineHeight:1.5}); });
    c.push({text:"КЛУБ И КАНАЛ", fontSize:7.5, bold:true, color:"#" + P.acc, characterSpacing:1.6, margin:[0,22,0,3]});
    c.push({text:"Клуб Точка опоры", font:"Playfair", fontSize:16, color:"#" + P.main, margin:[0,0,0,4]});
    c.push({text:"Обучение по подписке: девять факультетов и записанные уроки, которые можно смотреть в своём темпе.", fontSize:10, lineHeight:1.5, margin:[0,0,0,4]});
    c.push({text:"Подписка: tochka-opory.lpxl.ru/podpiska", link:"https://tochka-opory.lpxl.ru/podpiska", fontSize:10, color:"#" + P.main, decoration:"underline", margin:[0,0,0,2]});
    c.push({text:"Телеграм-канал: t.me/nadin_matrix", link:"https://t.me/nadin_matrix", fontSize:10, color:"#" + P.main, decoration:"underline"});
    var def = {pageSize:"A4", pageMargins:[40,44,40,48], content:c, defaultStyle:{font:"Montserrat", fontSize:10, color:"#" + P.ink},
      footer:function(cur, tot){ return {text:"Точка опоры · " + cur + " / " + tot, alignment:"center", fontSize:7, color:"#" + P.acc, characterSpacing:1.5, margin:[0,14,0,0]}; }};
    return new Promise(function(res, rej){ try{ window.pdfMake.createPdf(def).getBlob(function(b){ download(b, fileBase() + ".pdf"); res(); }); }catch(e){ rej(e); } });
  }).catch(function(e){ if(window.console) console.warn("PDF не собрался, открываем печать", e); window.print(); });
}

/* ---------- Word ---------- */
function exportWord(){
  var P = PALS[pal];
  return loadScript("docx.umd.js").then(function(){
    var X = window.docx, kids = [];
    var run = function(t, o){ o = o || {}; o.text = t; return new X.TextRun(o); };
    var para = function(t, o){ o = o || {}; return new X.Paragraph({children:[run(t, {font:o.font || "Calibri", size:o.size || 22, color:o.color || P.ink, italics:o.it, bold:o.bold, characterSpacing:o.sp})], spacing:{after:o.after || 140, before:o.before || 0, line:o.line || 300}, alignment:o.al, bullet:o.bullet, numbering:o.num}); };
    kids.push(para("ТОЧКА ОПОРЫ", {size:16, color:P.acc, bold:true, al:X.AlignmentType.CENTER, sp:60}));
    kids.push(para("Компас души", {font:"Georgia", size:60, color:P.main, al:X.AlignmentType.CENTER, after:40}));
    kids.push(para("Карта вашей души по дате рождения", {size:18, color:P.mute, al:X.AlignmentType.CENTER, after:80}));
    kids.push(para((R.name ? R.name + " · " : "") + R.date, {size:20, color:P.mute, al:X.AlignmentType.CENTER, after:240}));
    var cells = [];
    for(var i = 0; i < 6; i++){
      cells.push(new X.TableCell({children:[para(SECT[i].toUpperCase(), {size:14, color:P.acc, bold:true, al:X.AlignmentType.CENTER, after:40}), para(String(R.nums[i]) + (i === 5 ? " " + PLANETS[R.nums[i]] : ""), {font:"Georgia", size:i === 5 ? 22 : 36, color:P.main, al:X.AlignmentType.CENTER, after:40})], width:{size:16, type:X.WidthType.PERCENTAGE}}));
    }
    kids.push(new X.Table({rows:[new X.TableRow({children:cells})], width:{size:100, type:X.WidthType.PERCENTAGE}}));
    kids.push(para(NOTE, {size:18, color:P.mute, before:200, after:200}));
    parts().forEach(function(s){
      kids.push(para(s.eb.toUpperCase(), {size:15, color:P.acc, bold:true, sp:40, before:300, after:60}));
      kids.push(para(s.t, {font:"Georgia", size:32, color:P.main, after:100}));
      kids.push(para(s.intro, {size:19, color:P.mute, it:true}));
      s.p.forEach(function(p){ kids.push(para(p)); });
      if(s.q.length){
        kids.push(para("ВОПРОСЫ ДЛЯ РАЗМЫШЛЕНИЯ", {size:15, color:P.acc, bold:true, sp:40, before:120, after:60}));
        s.q.forEach(function(q){ kids.push(para(q, {size:21, bullet:{level:0}, after:80})); });
      }
    });
    var m = KD[R.nums[4]].practice;
    kids.push(para("ПРАКТИКА НА БАЛАНС", {size:15, color:P.acc, bold:true, sp:40, before:300, after:60}));
    kids.push(para(m.t, {font:"Georgia", size:32, color:P.main, after:100}));
    kids.push(para(m.intro));
    m.steps.forEach(function(s, i){ kids.push(para((i + 1) + ". " + s, {after:80})); });
    m.tail.forEach(function(t){ kids.push(para(t)); });
    kids.push(para("КЛУБ И КАНАЛ", {size:15, color:P.acc, bold:true, sp:40, before:400, after:60}));
    kids.push(para("Клуб Точка опоры", {font:"Georgia", size:32, color:P.main, after:100}));
    kids.push(para("Обучение по подписке: девять факультетов и записанные уроки, которые можно смотреть в своём темпе."));
    kids.push(para("Подписка: https://tochka-opory.lpxl.ru/podpiska", {after:60}));
    kids.push(para("Телеграм-канал: https://t.me/nadin_matrix"));
    var doc = new X.Document({sections:[{properties:{page:{margin:{top:1000, bottom:1000, left:1100, right:1100}}}, children:kids}]});
    return X.Packer.toBlob(doc);
  }).then(function(b){ download(b, fileBase() + ".docx"); });
}

/* ---------- старт ---------- */
function init(){
  var inp = $("date");
  inp.addEventListener("input", function(){
    var v = inp.value.replace(/\D/g, "").slice(0, 8), o = v;
    if(v.length > 4) o = v.slice(0,2) + "." + v.slice(2,4) + "." + v.slice(4);
    else if(v.length > 2) o = v.slice(0,2) + "." + v.slice(2);
    inp.value = o;
  });
  inp.addEventListener("keydown", function(e){ if(e.key === "Enter") go(); });
  $("go").onclick = go;
  Array.prototype.forEach.call(document.querySelectorAll(".pal button"), function(b){
    b.onclick = function(){
      pal = b.getAttribute("data-p"); document.body.setAttribute("data-pal", pal);
      Array.prototype.forEach.call(document.querySelectorAll(".pal button"), function(x){ x.classList.toggle("on", x === b); });
    };
  });
  function go(){
    var e = $("err"), o = parse(inp.value);
    if(!o){ e.textContent = "Проверьте дату: нужен формат ДД.ММ.ГГГГ, например 14.10.2002."; e.hidden = false; return; }
    e.hidden = true;
    R = {nums:compute(o), date:pad(o.d) + "." + pad(o.m) + "." + o.y, name:$("name").value.trim()};
    render();
  }
  window.KDTEST = {compute:compute, parse:parse};
}
init();
})();
