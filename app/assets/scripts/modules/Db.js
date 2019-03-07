import $ from 'jQuery';
import Ajax from './Ajax';
import TennisPlayer from "./Player";
import ServiceRecord from "./ServiceRecord"
import ReturnRecord from "./ReturnRecord"
import PlayerStats from "./PlayerStats";
import PlayerRankings from "./PlayerRankings";
import PlayerRank from "./PlayerRank";

class Db {
	
	constructor(){
		
		

	}

	static APIKEY(){
		
		const APIKEY = "&apiKey=R8vPnpf4GS1tv93u2Y1ljJaMuzRXo-4M";
		return APIKEY;
	}
	static Post(obj, mongodb){
		
		var url = "https://api.mongolab.com/api/1/databases/atp-stats/collections/" + mongodb + "?apiKey=R8vPnpf4GS1tv93u2Y1ljJaMuzRXo-4M";
		
		this.xhr = new XMLHttpRequest();
		this.xhr.open("POST", url , true);
		this.xhr.setRequestHeader("Content-type", "application/json");
		this.xhr.onreadystatechange = function (xhr) { 
		    if (xhr.readyState == 4 && xhr.status == 200) {
		        var json = JSON.parse(xhr.responseText);
		             console.log("POST PLAYERS COMPLETED");
		    }
		}
		var data = JSON.stringify(obj);
		this.xhr.send(data);
	}
	//
	DeleteAllPlayers(){
		
		this.xhr = new XMLHttpRequest();
		this.xhr.open("PUT", "https://api.mongolab.com/api/1/databases/atp-stats/collections/atp?apiKey=R8vPnpf4GS1tv93u2Y1ljJaMuzRXo-4M", true);
		this.xhr.setRequestHeader("Content-type", "application/json");
		this.xhr.onreadystatechange = function (xhr) { 
		    if (xhr.readyState == 4 && xhr.status == 200) {
		    }
		    console.log("DELETE PLAYERS COMPLETED");
		}
		this.xhr.send(JSON.stringify([]));}
	//
	Update(url,obj){
		this.xhr = new XMLHttpRequest();
		this.xhr.open("PUT", url, true);
		this.xhr.setRequestHeader("Content-type", "application/json");
		this.xhr.onreadystatechange = function (xhr) { 
		    if (xhr.readyState == 4 && xhr.status == 200) {
		        
		    }
		}
		var data = JSON.stringify(obj);
		this.xhr.send(data);
	}
	GetRankStats(mongodb,callback){
		var url = "https://api.mongolab.com/api/1/databases/atp-stats/collections/" + mongodb + "?";
		var prm = ["f={'id':1,'rank':1,'name':1,'rankings.data':1}&s={'id':1}&l=300"];

		var xhr = new XMLHttpRequest();
		
		xhr.open("GET", url + prm[0] + Db.APIKEY(), true);
		xhr.setRequestHeader("Content-type", "application/json");
		xhr.onreadystatechange = function () { 

		    if (xhr.readyState == 4 && xhr.status == 200) {

		        var json = JSON.parse(xhr.responseText);
		      callback(json,mongodb);
		    }
		}
		xhr.send(null);
	}
	GetStats(action,records,mongodb,callback){
		
		var url = "https://api.mongolab.com/api/1/databases/atp-stats/collections/" + mongodb + "?";
		var prm = ["f={'id':1,'rank':1,'name':1,'tournamentsplayed':1,'points':1,'age':1,'urlstats':1,'url': 1,'urlbreakdown':1,'urlhistory':1,","}&s={'id':1}&l=300"];
		
		switch(action){


			// service records
			case "servicedata:aces:gamesplayed":
			 var actionQuery = "'stats.servicedata.aces':1,'stats.servicedata.gamesplayed':1";
			 break;
			 case "servicedata:doublefaults:gamesplayed":
			 var actionQuery = "'stats.servicedata.doublefaults':1,'stats.servicedata.gamesplayed':1"; 
			 break;
			 case "servicedata:fspercent":
			 var actionQuery = "'stats.servicedata.fspercent':1"; 
			 break;
			 case "servicedata:fspointswon":
			 var actionQuery = "'stats.servicedata.fspointswon':1"; 
			 break;
			 case "servicedata:sspointswon":
			 var actionQuery = "'stats.servicedata.sspointswon':1"; 
			 break;
			 case "servicedata:bpfaced":
			 var actionQuery = "'stats.servicedata.bpfaced':1"; 
			 break;
			 case "servicedata:bpsaved":
			 var actionQuery = "'stats.servicedata.bpsaved':1"; 
			 break;
			 case "servicedata:bpfaced:bpsaved":
			 var actionQuery = "'stats.servicedata.bpfaced':1,'stats.servicedata.bpsaved':1";
			 break;
			 case "servicedata:gameswon":
			 var actionQuery = "'stats.servicedata.gameswon':1,'stats.servicedata.gamesplayed':1";
			 
			 break;
			 case "servicedata:totalpointswon":
			 var actionQuery = "'stats.servicedata.totalpointswon':1"; 
			 break;
			 // return records
			 
			 case "returndata:fsreturnpointswon":
			 var actionQuery = "'stats.returndata.fsreturnpointswon':1"; 
			 break;
			 case "returndata:ssreturnpointswon":
			 var actionQuery = "'stats.returndata.ssreturnpointswon':1"; 
			 break;
			 case "returndata:bpopportunities:returngamesplayed":
			 var actionQuery = "'stats.returndata.bpopportunities':1,'stats.returndata.returngamesplayed':1";
			 break;
			 case "returndata:bpconverted":
			 var actionQuery = "'stats.returndata.bpconverted':1,'stats.returndata.bpopportunities':1";
			 break;
			 case "returndata:returngamesplayed:returngameswon":
			 var actionQuery = "'stats.returndata.returngamesplayed':1,'stats.returndata.returngameswon':1";
			 break;
			 case "returndata:returngameswon":
			 var actionQuery = "'stats.returndata.returngameswon':1"; 
			 break;
			 case "returndata:returnpointswon":
			 var actionQuery = "'stats.returndata.returnpointswon':1"; 
			 break;
			 case "returndata:totalpointswon":
			 var actionQuery = "'stats.returndata.totalpointswon':1"; 
			 break;

		}

		var xhr = new XMLHttpRequest();
		
		xhr.open("GET", url + prm[0] + actionQuery + prm[1] + Db.APIKEY(), true);
		xhr.setRequestHeader("Content-type", "application/json");
		xhr.onreadystatechange = function () { 

		    if (xhr.readyState == 4 && xhr.status == 200) {

		        var json = JSON.parse(xhr.responseText);
		        
		      callback(json,action,records,mongodb);
		    }
		}
		xhr.send(null);
	}

	GetATPPlayersRankings(){
		this.db = new Db();
		var xhr = new XMLHttpRequest();
		xhr.open("GET", "https://api.mongolab.com/api/1/databases/atp-stats/collections/atp?f={'id':1,'name':1,'urlhistory':1}&l=500&s={'id':1}&apiKey=R8vPnpf4GS1tv93u2Y1ljJaMuzRXo-4M", true);
		xhr.setRequestHeader("Content-type", "application/json");
		xhr.onreadystatechange = function () { 
			if (xhr.readyState == 4 && xhr.status == 200) {

					        var json = JSON.parse(xhr.responseText);
					        
					        $.each( json , function( index , value ) { 
					        							        		
					        		$.ajax( { 
					        				url : "http://www.atpworldtour.com" + json[index]["urlhistory"],
					        				type: 'GET',
					        				success: function( res ) {
					        					var rankingsArr = [];
					        					var tempArr = [];
					        					
					        					var prankings = new PlayerRankings();
					        					var text = res.responseText;
					        					var rankTable = $(text).find('.mega-table').children('tbody').children('tr').children('td');
					        							
			        							$.each(rankTable, function(index,value){
										        	tempArr.push($(rankTable[index]).text().trim());
										         });

			        								for(var i = 0; i < tempArr.length -1; i++){
			        									if(i%3 === 0){
			        										var prank = new PlayerRank();
			        										prank.date = Date.parse(tempArr[i].split(".").join("-"));
			        									}
			        									else if (i%3 === 1)  {
			        										prank.singles = parseInt(tempArr[i]);
			        									}
			        									else {
			        										prank.doubles = parseInt(tempArr[i]);
			        										rankingsArr.push(prank);
			        									}
			        								}

					        					for(var key in rankingsArr){
					        						if(rankingsArr[key].singles === 0 && rankingsArr[key].doubles === 0){
					        							rankingsArr.splice(rankingsArr.indexOf(rankingsArr[key],1));
					        						}
					        					}

					        					prankings.data = rankingsArr;
												var aurl = "https://api.mongolab.com/api/1/databases/atp-stats/collections/atp?q={'id':" + json[index]["id"] + "}&u=true&apiKey=R8vPnpf4GS1tv93u2Y1ljJaMuzRXo-4M";
								
												$.ajax({
													url: aurl,
													type: "PUT",
													data: JSON.stringify( {"$set" : { "rankings" : prankings } } ),
													contentType: "application/json",
													success: function(x){
														console.log("INSERTED",x, json[index]["name"]);
													}
												});
					        				}
					        		} );
					        });
			}
		}
		xhr.send(null);
		

	}
	GetNGPlayersRankings(){
		this.db = new Db();
		var xhr = new XMLHttpRequest();
		xhr.open("GET", "https://api.mongolab.com/api/1/databases/atp-stats/collections/next-gen?f={'id':1,'name':1,'urlhistory':1}&l=300&s={'id':1}&apiKey=R8vPnpf4GS1tv93u2Y1ljJaMuzRXo-4M", true);
		xhr.setRequestHeader("Content-type", "application/json");
		xhr.onreadystatechange = function () { 
			if (xhr.readyState == 4 && xhr.status == 200) {

					        var json = JSON.parse(xhr.responseText);
					        
					        $.each( json , function( index , value ) { 
					        							        		
					        		$.ajax( { 
					        				url : "http://www.atpworldtour.com" + json[index]["urlhistory"],
					        				type: 'GET',
					        				success: function( res ) {
					        					var rankingsArr = [];
					        					var tempArr = [];
					        					
					        					var prankings = new PlayerRankings();
					        					var text = res.responseText;
					        					var rankTable = $(text).find('.mega-table').children('tbody').children('tr').children('td');
					        							
			        							$.each(rankTable, function(index,value){
										        	tempArr.push($(rankTable[index]).text().trim());
										         });
		
			        								for(var i = 0; i < tempArr.length -1; i++){
			        									if(i%3 === 0){
			        										var prank = new PlayerRank();
			        										prank.date = tempArr[i].split(".").join("-");
			        									}
			        									else if (i%3 === 1)  {
			        										prank.singles = parseInt(tempArr[i]);
			        									}
			        									else {
			        										prank.doubles = parseInt(tempArr[i]);
			        										rankingsArr.push(prank);
			        									}
			        								}
			        							
					        					for(var key in rankingsArr){
					        						if(rankingsArr[key].singles === 0 && rankingsArr[key].doubles === 0){
					        							rankingsArr.splice(rankingsArr.indexOf(rankingsArr[key],1));
					        						}
					        					}

					        					

			        							
					        					prankings.data = rankingsArr;		
			    

		        								console.log(prankings);
					        							
					        							

												var aurl = "https://api.mongolab.com/api/1/databases/atp-stats/collections/next-gen?q={'id':" + json[index]["id"] + "}&u=true&apiKey=R8vPnpf4GS1tv93u2Y1ljJaMuzRXo-4M";
														
														
												$.ajax({
													url: aurl,
													type: "PUT",
													data: JSON.stringify( {"$set" : { "rankings" : prankings } } ),
													contentType: "application/json",
													success: function(x){
														console.log("INSERTED",x, json[index]["name"]);
													}
												});
					        				}
					        		} );
					        });
			}
		}
		xhr.send(null);
		

	}
	GetPlayerStats(){
		
		var xhr = new XMLHttpRequest();
		
		xhr.open("GET", "https://api.mongolab.com/api/1/databases/atp-stats/collections/atp?f={'id':1,'name':1,'urlstats':1}&l=300&apiKey=R8vPnpf4GS1tv93u2Y1ljJaMuzRXo-4M", true);
		xhr.setRequestHeader("Content-type", "application/json");
		xhr.onreadystatechange = function () { 

		    if (xhr.readyState == 4 && xhr.status == 200) {

		        var json = JSON.parse(xhr.responseText);
		        //debugger;
		        $.each(json,function(index,value){
			        $.ajax({
				    	url: "http://www.atpworldtour.com" + json[index]["urlstats"],
				    	type: 'GET',
				    	success: function(res) {
							this.DB = new Db();
					        var text = res.responseText;
					        var rankTable = $(text).find('.mega-table').children('tbody').children('tr').find('td');
					        var arr = [];
					        var arrHolder = [];

					        $.each(rankTable, function(index,value){
					        	arr.push($(this).text().trim())
					        });

					        var playerid = json[index]["_id"]["$oid"];
					        if(arr.length === 0){
					        	var delUrl = "https://api.mongolab.com/api/1/databases/atp-stats/collections/atp/" + playerid + "?apiKey=R8vPnpf4GS1tv93u2Y1ljJaMuzRXo-4M";
					   
					        	$.ajax( 
					        		{ url: delUrl,
									  type: "DELETE",
									  async: true,
									  timeout: 300000,
									  success: function (x) {
									  console.log("DELETED",x);

							   			},
									  error: function (xhr, status, err) { 
									  					console.log(err);
									  } } );
					        }
			
					        if(arr.length >= 1){
								for(var i = 0; i < arr.length; i++){
								if(i%2 == 0){
									var newArr = [];
									newArr.push(arr[i].trim());
								}
								else {
									newArr.push(arr[i].trim());
									arrHolder.push(newArr);
								} 
							}
							
							var aces, doublefaults, fspercent, fspointswon, sspointswon, bpfaced, 
							bpsaved, gamesplayed, gameswon, totalpointswon;

							var fsreturnpointswon, ssreturnpointswon, bpopportunities, bpconverted,
							returngamesplayed,	returngameswon, returnpointswon, totalpointswon;

							for(var i = 0; i < arrHolder.length; i++){
		
								switch(arrHolder[i][0]){
									case "Aces":
										aces = arrHolder[i][1].replace(/,/g,"");
										break;
									case "Double Faults":
										doublefaults = arrHolder[i][1].replace(/,/g,"");
										break;
									case "1st Serve":
										fspercent = arrHolder[i][1].replace(/,/g,"");
										break;
									case "1st Serve Points Won":
										fspointswon = arrHolder[i][1].replace(/,/g,"");
										break;
									case "2nd Serve Points Won":
										sspointswon = arrHolder[i][1].replace(/,/g,"");
										break;
									case "Break Points Faced":
										bpfaced = arrHolder[i][1].replace(/,/g,"");
										break;
									case "Break Points Saved":
										bpsaved = arrHolder[i][1].replace(/,/g,"");
										break;
									case "Service Games Played":
										gamesplayed = arrHolder[i][1].replace(/,/g,"");
										break;
									case "Service Games Won":
										gameswon = arrHolder[i][1].replace(/,/g,"");
										break;
									case "Total Service Points Won":
										totalpointswon = arrHolder[i][1].replace(/,/g,"");
										break;
									case "1st Serve Return Points Won":
										fsreturnpointswon = arrHolder[i][1].replace(/,/g,"");
										break;
									case "2nd Serve Return Points Won":
										ssreturnpointswon = arrHolder[i][1].replace(/,/g,"");
										break;
									case "Break Points Opportunities":
										bpopportunities = arrHolder[i][1].replace(/,/g,"");
										break;
									case "Break Points Converted":
										bpconverted = arrHolder[i][1].replace(/,/g,"");
										break;
									case "Return Games Played":
										returngamesplayed = arrHolder[i][1].replace(/,/g,"");
										break;
									case "Return Games Won":
										returngameswon = arrHolder[i][1].replace(/,/g,"");
										break;
									case "Return Points Won":
										returnpointswon = arrHolder[i][1].replace(/,/g,"");
										break;
									case "Total Points Won":
										totalpointswon = arrHolder[i][1].replace(/,/g,"");
										break;
								}
							}

							var service = new ServiceRecord(aces, doublefaults, fspercent, fspointswon, sspointswon, bpfaced, 
															bpsaved, gamesplayed, gameswon, totalpointswon);
							
							var returns = new ReturnRecord(fsreturnpointswon, ssreturnpointswon, bpopportunities, bpconverted,
															returngamesplayed,	returngameswon, returnpointswon, totalpointswon);
							var stats = new PlayerStats(service, returns);

							var aurl = "https://api.mongolab.com/api/1/databases/atp-stats/collections/atp?q={'id':" + json[index]["id"] + "}&apiKey=R8vPnpf4GS1tv93u2Y1ljJaMuzRXo-4M"
							
							$.ajax({
								url: aurl,
								type: "PUT",
								data: JSON.stringify( {"$set" : { "stats" : stats } } ),
								contentType: "application/json",
								success: function(x){
									console.log("INSERTED",x);
								}
							});

					        }
				    	}
					});
		        });
		      console.log("GET PLAYERS STATS COMPLETED");
		    }
		}
		xhr.send(null);
	}

	GetPlayers(){
		var url = "http://www.atpworldtour.com/en/rankings/singles?rankRange=0-300";
		
		$.ajax({
	    	url: url,
	    	type: 'GET',
	    	success: function(res) {
		        var Players = {};
		        Players.data = [];
				this.DB = new Db();
		        var text = res.responseText;
				var rankTable = $(text).find('.mega-table').children('tbody').children('tr');
				
				$.each(rankTable, function(index, value){
					var $rank = $(this).find('.rank-cell').text().trim();
					var $country = $(this).find('.country-item > img').attr('alt');
					var $url = $(this).find('.player-cell > a').attr('href');
					var $name = $(this).find('.player-cell > a').text();
					var $age = $(this).find('.age-cell').text().trim();
					var $points = $(this).find('.points-cell').text().trim();
					var $tournaments = $(this).find('.tourn-cell').text().trim();
					var $urlbreakdown = $url.replace("overview","rankings-breakdown");
					var $urlhistory = $url.replace("overview","rankings-history");
					var $urlstats = $url.replace("overview","player-stats");
			
					Db.Post(new TennisPlayer(index,$rank,$name,$age,$points,$tournaments,$url,$urlbreakdown,$urlhistory,$urlstats,$country), "atp" );
				});
				console.log("GET PLAYERS COMPLETED");
	    	}
		});}

	GetNextGenPlayers(){
		var url = "http://www.atpworldtour.com/en/rankings/race-to-milan?rankRange=0-500";
		
		$.ajax({
	    	url: url,
	    	type: 'GET',
	    	success: function(res) {
		        var Players = {};
		        Players.data = [];
				
		        var text = res.responseText;
		      
				var rankTable = $(text).find('.mega-table').children('tbody').children('tr');
				
				$.each(rankTable, function(index, value){
					var $rank = $(this).find('.rank-cell').text().trim();
					var $country = $(this).find('.country-item > img').attr('alt');
					var $url = $(this).find('.player-cell > a').attr('href');
					var $name = $(this).find('.player-cell > a').text();
					var $age = $(this).find('.age-cell').text().trim();
					var $points = $(this).find('.points-cell').text().trim();
					var $tournaments = $(this).find('.tourn-cell').text().trim();
					var $urlbreakdown = $url.replace("overview","rankings-breakdown");
					var $urlhistory = $url.replace("overview","rankings-history");
					var $urlstats = $url.replace("overview","player-stats");
					
					Db.Post(new TennisPlayer(index,$rank,$name,$age,$points,$tournaments,$url,$urlbreakdown,$urlhistory,$urlstats,$country), "next-gen" );

				});
				console.log("GET PLAYERS COMPLETED");
	    	}
		});}

	DeleteAllNextGenPlayers(){
		
		this.xhr = new XMLHttpRequest();
		
		this.xhr.open("PUT", "https://api.mongolab.com/api/1/databases/atp-stats/collections/next-gen?apiKey=R8vPnpf4GS1tv93u2Y1ljJaMuzRXo-4M", true);
		this.xhr.setRequestHeader("Content-type", "application/json");
		this.xhr.onreadystatechange = function (xhr) { 
		    if (xhr.readyState == 4 && xhr.status == 200) {
		        console.log(xhr);

		    }
		    console.log("DELETE PLAYERS COMPLETED");
		}

		this.xhr.send(JSON.stringify([]));}

	GetNextGenPlayerStats(){
		
		var xhr = new XMLHttpRequest();
		
		xhr.open("GET", "https://api.mongolab.com/api/1/databases/atp-stats/collections/next-gen?f={'id':1,'name':1,'urlstats':1}&sk=0&l=100&apiKey=R8vPnpf4GS1tv93u2Y1ljJaMuzRXo-4M", true);
		xhr.setRequestHeader("Content-type", "application/json");
		xhr.onreadystatechange = function () { 

		    if (xhr.readyState == 4 && xhr.status == 200) {

		        var json = JSON.parse(xhr.responseText);
		        //debugger;
		        $.each(json,function(index,value){
		        	

		        $.ajax({
			    	url: "http://www.atpworldtour.com" + json[index]["urlstats"],
			    	type: 'GET',
			    	success: function(res) {
				        
						this.DB = new Db();
					
				        var text = res.responseText;
				        var rankTable = $(text).find('.mega-table').children('tbody').children('tr').find('td');
				        var arr = [];
				        var arrHolder = [];

				        $.each(rankTable, function(index,value){
				        	arr.push($(this).text().trim())
				        });

				        var playerid = json[index]["_id"]["$oid"];
				        if(arr.length === 0){

				        	var delUrl = "https://api.mongolab.com/api/1/databases/atp-stats/collections/next-gen/" + playerid + "?apiKey=R8vPnpf4GS1tv93u2Y1ljJaMuzRXo-4M";
				        	$.ajax( 
				        		{ url: delUrl,
								  type: "DELETE",
								  async: true,
								  timeout: 300000,
								  success: function (x) {
								  console.log("DELETED",x);

						   			},
								  error: function (xhr, status, err) { 
								  		console.log("ERROR", err);
								  } } );
				        }
		
				        if(arr.length >= 1){

							for(var i = 0; i < arr.length; i++){
	
							if(i%2 == 0){
								var newArr = [];
								newArr.push(arr[i].trim());
							}
							else {
								newArr.push(arr[i].trim());
								arrHolder.push(newArr);
							} 
						}
						

						var aces, doublefaults, fspercent, fspointswon, sspointswon, bpfaced, 
						bpsaved, gamesplayed, gameswon, totalpointswon;

						var fsreturnpointswon, ssreturnpointswon, bpopportunities, bpconverted,
						returngamesplayed,	returngameswon, returnpointswon, totalpointswon;

						for(var i = 0; i < arrHolder.length; i++){
	

							switch(arrHolder[i][0]){
								case "Aces":
									aces = arrHolder[i][1].replace(/,/g,"");
									break;

								case "Double Faults":
									doublefaults = arrHolder[i][1].replace(/,/g,"");
									break;
								case "1st Serve":
									fspercent = arrHolder[i][1].replace(/,/g,"");
									break;
								case "1st Serve Points Won":
									fspointswon = arrHolder[i][1].replace(/,/g,"");
									break;
								case "2nd Serve Points Won":
									sspointswon = arrHolder[i][1].replace(/,/g,"");
									break;
								case "Break Points Faced":
									bpfaced = arrHolder[i][1].replace(/,/g,"");
									break;
								case "Break Points Saved":
									bpsaved = arrHolder[i][1].replace(/,/g,"");
									break;
								case "Service Games Played":
									gamesplayed = arrHolder[i][1].replace(/,/g,"");
									break;
								case "Service Games Won":
									gameswon = arrHolder[i][1].replace(/,/g,"");
									break;
								case "Total Service Points Won":
									totalpointswon = arrHolder[i][1].replace(/,/g,"");
									break;
								case "1st Serve Return Points Won":
									fsreturnpointswon = arrHolder[i][1].replace(/,/g,"");
									break;
								case "2nd Serve Return Points Won":
									ssreturnpointswon = arrHolder[i][1].replace(/,/g,"");
									break;
								case "Break Points Opportunities":
									bpopportunities = arrHolder[i][1].replace(/,/g,"");
									break;
								case "Break Points Converted":
									bpconverted = arrHolder[i][1].replace(/,/g,"");
									break;
								case "Return Games Played":
									returngamesplayed = arrHolder[i][1].replace(/,/g,"");
									break;
								case "Return Games Won":
									returngameswon = arrHolder[i][1].replace(/,/g,"");
									break;
								case "Return Points Won":
									returnpointswon = arrHolder[i][1].replace(/,/g,"");
									break;
								case "Total Points Won":
									totalpointswon = arrHolder[i][1].replace(/,/g,"");
									break;
							}
						}

						var service = new ServiceRecord(aces, doublefaults, fspercent, fspointswon, sspointswon, bpfaced, 
														bpsaved, gamesplayed, gameswon, totalpointswon);
						
						var returns = new ReturnRecord(fsreturnpointswon, ssreturnpointswon, bpopportunities, bpconverted,
														returngamesplayed,	returngameswon, returnpointswon, totalpointswon);
						var stats = new PlayerStats(service, returns);

						var aurl = "https://api.mongolab.com/api/1/databases/atp-stats/collections/next-gen?q={'id':" + json[index]["id"] + "}&apiKey=R8vPnpf4GS1tv93u2Y1ljJaMuzRXo-4M";

						$.ajax({
							url: aurl,
							type: "PUT",
							data: JSON.stringify( {"$set" : { "stats" : stats } } ),
							contentType: "application/json",
							success: function(x){
								console.log("INSERTED", x);
							}
						});

				        }
			    	}
				});
		        });
		      console.log("GET PLAYERS STATS COMPLETED");
		    }
		}
		xhr.send(null);}


		CheckPlayers(mongodb,callback){
		
		var url = "https://api.mongolab.com/api/1/databases/atp-stats/collections/" + mongodb + "?f={'id':1,'rank':1,'name':1,'stats':1,}&s={'id':1}&l=300";
		

		var xhr = new XMLHttpRequest();
		
		xhr.open("GET", url + Db.APIKEY(), true);
		xhr.setRequestHeader("Content-type", "application/json");
		xhr.onreadystatechange = function () { 

		    if (xhr.readyState == 4 && xhr.status == 200) {

		        var json = JSON.parse(xhr.responseText);
		        
		      callback(json,mongodb);
		    }
		}
		xhr.send(null);
	}
}

export default Db;



