/* Global Arrays */
var streams=new Array();
var games=new Array();

/* Streams */
function Stream(channel,game,status,logo,viewers) {
	this.channel=channel;
	this.game=game;
	this.status=status;
	this.logo=logo;
	this.viewers=viewers;
}

Stream.prototype.render = function(){
	return	"<a href='http://twitch.tv/"+this.channel+"/popout'>"+
			"<img src='"+this.logo+"'><br/>"+
			this.status +
			"</a><br/>"+
			"Playing <a href='javascript:getStreamsByGame(\""+this.game+"\");'>"+this.game+"</a><br/>"+
			this.viewers+" viewers";
}

function getMostViewed() {
	streams=new Array();
	$("#streamsTitle").html("Most Viewed Streams");
	$("#streams").html("");
	Twitch.api({method: 'streams', params: {limit:5} }, function(error, list) {
		for (x in list.streams) {
			var channel=list.streams[x].channel;
			streams.push(new Stream(channel.name,channel.game,channel.status,channel.logo,list.streams[x].viewers));
		}
		for (x in streams) {
			$("#streams").append("<li>"+streams[x].render()+"</li>");
		}
	});
}

function getStreamsByGame(gamename) {
	streams=new Array();
	$("#streamsTitle").html(gamename+" Streams");
	$("#streams").html("");
	Twitch.api({method: 'streams', params: {limit:5,game:gamename} }, function(error, list) {
		for (x in list.streams) {
			var channel=list.streams[x].channel;
			streams.push(new Stream(channel.name,channel.game,channel.status,channel.logo,list.streams[x].viewers));
		}
		for (x in streams) {
			$("#streams").append("<li>"+streams[x].render()+"</li>");
		}
		if (streams.length==0) {
			$("#streams").html("No streams found");
		}
	});
}

/* Games */
function Game(name,logo) {
	this.name=name;
	this.logo=logo;
}

Game.prototype.render = function(){
	return	"<a href='javascript:getStreamsByGame(\""+this.name+"\")'>"+
			"<img src='"+this.logo+"'/><br/>"+
			this.name +
			"</a>";
}

function getGames() {
	games=new Array();
	Twitch.api({method: 'games/top', params: {limit:5} }, function(error, list) {
		for (x in list.top) {
			games.push(new Game(list.top[x].game.name,list.top[x].game.logo.medium));
		}
		for (x in games) {
			$("#filters ul").append("<li>"+games[x].render()+"</li>");
		}
	});
}

/* Init */
Twitch.init({clientId: 'YOUR_CLIENT_ID_HERE'}, function(error, status) {
	getGames();
	getMostViewed();
});
