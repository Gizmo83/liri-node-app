
require("dotenv").config();
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var request = require('request');
var fs = require("fs");

var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var operation = process.argv[2];
var search = process.argv[3];
for (var i = 4; i < process.argv.length; i++){
    search += " " + process.argv[i];
}


//Do what it says
if (operation === "do-what-it-says") {
    fs.readFile("random.txt", "utf8", function(error, data) {

        // If the code experiences any errors it will log the error to the console.
        if (error) {
        return console.log(error);
        }
        //console.log(data);
        var dataArr = data.split(",");
        //console.log(dataArr);
        operation = dataArr[0];
        search = dataArr[1];
        run();
    });
}

function run(){
    //Twitter
    if (operation === "my-tweets") {
        var params = {screen_name: 'newb_coder'};
        client.get('statuses/user_timeline', params, function(error, tweets, response) {
            if (!error) {
                if (tweets.length > 20) {
                    numbers.length = 20;
                }
                for (var i = 0; i < tweets.length; i++){
                    console.log("------------------------------------------------------------------");
                    console.log(tweets[i].user.screen_name + " - On: " + tweets[i].created_at);
                    console.log("Tweeted - " + tweets[i].text);
                    console.log("------------------------------------------------------------------");
                }
                
            }
        });
    }

    //Spotify
    if (operation === "spotify-this-song") {
        if (search === undefined){
            search = "The Sign Ace of Base";
        }
        spotify.search({ type: 'track', query: search, limit: 1 }, function(err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);
            }
            var artist = (data.tracks.items[0].album.artists[0].name);
            var song = (data.tracks.items[0].name);
            var album = (data.tracks.items[0].album.name);
            var link = (data.tracks.items[0].external_urls.spotify);
            console.log("------------------------------------------------------------------");
            console.log("Artist: " + artist);
            console.log("Album: " + album);
            console.log("Song: " + song);
            console.log("Link: " + link);
            console.log("------------------------------------------------------------------");
        });
    }

    //Movie
    

    if (operation === "movie-this") {
        if (search === undefined){
            search = "Mr. Nobody";
        }
        var queryUrl = "http://www.omdbapi.com/?t=" + search + "&y=&plot=short&apikey=trilogy";
        request(queryUrl, function(error, response, body) {
            
            // If the request is successful
            if (!error && response.statusCode === 200) {
                
                console.log("------------------------------------------------------------------");
                console.log("Title: " + JSON.parse(body).Title);
                console.log("Year Released: " + JSON.parse(body).Year);
                console.log("imdb Rating: " + JSON.parse(body).imdbRating);
                console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
                console.log("County: " + JSON.parse(body).Country);
                console.log("Language: " + JSON.parse(body).Language);
                console.log("Plot: " + JSON.parse(body).Plot);
                console.log("Actors: " + JSON.parse(body).Actors);
                console.log("------------------------------------------------------------------");
            }
        });
    }
}
run();