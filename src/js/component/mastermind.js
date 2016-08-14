'use strict';
var _ = require('lodash');
var MastermindEngine = require('../../../lib/mastermind/mastermind.js');

function Mastermind(props, game) {
	this.game = game;
	
	this.props = _.extend({
		columns: 4,
		values: [{tint: 0xff0000}, {tint: 0x00ff00}, {tint: 0x0000ff}],
		posX: 0,
		posY: 0
	}, props);
	
	this.state = {
		rows: []
	};
	
	this.create();
}

function Row(props, game) {
	this.game = game;
	
	this.props = _.extend({
		columns: 4,
		posX: 0,
		posY: 0
	}, props);
	
	this.state = {
		sealed: false,
		slots: []
	};
	
	this.create();
}

function Slot(props, game) {
	this.game = game;
	
	this.props = _.extend({
		posX: 0,
		posY: 0
	}, props);
	
	this.state = {
		sealed: false,
		value: 0
	};
	
	this.create();
}

function Result(props, game) {
	this.game = game;
	
	this.props = _.extend({
		posX: 0,
		posY: 0
	}, props);
	
	this.state = {
		hits: 0,
		miss: 0
	};
	
	this.create();
}

Mastermind.prototype = {
	create: function() {
		this.state.engine = new MastermindEngine();
		this.state.engine.generate(this.props.columns, this.props.values.length);
		
		this.state.rows = _.map(_.range(0, 1), _.bind(this.buildRow, this));
	},
	buildRow: function(row) {
		return new Row(_.extend(_.clone(this.props), {
			posY: 32 * row + this.props.posY,
			onRowCommit: _.bind(this.commitRow, this),
			engine: this.state.engine
		}), this.game);
	},
	commitRow: function(values, result) {
		if (result.hits !== this.props.columns)
		{
			_(this.state.value).push(values).commit();
			_(this.state.rows).push(this.buildRow(this.state.rows.length)).commit();
		}
		else
		{
			this.props.onWin(values);
		}
	}
};

Row.prototype = {
	create: function() {
		this.state.slots = _.map(_.range(0, this.props.columns), _.bind(this.buildSlot, this));
		
		this.commitButton = this.game.add.button(this.props.posX + 32 * this.props.columns, this.props.posY, 'tile', _.bind(this.onCommit, this));
	},
	buildSlot: function(column) {
		return new Slot(_.extend(_.clone(this.props), {
			id: column,
			posX: 32 * column + this.props.posX
		}), this.game); 
	},
	onCommit: function() {
		var result;
		
		if (!this.state.sealed)
		{
			var values = _.map(this.state.slots, this.collectSlotDataAndSeal);
			
			this.state.sealed = true;
			
			result = this.props.engine.evaluate(values);
			
			this.props.onRowCommit(values, result);
			
			this.result = new Result({
				posX: this.props.posX + 32 * this.props.columns, 
				posY: this.props.posY
			}, this.game);
			
			this.commitButton.destroy();
			
			this.result.state.hits = result.hits;
			this.result.state.miss = result.miss;
			this.result.update();
		}
	},
	collectSlotDataAndSeal: function(slot) {
		slot.state.sealed = true;
		
		return slot.state.value;
	}
};

Slot.prototype = {
	create: function() {
		this.button = this.game.add.button(this.props.posX, this.props.posY, 'tile', _.bind(this.onClick, this));
		this.button.tint = this.props.values[this.state.value].tint;
	},
	onClick: function() {
		if (!this.state.sealed)
		{
			this.state.value = (this.state.value + 1) % this.props.values.length;
			this.button.tint = this.props.values[this.state.value].tint;
		}
	}
};

Result.prototype = {
	create: function() {
		this.update();
	},
	update: function() {
		_.call(this.missIcons, 'destroy');
		_.call(this.hitsIcons, 'destroy');
		this.missIcons = _.map(_.range(0, this.state.miss), _.bind(this.buildDot, this, this.props.posX, this.props.posY, 'dot-dark'));
		this.hitsIcons = _.map(_.range(0, this.state.hits), _.bind(this.buildDot, this, this.props.posX, this.props.posY + 16, 'dot-white'));
		
		return this;
	},
	buildDot: function(posX, posY, spriteName, index) {
		return this.game.add.sprite(posX + index * 16, posY, spriteName);
	}
};

module.exports = Mastermind;