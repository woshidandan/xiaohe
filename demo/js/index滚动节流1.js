// JavaScript Document
$(function(){
	//初始化当前索引
	var key = 0;
	var flag = 1;
	//滑轮滚动事件
	$(document).mousewheel(function(event,delta){
		if(flag == 1){
			flag = 0;
			
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
		$('.wrapBox').stop(true).animate({top:-key*100 + '%'},500,function(){
			flag = 1;
		});	
			
		}
	});
});