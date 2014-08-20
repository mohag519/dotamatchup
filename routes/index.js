var request = require('request');
var cheerio = require('cheerio');
var Enumerable = require('linq');
var fs = require('fs');

/* GET home page. */
exports.index = function(req, res){
  res.render('index', { title: 'Dota Matchups' });
};

exports.getheroes = function(req, res, next){
	fs.readFile('./data/heroes.js', function (err, data) {
		if(err) {
		  res.send([]);
		  return;
		}
		res.send(data);
	});
};

exports.matchup = function(req, res, next) {
//retrieving array of enemy heroes and array of team heroes.
	var enemyHeroes = req.body;
	
	if(enemyHeroes == null) {
		var err = new Error('The query parameters "enemyHeroes"  was missing.');
		next(err);
	}
	
	console.log(req.body);
	
	var done = 0;
	var resultingHeroes = [];
	for(var i = 0; i < enemyHeroes.length; i++) {
		var enemyHeroDotabuffName = enemyHeroes[i].dotabuff_name;
		
		//Tell the request that we want to fetch youtube.com, send the results to a callback function
		request({uri: 'http://www.dotabuff.com/heroes/' + enemyHeroDotabuffName + "/matchups"}, function(err, response, body) {
			var self = this;
			 
			//Just a basic error check
			if(err && response.statusCode !== 200){console.log('Request error.');}
			
			$ = cheerio.load(body);
			
			var allHeroes = $('table').first().find('tbody tr'); 
			allHeroes.each(function() {
				var newHero = {
					name: $(this).find('td a.hero-link').text(),
					advantage: parseFloat($(this).find('td').eq(2).text().replace("%", ""))
				};
				
				//push or updateHero
				var heroFound = false;
				
				for(var j = 0; j < resultingHeroes.length; j++) {
					if(resultingHeroes[j].name === newHero.name) {
						resultingHeroes[j].advantage += newHero.advantage;
						heroFound = true;
						break;
					}
				}
				
				if(!heroFound) {
					resultingHeroes.push(newHero);
				}
			});
			
			//Since the request is async and res.write waits for and .end(), we have to determine if all requests are done.
			done++;
			if(done === i) {
				var sortedResult = Enumerable.from(resultingHeroes).orderBy(function(x) { return x.advantage; }).toArray();
				sortedResult.forEach(function(hero) {
					console.log(hero.name + " | " + hero.advantage);
				});
				res.send(sortedResult);
			}
		});
	}
};