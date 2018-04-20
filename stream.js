function newStream(){
    let store={}
    function stream(data){
        let fns=store.keys();
        for(var i=0;i<fns.length;i++){
            store[fns[i]](data);
        }
    }
    stream.add=function(fn){
        store[fn.name]=fn;
    }
    stream.remove=function(fn){ // returns true/false
        return delete store[fn.name];
    }
    return stream;
}
