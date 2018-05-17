var NOOP=()=>{};
streamOut=function(t){
	var store={callback:undefined,
	triggered:false};
	func=function(){};
	func.add=function(fn){
		if(store.triggered) fn();
		store.callback=fn;
	};
	function triggered(){
		if(store.callback) callback();
		store.triggered=true;
	}
	setTimeout(triggered,t);
	return func;
}
