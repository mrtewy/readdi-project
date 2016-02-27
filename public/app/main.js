/**
* myApp Module
*
* Description
*/
var app = angular.module('myApp', ['ui.router','ui.bootstrap','myApp.UserService']);

/*
* ============================================================
* Configuration
* ============================================================
*/
app.config(function($stateProvider, $urlRouterProvider) {
  // Set default page
  $urlRouterProvider.when('', '/feed');
  // For any unmatched url, send to 404
  $urlRouterProvider.otherwise('/404');
  // Now set up the states 
  $stateProvider
    .state('/feed', {
      url: "/feed",
      templateUrl: "views/home.feed.html",
      controller: "HomeCtrl",
    })
    .state('/write', {
      url: "/write",
      templateUrl: "views/write.html",
      controller: "WriteCtrl",
      data: {
        title: 'Write'
      }
    })
    .state('/404', {
      url: "/404",
      templateUrl: "views/404.html"
  });

});


app.constant(
  "API", {
    "CLICK": "click",
    "DESTROY": "$destroy",
    "GET_NOTIFICATION": "myNewNotification"
})


/**
* ============================================================
* Controller
* ============================================================
*/
app.controller('HomeCtrl', function ($uibModal, $scope, $http, UserService) {
  $scope.page = 'Home Welcome '+UserService.data.name;
  
  var setAllInactive = function() {
      angular.forEach($scope.workspaces, function(workspace) {
          workspace.active = false;
      });
  };

  var addNewWorkspace = function() {
      var modalInstance = $uibModal.open({
        animation: false,
        templateUrl: 'views/modal/add-workplace.html',
        controller: 'ModalAddWorkplaceCtrl',
        resolve: {}
      });
  };
  
  var root = 'http://jsonplaceholder.typicode.com';

  $http.get(root+'/albums').then(function(response) {
    var workspaces = [];
    angular.forEach(response.data, function(elem) {
      workspaces.push({
        id: elem.id,
        name: elem.title,
        active: true
      });
    });
    $scope.workspaces = workspaces;
  });

  // $scope.workspaces =
  // [
  //     { id: 1, name: "Workspace 1", active:true  }
  // ];

  $scope.addWorkspace = function () {
      setAllInactive();
      addNewWorkspace();
  };  
});

app.controller('ModalAddWorkplaceCtrl', function ($scope, $http) {
  var root = 'http://jsonplaceholder.typicode.com';

  $http.get(root+'/users').then(function(response) {
    $scope.channelList = response.data;
  });

  $scope.ChannelAdder = function() {
    alert('ChannelAdder');
  }
});

app.controller('WriteCtrl', function ($scope) {
  $scope.page = "Write your article here";
});

app.controller('JoinCtrl', function ($scope, $http, $uibModal) {
  $scope.UserLoggedIn = function() {
    return false;
  }
  $scope.join = function() {
    var modalInstance = $uibModal.open({
      animation: false,
      templateUrl: 'views/modal/join.html',
      controller: 'ModalJoinCtrl',
      resolve: {}
    });
  }
});

app.controller('ModalJoinCtrl', ['$scope', function ($scope) {
  $scope.loginFacebook = function() {
    alert('Facebook Login');
  }
}]);



/*
* ============================================================
* Directive
* ============================================================
*/
// Update Title
// @usage: {{ title }}
app.directive('title', ['$rootScope', '$timeout',
  function($rootScope, $timeout) {
    return {
      link: function() {
        var listener = function(event, toState) {
          $timeout(function() {
            $rootScope.title = (toState.data && toState.data.title) 
            ? toState.data.title +' | ': 'Home | ';
          });
        };
        $rootScope.$on('$stateChangeSuccess', listener);
      }
    };
  }
]);


