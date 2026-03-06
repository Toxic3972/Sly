const M5_IP = "http://192.168.178.200";
var M5_enabled = false;  //disable/enable here

function sendData(map,side){

    //var url = `${M5_IP}/data?data1=${map}`+`&data2=${side}`
    var team = getTeam(side);
    var mappedMap = PaperS3Tools.PAPERS3_MAP[map];
    var url = `${M5_IP}/data?data1=${mappedMap}`+`&data2=${team}`


    if(M5_enabled){

    fetch(url)
        .then(response => console.log("Sent to M5:", map))
        .catch(error => console.log("M5 is offline."));

    }

}