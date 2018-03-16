'use strict';

/**
 * @ngdoc function
 * @name ensemblProdinfserviceApp.controller:HCResultCtrl
 * @description # HCResultCtrl Controller of the ensemblProdinfserviceApp
 */


angular.module('ProdSrvApp')
    .controller('HCResultCtrl', function ($scope, $http, $routeParams, CONFIG, $location, editjob) {
	$scope.running = false;
	var jobidregex=new RegExp('^(\\d+){1}$');
	$scope.getResult = function() {
		$scope.jobResult = null;
	    if($scope.jobId !== null && $scope.jobId !== undefined && jobidregex.test($scope.jobId)) {
			var url = CONFIG.HC_SRV_URL+'jobs/'+$scope.jobId;
			$scope.running = true;
			$http.get(url)
				.then(function(response) {
				$scope.jobResult = response.data;
				$scope.running = false;
				if (response.data.status === 'failed') {
					$scope.getFailure();
				}
				}).catch(function (data) {	
				console.log(data);
				window.alert('Could not get result for job');
				});
	    }
	};

	$scope.getFailure = function() {
		console.log($scope.jobResult.status);
	    if($scope.jobId !== null && $scope.jobId !== undefined && jobidregex.test($scope.jobId)) {
			var url = CONFIG.HC_SRV_URL+'jobs/'+$scope.jobId+'?failure=1';
			$scope.running = true;
			$http.get(url)
				.then(function(response) {
				$scope.jobMsgs = response.data;
				$scope.running = false;
				}).catch(function (data) {
				console.log(data);
			window.alert('Could not get job failure message');
				});
		}
	};
	
	$scope.deleteJob = function() {
	    if($scope.jobId !== null && $scope.jobId !== undefined && jobidregex.test($scope.jobId)) {
			var url = CONFIG.HC_SRV_URL+'jobs/'+$scope.jobId;
			$scope.running = true;
			$http.delete(url)
			.then(function() {
				$scope.jobResult = null;	  
				$scope.jobId = null;
				$scope.running = false;
			}).catch(function (data) {	
			console.log(data);
			window.alert('Could not delete job');
			});
	    }
	};

	$scope.refresh = function() {
	  $scope.getResult();
	};


	$scope.EditReSubmitJob = function() {
		editjob.set($scope.jobResult.input);
	    $location.url('/hc_submit');
	};


	if($routeParams.jobIdParam !== null && $routeParams.jobIdParam !== undefined) {
	    console.log($routeParams.jobIdParam);
	    $scope.jobId = $routeParams.jobIdParam;
	    $scope.getResult();
	}
    }
	       );
