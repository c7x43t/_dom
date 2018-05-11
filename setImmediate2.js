// very fast minimal implementation of setImmediate polyfill using MutationObserver (4-10x faster than messageChannel)
window.setImmediate=(function(){
	var stack=[];
	var handle=1;
	var executing=false;
    var ids={};
    
    function fastApply(fn,args){
        var fastSpread={
            0:function(fn){
                fn();
            },
            1:function(fn,args){
                fn(args[0]);
            },
            2:function(fn,args){
                fn(args[0],args[1]);
            },
            3:function(fn,args){
                fn(args[0],args[1],args[2]);
            },
            4:function(fn,args){
                fn(args[0],args[1],args[2],args[3]);
            },
            5:function(fn,args){
                fn(args[0],args[1],args[2],args[3],args[4]);
            }
        };
        var len=args.length;
        if(len<=5){
            fastSpread[len](fn,args);
        }else{
            fn.apply(undefined, args);
        }
    }
	var observer = new MutationObserver(function runner(){
		var item=stack.shift();
		if(ids.hasOwnProperty(item[2])){
			window.clearImmediate(item[2]);
            fastApply(item[0],item[1]);
		}
		if(stack.length>0){
			runner();
		}else{
			executing=false;
		}
    });
	var observedElement = document.createElement('div');
    observer.observe(observedElement, { attributes: true });
    function run(){
        observedElement.setAttribute('a', '');
    }
	window.clearImmediate=function(id){
		delete ids[id];
    };
	return function(){
		var fn=arguments[0];
        var args=[];
        for(var i=1;i<arguments.length;i++) args.push(arguments[i]);
		stack.push([fn,args,handle]);
		ids[handle]=true;

		if(!executing){
            executing=true;
            run();
        }
		return handle++;
	};
})();
