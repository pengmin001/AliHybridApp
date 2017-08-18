define([], function() {
    var param = DA.query;
    //设备功能
    var timingFunc = {
        //初始化
        init : function(){
            timingFunc.renderDataFalse = 0;
            //获取错误参数
            timingFunc.getDeviceDetailInfo();
            //设备状态改变
            DA.bindPushData({
                'deviceStatusChange' : function(resp){
                    if(timingFunc.renderDataFalse>0){
                        timingFunc.renderDataFalse--;
                        return;
                    }
                    //渲染数据
                    timingFunc.renderData(resp);
                }
            });
        },
        //获取设备详细信息
        getDeviceDetailInfo : function(){
            DA.getDeviceStatus(param.uuid,function(resp){
                //渲染数据
                timingFunc.renderData(resp);
            });
        },
        //渲染数据
        renderData : function(resp){
            console.log(resp);
            //获取定时开关值
            timingFunc.getTimeSwtich(resp);
            //获取时间参数
            timingFunc.getTimeInfo(resp);
        },
        //获取定时开关值
        getTimeSwtich : function(resp){
            //定时1
            if(resp.OnOff_Timer1.value==1){
                timingFunc.TimeSwtich = 1;
                return;
            }
            //定时2
            if(resp.OnOff_Timer2.value==1){
                timingFunc.TimeSwtich = 2;
                return;
            }
            //定时3
            if(resp.OnOff_Timer3.value==1){
                timingFunc.TimeSwtich = 3;
                return;
            }
            timingFunc.TimeSwtich = 0;
        },
        //获取时间参数整和成数组
        getTimeInfo : function(resp){
            var info = [];
            info.push({start:timingFunc.timeInfoIntegration(resp.AlarmClock_PowerOff1,"定时开","OnOff_Timer1"),end:timingFunc.timeInfoIntegration(resp.AlarmClock_PowerOn1,"定时关","OnOff_Timer1")});
            info.push({start:timingFunc.timeInfoIntegration(resp.AlarmClock_PowerOff2,"定时开","OnOff_Timer2"),end:timingFunc.timeInfoIntegration(resp.AlarmClock_PowerOn2,"定时关","OnOff_Timer2")});
            info.push({start:timingFunc.timeInfoIntegration(resp.AlarmClock_PowerOff3,"定时开","OnOff_Timer3"),end:timingFunc.timeInfoIntegration(resp.AlarmClock_PowerOn3,"定时关","OnOff_Timer3")});
            //展示时间信息列表
            timingFunc.showTimeInfo(info);
        },
        //时间信息处理成对象
        timeInfoIntegration : function(time,status,key){
            var timeArray = time.extra.split(" ");
            return {
                time    : timingFunc.decade(timeArray[3])+':'+timingFunc.decade(timeArray[2]),
                day     : timingFunc.dayInfo(timeArray[timeArray.length-1]),
                dayInfo : timeArray[timeArray.length-1],
                switch  : time.value,
                status  : status,
                key     : key,
                hour    : timingFunc.decade(timeArray[3]),
                minute  : timingFunc.decade(timeArray[2])
            };
        },
        //处理单数为十位数
        decade : function(val){
            if(val.length==1){
                val = "0"+val;
            }
            return val;
        },
        //处理天数信息
        dayInfo : function(info){
            //仅一次
            if(info=="0"){
                return "<ul class='day-list' val='0'><li>仅一次</li></ul>";
            }
            //双休日
            if(info=="6,7"){
                return "<ul class='day-list' val='6,7'><li>双休日</li></ul>";
            }
            //工作日
            if(info=="1,2,3,4,5"){
                return "<ul class='day-list' val='1,2,3,4,5'><li>工作日</li></ul>";
            }
            //每天
            if(info=="*"||info=="1,2,3,4,5,6,7"){
                return "<ul class='day-list' val='1,2,3,4,5,6,7'><li>每天</li></ul>";
            }
            //获取重复日
            info = info.split(",");
            var html = "",
                val  = "";
            for(var i=0;i<info.length;i++){
                switch(info[i]){
                    case "1":
                      html += "<li>周一</li>";
                      val+="1,"
                      break;
                    case "2":
                      html += "<li>周二</li>";
                      val+="2,"
                      break;
                    case "3":
                      html += "<li>周三</li>";
                      val+="3,"
                      break;
                    case "4":
                      html += "<li>周四</li>";
                      val+="4,"
                      break;
                    case "5":
                      html += "<li>周五</li>";
                      val+="5,"
                      break;
                    case "6":
                      html += "<li>周六</li>";
                      val+="6,"
                      break;
                    case "7":
                      html += "<li>周日</li>";
                      val+="7,"
                      break;
                }
            }
            html = "<ul class='day-list' val='"+val.slice(0,val.length-1)+"'>"+html+"</ul>"
            return html;
        },
        //展示时间信息列表
        showTimeInfo : function(info){
            console.log(info);
            var $timingList = $(".timingList"),
                map = [];
            for(var i=0;i<info.length;i++){
                var key = info[i].start.key;
                map.push({
                    title : "<div class='time-title'>开启<b><i class='start-time'>"+info[i].start.time+"</i><span>关闭</span><i class='end-time'>"+info[i].end.time+"</i></b></div>",
                    subtitle : info[i].start.day,
                    dayInfo : info[i].start.dayInfo,
                    key : key,
                    checkedValue : i+1,
                    startTime : info[i].start.time,
                    endTime : info[i].end.time
                });
            }
            var $html = $.trim($(".timingList").html());
            if($html){
                //更新设置时间信息
                timingFunc.updateTimeInfo(map);
            }else{
                //新建设置时间信息
                timingFunc.setTimeInfo(map);
            }
        },
        //更新设置时间信息
        updateTimeInfo : function(info){
            var $item = $(".ui-item-list").find(".ui-item-link");
            for(var i=0;i<info.length;i++){
                $item.eq(i).find(".start-time").text(info[i].startTime);
                $item.eq(i).find(".end-time").text(info[i].endTime);
                $item.eq(i).find(".ui-item-subtitle").html(info[i].subtitle);
            }
            DA.getUI("RadioItemList").setValue(timingFunc.TimeSwtich||0);
        },
        //新建设置时间信息
        setTimeInfo : function(info){
            var $box = $('.timingList').html("");
            var RadioList = new DA.AlinkUI.RadioItemList('RadioItemList',{
                domhook : $box,
                datamodel: {
                    key: 'nine',
                    value: timingFunc.TimeSwtich||0, 
                    unCheckedValue:'0',
                    map: info
                },
                type:'leftCheck',
                clickTocancel:true,
                separate:true, 
                onClickBefore:function(){
                    return true;
                },
                changed: function(){
                    //阻止刷新数据
                    timingFunc.renderDataFalse++;
                    //获取设定时间参数
                    var info = timingFunc.getSetTimeInfo();
                    //定时一
                    if(info.value==1){
                        //发送改变开关指令
                        DA.setDeviceStatus(param.uuid,{
                            "OnOff_Timer1" : { 
                                "value": info.OnOff_Power
                            }
                        });
                        return false;
                    }
                    //定时二
                    if(info.value==2){
                        //发送改变开关指令
                        DA.setDeviceStatus(param.uuid,{
                            "OnOff_Timer2" : { 
                                "value": info.OnOff_Power
                            }
                        });
                        return false;
                    }
                    //定时三
                    if(info.value==3){
                        //发送改变开关指令
                        DA.setDeviceStatus(param.uuid,{
                            "OnOff_Timer3" : { 
                                "value": info.OnOff_Power
                            }
                        });
                        return false;
                    }
                    
                },
                onClickAfter:function(){
                    return true;
                },
                onItemClick:function(targetItem,e){
                    
                },    
                onClickItemInner:function(item,index){
                    var info = item,
                        $item = $(".ui-item-list").find(".ui-item-link").eq(info.checkedValue-1).closest("li");
                    //当separate为true，点击ui-item-inner才会触发这个onClickItemInner
                    info.formUrl = location.href;
                    info.startTime = $item.find(".start-time").text();
                    info.endTime = $item.find(".end-time").text();
                    info.subtitle = $item.find(".ui-item-subtitle").html();
                    info.dayInfo = $item.find(".day-list").attr("val");
                    console.log(info.checkedValue-1,info,$item);
                    //DA.loadPage("http://30.10.149.159:8080/WEBER_I5/setTimer/app.html",info);
                    DA.loadPage("./setTimer/app.html",info);
                    return false;
                }
            });
            $box.find(".check-icon.active").addClass("timingActive");
        },
        //获取设定时间参数
        getSetTimeInfo : function(){
            var value = DA.getUI('RadioItemList').getValue();
            //为选中的定时添加上标识
            if(value==0){
                value = $(".timingActive").closest(".ui-item-link").attr("data-value");
                $(".timingActive").removeClass("timingActive");
            }else{
                $(".check-icon").eq(value-1).addClass("active timingActive").closest("li").siblings().find(".check-icon").removeClass("timingActive");
            }
            //获取参数
            var OnOff_Power = DA.getUI('RadioItemList').getValue(value-1);
            OnOff_Power = (OnOff_Power==0?0:1)+"";
            var OnOff_Timer = "OnOff_Timer"+value;
            return {
                value : value,
                OnOff_Power : OnOff_Power
            }
        }
    };
    return timingFunc;
}); 