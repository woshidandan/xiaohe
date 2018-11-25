window.onload=function(){
	$(".time_tit ul li").stop(true).animate({opacity:"0"},200,function(){
		$(".time_tit ul li").stop(true).animate({opacity:"1"},200,function(){
			$(".time_tit ul li").stop(true).animate({opacity:"0"},200,function(){
				$(".time_tit ul li").stop(true).animate({opacity:"1"},200)
			})
		})
	});
autoPlay();
}

function autoPlay(){
	var i=-1;
	setInterval(function(){
		
		i++;
	if (i>=4)
	{
		i=0;
		$(".time_tit ul li").eq(i).animate({opacity:"1"},500).siblings("li").stop(true).animate({opacity:"0"},500);
		
	}else{
		
		$(".time_tit ul li").eq(i).animate({opacity:"1"},500).siblings("li").stop(true).animate({opacity:"0"},500);
		
	}
	},1500)
}
/*music start*/
$(".ok").click(function(){
	var addHtml="<iframe name='iframe_canvas' src='http://douban.fm/partner/baidu/doubanradio' scrolling='no' frameborder='0' width='430' height='200'>"+"</iframe>"
	$(this).fadeOut();
	$(".music").animate({right:"5px",opacity:"1"},500);
	$(".music .douban").html(addHtml);

});
$(".music .no").click(function(){
	$(".music").animate({right:"-420px",opacity:"0"},500);
	$(".music .douban").html("");
	$(".come_on").hide();
	$(".ok").fadeIn();
});
$(".ok").hover(function(){
	$(this).addClass("music_on")
},function(){
	$(this).removeClass("music_on")		
});
$(".music .none").click(function(){
	$(".music").animate({right:"-420px",opacity:"0"},500);
	$(".come_on").fadeIn();
});
$(".come_on").click(function(){
	$(this).fadeOut();
	$(".music").animate({right:"5px",opacity:"1"},500);
});
/*music end*/
/*jilu start*/

$(".time_con_top ul li").click(function(){
	$(this).addClass("num_on").siblings("li").removeClass("num_on");
});
/*jilu end*/
