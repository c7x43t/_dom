$$(".hero-feature").on("mouseenter",e=>{
	function getImgSize(imgSrc, callback) {
		var newImg = new Image();
		newImg.onload = function () {
			if (callback != undefined)
				callback({width: newImg.width, height: newImg.height})
		}
		newImg.src = imgSrc;
	}
	//onhover:
	//var e=$$(".hero-feature")[2];
	var img=$$.find(e,"img")[0];
	var src=img.src;
	var srcInfo=src.replace(/\/(thumb)\//g,"/info/");
	getImgSize(srcInfo,size=>{
		var imgWidth=$$.style(e).width;
		imgWidth=Math.round(parseFloat(imgWidth));
		var imgHeight=size.height*imgWidth/size.width;
		var imgPreview=$$(".listing-img-preview")[0];
		// set size
		imgPreview.width=imgWidth;
		imgPreview.height=imgHeight;
		// calc pos
		var ePos=e.getBoundingClientRect();
		var imgPos=img.getBoundingClientRect();
		var top=Math.round(imgPos.bottom-imgHeight);//-window.pageYOffset);
		var left=Math.round(ePos.left);
		console.log(left);
		//console.log({top:top,left:left,bottom:ePos.bottom,imgHeight:imgHeight});;
		// set pos
		imgPreview.style.top=top+"px";
		imgPreview.style.left=left+"px";
		imgPreview.style.display="block";
		// set src
		imgPreview.src=srcInfo;
})
$$(".listing-img-preview")[0].getBoundingClientRect();
})
$$(".hero-feature").on("mouseleave",e=>{
	var imgPreview=$$(".listing-img-preview")[0];
	imgPreview.style.display="";
})
