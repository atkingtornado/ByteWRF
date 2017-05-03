$(document).ready(function(){
	//Initialize map
	var basemap = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', {
	    maxZoom: 18, 
	    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>'
	})

	var map = L.map('mapid', {
	    zoomControl: false,
	    center: [40.31304, -98.78906],
	    maxBounds: [[-85,-180.0],[85,180.0]],
	    minZoom: 3,
	    maxZoom: 10,
	    zoom: 5,
	    layers: [basemap],
	    attributionControl: false,
	    preferCanvas: true,
	    fadeAnimation: true,
	});

	// FeatureGroup is to store editable layers
	var drawnItems = new L.FeatureGroup();
	map.addLayer(drawnItems);

	var drawControl = new L.Control.Draw({
	 edit: {
	    featureGroup: drawnItems,
	    selectedPathOptions: {
	    	maintainColor: true
	    }
	 },
	 draw: {
	    polygon: false,
     	marker: false,
     	polyline: false,
     	circle: false,
     	rectangle: {
			shapeOptions: {
				maxArea: 10000000 
			}
     	}
	 }
	});
	map.addControl(drawControl);

	 map.on(L.Draw.Event.CREATED, function (event) {
        var layer = event.layer;

        drawnItems.addLayer(layer);
    });

	 var drawing = false
	 $('#draw').on('click',function(){
	 	drawControl._toolbars.draw._modes.rectangle.handler.enable()
	 	 drawing = true
	 })

	 var editing = false
	 $('#edit').on('click',function(){
	 	editing = true
	 	drawControl._toolbars.edit._modes.edit.handler.enable()
 		$('#edit').hide()
 		$('#domain_confirm').hide()
 		$('#save').fadeIn('fast')

 		 $('.dropdown-header').each(function(i,obj){
 		 	if(!$(obj).parent().hasClass('disabled') && i!=0){
 		 		$(obj).parent().addClass('disabled')
 		 	}
 		 })

	 })

	 $('#save').on('click',function(){
	 	// drawControl._toolbars.edit._modes.edit.handler.save()
	 	drawControl._toolbars.edit._modes.edit.handler.disable()
	 	$('#save').hide()
	 	$('#edit').fadeIn('fast')

	 	var domain_color = drawnItems.getLayers()[0].options.color
	 	if (domain_color == '#58a05a'){
	 		$('#domain_confirm').fadeIn('fast')
	 	}

	 });

	 $('#mapid').on('click',function(){
	 	if(drawing){
	 		drawing = false
	 		$('#draw').hide()
	 		$('#edit').fadeIn('fast')

	 		var domain_color = drawnItems.getLayers()[0].options.color
		 	if (domain_color == '#58a05a'){
		 		$('#domain_confirm').fadeIn('fast')
		 	}
	 	}
	 })

	 $('#domain_confirm').on('click',function(){
	 	$('#step2-dropdown').removeClass('disabled')
	 	$($('#step2-dropdown').children()[0]).trigger('click')
	 })

	$('.dropdown-header').click(function(){

		if(!$(this).parent().hasClass('disabled')){
	        $(this).children('.dropdown-arrow').toggleClass('rotated');
	        $(this).next().slideToggle('fast')

	        var clicked_id = $(this).parent().attr('id')

	        $('.dropdown-header').each(function(i,obj){
	        	if($(obj).parent().attr('id') != clicked_id){
	        		if($(obj).children('.dropdown-arrow').hasClass('rotated')){
	        			$(obj).children('.dropdown-arrow').toggleClass('rotated');
	        			$(obj).next().slideToggle('fast')
	        		}
	        	}
	        })
	    }
    });

	var $resolution = $('.resolution-select').on('touchstart click',function() {
	    $resolution.removeClass('resolution-selected');
	    $(this).addClass('resolution-selected');
	});

});