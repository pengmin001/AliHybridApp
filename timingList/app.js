require(['./main.js'], function (WB) {
    //导航栏配置
    DA.nativeCmp.topbar.setNavbar({
        title:'定时预约',
        type:'solid',//导航条样式 mixed: 透明背景滑动过渡到非透明效果 solid: 白色背景无过度效果
        rightButton:[{//导航条右边按钮配置
            iconfont:'', //iconfont代码
            name:'iconCode',
            handler:function(){}
        }]
    });
    //重复页面回调
    DA.onWebViewData(function(info){
        //if(info.state="reload"){
        //    //location.reload();
        //}
        console.log("getDat:"+info);
        if (info.formUrl){

        }
    });
    WB.init(); 
});