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
    var recyclable = new Function("", `
        Object.defineProperties(this, {
            recycle: {
                value: function() {
                    $ {
                        strRecycle
                    }
                }
            },
            init: {
                value: function($ {
                    strArgs
                }) {
                    $ {
                        strInit
                    }
                }
            }
        })
	`);
    return recyclable;
}
