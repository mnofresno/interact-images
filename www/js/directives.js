angular.module('interact-images.directives', [])
.directive('backImgData', function(){
    return function(scope, element, attrs){
        var data = attrs.backImgData;
        element.css({
            'background-image': data,
            'background-size' : 'cover'
        });
    };
})
.directive('backImg', function(){
    return function(scope, element, attrs){
        var url = attrs.backImg;
        element.css({
            'background-image': 'url(' + url +')',
            'background-size' : 'cover'
        });
    };
});