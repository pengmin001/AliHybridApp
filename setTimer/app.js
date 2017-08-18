require(['./main.js'], function (WB) {
    //获取传进来的数据
    var data = DA.urlParam();
    //开关列表
    var RadioList = new DA.AlinkUI.RadioItemList('RadioItemList',{
        domhook : $('.switch-select'),
        datamodel: {
            key: 'nine',
            value: "0", 
            unCheckedValue:'0',
            map: [{
                    title: '定时开', 
                    checkedValue:'0',
                    after : data.startTime||"00:00"
                  },
                  {
                     title: "定时关", 
                     checkedValue:'1',
                     after : data.endTime||"00:00"
                  }],
        },
        type:'leftCheck',
        clickTocancel:true,
        separate:true, 
        onClickItemInner:function(item,index){
            var $li = $(".setTiming-switch-select .ui-item-list>ul>li").eq(index);
            //当separate为true，点击ui-item-inner才会触发这个onClickItemInner
            if(!$li.hasClass("active")){//关闭时间选择
                $li.addClass("active").siblings().removeClass("active");
                //创建时间
                WB.createTime($li.find(".ui-aftertxt").text().split(":"));
            }else{//开启时间选择
                $(".setTiming-time-select").html("").hide();
                $li.removeClass("active");
            }
        }
    });
    $(".setTiming-switch-select .icon-change-box").show();
    //重复操作
    WB.showRepeatInfo(data);
    //重复页面回调
    DA.onWebViewData(function(info){
        data.dayInfo = info.dayInfo;
        //获取重复天数
        data.subtitle = WB.getDayInfo(info.dayInfo);
        //重复操作
        WB.showRepeatInfo(data);
    });
    WB.init(data); 
    console.log("n32");
    window.WindVane.call('AlinkHybrid', 'registerBackButtonEvent', {
               handle:'true'
    },function(e) {}, function(e) {}); 
    DA.removeBackEventListener();
    document.addEventListener('back', function() {
        //关闭时间组件
        window.WindVane.call('AlinkDateTimePicker',
            'hide',
            {},
            function(e) {
            alert('success: ' + JSON.stringify(e));
            },
            function(e) {
            alert('failure: ' + JSON.stringify(e));
        });
        DA.back();
    });

});