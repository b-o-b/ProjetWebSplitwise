angular.module('appModule').
    factory('SignupService', function($resource) {
       return $resource('/api/:id', {}, {
            
            query: { method: 'POST',params :{id  : 'authenticate'}},
            save : { method: 'POST',params :{id  : 'user'}},
            forget: { method: 'POST',params :{id  : 'forget'}}
        })
    });