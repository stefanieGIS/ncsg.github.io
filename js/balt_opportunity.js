var urlArray = ["http://maps.knaaptime.com:8080/geoserver/wms", "http://test.knaaptime.com:8080/geoserver/wms"];
var urlCloud ="http://aws.knaaptime.com:8080/geoserver/wms";
var aws = ["http://aws.knaaptime.com:8080/geoserver/wms", "http://aws.knaaptime.com:8080/geoserver/wms"];

var housing = new OpenLayers.Layer.WMS("Subsidized Housing", urlCloud, {
	layers: ["Subsidized Housing"],
	transparent: true,
	'sphericalMercator': true,
	format: "image/png"
}, {
	isBaseLayer: false,
	opacity: 0.7,
	buffer: 0,
	visibility: false,
    singleTile: true, ratio: 1
});


var poverty = new OpenLayers.Layer.WMS("Race and Poverty", urlCloud, {
	layers: ["RCAP-ECAP", "Moderate Poverty Increase 2000-2010", "Black 15-50 (B15-50)", "White 30-70 (W30-70)", "B15-50 and W30-70",
             "White 50-80 (W15-80)", "B15-50 and W15-80", "B15-50 and W30-70 and asian 5 Percent (A5)", "B15-50 and W30-70 and hispanic 5 Percent (H5)",
             "B15-50 and W30-70 and A5 and H5", "B15-50 and W15-80 and A5", "B15-50 and W15-80 and H5", "B15-50 and W15-80 and A5 and H5",
             "White 85 Percent", "2010 pov 10-15 Percent", "2010 pov 15-35 Percent", "2010 pov 15-25 Percent", "2010 pov 25-35 Percent",
             "Poverty increase 2000-2010 (PI2010)", "2010 pov 10-15 and PI2010", "2010 pov 15-35 and PI2010",
             "2010 pov 15-25 and PI2010", "2010 pov 25-35 and PI2010"],
	transparent: true,
	'sphericalMercator': true,
	format: "image/png"
}, {
	isBaseLayer: false,
	buffer: 0,
	visibility: false,
    singleTile: true,
    ratio: 1
});

var omap = new OpenLayers.Layer.WMS("OMAP Opportunity Indices", urlCloud, {
	layers: ["Public Health Index", "Transportation Index", "Housing Index", "Employment Index", "Social Capital Index", "Education Index",
             "Composite Index"],
	transparent: true,
	'sphericalMercator': true,
	format: "image/png"
}, {
	isBaseLayer: false,
	buffer: 0,
	visibility: false,
    singleTile: true,
    ratio: 1,
    opacity: 0.8
});
var boundaries = new OpenLayers.Layer.WMS("Planning Areas", urlCloud, {
	layers: ["RPD Housing Submarkets", "PFAs"],
	transparent: true,
	'sphericalMercator': true,
	format: "image/png"
}, {
	isBaseLayer: false,
	buffer: 0,
	visibility: false
});
var employment = new OpenLayers.Layer.WMS("Employment", urlCloud, {
	layers: ["Major Employment Centers", "Employment Density"],
	transparent: true,
	'sphericalMercator': true,
	format: "image/png"
}, {
	isBaseLayer: false,
	buffer: 0,
	visibility: false,
	singleTile: true, ratio: 1
});
var network = new OpenLayers.Layer.WMS("Transportation", urlCloud, {
	layers: ["Balt Bus Lines", "Balt Bus Stops", "Balt LRT Stations", "Balt LRT Line", "MARC Line", "MARC Stops", "Balt Metro Stations", 
             "Balt Red Line", "Balt Red Line Stops" ],
	transparent: true,
	'sphericalMercator': true,
	format: "image/png"
}, {
	isBaseLayer: false,
	buffer: 0,
	visibility: false,
    singleTile: true, 
    ratio: 1
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
		zoom: 9,
		map: {
			center: new OpenLayers.LonLat(-76.7, 39.2).transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913")),
			controls: [new OpenLayers.Control.Navigation(), new OpenLayers.Control.Zoom(), new OpenLayers.Control.ScaleLine(), new 
                       OpenLayers.Control.TouchNavigation({
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
		}), omap, boundaries, employment, network, poverty, housing],
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
		layer: "Subsidized Housing",
		isLeaf: false,
		expanded: true,
		loader: {
			param: "LAYERS"
		}
	},{
		nodeType: "gx_layer",
		layer: "Race and Poverty",
		isLeaf: false,
		expanded: true,
		loader: {
			param: "LAYERS"
		}
	}, {
		nodeType: "gx_layer",
		layer: "OMAP Opportunity Indices",
		isLeaf: false,
		expanded: true,
		loader: {
			param: "LAYERS"
		}
	}, {
		nodeType: "gx_layer",
		layer: "Planning Areas",
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
		layer: "Transportation",
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
		width: 260,
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
	OpenLayers.IMAGE_RELOAD_ATTEMPTS = 4;
	OpenLayers.Util.onImageLoadErrorColor = "transparent";
	new Ext.Viewport({
		layout: "fit",
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
				items: [legend,
				{
					title: 'Race and Poverty',
					xtype: "gx_opacityslider",
					layer: poverty,
					aggressive: true,
					vertical: true,
					height: 150
				},
                {
					title: 'Subsidized Housing',
					xtype: "gx_opacityslider",
					layer: housing,
					aggressive: true,
					vertical: true,
					height: 150
				},{
					title: 'OMAP Opportunity Indices',
					xtype: "gx_opacityslider",
					layer: omap,
					aggressive: true,
					vertical: true,
					height: 150
				},
                {
					title: 'Planning Areas',
					xtype: "gx_opacityslider",
					layer: boundaries,
					aggressive: true,
					vertical: true,
					height: 150
				},{
					title: 'Employment',
					xtype: "gx_opacityslider",
					layer: employment,
					aggressive: true,
					vertical: true,
					height: 150
				}, {
					title: 'Network',
					xtype: "gx_opacityslider",
					layer: network,
					aggressive: true,
					vertical: true,
					height: 150,
				}],
				bodyStyle: {
					"padding": "5px"
				},
				collapsible: true,
				collapsed: false,
				containerScroll: true,
				autoScroll: false,
				cmargins: '15 8 15 8',
				split: true,
				height: 200
			}]
		}
	});
	Ext.util.CSS.swapStyleSheet("theme", "../lib/ext/resources/css/xtheme-gray.css");
});
