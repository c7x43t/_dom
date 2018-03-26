// $$.gather(query1,query2,query3) => joined list of all uqeries
(()=>{
	// ## private vars ##
	var regexPreFilter=/[.#]?-?[_a-zA-Z]+[_a-zA-Z0-9-]*/;
	var regexSpaceFilter=/ /;
	// ## private functions ##
	// fast functions copied from: https://github.com/codemix/fast.js/
	function bindInternal3(func, thisContext) {
		return function (a, b, c) {
			return func.call(thisContext, a, b, c);
		};
	}
	// fast Map
	function fastMap(subject, fn, thisContext) {
		var length = subject.length,
			result = new Array(length),
			iterator = thisContext !== undefined ? bindInternal3(fn, thisContext) : fn,
			i;
		for (i = 0; i < length; i++) {
			result[i] = iterator(subject[i], i, subject);
		}
		return result;
	};
	// fast Reduce
	function fastReduce (subject, fn, initialValue, thisContext) {
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

		for (; i < length; i++) {
			result = iterator(result, subject[i], i, subject);
		}
		return result;
	};
	// fast Filter
	function fastFilter (subject, fn, thisContext) {
		var length = subject.length,
			result = [],
			iterator = thisContext !== undefined ? bindInternal3(fn, thisContext) : fn,
			i;
		for (i = 0; i < length; i++) {
			if (iterator(subject[i], i, subject)) {
				result.push(subject[i]);
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
		nodeList.map=fn=>fastMap(nodeList,fn);
		nodeList.reduce=fn=>fastReduce(nodeList,fn);
		nodeList.filter=fn=>fastFilter(nodeList,fn);
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
		var nodeArray=fastQuery(document,selector);
		return equip(nodeArray);
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
