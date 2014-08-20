function MatchupCtrl($scope, $http) {
	$scope.allHeroes = [];
	$scope.chosenHeroesEnemy = [];
	$scope.chosenHeroesFriendly = [];
	$scope.enemyMatchupResult = [];
	$scope.friendlyMatchupResult = [];
	$scope.maximumAmountOfHeroes = 5;
	
	$http({method: 'GET', url: '/api/getheroes'})
		.success(function(data, status, headers, config) {
			$scope.allHeroes = Enumerable.from(data.heroes).orderBy(function(x) { return x.name }).toArray();
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
		
		$http({method: "POST", url: 'api/matchup', data: $scope.chosenHeroesEnemy })
			.success(function(data, status, headers, config) {
				$scope.enemyMatchupResult = data;
			})
			.error(function(data, status, headers, config) {
				//TODO: errorhandling
			});
			
		$http({method: "POST", url: 'api/matchup', data: $scope.chosenHeroesFriendly })
			.success(function(data, status, headers, config) {
				$scope.friendlyMatchupResult = data;
			})
			.error(function(data, status, headers, config) {
				//TODO: errorhandling
			});
	};
}