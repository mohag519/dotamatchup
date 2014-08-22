function MatchupCtrl($scope, $http) {
	$scope.allHeroes = [];
	$scope.chosenHeroesEnemy = [];
	$scope.chosenHeroesFriendly = [];
	$scope.enemyMatchupResult = [];
	$scope.friendlyMatchupResult = [];
	$scope.maximumAmountOfHeroes = 5;
	
	$http({method: 'GET', url: '/api/getheroes'})
		.success(function(data, status, headers, config) {
			$scope.allHeroes = data.heroes;
		})
		.error(function(data, status, headers, config) {
		});
	
	$scope.change = function() {
		//disabling chosen options
		for(var i = 0; i < $scope.allHeroes.length; i++) {
			var currentHero = $scope.allHeroes[i];
			
			$scope.allHeroes[i].isInUse = false;
			
			for(var j = 0; j < $scope.maximumAmountOfHeroes; j++)
			{
				if( ($scope.chosenHeroesEnemy[j] && currentHero.id === $scope.chosenHeroesEnemy[j].id) ||
					($scope.chosenHeroesFriendly[j] && currentHero.id === $scope.chosenHeroesFriendly[j].id)) {
					$scope.allHeroes[i].isInUse = true;
				}
			}
		}
		
		$scope.enemyMatchupResult = [];
		$scope.friendlyMatchupResult = [];
		
		$http({method: "POST", url: 'api/matchup', data: $scope.chosenHeroesEnemy })
			.success(function(data, status, headers, config) {
				$scope.enemyMatchupResult = data;
				if($scope.activateTeammates)
				{
					$http({method: "POST", url: 'api/teammates', data: $scope.chosenHeroesFriendly })
						.success(function(data, status, headers, config) {
							addAdvantages(data, true);
							
						})
						.error(function(data, status, headers, config) {
							//TODO: errorhandling
						});
				}
			})
			.error(function(data, status, headers, config) {
				//TODO: errorhandling
			});
			
		$http({method: "POST", url: 'api/matchup', data: $scope.chosenHeroesFriendly })
			.success(function(data, status, headers, config) {
				$scope.friendlyMatchupResult = data;
				if($scope.activateTeammates) {
					$http({method: "POST", url: 'api/teammates', data: $scope.chosenHeroesEnemy })
						.success(function(data, status, headers, config) {
							addAdvantages(data, false);			
						})
						.error(function(data, status, headers, config) {
							//TODO: errorhandling
						});
				}
			})
			.error(function(data, status, headers, config) {
				//TODO: errorhandling
			});
			
		
	};
	
	function addAdvantages(listOfHeroes, enemyResults) {
		if(listOfHeroes === null || enemyResults === null) { 
			console.log("Could not add advantages to table because listOfHeroes was empty or null");
			return; 
		}
		
		for(var i = 0; i < listOfHeroes.length; i++) {
		
			console.log("Trying to add hero-advantage: " + listOfHeroes[i].name);
			
			if(enemyResults) {
				for(var j = 0; j < $scope.enemyMatchupResult.length; j++) {
					if($scope.enemyMatchupResult[j].name === listOfHeroes[i].name) {
						$scope.enemyMatchupResult[j].advantage -= listOfHeroes[i].advantage;
						console.log("Found hero, adding advantage");
						break;
					}
				}
			}
			else {
				for(var j = 0; j < $scope.friendlyMatchupResult.length; j++) {
					if($scope.friendlyMatchupResult[j].name === listOfHeroes[i].name) {
						$scope.friendlyMatchupResult[j].advantage -= listOfHeroes[i].advantage;
						heroFound = true;
						console.log("Found hero, adding advantage");
						break;
					}
				}
			}
		}
	}
	
}