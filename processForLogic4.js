// process.js

class Player {
 
    constructor(name) {
        this.id = null;
        this.name = name;           // "Toxic #REIGN"
        this.agent = null;         // "Wraith" (Note: Wraith is Omen in api usually, check mappings!)
        this.rank = null;           // 0 (Unranked) to ~24
        this.isLocal = false;     // true/false (Is this ME?)
        this.isTeammate = false; // true/false
        this.locked = null;
        this.position = null;
        this.kills = 0;
        this.deaths = 0;
        this.assists = 0; 
    }

    // Helper to get clean name without tag if needed
    getDisplayName() {
        return this.name.split('#')[0];
    }
}


function updatePlayerVariable(playerObj, jsonData, pos) {
  
    playerObj.id = jsonData.player_id;
    playerObj.name = jsonData.name;
    playerObj.agent = ValorantTools.translateAgent(jsonData.character);
    playerObj.rank = ValorantTools.translateRank(jsonData.rank);
    playerObj.isLocal = jsonData.local;
    playerObj.isTeammate = jsonData.teammate;
    playerObj.isLocked = jsonData.locked;
    playerObj.position = pos; 

    insertNameInHTML(playerObj.name,"htmlname" + pos);
    insertAgentInHTML(playerObj.agent, "htmlagent" + pos);
    
    
}
function insertKDAInHTML(kills,deaths,assists,id){
if (kills===undefined || deaths===undefined || assists===undefined) {

    return;

}
if (kills===null || deaths===null || assists===null) {

    return;

}

var element = document.getElementById("htmlkda" + id);

if (element) {
       
         element.innerHTML = kills + "/" + deaths +"/" + assists;
    
    }

}
function insertNameInHTML(playerName,position){
    if (playerName===null || playerName===undefined) return;
           
            var parts = playerName.split('#');
            var element = document.getElementById("htmlname" + position);
            if (element) {
            if (parts.length > 1) {
             var justName = parts[0];
                var justTag = "#" + parts[1]; 
             // Inject HTML to keep the color!
                element.innerHTML = justName + '<span class="highlight">' + justTag + '</span>';
         } 
            else {
        // CASE B: No tag found (Just Name)
        element.innerText = playerName;
        }
        }

}
function insertOwnRank(rankName, mmr){
var element = document.getElementById("own-rank");
var elementMMR = document.getElementById("htmlmmr");
if (element&& rankName != -1) {
        
        element.style.backgroundImage = "url('icons/" + "rank" + rankName + ".webp')";
    }

    if (elementMMR && mmr !=undefined) {
        
        elementMMR.innerText = mmr + "RR";
    }
}

function insertAgentInHTML(agentName,id){
var element = document.getElementById("htmlagent" + id);

if (element) {
        // 2. Clean the name to match your file names
        // e.g. "Omen" becomes "omen" to match "icons/omen.webp"
        var fileName = agentName.toLowerCase(); 
        
        // 3. Update the CSS Background Image
        // Note: We need to reconstruct the full "url(...)" string
        element.style.backgroundImage = "url('icons/" + fileName + ".webp')";
    }
}

function insertRankInHTML(rankName,id){
var element = document.getElementById("htmlrank" + id);
if (element&& rankName != -1) {
        
        element.style.backgroundImage = "url('icons/" + "rank" + rankName + ".webp')";
    }
}

//peak rank 0-9?
function insertPeakInHTML(rankName,id){
var element = document.getElementById("htmlpeakrank" + id);
if (element&& rankName != -1) {
        
        element.style.backgroundImage = "url('icons/" + "rank" + rankName + ".webp')";
    }
}

function insertShieldInHTML(shield,id){
var element = document.getElementById("htmlshield" + id);
if (element&& shield != -1) {
        
        element.style.backgroundImage = "url('icons/" + "shield" + shield + ".webp')";
    }

    if (element&& shield == -1) {
        
        element.style.backgroundImage = "url('icons/empty.png')";
    }
}

function insertGamemodeInHTML(gamemode, isRanked){

var element = document.getElementById("htmlgamemode");

if (element) {
       
         element.innerHTML = gamemode;
    
    }

if(isRanked === true){
    isRanked = "Competitive";
} else {
    isRanked = "Unrated";
}

var element2 = document.getElementById("htmlisranked");


if (element2) {
       
         element2.innerHTML = isRanked;
    
    }
}

function insertMapInHTML(map){

var element = document.getElementById("htmlmap");

if (element) {
element.innerHTML = map;
}
}

function insertTeamInHTML(team){

var element = document.getElementById("htmlteam");
console.log("current team: " + team);
if (element) {

    if(team === 1){
        element.innerHTML = "DEF";
    }

     if(team === 2){
        element.innerHTML = "ATK";
    }


}
}

function insertScoreInHTML(score){

var element = document.getElementById("htmlscore");

if (element) {
element.innerHTML = score;
}
}

function insertWeaponInHTML(weapon, id) {
    if(weapon === undefined) return;
   
   
    var selector = ".primaryContainer" + id + " img";
    var imageElement = document.querySelector(selector);

    if (imageElement) {
        
        var fileName = weapon.toLowerCase();
        imageElement.src = "icons/" + fileName + ".webp";
        
}
}

function isAlive(alive, id) {

    id= id+1;

    var element = document.querySelector(".player-card" + id);
   

    if (element) {
        if (alive === true || alive === null || alive === undefined) {
             element.style.backgroundImage = "url('icons/playercard.png')";
             if(id == 1){
                 element.style.backgroundImage = "url('icons/me_.png')";
             }
             }
            
         else if (alive === false) {
            
            element.style.backgroundImage = "url('icons/dead_.png')";
            
        }
    }
}


function hasSpike(spike, id) {

 
    var element = document.querySelector(".has-spike" + id);

    if (element) {
        if (spike === true) {
            element.style.visibility = "visible"; 
          
        } else if (spike === false  || spike === null || spike === undefined) {
          
            element.style.visibility = "hidden";  
           
        }
    }
}

function insertUltPointsInHTML(id,number,color,visibility){
//id = pos, number = pos horizontal, color = String "white" or "", visibility = String "visible", "hidden"

var element = document.querySelector(".ult-point" + id + "-" + number);

if (element) {
        // grey -> color = "", white -> "white"
        var fileName = color; 
        
        element.style.backgroundImage = "url('icons/" + "Ult_" + fileName + ".png')";
        //"hidden", "visible"
        element.style.visibility = visibility;
    }
}

function hasUlt(points, max, id) {
//check if ult is available
var element = document.querySelector(".has-ult" + id);
 if(points == max && points!=undefined && points !=0){
    

    if (element) {
        element.style.visibility = "visible";  
    }
} else {
    if (element) {
       element.style.visibility = "hidden";  
    }
    
}

}

function accuracy(hits, kills, hs, hsk){
var totalHs;
var hskpercentage;
var hspercentage;

totalHs = hs+hsk;
hspercentage = hits > 0 ? totalHs * 100 / hits : 0;
hskpercentage = kills > 0 ? hsk * 100 / kills : 0;

var element = document.getElementById("htmlhs");

if (element) {
        // We use innerHTML so the <br> is read as a new line, not text
        element.innerHTML = hspercentage.toFixed(0) + "%<br>" + hskpercentage.toFixed(0) + "%";
    }

}




const ValorantTools = {
    
    
    AGENT_MAP: {
       "Clay_PC_C": "Raze",
       "Pandemic_PC_C": "Viper",
       "Wraith_PC_C": "Omen",
       "Hunter_PC_C": "Sova",
       "Thorne_PC_C": "Sage",
       "Phoenix_PC_C": "Phoenix",      
       "Wushu_PC_C": "Jett",
       "Gumshoe_PC_C": "Cypher",
       "Sarge_PC_C": "Brimstone",
       "Breach_PC_C": "Breach",
       "Vampire_PC_C": "Reyna",
       "Killjoy_PC_C": "Killjoy",
       "Guide_PC_C": "Skye",
       "Stealth_PC_C": "Yoru",
       "Rift_PC_C": "Astra",
       "Grenadier_PC_C": "kayo",
       "Deadeye_PC_C": "Chamber",
       "Sprinter_PC_C": "Neon",
       "BountyHunter_PC_C": "Fade",
       "Mage_PC_C": "Harbor",
       "AggroBot_PC_C": "Gekko",
       "Cable_PC_C": "Deadlock",
       "Sequoia_PC_C": "Iso",
       "Smonk_PC_C": "Clove",
       "Nox_PC_C": "Vyse",
       "Cashew_PC_C": "Tejo",
       "Terra_PC_C": "Waylay",
       "Pawn_Guide_Q_PossessableScout_C":"Skye",
       "Clay": "Raze",
       "Pandemic": "Viper",
       "Wraith": "Omen",
       "Hunter": "Sova",
       "Thorne": "Sage",
       "Phoenix": "Phoenix",      
       "Wushu": "Jett",
       "Gumshoe": "Cypher",
       "Sarge": "Brimstone",
       "Breach": "Breach",
       "Vampire": "Reyna",
       "Killjoy": "Killjoy",
       "Guide": "Skye",
       "Stealth": "Yoru",
       "Rift": "Astra",
       "Grenadier": "kayo",
       "Deadeye": "Chamber",
       "Sprinter": "Neon",
       "BountyHunter": "Fade",
       "Mage": "Harbor",
       "AggroBot": "Gekko",
       "Cable": "Deadlock",
       "Sequoia": "Iso",
       "Smonk": "Clove",
       "Nox": "Vyse",
       "Cashew": "Tejo",
       "Terra": "Waylay",
       "Pawn_Guide_Q_PossessableScout_C":"Skye",
       "Pine" : "Veto",
       "Aggrobot" : "Gekko",
       "KAY/O" : "kayo"
    },

    MAP_MAP: {
        "Infinity": "Abyss",
        "Triad": "Haven",
        "Duality": "Bind",
        "Bonsai": "Split",
        "Ascent": "Ascent",
        "Port": "Icebox",
        "Foxtrot": "Breeze",
        "Canyon": "Fracture",
        "Pitt": "Pearl",
        "Jam": "Lotus",
        "Juliett": "Sunset",
        "Rook": "Corrode",
        "Range": "Practice Range",
        "HURM_Alley": "District",
        "HURM_Yard": "Piazza",
        "HURM_Bowl": "Kasbah",
        "HURM_Helix": "Drift",
        "HURM_HighTide": "Glitch"
    },

    RANK_MAP: {
        0 : "Unranked",
        1 : "Unknown",
        2 : "Unknown",
        3 : "Iron 1",
        4 : "Iron 2",
        5 : "Iron 3",
        6 : "Bronze 1",
        7 : "Bronze 2",
        8 : "Bronze 3", 
        9 : "Silver 1",
        10 : "Silver 2",
        11 : "Silver 3",
        12 : "Gold 1",
        13 : "Gold 2",
        14 : "Gold 3",
        15 : "Platinum 1",
        16 : "Platinum 2",
        17 : "Platinum 3",
        18 : "Diamond 1",
        19 : "Diamond 2",
        20 : "Diamond 3",
        21 : "Ascendant 1",
        22 : "Ascendant 2",
        23 : "Ascendant 3",
        24 : "Immortal 1",
        25 : "Immortal 2",
        26 : "Immortal 3",
        27 : "Radiant"
    },

    WEAPON_MAP: {
      
    "TX_Hud_Pistol_Classic" : "Classic",
    "TX_Hud_Pistol_Slim" : "Shorty",
    "TX_Hud_Pistol_AutoPistol" : "Frenzy",
    "TX_Hud_Pistol_Luger" :"Ghost",
    "TX_Hud_Pistol_Sheriff" : "Sheriff",
    "TX_Hud_Shotguns_Pump" : "Bucky",
    "TX_Hud_Shotguns_Persuader" : "Judge",
    "TX_Hud_SMGs_Vector" : "Stinger",
    "TX_Hud_SMGs_Ninja" : "Spectre",
    "TX_Hud_Rifles_Burst" : "Bulldog",
    "TX_Hud_Rifles_DMR" : "Guardian",
    "TX_Hud_Rifles_Ghost" : "Phantom",
    "TX_Hud_Rifles_Volcano" : "Vandal",
    "TX_Hud_Sniper_Bolt" : "Marshal",
    "TX_Hud_Sniper_Operater" : "Operator",
    "TX_Hud_Sniper_DoubleSniper" : "Outlaw",
    "TX_Hud_LMG" : "Ares",
    "TX_Hud_HMG" : "Odin",
    "knife" : "Knife",
    "TX_Hud_Pistol_Compact" : "Bandit"
    },

    // --- FUNCTIONS ---
    
    // 1. Translate Agent ID to Name
    translateAgent: function(agentId) {
        // Return the clean name, or the original ID if not found
        return this.AGENT_MAP[agentId] || agentId || "Unknown Agent";
    },

    // 2. Translate Map ID to Name
    translateMap: function(mapId) {
        return this.MAP_MAP[mapId] || mapId || "Unknown Map";
    },

     translateWeapon: function(weaponId) {
        return this.WEAPON_MAP[weaponId] || weaponId || "-";
    },

        translateRank: function(rankId) {
        return this.RANK_MAP[rankId] || rankId || "Rank Unknown";
    },


    formatScore: function(rawScore) {
        let scoreObj = rawScore;

        // 1. Safety Check: If it's a string (which it usually is), parse it into an Object
        if (typeof rawScore === 'string') {
            try {
                scoreObj = JSON.parse(rawScore);
            } catch (e) {
                console.error("Score parse error", e);
                return "0:0";
            }
        }
        // 2. Extract 'won' and 'lost' and combine them
        // We check strict undefined because score could be 0
        if (scoreObj && scoreObj.won !== undefined && scoreObj.lost !== undefined) {
            return `${scoreObj.won}:${scoreObj.lost}`;
        }

        return "0:0"; // Default if data is bad
    },

    parseGameMode: function(rawModeString) {
        // Default values in case parsing fails
        let result = {
            mode: "Unknown",
            isCustom: false,
            isRanked: false
        };

        if (typeof rawModeString === 'string') {
            try {
                const parsed = JSON.parse(rawModeString);
                
                // 1. Extract Mode
                if (parsed.mode) result.mode = parsed.mode;
                if(result.mode==="bomb") result.mode="Standard";
                if(result.mode==="swift") result.mode="Swiftplay";
                if(result.mode==="deathmatch") result.mode="Deathmatch";
                if(result.mode==="team_deathmatch") result.mode="Team Deathmatch";
                if(result.mode==="range") result.mode="Range";
                if(result.mode==="escalation") result.mode="Escalation";
                if(result.mode==="quick_bomb") result.mode="Spike Rush";
                if(result.mode==="snowball_fight") result.mode="Snowball Fight";

                // 2. Extract Custom (It is already true/false)
                if (parsed.custom !== undefined) result.isCustom = parsed.custom;

                // 3. Ranked Logic (The Fix)
                // We convert it to a string just to be safe, then check if it is exactly "1"
                if (parsed.ranked !== undefined) {
                    result.isRanked = (String(parsed.ranked) === "1");
                }
                
            } catch (e) {
                console.error("Game Mode parse error", e);
            }
        }
        return result;
    }

        
  
};