(()=>{"use strict";async function t(t){return await new Promise((a=>setTimeout(a,t)))}async function a(t,a=0){return(await fetch("https://awbw.amarriner.com/api/game/load_replay.php",{method:"POST",body:JSON.stringify({gameId:t,turn:a,initial:!0})})).json()}const e=t=>{t.attributes=t.attributes||[],t.classes=t.classes||[],t.children=t.children||[];const a=document.createElement(t.tag);return a.classList.add(...t.classes),t.attributes.forEach((([t,e])=>{a.setAttribute(t,e)})),a.innerText="",t.children.forEach((t=>{"string"==typeof t?a.innerText+=t:a.appendChild(t)})),a},n={fundschart:{name:"Total Funds Generated",button:{id:"fundsbutton",children:"Total Funds",chartName:"fundschart"},dataset:[{name:"fundsDataSet",type:"line"}],data:"funds"},incomechart:{name:"Income",button:{id:"incomebutton",children:"Income",chartName:"incomechart"},dataset:[{name:"incomeDataSet",type:"line"}],data:"income"},ucchart:{name:"Unit Count",button:{id:"ucbutton",children:"Unit Count",chartName:"ucchart"},dataset:[{name:"ucDataSet",type:"line"}],data:"unitCount"},uvchart:{name:"Unit Value",button:{id:"uvbutton",children:"Army Value",chartName:"uvchart"},dataset:[{name:"uvDataSet",type:"line"}],data:"unitValue"},hpchart:{name:"Unit HP",button:{id:"hpbutton",children:"Unit HP",chartName:"hpchart"},dataset:[{name:"hpDataSet",type:"line"}],data:"unitHP"},capturechart:{name:"Caps",button:{id:"capturebutton",children:"Caps",chartName:"capturechart"},dataset:[{name:"captureDataSet",type:"bar"}],data:"captureCount"},damagedealtchart:{name:"Damage Dealt",button:{id:"damagedealtbutton",children:"Damage Dealt",chartName:"damagedealtchart"},dataset:[{name:"damageDealtDataSet",type:"bar"}],data:"damageDealt"}},r={1:{primary:"#F46243",secondary:"#F89F8B",tertiary:"#D4310C"},2:{primary:"#446EFF",secondary:"#99AFFF",tertiary:"#001F8F"},3:{primary:"#12D815",secondary:"#8EF690",tertiary:"#064B07"},4:{primary:"#FBD412",secondary:"#FDE986",tertiary:"#B59703"},5:{primary:"#8A3E96",secondary:"#C78BD0",tertiary:"#5D2965"},6:{primary:"#C4443D",secondary:"#CF6863",tertiary:"#9C3530"},7:{primary:"#999B98",secondary:"#C2C2C1",tertiary:"#525251"},8:{primary:"#C58950",secondary:"#DBB694",tertiary:"#8A5A2E"},9:{primary:"#FCA339",secondary:"#FDC886",tertiary:"#DD7B03"},10:{primary:"#CBDDBA",secondary:"#A2C284",tertiary:"#6F964A"},16:{primary:"#1B43BD",secondary:"#3B65E3",tertiary:"#122D7D"},17:{primary:"#FE68CF",secondary:"#FE9ADF",tertiary:"#FD0DB1"},19:{primary:"#3ACFC1",secondary:"#7CDFD5",tertiary:"#208379"},20:{primary:"#CE64FE",secondary:"#DF9AFE",tertiary:"#A602F2"},21:{primary:"#5F7C0C",secondary:"#8DBA12",tertiary:"#B3E920"},22:{primary:"#BB534F",secondary:"#C66F6C",tertiary:"#E2B7B6"}};async function i(){const i=document.getElementById("gamecontainer"),s=function(){let t=[],a=[];Object.keys(n).forEach((r=>{let i=e({tag:"div",attributes:[["id",n[r].button.id]],children:[n[r].button.children]});i.onclick=()=>{Object.keys(n).forEach((t=>{document.getElementById(n[t].button.chartName).setAttribute("style","display: none;max-width: 100%!important;")})),document.getElementById(n[r].button.chartName).setAttribute("style","display: block;max-width: 100%!important;")};let s=e({tag:"canvas",attributes:[["style","display: none;max-width: 100%!important;"],["id",n[r].button.chartName]]});t.push(i),a.push(s)}));const r=e({tag:"div",attributes:[["style","position:absolute;right: -10px;background: #ddd;padding: 5px;top: -6px;"],["id","closebutton"]],children:["X"]});r.onclick=()=>{u.remove()};const i=e({tag:"div",attributes:[["id","chartsmenu"],["style","position:relative;display: flex;flex-flow: row;justify-content: space-around;margin-top: -25px;margin-bottom: 10px;cursor: pointer;"]],children:[...t,r]}),s=e({tag:"div",attributes:[["id","chartloader"]],children:["Fetching game data, this can take up to a minute depending on game length, please wait..."]}),o=e({tag:"div",attributes:[["id","chartswrapper"],["style","position: relative; width: 100%;"]],children:[s,...a]}),u=e({tag:"div",attributes:[["id","chartscontainer"],["style","position: relative; margin-top:20px;top: 33%;max-width: 1000px;width: 100%;height: 500px;padding: 40px 20px 20px;background: #fff;overflow: hidden;display: flex;flex-flow: column;"]],children:[i,o]});return u}();let o;i.appendChild(s);try{o=await async function(){const e=new URLSearchParams(window.location.search).get("games_id"),n=await async function(e){const n=await a(e),r=n.daySelector.length;let i,s={};if(2!==n.players.length)throw new Error("Can only work on 2 players, sorry.");n.players.forEach((async t=>{s[t.id]={player:t,turnsArray:[]}}));let o=0;for(;o<r;)await t(250),i=await a(e,o),s[i.gameState.currentTurnPId].turnsArray.push(i),o++;return s}(e);let r={};const i=Object.keys(n);let s={};return Object.keys(n).forEach((t=>{t==i[0]?s[t]=n[i[0]].player.order>n[i[1]].player.order?2:1:s[t]=n[i[1]].player.order>n[i[0]].player.order?2:1})),Object.keys(n).forEach((t=>{r[t]={name:n[t].turnsArray[0].gameState.players[t].users_username,turns:n[t].turnsArray.length,country:n[t].player.countries_id,turnOrder:s[t],units:[],funds:[],income:[],unitCount:[],unitValue:[],unitHP:[],unitHPCount:[],captureCount:[],damageDealt:[],damageTaken:[],coPowers:[]}})),Object.keys(n).forEach((t=>{let a=0;n[t].turnsArray.forEach(((e,n)=>{r[t].coPowers[n]=0,r[i[0]].units[n]=e.gameState.units,r[i[1]].units[n]=e.gameState.units,a+=e.gameState.players[t].players_funds;let o=0;Object.values(e.gameState.units).forEach((a=>{a.units_players_id==t&&(o+=a.units_hit_points)}));let u=o/e.gameState.players_units_count[t].total;const c=((t,a,e,n,r)=>{let i=0,s=0,o=0,u=0,c=0;return Object.values(t.actions).forEach((r=>{if("Power"===r.action&&(n[a].coPowers[e]++,r.hpChange&&(r.hpChange.hpGain&&r.hpChange.hpGain.players.forEach((t=>{Object.values(n[t].units[e]).forEach((a=>{n[t].units[e][a.units_id].units_hit_points+=r.hpChange.hpGain.hp,n[t].units[e][a.units_id].units_hit_points>=10&&(n[t].units[e][a.units_id].units_hit_points=10)}))})),r.hpChange.hpLoss&&r.hpChange.hpLoss.players.forEach((t=>{Object.values(n[t].units[e]).forEach((a=>{n[t].units[e][a.units_id].units_hit_points+=r.hpChange.hpLoss.hp,n[t].units[e][a.units_id].units_hit_points<=0&&(n[t].units[e][a.units_id].units_hit_points=0)}))})))),"Capt"===r.action&&20==r.buildingInfo.buildings_capture&&i++,"Fire"===r.action){let i=r.attacker.units_id,d=(n[a].units[e][i].units_players_id,n[a].units[e][i].units_cost),l=n[a].units[e][i].units_hit_points,h=r.attacker.units_hit_points;10!=h&&(0==h?(o=Math.round(d/10*l),n[a].units[e][i].units_hit_points=0):(o=Math.round(d/10*(l-h)),n[a].units[e][i].units_hit_points=h));let p=r.defender.units_id,y=(t.gameState.units[p].units_players_id,n[a].units[e][p].units_cost),m=n[a].units[e][p].units_hit_points,g=r.defender.units_hit_points;10!=g&&(0==g?(s=Math.round(y/10*m),n[a].units[e][p].units_hit_points=0):(s=Math.round(y/10*(m-g)),n[a].units[e][p].units_hit_points=g)),u+=s,c+=o}})),{captures:i,chartData:n,wholeDamageDealt:u,wholeDamageTaken:c}})(e,t,n,r);r=c.chartData;const d=c.captures,l=c.wholeDamageDealt,h=c.wholeDamageTaken;r[t].funds.push({x:`${n+1}.${s[t]}`,y:a}),r[t].income.push({x:`${n+1}.${s[t]}`,y:e.gameState.players[t].players_income}),r[t].unitCount.push({x:`${n+1}.${s[t]}`,y:e.gameState.players_units_count[t].total}),r[t].unitValue.push({x:`${n+1}.${s[t]}`,y:e.gameState.players_units_count[t].value}),r[t].unitHP.push({x:`${n+1}.${s[t]}`,y:o}),r[t].unitHPCount.push({x:`${n+1}.${s[t]}`,y:u}),r[t].captureCount.push({x:`${n+1}.${s[t]}`,y:d}),t==i[0]?(r[i[0]].damageDealt.push({x:`${n+1}.${s[i[0]]}`,y:l}),r[i[1]].damageDealt.push({x:`${n+1}.${s[i[1]]}`,y:h})):(r[i[1]].damageDealt.push({x:`${n+1}.${s[i[1]]}`,y:l}),r[i[0]].damageDealt.push({x:`${n+1}.${s[i[0]]}`,y:h}))}))})),r}()}catch(t){s.remove(),console.log(t)}if(!o)throw s.remove(),new Error("Failed to load game data.");document.getElementById("chartloader").remove(),Object.keys(o);const u=Math.max(...(t=>{let a=[];return Object.values(t).forEach((t=>{a.push(t.turns)})),a})(o));!function(t,a){let e=function(t){let a={fundsDataSet:[],incomeDataSet:[],ucDataSet:[],uvDataSet:[],uvDataSet2:[],hpDataSet:[],hpcDataSet:[],ucuvDataSet:[],captureDataSet:[],damageDealtDataSet:[],damageTakenDataSet:[]};return Object.keys(n).forEach((e=>{"UC/UV"==n[e].name||Object.values(t).forEach((t=>{let i={label:t.name+" "+n[e].name,backgroundColor:r[t.country].primary,borderColor:r[t.country].primary,data:t[n[e].data]};a[n[e].dataset[0].name].push(i)}))})),a}(t);Object.keys(n).forEach((t=>{const r={labels:a,datasets:e[n[t].dataset[0].name]},i={type:n[t].dataset[0].type,data:r,options:{}};new Chart(document.getElementById(t),i)})),document.getElementById("fundschart").setAttribute("style","display: block;")}(o,Array.from(Array(u).keys(),(t=>[[`${t+1}.1`],[`${t+1}.2`]].flat())).flat())}var s;s=function(){const t=e({tag:"div",classes:["game-tools-bg"],children:["Stats"]}),a=e({tag:"div",classes:["game-tools-btn","enchanced-stats"],children:[t]});a.onclick=()=>{i()};const n=e({tag:"section",children:[a]});document.getElementById("game-menu-controls").prepend(n)}(),"complete"===document.readyState||"interactive"===document.readyState?setTimeout(s,1):document.addEventListener("DOMContentLoaded",s)})();