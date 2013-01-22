/*! Demo code for qui.js */

$(document).ready( function () {

	/* qui.circularMenu demo code */
	var $contextContainer = $("#context-container")
			.circularMenu({
				target: "#context-menu",
				buttons: [
					{ id: "button-1", htmlClass:"oddButton", text:"1" },
					{ id: "button-2", htmlClass:"evenButton", text:"2" },
					{ id: "button-3", htmlClass:"oddButton", text:"3" },
					{ id: "button-4", htmlClass:"evenButton", text:"4" },
					{ id: "button-5", htmlClass:"oddButton", text:"5" }
				]
			})
			.on("circularmenubuttonclicked", circularMenuButtonHandler);

	function circularMenuButtonHandler (e, data) {
		$contextContainer.children(".circularMenu-content").append(data.button);
	}

	/* end qui.circularMenu */

	/* qui.rateIt demo code */
	var $rateItPoints = $("#rateIt-console").find("span"),
		$rateIt = $("#rateIt-wrapper");

	// widget creation
	$rateIt
		.rateIt({ range: 10, rate: parseInt($rateItPoints.text(), 10), hoverable: true })
		.on("rateitrated", writeToRateItConsole);

	// change widget value
	$("#rateIt-clear").on("click", function (e) {
		$rateIt.rateIt("option", "rate", 0);
	});


	function writeToRateItConsole (e, data) {
		$rateItPoints.text(data.rate);
	}

	/* end qui.rateIt demo code */
});