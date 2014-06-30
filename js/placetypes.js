OpenLayers.IMAGE_RELOAD_ATTEMPTS = 2;
OpenLayers.Util.onImageLoadErrorColor = "transparent"; 

var urlCloud = ["http://aws.knaaptime.com:8080/geoserver/wms"];
var urlArray = ["http://maps.knaaptime.com:8080/geoserver/wms", "http://test.knaaptime.com:8080/geoserver/wms"];
var aws = ["http://aws.knaaptime.com:8080/geoserver/wms", "http://aws2.knaaptime.com:8080/geoserver/wms"];

var network = new OpenLayers.Layer.WMS("Transportation", urlCloud, {
	layers: ["WMATA routes", "WMATA stations", "MARC routes", "MARC stations","MD28_MD198"],
	transparent: true,
	'sphericalMercator': true,
	format: "image/png"
}, {
	isBaseLayer: false,
	buffer: 0,
	visibility: false
});
var placetypes = new OpenLayers.Layer.WMS("Placetypes", urlCloud, {
	layers: ["TCquintile","UCquintile", "TCthreshold","UCthreshold", "UrbanTown"],
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
var boundaries = new OpenLayers.Layer.WMS("Policy Boundaries", urlCloud, {
	layers: ["PFAs", "MD county","STOA"],
	transparent: true,
	'sphericalMercator': true,
	format: "image/png"
}, {
	isBaseLayer: false,
	buffer: 0,
	visibility: false
});
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
var landuse = new OpenLayers.Layer.WMS("Land Use", urlCloud, {
	layers: ["Generalized Zoning", "Parcels by Land Use","Green Corridor", "Green Hub"],
	transparent: true,
	'sphericalMercator': true,
	format: "image/png"
}, {
	isBaseLayer: false,
	buffer: 0,
	visibility: false
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
		}), landuse, heatmaps, boundaries, placetypes, network],
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
		layer: "Transportation",
		isLeaf: false,
		expanded: false,
		loader: {
			param: "LAYERS"
		}
	}, {
		nodeType: "gx_layer",
		layer: "Placetypes",
		isLeaf: false,
		expanded: true,
		loader: {
			param: "LAYERS"
		}
	}, {
		nodeType: "gx_layer",
		layer: "Policy Boundaries",
		isLeaf: false,
		expanded: false,
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
		title: "Map Elements",
		width: 300,
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
					title: 'Transportation',
					xtype: "gx_opacityslider",
					layer: network,
					aggressive: true,
					vertical: true,
					height: 150,
				}, {
					title: 'Placetypes',
					xtype: "gx_opacityslider",
					layer: placetypes,
					aggressive: true,
					vertical: true,
					height: 150
				}, {
					title: 'Policy Boundaries',
					xtype: "gx_opacityslider",
					layer: boundaries,
					aggressive: true,
					vertical: true,
					height: 150
				}, {
					title: 'Heatmaps',
					xtype: "gx_opacityslider",
					layer: heatmaps,
					aggressive: true,
					vertical: true,
					height: 150
				}, {
					title: 'Land Use',
					xtype: "gx_opacityslider",
					layer: landuse,
					aggressive: true,
					vertical: true,
					fieldLabel: "Land Use",
					width: 200,
					height: 200,
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
