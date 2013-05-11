// worker to update Tweets in background thread
var timer;
var updateInterval = 60000; // 60s * 1000ms => 1 min
var tweetCachePath = "cache/tweets";
var lastUpdatedPath = "cache/lastUpdated";

// this doesn't need to be ajax if it's background so
// the getTweets func doesn't need to be ajax either and
// can instead get an html block instead of making multiple calls


// http://stackoverflow.com/questions/4838883/html-web-worker-and-jquery-ajax-call

// have to import firebase unless you pass it in?
function getFirebaseRef(path) {
    // could put this func in common.js and do importScripts('common.js');
    // actually, can pass this in
    var dataRef = new Firebase("https://espeed.firebaseio.com/tinkerbook/");
    return dataRef.child(path);
}

function updateDecision(lastUpdated) {

    var delta = $.now() - lastUpdated;
    return (updateInterval < delta);

}

function maybeUpdateTweets() {
    var lastUpdatedRef = getFirebaseRef(lastUpdatedPath);
    lastUpdatedRef.on('value', function(dataSnapshot) {
	var lastUpdated = dataSnapshot.val();
	if (updateDecision(lastUpdated) === true) {
	    console.log("updating tweets");
	    getFavoriteTweets();
	} else {
	    console.log("there's still time -- not updating tweets yet");
	}
    });
}

// you can't use an in-worker timer because you could have 10000 users 

function getOmbedTweet(tweet, tweetCacheRef) {

    $.ajax({
	url:'https://api.twitter.com/1/statuses/oembed.json',
	data: {id: tweet.id_str},
	dataType:'jsonp'
    }).done(function (data) {
	console.log("adding tweet");
	console.log(data);
	var id = data.url.split('/').pop(); 
	console.log(data.url);
	console.log(id)
	tweetCacheRef.child(id).set(data);
    });
    
}

function updateTweets() {
    
    console.log("updating tweets");

    $.ajax({
	url:'https://api.twitter.com/1/favorites.json',
	data: {screen_name: "TinkerPopBook", count: maxTweets},
	dataType:'jsonp'
    }).done(function(data) {
	console.log(data);
	var tweetCacheRef = getFirebaseRef(tweetCachePath);
	data.map(function (data) {
	    getOmbedTweet(data, tweetCacheRef);
	});
    });

    timer = setTimeout(updateTweets, 10000);

}

onmessage = function (event) {
  if (timer)
    clearTimeout(timer);
  //symbol = event.data;
  updateTweets();
};


//maybeUpdateTweets();
