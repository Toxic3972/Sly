const REGISTER_RETRY_TIMEOUT = 10000; 
const GAME_ID = 21640; 
var g_interestedInFeatures = [
  'me',
  'game_info',
  'match_info',
  'kill',
  'death'
]

var myName = "Unknown";
var currentAgent = "Unknown";
var ProcAgentName = "Unknown"; 
var score = "0:0";
var weapon = [];
var myRank = "Unranked";
var lastMatchOutcome = "N/A";
var gameMode = "Unknown";
var isRanked = false;
var roster = [];
var round_report = [];
var scoreboard = [];  
var deaths = 0;
var assists = 0;
var ranks = [];
var peakRanks = [];
var rankSet = [];
var currentHits = 0;
var currentHeadshotKills = 0;
var currentKills = 0;
var currentHeadshots = 0;
var currentRound = 0;
ranks[0]=-1;
ranks[1]=-1;
ranks[2]=-1;     
ranks[3]=-1;
ranks[4]=-1;
ranks[5]=-1;
ranks[6]=-1;
ranks[7]=-1;
ranks[8]=-1;
ranks[9]=-1;
var mmr = [];
var localPlayerNumber;
var map = "Unknown";
var procMap = "Unknown";
var player1 = new Player("null","null",null,null,null,null);
var player2 = new Player();
var player3 = new Player();
var player4 = new Player();
var player5= new Player();
var player6 = new Player();
var player7 = new Player();
var player8 = new Player();
var player9 = new Player();
var player10 = new Player();
var scene = "Unknown";
var health = null;

window.addEventListener('load', function() {
    init();
});


function init() {
      checkEventsHealth();
    overwolf.games.events.setRequiredFeatures(g_interestedInFeatures, function(info) {
        if (info.success == false) {
            console.log("Could not set required features: " + info.error);
            return;
        }
        console.log("Features set successfully");
      

        overwolf.games.events.getInfo(function(info) {
            console.log("Full Current State:", info); 
            inMatch(info);
            
   
    });

    });

overwolf.games.events.onInfoUpdates2.addListener(function(data) {
       // Check if the "match_info" category was updated at all
    if (data.info && data.info.match_info) {
        overwolf.games.events.getInfo(function(info) {
    console.log(info);
    inMatch(info);
    console.log("working");
    
    if(inMatch(info)){
        setPlayerOrder(info);
    console.log("Player Order SEt");
        console.log("in Match called");
        getGameMode(info);
        getMap(info);
        getScore(info);
        getRoundReport(info);
       
         for(var h=0; h<10; h++){
            if(info.res.match_info["roster_" + h]){
            if(ranks[h]==-1 || ranks[h] == undefined || ranks[h] == 0 && rankSet == false ){
                console.log(JSON.parse(info.res.match_info["roster_" + h]).player_id);
                ranks[h] = fetchExternalData(JSON.parse(info.res.match_info["roster_" + h]).player_id,h);
                console.log("fetched");
               
            }
            }
             
            
        }
        insertOwnRank(ranks[localPlayerNumber], mmr[localPlayerNumber]);

    }
    else{
        console.log("Not in Match");
        insertOwnRank(ranks[localPlayerNumber],mmr[localPlayerNumber]);
    }
        });
    }
});

}   

function checkEventsHealth(){
    var url = "https://game-events-status.overwolf.com/21640_prod.json";
    console.log("Checking Health");
    fetch(url)
        .then (response => response.json())
        .then(data => {
            health = data;
            console.log("State: " + health.state);
            if(health.state == 3){
                console.log("Game Events are currently unavailable. Blame Overwolf");

            }

        })


}
  
function inMatch(info){
if(info.res.game_info.scene){
  
   scene = (info.res.game_info.scene);    

if(scene === "Triad" || scene === "Duality" || scene === "Bonsai" || scene === "Ascent" || scene === "Port" || scene === "Foxtrot" || scene === "Canyon" || scene === "Pitt" || scene === "Rook" ||scene === "Jam" || scene === "Juliett" || scene === "Infinity" || scene === "CharacterSelectPersistentLevel"){
    if(scene === "CharacterSelectPersistentLevel"){
            currentKills=0;
            currentHeadshotKills=0;
            currentHeadshots=0;
            currentHits=0;

    }
return true;
} else{

console.log ("not in match: scene invalid " + scene);
for(var o=0; o<10; o++){
            rankSet[o] = false;
            ranks[o] = -1;
            peakRanks[o] = -1;
            accuracy(currentHits,currentKills,currentHeadshots,currentHeadshotKills);
            insertRankInHTML(0,o);
            insertPeakInHTML(0,o);
            insertNameInHTML("-", o);
            insertAgentInHTML("empty",o);   
             isAlive(true, o);
                hasSpike(false, o);
                hasUlt(-1, 0, o);
                for(var n=1; n<10; n++){
                insertUltPointsInHTML(o,n,"","hidden");
                }
                insertKDAInHTML("-","-","-",o); 
                insertWeaponInHTML("knife",o); 
                insertScoreInHTML("-:-");
                

}

return(false);
    
}
}
}

function setPlayerOrder(info){
    var localPlayerFound = false;
    var position = [];
    var player = [];
    var agent = [];
    var kills = [];
    var deaths = [];
    var assists = [];
    var alive = [];
    var spike = [];
    var ult_points = [];
    var max_ult_points = [];
    for(var i = 0; i < 10; i++){
        
         player[i] = info.res.match_info["roster_" + i];

        if(player[i]){
        if(JSON.parse(player[i]).local === true){
            position[i] = 0;
            localPlayerFound = true;
            localPlayerNumber = i;
    
        } else if(localPlayerFound === true){
            position[i] = i;
        } else if(localPlayerFound === false){
            position[i] = i + 1;
        }
    }
    if(player[i]){
        insertNameInHTML(JSON.parse(player[i]).name, position[i]);
        agent[i] = ValorantTools.translateAgent(JSON.parse(player[i]).character);
        insertAgentInHTML(agent[i],position[i]);   
    }

        //find agent
        
       

        //find KDA: scoreboard positiond does not match roster positions!
        //issue: player 1 at position 2 when playerLocal is player 2. player 1-> undefinded kda?

        //find isAlive
        
         for(var j = 0; j < 10; j++){
            if(info.res.match_info["scoreboard_" + j] && player[i]){
            if(JSON.parse(info.res.match_info["scoreboard_" + j]).name === JSON.parse(player[i]).name){
                kills[i] = JSON.parse(info.res.match_info["scoreboard_" + j]).kills;
                deaths[i] = JSON.parse(info.res.match_info["scoreboard_" + j]).deaths;
                assists[i] = JSON.parse(info.res.match_info["scoreboard_" + j]).assists;
                alive[i] = JSON.parse(info.res.match_info["scoreboard_" + j]).alive;
                spike[i] = JSON.parse(info.res.match_info["scoreboard_" + j]).spike;
                ult_points[i] = JSON.parse(info.res.match_info["scoreboard_" + j]).ult_points;
                max_ult_points[i] = JSON.parse(info.res.match_info["scoreboard_" + j]).ult_max;
                currentKills = kills[localPlayerNumber];

                isAlive(alive[i], position[i]);
                hasSpike(spike[i], position[i]);
                hasUlt(ult_points[i], max_ult_points[i], position[i]);
                for(var q = 1; q <= max_ult_points[i]; q++){
                    //grey
                    insertUltPointsInHTML(position[i], q,"","visible");
                   

                }
                   for(var r = max_ult_points[i] + 1; r < 10; r++){
                    //grey
                    insertUltPointsInHTML(position[i], r,"","hidden");
                   

                }
                  for(var a = 1; a <= ult_points[i]; a++){
                    //white
                    insertUltPointsInHTML(position[i], a,"white","visible");
                      

                }
            }
        }
         }

         //find weapon

            for(var w = 0; w < 10; w++){
                if(info.res.match_info["scoreboard_" + w] && player[i]){
            if(JSON.parse(info.res.match_info["scoreboard_" + w]).name === JSON.parse(player[i]).name){

                if(JSON.parse(info.res.match_info["scoreboard_" + w]).weapon){
                weapon[i] = ValorantTools.translateWeapon(JSON.parse(info.res.match_info["scoreboard_" + w]).weapon);
                }
            }
        }
         }
    
        insertKDAInHTML(kills[i],deaths[i],assists[i],position[i]); 
        
        insertWeaponInHTML(weapon[i],position[i]); 

        //set ranks from ranks[i]

        insertRankInHTML(ranks[i],position[i]);
        insertPeakInHTML(peakRanks[i],position[i]);
        insertOwnRank(ranks[localPlayerNumber], mmr[localPlayerNumber]);


       
        
}
}

function fetchExternalData(playerID,index) {

    if(playerID !== undefined){
    var url = "https://api.henrikdev.xyz/valorant/v2/by-puuid/mmr/eu/" + playerID;
    
    
    var myApiKey = localStorage.getItem("user_henrik_key"); 

    fetch(url, {
        method: "GET",
        headers: {
            "Authorization": myApiKey 
        }
    })
    .then(response => {
        if (!response.ok) {
            // 401 = Unauthorized (Bad Key), 404 = Player not found, 429 = Too fast
            console.error("API Error Code: " + response.status);
              if(response.status == 400) {

                rankSet[index] = true;
            }
            throw new Error("Network response was not ok");
          
        }
        return response.json();
    })
    .then(data => {
        console.log("External API Data:", data);
        if(data.data && data.data.current_data.currenttier){
         
            ranks[index] = data.data.current_data.currenttier;
            if(ranks[index]==0 ||ranks[index] == undefined){

                ranks[index] = 1;

                rankSet[index] = true;
            }
            // insertRankInHTML(data.data.currenttierpatched);
        }

        if(data.data && data.data.current_data.ranking_in_tier){
            console.log("MMR is: " + data.data.current_data.ranking_in_tier);
            mmr[index] = data.data.current_data.ranking_in_tier;
            // insertRankInHTML(data.data.currenttierpatched);
        }

          if(data.data &&  data.data.highest_rank.tier){
            peakRanks[index] = data.data.highest_rank.tier;
               console.log("Highest Rank is: " + data.data.highest_rank.tier);
            // insertRankInHTML(data.data.currenttierpatched);
        }
    })
    .catch(error => {
        console.error("Fetch error:", error);
    });
}
}

function getGameMode(info){

  if (info.res.match_info.game_mode) {
            gameMode=ValorantTools.parseGameMode(info.res.match_info.game_mode);
            insertGamemodeInHTML(gameMode.mode, gameMode.isRanked);
            if(gameMode.isRanked){
                isRanked = true;
            } else {
                isRanked = false;
            }
        }
        }

        function getMap(info){
            if (info.res.match_info.map) {
                procMap=ValorantTools.translateMap(info.res.match_info.map);
                insertMapInHTML(procMap);
            }
        }

        function getScore(info){
            if (info.res.match_info.score) {
                score=ValorantTools.formatScore(info.res.match_info.score);
                insertScoreInHTML(score);
            }
        }

function getRoundReport(info){
   
    if (info.res.match_info.round_number) {
        
        if(currentRound !== info.res.match_info.round_number){
            currentRound = info.res.match_info.round_number;
            console.log("New Round");
            if (info.res.match_info.round_report) {
                console.log("Round Report");

                if(JSON.parse(info.res.match_info.round_report).hit!= undefined){
               currentHits=currentHits + JSON.parse(info.res.match_info.round_report).hit;
                }

                 if(JSON.parse(info.res.match_info.round_report).final_headshot!= undefined){
               currentHeadshotKills = currentHeadshotKills + JSON.parse(info.res.match_info.round_report).final_headshot;
                }
                

                if(JSON.parse(info.res.match_info.round_report).headshot!= undefined){
               currentHeadshots = currentHeadshots + JSON.parse(info.res.match_info.round_report).headshot;
                }
                
                accuracy(currentHits,currentKills,currentHeadshots,currentHeadshotKills);
                console.log("Hits: "+currentHits+" Current HSK: " + currentHeadshotKills + "CurrentKills: "+ currentKills + "Headshots: "+ currentHeadshots);


            }
        }
    }

}
    