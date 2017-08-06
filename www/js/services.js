angular.module('interact-images.services', [])

.service('ImagePicker', function($cordovaCamera, $q, $window)
{
    var errorMessage = "ERROR: Image picker not found";
    var self = this;
           
    self.Pick = function(callback, error)
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
                callback({ src: imageURI, thumbnail: thumbnailURI });
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
        
        img.src = 'data:image/jpeg;base64,' + imageURI;

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
    
    return self;    
});
