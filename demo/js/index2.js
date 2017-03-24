// JavaScript Document
$(function(){
	//初始化当前索引
	var key = 0;
	//记录上一屏，这一屏滚动将要消失
	var prev = 0;
	out();
	//滑轮滚动事件
	$(document).mousewheel(function(event,delta){
		//如果没有处于执行动画状态，方可执行
		if(!$('.wrapBox').is(':animated')){
			
		//两个参数  delta  返回当前往上滚动（1）   往下滚动（-1）
		
		/*
		0   -1    1
		1   -1    2
		2   -1    3
		*/
		key = key - delta;
		//console.log(key);
		if(key < 0){
			key = 0;
		}else if(key > 5){
			key = 5;
		}
		$('.wrapBox').stop(true).animate({top:-key*100 + '%'},1000);	
		$('.nav li').eq(key).addClass('current').siblings().removeClass('current');	

		}
		
		out();
		prev = key;
	});
	//bind绑定事件
	/* 绑定一个事件
	$('.nav li').bind('mouseenter',function(){
		alert('1111');
	}); 
	
	$('.nav li').bind({
		mouseenter:function(){
			console.log('经过');
		},
		mouseleave:function(){
			console.log('离开了');
		},
		click:function(){
			console.log('点击');
		}
	});
	*/
	var arr = ['首页','营销手段','服务优势','特色功能','技术特点','申请加入']
	$('.nav li').bind({
		mouseenter:function(){
			$(this).append('<span>'+arr[$(this).index()]+'</span>');
		},
		mouseleave:function(){
			$(this).find('span').remove();
		},
		click:function(){
			//获取当前索引
			key = $(this).index();
			$('.wrapBox').stop(true).animate({top:-key*100 + '%'},1000);
			$(this).addClass('current').siblings().removeClass('current');
			
			out();
			prev = key;
		}
	});
	
	//通过按钮点击第一屏动画显示
	$('button:first').click(function(){
		$('.box').removeClass('comeout');
	});
	/*$('button:eq(1)').click(function(){
		$('.box').addClass('comeout');
	});*/
	function out(){
		$('.box').eq(prev).addClass('comeout');
		$('.box').eq(key).removeClass('comeout');
	}
	
});