merc={
	_kEquip:function(e){
		e.setDefaultValue=function(value){
			if(!(e instanceof Array)) e=merc._Array.from(e);
			e.map(e=>{
				e.value=value;
				e.addEventListener("focusin",(e)=>{
					if(e.target.value===value) e.target.value="";
				});
				e.addEventListener("focusout",(e)=>{
					if(e.target.value==="") e.target.value=value;
				});
			});
		}
		return e;
	}
};
$$k=s=>merc._kEquip(Array.from(document.querySelectorAll(s)).map(e=>merc._kEquip(e)));
document.addEventListener("DOMContentLoaded",e=>{
	$$k("input[name='email']").setDefaultValue("e-mail");
	$$k("input[name='password']").setDefaultValue("password");
});

function $$(sel){
	_$=(e,sel)=>Array.from(e.querySelectorAll(sel)); // return array of elements from selector query
	return _$(document,sel).map(e=>{ // equip elements with ...
        e.query=sel=>_$(e,sel); // querySelectorAll shorthand
        e.hasClass=str=>el.classList?el.classList.contains(str):new RegExp('(^| )'+str+'( |$)','gi').test(e.className);
        e.addClass=str=>e.classList?e.classList.add(str):e.name+=' '+name;
        e.removeClass=str=>el.classList?el.classList.remove(str):el.className=el.className.replace(new RegExp('(^|\\b)'+str.split(' ').join('|')+'(\\b|$)','gi'),' ');
        e.after=str=>e.insertAdjacentHTML('afterend', str);
        e.before=str=>e.insertAdjacentHTML('beforebegin', str);
        e.append=el=>e.appendChild(el);
        e.prepend=el=>e.insertBefore(el, e.firstChild);
        e.remove=()=>e.parentNode.removeChild(e);
        e.replace=str=>e.outerHTML=str;
        e.clone=()=>e.cloneNode(true);
        e.empty=()=>e.innerHTML='';
        e.attr=(str,val)=>val?e.setAttribute(str,val):e.getAttribute(str);
        e.css=(str,val)=>val?e.style[str]=val:getComputedStyle(e)[str];
        e.html=str=>str?e.innerHTML=str:e.innerHTML;
        e.text=str=>str?e.textContent=str:e.textContent; 
        e.next=()=>e.nextElementSibling;
        e.prev=()=>e.previousElementSibling;
        e.offset=()=>{
            var rect = el.getBoundingClientRect();
            return {
                top: rect.top + document.body.scrollTop,
                left: rect.left + document.body.scrollLeft
            }
        };
        e.parent=()=>e.parentNode;
        e.siblings=()=>Array.prototype.filter.call(e.parentNode.children,child=>child !== e);
        e.position=()=>{return{left: e.offsetLeft, top: e.offsetTop}};
        

        return e;
    });
    
}
