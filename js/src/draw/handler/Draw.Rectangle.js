/**
 * @class L.Draw.Rectangle
 * @aka Draw.Rectangle
 * @inherits L.Draw.SimpleShape
 */
L.Draw.Rectangle = L.Draw.SimpleShape.extend({
	statics: {
		TYPE: 'rectangle'
	},

	options: {
		shapeOptions: {
			stroke: true,
			color: '#58a05a',
			weight: 4,
			opacity: 0.5,
			fill: true,
			fillColor: null, //same as color by default
			fillOpacity: 0.2,
			showArea: true,
			clickable: true,
			maxArea: false
		},
		metric: true // Whether to use the metric measurement system or imperial
	},

	// @method initialize(): void
	initialize: function (map, options) {
		// Save the type so super can fire, need to do this as cannot do this.TYPE :(
		this.type = L.Draw.Rectangle.TYPE;

		this._initialLabelText = 'Click and drag to draw domain';

		L.Draw.SimpleShape.prototype.initialize.call(this, map, options);
	},

	_drawShape: function (latlng) {
		if (!this._shape) {
			this._shape = new L.Rectangle(new L.LatLngBounds(this._startLatLng, latlng), this.options.shapeOptions);
			this._map.addLayer(this._shape);
		} else {
			var resize_latlngs = this._shape._defaultShape ? this._shape._defaultShape() : this._shape.getLatLngs();
			area = L.GeometryUtil.geodesicArea(resize_latlngs);
			metric_area = parseFloat(L.GeometryUtil.readableArea(area, this.options.metric).split(" ")[0])
		
			if(metric_area > this.options.shapeOptions.maxArea){
				this.options.shapeOptions.color = '#b25555'
				this._shape.options.color = '#b25555'
			}
			else{
				this.options.shapeOptions.color = '#58a05a'
				this._shape.options.color = '#58a05a'
			}	
			this._shape.setBounds(new L.LatLngBounds(this._startLatLng, latlng));	
		}
	},

	_fireCreatedEvent: function () {
		var rectangle = new L.Rectangle(this._shape.getBounds(), this.options.shapeOptions);
		L.Draw.SimpleShape.prototype._fireCreatedEvent.call(this, rectangle);
	},

	_getTooltipText: function () {
		var tooltipText = L.Draw.SimpleShape.prototype._getTooltipText.call(this),
			shape = this._shape,
			showArea = this.options.showArea,
			latLngs, area, subtext;

		if (shape) {
			latLngs = this._shape._defaultShape ? this._shape._defaultShape() : this._shape.getLatLngs();
			area = L.GeometryUtil.geodesicArea(latLngs);
			subtext = showArea ? L.GeometryUtil.readableArea(area, this.options.metric) : ''
		}

		return {
			text: 'Release mouse to finish drawing domain',
			subtext: subtext
		};
	}
});
