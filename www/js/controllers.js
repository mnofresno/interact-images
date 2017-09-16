angular.module('interact-images.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, EventsService, Categorias, Images) {

      // With the new view caching in Ionic, Controllers are only called
      // when they are recreated or on app start, instead of every page change.
      // To listen for when this page is active (for example, to refresh data),
      // listen for the $ionicView.enter event:
      //$scope.$on('$ionicView.enter', function(e) {
      //});

      // Form data for the login modal
      $scope.loginData = {};

      // Create the login modal that we will use later
      $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
      }).then(function(modal) {
        $scope.modal = modal;
      });

      // Triggered in the login modal to close it
      $scope.closeLogin = function() {
        $scope.modal.hide();
      };

      // Open the login modal
      $scope.login = function() {
        $scope.modal.show();
      };

      // Perform the login action when the user submits the login form
      $scope.doLogin = function() {
        console.log('Doing login', $scope.loginData);

        // Simulate a login delay. Remove this and replace with your login
        // code if using a login system
        $timeout(function() {
          $scope.closeLogin();
        }, 1000);
      };
  
    $scope.categorias = [];

    var loadCategories = function()
    {
        Categorias.list(function(d)
        {
            $scope.categorias = d;
            if (angular.isArray(d))
            {
                for (var i in d)
                {
                    Images.findWhere({category_id: d[i].id}, function (pictures){
                        $scope.categorias[i].image_counter = pictures.length;
                    });
                }
            }               
        });
    };
    EventsService.on("Images.save", function (data){
        loadCategories();    
    });
    loadCategories();
})

.controller('AddPicturesCtrl', function($scope, $stateParams, ImagePicker, lodash, $ionicPopup, EventsService, Storage, Categorias)
{
    var self = this;
    
    self.images = [];
    self.categories = [];
    
    self.init = function()
    {
        if(Storage.has('images'))
        {
            self.images = Storage.get('images');
        }
        else
        {
            Storage.set('images', self.images);
        }
        
        Categorias.list(function(d)
        {
            self.categories = d;
        });
    };
    
    self.getImages = function(categoryId)
    {
        ImagePicker.Pick(categoryId, function(d)
        {
            d.selected = false;
            Categorias.find(categoryId, function(c)
            {
                d.category_description = c.description;
                self.images.push(d);
                self.save();
            });
        });
    };
    
    self.remove = function(i)
    {
        self.images.splice(i, 1);
        self.save();
    };
    
    self.show = function(i)
    {
        var image = self.images[i];
        $ionicPopup.show({
            template: '<img width="100%" height="100%" src="' + image.src + '">',
            title: '',
            subTitle: '',
            buttons: [
              {
                text: '<b>Cerrar</b>',
                type: 'button-positive',
                onTap: function(e) {}
              }
            ]
        });
    };
    
    self.save = function()
    {
        Storage.set('images', self.images);
        EventsService.emit("Images.save", self.images);
    };
    
    self.editDescription = function(i)
    {
        $scope.vm = { currentDescription: '' };
        $ionicPopup.show({
            template: '<input type="text" ng-model="vm.currentDescription" autofocus/>',
            title: 'Descripción',
            subTitle: '¿Qué es ésta imagen?',
            scope: $scope,
            buttons: [
                {
                    text: '<b>Aceptar</b>',
                    type: 'button-positive',
                    onTap: function(e)
                    {
                        self.images[i].description = $scope.vm.currentDescription;
                        self.save();
                    }
                },
                {
                    text: '<b>Cerrar</b>',
                    type: 'button-positive'
                }
            ]
        });
    };
    
    self.init();
    
    return self;
})

.controller('CategoriesCtrl', function(Categorias)
{
    var self = this;
    
    self.items = []
    self.editingItem = null;
    
    self.update = function()
    {
        Categorias.list(function(d)
        {
            self.items = d;
        });
    };
    
    self.update();
    
    self.create = function()
    {
        self.editingItem = new Categorias.Resource();
    };
    
    self.edit = function(item)
    {
        Categorias.find(item.id, function(d)
        {
            self.editingItem = d;
        });
    };
    
    self.delete = function(item)
    {
        Categorias.delete(item.id, function()
        {
            self.editingItem = null;
            self.update();
        });
    };
    
    self.save = function()
    {
        Categorias.store(self.editingItem, function()
        {
            self.update();
            self.cancel();
        });
    };
    
    self.cancel = function()
    {
        self.editingItem = null;
    };
   
    self.isEditing = function()
    {
        return self.editingItem !== null;
    };
    
    return self;
})

.controller('PicturesCtrl', function($stateParams, $scope, Categorias, Images, $ionicPopup)
{
    var self = this;

    $scope.show = function(i)
    {
        var image = $scope.images[i];
        $ionicPopup.show({
            template: '<img width="100%" height="100%" src="' + image.src + '">',
            title: '',
            subTitle: '',
            buttons: [
              {
                text: '<b>Cerrar</b>',
                type: 'button-positive',
                onTap: function(e) {}
              }
            ]
        });
    };

    self.init = function()
    {
        if (angular.isDefined($stateParams.categoryId)) 
        {        
            $stateParams.categoryId = Number($stateParams.categoryId);
            Categorias.find($stateParams.categoryId, function (category){
                if (angular.isDefined(category))
                    $scope.category = category;
            });
            Images.findWhere({category_id: $stateParams.categoryId}, function (pictures){
                if (angular.isDefined(pictures))
                    $scope.images = pictures;
            });
        }
    };
    
    self.init();

    return self;
});
