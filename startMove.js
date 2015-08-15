/*
 * 我的运动框架V1.0
 * (c) Copyright 2015 瞿龙俊. All Rights Reserved.
 */
function startMove(obj, json, interval, fn) {
	//将需要运动的多个属性保存成JSON格式，方便在startMove中调用，key-Value键值对，不同的key，不用数组
	clearInterval(obj.iTimer); //使用obj.iTimer，用来控制N个不同元素的运动互不影响，否则会将前一个元素的定时器清空Bug
	var iCur = 0;
	var iSpeed = 0; //速度变量
	obj.iTimer = setInterval(function() {
		var iBtn = true; //定义变量用来判断是否所有元素都已经到达指定位置了，若为true，则表示所有元素到了指定位置，false则为有元素未到达
		//定时器每运行一次，就要把运动的属性都推进一步
		for (var attr in json) {
			//停止计时器时间：所有属性都运动到了目标的时候。
			iTarget = json[attr];
			if (attr == 'opacity') {
				iCur = Math.round(css(obj, 'opacity') * 100); //四舍五入，在某些浏览器中（目前实测Opera）中，Opacity得到的值是一个很长的数，例如：0.29999999998,0.3000000001
			} else {
				iCur = parseInt(css(obj, attr));
			}
			//速度 = (目标点值-当前值)*摩擦系数：BUG：JS计算CSS样式小数时会四舍五入导致运动差几PX，解决方法：若速度为正数，则向上取整，否则向下取整。
			iSpeed = (iTarget - iCur) / 8;
			iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed); //速度取整
			if (iCur != iTarget) { //如果元素未达到指定位置
				iBtn = false; //将标识设置为false
				if (attr == 'opacity') {
					//非IE浏览器
					obj.style.opacity = (iCur + iSpeed) / 100;
					obj.style.filter = 'alpha(opacity=' + (iCur + iSpeesd) + ')' //IE浏览器兼容
				} else {
					obj.style[attr] = iCur + iSpeed + 'px';
				}
			}
		}
		//在这里来判断是否所有属性都已经运行完毕，iBtn为false则表示有元素未达到，true表示都到达了。
		//true的条件：当定时器运行了一次，并扫描了所有attr，发现没有需要移动的属性。
		if (iBtn) {
			clearInterval(obj.iTimer); //关闭定时器
			fn && fn.call(obj); //若此处未使用call，则this会指向window，call的作用是让this指针指向obj
		}
	}, interval);
}

function css(obj, attr) { //获取元素CSS样式
	if (obj.currentStyle) {
		return obj.currentStyle[attr]; //若浏览器支持CurrentStyle，则使用它获取，最精确，IE
	} else {
		return getComputedStyle(obj, false)[attr]; //若不支持，则使用getComputedStyle获取，FF,Chrome等
	}
}