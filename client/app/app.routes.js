// ROUTES FILE
(function(){
	'use strict'

	 angular
		.module('appModule')
		.config(['$stateProvide', '$urlRouterProvider', function($stateProvide,$urlRouterProvider){
		.state('login', {
      url: "/",
      templateUrl: 'app/components/singnupView.html'
      controller: 'signupController'

    })	
		})

    


})();