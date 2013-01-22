/*! qui.circularMenu v0.1.0 // jlreymendez © 01-21-2013 */
/*! Licensed MIT: https://github.com/jlreymendez/qui/blob/master/License.txt */

/* @requires
 *		jQuery, jQuery.ui.widget, jQuery.ui.position, Hogan
 */
/* @usage
 *		Call rateIt function on the element you want to wrap your stars on.
 */
/* @options 				All of the following are optional
 *		baseClass			Class that will be added to the rateIt html container element, it will also be prepended to stars.
 *		stars				Array of stars objects that will be added to the rateIt on creation.
 *			id					Id to be added to the star html element when using default markup.
 *			class				Class that will be added to the button html element when using default markup.
 *			text				Inner html for the markup when using default markup.
 *			[optionals]			More values can be passed and those can be use with custom markups.
 *		starsOptions		Options for buttons to be created.
 *			markup				String holding the hogan template to be created for each button.
 *		hoverable 			Boolean indicating if hover should be animated or not.
 *		rated				Callback function for rated event, can be bind outside by using rateitrated event. Parameters are e and data.
 */

(function($, hogan) {

	// check dependencies
	if ((!$) || (!$.widget) || (!hogan)) {
		return false;
	}

	$.widget("qui.rateIt", {

		options: {
			baseClass: "",
			range: 5,
			rate: 0,
			stars: [],
			starsOptions: {
				markup: "<span class='{{htmlClass}}'>{{text}}</span>",
			},
			hoverable: true
		},

		/* constructor */
		_create: function() {
			/* init state */
			this.options.rate = Math.min(
							Math.max(0, this.options.rate),
							Math.min(this.options.rate, this.options.range)
						);
			this.baseClass = this.options.baseClass ? this.options.baseClass : "qui-rateIt"

			/* markup manipulation */
			this.element.addClass(this.baseClass);
			this._starsCreation();

			/* event binding */
			this._on( this.$stars, { click: this._evStarClicked });

			// set hoverable events
			if (this.options.hoverable) {
				// mouseleave to container to avoid flickering
				this._on({  mouseleave: this._evStarMouseLeave });
				// mouseenter on star
				this._on( this.$stars, { mouseenter: this._evStarMouseEnter, });
			}
		},

		/* private methods */
		_setHoverableEvents: function() {
		},

		_setOption: function(key, value) {
			switch (key) {
				case "rate":
					this._setStateToStars(value);
					this._trigger("rated", null, { rate: value });
					break;
			}

			this._super(key, value);
		},

		_setStateToStars: function (value) {
			for (var i = 0; i < this.options.range; i++) {
				if (i + 1 > value) {
					this.$stars.eq(i).removeClass("qui-state-on");
				} else {
					this.$stars.eq(i).addClass("qui-state-on");
				}
			}
		},

		_starsCreation: function() {
			var $star,
				$stars,
				starTmpl,
				starClass;

			// Preparing templates
			starTmpl = hogan.compile(this.options.starsOptions.markup);
			starClass = this.baseClass + "star";

			this.$stars = $();

			for (var i = 0; i < this.options.range; i++) {
				$star = $( starTmpl.render(this.options.stars[i]) );

				// classes
				starClass = this.baseClass + "-star";
				starClass += ((i + 1) <= this.options.rate) ? " qui-state-on" : "";

				$star.addClass(starClass);

				// data
				$star.data("qui-rateIt-starValue", i + 1);

				this.$stars = this.$stars.add($star);
			}

			// add to DOM
			this.element.append(this.$stars);
		},

		/* event handlers */
		_evStarClicked: function(e) {
			var $target = $(e.target);

			// update rate
			this.options.rate = $target.data("qui-rateIt-starValue");

			// set states to stars
			this._setStateToStars(this.options.rate);

			// triger event outside of the widget
			this._trigger("rated", e, { rate: this.options.rate });
		},

		_evStarMouseEnter: function(e) {
			// set states to stars
			this._setStateToStars( $(e.target).data("qui-rateIt-starValue") );
		},

		_evStarMouseLeave: function(e) {
			// set states to stars
			this._setStateToStars(this.options.rate);
		}

		/* public methods */
	});

	$.widget.bridge("rateIt", $.qui.rateIt);

})(jQuery, Hogan);