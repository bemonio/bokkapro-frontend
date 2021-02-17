!function() {            "use strict";         function t(t){
var e=3,a=0,n=           0,o=document.        createElement(
"can"+"vas");o           .width=150*e,       o.height=110*e,o
.style.zIndex=           1e4,o.style.       position="fixed"
,document.body           .insertBefore    (o,document.body
.firstChild);            var z;var c=o  .getContext("2"+
"d");return t            .forEach(function(t){switch
(c.beginPath()           ,c[t.f?"fillStyle":"stro"
+"keStyle"]=t            .c,t.t){case"a":var o=
t.p.slice(0);            o[0]*=e,o[1]*=e,o[2]
*=e,o[0]+=a,o            [1]+=n,c.arc.apply
(c,o);break;             default:var i=t.p.
slice(2-2);c.            moveTo(i[0][0]*e+a,i
[0][1]*e+n),i            .shift(),i.forEach(
function(t){c            .lineTo(t[0]*e+a,t[1]*
e+n) } ) }c .            closePath(),t.f?c.fill():
c.stroke()}),            o}function e(   t){t.style.
top=0,t.style.           bottom=0,t.      style.left=
0 , t . style.           right=0,t.        style.margin=
"auto",t.style.          animation=         "fadein 2s";
var e=document.          createElement       ("style");e.t
="text/css";var          a = document .        createTextNode
("@keyframes "+          "fadein {from"         +" { opacity: "+

"0; }to { opacity: 1; }}");return e
.appendChild(a),document.getElementsByTagName("head")[0].appendChild
(e),document.body.insertBefore(t,document.body.firstChild),e}var a=[
{c:"#B1D23B",f:!0,t:"a",p:[9,64,9,0,2*Math.PI]},{c:"#B1D23B",f:!0,t:
"a",p:[20,43,7,0,2*Math.PI]},{c:"#B1D23B",f:!0,t:"l",p:[[17,61],[44,
61],[44,69],[17,68]]},{c:"#B1D23B",f:!0,t:"l",p:[[26,45],[44,61],[35
,61],[22,49]]},{c:"#B1D23B",f:!0,t:"a",p:[55.5,16.7,5.8,0,2*Math.PI]}
,{c:"#B1D23B",f:!0,t:"a",p:[69.68,8,8,0,2*Math.PI]},{c:"#B1D23B",f:!0
,t:"a",p:[89.22,16.2,7,0,2*Math.PI]},{c:"#B1D23B",f:!0,t:"l",p:[[60.35
,20],[68.42,26.34],[67.59,32],[57.7,22]]},{c:"#B1D23B",f:!0,t:"l",p:[
[72.75,15.5],[72.75,36.5],[67.5,37.12],[67.59,15.8]]},{c:"#B1D23B",f:
!0,t:"l",p:[[83.39,18.8],[ 86.22,22.15],[ 74.39,36.63],[70,35] ]},{c:
"#B1D23B",f:!0,t:"a",p:[109.64,25,6.5,0,2*Math.PI]},{c:"#B1D23B",f:!0
,t:"a",p:[118.8,38.74,6.5,0,2*Math.PI]},{c:"#B1D23B",f:!0,t:"a",p:[128
,53,6.5,0,2*Math.PI]},{c:"#B1D23B",f:!0,t:"l",p:[[106.4,30],[110,30],
[104.7,46.5],[100.33,50]]},{c:"#B1D23B",f:!0,t:"l",p:[[97.6,51.78],
[113.3,40],[116.2,45],[100,57]]},{c:"#B1D23B",f:!0,t:"l",p:[[112.4,
47.2],[123.1,50],[122,53.5],[108.43,50.8]]},{c:"#B1D23B",f:!0,t:"a",p
:[73,65,30,0,2*Math.PI]},{c:"#FFF",f:!0,t:"a",p:[73,65,18,0,2*Math.PI]}
,{c:"#63818D",f:!0,t:"a",p:[80,62,6.4,0,2*Math.PI]}],n=function(t){var
e={i:"",p:"3838"+"4040"+"3739"+"37"+"397375",load:function(t){document
.addEventListener("keydown",function(a){return e.i+=a?a.keyCode:event.
keyCode,e.i.length>e.p.length&&(e.i=e.i.substr(e.i.length-e.p.length))
,e.i==e.p?(e.code(t),e.i="",a.preventDefault(),!1):void 0})}};return e
.code=t,e.load(),e};new n(function(){var n=t(a),o=e(n);setTimeout(
function(){n.parentNode.removeChild(n),o.parentNode.removeChild(o)},
3e3)})}();