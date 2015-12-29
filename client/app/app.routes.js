// ROUTES FILE
(function(){
	'use strict'

	 angular
		.module('appModule')
		.config(['$stateProvider', '$urlRouterProvider', function($stateProvider,$urlRouterProvider){

		$urlRouterProvider.otherwise('/');

		$stateProvider
			.state('login', {
				url: '/login',
			    templateUrl: 'app/components/signup/signupView.html',
			    controller: 'signupController'
			})
		}])
})();