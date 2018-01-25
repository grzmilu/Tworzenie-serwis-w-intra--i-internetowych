var xLowest = null;
var xHighest = null;
var yLowest = null;
var yHighest = null;
var zLowest = null;
var zHighest = null;

Highcharts.setOptions({
	colors : $.map(Highcharts.getOptions().colors, function(color) {
		return {
			radialGradient : {
				cx : 0.4,
				cy : 0.3,
				r : 0.5
			},
			stops : [ [ 0, color ],
					[ 1, Highcharts.Color(color).brighten(-0.2).get('rgb') ] ]
		};
	})
});

function handleFiles(selectedFiles) {
	jQuery('#chartContainer').html('');
	
	var file = selectedFiles[0];
	
	jQuery('#fileDescription').text(file.name);
	jQuery('#fileDescription').show();
	jQuery('#btnSave').show();	
	
	if (file) {
		var reader = new FileReader();
		reader.readAsText(file, "UTF-8");
		reader.onload = function(evt) {
			var array;
			try {
				array = JSON.parse(evt.target.result);
				jQuery('#alertArea').html('');
			} catch (e) {
				$('#alertArea')
						.html(
								$("<div class='alert alert-danger alert-dismissible fade in' ><button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button><p>Wprowadzono błędne dane do generowania wykresu</p></div>"));
			}
			xLowest = null;
			xHighest = null;
			yLowest = null;
			yHighest = null;
			zLowest = null;
			zHighest = null;

			for (var i = 0; i < array.length; i++) {
				if (i == 0) {
					xLowest = array[i][0];
					xHighest = array[i][0];
					yLowest = array[i][1];
					yHighest = array[i][1];
					zLowest = array[i][2];
					zHighest = array[i][2];
				}
				if (xLowest > array[i][0]) {
					xLowest = array[i][0];
				}
				if (xHighest < array[i][0]) {
					xHighest = array[i][0];
				}
				if (yLowest > array[i][1]) {
					yLowest = array[i][1];
				}
				if (yHighest < array[i][1]) {
					yHighest = array[i][1];
				}
				if (zLowest > array[i][2]) {
					zLowest = array[i][2];
				}
				if (zHighest < array[i][2]) {
					zHighest = array[i][2];
				}
			}
			// Set up the chart
			var chart = new Highcharts.Chart({
				chart : {
					renderTo : 'chartContainer',
					margin : 100,
					type : 'scatter3d',
					options3d : {
						enabled : true,
						alpha : 10,
						beta : 30,
						depth : 250,
						viewDistance : 5,
						fitToPlot : false,
						frame : {
							bottom : {
								size : 1,
								color : 'rgba(0,0,0,0.02)'
							},
							back : {
								size : 1,
								color : 'rgba(0,0,0,0.04)'
							},
							side : {
								size : 1,
								color : 'rgba(0,0,0,0.06)'
							}
						}
					}
				},
				title : {
					text : 'Wykres 3D z podanych danych'
				},
				subtitle : {
					text : 'Kliknij i przeciągnij obszar wykresu aby obracać'
				},
				plotOptions : {
					scatter : {
						width : xHighest + 1,
						height : yHighest + 1,
						depth : zHighest + 1
					}
				},
				yAxis : {
					min : yLowest - 1,
					max : yHighest + 1,
					title : null
				},
				xAxis : {
					min : xLowest - 1,
					max : xHighest + 1,
					gridLineWidth : 1
				},
				zAxis : {
					min : zLowest - 1,
					max : zHighest + 1,
					showFirstLabel : false
				},
				legend : {
					enabled : false
				},
				series : [ {
					name : 'Reading',
					colorByPoint : true,
					data : array
				} ]
			});

			// Add mouse events for rotation
			$(chart.container)
					.on(
							'mousedown.hc touchstart.hc',
							function(eStart) {
								eStart = chart.pointer.normalize(eStart);

								var posX = eStart.chartX, posY = eStart.chartY, alpha = chart.options.chart.options3d.alpha, beta = chart.options.chart.options3d.beta, newAlpha, newBeta, sensitivity = 5; // lower
								// is
								// more
								// sensitive

								$(document)
										.on(
												{
													'mousemove.hc touchmove.hc' : function(
															e) {
														// Run beta
														e = chart.pointer
																.normalize(e);
														newBeta = beta
																+ (posX - e.chartX)
																/ sensitivity;
														chart.options.chart.options3d.beta = newBeta;

														// Run alpha
														newAlpha = alpha
																+ (e.chartY - posY)
																/ sensitivity;
														chart.options.chart.options3d.alpha = newAlpha;

														chart.redraw(false);
													},
													'mouseup touchend' : function() {
														$(document).off('.hc');
													}
												});
							});

		}
		reader.onerror = function(evt) {
			console.log("error");
		}

	}

}