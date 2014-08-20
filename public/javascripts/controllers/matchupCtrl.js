function MatchupCtrl($scope, $http) {
	$scope.allHeroes = [];
	$scope.chosenHeroes = [];
	$scope.matchupResult = [];
	
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
			if(currentHero.id === $scope.chosenHeroes[0].id ||
			($scope.chosenHeroes[1] && currentHero.id === $scope.chosenHeroes[1].id) ||
			($scope.chosenHeroes[2] && currentHero.id === $scope.chosenHeroes[2].id) ||
			($scope.chosenHeroes[3] && currentHero.id === $scope.chosenHeroes[3].id) ||
			($scope.chosenHeroes[4] && currentHero.id === $scope.chosenHeroes[4].id)) {
				$scope.allHeroes[i].isInUse = true;
			}
			else {
				$scope.allHeroes[i].isInUse = false;
			}
		}
		
		$http({method: "POST", url: 'api/matchup', data: $scope.chosenHeroes })
			.success(function(data, status, headers, config) {
				$scope.matchupHeroes = data;
			})
			.error(function(data, status, headers, config) {
				//TODO: errorhandling
			});
	};
}