//"use strict";
var maxWidth = 852;
function hoverLogic(){
	//Step 0 - variables
	var mainImg=$$(".main-img")[0];
	var posMainImg={};
	var hoverImage=$$(".hover-view img")[0];
	var hoverPointer=$$(".hover-pointer")[0];
	var hoverPointerSize={};
	var hoverPointerMax={};//max {x,y} offset position
	var hoverView=$$(".hover-view")[0];
	var hoverSize={};
	var imgSrc=mainImg.src;
	var imgSize={}; // not needed
	var ratio={};
	var posHoverView;
	return (function(){
		//Step 1 - copy image
		function copyImageSrc(){
			imgSrc=mainImg.src;
			hoverImage.src=imgSrc;
		}

		//Step 3 - size hover-pointer correctly
		function getImgSize(imgSrc, callback) {
			var newImg = new Image();
			newImg.onload = function () {
				if (callback != undefined)
					callback({width: newImg.width, height: newImg.height})
			}
			newImg.src = imgSrc;
		}

		function setRatio(w,h){
			ratio={
				width:w>1?1:w,
				height:h>1?1:h
			};
		}
		function resizeHoverPointer(ratio){
			var w=Math.floor(mainImg.width*ratio.width);
			var h=Math.floor(mainImg.height*ratio.height);
			hoverPointerSize={
				width:w,
				height:h
			};
			hoverPointerMax={
				x:Math.floor(mainImg.width-hoverPointerSize.width),
				y:Math.floor(mainImg.height-hoverPointerSize.height)
			}
			hoverPointer.style.width=hoverPointerSize.width+"px";
			hoverPointer.style.height=hoverPointerSize.height+"px";
		};
		// Step ?? - mouse event handler for main-img;
		// handling posMainImg updates efficiently
		function newAnimationFrame(fn){
			return (function animationFrame(fn){
				var ticking=false;
				return function(){
					if (!ticking) { // replace later with debounced stream
						window.requestAnimationFrame(function() {
						  fn();
						  ticking = false;
						});
					}
					ticking = true;	
				}
			})(fn);
		}
		function updatePosMainImg(){
			posMainImg=mainImg.getBoundingClientRect();	
		}
		var updatePosMainImgDebounced=newAnimationFrame(updatePosMainImg);
		function updatePosHoverView(){
			posHoverView=hoverView.getBoundingClientRect();
		}
		var updatePosHoverViewDebounced=newAnimationFrame(updatePosHoverView);
		window.addEventListener("scroll",function(){
			updatePosMainImgDebounced();
			updatePosHoverViewDebounced();
		});
		window.addEventListener("resize",function(){
			updatePosMainImgDebounced();
			updatePosHoverViewDebounced();
		});
		window.addEventListener("load",function(){
			updatePosMainImg();
			updatePosHoverView();
		});
		// eventListener for mouse events over main-image
		document.addEventListener("mousemove",e=>{/* make invisible + unregister above */
			var p=posMainImg;
			if(e.x>p.right||e.x<p.left||e.y<p.top||e.y>p.bottom){
				if(hoverPointer.style.display==="block"){ //on leave
					hoverPointer.style.display="";
					hoverView.style.display="";
				}
			}else{
				if(hoverPointer.style.display===""){ //on enter
					updatePosMainImg();
					copyImageSrc();
					//step 1 - copy image
					copyImageSrc();
					hoverPointer.style.display="block";
					hoverView.style.display="block";
					// step 2 - hover view size
					updatePosHoverView();
					var w = document.body.clientWidth;
					var h = window.innerHeight;
					var border=8;
					hoverSize={width:(w-posHoverView.x-border),height:(h-posHoverView.y-border)}
					hoverView.style.width=hoverSize.width+"px";
					hoverView.style.height=hoverSize.height+"px";
					// step 3 - hover pointer size
					getImgSize(imgSrc,imgSize=>{
						this.imgSize=imgSize;
						var w=hoverSize.width/imgSize.width,
							h=hoverSize.height/imgSize.height;
						setRatio(w,h);
						resizeHoverPointer(ratio);
					});
				}
				previewHoverEvent(e);
			}
		});
		function previewHoverEvent(e){
			var relative={
				x: e.x-posMainImg.x,
				y: e.y-posMainImg.y
			};
			var newPos={
				x: Math.floor(relative.x-0.5*hoverPointerSize.width),
				y: Math.floor(relative.y-0.5*hoverPointerSize.height),
			};
			if(newPos.x<0)newPos.x=0;
			if(newPos.y<0)newPos.y=0;
			if(newPos.x>hoverPointerMax.x)newPos.x=hoverPointerMax.x;
			if(newPos.y>hoverPointerMax.y)newPos.y=hoverPointerMax.y;
			// updateHoverPointer
			updateHoverPointer(newPos);
			newRelative={
				x:newPos.x/mainImg.width,
				y:newPos.y/mainImg.height,
			}
			// updateHoverView
			updateHoverView(newRelative);
		}
		function updateHoverPointer(pos){ // pos{x,y}
			// if(pos.y>0&&pos.y<mainImg.width-hoverPointerSize.width)
			hoverPointer.style.left=pos.x+"px";
			hoverPointer.style.top=pos.y+"px";
		};
		function updateHoverView(relative){ // relative{x,y}
			hoverImage.style.transform="translate(-"+relative.x*1e2+"%,-"+relative.y*1e2+"%)"
		}
		updatePosMainImg();
		updatePosHoverView();
	})();
};

// fix covered input field behaviour (onfocus)
document.addEventListener("click", function (e) {
	var input = $$("#box-search-box input")[0];
	var rect = input.getBoundingClientRect();
	if (e.x > rect.left && e.x < rect.right && e.y > rect.top && e.y < rect.bottom) {
		e.preventDefault();
		input.focus();
	}
});

document.addEventListener("DOMContentLoaded", function () {
	// fix desktop menu on touch displays
	$$(".level-1").map(function (e) {
		var link = $$.query(e, "a")[0];
		var submenu = $$.query(e, "ul")[0];
		e.addEventListener("touchend", function (f) {
			link.style.pointerEvents = "none";
			console.log(link.classList);
			var active = $$.hasClass(submenu, "active");
			$$.toggleClass(submenu, "active");
			if (active) {
				submenu.style.display = "none";
			} else {
				submenu.style.display = "";
			}
		});
	});
	// mobile navigation
	function registerToggle(el) {
		el.addEventListener("click", function (c) {
			if (window.innerWidth < maxWidth) {
				// disable level-1 links
				if ($$.filter(c.target.parentElement.classList, function (e) {
					return e === "level-1";
				}).length > 0) c.preventDefault();
				// toggle display style
				var ctrl = $$.reduce(c.path, function (bool, e) {
					return e.nodeName !== "UL" && bool;
				}, true, function (e) {
					return el === e;
				});
				if (ctrl) {
					var child = el.querySelector("ul");
					var style = child.style.display;
					child.style.display = style === "" ? "block" : "";
				}
			}
		});
	};
	registerToggle(document.querySelector("nav"));
	$$(".level-1").map(function (e) {
		return registerToggle(e);
	});
	// product thumbnail switching
	$$(".more-images-item a").map(function (el) {
		el.addEventListener("mouseover", function (e) {
			$$(".main-img").map(function (e) {
				return e.src = el.href;
			});
		});
		el.addEventListener("click", function (e) {
			e.preventDefault();
			$$(".main-img").map(function (e) {
				return e.src = el.href;
			});
		});
	});
	// litebox
	let liteImg=$$(".lite-container img")[0];
	let liteBox=$$(".litebox")[0];
	$$(".litebox").on("click",(el,e)=>{
	  el.style.display="";
	});
	$$(".hauptbild a img").on("click",(el,e)=>{
	  liteImg.src=el.src;
	  liteBox.style.display="block";
	},true);
	// info to original image main-img
	$$(".main-img").map(e=>e.src=e.src.replace(/\/(info)\//g,"/org/"));
	// HOVER IMAGE LOGIC - dev
	
});
window.addEventListener("load",function(){
	hoverLogic();
});
