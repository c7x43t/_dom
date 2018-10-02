// parses a function returing an object {args: array of arguments, body: function body as string}
// if parsing fails null is returned
function parseFunction(func){
    var regParseFunction=/\(([\s\S]*?)\) *(?:=>)? *{([\s\S]*?)}/;
    var parsedFunction=regParseFunction.exec(func.toString());
    if(parsedFunction){
        var args=parsedFunction[1];
        var body=parsedFunction[2];
    }
    return typeof args === "string" && typeof body === "string" ? {
        args: args.split(","),
        body: body
    } : null;
}
