describe("CanvasCards", function() {
	var c = window.CanvasCards;

	describe('CanvasCards', function() {
	
		it("should have one card in allCards", function() {
			var card = c.create();
			expect(c.allCards.length).toBe(1);
			card.destroy();
		});

		it("should have no cards in allCards after all destroy", function() {
			var card1 = c.create();
			var card2 = c.create();
			c.destroy();
			expect(c.allCards.length).toBe(0);
		});

		it("should remove the correct card on single destroy", function() {
			c.create({prop: 1});
			c.create({prop: 2});
			var card3 = c.create({prop: 5});
			c.create({prop: 1});
			card3.destroy();

			var total = 0;
			c.allCards.forEach(function(card){
				total += card.options.prop;
			});
			expect(total).toBe(4);
			c.destroy();
		});
	});

	describe('Card', function() {
		it("should create a dom element for the canvas", function() {
			var card = c.create();
			expect(document.querySelectorAll('canvas').length).toBe(1);
			card.destroy();
		});
		it("should return a string from card.toUri", function() {
			var card = c.create();
			card.toUri(function(image) {
				expect(typeof image).toBe('string');
			});
			card.destroy();
		});

		it("should have no canvas el after all destroy", function() {
			var card1 = c.create();
			var card2 = c.create();
			c.destroy();
			expect(document.querySelectorAll('canvas').length).toBe(0);
		});

		
		it("should have a guid for each card", function() {
			expect(c.create()._id).not.toBe(c.create()._id);
			c.destroy();
		});
	});

	describe('Layers', function() {
		it("should be able to add a empty layer", function() {
			var card = c.create();
			card.addLayer();
			card.toUri(function() {
				expect(card.layers.length).toBe(1);
				c.destroy();
			});
		});
		it("should be able to add a image layer", function() {
			var card = c.create();
			card.addLayer({ image: '../images/background.png' });

			expect(card.layers.length).toBe(1);

			c.destroy();
		});

		it("rendering should cache the image", function(done){
			var card = c.create();
			card.addLayer({ image: '../images/background.png' });
			card.render(function() {
				expect(c.allImages['../images/background.png']).toBeTruthy();
				c.destroy();
				done();
			});
		});

		it("should not throw an error when a bad image is passed, should still render", function(done){
			var card = c.create();
			card.addLayer({ image: '../images/invalid_img.png' });
			card.render(function(data) {
				expect(c.allImages['../images/invalid_img.png']).toBeFalsy();
				c.destroy();
				done();
			});
		});
	});

});