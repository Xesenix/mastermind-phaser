'use strict';
var _ = require('lodash');
var Mastermind = require('../component/mastermind.js');

function Play() {}

Play.prototype = {
	create: function() {
		this.mastermind = new Mastermind({
			posX: 300,
			posY: 20,
			values: [{tint: 0xff0000}, {tint: 0x00ff00}, {tint: 0x0000ff}],
			columns: 5,
			onWin: _.bind(this.clickListener, this)
		}, this);
		//this.commitButton = this.game.make.button(0, 0, 'tile', this.onCommit, this, 2, 1, 0);
		this.time.desiredFps = 30;
		
		//this.sprite = this.game.add.sprite(this.game.width / 5, this.game.height / 5, 'phaser-logo');
		//this.sprite.inputEnabled = true;

		//this.sprite.events.onInputDown.add(this.clickListener, this);
		
		var style = { font: '12px Arial', fill: '#ffffff', align: 'left'};
		this.time.advancedTiming = true;
		
		this.fpsText = this.game.add.text(5, this.game.height, 'FPS', style);
		this.fpsText.anchor.setTo(0, 1);
	},
	update: function() {
		this.fpsText.text = "FPS:" + this.time.fps;
	},
	clickListener: function() {
		this.game.state.start('gameover');
	}
};

module.exports = Play;