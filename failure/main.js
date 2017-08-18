define([], function() {
    //设备功能
    var failureFunc = {
        //初始化
        init : function(){
            //获取错误参数
            failureFunc.getErrorParameter();
        },
        //获取错误参数
        getErrorParameter : function(){
        	var urlParam = DA.urlParam();
        	//展示错误信息
        	failureFunc.showErrorInfo(urlParam);	
        },
        //展示错误信息
        showErrorInfo : function(urlParam){
        	console.log(urlParam);
        	$(".Device-failure-info").find("b").text(urlParam.text);
        	$(".Device-failure-info").find("span").text(urlParam.code);
        }
    };
    return failureFunc;
}); 