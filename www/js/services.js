angular.module('interact-images.services', [])

.service('ImagePicker', function($cordovaCamera, $q, $window, Images)
{
    var errorMessage = "ERROR: Image picker not found";
    var self = this;
    var imageHeader = 'data:image/jpeg;base64,';
           
    self.Pick = function(categoryId, callback, error)
    {
        var options = {
            correctOrientation: true,
            allowEdit: false,
            saveToPhotoAlbum: false,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY, //CAMERA,
            encodingType: Camera.EncodingType.JPG
        };
        if(!$cordovaCamera) return callback({});//throw errorMessage;
        $cordovaCamera.getPicture(options).then(function (imageURI)
        {
            return self.imageResize(imageURI, 50).then(function(thumbnailURI)
            {
                callback(new Images.Resource(imageHeader + imageURI, thumbnailURI, categoryId));
            });
        });
    };
    
    self.imageResize = function(imageURI, width)
    {
        var deferred = $q.defer();

        var img = $window.document.createElement('img');
        
        img.onload = function onload() {
            deferred.resolve(self.imageToUri(this, width, img.naturalHeight / img.naturalWidth * width));        
        };
        
        img.src = imageHeader + imageURI;

        return deferred.promise;
    };
    
    self.imageToUri = function(img, width, height) {
        // create an off-screen canvas
        var canvas = document.createElement('canvas'),
            ctx = canvas.getContext('2d');
    
        // set its dimension to target size
        canvas.width = width;
        canvas.height = height;
        
        // draw source image into the off-screen canvas:
        ctx.drawImage(img, 0, 0, width, height);

        // encode image to data-uri with base64 version of compressed image
        return canvas.toDataURL();
    };
    
    /*self.Resource = function(src, thumbnail, categoryId)
    {
        var me = this;
        
        me.src         = src;
        me.thumbnail   = thumbnail;
        me.description = '';
        me.category_id = categoryId;
        
        return me;
    };
    */
    
    return self;    
})

.service('Storage', function(localStorageService)
{   
    var self = this;
    
    self.set = function(key, data)
    {
        localStorageService.set(key, data);
    };
    
    self.get = function(key)
    {
        return localStorageService.get(key);
    };
    
    self.has = function(key)
    {
        var data = self.get(key);
        
        return data !== null && data !== undefined;
    };
    
    return self;
})

.service('Images', function(Storage, lodash)
{
    var self = this;
    
    var defaultData = [];

    var getTable = function()
    {
        if(!Storage.has('images'))
        {
            Storage.set('images', defaultData);
        }
        return  Storage.get('images');
    };

    var setTable = function(data)
    {
        Storage.set('images', data);
    };

    self.find = function(id, callback)
    {
        callback(lodash.find(getTable(), { id: id }));
    };
    
    self.findWhere = function(item, callback)
    {
        callback(lodash.filter(getTable(), item));
    };

    self.store = function(item, callback)
    {
        var image = angular.extend({}, item);
        var table = getTable();
        
        var i = lodash.findIndex(table, { id: image.id });
        
        if(table[i])
        {
            table[i] = image;
        }
        else
        {
            var lastElement = lodash.maxBy(table, 'id');
            var lastId = lastElement ? lastElement.id : 0;
            image.id = lastId + 1;
            table.push(image);
        }
        
        setTable(table);
        callback(image);
    };
    
    self.delete = function(id, callback)
    {
        var table = getTable();
        
        lodash.remove(table, { id: id });
        
        setTable(table);
        
        callback();
    };
    
    self.list = function(callback)
    {
        return callback(getTable());
    };
    
    self.Resource = function(src, thumbnail, categoryId)
    {
        var me = this;
        
        me.src         = src;
        me.thumbnail   = thumbnail;
        me.description = '';
        me.category_id = categoryId;
        
        return me;
    };

    return self;
})

.service('Categorias', function(Storage, lodash)
{
    var self = this;
    
    var defaultData = [{id: 1, description: 'Lugares'}, {id: 2, description: 'Acciones'}];
    
    var getTable = function()
    {
        if(!Storage.has('categories'))
        {
            Storage.set('categories', defaultData);
        }
        return  Storage.get('categories');
    };
    
    var setTable = function(data)
    {
        Storage.set('categories', data);
    };
    
    self.find = function(id, callback)
    {
        callback(lodash.find(getTable(), { id: id }));
    };
    
    self.store = function(item, callback)
    {
        var category = angular.extend({}, item);
        var table = getTable();
        
        var i = lodash.findIndex(table, { id: category.id });
        
        if(table[i])
        {
            table[i] = category;
        }
        else
        {
            var lastElement = lodash.maxBy(table, 'id');
            var lastId = lastElement ? lastElement.id : 0;
            category.id = lastId + 1;
            table.push(category);
        }
        
        setTable(table);
        callback(category);
    };
    
    self.delete = function(id, callback)
    {
        var table = getTable();
        
        lodash.remove(table, { id: id });
        
        setTable(table);
        
        callback();
    };
    
    self.list = function(callback)
    {
        return callback(getTable());
    };
    
    self.Resource = function()
    {
        var me = this;
        
        me.id          = null;
        me.description = "";
        
        return me;
    };
    
    return self;
})

// EventService para agregar capacidad de emitir o recibir eventos a cualquier Servicio o Factory
.factory('EventsService', ['$rootScope', '$log', function($rootScope, $log) {
    var msgBus = {};
    msgBus.emit = function(msg, data) {
        data = data || {};
        msgBus.log(msg, data);
        $rootScope.$emit(msg, data);
    };
    msgBus.on = function(msg, func, scope) {
        var unbind = $rootScope.$on(msg, func);
        if (scope) {
            scope.$on('$destroy', unbind);
        }
    };
    msgBus.log = function(message, data) {
        if ($rootScope.LocaliaConfig && !$rootScope.LocaliaConfig.debug)
            return;
        if (angular.isObject(message))
            message = JSON.stringify(message);
        $log.log("[EventService]: " + message);
    };
    return msgBus;
}]);
