require.config({
    //By default load any module IDs from js/lib
    baseUrl: 'js/service',
    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    urlArgs: 'ver=0.1.2',
    paths: {
        config: './_config',
        jquery: '../libs/jquery/2.1.4/jquery',
        D: '../tools/dialog.d/dialog.d',
        underscore: '../libs/underscore/1.8.3/underscore',
        Backbone: '../libs/backbone/1.2.3/backbone',
        iscroll: '../tools/iscroll/4.2.5/iscroll',
        echarts: '../libs/echarts'
            //datepicker:'../tools/datePicker/datePicker',
    },
    shim: {
        '../tools/datepicker/datePicker': {　　　　　　　　
            deps: ['jquery', 'iscroll'],
            exports: 'datepicker'　　　　　　
        },
        '../tools/jquery.slidebar': {　　　　　　　　
            deps: ['jquery'],
            exports: 'slidebar'　　　　　　
        },
        '../tools/rsa/jsencrypt': {　　　　　　　　
            deps: [],
            exports: 'jsencrypt'　　　　　　
        },
        '../libs/bootstrap/bootstrap': {
            deps:['jquery'],
             exports: 'bootstrap'　
        }
    },
    waitSeconds: 30
});
