function keyGenFactory(){
    let pointer=0;
    const returned=[];
    const keyGen={
        take:function(){
            return returned.length>0?returned.shift():++pointer;
        },
        return:function(key){
            returned.push(key);
        }
    };
    return keyGen;
}
