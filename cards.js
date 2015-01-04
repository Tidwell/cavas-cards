(function(weindow, document) {
	var allCards = [];

	var allImages = {};

	function Layer(options) {
		var defaults = {
			type: 'image',
			image: '',
			x: 0,
			y: 0
		};
		this.options = mergeOptions(defaults, options);

		return this;
	}

	//Constructor
	function Card(options) {
		//setup options
		var defaults = {
			callback: function() {},
			width: 250,
			height: 350
		};
		this.options = mergeOptions(defaults, options);
		this._id = guid();
		this.layers = [];

		this.canvas = createCanvas(this);
		this.ctx = this.canvas.getContext('2d');

		this.options.callback(this);
		return this;
	}

	//generates the base64-encoded version of the card
	Card.prototype.toUri = function(callback) {
		var self = this;
		this.render(function() {
			callback(self.canvas.toDataURL());
		});
	};

	Card.prototype.addLayer = function(options) {
		var l = new Layer(options);
		this.layers.push(l);

		return l;
	};

	Card.prototype.destroy = function() {
		removeCanvas(this.canvas);
		removeFromAll(this);
		return true;
	};

	Card.prototype.render = function(callback) {
		var self = this;
		
		this.ctx.clearRect (0, 0, this.options.width, this.options.height);

		var images = [];
		self.layers.forEach(function(layer) {
			if (layer.options.type === 'image') {
				images.push(layer.options.image);
			}
		});
		loadImages(images, function() {
			renderCard(self, callback);
		});
	};

	/* Private functions */

	function loadImages(images, callback) {
		var checkAll = function() {
			var loaded = true;
			images.forEach(function(image) {
				if (typeof allImages[image] === 'undefined') { loaded = false; }
			});
			if (loaded) { callback(); }
		};
		images.forEach(function(image){
			if (!allImages[image]) {
				var img = new Image();
				img.src = image;
				img.onload = function() {
					allImages[image] = img;
					checkAll();
				};
				img.onerror = function() {
					allImages[image] = null;
					checkAll();
				};
			}
		});
		checkAll();
	}

	function renderCard(card, callback) {
		//show each layer
		card.layers.forEach(function(layer){
			switch (layer.options.type) {
				case 'image':
					var img = allImages[layer.options.image];
					if (img) {
						card.ctx.drawImage(img, layer.options.x, layer.options.y);
					}
				break;

			}
		});
		if (callback) {
			callback();
		}
	}

	//creates a canvas element
	function createCanvas(card) {
		var canvas = document.createElement('canvas');
		canvas.width = card.options.width;
		canvas.height = card.options.height;
		document.querySelectorAll('script')[0].parentNode.appendChild(canvas);

		return canvas;
	}

	function removeCanvas(canvas) {
		return canvas.parentNode.removeChild(canvas);
	}

	var mergeOptions = function() {
		var obj = {};
		var i = 0;
		var il = arguments.length;
		var key;

		for (; i < il; i++) {
			for (key in arguments[i]) {
				if (arguments[i].hasOwnProperty(key)) {
					obj[key] = arguments[i][key];
				}
			}
		}

		return obj;
	};
	function guid() {
		function s4() {
			return Math.floor((1 + Math.random()) * 0x10000)
				.toString(16)
				.substring(1);
		}
		return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
			s4() + '-' + s4() + s4() + s4();
	}

	//called by the destroy method to remove the card
	//from the internal list of all cards
	function removeFromAll(card) {
		var toRemove;
		allCards.forEach(function(c, i) {
			if (c._id === card._id) {
				toRemove = i;
			}
		});
		allCards.splice(toRemove, 1);
	}


	function create(options) {
		var c = new Card(options);
		allCards.push(c);
		return c;
	}

	function destroy() {
		//iterate over each card using a for loop since allCards is modified every time a card is destroyed
		var cardCount = allCards.length;
		for (var i = 0; i < cardCount; i++) {
			allCards[0].destroy();
		}
		return true;
	}

	var exports = {
		create: create,
		destroy: destroy,

		allCards: allCards,
		allImages: allImages,
		Card: Card
	};
	window.CanvasCards = window.CanvasCards || exports;
}(window, document));