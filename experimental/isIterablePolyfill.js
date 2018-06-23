var UNDEFINED="undefined";
function isIterable(arr){
	return arguments.callee.check(arr);
}
function checkSymbolIterator(o){
	return o[Symbol.iterator] instanceof Function;
}
function checkIterator(o){
	return arr.iterator instanceof Function;
}
function checkProperties(o){
	return o.hasOwnProperty("length")&&o.slice instanceof Function||o.hasOwnProperty("byteLength");
}
(function(func){
	func.check=typeof Symbol!==UNDEFINED&&Symbol.iterator?checkSymbolIterator:[].iterator?checkIterator:checkProperties;
}(isIterable));
