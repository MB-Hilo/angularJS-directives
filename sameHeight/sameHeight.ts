'use strict';

angular.module('pwobapp')
    .directive('sameheight', function() {
        let sameheight = {};
        let timeout;

        $(window).resize(updateAllHeightsWhenReady);

        return {
            restrict: 'A',
            link: function () {
                updateAllHeightsWhenReady();
            }
        };

        function updateAllHeightsWhenReady() {
            clearTimeout(timeout);
            timeout = setTimeout(updateAllHeights, 50);
        }

        function updateAllHeights() {
            sameheight = {};
            removeElementHeights();
            scanElementHeights();
            setElementHeights();
        }

        function scanElementHeights() {
            $('[sameheight]').each(function() {
                let name = $(this).attr('sameheight');
                let height = $(this).height();

                if (isNotTheMain(this) && isFirstOrBiggest(name, height) === false) {
                    return;
                }

                initializeObjectIfNeeded(name);

                setObjectMain(this, name);
                setObjectHeight(height, name);
                setObjectMinResolution(this, name);
            });
        }

        function initializeObjectIfNeeded(name) {
            if (sameheight[name] === undefined) {
                sameheight[name] = {};
            }
        }

        function setObjectMain(element, name) {
            sameheight[name].main = isTheMain(element);
        }

        function setObjectHeight(height, name) {
            sameheight[name].height = height;
        }

        function setObjectMinResolution(element, name) {
            let resolution = $(element).data('sameheight-resolution');
            if (resolution === undefined) {
                return;
            }

            if (mayUpdateResolution(resolution, name)) {
                sameheight[name].resolution = resolution;
            }
        }

        function mayUpdateResolution(resolution, name) {
            return hasNoSettedResolution(name) || settedResolutionIsBiggestThanThisResolutionFor(resolution, name);
        }

        function settedResolutionIsBiggestThanThisResolutionFor(resolution, name) {
            let setted_resolution = sameheight[name].resolution;
            return parseResolutionToWidth(setted_resolution) > parseResolutionToWidth(resolution);
        }

        function parseResolutionToWidth(resolution) {
            let resolution_list = ['xs', 'sm', 'md', 'lg'];
            let width_list = [0, 768, 992, 1200];

            let resolution_index = resolution_list.indexOf(resolution);
            return width_list[resolution_index];
        }

        function hasNoSettedResolution(name) {
            return sameheight[name].resolution === undefined;
        }

        function removeElementHeights() {
            $('[sameheight]').css('height', 'auto');
        }

        function setElementHeights() {
            angular.forEach(sameheight, function(value, name) {
                if (mayUpdateResolutionForThisResolution(name)) {
                    $('[sameheight=' + name + ']').height(sameheight[name].height);
                    console.log(sameheight[name].height);
                }
            });
        }

        function mayUpdateResolutionForThisResolution(name) {
            let setted_resolution = sameheight[name].resolution;
            if (setted_resolution === undefined) {
                return true;
            }

            return thisResolutionBiggestThan(setted_resolution);
        }

        function thisResolutionBiggestThan(setted_resolution) {
            let setted_width = parseResolutionToWidth(setted_resolution);
            return window.matchMedia("(min-width: " + setted_width + "px)").matches;
        }

        function isFirstOrBiggest(name, height) {
            if (sameheight[name] === undefined) {
                return true;
            }
            return sameheight[name].main === false && sameheight[name].height <= height;
        }

        function isTheMain(element) {
            return $(element).is('[data-sameheight-main]');
        }

        function isNotTheMain(element) {
            return isTheMain(element) === false;
        }
    });
