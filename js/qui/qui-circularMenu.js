/*! qui.circularMenu v0.1.3 // jlreymendez © 01-22-2012 */
/*! Licensed MIT: https://github.com/jlreymendez/qui/blob/master/License.txt */

/* @requires
 *		jQuery, jQuery.ui.widget, jQuery.ui.position, Hogan, Math
 */
/* @usage
 *		Call circularMenu function on the element that will hold the circular context menu functionality
 */
/* @options
 *		baseClass				Class that will be added to the circularMenu html element, it will also be prepended to buttons.
 *		buttons					Array of button objects that will be added to the circular menu on creation.
 *			id						Id to be added to the button html element when using default markup.
 *			htmlClass		    	Class that will be added to the button html element when using default markup.
 *			text					Inner html for the markup when using default markup.
 *			[optionals]				More values can be passed and those can be use with custom markups.
 *		buttonsOptions			Options for buttons to be created.
 *			markup					String holding the hogan template to be created for each button.
 *			offset					Position away from the center of the circular menu.
 *			closeOnClick			Close circular menu on clicking a button.
 *			singleEventHandler 		True if button click triggers single event, false if trigger appends button number.
 *		radius					Radius of the circular menu.
 *		target					Target element that will be transformed in the circularMenu.
 */
(function ($, hogan) {

	// check dependencies
	if ((!$) || (!$.widget) || (!hogan) || (!Math)) {
		return false;
	}

	$.widget("qui.circularMenu", {

		// options
		options: {
			baseClass: "qui-circularMenu",
			buttons: [],
			buttonsOptions: {
				markup: "<span id='{{id}}' class='{{htmlClass}}'>{{text}}</span>",
				offset: 80,
				closeOnClick: false,
				singleEventHandler: true
			},
			radius: 100,
			target: ""
		},

		// constructor
		_create: function() {
			/* if no target was found do nothing */
			this.$target = $(this.options.target).eq(0);
			if (!this.$target.length) {
				return this;
			}

			/* hide during creation */
			this.$target.hide();

			/* init state */
			this.isOpen = false;
			this.insideClick = false;
			this.inAnimation = false;
			this.diameter = this.options.radius * 2;

			/* prepare styles */
			this._menuStyling();

			/* create buttons */
			this._buttonsCreation();

			/* events */
			this._on({
				contextmenu: this._evContextMenu, // open event
				click: this._evClick
			});
			this._on( this.$buttons, { click: this._evButtonClick });

			/* show after finishing */
			this.$target.show();
		},

		/* private methods */
		_buttonsCreation: function() {
			var $button,
				buttonTmpl,
				buttonClass,
				context,
				callback,
				dummyCallback = function(e) { console.log(e.target.innerHTML); return this; },
				radiansDiff;

			// init variables
			buttonTmpl = hogan.compile(this.options.buttonsOptions.markup);
			buttonClass = this.options.baseClass ? this.options.baseClass + "-button" : "";
			radiansDiff = Math.PI * 2 / this.options.buttons.length;

			// init state
			this.$buttons = $();

			for( var i = 0; i < this.options.buttons.length; i++ ) {

				// html creation
				$button =  $( buttonTmpl.render( this.options.buttons[i] ) );
				this.$target.append( $button );

				// styling
				$button.addClass(buttonClass)
					.css({
							'position': 'absolute',
							'top': this.options.radius - this.options.buttonsOptions.offset * Math.cos(radiansDiff * i),
							'left': this.options.radius - this.options.buttonsOptions.offset * Math.sin(radiansDiff * i)
						});

				// add button to state
				this.$buttons = this.$buttons.add($button);

				// add button data
				$button.data("qui-circularMenu-button", i + 1);
			}

			// hide buttons
			this.$buttons.hide();
		},

		_close: function() {
			// don't do anything while animation is in progress
			if (this.inAnimation) {
				return this;
			}

			// update state
			this.inAnimation = true;

			// animate
			this.$buttons.hide();
			this.$target.animate(
				{ 'top': this.$target.position().top + this.options.radius,  'left': this.$target.position().left + this.options.radius, 'height': 0, 'width': 0 , 'z-index': 2},
				{ complete: $.proxy( this._closeComplete, this ) }
			);
		},

		_closeComplete: function() {
			// update state
			this.inAnimation = false;
			this.isOpen = false;
		},

		_menuStyling: function(){
			// initial styles
			this.element.css({ 'position': 'relative' });
			this.$target
				.css({ 'position': 'absolute', 'border-radius': this.options.radius, 'width': 0, 'height': 0 })
				.addClass( this.options.baseClass );
		},

		_open: function(e) {
			// don't do anything while animation is in progress
			if (this.inAnimation) {
				return this;
			}

			var position;

			// update state
			this.inAnimation = true;

			// Set size so position is calculated correctly
			this.$target.css({  visibility: 'hidden', width: this.diameter, height: this.diameter });

			this.$target.position({
				my: 'center',
				of: e,
				collision: "fit"
			});

			// reset size and animate
			position = this.$target.position();
			this.$target.css({ visibility: 'visible', top: position.top + this.options.radius, left: position.left + this.options.radius, width: 0, height: 0 });
			this.$target.animate(
				{ 'top': position.top, 'left': position.left, 'width': this.options.radius * 2, 'height': this.options.radius * 2 },
				{ complete: $.proxy( this._openComplete, this ) }
			);
		},

		_openComplete: function() {
			// update state
			this.inAnimation = false;
			this.isOpen = true;

			// show buttons
			this.$buttons.show();
		},

		/* event handlers */
		_evButtonClick: function(e) {
			var $target = $(e.target),
				buttonNr = $target.data("qui-circularMenu-button"),
				evType = "button" +
					(this.options.buttonsOptions.singleEventHandler ? "" : buttonNr) +
					"clicked";

			this._trigger(evType, e, { button: buttonNr });
		},

		_evClick: function (e) {
			if ((!this.isOpen) || (this.insideClick)) {
				// update state
				this.insideClick = false;

				return false;
			}

			this._close(e);
		},

		_evContextMenu: function (e) {
			e.preventDefault();

			if (this.isOpen) {
				this._close(e);
			} else {
				this._open(e);
			}
		}
	});

	$.widget.bridge("circularMenu", $.qui.circularMenu);

})(jQuery, Hogan);