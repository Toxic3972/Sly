var actualTeam = true;
const PaperS3Tools = {
    
    
    PAPERS3_MAP: {
       "connected": "connected",
       "Abyss": "1",
       "Haven": "2",
       "Bind": "3",
       "Split": "4",
       "Ascent": "5",
       "Icebox": "6",
       "Breeze": "7",
       "Fracture" : "8",
        "Pearl" : "9",
        "Lotus" : "10",
        "Sunset" : "11",
        "Corrode" : "12"
    }
}

function newRound(round,team,gamemode){   //team 0 = attack first, team 1 = defense first
    console.log(round + " " + team + " " + gamemode);
    if(gamemode === "Standard"){
        if(round<=12 || round == 25 || round == 27 || round == 29 || round == 31 || round == 33){
            actualTeam = true; //the team is the same as the start team

        } else{
            actualTeam = false;
        }

    }

}

function getTeam(team){

    if(actualTeam){

        return team;
    }
    else if(team == 0){

        team = 1;
        return team;
    }

    else if(team == 1){

        team = 0;
        return team;
    }



}