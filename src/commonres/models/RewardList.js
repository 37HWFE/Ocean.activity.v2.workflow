define(["ocean","BaseModel"],function(ocean,BaseModel){
	return ocean.model("rewardList",function(){
		this.fields = {
			name : {
				mapping : "NAME"
			},
			card : {
				mapping : "CARD"
			},
			snName : {
				mapping : "SN_NAME"
			},
			gameId : {
				mapping : "GAME_ID"
			},
			gameServerId : {
				mapping : "GAME_SERVER_ID"
			},
			serialId : {
				mapping : "SERIAL_ID"
			},
			time : {
				mapping : "TIME"
			}

		}
	},"baseModel");
})