var urlArray = ["http://knaaptime.com:8080/geoserver/wms", "http://www.knaaptime.com:8080/geoserver/wms", "http://test.knaaptime.com:8080/geoserver/wms"];
var housing = new OpenLayers.Layer.WMS("Housing", urlArray, {
	layers: ["BMC Foreclosure Rate", "BMC Vacancy Rate", "BMC High Cost Loan Rate", "HUD Subsidized Housing"],
	transparent: true,
	'sphericalMercator': true,
	format: "image/png"
}, {
	isBaseLayer: false,
	opacity: 0.7,
	buffer: 0,
	visibility: true
});
var socio = new OpenLayers.Layer.WMS("Socio-Cultural", urlArray, {
	layers: ["BMC Bachelor's or Greater", "BMC HS Diploma or Greater"],
	transparent: true,
	'sphericalMercator': true,
	format: "image/png"
}, {
	isBaseLayer: false,
	opacity: 0.7,
	buffer: 0,
	visibility: false
});
var education = new OpenLayers.Layer.WMS("Education & Training", urlArray, {
	layers: ["BMC High School: Proficient or Greater", "BMC Elementary School: Proficient or Greater"],
	transparent: true,
	'sphericalMercator': true,
	format: "image/png"
}, {
	isBaseLayer: false,
	opacity: 0.7,
	buffer: 0,
	visibility: false
});
var boundaries = new OpenLayers.Layer.WMS("Administrative Boundaries", urlArray, {
	layers: ["BMC Tract Boundary", "County Boundary", "Priority Funding Areas"],
	transparent: true,
	'sphericalMercator': true,
	format: "image/png"
}, {
	isBaseLayer: false,
	buffer: 0,
	visibility: false
});
var employment = new OpenLayers.Layer.WMS("Employment", urlArray, {
	layers: ["Firms by NAICS", "Firms by Size (Size)", "Firms by Size (Color)", "Employment Centers"],
	transparent: true,
	'sphericalMercator': true,
	format: "image/png"
}, {
	isBaseLayer: false,
	buffer: 0,
	visibility: false
});
var network = new OpenLayers.Layer.WMS("Transportation", urlArray, {
	layers: ["Interstates", "MARC Line", "Bus Lines"],
	transparent: true,
	'sphericalMercator': true,
	format: "image/png"
}, {
	isBaseLayer: false,
	buffer: 0,
	visibility: false
});
var landuse = new OpenLayers.Layer.WMS("Land Use", urlArray, {
	layers: ["Generalized Zoning", "Parcels by Land Use"],
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
			displayProjection: new OpenLayers.Projection("EPSG:900913"),
		},
		layers: [new OpenLayers.Layer.Google("Google Streets", {
			type: google.maps.MapTypeId.ROADMAP,
			'sphericalMercator': true,
			disableDefaultUI: true,
			isBaseLayer: true
		}), new OpenLayers.Layer.OSM(null, null, {
			isBaseLayer: true
		}), housing, socio, education, landuse, employment, network, boundaries],
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
		layer: "Housing",
		isLeaf: false,
		expanded: true,
		loader: {
			param: "LAYERS"
		}
	}, {
		nodeType: "gx_layer",
		layer: "Socio-Cultural",
		isLeaf: false,
		expanded: true,
		loader: {
			param: "LAYERS"
		}
	}, {
		nodeType: "gx_layer",
		layer: "Education & Training",
		isLeaf: false,
		expanded: true,
		loader: {
			param: "LAYERS"
		}
	}, {
		nodeType: "gx_layer",
		layer: "Administrative Boundaries",
		isLeaf: false,
		expanded: true,
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
				collapsed: false,
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
					title: 'Housing',
					xtype: "gx_opacityslider",
					layer: housing,
					aggressive: true,
					vertical: true,
					height: 150
				}, {
					title: 'Socio-Cultural',
					xtype: "gx_opacityslider",
					layer: socio,
					aggressive: true,
					vertical: true,
					height: 150
				}, {
					title: 'Education & Training',
					xtype: "gx_opacityslider",
					layer: education,
					aggressive: true,
					vertical: true,
					height: 150
				}, {
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
	Ext.util.CSS.swapStyleSheet("theme", "ext/resources/css/xtheme-gray.css")
});