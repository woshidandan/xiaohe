/*top start*/
	function top_fun(){
		$(".top_con_right p.pinf").stop(true).animate({"top":"23px","opacity":"1"},1500,function(){
			$(".top_con_right p.jiaz").stop(true).animate({"right":"300px","opacity":"1"},1000,function(){
				$(".top_con_right p.bulang").stop(true).animate({opacity:"1"},300,function(){
					$(".top_con_right p.bulang").stop(true).animate({opacity:"0"},100,function(){
						$(".top_con_right p.bulang").stop(true).animate({opacity:"1"},300);
					});
				});
			});
		})
		
	}
	top_fun();
	/*top end*/
	/*nav start*/
	$(".nav_c ul li").click(function(){
		$(this).find("a").addClass("on").parent().siblings("li").find("a").removeClass("on");
	});
	/*nav end*/
	/*banner start*/
	/*banner_left start*/
	var setInter=null;
	var _index=0;
	$(".banner_left_right ul li").mouseover(function(){
			clearInterval(setInter);
			_index=$(this).index();
			$(".banner_left_right .hover").stop(true).animate({top:_index*71+15},500);
			$(".banner_left_left ul li").eq(_index).fadeIn().siblings("li").fadeOut();
	    });
		$(".banner_left_right ul li").mouseout(function(){
		autoplay();
		});
		$(".banner_left_left ul li").hover(function(){
			clearInterval(setInter);
			},function(){
			autoplay();
		});
		$(".banner_left_right .hover").hover(function(){
			clearInterval(setInter);
			},function(){
			autoplay();
		});
	function autoplay(){
		setInter=setInterval(function(){
		_index++;
		if (_index>3)
		{	
			_index=0;
			$(".banner_left_right .hover").stop(true).animate({top:_index*71+15},500);
			$(".banner_left_left ul li").eq(_index).fadeIn().siblings("li").fadeOut();
		}else{
			$(".banner_left_right .hover").stop(true).animate({top:_index*71+15},500);
			$(".banner_left_left ul li").eq(_index).fadeIn().siblings("li").fadeOut();
		}
		},2000);
	}
	autoplay();
	/*banner_left end*/
	/*banner end*/
	/*three_news start*/
	$(".three_news p span").mouseover(function(){
		var _Index=$(this).index();
		$(this).addClass("mous_on").siblings("span").removeClass("mous_on");
		$(".three_news ul").eq(_Index).fadeIn().siblings("ul").fadeOut();
	});
	//添加序列号
	function addindex(){
		var len=$(".three_news ul").length;
		var len1=$(".three_news ul li").length/3;
		for (var i=0;i<len ;i++ )
		{
			for (var a=0;a<len1 ;a++ )
			{
				$(".three_news ul").eq(i).find("li").eq(a).find("i").text(a+1);
			}
		}
	}
	addindex();
	/*three_news end*/
	/*bottom index start*/
	$(".Index ul li").click(function(){
		$(this).find("a").addClass("Index_on").parent().siblings("li").find("a").removeClass("Index_on");
	});
	/*bottom index end*/
	/*return top start*/
		$(window).scroll(function(){
			var scroll_top=$(document).scrollTop();
		if (scroll_top>=100)
		{
			$(".return_top").fadeIn();
		}else
		{
			$(".return_top").fadeOut();
		}
		});
		$(".return_top").click(function(){
			$("html,body").stop(true).animate({scrollTop:"0"},500);
		});
		

	/*return top end*/
