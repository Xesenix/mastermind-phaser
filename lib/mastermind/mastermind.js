'use strict';
var _ = require('lodash');

function Engine() {
	this._target = [];
}

Engine.prototype.setTarget = function(target) {
	this._target = target;
};

Engine.prototype.evaluate = function(tested) {
	var i;
	var result = {
		hits: 0,
		miss: 0,
		wrong: 0
	};

	var remebered = {};

	for (i = 0; i < this._target.length; i++)
	{
		if (this._target[i] === tested[i])
		{
			result.hits++;
		}
		else
		{
			if (typeof(remebered[tested[i]]) === 'undefined')
			{
				remebered[tested[i]] = 0;
			}

			remebered[tested[i]] ++;
		}
	}

	for (i = 0; i < this._target.length; i++)
	{
		if (this._target[i] !== tested[i] && remebered[this._target[i]] > 0)
		{
			result.miss++;
			remebered[this._target[i]] --;
		}
	}

	result.wrong = this._target.length - result.hits - result.miss;

	return result;
};

Engine.prototype.generate = function(length, values) {
	this._target = _.times(length, _.bind(_.random, this, 0, values - 1, false));

	return this._target;
};

module.exports = Engine;
