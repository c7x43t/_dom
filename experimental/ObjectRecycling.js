function Recyclable(keys) {
    var isArray, key, value;
    var strRecycle = strInit = strArgs = "";
    for (var nKey of keys) {
        isArray = nKey instanceof Array;
        key = isArray ? nKey[0] : nKey;
        value = isArray ? nKey[1] : nKey;
        strRecycle += "this." + key + "=null;";
        strInit += "this." + key + "=" + value + ";";
        strArgs += key + ",";
    }
    strArgs = strArgs.substring(0, strArgs.length - 1);
    var recyclable = new Function("", `Object.defineProperties(this,{
		recycle:{
			value:function(){${strRecycle}}
		},
		init:{
			value:function(${strArgs}){${strInit}}
		}
	})`)
    return recyclable;
}

function objectPool(keys) {
    if (!(keys instanceof Array)) keys = Object.keys(keys);
    var recyclable = Recyclable(keys);
    this.freed = [];
    this.allocated = 0;
    Object.defineProperties(this, {
        allocate: {
            value: function() {
                if (this.freed.length > 0) {
                    return this.freed.pop();
                } else {
                    this.allocated++;
                    return new recyclable();
                }
            }
        },
        free: {
            value: function(n) {
                var length = this.freed.length;
                var l = length - n;
                var newL = l < 0 ? 0 : l;
                this.freed.length = newL;
                return length - newL;
            }
        },
        preAllocate: {
            value: function(n) {
                var diff = n - this.allocated;
                this.allocated += diff;
                for (var i = 0; i < diff; i++) {
                    this.freed.push(new recyclable());
                }
            }
        },
    });
}
