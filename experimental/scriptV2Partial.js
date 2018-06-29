// Library
// Immutable
(function(global){
	var PARENT="[[__PARENT__]]";
	function Immutable(obj){
		if(obj instanceof Object){
			for(var keys=Object.keys(obj),i=0;i<keys.length;i++){
				this[keys[i]]=obj[keys[i]];
			}
		}
		if(obj!==false) Object.freeze(this);
		return this;
	}
	Immutable.prototype.get=function(key){
		return this.getIn(key);
	};
	Immutable.prototype.getIn=function(key){
		var tmp ,obj=this;
		if(key instanceof Array){
			for(var i=0,lastIndex=key.length-1;i<key.length;i++){
				while(true){
					tmp=obj[key[i]];
					//console.log({tmp:tmp,last:i===lastIndex,obj:obj,parent:obj.hasOwnProperty(PARENT)})
					if(tmp!==undefined||!obj.hasOwnProperty(PARENT)){
						if(i===lastIndex){
							return tmp;
						}else{
							i++;
							obj=tmp;
						}
					}else{
						obj=obj[PARENT];
					}
				}
			}
		}else{
			return this.getIn([key]);
		}
	};
	Immutable.prototype.set=function(key,value,parent){
		var tmp = new Immutable(false);
		tmp[key]=value;
		//if(parent===undefined) 
		tmp[PARENT]=this;
		Object.freeze(tmp);
		return tmp;
	};
	Immutable.prototype.setIn=function(key,value,parent){
		if(key instanceof Array&&key.length>1){
			var tmpKey=[key.shift()];
			var tmpNext=this.getIn(tmpKey);
			var isImmutable=tmpNext instanceof this.constructor;
			var next=isImmutable ? tmpNext:new this.constructor(tmpNext);
			return this.set(tmpKey,next.setIn(key,value,isImmutable?isImmutable:undefined),parent);
		}else{
			return this.set(key,value,parent);
		}
	};
	global.Immutable=Immutable;
}(window));
// new HoverImage
var mainImg = E(".main-img")[0];
var hoverImage = E(".hover-view img")[0];
var hoverView = E(".hover-view")[0];
var hoverPointer = E(".hover-pointer")[0];
var border=4; //px | hover View spacing
var store=new Immutable();
//var state=;
//var imageURL="https://www.derlifestyleshop.de/media/images/org/eastpak_tranverz_l_black_matchy.jpg";

function getImageURL(){
	return transformImageURL(mainImg.src);
}
function transformImageURL(url){
	return url.replace(/info/,"org");
}
E.load(registerHoverLogic);
E.load(productThumbnailSwitching);
function registerHoverLogic(){
	// console.log("registered");
	E(document).on("mousemove scroll",debounceHoverLogic);
	function debounceHoverLogic(e){
		E.animationFrame(hoverLogic);
	}
	
	E(document).on("scroll",debounceSetMainImgSize);
	function debounceSetMainImgSize(e){
		E.animationFrame(setMainImgSize);
	}
	function setMainImgSize(e){
		var tmp=E.clone(store.get("mainImgSize"));
		tmp.top-=E.scroll.dtop;
		tmp.bottom-=E.scroll.dtop;
		tmp.left-=E.scroll.dleft;
		tmp.right-=E.scroll.dleft;
		store=store.set("mainImgSize",tmp);
	}
	function hoverLogic(){
		return new Promise(function(res,rej){
			if(E.over(store.get("mainImgSize")||mainImg)){
				// enter routine
				if(hoverView.style.display!=="block"){
					store=store.set("mainImgSize",E.offset(mainImg));
					//console.log(store)
					showHoverElements();
					setHoverView();
					setHoverPointer()
					.then(function(){
						var imageURL=getImageURL();
						hoverImage.src=imageURL;
					})
					.then(setHoverImg())
					.then(res);
					//await setHoverPointer();
					//var imageURL=getImageURL();
					//hoverImage.src=imageURL;
					//await setHoverImg();
				}else{ // update routine
					//await setHoverPointer();
					//await setHoverImg();
					setHoverPointer()
					.then(setHoverImg())
					.then(res);
				}
			}else{
				// exit routine
				if(hoverView.style.display==="block"){
					hideHoverElements();
				}
			}
		})
		
		/*
		//console.log(store.get("mainImgSize"));
		if(E.over(store.get("mainImgSize")||mainImg)){
			// enter routine
			if(hoverView.style.display!=="block"){
				store=store.set("mainImgSize",E.offset(mainImg));
				//console.log(store)
				showHoverElements();
				setHoverView();
				await setHoverPointer();
				var imageURL=getImageURL();
				hoverImage.src=imageURL;
				await setHoverImg();
			}else{ // update routine
				await setHoverPointer();
				await setHoverImg();
			}
		}else{
			// exit routine
			if(hoverView.style.display==="block"){
				hideHoverElements();
			}
		}*/
	}
	function hideHoverElements(){
		E.map([hoverView,hoverPointer],function(e){e.style.display=""});
	}
	function showHoverElements(){
		E.map([hoverView,hoverPointer],function(e){e.style.display="block"});
	}
	function calcHoverView(){ // can implement a minimal width treshold
	    // console.log({context:arguments.callee.name,store:store})
		var mainImgSize=store.get("mainImgSize");
		var width,height,left,top;
		top=0;
		left=border+Math.round(mainImgSize.width);
		width=E.size.width-border-Math.round(mainImgSize.right)-border-E.scroll.left;
		height=E.size.height-Math.round(mainImgSize.top)-border-E.scroll.top;
		return {
			top:top,
			left:left,
			width:width,
			height:height
		};
	}
	function setHoverView(){
		var cHV=calcHoverView();
		var keys=Object.keys(cHV);
		/*
		for(var key of keys){
			hoverView.style[key]=cHV[key]+"px";
		}*/
		E.map(cHV,function(e,key){
			hoverView.style[key]=cHV[key]+"px";
		});
	}

	function calcHoverPointer(){

		var mainImgSize=store.get("mainImgSize");
		var imageURL=getImageURL();
		//var largeImageSize=await E.getImgSize(imageURL);
		return Promise.resolve(E.getImgSize(imageURL))
		.then(function(largeImageSize){
			var hoverViewSize=calcHoverView();
			var width,height,left,top;
			width=Math.round(mainImgSize.width*Math.min(
				hoverViewSize.width/largeImageSize.width,
				1
				));
			
			height=Math.round(mainImgSize.height*Math.min(
				hoverViewSize.height/largeImageSize.height,
				1
				));
			//console.log({context:arguments.callee.name,mainImgSize:mainImgSize,hoverViewSize:hoverViewSize,largeImageSize:largeImageSize,height:height})
			left=Math.round(Math.max(
				0,
				Math.min(
					mainImgSize.right-mainImgSize.left-width,
					E.mouse.x-mainImgSize.left-Math.round(width/2)
				)
			));
			top=Math.round(Math.max(
				0,
				Math.min(
					mainImgSize.bottom-mainImgSize.top-height,
					E.mouse.y-mainImgSize.top-Math.round(height/2)
				)
			));
			var obj={
				top:top,
				left:left,
				width:width,
				height:height
			}
			return obj;
		});	

		/*
		var mainImgSize=store.get("mainImgSize");
		var imageURL=getImageURL();
		var largeImageSize=await E.getImgSize(imageURL);
		var hoverViewSize=calcHoverView();
		var width,height,left,top;
		width=Math.round(mainImgSize.width*Math.min(
			hoverViewSize.width/largeImageSize.width,
			1
			));
		
		height=Math.round(mainImgSize.height*Math.min(
			hoverViewSize.height/largeImageSize.height,
			1
			));
		//console.log({context:arguments.callee.name,mainImgSize:mainImgSize,hoverViewSize:hoverViewSize,largeImageSize:largeImageSize,height:height})
		left=Math.round(Math.max(
			0,
			Math.min(
				mainImgSize.right-mainImgSize.left-width,
				E.mouse.x-mainImgSize.left-Math.round(width/2)
			)
		));
		top=Math.round(Math.max(
			0,
			Math.min(
				mainImgSize.bottom-mainImgSize.top-height,
				E.mouse.y-mainImgSize.top-Math.round(height/2)
			)
		));
		var obj={
			top:top,
			left:left,
			width:width,
			height:height
		}
		return obj;
		*/
	}
	function setHoverPointer(){
		return Promise.resolve(calcHoverPointer())
		.then(function(cHP){
			E.map(cHP,function(e,key){
				hoverPointer.style[key]=cHP[key]+"px";
			});
		});
		/*
		var cHP = await calcHoverPointer();
		var keys=Object.keys(cHP);
		E.map(cHP,function(e,key){
			hoverPointer.style[key]=cHP[key]+"px";
		});
		*/
	}
	function calcHoverImg(){
		var imageURL=getImageURL();
		return Promise.all([calcHoverPointer(),E.getImgSize(imageURL)])
		.then(function(results){
			var hoverPointerSize=results[0];
			var largeImageSize=results[1];
			var x=-largeImageSize.width*hoverPointerSize.left/mainImg.width;
			var y=-largeImageSize.height*hoverPointerSize.top/mainImg.height;
			return {x:x,y:y};
		})
		/*
		var hoverPointerSize=await calcHoverPointer();
		var imageURL=getImageURL();
		var largeImageSize=await E.getImgSize(imageURL);
		var x=-largeImageSize.width*hoverPointerSize.left/mainImg.width;
		var y=-largeImageSize.height*hoverPointerSize.top/mainImg.height;
		return {x:x,y:y};
		*/
	}
	function setHoverImg(){
		return Promise.resolve(calcHoverImg())
		.then(function(hoverImageposition){
			hoverImage.style.transform="translateX("+hoverImageposition.x+"px)translateY("+hoverImageposition.y+"px)";
		})
		/*
		var hoverImageposition=await calcHoverImg();
		hoverImage.style.transform="translateX("+hoverImageposition.x+"px)translateY("+hoverImageposition.y+"px)";
		*/
	}
}
//
function productThumbnailSwitching(){
	// product thumbnail switching
    E(".more-images-item a").map(function(el) {
		function swapSource(e) {
            E(".main-img")[0].src = el.href;
        }
        E(el).on("mouseover", swapSource);
        E(el).on("click", swapSource, true);
    });
}
