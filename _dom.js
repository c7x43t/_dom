function xx(){y=this;y.doc=document;
y.s=function(el,o){o?y._=y.doc.querySelector(el):y._=y.doc.querySelectorAll(el);return y};
y.i=function(el){y._=y.doc.getElementById(el);return y};
y.t=function(el,o){y._=y.doc.getElementsByTagName(el);o?y._=y._[0]:null;return y};
y.c=function(el,o){y._=y.doc.getElementsByClassName(el);o?y._=y._[0]:null;return y};
y.n=function(el,o){y._=y.doc.getElementsByName(el);o?y._=y._[0]:null;return y};
y.append=function(el){
    y._.insertAdjacentHTML('afterbegin', el);return y;
}};
_=new xx();
