(()=>{
	// ## private vars ##
	var regexPreFilter=/[.#]?-?[_a-zA-Z]+?[_a-zA-Z0-9-]*/;
	var regexSpaceFilter=/ /;
	// ## private functions ##
	// fast functions based on: https://github.com/codemix/fast.js/
	// fast Map
	function fastMap(subject, fn, test) {
		var length = subject.length,
			result = new Array(length),
			i;
		if(!test){
			for (i = 0; i < length; i++) {
				result[i] = fn(subject[i], i, subject);
			}
		}else{
			for (i = 0; i < length; i++) {
				if(test(subject[i])) break;
				result[i] = fn(subject[i], i, subject);
			}
		}
		return result;
	};
	// fast Reduce
	function fastReduce (subject, fn, initialValue, test) {
	  var length = subject.length,
			i, result;

		if (initialValue === undefined) {
			i = 1;
			result = subject[0];
		}
		else {
			i = 0;
			result = initialValue;
		}
		if(!test){
			for (; i < length; i++) {
				result = fn(result, subject[i], i, subject);
			}
		}else{
			for (; i < length; i++) {
				if(test(subject[i])) break;
				result = fn(result, subject[i], i, subject);
			}
		}
		return result;
	};
	// fast Filter
	function fastFilter (subject, fn, test) {
		var length = subject.length,
			result = [],
			i;
		if(!test){
			for (i = 0; i < length; i++) {
				if (fn(subject[i], i, subject)) {
					result.push(subject[i]);
				}
			}
		}else{
			for (i = 0; i < length; i++) {
				if(test(subject[i])) break;
				if (fn(subject[i], i, subject)) {
					result.push(subject[i]);
				}
			}
		}
		return result;
	};
	// faster than querySelectorAll (in most cases)
	function fastQuery(el,selector){
		var nodeList;
		if(regexPreFilter.exec(selector)&&!regexSpaceFilter.exec(selector)){
			if(selector[0]==="."){
				nodeList=el.getElementsByClassName(selector.replace('.',''))
			}
			else if(selector[0]==="#"){
				nodeList=el.getElementById(selector.replace('#',''))
			}
			else{
				nodeList=el.getElementsByTagName(selector)
			}
		}else{
			nodeList=el.querySelectorAll(selector)
		}
		if(nodeList===null) nodeList=document.createDocumentFragment().childNodes;
		return nodeList;
	}
	// helper functions
	function on(el,str,fn,bool){
		let isDefault=e=>fn(el,e);
		let noDefault=e=>{
			e.preventDefault();
			return fn(el,e);
		}
		el.addEventListener(str,bool?noDefault:isDefault);
		return el;
	}
	function off(el,str,fn){
		el.removeEventListener(str,fn);
		return el;
	}
	// equip single
	function equipSingle(node){
		node.on=(str,fn,bool)=>on(node,str,fn,bool);
		node.off=(str,fn)=>off(node,str,fn);
		node.find=(selector)=>fastQuery(node,selector);
		return node;
	}
	// equip nodeList
	function equip(nodeList){
		nodeList.map=(fn,cond)=>fastMap(nodeList,fn,cond);
		nodeList.reduce=(fn,init,cond)=>fastReduce(nodeList,fn,init,cond);
		nodeList.filter=(fn,cond)=>fastFilter(nodeList,fn,cond);
		nodeList.html=str=>{
			nodeList.map(el=>str?el.innerHTML=str:el.innerHTML);
			return nodeList;
		};
		nodeList.on=(str,fn,bool)=>{
			fastMap(nodeList,el=>{
				on(el,str,fn,bool);
			});
			return nodeList;
		};
		nodeList.off=(str,fn)=>{
			fastMap(nodeList,el=>{
				off(el,str,fn);
			});
		}
		nodeList.get=n=>{
			return equipSingle(nodeList[n]);
		}
		// faster replace operations - EXPERIMENTAL
		// {fn} must return an element
		nodeList.map.replace=fn=>{
			var list=[];
			var nodes=Array.from(nodeList);
			$$.map(nodes,e=>{
				var k=e.cloneNode(true);
				fn(k);
				//list.push(k);
				e.parentNode.replaceChild(k, e);
			});
			$$.map(nodes,(e,i)=>{
				//e.parentNode.replaceChild(list[i], e);
			});
		};
		return nodeList;
	}
	// main
	var $$=selector=>{
		nodeList=typeof selector==="string"?fastQuery(document,selector):selector;
		return equip(nodeList);
	};
	// ## public vars ##
	$$.addClass=(el,className)=>{
		if (el.classList)
		  el.classList.add(className);
		else
		  el.className += ' ' + className;
	};
	$$.removeClass=(el,className)=>{
		if (el.classList)
		  el.classList.remove(className);
		else
		  el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
	};
	$$.hasClass=(el,className)=>{
		if (el.classList)
		  return el.classList.contains(className);
		else
		  return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
	};
	$$.toggleClass=(el,className)=>{
		$$.hasClass(el,className)?$$.removeClass(el,className):$$.addClass(el,className);
	};
	$$.isHover=e=>{// propably useless
		return (e.parentElement.querySelector(':hover') === e);
	};
	$$.style=(el,pseudo)=>{
		return window.getComputedStyle(el,pseudo?pseudo:null);
	}
	// ajax
	$$.ajax=()=>{
		
	};
	$$.find=(el,selector)=>fastQuery(el,selector);
	// map-reduce
	$$.map=fastMap;
	$$.reduce=fastReduce;
	$$.filter=fastFilter;
	// export
	window.$$=$$;
})();
