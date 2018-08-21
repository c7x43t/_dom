function findElementsByContent(document,str,selector){
  var results=[];
  if(selector===undefined) selector="*";
  var els = typeof selector==="string"?document.querySelectorAll(selector):Array.from(elements);
  for(var i=0; i<els.length; i++){
      if(els[i].innerHTML.includes(str)){
            results.push(els[i]);
      }
  }
  return results;
}