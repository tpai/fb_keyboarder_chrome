var msg_notif_i = 0, //msg & notif 索引
	story_i = 0, //story 索引
	group_i = 0, //sidebar 索引
	more_btn, //更多貼文按鈕物件
	home, //story container
	sidebar, //group container
	state = "story" //story or group
	
var setContainer = function(state) {
	if(state == "story") {
		//如果有兩個以上的uiStreamHomepage必然是社團中的置頂跟一般貼文 預設選擇一般貼文 並且必須時時更新 因為使用者可能會用滑鼠點開其他社團
		home = (document.getElementsByClassName("uiStreamHomepage").length > 1)?document.getElementsByClassName("uiStreamHomepage")[1]:document.getElementsByClassName("uiStreamHomepage")[0]
	}
	else if(state == "group") {
		if(document.getElementById("pinnedNav") != null) {
			sidebar = document.getElementById("pinnedNav").getElementsByClassName("uiSideNav")[0]
			var groups = sidebar.getElementsByClassName("sideNavItem")
			for(var i=0;i<groups.length;i++) {
				if(groups[i].className.search("selectedItem") != -1) {
					group_i = i
				}
			}
		}
	}
};

window.onload = function() {
	setContainer("story")
	setContainer("group")
};

//畫面移至story處 並點開留言
var showStory = function(index) {
	temp = index
	var story = home.getElementsByClassName("uiStreamStory")[index]
	if(story != undefined) {
		var comment = story.getElementsByClassName("comment_link")
		if(comment.length > 0)
			comment[0].getElementsByTagName("input")[0].click()
		var inputbox = story.getElementsByTagName("textarea")
		if(inputbox.length > 0)
			inputbox[0].focus()
		window.scrollTo(0, story.offsetTop)
	}
};

//開關對話框
var chatOnOff = function(offset) {
	var length = document.getElementById("fbDockChatTabs").childNodes.length
	var i = length - offset - 1;
	var tab = document.getElementById("fbDockChatTabs").childNodes[i]
	if(tab != undefined) {
		if(tab.className.search("opened") != -1) {
			tab.getElementsByClassName("titlebar")[0].click()
		}
		else {
			tab.getElementsByTagName("a")[0].click()
		}
	}
};

var tip = function(value) {
	var ico = document.createElement("div")
	ico.setAttribute("style", "position: absolute; right: 0px; bottom: 0px; font-size: 10px; line-height: 1; background-color: #3b5998; color: white;")
	ico.innerHTML = value
	return ico
};

document.getElementById("navHome").getElementsByTagName("a")[0].style.lineHeight = "14px"
document.getElementById("navHome").getElementsByTagName("a")[0].innerHTML += "<br />Alt+1"
document.getElementsByClassName("headerTinymanName")[0].style.lineHeight = "14px"
document.getElementsByClassName("headerTinymanName")[0].innerHTML += "<br />Alt+2"
document.getElementById("fbRequestsJewel").appendChild(tip("Z"))
document.getElementById("fbMessagesJewel").appendChild(tip("X"))
document.getElementById("fbNotificationsJewel").appendChild(tip("C"))
document.getElementById("fbNotificationsList").parentNode.parentNode.style.top = "0px"
document.getElementById("navSearch").appendChild(tip("V"))

window.onkeydown = function(e) {
	//console.log(e.which)
	var trigger, container, children, hover_style, n_shown
	if(document.getElementById("fbNotificationsFlyout").className.search("toggleTargetClosed") == -1) {
		container = document.getElementById("fbNotificationsList").parentNode.parentNode
		children = document.getElementById("fbNotificationsList").childNodes
		more_btn = document.getElementsByClassName("notifMorePager")[0]
		hover_style = "notifHover"
		n_shown = 7
	}
	else if (document.getElementById("fbMessagesFlyout").className.search("toggleTargetClosed") == -1) {
		container = document.getElementsByClassName("jewelContent")[0].parentNode.parentNode.parentNode.parentNode;
		children = document.getElementsByClassName("jewelContent")[0].getElementsByTagName("li")
		more_btn = document.getElementsByClassName("uiMorePager")[0]
		hover_style = "jewelItemNew"
		n_shown = 5
	}

	//Ctrl+Alt+
	if(e.ctrlKey && e.altKey) {
		switch(e.which) {
			//ESC
			case 27:
				if ("activeElement" in document)document.activeElement.blur()
				break
			//P
			case 80:
				if(document.getElementById("pagelet_stream_pager") != null)
					document.getElementById("pagelet_composer").getElementsByTagName("textarea")[0].focus()
				else
					document.getElementById("pagelet_group_composer").getElementsByTagName("textarea")[0].focus()
				break
			//A
			case 65:
				state = "group"
				window.scrollTo(0, 0)
				sidebar.children[group_i].getElementsByClassName("item")[0].style.backgroundColor = "#eff2f7"
				break
			//S
			case 83:
				state = "story"
				window.scrollTo(0, 0)
				showStory(story_i = 0)
				break
			//Z
			case 90:
				document.getElementById("fbRequestsJewel").getElementsByTagName("a")[0].click()
				break
			//X
			case 88:
				msg_notif_i = 0
				trigger = document.getElementById("fbMessagesJewel").getElementsByTagName("a")[0]
			//C
			case 67:
				msg_notif_i = 0
				//因為msg跟notif可以用相同的程式碼處理 所以利用trigger變數來區分按鈕
				//疑問: 為何不放上面跟container一起? 因為上面的判斷條件是是否已開啟flyout 沒點按鈕怎麼開flyout呢
				if(!trigger) trigger = document.getElementById("fbNotificationsJewel").getElementsByTagName("a")[0]

				trigger.click() //按下按鈕

				if ("activeElement" in document)document.activeElement.blur()
				
				container.style.top = "0px" //container位移至0

				//清除所有msg(notif)的hover效果
				for(var j=0;j<children.length;j++) {
					children[j].className = children[j].className.replace(" "+hover_style, "")
				}

				//在第零個顯示hover效果
				children[msg_notif_i].className += " "+hover_style
				break
			//D
			case 68: document.getElementsByClassName("fbChatSidebarMessage")[0].nextSibling.getElementsByClassName("innerWrap")[0].childNodes[0].focus(); break;
			//V
			case 86:
				document.getElementById("q").focus()
				break
			//?
			case 191: chatOnOff(0); break;
			//>
			case 190: chatOnOff(1); break;
			//<
			case 188: chatOnOff(2); break;
			//M
			case 77: chatOnOff(3); break;
			//N
			case 78: chatOnOff(4); break;
			//B
			case 66: chatOnOff(5); break;
		}
		return false;
	}
	else if(e.altKey) {

		switch(e.which) {
			//Alt+1
			case 97:
				document.getElementById("navHome").getElementsByTagName("a")[0].click()
				break
			//Alt+2
			case 98:
				document.getElementsByClassName("headerTinymanName")[0].parentNode.click()
				break
			//Alt+↑
			case 38:
				if(msg_notif_i - 1 >= 0 || story_i - 1 >= 0 || group_i - 1 >= 0) {

					if(msg_notif_i % n_shown == 0) {

						//將container目前高度加上本頁所有子代之高度 (此處的加 畫面就會往上捲)
						var top = parseInt(container.style.top, 10)
						var nowTop = top
						for(var j=msg_notif_i-n_shown;j<msg_notif_i;j++)
							nowTop += children[j].clientHeight-1;
						
						if(nowTop > 0)nowTop = 0
						
						container.style.top = nowTop + "px"
					}

					msg_notif_i--
					story_i--
					group_i--
					//如果沒有hover_style的設定就是story或group
					if(hover_style != undefined) {
						//移除上一個子代hover效果
						children[msg_notif_i+1].className = children[msg_notif_i+1].className.replace(" "+hover_style, "")
						//在當前子代加入hover效果
						children[msg_notif_i].className += " "+hover_style
					}
					else if(state == "story") {
						//期間可能會穿插廣告類子代 因此必須位移
						var dataft = home.getElementsByClassName("uiStreamStory")[story_i].getAttribute("data-ft")
						if(dataft != null)
							while(dataft.length >= 1000)story_i++
						showStory(story_i)
					}
					else if(state == "group") {
						sidebar.children[group_i+1].getElementsByClassName("item")[0].style.backgroundColor = "#ffffff"
						sidebar.children[group_i].getElementsByClassName("item")[0].style.backgroundColor = "#eff2f7"
					}
				}
				break
			//Alt+↓
			case 40:
				msg_notif_i++
				story_i++
				group_i++
				//如果沒有hover_style的設定就是story
				if(msg_notif_i != 0 && hover_style != undefined) {
					//移除上一個子代hover效果
					children[msg_notif_i-1].className = children[msg_notif_i-1].className.replace(" "+hover_style, "")
					//在當前子代加入hover效果
					children[msg_notif_i].className += " "+hover_style
					//達到需要換頁的數量時
					if(msg_notif_i % n_shown == 0) {
						//避免有些container沒有起始值
						if(container.style.top == "")container.style.top = "0px" //to avoid empty

						//將container目前高度減去本頁所有子代之高度 (此處的減 畫面就會往下捲)
						var top = parseInt(container.style.top, 10)
						var nowTop = top
						for(var j=msg_notif_i-n_shown;j<msg_notif_i;j++)
							nowTop -= children[j].clientHeight-1;

						container.style.top = nowTop + "px"
					}
				}
				else if(story_i != 0 && state == "story") {
					//期間可能會穿插廣告類子代 因此必須位移
					var dataft = home.getElementsByClassName("uiStreamStory")[story_i].getAttribute("data-ft")
					if(dataft != null)
						while(dataft.length >= 1000)story_i++
					showStory(story_i)
				}
				else if(group_i != 0 && state == "group") {
					//防止超過最愛的總數
					if(group_i > sidebar.children.length - 1)group_i--;
					else {
						sidebar.children[group_i-1].getElementsByClassName("item")[0].style.backgroundColor = "#ffffff"
						sidebar.children[group_i].getElementsByClassName("item")[0].style.backgroundColor = "#eff2f7"
					}
				}
				break
		}
	}
	else if(e.ctrlKey) {
		switch(e.which) {
			//Ctrl+↵
			case 13:
				//點擊msg跟notif
				if(document.getElementById("fbNotificationsFlyout").className.search("toggleTargetClosed") == -1 || document.getElementById("fbMessagesFlyout").className.search("toggleTargetClosed") == -1) {
					//使用彈出式視窗
					children[msg_notif_i].getElementsByTagName("a")[0].target = "_blank"
					children[msg_notif_i].getElementsByTagName("a")[0].click()
				}
				else if(state == "group") {
					sidebar.children[group_i].getElementsByClassName("item")[0].click()
				}
				break
			//Ctrl+\
			case 220:
				if(state == "story") {
					home.getElementsByClassName("uiStreamStory")[story_i].getElementsByClassName("UFILikeLink")[0].click()
				}
				break
		}
	}
};

//每秒鐘偵測是否有子代不足使用者瀏覽的情況 目前皆訂為瀏覽到80%就要繼續擷取
setInterval(function() {
	if (document.getElementById("fbNotificationsFlyout").className.search("toggleTargetClosed") == -1) {
		if((msg_notif_i+1) / document.getElementById("fbNotificationsList").childNodes.length >= 0.8) {
			document.getElementsByClassName("notifMorePager")[0].getElementsByTagName("a")[0].click()
		}
	}
	else if (document.getElementById("fbMessagesFlyout").className.search("toggleTargetClosed") == -1) {
		if((msg_notif_i+1) / document.getElementsByClassName("jewelContent")[0].getElementsByTagName("li").length >= 0.8) {
			document.getElementsByClassName("uiMorePager")[0].getElementsByTagName("a")[0].click()
		}
	}
	else if (state == "story"){
		setContainer("story")
		if(home != undefined)
		if((story_i+1) / home.getElementsByClassName("uiStreamStory").length >= 0.8) {
			//首頁的更多消息按鈕id與社團的不同
			if(document.getElementById("pagelet_stream_pager") != null) {
				document.getElementById("pagelet_stream_pager").getElementsByClassName("uiMorePagerPrimary")[0].click()
			}
			else if(document.getElementById("pagelet_group_pager") != null) {
				document.getElementById("pagelet_group_pager").getElementsByClassName("uiMorePagerPrimary")[0].click()
			}
		}
	}
}, 1000);