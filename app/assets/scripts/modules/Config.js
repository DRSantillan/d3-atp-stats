


class Config {
	//
	constructor(){

		let data = { 
			stadium : {"width" : 131414.17322835, "height" : 64516.535433071},
			court : {"width" : 89839.37007874, "height" : 41461.417322835},
			serve : {"width" : 24188.976377953, "height" : 15552.755905512},
			nomans : {"width" : 20730.708661417, "height" : 31105.511811024},
			doubles : {"width" : 44919.68503937, "height" : 5177.952755906},
			alley : {"width" : 65707.086614173, "height" : 11527.559055118},
			backcourt : {"width" : 20787.401574803, "height" : 41461.417322835},
			magiccourt : {"width" : 39250.393700787, "height" : 25436.220472441},
		}

		let dataPortrait = { 
			stadium : {"height" : 131414.17322835, "width" : 64516.535433071},
			court : {"height" : 89839.37007874, "width" : 41461.417322835},
			serve : {"height" : 24188.976377953, "width" : 15552.755905512},
			nomans : {"height" : 20730.708661417, "width" : 31105.511811024},
			doubles : {"height" : 44919.68503937, "width" : 5177.952755906},
			alley : {"height" : 65707.086614173, "width" : 11527.559055118},
			backcourt : {"height" : 20787.401574803, "width" : 41461.417322835},
			magiccourt : {"height" : 89839.37007874 - 5669.291338583, "width" : 41461.417322835 - 5669.291338583},
		}
		
		
		this.list = { prop : 
			[
				{ 
					"id" : "aces",
					"query" : ["['stats']['servicedata']['aces']","['stats']['servicedata']['gamesplayed']"],
					
				}
				
				
				
				
				
			]
		}
		
		this.get();

	}
	get(id){

		for(var key in this.list.prop){
			if(this.list.prop[key].id === id){
				return this.list.prop[key];
			}
		}
	}
}

export default Config;

