/*! Demo code for qui.js */

$(document).ready( function () {

	/* qui.circularMenu demo code */
	$("#context-container").circularMenu({
		target: "#context-menu",
		buttons: [ 
			{ id: "button-1", htmlClass:"oddButton", text:"1", callback: circularMenuButtonHandler, context: $("#context-container")},
			{ id: "button-2", htmlClass:"evenButton", text:"2", callback: circularMenuButtonHandler, context: $("#context-container")  },
			{ id: "button-3", htmlClass:"oddButton", text:"3", callback: circularMenuButtonHandler, context: $("#context-container") },
			{ id: "button-4", htmlClass:"evenButton", text:"4", callback: circularMenuButtonHandler, context: $("#context-container") },
			{ id: "button-5", htmlClass:"oddButton", text:"5", callback: circularMenuButtonHandler, context: $("#context-container") }
		]
	});

	function circularMenuButtonHandler (e) {
		this.children(".circularMenu-content").append(e.target.innerHTML);
	}

	/* end qui.circularMenu */
});