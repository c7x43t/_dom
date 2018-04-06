// $$.gather(query1,query2,query3) => joined list of all uqeries
(()=>{
	// ## private vars ##
	var regexPreFilter=/[.#]?-?[_a-zA-Z]+[_a-zA-Z0-9-]*/;
	var regexSpaceFilter=/ /;
	// ## private functions ##
	// fast functions based on: https://github.com/codemix/fast.js/
	function bindInternal3(func, thisContext) {
		return function (a, b, c) {
			return func.call(thisContext, a, b, c);
		};
	}
	// fast Map
	function fastMap(subject, fn, test, thisContext) {
		var length = subject.length,
			result = new Array(length),
			iterator = thisContext !== undefined ? bindInternal3(fn, thisContext) : fn,
			i;
		if(!test){
			for (i = 0; i < length; i++) {
				result[i] = iterator(subject[i], i, subject);
			}
		}else{
			for (i = 0; i < length; i++) {
				if(test(subject[i])) break;
				result[i] = iterator(subject[i], i, subject);
			}
		}
		return result;
	};
	// fast Reduce
	function fastReduce (subject, fn, initialValue, test, thisContext) {
	  var length = subject.length,
			iterator = thisContext !== undefined ? bindInternal4(fn, thisContext) : fn,
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
				result = iterator(result, subject[i], i, subject);
			}
		}else{
			for (; i < length; i++) {
				if(test(subject[i])) break;
				result = iterator(result, subject[i], i, subject);
			}
		}
		return result;
	};
	// fast Filter
	function fastFilter (subject, fn, test, thisContext) {
		var length = subject.length,
			result = [],
			iterator = thisContext !== undefined ? bindInternal3(fn, thisContext) : fn,
			i;
		if(!test){
			for (i = 0; i < length; i++) {
				if (iterator(subject[i], i, subject)) {
					result.push(subject[i]);
				}
			}
		}else{
			for (i = 0; i < length; i++) {
				if(test(subject[i])) break;
				if (iterator(subject[i], i, subject)) {
					result.push(subject[i]);
				}
			}
		}
		return result;
	};
	// faster than querySelectorAll
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
		return nodeList;
	}
	/*
	// obsolete with equip fast array native functions to nodeList
	function queryToArray(el,selector){ 
		return Array.from(fastQuery(el,selector));
	};
	//*/
	function equip(nodeList){
		// map=fn=>a.map(e=>fn(arguments));
		nodeList.map=(fn,init,cond)=>fastMap(nodeList,fn,init,cond);
		nodeList.reduce=(fn,init,cond)=>fastReduce(nodeList,fn,init,cond);
		nodeList.filter=(fn,init,cond)=>fastFilter(nodeList,fn,init,cond);
		nodeList.html=str=>{
			nodeList.map(el=>str?el.innerHTML=str:el.innerHTML);
			return nodeList;
		};
		nodeList.on=(str,fn)=>{
			fastMap(nodeList,el=>el.addEventListener(str,fn));
			return nodeList;
		};
		// faster replace operations
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
		}
		return nodeList;
	}
	// main
	var $$=selector=>{
		var nodeList=fastQuery(document,selector);
		//Object.assign(nodeList);
		return equip(nodeList);
	}
	// ## public vars ##
	$$.map=fastMap;
	$$.reduce=fastReduce;
	$$.filter=fastFilter;
	$$.ajax=()=>{
		
	}
	// export
	window.$$=$$;
})();
