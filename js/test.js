
var urlCloud = ["http://54.80.98.94:8080/geoserver/wms"];
var urlHome = "http://maps.knaaptime.com:8080/geoserver/wms";
var urlArray = ["http://54.80.98.94:8080/geoserver/wms", "http://54.81.60.151:8080/geoserver/wms", "http://maps.knaaptime.com:8080/geoserver/wms"];






var heatmaps = new OpenLayers.Layer.WMS("Heatmaps", urlCloud, {
	layers: ["Employment Density", "Auto Collisions", "Low-wage residence", "Low-wage jobs", "Intersection"],
	transparent: true,
	'sphericalMercator': true,
	format: "image/png"
}, {
	isBaseLayer: false,
	buffer: 0,
	visibility: false,
    singleTile: true, ratio: 1
});

var boundaries = new OpenLayers.Layer.WMS("Policy Areas", urlCloud, {
	layers: ["PFAs", "MD county"],
	transparent: true,
	'sphericalMercator': true,
	format: "image/png"
}, {
	isBaseLayer: false,
	buffer: 0,
	visibility: false
});

var demos = new OpenLayers.Layer.WMS("Demographics", urlCloud, {
	layers: ["White Population", "Hispanic Population", "African American", "Poverty"],
	transparent: true,
	'sphericalMercator': true,
	format: "image/png"
}, {
	isBaseLayer: false,
	buffer: 0,
	visibility: false,
    opacity: 0.6,
    singleTile: true, ratio: 1

});

var employment = new OpenLayers.Layer.WMS("Employment", urlCloud, {
	layers: ["Major Employment Centers", "Firms by Size", "Health Facilities"],
	transparent: true,
	'sphericalMercator': true,
	format: "image/png"
}, {
	isBaseLayer: false,
	buffer: 0,
	visibility: false,
	singleTile: true, ratio: 1
});

var housing = new OpenLayers.Layer.WMS("Housing", urlCloud, {
	layers: ["Property value -- Prince Georges", "Property value -- Montgomery", "Subsidized Housing", "Subsidized Housing to be Expired by 2020"],
	transparent: true,
	'sphericalMercator': true,
	format: "image/png"
}, {
	isBaseLayer: false,
	buffer: 0,
	visibility: false
});

var network = new OpenLayers.Layer.WMS("Transportation", urlCloud, {
	layers: ["Bus", "WMATA routes", "WMATA stations", "MARC routes", "MARC stations", "Purple Line", "Purple Line Stations"],
	transparent: true,
	'sphericalMercator': true,
	format: "image/png"
}, {
	isBaseLayer: false,
	buffer: 0,
	visibility: true,
    singleTile: true, ratio: 1
});

var landuse = new OpenLayers.Layer.WMS("Land Use", urlHome, {
	layers: ["Generalized Zoning", "Parcels by Land Use"],
	transparent: true,
	'sphericalMercator': true,
	format: "image/png"
}, {
	isBaseLayer: false,
	buffer: 0,
	visibility: false,
    singleTile: true, ratio: 1

});

var commuteshed = new OpenLayers.Layer.WMS("Commute Sheds", urlCloud, {
	layers: ["Bethesda before PL", "Bethesda after PL", "Long Branch before PL", "Long Branch after PL", "Takoma Langley before PL",
             "Takoma Langley after PL", "Central Campus before PL", "Central Campus after PL", "M Square before PL", "M Square after PL",
             "New Carrollton before PL", "New Carrollton after PL", "Walk Bike Catchment"],
	transparent: true,
	'sphericalMercator': true,
	format: "image/png"
}, {
	isBaseLayer: false,
	buffer: 0,
	visibility: false,
    opacity: 0.6,
    singleTile: true, ratio: 1
});

var map = new OpenLayers.Map("map", {
	projection: new OpenLayers.Projection("EPSG:900913"),
	allOverlays: false
});
var mapPanel, tree;
Ext.onReady(function() {
	mapPanel = new GeoExt.MapPanel({
		border: true,
		region: "center",
		map: "map",
		zoom: 11,
		map: {
			center: new OpenLayers.LonLat(-76.97, 39.0).transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913")),
			controls: [new OpenLayers.Control.Navigation(), new OpenLayers.Control.Zoom(), new OpenLayers.Control.ScaleLine(), new OpenLayers.Control.TouchNavigation({
				geodesic: true
			})],
			projection: new OpenLayers.Projection("EPSG:900913"),
			displayProjection: new OpenLayers.Projection("EPSG:900913")
		},
		layers: [new OpenLayers.Layer.Google("Google Streets", {
			type: google.maps.MapTypeId.ROADMAP,
			'sphericalMercator': true,
			disableDefaultUI: true,
			isBaseLayer: true
		}), new OpenLayers.Layer.OSM(null, null, {
			isBaseLayer: true
		}), landuse, demos, employment, housing, network, commuteshed, boundaries, heatmaps],
		items: [{
			xtype: "gx_zoomslider",
			aggressive: true,
			vertical: true,
			height: 160,
			title: "Zoom",
			x: 10,
			y: 70
		}]
	});
	var LayerNodeUI = Ext.extend(GeoExt.tree.LayerNodeUI, new GeoExt.tree.TreeNodeUIEventMixin());
	var legend = new GeoExt.LegendPanel({
		title: 'Legend',
		defaults: {
			style: 'padding:5px',
			baseParams: {
				FORMAT: 'image/png',
				LEGEND_OPTIONS: 'forceLabels:on'
			}
		},
		autoScroll: true,
		height: 200,
		frame: true
	});
	var treeConfig = [{
		nodeType: "gx_baselayercontainer",
		isLeaf: true,
		expanded: true,
		loader: {
			param: "LAYERS"
		}
	}, {
		nodeType: "gx_layer",
		layer: "Heatmaps",
		isLeaf: false,
		expanded: true,
		loader: {
			param: "LAYERS"
		}
	}, {
		nodeType: "gx_layer",
		layer: "Policy Areas",
		isLeaf: false,
		expanded: false,
		loader: {
			param: "LAYERS"
		}
	}, {
		nodeType: "gx_layer",
		layer: "Employment",
		isLeaf: false,
		expanded: false,
		loader: {
			param: "LAYERS"
		}
	}, {
		nodeType: "gx_layer",
		layer: "Housing",
		isLeaf: false,
		expanded: false,
		loader: {
			param: "LAYERS"
		}
	}, {
		nodeType: "gx_layer",
		layer: "Demographics",
		isLeaf: false,
		expanded: false,
		loader: {
			param: "LAYERS"
		}
	},
        {
		nodeType: "gx_layer",
		layer: "Transportation",
		isLeaf: false,
		expanded: true,
		loader: {
			param: "LAYERS"
		}
	}, {
         nodeType: "gx_layer",
         layer: "Commute Sheds",
         isLeaf: false,
         loader: {
            param: "LAYERS"
        }
    }, {
		 nodeType: "gx_layer",
		 layer: "Land Use",
		 isLeaf: false,
		 expanded: false,
 		 loader: {
			 param: "LAYERS"
		}
	}];
	tree = new Ext.tree.TreePanel({
		plugins: [{
			ptype: "gx_treenodecomponent"
		}],
		border: true,
		region: "west",
		title: "Layers",
		width: 250,
		split: true,
		collapsible: false,
		useArrows: true,
		autoScroll: true,
		autoShow: true,
		containerScroll: true,
		loader: new Ext.tree.TreeLoader({
			applyLoader: false,
			uiProviders: {
				"layernodeui": LayerNodeUI
			}
		}),
		root: {
			nodeType: "async",
			children: treeConfig
		},
		rootVisible: false,
		lines: false,
		enableDD: true
	});
	new Ext.Container({
		layout: "fit",
        renderTo:"d1",
        height: 900,
		hideBorders: true,
		items: {
			layout: "border",
			deferredRender: false,
			items: [mapPanel, tree,
			{
				title: 'Help & Description',
				contentEl: "desc",
				region: "east",
				cmargins: '5 5 5 5',
				titleCollapse: true,
				bodyStyle: {
					"padding": "5px"
				},
				collapsible: true,
				collapsed: true,
				containerScroll: true,
				autoScroll: true,
				split: true,
				width: 300,
				animFloat: true,
				autoHide: true
			}, {
				region: "south",
				xtype: 'tabpanel',
				title: "Tools",
				activeTab: 0,
                
                contentEl: "sliders",
				
				bodyStyle: {
					"padding": "5px"
				},
				collapsible: true,
				collapsed: false,
				containerScroll: true,
				autoScroll: false,
				cmargins: '5 5 5 5',
				split: true,
				height: 200
                
			}]
		}
	});
    var empSlider = new GeoExt.LayerOpacitySlider({
            width: 200,
            layer: employment,
            agressive: true,
            vertical: true,
            height: 150,
            renderTo: "emp",
                
});
            

            var transSlider = new GeoExt.LayerOpacitySlider({
            width: 200,
            layer: network,
            agressive: true,
            vertical: true,
                height: 150,
                renderTo: "trans",
                
});

	Ext.util.CSS.swapStyleSheet("theme", "../lib/ext/resources/css/xtheme-gray.css")
});
