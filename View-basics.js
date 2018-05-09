// # Observe an object
// from: https://stackoverflow.com/questions/36258502/why-has-object-observe-been-deprecated?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
var original = {
    "foo": "bar"
};
function prox(original){
    return new Proxy(original, {
        get: function(target, name, receiver) {
            var rv = target[name];
            console.log(rv);
        },
        set: function(target, name, value) {
            console.log({ type: 'set', target, name, value });
            return Reflect.set(target, name, value);
        }
    })
};
k=prox(original);
