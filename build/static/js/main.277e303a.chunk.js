(this.webpackJsonpkisapankki=this.webpackJsonpkisapankki||[]).push([[0],{29:function(e,t,a){e.exports=a(58)},57:function(e,t,a){},58:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),u=a(26),l=a.n(u),c=a(4),s=a(1),o=a(10),i=a(2),m=a.n(i),p=function(e){var t=e.message,a=e.type;return null===t?null:r.a.createElement("div",{className:a},t)},v=a(3),b=a.n(v),d="".concat("/api","/login"),f=function(e){var t;return m.a.async((function(a){for(;;)switch(a.prev=a.next){case 0:return a.next=2,m.a.awrap(b.a.post(d,e));case 2:return t=a.sent,a.abrupt("return",t.data);case 4:case"end":return a.stop()}}))},h=null,E=function(){return h},g=function(e){h="bearer ".concat(e)},j=function(e){var t=e.setUser,a=Object(n.useState)(null),u=Object(s.a)(a,2),l=u[0],c=u[1],i=Object(n.useState)(""),v=Object(s.a)(i,2),b=v[0],d=v[1],h=Object(n.useState)(""),E=Object(s.a)(h,2),j=E[0],O=E[1],y=Object(o.f)();return r.a.createElement("div",{className:"login-form"},r.a.createElement("h2",null,"Kirjaudu sis\xe4\xe4n"),r.a.createElement(p,{message:l,type:"error"}),r.a.createElement("form",{onSubmit:function(e){var a;return m.a.async((function(n){for(;;)switch(n.prev=n.next){case 0:return e.preventDefault(),n.prev=1,n.next=4,m.a.awrap(f({username:b,password:j}));case 4:a=n.sent,window.localStorage.setItem("loggedUser",JSON.stringify(a)),t(a),g(a.token),d(""),O(""),y.push("/"),n.next=17;break;case 13:n.prev=13,n.t0=n.catch(1),c("V\xe4\xe4r\xe4 k\xe4ytt\xe4j\xe4tunnus/salasana"),setTimeout((function(){c(null)}),5e3);case 17:case"end":return n.stop()}}),null,null,[[1,13]])}},r.a.createElement("div",null,r.a.createElement("input",{className:"username",type:"text",value:b,name:"Username",placeholder:"K\xe4ytt\xe4j\xe4tunnus",onChange:function(e){var t=e.target;return d(t.value)}})),r.a.createElement("div",null,r.a.createElement("input",{className:"password",type:"password",value:j,name:"Password",placeholder:"Salasana",onChange:function(e){var t=e.target;return O(t.value)}})),r.a.createElement("button",{type:"submit",className:"login-button"},"Kirjaudu")))},O="".concat("/api","/task"),y="".concat("/api","/task/pending"),k=function(e){var t,a,n;return m.a.async((function(r){for(;;)switch(r.prev=r.next){case 0:return t=null,(a=E())&&(t={headers:{Authorization:a}}),r.next=5,m.a.awrap(b.a.post(O,e,t));case 5:return n=r.sent,r.abrupt("return",n.data);case 7:case"end":return r.stop()}}))},S=function(){var e;return m.a.async((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,m.a.awrap(b.a.get(O));case 2:return e=t.sent,t.abrupt("return",e.data);case 4:case"end":return t.stop()}}))},x=function(e){var t;return m.a.async((function(a){for(;;)switch(a.prev=a.next){case 0:return a.next=2,m.a.awrap(b.a.get("".concat(O,"/").concat(e)));case 2:return t=a.sent,a.abrupt("return",t.data);case 4:case"end":return a.stop()}}))},w=function(e){var t,a,n;return m.a.async((function(r){for(;;)switch(r.prev=r.next){case 0:return t=null,(a=E())&&(t={headers:{Authorization:a}}),r.next=5,m.a.awrap(b.a.put("".concat(O,"/").concat(e.id),e,t));case 5:return n=r.sent,r.abrupt("return",n.data);case 7:case"end":return r.stop()}}))},N=function(e){var t,a;return m.a.async((function(n){for(;;)switch(n.prev=n.next){case 0:return t={headers:{Authorization:E()}},n.next=3,m.a.awrap(b.a.delete("".concat(O,"/").concat(e),t));case 3:return a=n.sent,n.abrupt("return",a.data);case 5:case"end":return n.stop()}}))},C=function(){var e,t;return m.a.async((function(a){for(;;)switch(a.prev=a.next){case 0:return e={headers:{Authorization:E()}},a.next=3,m.a.awrap(b.a.get(y,e));case 3:return t=a.sent,a.abrupt("return",t.data);case 5:case"end":return a.stop()}}))},T=function(e){var t,a;return m.a.async((function(n){for(;;)switch(n.prev=n.next){case 0:return t={headers:{Authorization:E()}},n.next=3,m.a.awrap(b.a.put("".concat(O,"/").concat(e,"/accept"),e,t));case 3:return a=n.sent,n.abrupt("return",a.data);case 5:case"end":return n.stop()}}))},A=function(e){var t=e.user,a=Object(n.useState)([]),u=Object(s.a)(a,2),l=u[0],o=u[1],i=Object(n.useState)(null),v=Object(s.a)(i,2),b=v[0],d=v[1];Object(n.useEffect)((function(){S().then((function(e){o(e)}))}),[]);return r.a.createElement("div",{className:"task-list"},r.a.createElement("h1",null,"Kisateht\xe4v\xe4pankki"),r.a.createElement(p,{message:b}),l.map((function(e){return r.a.createElement("div",{className:"task-list-item",key:e.id},r.a.createElement("span",null,r.a.createElement(c.b,{to:"/tehtava/".concat(e.id)},e.name)),r.a.createElement("span",null,e.ageGroup.name),r.a.createElement("span",null,e.category.category),null!==t&&r.a.createElement("button",{className:"deleteButton",onClick:function(){return function(e){return m.a.async((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,m.a.awrap(N(e.id));case 3:o(l.filter((function(t){return t.id!==e.id}))),t.next=10;break;case 6:t.prev=6,t.t0=t.catch(0),d("Jotain meni vikaan"),setTimeout((function(){d(null)}),5e3);case 10:case"end":return t.stop()}}),null,null,[[0,6]])}(e)}},"Poista teht\xe4v\xe4"))})))},L="".concat("/api","/user"),V=function(e){var t,a;return m.a.async((function(n){for(;;)switch(n.prev=n.next){case 0:return t={headers:{Authorization:E()}},n.next=3,m.a.awrap(b.a.post(L,e,t));case 3:return a=n.sent,n.abrupt("return",a.data);case 5:case"end":return n.stop()}}))},K=function(){var e;return m.a.async((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,m.a.awrap(b.a.get(L));case 2:return e=t.sent,t.abrupt("return",e.data);case 4:case"end":return t.stop()}}))},J=function(e){var t,a;return m.a.async((function(n){for(;;)switch(n.prev=n.next){case 0:return t={headers:{Authorization:E()}},n.next=3,m.a.awrap(b.a.put(L,e,t));case 3:return a=n.sent,n.abrupt("return",a.data);case 5:case"end":return n.stop()}}))},U=function(){var e=Object(n.useState)(null),t=Object(s.a)(e,2),a=t[0],u=t[1],l=Object(n.useState)(null),c=Object(s.a)(l,2),o=c[0],i=c[1],v=Object(n.useState)(null),b=Object(s.a)(v,2),d=b[0],f=b[1],h=Object(n.useState)(null),E=Object(s.a)(h,2),g=E[0],j=E[1],O=Object(n.useState)(null),y=Object(s.a)(O,2),k=y[0],S=y[1],x=Object(n.useState)(""),w=Object(s.a)(x,2),N=w[0],C=w[1],T=Object(n.useState)(""),A=Object(s.a)(T,2),L=A[0],J=A[1],U=Object(n.useState)(""),M=Object(s.a)(U,2),P=M[0],z=M[1],I=Object(n.useState)([]),D=Object(s.a)(I,2),G=D[0],_=D[1];Object(n.useEffect)((function(){K().then((function(e){_(e)}))}),[]);return r.a.createElement("div",{className:"signup-form"},r.a.createElement("h2",null,"Lis\xe4\xe4 yll\xe4pit\xe4j\xe4"),r.a.createElement(p,{message:a,type:"success"}),r.a.createElement(p,{message:o,type:"error"}),r.a.createElement("form",{onSubmit:function(e){return m.a.async((function(t){for(;;)switch(t.prev=t.next){case 0:if(e.preventDefault(),f(null),j(null),S(null),N.length<3&&f("Nimess\xe4 pit\xe4\xe4 olla v\xe4hint\xe4\xe4n 3 kirjainta"),L.length<3&&j("K\xe4ytt\xe4j\xe4tunnuksessa pit\xe4\xe4 olla v\xe4hint\xe4\xe4n 3 kirjainta"),P.length<3&&S("Salasanassa pit\xe4\xe4 olla v\xe4hint\xe4\xe4n 3 kirjainta"),G.some((function(e){return e.username===L}))&&j("K\xe4ytt\xe4j\xe4tunnus on varattu"),!(N.length<3||L.length<3||P.length<3||G.some((function(e){return e.username===L})))){t.next=10;break}return t.abrupt("return");case 10:return t.prev=10,t.next=13,m.a.awrap(V({name:N,username:L,password:P}));case 13:C(""),J(""),z(""),u("Yll\xe4pit\xe4j\xe4 lis\xe4tty!"),setTimeout((function(){u(null)}),5e3),t.next=24;break;case 20:t.prev=20,t.t0=t.catch(10),i("Lis\xe4\xe4minen ep\xe4onnistui"),setTimeout((function(){i(null)}),5e3);case 24:case"end":return t.stop()}}),null,null,[[10,20]])}},r.a.createElement("div",null,r.a.createElement(p,{message:d,type:"error"}),r.a.createElement("input",{className:"name",type:"text",value:N,name:"Name",placeholder:"Nimi",onChange:function(e){var t=e.target;return C(t.value)}})),r.a.createElement("div",null,r.a.createElement(p,{message:g,type:"error"}),r.a.createElement("input",{className:"username",type:"text",value:L,name:"Username",placeholder:"K\xe4ytt\xe4j\xe4tunnus",onChange:function(e){var t=e.target;return J(t.value)}})),r.a.createElement("div",null,r.a.createElement(p,{message:k,type:"error"}),r.a.createElement("input",{className:"password",type:"password",value:P,name:"Password",placeholder:"Salasana",onChange:function(e){var t=e.target;return z(t.value)}})),r.a.createElement("button",{type:"submit",className:"signup-button"},"Lis\xe4\xe4")))},M="".concat("/api","/rule"),P=function(e){var t,a;return m.a.async((function(n){for(;;)switch(n.prev=n.next){case 0:return t={headers:{Authorization:E()}},n.next=3,m.a.awrap(b.a.post(M,e,t));case 3:return a=n.sent,n.abrupt("return",a.data);case 5:case"end":return n.stop()}}))},z=function(){var e;return m.a.async((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,m.a.awrap(b.a.get(M));case 2:return e=t.sent,t.abrupt("return",e.data);case 4:case"end":return t.stop()}}))},I=function(){var e=Object(n.useState)(""),t=Object(s.a)(e,2),a=t[0],u=t[1],l=Object(n.useState)(null),c=Object(s.a)(l,2),o=c[0],i=c[1];return r.a.createElement("div",{className:"rule-form"},r.a.createElement("h2",null,"Lis\xe4\xe4 s\xe4\xe4nt\xf6"),r.a.createElement(p,{message:o,type:"error"}),r.a.createElement("form",{onSubmit:function(e){return m.a.async((function(t){for(;;)switch(t.prev=t.next){case 0:return e.preventDefault(),t.prev=1,t.next=4,m.a.awrap(P({rules:a}));case 4:u(""),t.next=11;break;case 7:t.prev=7,t.t0=t.catch(1),i("Jotain meni vikaan"),setTimeout((function(){i(null)}),5e3);case 11:case"end":return t.stop()}}),null,null,[[1,7]])}},r.a.createElement("div",null,r.a.createElement("input",{className:"rule",type:"text",value:a,name:"Rules",placeholder:"S\xe4\xe4nt\xf6",onChange:function(e){var t=e.target;return u(t.value)}})),r.a.createElement("button",{type:"submit",className:"task-add-button"},"Lis\xe4\xe4")))},D="".concat("/api","/language"),G=function(e){var t,a;return m.a.async((function(n){for(;;)switch(n.prev=n.next){case 0:return t={headers:{Authorization:E()}},n.next=3,m.a.awrap(b.a.post(D,e,t));case 3:return a=n.sent,n.abrupt("return",a.data);case 5:case"end":return n.stop()}}))},_=function(){var e;return m.a.async((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,m.a.awrap(b.a.get(D));case 2:return e=t.sent,t.abrupt("return",e.data);case 4:case"end":return t.stop()}}))},B=function(){var e=Object(n.useState)(""),t=Object(s.a)(e,2),a=t[0],u=t[1],l=Object(n.useState)(null),c=Object(s.a)(l,2),o=c[0],i=c[1];return r.a.createElement("div",{className:"language-form"},r.a.createElement("h2",null,"Lis\xe4\xe4 kieli"),r.a.createElement(p,{message:o,type:"error"}),r.a.createElement("form",{onSubmit:function(e){return m.a.async((function(t){for(;;)switch(t.prev=t.next){case 0:return e.preventDefault(),t.prev=1,t.next=4,m.a.awrap(G({language:a}));case 4:u(""),t.next=11;break;case 7:t.prev=7,t.t0=t.catch(1),i("Kielen lis\xe4\xe4minen ei onnistunut"),setTimeout((function(){i(null)}),5e3);case 11:case"end":return t.stop()}}),null,null,[[1,7]])}},r.a.createElement("div",null,r.a.createElement("input",{className:"language",type:"text",value:a,name:"Language",placeholder:"Kieli",onChange:function(e){var t=e.target;return u(t.value)}})),r.a.createElement("button",{type:"submit",className:"language-add-button"},"Lis\xe4\xe4")))},R="".concat("/api","/ageGroup"),H=function(e){var t,a;return m.a.async((function(n){for(;;)switch(n.prev=n.next){case 0:return t={headers:{Authorization:E()}},n.next=3,m.a.awrap(b.a.post(R,e,t));case 3:return a=n.sent,n.abrupt("return",a.data);case 5:case"end":return n.stop()}}))},F=function(){var e;return m.a.async((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,m.a.awrap(b.a.get(R));case 2:return e=t.sent,t.abrupt("return",e.data);case 4:case"end":return t.stop()}}))},Y=function(){var e=Object(n.useState)(""),t=Object(s.a)(e,2),a=t[0],u=t[1],l=Object(n.useState)(""),c=Object(s.a)(l,2),o=c[0],i=c[1],v=Object(n.useState)(""),b=Object(s.a)(v,2),d=b[0],f=b[1],h=Object(n.useState)(""),E=Object(s.a)(h,2),g=E[0],j=E[1],O=Object(n.useState)(null),y=Object(s.a)(O,2),k=y[0],S=y[1];return r.a.createElement("div",{className:"age-group-form"},r.a.createElement("h2",null,"Lis\xe4\xe4 ik\xe4ryhm\xe4"),r.a.createElement(p,{message:k,type:"error"}),r.a.createElement("form",{onSubmit:function(e){return m.a.async((function(t){for(;;)switch(t.prev=t.next){case 0:return e.preventDefault(),t.prev=1,t.next=4,m.a.awrap(H({name:a,minAge:o,maxAge:d,color:g}));case 4:u(""),i(""),f(""),j(""),t.next=14;break;case 10:t.prev=10,t.t0=t.catch(1),S("Jotain meni vikaan"),setTimeout((function(){S(null)}),5e3);case 14:case"end":return t.stop()}}),null,null,[[1,10]])}},r.a.createElement("div",null,r.a.createElement("input",{className:"name",type:"text",value:a,name:"Name",placeholder:"Nimi",onChange:function(e){var t=e.target;return u(t.value)}})),r.a.createElement("div",null,r.a.createElement("input",{className:"minAge",type:"number",value:o,name:"MinAge",placeholder:"Alaraja i\xe4lle",min:"1",max:"100",onChange:function(e){var t,a=e.target;i(a.value),t=a.value,d<=t&&f(Number(t))}})),r.a.createElement("div",null,r.a.createElement("input",{className:"maxAge",type:"number",value:d,name:"MaxAge",placeholder:"Yl\xe4raja i\xe4lle",min:o,max:"100",onChange:function(e){var t=e.target;return f(t.value)}})),r.a.createElement("div",null,r.a.createElement("input",{className:"color",type:"text",value:g,name:"Color",placeholder:"V\xe4ri",onChange:function(e){var t=e.target;return j(t.value)}})),r.a.createElement("button",{type:"submit",className:"age-group-submit-button"},"Lis\xe4\xe4")))},q="".concat("/api","/category"),Q=function(e){var t,a;return m.a.async((function(n){for(;;)switch(n.prev=n.next){case 0:return t={headers:{Authorization:E()}},n.next=3,m.a.awrap(b.a.post(q,e,t));case 3:return a=n.sent,n.abrupt("return",a.data);case 5:case"end":return n.stop()}}))},W=function(){var e;return m.a.async((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,m.a.awrap(b.a.get(q));case 2:return e=t.sent,t.abrupt("return",e.data);case 4:case"end":return t.stop()}}))},X=function(){var e=Object(n.useState)(""),t=Object(s.a)(e,2),a=t[0],u=t[1],l=Object(n.useState)(null),c=Object(s.a)(l,2),o=c[0],i=c[1];return r.a.createElement("div",{className:"category-form"},r.a.createElement("h2",null,"Lis\xe4\xe4 kategoria"),r.a.createElement(p,{message:o,type:"error"}),r.a.createElement("form",{onSubmit:function(e){return m.a.async((function(t){for(;;)switch(t.prev=t.next){case 0:return e.preventDefault(),t.prev=1,t.next=4,m.a.awrap(Q({category:a}));case 4:u(""),t.next=11;break;case 7:t.prev=7,t.t0=t.catch(1),i("Jotain meni vikaan"),setTimeout((function(){i(null)}),5e3);case 11:case"end":return t.stop()}}),null,null,[[1,7]])}},r.a.createElement("div",null,r.a.createElement("input",{className:"category",type:"text",value:a,name:"Category",placeholder:"Kategoria",onChange:function(e){var t=e.target;return u(t.value)}})),r.a.createElement("button",{type:"submit",className:"category-add-button"},"Lis\xe4\xe4")))},Z=function(){return r.a.createElement("div",null,r.a.createElement(I,null),r.a.createElement(B,null),r.a.createElement(Y,null),r.a.createElement(X,null))},$=function(){var e=Object(n.useState)(""),t=Object(s.a)(e,2),a=t[0],u=t[1],l=Object(n.useState)(""),c=Object(s.a)(l,2),o=c[0],i=c[1],v=Object(n.useState)(""),b=Object(s.a)(v,2),d=b[0],f=b[1],h=Object(n.useState)(""),E=Object(s.a)(h,2),g=E[0],j=E[1],O=Object(n.useState)(""),y=Object(s.a)(O,2),S=y[0],x=y[1],w=Object(n.useState)(""),N=Object(s.a)(w,2),C=N[0],T=N[1],A=Object(n.useState)([]),L=Object(s.a)(A,2),V=L[0],K=L[1],J=Object(n.useState)(""),U=Object(s.a)(J,2),M=U[0],P=U[1],I=Object(n.useState)([]),D=Object(s.a)(I,2),G=D[0],B=D[1],R=Object(n.useState)(""),H=Object(s.a)(R,2),Y=H[0],q=H[1],Q=Object(n.useState)([]),X=Object(s.a)(Q,2),Z=X[0],$=X[1],ee=Object(n.useState)(""),te=Object(s.a)(ee,2),ae=te[0],ne=te[1],re=Object(n.useState)([]),ue=Object(s.a)(re,2),le=ue[0],ce=ue[1],se=Object(n.useState)(""),oe=Object(s.a)(se,2),ie=oe[0],me=oe[1],pe=Object(n.useState)(""),ve=Object(s.a)(pe,2),be=ve[0],de=ve[1],fe=Object(n.useState)(""),he=Object(s.a)(fe,2),Ee=he[0],ge=he[1],je=Object(n.useState)(null),Oe=Object(s.a)(je,2),ye=Oe[0],ke=Oe[1],Se=Object(n.useState)(null),xe=Object(s.a)(Se,2),we=xe[0],Ne=xe[1],Ce=Object(n.useState)(null),Te=Object(s.a)(Ce,2),Ae=Te[0],Le=Te[1],Ve=Object(n.useState)(null),Ke=Object(s.a)(Ve,2),Je=Ke[0],Ue=Ke[1],Me=Object(n.useState)(null),Pe=Object(s.a)(Me,2),ze=Pe[0],Ie=Pe[1];Object(n.useEffect)((function(){z().then((function(e){K(e)})),W().then((function(e){B(e)})),F().then((function(e){$(e)})),_().then((function(e){ce(e)}))}),[]);return r.a.createElement("div",null,r.a.createElement("h2",null,"Lis\xe4\xe4 teht\xe4v\xe4"),r.a.createElement(p,{message:a,type:"success"}),r.a.createElement(p,{message:o,type:"error"}),r.a.createElement("form",{onSubmit:function(e){return m.a.async((function(t){for(;;)switch(t.prev=t.next){case 0:if(e.preventDefault(),ke(null),Ne(null),Le(null),Ue(null),Ie(null),d.length<1&&ke("Nimi ei saa olla tyhj\xe4"),g.length<1&&Ne("Teht\xe4v\xe4nanto ei saa olla tyhj\xe4"),be.length<1&&Le("Lis\xe4\xe4j\xe4n nimi ei saa olla tyhj\xe4"),Ee.length<1&&Ue("Lis\xe4\xe4j\xe4n s\xe4hk\xf6posti ei saa olla tyhj\xe4"),""!==ie&&""!==M&&""!==ae&&""!==Y||Ie("Valitsethan arvon kaikkiin pudotuskenttiin"),!(d.length<1||g.length<1||be.length<1||Ee.length<1||""===ie||""===M||""===ae||""===Y)){t.next=13;break}return t.abrupt("return");case 13:return t.prev=13,t.next=16,m.a.awrap(k({name:d,rule:M,category:Y,ageGroup:ae,language:ie,assignmentText:g,gradingScale:S,creatorName:be,creatorEmail:Ee,supervisorInstructions:C}));case 16:f(""),P(""),q(""),ne(""),me(""),j(""),x(""),ge(""),de(""),T(""),u("Teht\xe4v\xe4 lis\xe4tty!"),setTimeout((function(){u(null)}),5e3),t.next=34;break;case 30:t.prev=30,t.t0=t.catch(13),i("Jotain meni vikaan"),setTimeout((function(){i(null)}),5e3);case 34:case"end":return t.stop()}}),null,null,[[13,30]])}},r.a.createElement("div",null,r.a.createElement(p,{message:ye,type:"error"}),r.a.createElement("input",{className:"task-title",type:"text",value:d,name:"Name",placeholder:"Teht\xe4v\xe4n otsikko",onChange:function(e){var t=e.target;return f(t.value)}})),r.a.createElement("div",null,r.a.createElement(p,{message:we,type:"error"}),r.a.createElement("textarea",{rows:"3",cols:"35",className:"",type:"text",value:g,name:"AssignmentText",placeholder:"Teht\xe4v\xe4nanto",onChange:function(e){var t=e.target;return j(t.value)}})),r.a.createElement("div",null,r.a.createElement("textarea",{rows:"3",cols:"35",className:"",type:"text",value:S,name:"GradingScale",placeholder:"Arvostelu",onChange:function(e){var t=e.target;return x(t.value)}})),r.a.createElement("div",null,r.a.createElement("textarea",{rows:"3",cols:"35",className:"",type:"text",value:C,name:"supervisorInstruction",placeholder:"Rastimiehen ohje",onChange:function(e){var t=e.target;return T(t.value)}})),r.a.createElement("div",null,r.a.createElement(p,{message:ze,type:"error"}),r.a.createElement("select",{value:ae,onChange:function(e){return function(e){ne(e.target.value)}(e)}},r.a.createElement("option",{value:""},"Valitse ik\xe4luokka"),Z.map((function(e){return r.a.createElement("option",{key:e.id,value:e.id},e.name)}))),r.a.createElement("select",{value:Y,onChange:function(e){return function(e){q(e.target.value)}(e)}},r.a.createElement("option",{value:""},"Valitse kategoria"),G.map((function(e){return r.a.createElement("option",{key:e.id,value:e.id},e.category)})))),r.a.createElement("div",null,r.a.createElement("select",{value:M,onChange:function(e){return function(e){P(e.target.value)}(e)}},r.a.createElement("option",{value:""},"Valitse s\xe4\xe4nn\xf6t"),V.map((function(e){return r.a.createElement("option",{key:e.id,value:e.id},e.rules)}))),r.a.createElement("select",{value:ie,onChange:function(e){return function(e){me(e.target.value)}(e)}},r.a.createElement("option",{value:""},"Teht\xe4v\xe4n kieli"),le.map((function(e){return r.a.createElement("option",{key:e.id,value:e.id},e.language)})))),r.a.createElement("div",null,r.a.createElement(p,{message:Ae,type:"error"}),r.a.createElement("input",{className:"",type:"text",value:be,name:"CreatorName",placeholder:"Lis\xe4\xe4j\xe4n nimi",onChange:function(e){var t=e.target;return de(t.value)}}),r.a.createElement(p,{message:Je,type:"error"}),r.a.createElement("input",{className:"",type:"text",value:Ee,name:"CreatorEmail",placeholder:"Lis\xe4\xe4j\xe4n s\xe4hk\xf6postiosoite",onChange:function(e){var t=e.target;return ge(t.value)}})),r.a.createElement("button",{type:"submit",className:"add-task-button"},"Lis\xe4\xe4 teht\xe4v\xe4")))},ee=function(){var e=Object(n.useState)([]),t=Object(s.a)(e,2),a=t[0],u=t[1],l=Object(n.useState)(null),o=Object(s.a)(l,2),i=o[0],v=o[1],b=Object(n.useState)(null),d=Object(s.a)(b,2),f=d[0],h=d[1];Object(n.useEffect)((function(){C().then((function(e){u(e)}))}),[]);return r.a.createElement("div",{className:"task-list"},r.a.createElement("h1",null,"Hyv\xe4ksynt\xe4\xe4 odottavat kisateht\xe4v\xe4t"),r.a.createElement(p,{message:i,type:"success"}),r.a.createElement(p,{message:f,type:"error"}),a.map((function(e){return r.a.createElement("div",{className:"task-list-item ".concat(e.ageGroup.name.toLowerCase()),key:e.id},r.a.createElement("span",null,r.a.createElement(c.b,{to:"/tehtava/".concat(e.id)},e.name)),r.a.createElement("span",null,e.ageGroup.name),r.a.createElement("span",null,e.category.category),r.a.createElement("button",{className:"acceptButton",onClick:function(){return function(e){try{T(e),u(a.filter((function(t){return t.id!==e}))),v("Teht\xe4v\xe4 hyv\xe4ksytty"),setTimeout((function(){v(null)}),5e3)}catch(t){h("Jotain meni vikaan"),setTimeout((function(){h(null)}),5e3)}}(e.id)}},"Hyv\xe4ksy"),r.a.createElement("button",{className:"deleteButton",onClick:function(){return function(e){return m.a.async((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,m.a.awrap(N(e.id));case 3:u(a.filter((function(t){return t.id!==e.id}))),t.next=10;break;case 6:t.prev=6,t.t0=t.catch(0),h("Jotain meni vikaan"),setTimeout((function(){h(null)}),5e3);case 10:case"end":return t.stop()}}),null,null,[[0,6]])}(e)}},"Poista teht\xe4v\xe4"))})))},te=function(){return r.a.createElement("div",null,r.a.createElement(ee,null),r.a.createElement(c.b,{to:"/lisaa_admin"},"Lis\xe4\xe4 yll\xe4pit\xe4j\xe4"),r.a.createElement("br",null),r.a.createElement(c.b,{to:"/lisaa_pudotusvalikkoon"},"Lis\xe4\xe4 pudotusvalikkoon"))},ae=function(e){var t=e.setShowEdit,a=e.user,u=e.setUser,l=e.setMessage,c=Object(n.useState)(null),o=Object(s.a)(c,2),i=o[0],v=o[1],b=Object(n.useState)(null),d=Object(s.a)(b,2),f=d[0],h=d[1],E=Object(n.useState)(null),g=Object(s.a)(E,2),j=g[0],O=g[1],y=Object(n.useState)(a.name),k=Object(s.a)(y,2),S=k[0],x=k[1],w=Object(n.useState)(a.username),N=Object(s.a)(w,2),C=N[0],T=N[1];return r.a.createElement("div",{className:"edit-user-form"},r.a.createElement("h2",null,"Omat tiedot"),r.a.createElement(p,{message:i,type:"error"}),r.a.createElement("form",{onSubmit:function(e){var a;return m.a.async((function(n){for(;;)switch(n.prev=n.next){case 0:if(e.preventDefault(),h(null),O(null),S.length<3&&h("Nimess\xe4 pit\xe4\xe4 olla v\xe4hint\xe4\xe4n 3 kirjainta"),C.length<3&&O("K\xe4ytt\xe4j\xe4tunnuksessa pit\xe4\xe4 olla v\xe4hint\xe4\xe4n 3 kirjainta"),!(S.length<3||C.length<3)){n.next=7;break}return n.abrupt("return");case 7:return n.prev=7,n.next=10,m.a.awrap(J({name:S,username:C}));case 10:a=n.sent,u(a),window.localStorage.setItem("loggedUser",JSON.stringify(a)),t(!1),l("Tietoja muokattu!"),setTimeout((function(){l(null)}),5e3),n.next=22;break;case 18:n.prev=18,n.t0=n.catch(7),n.t0.response&&n.t0.response.data&&n.t0.response.data.error&&"username already exists"===n.t0.response.data.error?v("K\xe4ytt\xe4j\xe4tunnus on varattu"):v("Muokkaaminen ep\xe4onnistui"),setTimeout((function(){v(null)}),5e3);case 22:case"end":return n.stop()}}),null,null,[[7,18]])}},r.a.createElement("div",null,r.a.createElement(p,{message:f,type:"error"}),r.a.createElement("label",null,"Nimi"),r.a.createElement("br",null),r.a.createElement("input",{className:"name",type:"text",value:S,name:"Name",placeholder:"Nimi",onChange:function(e){var t=e.target;return x(t.value)}})),r.a.createElement("div",null,r.a.createElement(p,{message:j,type:"error"}),r.a.createElement("label",null,"K\xe4ytt\xe4j\xe4tunnus"),r.a.createElement("br",null),r.a.createElement("input",{className:"username",type:"text",value:C,name:"Username",placeholder:"K\xe4ytt\xe4j\xe4tunnus",onChange:function(e){var t=e.target;return T(t.value)}})),r.a.createElement("button",{type:"submit",className:"edit-button"},"Tallenna"),r.a.createElement("button",{onClick:function(){return t(!1)},className:"cancel-button"},"Peruuta")))},ne=function(e){var t=e.setShowChangePassword,a=e.setMessage,u=Object(n.useState)(null),l=Object(s.a)(u,2),c=l[0],o=l[1],i=Object(n.useState)(""),v=Object(s.a)(i,2),b=v[0],d=v[1],f=Object(n.useState)(""),h=Object(s.a)(f,2),E=h[0],g=h[1],j=Object(n.useState)(""),O=Object(s.a)(j,2),y=O[0],k=O[1];return r.a.createElement("div",{className:"change-password-form"},r.a.createElement("h2",null,"Vaihda salasana"),r.a.createElement(p,{message:c,type:"error"}),r.a.createElement("form",{onSubmit:function(e){return m.a.async((function(n){for(;;)switch(n.prev=n.next){case 0:if(e.preventDefault(),o(null),!(E.length<3)){n.next=5;break}return o("Salasanassa pit\xe4\xe4 olla v\xe4hint\xe4\xe4n 3 kirjainta"),n.abrupt("return");case 5:if(E===y){n.next=8;break}return o("Salasanat eiv\xe4t t\xe4sm\xe4\xe4"),n.abrupt("return");case 8:return n.prev=8,n.next=11,m.a.awrap(J({oldPassword:b,newPassword:E}));case 11:d(""),g(""),k(""),t(!1),a("Salasana vaihdettu!"),setTimeout((function(){a(null)}),5e3),n.next=23;break;case 19:n.prev=19,n.t0=n.catch(8),n.t0.response&&n.t0.response.data&&n.t0.response.data.error&&"incorrect password"===n.t0.response.data.error?o("Vanha salasana ei t\xe4sm\xe4\xe4"):o("Salasanan vaihtaminen ep\xe4onnistui"),setTimeout((function(){o(null)}),5e3);case 23:case"end":return n.stop()}}),null,null,[[8,19]])}},r.a.createElement("div",null,r.a.createElement("input",{className:"old-password",type:"password",value:b,placeholder:"Vanha salasana",onChange:function(e){var t=e.target;return d(t.value)}})),r.a.createElement("div",null,r.a.createElement("input",{className:"new-password",type:"password",value:E,placeholder:"Uusi salasana",onChange:function(e){var t=e.target;return g(t.value)}})),r.a.createElement("div",null,r.a.createElement("input",{className:"new-password-again",type:"password",value:y,placeholder:"Uusi salasana uudelleen",onChange:function(e){var t=e.target;return k(t.value)}})),r.a.createElement("button",{type:"submit",className:"change-password-button"},"Tallenna"),r.a.createElement("button",{onClick:function(){return t(!1)},className:"cancel-button"},"Peruuta")))},re=function(e){var t=e.user,a=e.setUser,u=Object(n.useState)(null),l=Object(s.a)(u,2),c=l[0],o=l[1],i=Object(n.useState)(!1),m=Object(s.a)(i,2),v=m[0],b=m[1],d=Object(n.useState)(!1),f=Object(s.a)(d,2),h=f[0],E=f[1];return r.a.createElement("div",null,t&&r.a.createElement("div",{className:"user-info"},!v&&!h&&r.a.createElement("div",null,r.a.createElement(p,{message:c,type:"success"}),r.a.createElement("h2",null,"Omat tiedot"),r.a.createElement("p",null,r.a.createElement("b",null,"Nimi: "),t.name),r.a.createElement("p",null,r.a.createElement("b",null,"K\xe4ytt\xe4j\xe4tunnus: "),t.username),r.a.createElement("button",{className:"edit-user-button",onClick:function(){return E(!1),void b(!0)}},"Muokkaa"),r.a.createElement("button",{className:"change-password-button",onClick:function(){return b(!1),void E(!0)}},"Vaihda salasana")),v&&r.a.createElement(ae,{setShowEdit:b,user:t,setUser:a,setMessage:o}),h&&r.a.createElement(ne,{setShowChangePassword:E,setMessage:o})))},ue=function(e){var t=e.setModifyVisible,a=e.task,u=e.setTask,l=Object(n.useState)(""),c=Object(s.a)(l,2),o=c[0],i=c[1],v=Object(n.useState)(""),b=Object(s.a)(v,2),d=b[0],f=b[1],h=Object(n.useState)(a.name),E=Object(s.a)(h,2),g=E[0],j=E[1],O=Object(n.useState)(a.assignmentText),y=Object(s.a)(O,2),k=y[0],S=y[1],x=Object(n.useState)(a.gradingScale),N=Object(s.a)(x,2),C=N[0],T=N[1],A=Object(n.useState)(a.supervisorInstructions),L=Object(s.a)(A,2),V=L[0],K=L[1],J=Object(n.useState)([]),U=Object(s.a)(J,2),M=U[0],P=U[1],I=Object(n.useState)(a.rules.id),D=Object(s.a)(I,2),G=D[0],B=D[1],R=Object(n.useState)([]),H=Object(s.a)(R,2),Y=H[0],q=H[1],Q=Object(n.useState)(a.category.id),X=Object(s.a)(Q,2),Z=X[0],$=X[1],ee=Object(n.useState)([]),te=Object(s.a)(ee,2),ae=te[0],ne=te[1],re=Object(n.useState)(a.ageGroup.id),ue=Object(s.a)(re,2),le=ue[0],ce=ue[1],se=Object(n.useState)([]),oe=Object(s.a)(se,2),ie=oe[0],me=oe[1],pe=Object(n.useState)(a.language.id),ve=Object(s.a)(pe,2),be=ve[0],de=ve[1],fe=Object(n.useState)(a.creatorName),he=Object(s.a)(fe,2),Ee=he[0],ge=he[1],je=Object(n.useState)(a.creatorEmail),Oe=Object(s.a)(je,2),ye=Oe[0],ke=Oe[1],Se=Object(n.useState)(null),xe=Object(s.a)(Se,2),we=xe[0],Ne=xe[1],Ce=Object(n.useState)(null),Te=Object(s.a)(Ce,2),Ae=Te[0],Le=Te[1],Ve=Object(n.useState)(null),Ke=Object(s.a)(Ve,2),Je=Ke[0],Ue=Ke[1],Me=Object(n.useState)(null),Pe=Object(s.a)(Me,2),ze=Pe[0],Ie=Pe[1],De=Object(n.useState)(null),Ge=Object(s.a)(De,2),_e=Ge[0],Be=Ge[1],Re=a.id;Object(n.useEffect)((function(){z().then((function(e){P(e)})),W().then((function(e){q(e)})),F().then((function(e){ne(e)})),_().then((function(e){me(e)}))}),[]);return r.a.createElement("div",null,r.a.createElement("h2",null,"Muokkaa teht\xe4v\xe4\xe4"),r.a.createElement(p,{message:o,type:"success"}),r.a.createElement(p,{message:d,type:"error"}),r.a.createElement("form",{onSubmit:function(e){var t;return m.a.async((function(a){for(;;)switch(a.prev=a.next){case 0:if(e.preventDefault(),Ne(null),Le(null),Ue(null),Ie(null),Be(null),g.length<1&&Ne("Nimi ei saa olla tyhj\xe4"),k.length<1&&Le("Teht\xe4v\xe4nanto ei saa olla tyhj\xe4"),Ee.length<1&&Ue("Lis\xe4\xe4j\xe4n nimi ei saa olla tyhj\xe4"),ye.length<1&&Ie("Lis\xe4\xe4j\xe4n s\xe4hk\xf6posti ei saa olla tyhj\xe4"),""!==be&&""!==G&&""!==le&&""!==Z||Be("Valitsethan arvon kaikkiin pudotuskenttiin"),!(g.length<1||k.length<1||Ee.length<1||ye.length<1||""===be||""===G||""===le||""===Z)){a.next=13;break}return a.abrupt("return");case 13:return a.prev=13,a.next=16,m.a.awrap(w({name:g,rule:G,category:Z,ageGroup:le,language:be,assignmentText:k,gradingScale:C,creatorName:Ee,creatorEmail:ye,supervisorInstructions:V,id:Re}));case 16:t=a.sent,i("Teht\xe4v\xe4 tallennettu!"),u(t),setTimeout((function(){i(null),window.location.reload()}),5e3),a.next=26;break;case 22:a.prev=22,a.t0=a.catch(13),f("Jotain meni vikaan"),setTimeout((function(){f(null)}),5e3);case 26:case"end":return a.stop()}}),null,null,[[13,22]])},className:"modify-form"},r.a.createElement("div",null,r.a.createElement(p,{message:we,type:"error"}),r.a.createElement("input",{className:"task-title",type:"text",defaultValue:g,name:"Name",placeholder:"Teht\xe4v\xe4n otsikko",onChange:function(e){var t=e.target;return j(t.value)}})),r.a.createElement("div",null,r.a.createElement(p,{message:Ae,type:"error"}),r.a.createElement("textarea",{rows:"3",cols:"35",className:"",type:"text",defaultValue:k,name:"AssignmentText",placeholder:"Teht\xe4v\xe4nanto",onChange:function(e){var t=e.target;return S(t.value)}})),r.a.createElement("div",null,r.a.createElement("textarea",{rows:"3",cols:"35",className:"",type:"text",defaultValue:C,name:"GradingScale",placeholder:"Arvostelu",onChange:function(e){var t=e.target;return T(t.value)}})),r.a.createElement("div",null,r.a.createElement("textarea",{rows:"3",cols:"35",className:"",type:"text",defaultValue:V,name:"supervisorInstruction",placeholder:"Rastimiehen ohje",onChange:function(e){var t=e.target;return K(t.value)}})),r.a.createElement("div",null,r.a.createElement(p,{message:_e,type:"error"}),r.a.createElement("select",{value:le,onChange:function(e){return function(e){ce(e.target.value)}(e)}},r.a.createElement("option",{value:""},"Valitse ik\xe4luokka"),ae.map((function(e){return r.a.createElement("option",{key:e.id,value:e.id},e.name)}))),r.a.createElement("select",{value:Z,onChange:function(e){return function(e){$(e.target.value)}(e)}},r.a.createElement("option",{value:""},"Valitse kategoria"),Y.map((function(e){return r.a.createElement("option",{key:e.id,value:e.id},e.category)})))),r.a.createElement("div",null,r.a.createElement("select",{value:G,onChange:function(e){return function(e){B(e.target.value)}(e)}},r.a.createElement("option",{value:""},"Valitse s\xe4\xe4nn\xf6t"),M.map((function(e){return r.a.createElement("option",{key:e.id,value:e.id},e.rules)}))),r.a.createElement("select",{value:be,onChange:function(e){return function(e){de(e.target.value)}(e)}},r.a.createElement("option",{value:""},"Teht\xe4v\xe4n kieli"),ie.map((function(e){return r.a.createElement("option",{key:e.id,value:e.id},e.language)})))),r.a.createElement("div",null,r.a.createElement(p,{message:Je,type:"error"}),r.a.createElement("input",{className:"",type:"text",defaultValue:Ee,name:"CreatorName",placeholder:"Muokkaajan nimi",onChange:function(e){var t=e.target;return ge(t.value)}}),r.a.createElement(p,{message:ze,type:"error"}),r.a.createElement("input",{className:"",type:"text",defaultValue:ye,name:"CreatorEmail",placeholder:"Muokkaajan s\xe4hk\xf6postiosoite",onChange:function(e){var t=e.target;return ke(t.value)}})),r.a.createElement("div",null,r.a.createElement("button",{type:"submit",className:"save-task-button"},"Tallenna teht\xe4v\xe4"),r.a.createElement("button",{onClick:function(){t(!1)},className:"return-button"},"Palaa"))))},le=function(e){var t=e.match,a=e.user,u=Object(n.useState)(null),l=Object(s.a)(u,2),c=l[0],i=l[1],m=Object(n.useState)(!1),v=Object(s.a)(m,2),b=v[0],d=v[1],f=Object(n.useState)(null),h=Object(s.a)(f,2),E=h[0],g=h[1],j=Object(n.useState)(null),O=Object(s.a)(j,2),y=O[0],k=O[1],S=Object(o.f)();Object(n.useEffect)((function(){x(t.params.id).then((function(e){i(e)}))}),[]);return r.a.createElement("div",null,r.a.createElement("br",null),b?r.a.createElement(ue,{setModifyVisible:d,task:c,setTask:i}):r.a.createElement("div",{className:"task-view-info-background"},r.a.createElement(p,{message:E,type:"success"}),r.a.createElement(p,{message:y,type:"error"}),c&&r.a.createElement("div",{className:"task-view-info"},r.a.createElement("h2",null,c.name),r.a.createElement("h3",null,"Teht\xe4v\xe4nanto:"),r.a.createElement("p",null,c.assignmentText),r.a.createElement("h3",null,"Rastimiehen ohjeet:"),r.a.createElement("p",null,c.supervisorInstructions),r.a.createElement("h3",null,"Arvosteluasteikko:"),r.a.createElement("p",null,c.gradingScale),r.a.createElement("h3",null,"Sarja: "),r.a.createElement("p",null,c.ageGroup.name),r.a.createElement("h3",null,"Kategoria:"),r.a.createElement("p",null,c.category.category),r.a.createElement("h3",null,"S\xe4\xe4nt\xf6luokka:"),r.a.createElement("p",null,c.rules.rules),r.a.createElement("h3",null,"Teht\xe4v\xe4n viimeisin muokkaaja:"),r.a.createElement("p",null,c.creatorName),r.a.createElement("p",null,c.creatorEmail),null!==a&&r.a.createElement("div",null,r.a.createElement("button",{onClick:function(){return d(!0)},className:"modify-view-button"},"Muokkaa teht\xe4v\xe4\xe4"),c.pending&&r.a.createElement("button",{className:"acceptButton",onClick:function(){return function(){try{T(c.id),g("Teht\xe4v\xe4 hyv\xe4ksytty"),setTimeout((function(){g(null),S.push("/admin")}),5e3)}catch(e){k("Jotain meni vikaan"),setTimeout((function(){k(null)}),5e3)}}()}},"Hyv\xe4ksy teht\xe4v\xe4"),r.a.createElement("button",{className:"deleteButton",onClick:function(){return function(){try{N(c.id),g("Teht\xe4v\xe4 poistettu"),setTimeout((function(){g(null),c.pending?S.push("/admin"):S.push("/")}),5e3)}catch(e){k("Jotain meni vikaan"),setTimeout((function(){k(null)}),5e3)}}()}},"Poista teht\xe4v\xe4")))))},ce=function(){var e=Object(n.useState)(null),t=Object(s.a)(e,2),a=t[0],u=t[1],l=Object(o.f)();Object(n.useEffect)((function(){var e=window.localStorage.getItem("loggedUser");if(e){var t=JSON.parse(e);u(t),g(t.token)}}),[]);return r.a.createElement("div",null,r.a.createElement("div",{className:"header"},r.a.createElement(c.b,{to:"/"},r.a.createElement("div",{className:"logo"})),r.a.createElement(c.b,{to:"/lisaa_tehtava"},r.a.createElement("button",{className:"addtask-button-header"},"Lis\xe4\xe4 teht\xe4v\xe4")),null===a?r.a.createElement(n.Fragment,null,r.a.createElement(c.b,{to:"/kirjautuminen"},r.a.createElement("button",{className:"login-button-header"},"Kirjaudu"))):r.a.createElement(n.Fragment,null,r.a.createElement(c.b,{to:"/admin"},r.a.createElement("button",{className:"admin-button-header"},"Admin")),r.a.createElement("div",null,r.a.createElement("div",{className:"logged"},"Kirjautuneena ",r.a.createElement(c.b,{to:"/omasivu",className:"username-header"},a.username)),r.a.createElement("div",{className:"logout"},r.a.createElement("button",{className:"logout-button-header",onClick:function(){return window.localStorage.removeItem("loggedUser"),u(null),g(null),l.push("/"),void window.location.reload()}},"Kirjaudu ulos"))))),r.a.createElement("div",{className:"admin-task-buttons-mobile"},null!==a&&r.a.createElement(c.b,{to:"/admin"},r.a.createElement("button",{className:"admin-button-mobile"},"Admin")),r.a.createElement(c.b,{to:"/lisaa_tehtava"},r.a.createElement("button",{className:"addtask-button-mobile"},"Lis\xe4\xe4 teht\xe4v\xe4"))),r.a.createElement("div",{className:"container"},r.a.createElement(o.b,{exact:!0,path:"/",render:function(){return r.a.createElement(A,{user:a})}}),r.a.createElement(o.b,{exact:!0,path:"/tehtava/:id",render:function(e){return r.a.createElement(le,Object.assign({},e,{user:a}))}}),r.a.createElement(o.b,{path:"/kirjautuminen",render:function(){return r.a.createElement(j,{setUser:u})}}),r.a.createElement(o.b,{path:"/rekisteroityminen",render:function(){return r.a.createElement(U,null)}}),r.a.createElement(o.b,{path:"/lisaa_tehtava",render:function(){return r.a.createElement($,null)}}),r.a.createElement(o.b,{path:"/omasivu",render:function(){return a?r.a.createElement(re,{user:a,setUser:u}):r.a.createElement(o.a,{to:"/"})}}),r.a.createElement(o.b,{path:"/admin",render:function(){return a?r.a.createElement(te,null):r.a.createElement(o.a,{to:"/"})}}),r.a.createElement(o.b,{path:"/lisaa_admin",render:function(){return a?r.a.createElement(U,null):r.a.createElement(o.a,{to:"/"})}}),r.a.createElement(o.b,{path:"/lisaa_pudotusvalikkoon",render:function(){return a?r.a.createElement(Z,null):r.a.createElement(o.a,{to:"/"})}})))};a(57);l.a.render(r.a.createElement(c.a,null,r.a.createElement(ce,null)),document.getElementById("root"))}},[[29,1,2]]]);
//# sourceMappingURL=main.277e303a.chunk.js.map