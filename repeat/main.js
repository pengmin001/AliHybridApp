define([], function() {
    
    var param = DA.query;
    //设备功能
    var repeatFunc = {
        //初始化
        init : function(data){
            //渲染数据
            repeatFunc.renderData(data);
            //事件
            repeatFunc.bindEvent(data);
            
        },
        //渲染数据
        renderData : function(data){
            repeatFunc.getRepeatList(data.dayInfo);
        },
        //获取列表数据
        getRepeatList : function(dayInfo){
            var info = [];
            if(dayInfo=="*"){
                dayInfo = "1,2,3,4,5,6,7";
            }
            //循环7天列表
            for(var i=1;i<8;i++){
                info.push({
                    checkedFlag : dayInfo.indexOf(i)>-1?true:false,
                    title : repeatFunc.getDay(i),
                    key : i,
                    uncheckedValue : 0,
                    checkedValue : i
                });
                console.log(dayInfo.indexOf(i));
                //设置列表
                if(i==7){
                    console.log(info);
                    repeatFunc.setRepeatList(info);
                }
            }
        },
        //获取天
        getDay : function(num){
            switch(num){
                case 1 :
                    return "每周一";
                case 2 :
                    return "每周二";
                case 3 :
                    return "每周三";
                case 4 :
                    return "每周四";
                case 5 :
                    return "每周五";
                case 6 :
                    return "每周六";
                case 7 :
                    return "每周日";
            }
        },
        //设置列表
        setRepeatList : function(info){
            console.log(info,1);
            var checkList = new DA.AlinkUI.CheckItemList('checkitemList',{
                domhook : $('.repeatList'),
                datamodel: {
                    map: info
                },
                type:'leftCheck'
            });
        },
        //事件
        bindEvent : function(data){
            //返回上一页
            $("body").on("click",".back",function(){
                DA.back();
            });
            //点击完成 然后返回上一页
            $("body").on("click",".repeatList-define",function(){
                //获取重复信息
                var dayInfo = repeatFunc.getREpeatInfo();
                //发送信息
                DA.sendDataToWebView(data.formUrl,{
                    dayInfo : dayInfo
                });
                DA.back();
            });
        },
        //获取重复信息
        getREpeatInfo : function(){
            var $li = $(".repeatList").find(".ui-item-list>ul>li"),
                info = "",
                value;
            for(var i=0;i<$li.length;i++){
                value = Number(DA.getUI('checkitemList').getValue(i));
                if(value>0){
                    info = info+value+",";
                }
            }
            return info.slice(0,info.length-1);
        }
    };
    return repeatFunc;
}); 