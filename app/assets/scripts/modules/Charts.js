import $ from 'jQuery';
import Db from './Db';
import Config from './Config'

class Charts {
	constructor(){
	}

	Show( action, records ){
		this.db = new Db();
		this.db.GetStats( action, records, "atp", this.doWork );
		this.db.GetStats( action, records, "next-gen", this.doWork );
	}
	ShowRank(){
		console.log("ShowRank");
		this.db = new Db();
		this.db.GetRankStats( "next-gen", this.doRankWork );
	}
	DrawLineChart( data,mongodb ){

		console.log(data)
		debugger
		var dataRank = JSON.stringify(data);
		console.log("ffff",dataRank)

		let chartArea = $( ".charts__chart" );
		let vpWidth = chartArea.outerWidth();
		let vpHeight = chartArea.outerHeight();
		let margin = { top: 20, right:45, bottom: 100, left: 45 };
		let chartWidth = vpWidth - ( margin.right * 2 );
		let chartHeight = (vpHeight) - margin.bottom ;

		
		
		let lineChart = d3.selectAll( chartArea ).append( "svg" )
					   .attr( "width" , chartWidth ).attr( "height", chartHeight).attr( "id", mongodb)
					   .append( "g" ).attr( "transform", "translate( " + margin.left + "," + margin.top + " ) " );	

		var parseDate = d3.timeParse("%Y-%m-%d");
		var x = d3.scaleTime().range([0, chartWidth]);
		var y = d3.scaleLinear().range([chartHeight, 0]);
		 	
		var valueline = d3.line().x(function(d) { return x(d.date); })
		 		    			.y(function(d) { return y(d.singles); });

		

		

		
		 		    			debugger
		d3.json(dataRank, function(error, data){
			data.forEach(function(d){
				console.log(d)
			});

			x.domain(d3.extent(data, function(d) { return parseTime2(d.date) }));
		 	y.domain([0, d3.max(data, function(d) { return d.singles; })]);
			var color = d3.scaleOrdinal(d3.schemeCategory10);
			legendSpace = chartWidth/data.length;


			lineChart.append("path")
		 		      .data([data])
		 		      .attr("class", "line")
				      .attr("d", valueline);

				      // Add the X Axis
		 		  lineChart.append("g")
		 		      .attr("transform", "translate(0," + chartHeight + ")")
		 		      .call(d3.axisBottom(x));

		// 		  // Add the Y Axis
		 		  lineChart.append("g")
		 		      .call(d3.axisLeft(y));
		});
		 		    
				

		// 		  // Scale the range of the data
				  

		// 		  // Add the valueline path.
				  

		 		  

		
	}
	
	DrawBarChart( playerStatData, action,mongodb,records ){
		//console.log(action)
		const cfg = new Config();
		const chart = new Charts();
		//console.log(cfg.get('aces'));
		
		let actionArr = action.split( ":" );
		let actionArrLen = actionArr.length;
		
		let chartArea = $( ".charts__chart" );
		let chartsPlayerData = $(".charts--player-infobox");
		let chartsPlayerPerformanceData = $(".charts--player-performance");
		let chartsPlayerPerformanceBox = $(".charts--player-performance-box");
		let chartsPlayerPerformanceTitle = $(".charts--player-performance-title");

		
		let vpWidth = chartArea.outerWidth();
		let vpHeight = chartArea.outerHeight();
		let margin = { top: 20, right:45, bottom: 100, left: 45 };
		let chartWidth = vpWidth - ( margin.right * 2 );
		let chartHeight = (vpHeight /2) - margin.bottom ;

		let minScaleX = 0, maxScaleX = records, minScaleY = 0;
		let maxScaleY, dataMean, pageTitle;
		let toolTip, belowMean, aboveMean;
		let aboveBlack = 0, belowBlack = 0, aboveGreen = 0, belowGreen = 0, aboveRed = 0, belowRed = 0;
		let currentPercentage, topPer, abovePer, belowPer, lowestPer;
		let queryArr = [];

		
		
		

		
		let barChart = d3.selectAll( chartArea ).append( "svg" )
					   .attr( "width" , vpWidth ).attr( "height", vpHeight /2).attr( "id", mongodb)
					   .append( "g" ).attr( "transform", "translate( " + margin.left + "," + margin.top + " ) " );	

		function SetAttr(actionArr, attr){
				
					if( actionArr[0] === "servicedata" ){
						switch(actionArr[1]){
							case "aces":
								switch(attr){
									case "rect_y":
										return function(d){ return yScale(parseInt((d.stats.servicedata.aces/d.stats.servicedata.gamesplayed)*100));}
									break;
									case "rect_h":
										return function(d){ return chartHeight - yScale(parseInt((d.stats.servicedata.aces/d.stats.servicedata.gamesplayed)*100));}
									break;
									case "html":
										return function(d){ 
												
												currentPercentage = Math.round((d.stats.servicedata.aces/d.stats.servicedata.gamesplayed)*100)
												queryArr = ["d.stats.servicedata.aces","d.stats.servicedata.gamesplayed"];

												
												let playerData = $(".charts--player-data");
												playerData.removeClass("charts--hidden");
												
												
												chartsPlayerData.empty();

												//console.log(d.name.split(" "))

												chartsPlayerData.append("<p><strong>" + d.name + "</strong> (" + d.age + ") <strong>  Rank: </strong>" + d.rank +   "</p>");
												chartsPlayerData.append("<strong>Stats:</strong>");
												chartsPlayerData.append("<br><strong>Career Aces:  </strong>" + d.stats.servicedata.aces);
												chartsPlayerData.append("<br><strong>Games Played: </strong>" + d.stats.servicedata.gamesplayed);
												chartsPlayerData.append("<br><strong>Ace Percentage: </strong>" + Math.round((d.stats.servicedata.aces/d.stats.servicedata.gamesplayed)*100) + "%");
												chartsPlayerData.append("<br><br><strong>Comments:</strong>");
												

												if(currentPercentage > aboveMean){

														aboveGreen = Math.round(currentPercentage - aboveMean);
														aboveBlack = Math.round(currentPercentage - dataMean);
														chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is in the <strong>Top Group</strong> by " + aboveGreen + "%");
														chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is above the <strong>Average Group</strong> by " + aboveBlack + "%");

												} else if( currentPercentage < aboveMean && currentPercentage > dataMean){
													
													aboveBlack = Math.round(currentPercentage - dataMean);
													belowGreen = Math.round(aboveMean - currentPercentage);
													chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is in the <strong>Average Group</strong> by " + aboveBlack + "%");
													chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is below the <strong>Top Group</strong> by " + belowGreen + "%");

												} else if(currentPercentage < dataMean && currentPercentage > belowMean){
													belowBlack = Math.round(dataMean - currentPercentage);
													chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is in the <strong>Below Average Group</strong> by " + belowBlack + "%");
													aboveRed = Math.round(currentPercentage - belowMean);
													chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is above the <strong>Lowest Average Group</strong> by " + aboveRed + "%");
												}
												else if(currentPercentage < belowMean){
														belowRed = Math.round(belowMean - currentPercentage);
														chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is in the <strong>Lowest Average Group</strong> by " + belowRed + "%");
														belowBlack = Math.round(dataMean - currentPercentage);
														chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is below the <strong>Average Group</strong> by " + belowBlack + "%");
												}


												chartsPlayerData.append("<br><br><strong>Average(Black): </strong>" + Math.round(dataMean) + "%");
												chartsPlayerData.append("<br><strong>Above Average(Green): </strong>" + Math.round(aboveMean) + "%");
												chartsPlayerData.append("<br><strong>Below Average(Red): </strong>" + Math.round(belowMean) + "%");}
									break;
								}
							break;
							case "doublefaults":
								switch(attr){
									case "rect_y":
										return function(d){ return yScale(parseInt((d.stats.servicedata.doublefaults/d.stats.servicedata.gamesplayed)*100));}
									break;
									case "rect_h":
										return function(d){ return chartHeight - yScale(parseInt((d.stats.servicedata.doublefaults/d.stats.servicedata.gamesplayed)*100));}
									break;
									case "html":
										return function(d){ 
												currentPercentage = Math.round((d.stats.servicedata.doublefaults/d.stats.servicedata.gamesplayed)*100)
												
												let playerData = $(".charts--player-data");
												playerData.removeClass("charts--hidden");
												
												
												chartsPlayerData.empty();

												chartsPlayerData.append("<p><strong>" + d.name + "</strong> (" + d.age + ") <strong>  Rank: </strong>" + d.rank +   "</p>");
												chartsPlayerData.append("<strong>Stats:</strong>");
												chartsPlayerData.append("<br><strong>Career Double Faults:  </strong>" + d.stats.servicedata.doublefaults);
												chartsPlayerData.append("<br><strong>Games Played: </strong>" + d.stats.servicedata.gamesplayed);
												chartsPlayerData.append("<br><strong>Double Fault Percentage: </strong>" + currentPercentage + "%");
												chartsPlayerData.append("<br><br><strong>Comments:</strong>");
										

												if(currentPercentage < belowMean){

														belowGreen = Math.round(belowMean - currentPercentage);
														belowBlack = Math.round(dataMean - currentPercentage);
														chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is in the <strong>Top Group</strong> by " + belowGreen + "%");
														chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is above the <strong>Average Group</strong> by " + belowBlack + "%");

												} else if( currentPercentage > belowMean && currentPercentage < dataMean){
													
													aboveGreen = Math.round(currentPercentage - belowMean);
													belowBlack = Math.round(dataMean - currentPercentage);
													chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is in the <strong>Average Group</strong> by " + aboveGreen + "%");
													chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is below the <strong>Top Group</strong> by " + belowBlack + "%");

												} else if(currentPercentage > dataMean && currentPercentage < aboveMean){
													
													aboveBlack = Math.round(currentPercentage - dataMean);
													belowRed = Math.round(aboveMean - currentPercentage);
													chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is in the <strong>Below Average Group</strong> by " + aboveBlack + "%");
													chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is above the <strong>Lowest Average Group</strong> by " + belowRed + "%");
												}
												else if(currentPercentage > aboveMean){
														aboveRed = Math.round(currentPercentage - aboveMean);
														chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is in the <strong>Lowest Average Group</strong> by " + aboveRed + "%");
														aboveBlack = Math.round(currentPercentage - dataMean);
														chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is below the <strong>Average Group</strong> by " + aboveBlack + "%");
												}


												chartsPlayerData.append("<br><br><strong>Average(Black): </strong>" + Math.round(dataMean) + "%");
												chartsPlayerData.append("<br><strong>Above Average(Green): </strong>" + Math.round(belowMean) + "%");
												chartsPlayerData.append("<br><strong>Below Average(Red): </strong>" + Math.round(aboveMean) + "%");}
									break;
									
								}
							break;
							case "fspercent":
								switch(attr){
									case "rect_y":
										return function(d){ return yScale(parseInt(d.stats.servicedata.fspercent));}
									break;
									case "rect_h":
										return function(d){ return chartHeight - yScale(parseInt(d.stats.servicedata.fspercent));}
									break;
									case "html":
										return function(d){ 
												currentPercentage = Math.round(d.stats.servicedata.fspercent.replace("%",""))
												
												let playerData = $(".charts--player-data");
												playerData.removeClass("charts--hidden");
												chartsPlayerData.empty();

												chartsPlayerData.append("<p><strong>" + d.name + "</strong> (" + d.age + ") <strong>  Rank: </strong>" + d.rank +   "</p>");
												chartsPlayerData.append("<strong>Stats:</strong>");
												chartsPlayerData.append("<br><strong>1st Serve Percentage: </strong>" + currentPercentage + "%");
												chartsPlayerData.append("<br><br><strong>Comments:</strong>");
												
												if(currentPercentage > aboveMean){

														aboveGreen = Math.round(currentPercentage - aboveMean);
														aboveBlack = Math.round(currentPercentage - dataMean);
														chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is in the <strong>Top Group</strong> by " + aboveGreen + "%");
														chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is above the <strong>Average Group</strong> by " + aboveBlack + "%");

												} else if( currentPercentage < aboveMean && currentPercentage > dataMean){
													
													aboveBlack = Math.round(currentPercentage - dataMean);
													belowGreen = Math.round(aboveMean - currentPercentage);
													chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is in the <strong>Average Group</strong> by " + aboveBlack + "%");
													chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is below the <strong>Top Group</strong> by " + belowGreen + "%");

												} else if(currentPercentage < dataMean && currentPercentage > belowMean){
													belowBlack = Math.round(dataMean - currentPercentage);
													chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is in the <strong>Below Average Group</strong> by " + belowBlack + "%");
													aboveRed = Math.round(currentPercentage - belowMean);
													chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is above the <strong>Lowest Average Group</strong> by " + aboveRed + "%");
												}
												else if(currentPercentage < belowMean){
														belowRed = Math.round(belowMean - currentPercentage);
														chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is in the <strong>Lowest Average Group</strong> by " + belowRed + "%");
														belowBlack = Math.round(dataMean - currentPercentage);
														chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is below the <strong>Average Group</strong> by " + belowBlack + "%");
												}

												chartsPlayerData.append("<br><br><strong>Average(Black): </strong>" + Math.round(dataMean) + "%");
												chartsPlayerData.append("<br><strong>Above Average(Green): </strong>" + Math.round(aboveMean) + "%");
												chartsPlayerData.append("<br><strong>Below Average(Red): </strong>" + Math.round(belowMean) + "%");}
									break;
									
								}
							break;
							case "fspointswon":
								switch(attr){
									case "rect_y":
										return function(d){ return yScale(parseInt(d.stats.servicedata.fspointswon));}
									break;
									case "rect_h":
										return function(d){ return chartHeight - yScale(parseInt(d.stats.servicedata.fspointswon));}
									break;
									case "html":
										return function(d){ 
												currentPercentage = Math.round(d.stats.servicedata.fspointswon.replace("%",""))
												
												let playerData = $(".charts--player-data");
												playerData.removeClass("charts--hidden");
																								
												chartsPlayerData.empty();

												chartsPlayerData.append("<p><strong>" + d.name + "</strong> (" + d.age + ") <strong>  Rank: </strong>" + d.rank +   "</p>");
												chartsPlayerData.append("<strong>Stats:</strong>");
												chartsPlayerData.append("<br><strong>FS Points Won Percentage: </strong>" + currentPercentage + "%");
												chartsPlayerData.append("<br><br><strong>Comments:</strong>");
												if(currentPercentage > aboveMean){

														aboveGreen = Math.round(currentPercentage - aboveMean);
														aboveBlack = Math.round(currentPercentage - dataMean);
														chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is in the <strong>Top Group</strong> by " + aboveGreen + "%");
														chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is above the <strong>Average Group</strong> by " + aboveBlack + "%");

												} else if( currentPercentage < aboveMean && currentPercentage > dataMean){
													
													aboveBlack = Math.round(currentPercentage - dataMean);
													belowGreen = Math.round(aboveMean - currentPercentage);
													chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is in the <strong>Average Group</strong> by " + aboveBlack + "%");
													chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is below the <strong>Top Group</strong> by " + belowGreen + "%");

												} else if(currentPercentage < dataMean && currentPercentage > belowMean){
													belowBlack = Math.round(dataMean - currentPercentage);
													chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is in the <strong>Below Average Group</strong> by " + belowBlack + "%");
													aboveRed = Math.round(currentPercentage - belowMean);
													chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is above the <strong>Lowest Average Group</strong> by " + aboveRed + "%");
												}
												else if(currentPercentage < belowMean){
														belowRed = Math.round(belowMean - currentPercentage);
														chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is in the <strong>Lowest Average Group</strong> by " + belowRed + "%");
														belowBlack = Math.round(dataMean - currentPercentage);
														chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is below the <strong>Average Group</strong> by " + belowBlack + "%");
												}

												chartsPlayerData.append("<br><br><strong>Average(Black): </strong>" + Math.round(dataMean) + "%");
												chartsPlayerData.append("<br><strong>Above Average(Green): </strong>" + Math.round(aboveMean) + "%");
												chartsPlayerData.append("<br><strong>Below Average(Red): </strong>" + Math.round(belowMean) + "%");}
									break;
									
								}
							break;
							case "sspointswon":
								switch(attr){
									case "rect_y":
										return function(d){ return yScale(parseInt(d.stats.servicedata.sspointswon));}
									break;
									case "rect_h":
										return function(d){ return chartHeight - yScale(parseInt(d.stats.servicedata.sspointswon));}
									break;
									case "html":
										return function(d){ 
												currentPercentage = Math.round(d.stats.servicedata.sspointswon.replace("%",""))
												
												let playerData = $(".charts--player-data");
												playerData.removeClass("charts--hidden");
												
												
												chartsPlayerData.empty();

												chartsPlayerData.append("<p><strong>" + d.name + "</strong> (" + d.age + ") <strong>  Rank: </strong>" + d.rank +   "</p>");
												chartsPlayerData.append("<strong>Stats:</strong>");
												chartsPlayerData.append("<br><strong>2nd Serve Points Won Percentage: </strong>" + currentPercentage + "%");
												chartsPlayerData.append("<br><br><strong>Comments:</strong>");
												if(currentPercentage > aboveMean){

														aboveGreen = Math.round(currentPercentage - aboveMean);
														aboveBlack = Math.round(currentPercentage - dataMean);
														chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is in the <strong>Top Group</strong> by " + aboveGreen + "%");
														chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is above the <strong>Average Group</strong> by " + aboveBlack + "%");

												} else if( currentPercentage < aboveMean && currentPercentage > dataMean){
													
													aboveBlack = Math.round(currentPercentage - dataMean);
													belowGreen = Math.round(aboveMean - currentPercentage);
													chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is in the <strong>Average Group</strong> by " + aboveBlack + "%");
													chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is below the <strong>Top Group</strong> by " + belowGreen + "%");

												} else if(currentPercentage < dataMean && currentPercentage > belowMean){
													belowBlack = Math.round(dataMean - currentPercentage);
													chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is in the <strong>Below Average Group</strong> by " + belowBlack + "%");
													aboveRed = Math.round(currentPercentage - belowMean);
													chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is above the <strong>Lowest Average Group</strong> by " + aboveRed + "%");
												}
												else if(currentPercentage < belowMean){
														belowRed = Math.round(belowMean - currentPercentage);
														chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is in the <strong>Lowest Average Group</strong> by " + belowRed + "%");
														belowBlack = Math.round(dataMean - currentPercentage);
														chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is below the <strong>Average Group</strong> by " + belowBlack + "%");
												}

												chartsPlayerData.append("<br><br><strong>Average(Black): </strong>" + Math.round(dataMean) + "%");
												chartsPlayerData.append("<br><strong>Above Average(Green): </strong>" + Math.round(aboveMean) + "%");
												chartsPlayerData.append("<br><strong>Below Average(Red): </strong>" + Math.round(belowMean) + "%");}
									break;
									
								}
							break;
							case "bpsaved":
								switch(attr){
									case "rect_y":
										return function(d){ return yScale(parseInt(d.stats.servicedata.bpsaved));}
									break;
									case "rect_h":
										return function(d){ return chartHeight - yScale(parseInt(d.stats.servicedata.bpsaved));}
									break;
									case "html":
										return function(d){ 
												currentPercentage = Math.round(d.stats.servicedata.bpsaved.replace("%",""))
												
												let playerData = $(".charts--player-data");
												playerData.removeClass("charts--hidden");
																								
												chartsPlayerData.empty();

												chartsPlayerData.append("<p><strong>" + d.name + "</strong> (" + d.age + ") <strong>  Rank: </strong>" + d.rank +   "</p>");
												chartsPlayerData.append("<strong>Stats:</strong>");
												chartsPlayerData.append("<br><strong>Break Points Saved Percentage: </strong>" + currentPercentage + "%");
												chartsPlayerData.append("<br><br><strong>Comments:</strong>");
												if(currentPercentage > aboveMean){

														aboveGreen = Math.round(currentPercentage - aboveMean);
														aboveBlack = Math.round(currentPercentage - dataMean);
														chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is in the <strong>Top Group</strong> by " + aboveGreen + "%");
														chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is above the <strong>Average Group</strong> by " + aboveBlack + "%");

												} else if( currentPercentage < aboveMean && currentPercentage > dataMean){
													
													aboveBlack = Math.round(currentPercentage - dataMean);
													belowGreen = Math.round(aboveMean - currentPercentage);
													chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is in the <strong>Average Group</strong> by " + aboveBlack + "%");
													chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is below the <strong>Top Group</strong> by " + belowGreen + "%");

												} else if(currentPercentage < dataMean && currentPercentage > belowMean){
													belowBlack = Math.round(dataMean - currentPercentage);
													chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is in the <strong>Below Average Group</strong> by " + belowBlack + "%");
													aboveRed = Math.round(currentPercentage - belowMean);
													chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is above the <strong>Lowest Average Group</strong> by " + aboveRed + "%");
												}
												else if(currentPercentage < belowMean){
														belowRed = Math.round(belowMean - currentPercentage);
														chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is in the <strong>Lowest Average Group</strong> by " + belowRed + "%");
														belowBlack = Math.round(dataMean - currentPercentage);
														chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is below the <strong>Average Group</strong> by " + belowBlack + "%");
												}

												chartsPlayerData.append("<br><br><strong>Average(Black): </strong>" + Math.round(dataMean) + "%");
												chartsPlayerData.append("<br><strong>Above Average(Green): </strong>" + Math.round(aboveMean) + "%");
												chartsPlayerData.append("<br><strong>Below Average(Red): </strong>" + Math.round(belowMean) + "%");}
									break;
									
								}
							break;
							case "gameswon":
								switch(attr){
									case "rect_y":
										return function(d){ return yScale(parseInt(d.stats.servicedata.gameswon));}
									break;
									case "rect_h":
										return function(d){ return chartHeight - yScale(parseInt(d.stats.servicedata.gameswon));}
									break;
									case "html":
										return function(d){ 
												currentPercentage = Math.round(d.stats.servicedata.gameswon.replace("%",""))
												
												let playerData = $(".charts--player-data");
												playerData.removeClass("charts--hidden");
																								
												chartsPlayerData.empty();

												chartsPlayerData.append("<p><strong>" + d.name + "</strong> (" + d.age + ") <strong>  Rank: </strong>" + d.rank +   "</p>");
												chartsPlayerData.append("<strong>Stats:</strong>");
												chartsPlayerData.append("<br><strong>Games Won Percentage: </strong>" + currentPercentage + "%");
												chartsPlayerData.append("<br><br><strong>Comments:</strong>");
												if(currentPercentage > aboveMean){

														aboveGreen = Math.round(currentPercentage - aboveMean);
														aboveBlack = Math.round(currentPercentage - dataMean);
														chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is in the <strong>Top Group</strong> by " + aboveGreen + "%");
														chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is above the <strong>Average Group</strong> by " + aboveBlack + "%");

												} else if( currentPercentage < aboveMean && currentPercentage > dataMean){
													
													aboveBlack = Math.round(currentPercentage - dataMean);
													belowGreen = Math.round(aboveMean - currentPercentage);
													chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is in the <strong>Average Group</strong> by " + aboveBlack + "%");
													chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is below the <strong>Top Group</strong> by " + belowGreen + "%");

												} else if(currentPercentage < dataMean && currentPercentage > belowMean){
													belowBlack = Math.round(dataMean - currentPercentage);
													chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is in the <strong>Below Average Group</strong> by " + belowBlack + "%");
													aboveRed = Math.round(currentPercentage - belowMean);
													chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is above the <strong>Lowest Average Group</strong> by " + aboveRed + "%");
												}
												else if(currentPercentage < belowMean){
														belowRed = Math.round(belowMean - currentPercentage);
														chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is in the <strong>Lowest Average Group</strong> by " + belowRed + "%");
														belowBlack = Math.round(dataMean - currentPercentage);
														chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is below the <strong>Average Group</strong> by " + belowBlack + "%");
												}

												chartsPlayerData.append("<br><br><strong>Average(Black): </strong>" + Math.round(dataMean) + "%");
												chartsPlayerData.append("<br><strong>Above Average(Green): </strong>" + Math.round(aboveMean) + "%");
												chartsPlayerData.append("<br><strong>Below Average(Red): </strong>" + Math.round(belowMean) + "%");}
									break;
									
								}
							break;
							case "totalpointswon":
								switch(attr){
									case "rect_y":
										return function(d){ return yScale(parseInt(d.stats.servicedata.totalpointswon));}
									break;
									case "rect_h":
										return function(d){ return chartHeight - yScale(parseInt(d.stats.servicedata.totalpointswon));}
									break;
									case "html":
										return function(d){ 
												currentPercentage = Math.round(d.stats.servicedata.totalpointswon.replace("%",""))
												
												let playerData = $(".charts--player-data");
												playerData.removeClass("charts--hidden");
																								
												chartsPlayerData.empty();

												chartsPlayerData.append("<p><strong>" + d.name + "</strong> (" + d.age + ") <strong>  Rank: </strong>" + d.rank +   "</p>");
												chartsPlayerData.append("<strong>Stats:</strong>");
												chartsPlayerData.append("<br><strong>Total Serve Points Won Percentage: </strong>" + currentPercentage + "%");
												chartsPlayerData.append("<br><br><strong>Comments:</strong>");
												if(currentPercentage > aboveMean){

														aboveGreen = Math.round(currentPercentage - aboveMean);
														aboveBlack = Math.round(currentPercentage - dataMean);
														chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is in the <strong>Top Group</strong> by " + aboveGreen + "%");
														chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is above the <strong>Average Group</strong> by " + aboveBlack + "%");

												} else if( currentPercentage < aboveMean && currentPercentage > dataMean){
													
													aboveBlack = Math.round(currentPercentage - dataMean);
													belowGreen = Math.round(aboveMean - currentPercentage);
													chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is in the <strong>Average Group</strong> by " + aboveBlack + "%");
													chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is below the <strong>Top Group</strong> by " + belowGreen + "%");

												} else if(currentPercentage < dataMean && currentPercentage > belowMean){
													belowBlack = Math.round(dataMean - currentPercentage);
													chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is in the <strong>Below Average Group</strong> by " + belowBlack + "%");
													aboveRed = Math.round(currentPercentage - belowMean);
													chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is above the <strong>Lowest Average Group</strong> by " + aboveRed + "%");
												}
												else if(currentPercentage < belowMean){
														belowRed = Math.round(belowMean - currentPercentage);
														chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is in the <strong>Lowest Average Group</strong> by " + belowRed + "%");
														belowBlack = Math.round(dataMean - currentPercentage);
														chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is below the <strong>Average Group</strong> by " + belowBlack + "%");
												}

												chartsPlayerData.append("<br><br><strong>Average(Black): </strong>" + Math.round(dataMean) + "%");
												chartsPlayerData.append("<br><strong>Above Average(Green): </strong>" + Math.round(aboveMean) + "%");
												chartsPlayerData.append("<br><strong>Below Average(Red): </strong>" + Math.round(belowMean) + "%");}
									break;
									
								}
							break;
						}
					}
					else if (actionArr[0] === "returndata"){
						switch(actionArr[1]){
							case "fsreturnpointswon":
								switch(attr){
									case "rect_y":
										return function(d){ return yScale(parseInt(d.stats.returndata.fsreturnpointswon));}
									break;
									case "rect_h":
										return function(d){ return chartHeight - yScale(parseInt(d.stats.returndata.fsreturnpointswon));}
									break;
									case "html":
										return function(d){ 
												currentPercentage = Math.round(d.stats.returndata.fsreturnpointswon.replace("%",""))
												
												let playerData = $(".charts--player-data");
												playerData.removeClass("charts--hidden");
																								
												chartsPlayerData.empty();

												chartsPlayerData.append("<p><strong>" + d.name + "</strong> (" + d.age + ") <strong>  Rank: </strong>" + d.rank +   "</p>");
												chartsPlayerData.append("<strong>Stats:</strong>");
												chartsPlayerData.append("<br><strong>1st Serve Return Points Won Percentage: </strong>" + currentPercentage + "%");
												chartsPlayerData.append("<br><br><strong>Comments:</strong>");
												if(currentPercentage > aboveMean){

														aboveGreen = Math.round(currentPercentage - aboveMean);
														aboveBlack = Math.round(currentPercentage - dataMean);
														chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is in the <strong>Top Group</strong> by " + aboveGreen + "%");
														chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is above the <strong>Average Group</strong> by " + aboveBlack + "%");

												} else if( currentPercentage < aboveMean && currentPercentage > dataMean){
													
													aboveBlack = Math.round(currentPercentage - dataMean);
													belowGreen = Math.round(aboveMean - currentPercentage);
													chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is in the <strong>Average Group</strong> by " + aboveBlack + "%");
													chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is below the <strong>Top Group</strong> by " + belowGreen + "%");

												} else if(currentPercentage < dataMean && currentPercentage > belowMean){
													belowBlack = Math.round(dataMean - currentPercentage);
													chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is in the <strong>Below Average Group</strong> by " + belowBlack + "%");
													aboveRed = Math.round(currentPercentage - belowMean);
													chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is above the <strong>Lowest Average Group</strong> by " + aboveRed + "%");
												}
												else if(currentPercentage < belowMean){
														belowRed = Math.round(belowMean - currentPercentage);
														chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is in the <strong>Lowest Average Group</strong> by " + belowRed + "%");
														belowBlack = Math.round(dataMean - currentPercentage);
														chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is below the <strong>Average Group</strong> by " + belowBlack + "%");
												}

												chartsPlayerData.append("<br><br><strong>Average(Black): </strong>" + Math.round(dataMean) + "%");
												chartsPlayerData.append("<br><strong>Above Average(Green): </strong>" + Math.round(aboveMean) + "%");
												chartsPlayerData.append("<br><strong>Below Average(Red): </strong>" + Math.round(belowMean) + "%");}
									break;
									
								}
							break;
							case "ssreturnpointswon":
								switch(attr){
									case "rect_y":
										return function(d){ return yScale(parseInt(d.stats.returndata.ssreturnpointswon));}
									break;
									case "rect_h":
										return function(d){ return chartHeight - yScale(parseInt(d.stats.returndata.ssreturnpointswon));}
									break;
									case "html":
										return function(d){ 
												currentPercentage = Math.round(d.stats.returndata.ssreturnpointswon.replace("%",""))
												
												let playerData = $(".charts--player-data");
												playerData.removeClass("charts--hidden");
																								
												chartsPlayerData.empty();

												chartsPlayerData.append("<p><strong>" + d.name + "</strong> (" + d.age + ") <strong>  Rank: </strong>" + d.rank +   "</p>");
												chartsPlayerData.append("<strong>Stats:</strong>");
												chartsPlayerData.append("<br><strong>2nd Serve Return Points Percentage: </strong>" + currentPercentage + "%");
												chartsPlayerData.append("<br><br><strong>Comments:</strong>");
												if(currentPercentage > aboveMean){

														aboveGreen = Math.round(currentPercentage - aboveMean);
														aboveBlack = Math.round(currentPercentage - dataMean);
														chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is in the <strong>Top Group</strong> by " + aboveGreen + "%");
														chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is above the <strong>Average Group</strong> by " + aboveBlack + "%");

												} else if( currentPercentage < aboveMean && currentPercentage > dataMean){
													
													aboveBlack = Math.round(currentPercentage - dataMean);
													belowGreen = Math.round(aboveMean - currentPercentage);
													chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is in the <strong>Average Group</strong> by " + aboveBlack + "%");
													chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is below the <strong>Top Group</strong> by " + belowGreen + "%");

												} else if(currentPercentage < dataMean && currentPercentage > belowMean){
													belowBlack = Math.round(dataMean - currentPercentage);
													chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is in the <strong>Below Average Group</strong> by " + belowBlack + "%");
													aboveRed = Math.round(currentPercentage - belowMean);
													chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is above the <strong>Lowest Average Group</strong> by " + aboveRed + "%");
												}
												else if(currentPercentage < belowMean){
														belowRed = Math.round(belowMean - currentPercentage);
														chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is in the <strong>Lowest Average Group</strong> by " + belowRed + "%");
														belowBlack = Math.round(dataMean - currentPercentage);
														chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is below the <strong>Average Group</strong> by " + belowBlack + "%");
												}

												chartsPlayerData.append("<br><br><strong>Average(Black): </strong>" + Math.round(dataMean) + "%");
												chartsPlayerData.append("<br><strong>Above Average(Green): </strong>" + Math.round(aboveMean) + "%");
												chartsPlayerData.append("<br><strong>Below Average(Red): </strong>" + Math.round(belowMean) + "%");}
									break;
									
								}
							break;
							case "bpconverted":
								switch(attr){
									case "rect_y":
										return function(d){ return yScale(parseInt(d.stats.returndata.bpconverted));}
									break;
									case "rect_h":
										return function(d){ return chartHeight - yScale(parseInt(d.stats.returndata.bpconverted));}
									break;
									case "html":
										return function(d){ 
												currentPercentage = Math.round(d.stats.returndata.bpconverted.replace("%",""))
												
												let playerData = $(".charts--player-data");
												playerData.removeClass("charts--hidden");
												
												
												chartsPlayerData.empty();

												chartsPlayerData.append("<p><strong>" + d.name + "</strong> (" + d.age + ") <strong>  Rank: </strong>" + d.rank +   "</p>");
												chartsPlayerData.append("<strong>Stats:</strong>");
												chartsPlayerData.append("<br><strong>Return BP Converted Percentage: </strong>" + currentPercentage + "%");
												chartsPlayerData.append("<br><br><strong>Comments:</strong>");
												if(currentPercentage > aboveMean){

														aboveGreen = Math.round(currentPercentage - aboveMean);
														aboveBlack = Math.round(currentPercentage - dataMean);
														chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is in the <strong>Top Group</strong> by " + aboveGreen + "%");
														chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is above the <strong>Average Group</strong> by " + aboveBlack + "%");

												} else if( currentPercentage < aboveMean && currentPercentage > dataMean){
													
													aboveBlack = Math.round(currentPercentage - dataMean);
													belowGreen = Math.round(aboveMean - currentPercentage);
													chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is in the <strong>Average Group</strong> by " + aboveBlack + "%");
													chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is below the <strong>Top Group</strong> by " + belowGreen + "%");

												} else if(currentPercentage < dataMean && currentPercentage > belowMean){
													belowBlack = Math.round(dataMean - currentPercentage);
													chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is in the <strong>Below Average Group</strong> by " + belowBlack + "%");
													aboveRed = Math.round(currentPercentage - belowMean);
													chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is above the <strong>Lowest Average Group</strong> by " + aboveRed + "%");
												}
												else if(currentPercentage < belowMean){
														belowRed = Math.round(belowMean - currentPercentage);
														chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is in the <strong>Lowest Average Group</strong> by " + belowRed + "%");
														belowBlack = Math.round(dataMean - currentPercentage);
														chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is below the <strong>Average Group</strong> by " + belowBlack + "%");
												}

												chartsPlayerData.append("<br><br><strong>Average(Black): </strong>" + Math.round(dataMean) + "%");
												chartsPlayerData.append("<br><strong>Above Average(Green): </strong>" + Math.round(aboveMean) + "%");
												chartsPlayerData.append("<br><strong>Below Average(Red): </strong>" + Math.round(belowMean) + "%");}
									break;
									
								}
							break;
							case "returngameswon":
								switch(attr){
									case "rect_y":
										return function(d){ return yScale(parseInt(d.stats.returndata.returngameswon));}
									break;
									case "rect_h":
										return function(d){ return chartHeight - yScale(parseInt(d.stats.returndata.returngameswon));}
									break;
									case "html":
										return function(d){ 
												currentPercentage = Math.round(d.stats.returndata.returngameswon.replace("%",""))
												
												let playerData = $(".charts--player-data");
												playerData.removeClass("charts--hidden");
												
												
												chartsPlayerData.empty();

												chartsPlayerData.append("<p><strong>" + d.name + "</strong> (" + d.age + ") <strong>  Rank: </strong>" + d.rank +   "</p>");
												chartsPlayerData.append("<strong>Stats:</strong>");
												chartsPlayerData.append("<br><strong>eturn Games Won Percentage: </strong>" + currentPercentage + "%");
												chartsPlayerData.append("<br><br><strong>Comments:</strong>");
												if(currentPercentage > aboveMean){

														aboveGreen = Math.round(currentPercentage - aboveMean);
														aboveBlack = Math.round(currentPercentage - dataMean);
														chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is in the <strong>Top Group</strong> by " + aboveGreen + "%");
														chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is above the <strong>Average Group</strong> by " + aboveBlack + "%");

												} else if( currentPercentage < aboveMean && currentPercentage > dataMean){
													
													aboveBlack = Math.round(currentPercentage - dataMean);
													belowGreen = Math.round(aboveMean - currentPercentage);
													chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is in the <strong>Average Group</strong> by " + aboveBlack + "%");
													chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is below the <strong>Top Group</strong> by " + belowGreen + "%");

												} else if(currentPercentage < dataMean && currentPercentage > belowMean){
													belowBlack = Math.round(dataMean - currentPercentage);
													chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is in the <strong>Below Average Group</strong> by " + belowBlack + "%");
													aboveRed = Math.round(currentPercentage - belowMean);
													chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is above the <strong>Lowest Average Group</strong> by " + aboveRed + "%");
												}
												else if(currentPercentage < belowMean){
														belowRed = Math.round(belowMean - currentPercentage);
														chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is in the <strong>Lowest Average Group</strong> by " + belowRed + "%");
														belowBlack = Math.round(dataMean - currentPercentage);
														chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is below the <strong>Average Group</strong> by " + belowBlack + "%");
												}

												chartsPlayerData.append("<br><br><strong>Average(Black): </strong>" + Math.round(dataMean) + "%");
												chartsPlayerData.append("<br><strong>Above Average(Green): </strong>" + Math.round(aboveMean) + "%");
												chartsPlayerData.append("<br><strong>Below Average(Red): </strong>" + Math.round(belowMean) + "%");}
									break;
									
								}
							break;
							case "returnpointswon":
								switch(attr){
									case "rect_y":
										return function(d){ return yScale(parseInt(d.stats.returndata.returnpointswon));}
									break;
									case "rect_h":
										return function(d){ return chartHeight - yScale(parseInt(d.stats.returndata.returnpointswon));}
									break;
									case "html":
										return function(d){ 
												currentPercentage = Math.round(d.stats.returndata.returnpointswon.replace("%",""))
												
												let playerData = $(".charts--player-data");
												playerData.removeClass("charts--hidden");
												
												
												chartsPlayerData.empty();

												chartsPlayerData.append("<p><strong>" + d.name + "</strong> (" + d.age + ") <strong>  Rank: </strong>" + d.rank +   "</p>");
												chartsPlayerData.append("<strong>Stats:</strong>");
												chartsPlayerData.append("<br><strong>Return Points Percentage: </strong>" + currentPercentage + "%");
												chartsPlayerData.append("<br><br><strong>Comments:</strong>");
												if(currentPercentage > aboveMean){

														aboveGreen = Math.round(currentPercentage - aboveMean);
														aboveBlack = Math.round(currentPercentage - dataMean);
														chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is in the <strong>Top Group</strong> by " + aboveGreen + "%");
														chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is above the <strong>Average Group</strong> by " + aboveBlack + "%");

												} else if( currentPercentage < aboveMean && currentPercentage > dataMean){
													
													aboveBlack = Math.round(currentPercentage - dataMean);
													belowGreen = Math.round(aboveMean - currentPercentage);
													chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is in the <strong>Average Group</strong> by " + aboveBlack + "%");
													chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is below the <strong>Top Group</strong> by " + belowGreen + "%");

												} else if(currentPercentage < dataMean && currentPercentage > belowMean){
													belowBlack = Math.round(dataMean - currentPercentage);
													chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is in the <strong>Below Average Group</strong> by " + belowBlack + "%");
													aboveRed = Math.round(currentPercentage - belowMean);
													chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is above the <strong>Lowest Average Group</strong> by " + aboveRed + "%");
												}
												else if(currentPercentage < belowMean){
														belowRed = Math.round(belowMean - currentPercentage);
														chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is in the <strong>Lowest Average Group</strong> by " + belowRed + "%");
														belowBlack = Math.round(dataMean - currentPercentage);
														chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is below the <strong>Average Group</strong> by " + belowBlack + "%");
												}

												chartsPlayerData.append("<br><br><strong>Average(Black): </strong>" + Math.round(dataMean) + "%");
												chartsPlayerData.append("<br><strong>Above Average(Green): </strong>" + Math.round(aboveMean) + "%");
												chartsPlayerData.append("<br><strong>Below Average(Red): </strong>" + Math.round(belowMean) + "%");}
									break;
									
								}
							break;
							case "totalpointswon":
								switch(attr){
									case "rect_y":
										return function(d){ return yScale(parseInt(d.stats.returndata.totalpointswon));}
									break;
									case "rect_h":
										return function(d){ return chartHeight - yScale(parseInt(d.stats.returndata.totalpointswon));}
									break;
									case "html":
										return function(d){ 
												currentPercentage = Math.round(d.stats.returndata.totalpointswon.replace("%",""))
												
												let playerData = $(".charts--player-data");
												playerData.removeClass("charts--hidden");
												
												
												chartsPlayerData.empty();

												chartsPlayerData.append("<p><strong>" + d.name + "</strong> (" + d.age + ") <strong>  Rank: </strong>" + d.rank +   "</p>");
												chartsPlayerData.append("<strong>Stats:</strong>");
												chartsPlayerData.append("<br><strong>Total Points Won Percentage: </strong>" + currentPercentage + "%");
												chartsPlayerData.append("<br><br><strong>Comments:</strong>");
												if(currentPercentage > aboveMean){

														aboveGreen = Math.round(currentPercentage - aboveMean);
														aboveBlack = Math.round(currentPercentage - dataMean);
														chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is in the <strong>Top Group</strong> by " + aboveGreen + "%");
														chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is above the <strong>Average Group</strong> by " + aboveBlack + "%");

												} else if( currentPercentage < aboveMean && currentPercentage > dataMean){
													
													aboveBlack = Math.round(currentPercentage - dataMean);
													belowGreen = Math.round(aboveMean - currentPercentage);
													chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is in the <strong>Average Group</strong> by " + aboveBlack + "%");
													chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is below the <strong>Top Group</strong> by " + belowGreen + "%");

												} else if(currentPercentage < dataMean && currentPercentage > belowMean){
													belowBlack = Math.round(dataMean - currentPercentage);
													chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is in the <strong>Below Average Group</strong> by " + belowBlack + "%");
													aboveRed = Math.round(currentPercentage - belowMean);
													chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is above the <strong>Lowest Average Group</strong> by " + aboveRed + "%");
												}
												else if(currentPercentage < belowMean){
														belowRed = Math.round(belowMean - currentPercentage);
														chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is in the <strong>Lowest Average Group</strong> by " + belowRed + "%");
														belowBlack = Math.round(dataMean - currentPercentage);
														chartsPlayerData.append("<br><strong>" + chart.GetFirstName(d.name) + "</strong> is below the <strong>Average Group</strong> by " + belowBlack + "%");
												}

												chartsPlayerData.append("<br><br><strong>Average(Black): </strong>" + Math.round(dataMean) + "%");
												chartsPlayerData.append("<br><strong>Above Average(Green): </strong>" + Math.round(aboveMean) + "%");
												chartsPlayerData.append("<br><strong>Below Average(Red): </strong>" + Math.round(belowMean) + "%");}
									break;
								}
							break;
							
						}
					}
		};

		
		if( actionArr[0] === "servicedata" ){
			switch(actionArr[1]){
				case "aces":
				
				maxScaleY = d3.max(playerStatData, function(d){ return parseInt((d.stats.servicedata.aces/d.stats.servicedata.gamesplayed)*100);});
				dataMean  = d3.mean(playerStatData, function(d){ return parseInt((d.stats.servicedata.aces/d.stats.servicedata.gamesplayed)*100);});
				belowMean = chart.GetMeanData(playerStatData,dataMean,actionArr,"below");
				aboveMean = chart.GetMeanData(playerStatData,dataMean,actionArr,"above");
				topPer = chart.GetPlayersList(playerStatData,dataMean,belowMean,aboveMean,"top",actionArr);
				abovePer = chart.GetPlayersList(playerStatData,dataMean,belowMean,aboveMean,"above",actionArr);
				belowPer = chart.GetPlayersList(playerStatData,dataMean,belowMean,aboveMean,"below",actionArr);
				lowestPer = chart.GetPlayersList(playerStatData,dataMean,belowMean,aboveMean,"lowest",actionArr);




				chartsPlayerPerformanceData.append(chart.GeneratePerformersHTML(topPer,"Top",mongodb));
				chartsPlayerPerformanceData.append(chart.GeneratePerformersHTML(abovePer,"Above",mongodb));
				chartsPlayerPerformanceData.append(chart.GeneratePerformersHTML(belowPer,"Below",mongodb));
				chartsPlayerPerformanceData.append(chart.GeneratePerformersHTML(lowestPer,"Lowest",mongodb));
				chartsPlayerPerformanceData.removeClass("charts--hidden");

				

				mongodb === "atp" ? pageTitle = "ATP Service Data - Aces": pageTitle = "Next Generation - Service Data - Aces";
				break;

				case "doublefaults":
				
				maxScaleY = d3.max(playerStatData, function(d){ return parseInt((d.stats.servicedata.doublefaults/d.stats.servicedata.gamesplayed)*100);});
				dataMean  = d3.mean(playerStatData, function(d){ return parseInt((d.stats.servicedata.doublefaults/d.stats.servicedata.gamesplayed)*100);});
				belowMean = chart.GetMeanData(playerStatData,dataMean,actionArr,"below");
				aboveMean = chart.GetMeanData(playerStatData,dataMean,actionArr,"above");
				topPer = chart.GetPlayersList(playerStatData,dataMean,belowMean,aboveMean,"top",actionArr);
				abovePer = chart.GetPlayersList(playerStatData,dataMean,belowMean,aboveMean,"above",actionArr);
				belowPer = chart.GetPlayersList(playerStatData,dataMean,belowMean,aboveMean,"below",actionArr);
				lowestPer = chart.GetPlayersList(playerStatData,dataMean,belowMean,aboveMean,"lowest",actionArr);	
				chartsPlayerPerformanceData.append(chart.GeneratePerformersHTML(topPer.reverse(),"Top",mongodb));
				chartsPlayerPerformanceData.append(chart.GeneratePerformersHTML(abovePer.reverse(),"Above",mongodb));
				chartsPlayerPerformanceData.append(chart.GeneratePerformersHTML(belowPer.reverse(),"Below",mongodb));
				chartsPlayerPerformanceData.append(chart.GeneratePerformersHTML(lowestPer.reverse(),"Lowest",mongodb));
				chartsPlayerPerformanceData.removeClass("charts--hidden");
				mongodb === "atp" ? pageTitle = "ATP Service Data - Double Faults" : pageTitle = "Next Generation - Service Data - Double Faults";
				break;

				case "fspercent":
				maxScaleY = d3.max(playerStatData, function(d){ return parseInt(d.stats.servicedata.fspercent.replace("%",""));});
				dataMean = d3.mean(playerStatData, function(d){ return parseInt(d.stats.servicedata.fspercent.replace("%",""));});
				belowMean = chart.GetMeanData(playerStatData,dataMean,actionArr,"below");
				aboveMean = chart.GetMeanData(playerStatData,dataMean,actionArr,"above");
				topPer = chart.GetPlayersList(playerStatData,dataMean,belowMean,aboveMean,"top",actionArr);
				abovePer = chart.GetPlayersList(playerStatData,dataMean,belowMean,aboveMean,"above",actionArr);
				belowPer = chart.GetPlayersList(playerStatData,dataMean,belowMean,aboveMean,"below",actionArr);
				lowestPer = chart.GetPlayersList(playerStatData,dataMean,belowMean,aboveMean,"lowest",actionArr);
				chartsPlayerPerformanceData.append(chart.GeneratePerformersHTML(topPer,"Top",mongodb));
				chartsPlayerPerformanceData.append(chart.GeneratePerformersHTML(abovePer,"Above",mongodb));
				chartsPlayerPerformanceData.append(chart.GeneratePerformersHTML(belowPer,"Below",mongodb));
				chartsPlayerPerformanceData.append(chart.GeneratePerformersHTML(lowestPer,"Lowest",mongodb));
				chartsPlayerPerformanceData.removeClass("charts--hidden");
				mongodb === "atp" ? pageTitle = "ATP Service Data - 1st Serve %" : pageTitle = "Next Generation - Service Data - 1st Serve %";
				break;

				case "fspointswon":
				maxScaleY = d3.max(playerStatData, function(d){ return parseInt(d.stats.servicedata.fspointswon.replace("%",""));});
				dataMean = d3.mean(playerStatData, function(d){ return parseInt(d.stats.servicedata.fspointswon.replace("%",""));});
				belowMean = chart.GetMeanData(playerStatData,dataMean,actionArr,"below");
				aboveMean = chart.GetMeanData(playerStatData,dataMean,actionArr,"above");
				topPer = chart.GetPlayersList(playerStatData,dataMean,belowMean,aboveMean,"top",actionArr);
				abovePer = chart.GetPlayersList(playerStatData,dataMean,belowMean,aboveMean,"above",actionArr);
				belowPer = chart.GetPlayersList(playerStatData,dataMean,belowMean,aboveMean,"below",actionArr);
				lowestPer = chart.GetPlayersList(playerStatData,dataMean,belowMean,aboveMean,"lowest",actionArr);
				chartsPlayerPerformanceData.append(chart.GeneratePerformersHTML(topPer,"Top",mongodb));
				chartsPlayerPerformanceData.append(chart.GeneratePerformersHTML(abovePer,"Above",mongodb));
				chartsPlayerPerformanceData.append(chart.GeneratePerformersHTML(belowPer,"Below",mongodb));
				chartsPlayerPerformanceData.append(chart.GeneratePerformersHTML(lowestPer,"Lowest",mongodb));
				chartsPlayerPerformanceData.removeClass("charts--hidden");
				mongodb === "atp" ? pageTitle = "ATP Service Data - 1st Serve Points Won %" : pageTitle = "Next Generation - Service Data - 1st Serve Points Won %";
				break;

				case "sspointswon":
				maxScaleY = d3.max(playerStatData, function(d){ return parseInt(d.stats.servicedata.sspointswon.replace("%",""));});
				dataMean = d3.mean(playerStatData, function(d){ return parseInt(d.stats.servicedata.sspointswon.replace("%",""));});
				belowMean = chart.GetMeanData(playerStatData,dataMean,actionArr,"below");
				aboveMean = chart.GetMeanData(playerStatData,dataMean,actionArr,"above");
				topPer = chart.GetPlayersList(playerStatData,dataMean,belowMean,aboveMean,"top",actionArr);
				abovePer = chart.GetPlayersList(playerStatData,dataMean,belowMean,aboveMean,"above",actionArr);
				belowPer = chart.GetPlayersList(playerStatData,dataMean,belowMean,aboveMean,"below",actionArr);
				lowestPer = chart.GetPlayersList(playerStatData,dataMean,belowMean,aboveMean,"lowest",actionArr);
				chartsPlayerPerformanceData.append(chart.GeneratePerformersHTML(topPer,"Top",mongodb));
				chartsPlayerPerformanceData.append(chart.GeneratePerformersHTML(abovePer,"Above",mongodb));
				chartsPlayerPerformanceData.append(chart.GeneratePerformersHTML(belowPer,"Below",mongodb));
				chartsPlayerPerformanceData.append(chart.GeneratePerformersHTML(lowestPer,"Lowest",mongodb));
				chartsPlayerPerformanceData.removeClass("charts--hidden");
				mongodb === "atp" ? pageTitle = "ATP Service Data - 2nd Serve Points Won %" : pageTitle = "Next Generation - Service Data - 2nd Serve Points Won %";
				break;

				case "bpsaved":
				maxScaleY = d3.max(playerStatData, function(d){ return parseInt(d.stats.servicedata.bpsaved.replace("%",""));});
				dataMean = d3.mean(playerStatData, function(d){ return parseInt(d.stats.servicedata.bpsaved.replace("%",""));});
				belowMean = chart.GetMeanData(playerStatData,dataMean,actionArr,"below");
				aboveMean = chart.GetMeanData(playerStatData,dataMean,actionArr,"above");
				topPer = chart.GetPlayersList(playerStatData,dataMean,belowMean,aboveMean,"top",actionArr);
				abovePer = chart.GetPlayersList(playerStatData,dataMean,belowMean,aboveMean,"above",actionArr);
				belowPer = chart.GetPlayersList(playerStatData,dataMean,belowMean,aboveMean,"below",actionArr);
				lowestPer = chart.GetPlayersList(playerStatData,dataMean,belowMean,aboveMean,"lowest",actionArr);	
				chartsPlayerPerformanceData.append(chart.GeneratePerformersHTML(topPer,"Top",mongodb));
				chartsPlayerPerformanceData.append(chart.GeneratePerformersHTML(abovePer,"Above",mongodb));
				chartsPlayerPerformanceData.append(chart.GeneratePerformersHTML(belowPer,"Below",mongodb));
				chartsPlayerPerformanceData.append(chart.GeneratePerformersHTML(lowestPer,"Lowest",mongodb));
				chartsPlayerPerformanceData.removeClass("charts--hidden");
				mongodb === "atp" ? pageTitle = "ATP Service Data - Break Points Saved %" : pageTitle = "Next Generation - Service Data - Break Points Saved %";
				break;

				case "gameswon":
				maxScaleY = d3.max(playerStatData, function(d){ return parseInt(d.stats.servicedata.gameswon.replace("%",""));});
				dataMean = d3.mean(playerStatData, function(d){ return parseInt(d.stats.servicedata.gameswon.replace("%",""));});
				belowMean = chart.GetMeanData(playerStatData,dataMean,actionArr,"below");
				aboveMean = chart.GetMeanData(playerStatData,dataMean,actionArr,"above");
				topPer = chart.GetPlayersList(playerStatData,dataMean,belowMean,aboveMean,"top",actionArr);
				abovePer = chart.GetPlayersList(playerStatData,dataMean,belowMean,aboveMean,"above",actionArr);
				belowPer = chart.GetPlayersList(playerStatData,dataMean,belowMean,aboveMean,"below",actionArr);
				lowestPer = chart.GetPlayersList(playerStatData,dataMean,belowMean,aboveMean,"lowest",actionArr);					
				chartsPlayerPerformanceData.append(chart.GeneratePerformersHTML(topPer,"Top",mongodb));
				chartsPlayerPerformanceData.append(chart.GeneratePerformersHTML(abovePer,"Above",mongodb));
				chartsPlayerPerformanceData.append(chart.GeneratePerformersHTML(belowPer,"Below",mongodb));
				chartsPlayerPerformanceData.append(chart.GeneratePerformersHTML(lowestPer,"Lowest",mongodb));
				chartsPlayerPerformanceData.removeClass("charts--hidden");			
				mongodb === "atp" ? pageTitle = "ATP Service Data - Games Won %" : pageTitle = "Next Generation - Service Data - Games Won %";
				break;

				case "totalpointswon":			
				maxScaleY = d3.max(playerStatData, function(d){ return parseInt(d.stats.servicedata.totalpointswon.replace("%",""));});
				dataMean = d3.mean(playerStatData, function(d){ return parseInt(d.stats.servicedata.totalpointswon.replace("%",""));});
				belowMean = chart.GetMeanData(playerStatData,dataMean,actionArr,"below");
				aboveMean = chart.GetMeanData(playerStatData,dataMean,actionArr,"above");
				topPer = chart.GetPlayersList(playerStatData,dataMean,belowMean,aboveMean,"top",actionArr);
				abovePer = chart.GetPlayersList(playerStatData,dataMean,belowMean,aboveMean,"above",actionArr);
				belowPer = chart.GetPlayersList(playerStatData,dataMean,belowMean,aboveMean,"below",actionArr);
				lowestPer = chart.GetPlayersList(playerStatData,dataMean,belowMean,aboveMean,"lowest",actionArr);					
				chartsPlayerPerformanceData.append(chart.GeneratePerformersHTML(topPer,"Top",mongodb));
				chartsPlayerPerformanceData.append(chart.GeneratePerformersHTML(abovePer,"Above",mongodb));
				chartsPlayerPerformanceData.append(chart.GeneratePerformersHTML(belowPer,"Below",mongodb));
				chartsPlayerPerformanceData.append(chart.GeneratePerformersHTML(lowestPer,"Lowest",mongodb));
				chartsPlayerPerformanceData.removeClass("charts--hidden");				
				mongodb === "atp" ? pageTitle = "ATP Service Data - Total Points Won %" : pageTitle = "Next Generation - Service Data - Total Points Won %";
				break;
			}
		}
		else if( actionArr[0] === "returndata" ){
			switch(actionArr[1]){
				case "fsreturnpointswon":				
				maxScaleY = d3.max(playerStatData, function(d){ return parseInt(d.stats.returndata.fsreturnpointswon.replace("%",""));});
				dataMean = d3.mean(playerStatData, function(d){ return parseInt(d.stats.returndata.fsreturnpointswon.replace("%",""));});
				belowMean = chart.GetMeanData(playerStatData,dataMean,actionArr,"below");
				aboveMean = chart.GetMeanData(playerStatData,dataMean,actionArr,"above");
				topPer = chart.GetPlayersList(playerStatData,dataMean,belowMean,aboveMean,"top",actionArr);
				abovePer = chart.GetPlayersList(playerStatData,dataMean,belowMean,aboveMean,"above",actionArr);
				belowPer = chart.GetPlayersList(playerStatData,dataMean,belowMean,aboveMean,"below",actionArr);
				lowestPer = chart.GetPlayersList(playerStatData,dataMean,belowMean,aboveMean,"lowest",actionArr);					
				chartsPlayerPerformanceData.append(chart.GeneratePerformersHTML(topPer,"Top",mongodb));
				chartsPlayerPerformanceData.append(chart.GeneratePerformersHTML(abovePer,"Above",mongodb));
				chartsPlayerPerformanceData.append(chart.GeneratePerformersHTML(belowPer,"Below",mongodb));
				chartsPlayerPerformanceData.append(chart.GeneratePerformersHTML(lowestPer,"Lowest",mongodb));
				chartsPlayerPerformanceData.removeClass("charts--hidden");			
				mongodb === "atp" ? pageTitle = "ATP Return Data - 1st Serve Points Won %" : pageTitle = "Next Generation - Return Data - 1st Serve Points Won %";
				break;

				case "ssreturnpointswon":				
				maxScaleY = d3.max(playerStatData, function(d){ return parseInt(d.stats.returndata.ssreturnpointswon.replace("%",""));});
				dataMean = d3.mean(playerStatData, function(d){ return parseInt(d.stats.returndata.ssreturnpointswon.replace("%",""));});
				belowMean = chart.GetMeanData(playerStatData,dataMean,actionArr,"below");
				aboveMean = chart.GetMeanData(playerStatData,dataMean,actionArr,"above");
				topPer = chart.GetPlayersList(playerStatData,dataMean,belowMean,aboveMean,"top",actionArr);
				abovePer = chart.GetPlayersList(playerStatData,dataMean,belowMean,aboveMean,"above",actionArr);
				belowPer = chart.GetPlayersList(playerStatData,dataMean,belowMean,aboveMean,"below",actionArr);
				lowestPer = chart.GetPlayersList(playerStatData,dataMean,belowMean,aboveMean,"lowest",actionArr);					
				chartsPlayerPerformanceData.append(chart.GeneratePerformersHTML(topPer,"Top",mongodb));
				chartsPlayerPerformanceData.append(chart.GeneratePerformersHTML(abovePer,"Above",mongodb));
				chartsPlayerPerformanceData.append(chart.GeneratePerformersHTML(belowPer,"Below",mongodb));
				chartsPlayerPerformanceData.append(chart.GeneratePerformersHTML(lowestPer,"Lowest",mongodb));
				chartsPlayerPerformanceData.removeClass("charts--hidden");			
				mongodb === "atp" ? pageTitle = "ATP Return Data - 2nd Serve Points Won %" : pageTitle = "Next Generation - Return Data - 2nd Serve Points Won %";
				break;

				case "bpconverted":
				maxScaleY = d3.max(playerStatData, function(d){ return parseInt(d.stats.returndata.bpconverted.replace("%",""));});
				dataMean = d3.mean(playerStatData, function(d){ return parseInt(d.stats.returndata.bpconverted.replace("%",""));});
				belowMean = chart.GetMeanData(playerStatData,dataMean,actionArr,"below");
				aboveMean = chart.GetMeanData(playerStatData,dataMean,actionArr,"above");
				topPer = chart.GetPlayersList(playerStatData,dataMean,belowMean,aboveMean,"top",actionArr);
				abovePer = chart.GetPlayersList(playerStatData,dataMean,belowMean,aboveMean,"above",actionArr);
				belowPer = chart.GetPlayersList(playerStatData,dataMean,belowMean,aboveMean,"below",actionArr);
				lowestPer = chart.GetPlayersList(playerStatData,dataMean,belowMean,aboveMean,"lowest",actionArr);					
				chartsPlayerPerformanceData.append(chart.GeneratePerformersHTML(topPer,"Top",mongodb));
				chartsPlayerPerformanceData.append(chart.GeneratePerformersHTML(abovePer,"Above",mongodb));
				chartsPlayerPerformanceData.append(chart.GeneratePerformersHTML(belowPer,"Below",mongodb));
				chartsPlayerPerformanceData.append(chart.GeneratePerformersHTML(lowestPer,"Lowest",mongodb));
				chartsPlayerPerformanceData.removeClass("charts--hidden");				
				mongodb === "atp" ? pageTitle = "ATP Return Data - Break Points Converted %" : pageTitle = "Next Generation - Return Data - Break Points Converted %";
				break;

				case "returngameswon":				
				maxScaleY = d3.max(playerStatData, function(d){ return parseInt(d.stats.returndata.returngameswon.replace("%",""));});
				dataMean = d3.mean(playerStatData, function(d){ return parseInt(d.stats.returndata.returngameswon.replace("%",""));});
				belowMean = chart.GetMeanData(playerStatData,dataMean,actionArr,"below");
				aboveMean = chart.GetMeanData(playerStatData,dataMean,actionArr,"above");
				topPer = chart.GetPlayersList(playerStatData,dataMean,belowMean,aboveMean,"top",actionArr);
				abovePer = chart.GetPlayersList(playerStatData,dataMean,belowMean,aboveMean,"above",actionArr);
				belowPer = chart.GetPlayersList(playerStatData,dataMean,belowMean,aboveMean,"below",actionArr);
				lowestPer = chart.GetPlayersList(playerStatData,dataMean,belowMean,aboveMean,"lowest",actionArr);					
				chartsPlayerPerformanceData.append(chart.GeneratePerformersHTML(topPer,"Top",mongodb));
				chartsPlayerPerformanceData.append(chart.GeneratePerformersHTML(abovePer,"Above",mongodb));
				chartsPlayerPerformanceData.append(chart.GeneratePerformersHTML(belowPer,"Below",mongodb));
				chartsPlayerPerformanceData.append(chart.GeneratePerformersHTML(lowestPer,"Lowest",mongodb));
				chartsPlayerPerformanceData.removeClass("charts--hidden");				
				mongodb === "atp" ? pageTitle = "ATP Return Data - Return Games Won %" : pageTitle = "Next Generation - Return Data - Return Games Won %";
				break;

				case "returnpointswon":				
				maxScaleY = d3.max(playerStatData, function(d){ return parseInt(d.stats.returndata.returnpointswon.replace("%",""));});
				dataMean = d3.mean(playerStatData, function(d){ return parseInt(d.stats.returndata.returnpointswon.replace("%",""));});
				belowMean = chart.GetMeanData(playerStatData,dataMean,actionArr,"below");
				aboveMean = chart.GetMeanData(playerStatData,dataMean,actionArr,"above");
				topPer = chart.GetPlayersList(playerStatData,dataMean,belowMean,aboveMean,"top",actionArr);
				abovePer = chart.GetPlayersList(playerStatData,dataMean,belowMean,aboveMean,"above",actionArr);
				belowPer = chart.GetPlayersList(playerStatData,dataMean,belowMean,aboveMean,"below",actionArr);
				lowestPer = chart.GetPlayersList(playerStatData,dataMean,belowMean,aboveMean,"lowest",actionArr);					
				chartsPlayerPerformanceData.append(chart.GeneratePerformersHTML(topPer,"Top",mongodb));
				chartsPlayerPerformanceData.append(chart.GeneratePerformersHTML(abovePer,"Above",mongodb));
				chartsPlayerPerformanceData.append(chart.GeneratePerformersHTML(belowPer,"Below",mongodb));
				chartsPlayerPerformanceData.append(chart.GeneratePerformersHTML(lowestPer,"Lowest",mongodb));
				chartsPlayerPerformanceData.removeClass("charts--hidden");			
				mongodb === "atp" ? pageTitle = "ATP Return Data - Return Points Won %" : pageTitle = "Next Generation - Return Data - Return Points Won %";
				break;

				case "totalpointswon":
				
				maxScaleY = d3.max(playerStatData, function(d){ return parseInt(d.stats.returndata.totalpointswon.replace("%",""));});
				dataMean = d3.mean(playerStatData, function(d){ return parseInt(d.stats.returndata.totalpointswon.replace("%",""));});
				belowMean = chart.GetMeanData(playerStatData,dataMean,actionArr,"below");
				aboveMean = chart.GetMeanData(playerStatData,dataMean,actionArr,"above");
				topPer = chart.GetPlayersList(playerStatData,dataMean,belowMean,aboveMean,"top",actionArr);
				abovePer = chart.GetPlayersList(playerStatData,dataMean,belowMean,aboveMean,"above",actionArr);
				belowPer = chart.GetPlayersList(playerStatData,dataMean,belowMean,aboveMean,"below",actionArr);
				lowestPer = chart.GetPlayersList(playerStatData,dataMean,belowMean,aboveMean,"lowest",actionArr);					
				chartsPlayerPerformanceData.append(chart.GeneratePerformersHTML(topPer,"Top",mongodb));
				chartsPlayerPerformanceData.append(chart.GeneratePerformersHTML(abovePer,"Above",mongodb));
				chartsPlayerPerformanceData.append(chart.GeneratePerformersHTML(belowPer,"Below",mongodb));
				chartsPlayerPerformanceData.append(chart.GeneratePerformersHTML(lowestPer,"Lowest",mongodb));
				chartsPlayerPerformanceData.removeClass("charts--hidden");				
				mongodb === "atp" ? pageTitle = "ATP Return Data - Total Points Won %" : pageTitle = "Next Generation - Return Data - Total Points Won %";
				break;

			}
		}
		
		let xScale = d3.scaleLinear().domain( [ minScaleX, maxScaleX] ).range( [ 0, chartWidth] ).clamp(false);
		let yScale = d3.scaleLinear().domain( [ minScaleY, maxScaleY ] ).range( [ chartHeight, 0] );
		let xAxis = d3.axisBottom(xScale);
		let yAxis = d3.axisLeft(yScale);

		barChart.append("g").attr("transform", "translate(0," + chartHeight + ")").call(xAxis);
		barChart.append("g").call(yAxis);
			
		barChart.selectAll("svg").append("g")
							.data(playerStatData)
							.enter()
							.append("rect")
							.on("click", SetAttr(actionArr, "html"))
							.attr("class", function(d){if(d.name === "Akira Santillan"){return "akira";}return "bar";})
							.attr("x", function(d,i){ return i *(chartWidth / playerStatData.length) })
							.attr("y", SetAttr(actionArr, "rect_y"))
							.attr("rx", function(){
								if(playerStatData.length > 50){ return 5}
									return 20;
							})
    						.attr("ry", function(){
								if(playerStatData.length > 50){ return 5}
									return 20;
							})
							.attr("width", chartWidth / playerStatData.length - 2)
							.attr("height", SetAttr(actionArr, "rect_h"))
							.attr("name", function(d){ return d.name;})	
							.attr("rank", function(d){ return d.rank;})
							.append("svg:title")
							.text(function(d){ 
								return d.name 
								+ " (" + d.age + ")"
								+ "\nPoints: " + d.points 
								+ "\nTournaments: " + d.tournamentsplayed 
								+ "\nClick for more Info";});

							barChart.append("g").append("line")
							.style("stroke", "black")  
							.style("stroke-width", "2")
							.style("stroke-dasharray", ("20,2"))
							.style("opacity", .6)
    						.attr("x1", 0)     
    						.attr("y1", yScale(dataMean))      
    						.attr("x2", chartWidth)     
    						.attr("y2", yScale(dataMean))
    						.append("svg:title")
							.text(function(){ return "Average: " + Math.round(dataMean) + "%";});   

							barChart.append("g").append("line")
							.style("stroke", function(d){
								if(actionArr[0] === "servicedata"){
									if(actionArr[1] === "doublefaults") {
										return "green";
									}
								}
								return "red";
							})
							.style("stroke-width", "2")
							.style("opacity", .6)
							.style("stroke-dasharray", ("20,2"))
    						.attr("x1", 0)     
    						.attr("y1", yScale(belowMean))      
    						.attr("x2", chartWidth)     
    						.attr("y2", yScale(belowMean))
    						.append("svg:title")
							.text(function(){ 
									if(actionArr[0] === "servicedata"){
										if(actionArr[1] === "doublefaults") {
											return "Above Average: " + Math.round(belowMean) + "%";
										}
								}
								return "Below Average: " + Math.round(aboveMean) + "%";
								});  

							barChart.append("g").append("line")
							.style("stroke", function(d){
								if(actionArr[0] === "servicedata"){
									if(actionArr[1] === "doublefaults") {
										return "red";
									}
								}
								return "green";
							})
							.style("stroke-width", "2")
							.style("opacity", .6)
							.style("stroke-dasharray", ("20,2"))
    						.attr("x1", 0)     
    						.attr("y1", yScale(aboveMean))      
    						.attr("x2", chartWidth)     
    						.attr("y2", yScale(aboveMean))
    						.append("svg:title")
							.text(function(){ 
									if(actionArr[0] === "servicedata"){
									if(actionArr[1] === "doublefaults") {
										return "Below Average: " + Math.round(aboveMean) + "%";
									}
								}
								return "Above Average: " + Math.round(aboveMean) + "%";


								});  

    						barChart.append("g").append("text")
							.attr("x", (chartWidth / 2))             
        					.attr("y", 0 - (15 / 2))
        					.attr("text-anchor", "middle")  
        					.style("font-size", "16px") 
        					.style("text-decoration", "underline")  
        					.text(pageTitle); 

        					barChart.append("g").append("text")
							.attr("x", (chartWidth / 2))             
        					.attr("y", chartHeight + 32)
        					.attr("text-anchor", "middle")  
        					.style("font-size", "12px") 
        					.text(" -- Player Rankings -- ");

       //  					barChart.append("g").append("text")
							// .attr("x", (chartWidth /10))             
       //  					.attr("y", chartHeight +32)
       //  					.attr("text-anchor", "middle")  
       //  					.style("font-size", "12px")
       //  					.style("font-weight", "bold") 
       //  					.style("fill", "green")
       //  					.text("Above Average: " + Math.round(aboveMean) + "%");
        					
       //  					barChart.append("g").append("text")
							// .attr("x", (chartWidth /6 +12 ))             
       //  					.attr("y", chartHeight +32)
       //  					.attr("text-anchor", "middle")  
       //  					.style("font-size", "12px") 
       //  					.style("font-weight", "bold") 
       //  					.text("Average: " + Math.round(dataMean) + "%");
        					
       //  					barChart.append("g").append("text")
							// .attr("x", (chartWidth /4))             
       //  					.attr("y", chartHeight +32)
       //  					.attr("text-anchor", "middle")  
       //  					.style("font-size", "12px") 
       //  					.style("font-weight", "bold") 
       //  					.text("Below Average: " + Math.round(belowMean) + "%")
       //  					.style("fill", "red") ;

        					barChart.append("g").append("text")
        					.attr("transform", "rotate(-90)")
							.attr("x", -chartHeight/2)             
        					.attr("y", -30)
        					.attr("text-anchor", "middle")  
        					.style("font-size", "12px") 
        					.text(" -- Percentage -- ");  
	}
	GetPlayersList(playerStatData,mean,belowMean,aboveMean,type,dataArr){
			var percent;
			var top = [];
			var above = [];
			var below = [];
			var lowest = [];
			var arr = [];

			$.each(playerStatData,function(index, el) {
				if( dataArr[0] === "servicedata" ){
						switch(dataArr[1]){
							case "aces":
								percent = parseInt((playerStatData[index].stats.servicedata.aces/playerStatData[index].stats.servicedata.gamesplayed)*100);
								if(percent > aboveMean){ 
										top.push([playerStatData[index].name,percent,playerStatData[index].url]);

								}
								if(percent <= aboveMean && percent > mean	){
											above.push([playerStatData[index].name,percent,playerStatData[index].url]);
											
								}
								if(percent < mean && percent > belowMean){
										below.push([playerStatData[index].name,percent,playerStatData[index].url]);
								}
								if(percent < belowMean){
									lowest.push([playerStatData[index].name,percent,playerStatData[index].url]);
								}
							break;
							case "doublefaults":
								percent = parseInt((playerStatData[index].stats.servicedata.doublefaults/playerStatData[index].stats.servicedata.gamesplayed)*100);
								
								//console.log("percent",percent);
								//console.log("aboveMean",aboveMean);
								//console.log("belowMean",belowMean);
								//console.log("mean",mean);
								if(percent < belowMean){ 
										top.push([playerStatData[index].name,percent,playerStatData[index].url]);

								}
								if(percent >= belowMean && percent < mean	){
											above.push([playerStatData[index].name,percent,playerStatData[index].url]);
											
								}
								if(percent > mean && percent < aboveMean){
										below.push([playerStatData[index].name,percent,playerStatData[index].url]);
								}
								 if(percent > aboveMean){
									lowest.push([playerStatData[index].name,percent,playerStatData[index].url]);
								 }

							break;

							case "fspercent":
								percent = parseInt(playerStatData[index].stats.servicedata.fspercent.replace("%",""));
								if(percent > aboveMean){ 
										top.push([playerStatData[index].name,percent,playerStatData[index].url]);

								}
								if(percent <= aboveMean && percent > mean	){
											above.push([playerStatData[index].name,percent,playerStatData[index].url]);
											
								}
								if(percent < mean && percent > belowMean){
										below.push([playerStatData[index].name,percent,playerStatData[index].url]);
								}
								if(percent < belowMean){
									lowest.push([playerStatData[index].name,percent,playerStatData[index].url]);
								}
							break;

							case "fspointswon":
								percent = parseInt(playerStatData[index].stats.servicedata.fspointswon.replace("%",""));
								if(percent > aboveMean){ 
										top.push([playerStatData[index].name,percent,playerStatData[index].url]);

								}
								if(percent <= aboveMean && percent > mean	){
											above.push([playerStatData[index].name,percent,playerStatData[index].url]);
											
								}
								if(percent < mean && percent > belowMean){
										below.push([playerStatData[index].name,percent,playerStatData[index].url]);
								}
								if(percent < belowMean){
									lowest.push([playerStatData[index].name,percent,playerStatData[index].url]);
								}
							break;

							case "sspointswon":
								percent = parseInt(playerStatData[index].stats.servicedata.sspointswon.replace("%",""));
								if(percent > aboveMean){ 
										top.push([playerStatData[index].name,percent,playerStatData[index].url]);

								}
								if(percent <= aboveMean && percent > mean	){
											above.push([playerStatData[index].name,percent,playerStatData[index].url]);
											
								}
								if(percent < mean && percent > belowMean){
										below.push([playerStatData[index].name,percent,playerStatData[index].url]);
								}
								if(percent < belowMean){
									lowest.push([playerStatData[index].name,percent,playerStatData[index].url]);
								}
							break;

							case "bpsaved":
								percent = parseInt(playerStatData[index].stats.servicedata.bpsaved.replace("%",""));
								if(percent > aboveMean){ 
										top.push([playerStatData[index].name,percent,playerStatData[index].url]);

								}
								if(percent <= aboveMean && percent > mean	){
											above.push([playerStatData[index].name,percent,playerStatData[index].url]);
											
								}
								if(percent < mean && percent > belowMean){
										below.push([playerStatData[index].name,percent,playerStatData[index].url]);
								}
								if(percent < belowMean){
									lowest.push([playerStatData[index].name,percent,playerStatData[index].url]);
								}
							break;

							case "gameswon":
								percent = parseInt(playerStatData[index].stats.servicedata.gameswon.replace("%",""));
								if(percent > aboveMean){ 
										top.push([playerStatData[index].name,percent,playerStatData[index].url]);

								}
								if(percent <= aboveMean && percent > mean	){
											above.push([playerStatData[index].name,percent,playerStatData[index].url]);
											
								}
								if(percent < mean && percent > belowMean){
										below.push([playerStatData[index].name,percent,playerStatData[index].url]);
								}
								if(percent < belowMean){
									lowest.push([playerStatData[index].name,percent,playerStatData[index].url]);
								}
							break;

							case "totalpointswon":
								percent = parseInt(playerStatData[index].stats.servicedata.totalpointswon.replace("%",""));
								if(percent > aboveMean){ 
										top.push([playerStatData[index].name,percent,playerStatData[index].url]);

								}
								if(percent <= aboveMean && percent > mean	){
											above.push([playerStatData[index].name,percent,playerStatData[index].url]);
											
								}
								if(percent < mean && percent > belowMean){
										below.push([playerStatData[index].name,percent,playerStatData[index].url]);
								}
								if(percent < belowMean){
									lowest.push([playerStatData[index].name,percent,playerStatData[index].url]);
								}
							break;
						}}
				else if (dataArr[0] === "returndata"){
						switch(dataArr[1]){
							case "fsreturnpointswon":
								percent = parseInt(playerStatData[index].stats.returndata.fsreturnpointswon.replace("%",""));
								if(percent > aboveMean){ 
										top.push([playerStatData[index].name,percent,playerStatData[index].url]);

								}
								if(percent <= aboveMean && percent > mean	){
											above.push([playerStatData[index].name,percent,playerStatData[index].url]);
											
								}
								if(percent < mean && percent > belowMean){
										below.push([playerStatData[index].name,percent,playerStatData[index].url]);
								}
								if(percent < belowMean){
									lowest.push([playerStatData[index].name,percent,playerStatData[index].url]);
								}
							break;

							case "ssreturnpointswon":
								percent = parseInt(playerStatData[index].stats.returndata.ssreturnpointswon.replace("%",""));
								if(percent > aboveMean){ 
										top.push([playerStatData[index].name,percent,playerStatData[index].url]);

								}
								if(percent <= aboveMean && percent > mean	){
											above.push([playerStatData[index].name,percent,playerStatData[index].url]);
											
								}
								if(percent < mean && percent > belowMean){
										below.push([playerStatData[index].name,percent,playerStatData[index].url]);
								}
								if(percent < belowMean){
									lowest.push([playerStatData[index].name,percent,playerStatData[index].url]);
								}
							break;

							case "bpconverted":
								percent = parseInt(playerStatData[index].stats.returndata.bpconverted.replace("%",""));
								if(percent > aboveMean){ 
										top.push([playerStatData[index].name,percent,playerStatData[index].url]);

								}
								if(percent <= aboveMean && percent > mean	){
											above.push([playerStatData[index].name,percent,playerStatData[index].url]);
											
								}
								if(percent < mean && percent > belowMean){
										below.push([playerStatData[index].name,percent,playerStatData[index].url]);
								}
								if(percent < belowMean){
									lowest.push([playerStatData[index].name,percent,playerStatData[index].url]);
								}
							break;

							case "returngameswon":
								percent = parseInt(playerStatData[index].stats.returndata.returngameswon.replace("%",""));
								if(percent > aboveMean){ 
										top.push([playerStatData[index].name,percent,playerStatData[index].url]);

								}
								if(percent <= aboveMean && percent > mean	){
											above.push([playerStatData[index].name,percent,playerStatData[index].url]);
											
								}
								if(percent < mean && percent > belowMean){
										below.push([playerStatData[index].name,percent,playerStatData[index].url]);
								}
								if(percent < belowMean){
									lowest.push([playerStatData[index].name,percent,playerStatData[index].url]);
								}
							break;

							case "returnpointswon":
								percent = parseInt(playerStatData[index].stats.returndata.returnpointswon.replace("%",""));
								if(percent > aboveMean){ 
										top.push([playerStatData[index].name,percent,playerStatData[index].url]);

								}
								if(percent <= aboveMean && percent > mean	){
											above.push([playerStatData[index].name,percent,playerStatData[index].url]);
											
								}
								if(percent < mean && percent > belowMean){
										below.push([playerStatData[index].name,percent,playerStatData[index].url]);
								}
								if(percent < belowMean){
									lowest.push([playerStatData[index].name,percent,playerStatData[index].url]);
								}
							break;

							case "totalpointswon":
								percent = parseInt(playerStatData[index].stats.returndata.totalpointswon.replace("%",""));
								if(percent > aboveMean){ 
										top.push([playerStatData[index].name,percent,playerStatData[index].url]);

								}
								if(percent <= aboveMean && percent > mean	){
											above.push([playerStatData[index].name,percent,playerStatData[index].url]);
											
								}
								if(percent < mean && percent > belowMean){
										below.push([playerStatData[index].name,percent,playerStatData[index].url]);
								}
								if(percent < belowMean){
									lowest.push([playerStatData[index].name,percent,playerStatData[index].url]);
								}
							break;

						}}
			});	

			if(type === "top"){
				return top.sort(function(a,b){return a[1]-b[1]}).reverse();
			}
			else if ( type === "above") {
				return above.sort(function(a,b){return a[1]-b[1]}).reverse();
			}
			else if ( type === "below") {
				return below.sort(function(a,b){return a[1]-b[1]});
			}
			else if ( type === "lowest") {
				return lowest.sort(function(a,b){return a[1]-b[1]});
			}
	}
	GeneratePerformersHTML(arrList,type,mongodb){
			
			let string = "";
			let x = 1;

			if( mongodb ===	"atp" ){
				string = "<div id=\"atpdata\" class=\"charts--player-performance-title\" title=\"Click here to open/close ranking list\">";
				if(type === "Top"){
					string += "ATP Top 5 Highest Performers</div>";
				}
				else {
					string += "ATP Top 5 " + type + " Avg Performers</div>";
				}
			}
			else {
				string = "<div id=\"nextgen\" class=\"charts--player-performance-title\" title=\"Click here to open/close ranking list\">";
				if(type === "Top"){
					string += "NextGen Top 5 Highest Performers</div>";
				}
				else {
					string += "NextGen Top 5 " + type + " Avg Performers</div>";
				}
			}
				

			string += "<div class=\"charts--player-performance-box\"><ol>";
			for(var i = 0; i < arrList.length; i++){
				
				if(i < 5){
					string += "<div class=\"rankings\"><strong>" + (i + 1) + ".</strong>  <a href=\"http://www.atpworldtour.com" + arrList[i][2] 
					+ "\" target=\"_blank\" title=\"Click here to view ATP Overview\">" + arrList[i][0] + "</a><strong>  " + arrList[i][1] + "%</strong></div>";
				}
				

				
			}

			string += "</ol></div>"
			return string;
	}
	GetMeanData(playerStatData,mean,dataArr,belowAbove){
			var dataMean;
			var percent;
			var arr = [];
			
			$.each(playerStatData,function(index, el) {
				if( dataArr[0] === "servicedata" ){
						switch(dataArr[1]){
							case "aces":
								percent = parseInt((playerStatData[index].stats.servicedata.aces/playerStatData[index].stats.servicedata.gamesplayed)*100);
							break;
							case "doublefaults":
								percent = parseInt((playerStatData[index].stats.servicedata.doublefaults/playerStatData[index].stats.servicedata.gamesplayed)*100);
							break;

							case "fspercent":
								percent = parseInt(playerStatData[index].stats.servicedata.fspercent.replace("%",""));
							break;

							case "fspointswon":
								percent = parseInt(playerStatData[index].stats.servicedata.fspointswon.replace("%",""));
							break;

							case "sspointswon":
								percent = parseInt(playerStatData[index].stats.servicedata.sspointswon.replace("%",""));
							break;

							case "bpsaved":
								percent = parseInt(playerStatData[index].stats.servicedata.bpsaved.replace("%",""));
							break;

							case "gameswon":
								percent = parseInt(playerStatData[index].stats.servicedata.gameswon.replace("%",""));
							break;

							case "totalpointswon":
								percent = parseInt(playerStatData[index].stats.servicedata.totalpointswon.replace("%",""));
							break;
						}
				}
				else if (dataArr[0] === "returndata"){
						switch(dataArr[1]){
							case "fsreturnpointswon":
								percent = parseInt(playerStatData[index].stats.returndata.fsreturnpointswon.replace("%",""));
							break;

							case "ssreturnpointswon":
								percent = parseInt(playerStatData[index].stats.returndata.ssreturnpointswon.replace("%",""));
							break;

							case "bpconverted":
								percent = parseInt(playerStatData[index].stats.returndata.bpconverted.replace("%",""));
							break;

							case "returngameswon":
								percent = parseInt(playerStatData[index].stats.returndata.returngameswon.replace("%",""));
							break;

							case "returnpointswon":
								percent = parseInt(playerStatData[index].stats.returndata.returnpointswon.replace("%",""));
							break;

							case "totalpointswon":
								percent = parseInt(playerStatData[index].stats.returndata.totalpointswon.replace("%",""));
							break;

						}
				}
				
				if(belowAbove === "below"){
					if(percent < mean){
					arr.push(percent);
					}
				} else {
					if(percent > mean){
					arr.push(percent);
					}
				}
			});
			dataMean = d3.mean(arr, function(d){ return d;});
			return dataMean;
	}
	GetFirstName(name){
			let firstName = name.split(" ");
			return firstName[0];
	}
	doWork(playerStatData,action,records,mongodb){
		const chart = new Charts();
		let objData = [];

		$.each( playerStatData, function(element, index) {
			if(playerStatData[element].rank <= parseInt(records) || playerStatData[element].name === "Akira Santillan"){
					objData.push(index);
			}
		});
		chart.DrawBarChart(objData,action,mongodb,records);
	}
	doRankWork(playerStatData,mongodb){
		
		const chart = new Charts();
		let objData = [];
		
		$.each( playerStatData, function(element, index) {
			if(playerStatData[element].name === "Alexander Zverev" || playerStatData[element].name === "Akira Santillan"){
					var obj = {};
					obj.name = playerStatData[element].name;
					obj.data = playerStatData[element].rankings.data;
					//console.log(obj)
					objData.push(obj);
			}
		});
		chart.DrawLineChart(objData,mongodb);
	}

	
}

export default Charts;