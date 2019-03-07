import $ from 'jQuery';
import Ajax from './Ajax';
import TennisPlayer from "./Player";
import Db from './Db'
import ServiceRecord from "./ServiceRecord"
import ReturnRecord from "./ReturnRecord"
import PlayerStats from "./PlayerStats";
import Charts from "./Charts";


class ViewController {


	constructor(){
		this.btnGetPlayers = $("#GetPlayers");
		this.btnGetPlayerStats = $("#GetPlayerStats");
		this.btnDeleteAllPlayers = $("#DeleteAllPlayers");
		this.btnDisplayChart = $("#DisplayChart");
		this.btnGetNextGenPlayers = $("#GetNextGenPlayers");
		this.btnGetNextGenPlayersStats = $("#GetNextGenPlayersStats");
		this.btnDeleteNextGenPlayersStats = $("#DeleteNextGenPlayersStats");
	    this.btnCharts = $(".DisplayCharts");
	    this.btnRankingCharts = $(".RankingCharts")
	    this.statsTitle = $(".charts--player-performance");
	    this.statsRankings = $(".rankings");
		this.DataHolder = $("#Data");
		this.btnCheckNextGenPlayersData = $("#CheckNextGenPlayersData");
		this.btnCheckPlayersData = $("#CheckPlayersData");
		this.btnGetPlayerRankings = $("#GetPlayerRankings");
		this.btnGetNextGenPlayersRankings = $("#GetNextGenPlayersRankings");
		this.Events();


	}
	

	Events(){
		this.btnGetPlayers.on("click", this.GetPlayers.bind(this));
		this.btnGetPlayerStats.on("click", this.GetPlayerStats.bind(this));
		this.btnDeleteAllPlayers.on("click", this.DeleteAllPlayers.bind(this));
		this.btnGetNextGenPlayers.on("click", this.GetNextGenPlayers.bind(this));
		this.btnGetNextGenPlayersStats.on("click", this.GetNextGenPlayerStats.bind(this));
		this.btnDeleteNextGenPlayersStats.on("click", this.DeleteAllNextGenPlayers.bind(this));
		this.btnCharts.on("click", this.DisplayChart.bind(this));
		this.statsTitle.on("click", this.ShowATPNGData.bind(this));
		this.btnCheckNextGenPlayersData.on("click", this.CheckNGPlayersData.bind(this));
		this.btnCheckPlayersData.on("click", this.CheckATPPlayersData.bind(this));
		this.btnGetPlayerRankings.on("click", this.GetATPPlayerRankings.bind(this));
		this.btnGetNextGenPlayersRankings.on("click", this.GetNGPlayerRankings.bind(this));
		this.btnRankingCharts.on("click", this.DisplayRankingChart.bind(this));
	}
	
	ShowATPNGData(event){
			
			event.stopImmediatePropagation();
			let newName = $(event.target);
		
			if(newName.next()[0].nodeName !== "STRONG"){
				newName.next().toggleClass("charts--player-performance-box--view").siblings().removeClass('charts--player-performance-box--view');
			}
	}
	GetPlayerStats(event){
		event.preventDefault();
		event.stopPropagation();
		this.db = new Db();
		this.db.GetPlayerStats();
	}
	GetATPPlayerRankings(event){
		event.preventDefault();
		event.stopPropagation();
		this.db = new Db();
		this.db.GetATPPlayersRankings();
	}
	GetNGPlayerRankings(event){
		event.preventDefault();
		event.stopPropagation();
		this.db = new Db();
		this.db.GetNGPlayersRankings();
	}
	CheckATPPlayersData(event){
		event.preventDefault();
		event.stopPropagation();
		this.db = new Db();
		this.db.CheckPlayers("atp",this.CheckPlayerData);
	}
	CheckNGPlayersData(event){
		event.preventDefault();
		event.stopPropagation();
		this.db = new Db();
		this.db.CheckPlayers("next-gen",this.CheckPlayerData);
	}
	CheckPlayerData(data,mongodb){
		//console.log(data)
		//console.log(mongodb)


		$.each( data, function(element, index) {
			//console.log(data[element].stats);
			if(data[element].stats === undefined){
				console.log("EMPTY DATA DETECTED")
			}
			console.log("Stats Data Available!!!")
		});	
	}
	GetNextGenPlayerStats(event){
		event.preventDefault();
		event.stopPropagation();
		this.db = new Db();
		this.db.GetNextGenPlayerStats();
	}
	DeleteAllPlayers(event){
		event.preventDefault();
		event.stopPropagation();
		this.db = new Db();
		this.db.DeleteAllPlayers();
	}
	DeleteAllNextGenPlayers(event){
		event.preventDefault();
		event.stopPropagation();
		this.db = new Db();
		this.db.DeleteAllNextGenPlayers();
	}
	GetPlayers(event){
		event.preventDefault();
		event.stopPropagation();
		this.db = new Db();
		this.db.GetPlayers();
	}
	GetNextGenPlayers(event){
		event.preventDefault();
		event.stopPropagation();
		this.db = new Db();
		this.db.GetNextGenPlayers();
	}
	DisplayChart(event){
		event.preventDefault();
		event.stopPropagation();
		event.stopImmediatePropagation();
		let playerData = $(".charts--player-data");
		playerData.addClass("charts--hidden");
		let playerPerData = $(".charts--player-performance");
		
		playerPerData.empty();
		playerPerData.append("<strong class=\"charts--player-performance-title\">Statistical Rankings</strong>(Click Below)<br><br>");
		playerPerData.addClass("charts--hidden");
		let emptyChartArea = $(".charts__chart");
		let RecordstoDisplay = $("#RecordstoDisplay");
		let noOfPlayers = $("#noOfPlayers");
		let chartAction = $("#chartAction");

		emptyChartArea.empty();
		this.charts = new Charts();
		this.charts.Show(chartAction.val(),noOfPlayers.val());
	}
	DisplayRankingChart(event){
		
		event.preventDefault();
		event.stopPropagation();
		event.stopImmediatePropagation();
		let playerData = $(".charts--player-data");
		playerData.addClass("charts--hidden");
		let playerPerData = $(".charts--player-performance");
		
		playerPerData.empty();
		//playerPerData.append("<strong class=\"charts--player-performance-title\">Statistical Rankings</strong>(Click Below)<br><br>");
		playerPerData.addClass("charts--hidden");
		let emptyChartArea = $(".charts__chart");
		

		emptyChartArea.empty();
		this.charts = new Charts();
		this.charts.ShowRank();
	}
}

export default ViewController;