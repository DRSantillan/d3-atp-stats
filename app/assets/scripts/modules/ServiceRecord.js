class ServiceRecord {
	constructor(aces, doublefaults, fspercent, fspointswon, sspointswon, bpfaced, 
						bpsaved, gamesplayed, gameswon, totalpointswon){
		this.aces = aces;
		this.doublefaults = doublefaults;
		this.fspercent = fspercent;
		this.fspointswon = fspointswon;
		this.sspointswon = sspointswon;
		this.bpfaced = bpfaced;
		this.bpsaved = bpsaved;
		this.gamesplayed = gamesplayed;
		this.gameswon = gameswon;
		this.totalpointswon = totalpointswon;	
	}
}

export default ServiceRecord;