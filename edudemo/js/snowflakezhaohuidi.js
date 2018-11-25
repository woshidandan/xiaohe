   window.onload = function () {
                    var minSize = 5; //最小字体
                    var maxSize = 50;//最大字体
                    var newOne = 100; //生成雪花间隔
                    var flakColor = "#fff"; //雪花颜色
                    var flak = $("<div class='xh'></div>").css({position:"absolute","top":"0px"}).html("❉");//定义一个雪花
                    var dhight = $(window).height(); //定义视图高度
                    var dw =$(window).width(); //定义视图宽度
                    setInterval(function(){
                    var sizeflak = minSize+Math.random()*maxSize; //产生大小不等的雪花
                    var startLeft = Math.random()*dw; //雪花生成是随机的left值
                    var startopcity = 0.7+Math.random()*0.3; //随机透明度
                    var endpositionTop= dhight-100; //雪花停止top的位置
                    var endLeft= Math.random()*dw; //雪花停止的left位置
                    var durationfull = 5000+Math.random()*5000; //雪花飘落速度不同
                    flak.clone().appendTo($("body")).css({
                    "left":startLeft ,
                    "opacity":startopcity,
                    "font-size":sizeflak,
                    "color":flakColor
                    }).animate({
                    "top":endpositionTop,
                    "left":endLeft,
                    "apacity":0.1
                    },durationfull,function(){
                    $(this).remove()
                    });
                    },newOne);
                } 