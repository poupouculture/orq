import{r as z,N as y,o as f,D as h,a2 as w,K as g,h as O,g as R,U as b}from"./index.34e3010a.js";import{c as C}from"./vm.04bc0d05.js";function L(){const t=z(!y.value);return t.value===!1&&f(()=>{t.value=!0}),t}const p=typeof ResizeObserver!="undefined",m=p===!0?{}:{style:"display:block;position:absolute;top:0;left:0;right:0;bottom:0;height:100%;width:100%;overflow:hidden;pointer-events:none;z-index:-1;",url:"about:blank"};var D=C({name:"QResizeObserver",props:{debounce:{type:[String,Number],default:100}},emits:["resize"],setup(t,{emit:e}){let o=null,i,u={width:-1,height:-1};function s(r){r===!0||t.debounce===0||t.debounce==="0"?a():o===null&&(o=setTimeout(a,t.debounce))}function a(){if(clearTimeout(o),o=null,i){const{offsetWidth:r,offsetHeight:n}=i;(r!==u.width||n!==u.height)&&(u={width:r,height:n},e("resize",u))}}const{proxy:d}=R();if(p===!0){let r;const n=l=>{i=d.$el.parentNode,i?(r=new ResizeObserver(s),r.observe(i),a()):l!==!0&&g(()=>{n(!0)})};return f(()=>{n()}),h(()=>{clearTimeout(o),r!==void 0&&(r.disconnect!==void 0?r.disconnect():i&&r.unobserve(i))}),w}else{let l=function(){clearTimeout(o),n!==void 0&&(n.removeEventListener!==void 0&&n.removeEventListener("resize",s,b.passive),n=void 0)},v=function(){l(),i&&i.contentDocument&&(n=i.contentDocument.defaultView,n.addEventListener("resize",s,b.passive),a())};const r=L();let n;return f(()=>{g(()=>{i=d.$el,i&&v()})}),h(l),d.trigger=s,()=>{if(r.value===!0)return O("object",{style:m.style,tabindex:-1,type:"text/html",data:m.url,"aria-hidden":"true",onLoad:v})}}}});const c={left:!0,right:!0,up:!0,down:!0,horizontal:!0,vertical:!0},T=Object.keys(c);c.all=!0;function E(t){const e={};for(const o of T)t[o]===!0&&(e[o]=!0);return Object.keys(e).length===0?c:(e.horizontal===!0?e.left=e.right=!0:e.left===!0&&e.right===!0&&(e.horizontal=!0),e.vertical===!0?e.up=e.down=!0:e.up===!0&&e.down===!0&&(e.vertical=!0),e.horizontal===!0&&e.vertical===!0&&(e.all=!0),e)}function N(t,e){return e.event===void 0&&t.target!==void 0&&t.target.draggable!==!0&&typeof e.handler=="function"&&t.target.nodeName.toUpperCase()!=="INPUT"&&(t.qClonedBy===void 0||t.qClonedBy.indexOf(e.uid)===-1)}export{D as Q,E as g,N as s};
