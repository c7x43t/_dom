function constr(){y=this;y.doc=document;_=null};
constr.prototype.s=function(str,o){o?y._=y.doc.querySelector(str):y._=y.doc.querySelectorAll(str);return y}
constr.prototype.i=function(str){y._=y.doc.getElementById(str);return y}
constr.prototype.t=function(str,o){y._=y.doc.getElementsByTagName(str);o?y._=y._[0];return y}
constr.prototype.c=function(str,o){y._=y.doc.getElementsByClassName(str);o?y._=y._[0];return y}
constr.prototype.n=function(str,o){y._=y.doc.getElementsByName(str);o?y._=y._[0];return y}
constr.prototype.append = function(){
    this.tdoc.insertAdjacentHTML('afterbegin', '<div id="newChild">mark</div>');
}
_=new constr();
