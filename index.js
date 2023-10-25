var container = document.getElementById("container");
 
window.onload = function() {
    
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
 
        if(this.readyState == 4 && this.status == 200) {
            
            //读取JSON文件，把字符串转换为js对象
            var message = JSON.parse(this.responseText);
            
			console.log(message);
			
			for(var _i_1 in message.devices){
				if(message.devices[_i_1].deviceID == ""){
					continue;
				}
				var div_ = document.createElement("div");
				var device = document.createElement("h3");
				var node = document.createTextNode(message.devices[_i_1].deviceID);
				//var link_ = document.createElement("a");
				//link_.href = "devices?id="+message.devices[_i_1].deviceID;
				//device.appendChild(link_);
				//link_.appendChild(node);
				div_.appendChild(device);
				device.appendChild(node);
				for(var _i_2 in message.devices[_i_1].users){
					var user = document.createElement("h4");
					var node_uid = document.createTextNode(message.devices[_i_1].users[_i_2].userID);
					div_.appendChild(user);
					user.appendChild(node_uid);
					for(var _i_3 in message.devices[_i_1].users[_i_2].tasks){
						var sr = message.devices[_i_1].users[_i_2].tasks;
						if(sr[_i_3].state == -1)continue;
						var task = document.createElement("p");
						var taskinfo = sr[_i_3].id+
						               "|Type:"+sr[_i_3].type+
									   "|Param:"+sr[_i_3].params+
									   "|start:"+sr[_i_3].start;
									   if(sr[_i_3].state == 1){
										   taskinfo = taskinfo +
										              "|Ongoing";
									   }else if(sr[_i_3].state == 2){
										   taskinfo = taskinfo +
										              "|Done at " + sr[_i_3].end;
									   }
						var node_task = document.createTextNode(taskinfo);
						div_.appendChild(task);
						task.appendChild(node_task);
					}
					var wakeup = document.createElement("a");
					wakeup.href = "com?dev="+message.devices[_i_1].deviceID + "&usr=" + message.devices[_i_1].users[_i_2].userID + "&mth=LinkStart"
					var wakeup_ = document.createTextNode("○Wake up then do all○");
					div_.appendChild(wakeup);
					wakeup.appendChild(wakeup_);
					
					var split_ = document.createElement("br");div_.appendChild(split_);
					
					var wakeup_Launch = document.createElement("a");
					wakeup_Launch.href = "com?dev="+message.devices[_i_1].deviceID + "&usr=" + message.devices[_i_1].users[_i_2].userID + "&mth=LinkStart-WakeUp"
					var wakeup_Launch_l = document.createTextNode("○Just Launch Game○");
					div_.appendChild(wakeup_Launch);
					wakeup_Launch.appendChild(wakeup_Launch_l);
					
					var wakeup_Battle = document.createElement("a");
					wakeup_Battle.href = "com?dev="+message.devices[_i_1].deviceID + "&usr=" + message.devices[_i_1].users[_i_2].userID + "&mth=LinkStart-Combat"
					var wakeup_Battle_l = document.createTextNode("Combat○");
					div_.appendChild(wakeup_Battle);
					wakeup_Battle.appendChild(wakeup_Battle_l);
					
					var wakeup_Recruit = document.createElement("a");
					wakeup_Recruit.href = "com?dev="+message.devices[_i_1].deviceID + "&usr=" + message.devices[_i_1].users[_i_2].userID + "&mth=LinkStart-Recruiting"
					var wakeup_Recruit_l = document.createTextNode("Recruit○");
					div_.appendChild(wakeup_Recruit);
					wakeup_Recruit.appendChild(wakeup_Recruit_l);
					
					var wakeup_Mall = document.createElement("a");
					wakeup_Mall.href = "com?dev="+message.devices[_i_1].deviceID + "&usr=" + message.devices[_i_1].users[_i_2].userID + "&mth=LinkStart-Mall"
					var wakeup_Mall_l = document.createTextNode("Collect Mall○");
					div_.appendChild(wakeup_Mall);
					wakeup_Mall.appendChild(wakeup_Mall_l);
					
					var wakeup_Mission = document.createElement("a");
					wakeup_Mission.href = "com?dev="+message.devices[_i_1].deviceID + "&usr=" + message.devices[_i_1].users[_i_2].userID + "&mth=LinkStart-Mission"
					var wakeup_Mission_l = document.createTextNode("Mission Rewards○");
					div_.appendChild(wakeup_Mission);
					wakeup_Mission.appendChild(wakeup_Mission_l);
					
					var wakeup_AutoIS = document.createElement("a");
					wakeup_AutoIS.href = "com?dev="+message.devices[_i_1].deviceID + "&usr=" + message.devices[_i_1].users[_i_2].userID + "&mth=LinkStart-AutoRoguelike"
					var wakeup_AutoIS_l = document.createTextNode("AutoIS○");
					div_.appendChild(wakeup_AutoIS);
					wakeup_AutoIS.appendChild(wakeup_AutoIS_l);
				}
				document.getElementById("container").appendChild(div_);
			}
		}
    };
 
    xmlhttp.open("GET", "getCurrentLogin", true);
    xmlhttp.send();
}
