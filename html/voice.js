let useLocalDate = { }; // Все, что связяно с нашим игроком
let allPlayersList = { };
let IvContPeer = { }; // Все, что свяхано с Голосовым сатом
useLocalDate.pChannel = 0;
useLocalDate.pVolume = 1.0;
IvContPeer.READY = 1;
IvContPeer.WAIT = 2;
IvContPeer.NOSET = 3;
IvContPeer.WAITSTART = 4;
IvContPeer.ERROR = 5;
IvContPeer.BTNCLICK = 6;
IvContPeer.RADIOBTNCLICK = 7;
IvContPeer.LuaConverted = [ ];
IvContPeer.LuaConverted.START = 'START';
IvContPeer.LuaConverted.CONNECT = 'CONNECT';
IvContPeer.LuaConverted.DISCONNECT = 'DISCONNECT';
IvContPeer.LuaConverted.VOICE = 'VOICE_L';
IvContPeer.LuaConverted.VOICER = "VOICE_R";
IvContPeer.LuaConverted.LUAFUNCTION = "START_FUNCTION";
IvContPeer.LuaConverted.CHANGEVOICE = "CHANGE_PLAYER_VOICE";
IvContPeer.LuaConverted.CHANGEVOICER = "CHANGE_PLAYER_VOICE_R";
IvContPeer.LuaConverted.SET_PLAYER_CHANNEL = "SetPlayerChannel";
IvContPeer.LuaConverted.SET_PLAYER_VOLUME = "SetPlayerVolume";
IvContPeer.SetClientStatus = function(status) {
    console.log("SET STATUS " + status);
    useLocalDate.pStatus = status;
    switch(status)
    {
        case IvContPeer.READY: {
            $('#micro').attr('src', 'off.png');
            break;
        }
        case IvContPeer.BTNCLICK: {
            $('#micro').attr('src', 'on.png');
            break;
        }
        case IvContPeer.RADIOBTNCLICK: {
            $('#micro').attr('src', 'onr.png');
            break;
        }
        case IvContPeer.ERROR: {
            $('#micro').attr('src', 'error.png');
            break;
        }
    }
}
IvContPeer.LuaConverted.SendLuaData = function(nameHandler, dataObj) {
    $.post(`http://alv-voicechat/${nameHandler}`, JSON.stringify(dataObj), function(data) { 
        console.log(`[ALV-voicechat] ${data}`);
    });
}

IvContPeer.SetConsole = function(text, status) {
    if(status) {
        console.log(useLocalDate);
        console.log(allPlayersList);
        console.log(IvContPeer);
        console.log(`[ALV-voicechat]
        useLocalDate: ${useLocalDate}
        allPlayersList: ${allPlayersList}
        IvContPeer: ${IvContPeer}
        ((${text}))
        `);
    }
    else
    {
        console.log(`[ALV-voicechat] (((${text})))`);
    }
    
}

IvContPeer.sHandlers = [ ];
IvContPeer.sHandlers.Call = function(call) {
    IvContPeer.SetConsole("The player has connected to us.", true);
    IvContPeer.SetConsole("Microphone search...", false);
    navigator.getUserMedia({video: false, audio: true}, function(stream) {
        IvContPeer.SetConsole(`Microphone found.`, false);
        
        stream.getAudioTracks()[0].enabled = true;
        call.answer(stream); 
        call.on('stream', function(remoteStream) {
            IvContPeer.SetConsole("The player has connected to us. (Successfully)", false);
        });
    });
    
}
IvContPeer.sHandlers.Open = function(id) {
    IvContPeer.SetConsole(`Open Succ (${id})`, false);
    IvContPeer.SetConsole("Waiting for players", false);
    IvContPeer.LuaConverted.SendLuaData('StartSearchPlayers', { pId: useLocalDate.pId, pName: useLocalDate.pName });
    navigator.getUserMedia({video: false, audio: true}, function(stream) {
        IvContPeer.SetClientStatus(IvContPeer.READY); 
    });
    IvContPeer.sPeer.on('call', IvContPeer.sHandlers.Call)
}

StartLocalClient("MAIN", 2, "AA");
ConnectToPlayer(1, "ABS")
function StartLocalClient(SecuryID, pId, pName) {
    useLocalDate.sID = SecuryID;
    useLocalDate.pId = pId;
    useLocalDate.pName = pName;
    IvContPeer.SetClientStatus(IvContPeer.WAITSTART);
    IvContPeer.SetConsole(`Starting VoiceChat. (${useLocalDate.pId}${useLocalDate.sID})`, true);
    
    IvContPeer.sPeer = new Peer(`${useLocalDate.pId}${useLocalDate.sID}`);
    IvContPeer.SetConsole("Peer handler succ created!", true);
    IvContPeer.SetConsole("Listening for connections", false);
    IvContPeer.sPeer.on('open', IvContPeer.sHandlers.Open);
}

function ConnectToPlayer(pID, pName) {
    IvContPeer.SetConsole("Microphone search...", false);
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    navigator.getUserMedia({video: false, audio: true}, function(stream) {
        IvContPeer.SetConsole(`Microphone found. Attempting to connect to a player ${pID}${useLocalDate.sID}`, false);
        allPlayersList[pID] = [ ];
        allPlayersList[pID].pName = pName;
        allPlayersList[pID].callHandler = IvContPeer.sPeer.call(`${pID}${useLocalDate.sID}`, stream);
        allPlayersList[pID].callHandler.on('stream', function(remoteStream) {
              
            IvContPeer.SetConsole(`Connected to pName ${allPlayersList[pID].pName} [${pID}] succ! Create AudioStream...`, false);
           
            allPlayersList[pID].audioObj = document.createElement('audio');
            allPlayersList[pID].audioObj.id = "voicer_" + pID;
            allPlayersList[pID].pChannel = 0;
            
            document.getElementById('audblocks').appendChild(allPlayersList[pID].audioObj);
            allPlayersList[pID].audioObj.srcObject = remoteStream;
            allPlayersList[pID].audioObj.controls = 'controls';
            allPlayersList[pID].audioObj.autoplay = '';
            allPlayersList[pID].audioObj.volume = useLocalDate.pVolume;
            allPlayersList[pID].audioObj.style.opacity = "1.0";
            allPlayersList[pID].audioObj.pause();
            //newwlements.start();
           
            let namepla = pName;
            namepla = namepla.toUpperCase();
            namepla = namepla.replace('_', ' ');
            allPlayersList[pID].uiObj = document.createElement('p')
            allPlayersList[pID].uiObj.id = "voiceui_"+pID;
            allPlayersList[pID].uiObj.style.fontFamily = "'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif";
            allPlayersList[pID].uiObj.style.fontSize = "1.5vh";
            allPlayersList[pID].uiObj.innerText = ""+namepla;
            allPlayersList[pID].uiObj.style.textAlign = "center";
            allPlayersList[pID].uiObj.style.color = "#78d85d";
            allPlayersList[pID].uiObj.style.backgroundColor = "rgba(0, 0, 0, 0.418)";
            allPlayersList[pID].uiObj.style.padding = "5px";
            document.getElementById('audui').appendChild(allPlayersList[pID].uiObj);

            $("#voiceui_"+pID).hide();
            var vid = document.getElementById("voicer_"+pID);
            vid.volume = useLocalDate.pVolume;  
            IvContPeer.LuaConverted.SendLuaData('PlayerConnectedToVoice', { pId: pID });
            IvContPeer.SetConsole(`AudioStream to ${allPlayersList[pID].pName} [${pID}] created! Start Voice!`, false);
        });
    });
}

window.addEventListener('message', function(event)
{

    switch(event.data.pack) {
        case IvContPeer.LuaConverted.START: {
            StartLocalClient(event.data.sKey, event.data.pId, event.data.pName);
            break;   
        }
        case IvContPeer.LuaConverted.STOP: {
            // Nop
            break;
        }
        case IvContPeer.LuaConverted.LUAFUNCTION: {
            var args = event.data.args;
            switch(event.data.func) {
                case IvContPeer.LuaConverted.SET_PLAYER_CHANNEL: {
                    useLocalDate.pChannel = args[0];
                    IvContPeer.SetConsole(`Change pChannel to ${useLocalDate.pChannel}`, false);
                    break;
                }
                case IvContPeer.LuaConverted.SET_PLAYER_VOLUME: {
                    IvContPeer.SetConsole(`Change volume from ${useLocalDate.pVolume} to ${args[1]}`, false);
                    if(args[0] == -1)
                    {
                        useLocalDate.pVolume = args[1];
                        for(var i = 0; i < 32; i++)
                        {
                            if(allPlayersList[i].audioObj)
                            {
                                allPlayersList[i].audioObj.volume = args[1];
                            }
                        }
                    }
                    else
                    {
                        if(allPlayersList[args[0]].audioObj)
                        {
                            allPlayersList[args[0]].audioObj.volume = args[1];
                        }
                    }
                    
                }
            };
            break;
        }
        case IvContPeer.LuaConverted.CHANGEVOICE: {
            if(event.data.set == 1) {
                if(allPlayersList[event.data.pId].audioObj)
                {
                    allPlayersList[event.data.pId].audioObj.play();
                    $("#voiceui_"+event.data.pId).show();
                }
                

            } else if(event.data.set == 0) { 
                if(allPlayersList[event.data.pId].audioObj)
                {
                    allPlayersList[event.data.pId].audioObj.pause();
                    $("#voiceui_"+event.data.pId).hide();
                }
            }
            break;
        }
        case IvContPeer.LuaConverted.CHANGEVOICER: {

            if(useLocalDate.pChannel == allPlayersList[event.data.pId].pChannel) {
                if(event.data.set == 1) {
                    if(allPlayersList[event.data.pId].audioObj)
                    {
                        allPlayersList[event.data.pId].audioObj.play();
                        $("#voiceui_"+event.data.pId).show();
                    }
                    
    
                } else if(event.data.set == 0) { 
                    if(allPlayersList[event.data.pId].audioObj)
                    {
                        allPlayersList[event.data.pId].audioObj.pause();
                        $("#voiceui_"+event.data.pId).hide();
                    }
                }
            }
            break;
        }
        case IvContPeer.LuaConverted.VOICE: {
            console.log("CHANGE TO SET " + event.data.set + " " + useLocalDate.pStatus);
            if(event.data.set == 1 && useLocalDate.pStatus == IvContPeer.READY) {
                IvContPeer.SetClientStatus(IvContPeer.BTNCLICK);
            } else if(event.data.set == 0 && useLocalDate.pStatus == IvContPeer.BTNCLICK) { 
                IvContPeer.SetClientStatus(IvContPeer.READY);
            }
            break;
        }
        case IvContPeer.LuaConverted.VOICER: {
            if(event.data.set == 1 && useLocalDate.pStatus == IvContPeer.READY) {
                IvContPeer.SetClientStatus(IvContPeer.RADIOBTNCLICK);
            }
            else if(event.data.set == 0 && useLocalDate.pStatus == IvContPeer.RADIOBTNCLICK) { 
                IvContPeer.SetClientStatus(IvContPeer.READY);
            }
            break;
        }
        case IvContPeer.LuaConverted.CONNECT: {
            IvContPeer.SetConsole(`PEER CONNECT pID: ${event.data.pId} pName: ${event.data.pName}`, false);
            ConnectToPlayer(event.data.pId, event.data.pName);
            break;
        }
        case IvContPeer.LuaConverted.DISCONNECT: {
            console.log("DISCONNECT LOG! " + event.data.pId);
            if(allPlayersList[event.data.pId].audioObj)
            {
                allPlayersList[event.data.pId].audioObj.remove();
                if(allPlayersList[event.data.pId].uiObj)
                {
                    allPlayersList[event.data.pId].uiObj.remove();
                }
            }
            break;
        }
    }
    return;
    
}, false);