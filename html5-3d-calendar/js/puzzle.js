

var Puzzle=function(){

}

function change(obj, x, y,pic) { //交换函数，判断拖动元素的位置是不是进入到目标原始1/2，这里采用绝对值得方式
		var picWidth = pic[0].offsetWidth;
		var picHeight = pic[0].offsetHeight;
		var picboxWidth = picbox.offsetWidth;
		var picboxHeight = picbox.offsetHeight;
		for(var i = 0; i < pic.length; i++) { //还必须判断是不是当前原素本身。将自己排除在外
			if(Math.abs(pic[i].offsetLeft - x) <= picWidth / 2 && Math.abs(pic[i].offsetTop - y) <= picHeight / 2 && pic[i] != obj)
				return pic[i];
		}
		return obj; //返回当前
	}
function random(a, b,pic) { //随机打乱函数，其中交换部分，可以提取出来封装
		var aEle = pic[a];
		var bEle = pic[b];
		var _left;
		_left = aEle.style.left;
		aEle.style.left = bEle.style.left;
		bEle.style.left = _left;
		var _top;
		_top = aEle.style.top;
		aEle.style.top = bEle.style.top;
		bEle.style.top = _top;
		var _index;
		_index = aEle.getAttribute("data-index");
		aEle.setAttribute("data-index", bEle.getAttribute("data-index"));
		bEle.setAttribute("data-index", _index);
	}

function isSuccess(pic) { //判断成功标准
		var str = ''
		for(var i = 0; i < pic.length; i++) {
			str += pic[i].getAttribute('data-index');
		}
		if(str == '123456789') {
			return true;
		}
		return false;
	}

var dx, dy, newLeft, newtop;
var timer=null;
var startTime, endTime;
Puzzle.prototype.go=function(pic,picbox){
	var _self=this;
	startTime = Date.parse(new Date()); //获取到期1970年1月1日到当前时间的毫秒数，这个方法不常见，这里为试用
		for(var i = 0; i < pic.length; i++) {
			pic[i].style.display = "block"; //设置显示拼图，游戏开始
		}
		picbox.style.background = "#fff";
		for(var i = 0; i < 20; i++) { //随机打乱
			var a = Math.floor(Math.random() * 9);
			var b = Math.floor(Math.random() * 9);
			if(a != b) {				
				random(a, b,pic);
			}
		}
}
Puzzle.prototype.puzzle=function(pic,picbox){
	for(var i = 0; i < pic.length; i++) {
		pic[i].addEventListener('touchstart', function(e) {
			this.style.zIndex = 100; //设置拖拽元素的z-index值，使其在最上面。
			dx = e.targetTouches[0].pageX - this.offsetLeft; //记录触发拖拽的水平状态发生改变时的位置
			dy = e.targetTouches[0].pageY - this.offsetTop; //记录触发拖拽的垂直状态发生改变时的位置
			this.startX = this.offsetLeft; //记录当前初始状态水平发生改变时的位置
			this.startY = this.offsetTop; //offsetTop等取得的值与this.style.left获取的值区别在于前者不带px,后者带px
			this.style.transition = 'none';
		});
		pic[i].addEventListener('touchmove', function(e) {
			var picWidth = pic[0].offsetWidth;
			var picHeight = pic[0].offsetHeight;
			var picboxWidth = picbox.offsetWidth;
			var picboxHeight = picbox.offsetHeight;
			newLeft = e.targetTouches[0].pageX - dx; //记录拖拽的水平状态发生改变时的位置
			newtop = e.targetTouches[0].pageY - dy;
			if(newLeft <= -picWidth / 2) { //限制边界代码块，拖拽区域不能超出边界的一半
				newLeft = -picWidth / 2;
			} else if(newLeft >= (picboxWidth - picWidth / 2)) {
				newLeft = (picboxWidth - picWidth / 2);
			}
			if(newtop <= -picHeight / 2) {
				newtop = -picWidth / 2;
			} else if(newtop >= (picboxHeight - picHeight / 2)) {
				newtop = (picboxHeight - picHeight / 2);
			}
			this.style.left = newLeft + 'px';
			this.style.top = newtop + 'px'; //设置目标元素的left,top
		});
		pic[i].addEventListener('touchend', function(e) {
			this.style.zIndex = 0;
			this.style.transition = 'all 0.5s ease 0s'; //添加css3动画效果
			this.endX = e.changedTouches[0].pageX - dx;
			this.endY = e.changedTouches[0].pageY - dy; //记录滑动结束时的位置，与进入元素对比，判断与谁交换
			var obj = change(e.target, this.endX, this.endY,pic); //调用交换函数
			if(obj == e.target) { //如果交换函数返回的是自己
				obj.style.left = this.startX + 'px';
				obj.style.top = this.startY + 'px';
			} else { //否则
				var _left = obj.style.left;
				obj.style.left = this.startX + 'px';
				this.style.left = _left;
				var _top = obj.style.top;
				obj.style.top = this.startY + 'px';
				this.style.top = _top;
				var _index = obj.getAttribute('data-index');
				obj.setAttribute('data-index', this.getAttribute('data-index'));
				this.setAttribute('data-index', _index); //交换函数部分，可提取
			}
		});
		
		var success=false;
		pic[i].addEventListener('transitionend', function() {
//				calendarDays[5].removeAttribute("data-inactive");
//				calendarDays[5].removeClass("cubeInactive");
//				calendarDays[currentIndex].setAttribute("data-bg-color","#1c2d3f");			
			if(isSuccess(pic)) {
				success=isSuccess(pic);					
			} else {
				// pic[i].removeEventListener('transitionend');
			}	
			
		});
  	}
	document.addEventListener('transitionend', function() {
		if(isSuccess(pic)){
		    console.log(isSuccess(pic));
		    
		    new Day()._layout();
		    $('.content__title').text("第二关");
			$('#picbox').css("backgroundImage","url(http://p0.so.qhimgs1.com/t014ed631a9a65b9b20.png)");
			$('.pic').css("backgroundImage","url(http://p0.so.qhimgs1.com/t014ed631a9a65b9b20.png)");
		    startTime=Date.parse(new Date());
		    var pt=new Puzzle();
		    pt.go(pic,picbox);
		    pt.puzzle(pic,picbox);
//			$('.nextBtn').fadeIn();
//		　　	$('.nextBtn').on('click',function(){
//				alert("恭喜你进入下一关");
//				
//		    });
		}
	});
}

	var times = document.getElementById('times'); //定时。用于扩展
	if(timer){
		clearInterval(timer);			
	}
	timer=setInterval(function() { //定时函数，额。。。待续。
			endTime = Date.parse(new Date());
			times.innerHTML = (endTime - startTime) / 1000 || '';
	}, 1000);
