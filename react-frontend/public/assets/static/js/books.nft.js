function insertAfter(referenceNode, newNode) {
	referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

var added = false;

function books_nft_handoff(ref, datamine, contractid, network, tokenid){
	

	//var url = "nft/marketplace/"+network+"/"+contractid+"/"+tokenid;
	//var url = "https://opensea.io/assets/matic/"+contractid+"/"+tokenid+"/";

	// This connects the mouseclick to the popup window.
	ref.setAttribute("data-toggle", "modal");
	ref.setAttribute("data-target", "#myModal");

	ref.onmouseover = function(){
	        $("#myModal").on('show.bs.modal', function(){
		//console.log("books_nft_handoff: show.bs.modal: ZETA");
                //$("#videoContainer").attr('src', url);
                //$("#videoContainer").innerHTML = '<embed src="'+url+'" width="100%" height="100%" type="text/html">';
        	});
	};

	if(false){
		var addedHtml = '<iframe seemless style="border: none;" src="/art?type=bookmark&curserial_num=' + tokenid +'&datamine=' + datamine + '" width = "307" height = "160"> </iframe>';
		

		var newNode = document.createElement("div");
		newNode.innerHTML = addedHtml;
		newNode.className = "box";

		insertAfter(ref, newNode);

		document.addEventListener('mousemove', function(e) {
  			let body = document.querySelector('body');
  			let circle = newNode;
  			let left = e.offsetX;
  			let top = e.offsetY;
  			circle.style.left = left + 'px';
  			circle.style.top = top + 'px';
		});
		added = true;
	}

	ref.onclick = function(){
		
		//window.open(url, '_blank');
		//

		

		$("#myModal").on('shown.bs.modal', function () {
			//console.log("books_nft_handoff: shown.bs.modal: DELTA");
		});

		$("#myModal").on('show.bs.modal', function(){

			
			$("#testresult").empty().text("The Great Library Says...");
			$("#pricespan").empty().text(getpriceFromMoralis(contractid, tokenid));



			
			$("#tokenspan").empty().text(tokenid);
			$("#contractspan").empty().text(contractid);
			//$("#dataminespan").empty().text(datamine);
			
		});


	}

	$("#myModal").on('show.bs.modal', function(){
		
		//$("#videoContainer").attr('src', url);
                //$("#videoContainer").innerHTML = '<embed src="'+url+'" width="100%" height="100%" type="text/html">';
    	});


}

