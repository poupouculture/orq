import{c as F,h as S,e as b}from"./vm.04bc0d05.js";import{r as V,V as M,L as D,M as C,o as P,h as U,g as w,J as R,K as B,E as Y}from"./index.34e3010a.js";import{a as K}from"./QInput.cf4bcccb.js";var H=F({name:"QForm",props:{autofocus:Boolean,noErrorFocus:Boolean,noResetFocus:Boolean,greedy:Boolean,onSubmit:Function},emits:["reset","validationSuccess","validationError"],setup(s,{slots:p,emit:c}){const E=w(),r=V(null);let i=0;const u=[];function A(e){const a=typeof e=="boolean"?e:s.noErrorFocus!==!0,f=++i,g=(t,o)=>{c("validation"+(t===!0?"Success":"Error"),o)},y=t=>{const o=t.validate();return typeof o.then=="function"?o.then(n=>({valid:n,comp:t}),n=>({valid:!1,comp:t,err:n})):Promise.resolve({valid:o,comp:t})};return(s.greedy===!0?Promise.all(u.map(y)).then(t=>t.filter(o=>o.valid!==!0)):u.reduce((t,o)=>t.then(()=>y(o).then(n=>{if(n.valid===!1)return Promise.reject(n)})),Promise.resolve()).catch(t=>[t])).then(t=>{if(t===void 0||t.length===0)return f===i&&g(!0),!0;if(f===i){const{comp:o,err:n}=t[0];if(n!==void 0&&console.error(n),g(!1,o),a===!0){const k=t.find(({comp:x})=>typeof x.focus=="function"&&b(x.$)===!1);k!==void 0&&k.comp.focus()}}return!1})}function d(){i++,u.forEach(e=>{typeof e.resetValidation=="function"&&e.resetValidation()})}function m(e){e!==void 0&&R(e);const a=i+1;A().then(f=>{a===i&&f===!0&&(s.onSubmit!==void 0?c("submit",e):e!==void 0&&e.target!==void 0&&typeof e.target.submit=="function"&&e.target.submit())})}function v(e){e!==void 0&&R(e),c("reset"),B(()=>{d(),s.autofocus===!0&&s.noResetFocus!==!0&&l()})}function l(){K(()=>{if(r.value===null)return;const e=r.value.querySelector("[autofocus][tabindex], [data-autofocus][tabindex]")||r.value.querySelector("[autofocus] [tabindex], [data-autofocus] [tabindex]")||r.value.querySelector("[autofocus], [data-autofocus]")||Array.prototype.find.call(r.value.querySelectorAll("[tabindex]"),a=>a.tabIndex>-1);e!=null&&e.focus({preventScroll:!0})})}M(Y,{bindComponent(e){u.push(e)},unbindComponent(e){const a=u.indexOf(e);a>-1&&u.splice(a,1)}});let h=!1;return D(()=>{h=!0}),C(()=>{h===!0&&s.autofocus===!0&&l()}),P(()=>{s.autofocus===!0&&l()}),Object.assign(E.proxy,{validate:A,resetValidation:d,submit:m,reset:v,focus:l,getValidationComponents:()=>u}),()=>U("form",{class:"q-form",ref:r,onSubmit:m,onReset:v},S(p.default))}}),Q="data:image/png;base64,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";export{H as Q,Q as _};
