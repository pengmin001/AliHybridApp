define([], function() {
    var param = DA.query;
    //设备功能
    var setTimerFunc = {
        //初始化
        init : function(data){
            //事件
            setTimerFunc.bindEvent(data);
        },
        //事件
        bindEvent : function(data){
            //返回上一页
            $("body").on("click",".back",function(){
                DA.back();
            });
            console.log(data);
            //完成保存
            $("body").on("click",".setTimer-define",function(){
                var $onTime  = $(".switch-select .ui-aftertxt").eq(0).text().split(":"),
                    $offTime = $(".switch-select .ui-aftertxt").eq(1).text().split(":"),
                    $dayInfo = $(".operate").attr("dayInfo");
                console.log("UTC+08:00 0 "+$onTime[1]+" "+$onTime[0]+" ? * "+$dayInfo,"UTC+08:00 0 "+$offTime[1]+" "+$offTime[0]+" ? * "+$dayInfo);
                if(data.checkedValue==1){//第一个定时
                    DA.setDeviceStatus(param.uuid,{
                        "AlarmClock_PowerOff1" : { 
                            "extra": "UTC+08:00 0 "+$onTime[1]+" "+$onTime[0]+" ? * "+$dayInfo
                        },
                        "AlarmClock_PowerOn1" : { 
                            "extra": "UTC+08:00 0 "+$offTime[1]+" "+$offTime[0]+" ? * "+$dayInfo
                        }
                    });
                }else if(data.checkedValue==2){//第二个定时
                    DA.setDeviceStatus(param.uuid,{
                        "AlarmClock_PowerOff2" : { 
                            "extra": "UTC+08:00 0 "+$onTime[1]+" "+$onTime[0]+" ? * "+$dayInfo
                        },
                        "AlarmClock_PowerOn2" : { 
                            "extra": "UTC+08:00 0 "+$offTime[1]+" "+$offTime[0]+" ? * "+$dayInfo
                        }
                    });
                }else if(data.checkedValue==3){//第三个定时
                    DA.setDeviceStatus(param.uuid,{
                        "AlarmClock_PowerOff3" : { 
                            "extra": "UTC+08:00 0 "+$onTime[1]+" "+$onTime[0]+" ? * "+$dayInfo
                        },
                        "AlarmClock_PowerOn3" : { 
                            "extra": "UTC+08:00 0 "+$offTime[1]+" "+$offTime[0]+" ? * "+$dayInfo
                        }
                    });
                }
                //发送信息
                DA.sendDataToWebView(data.formUrl,{
                    state : "reload"
                });
                DA.back();
            });
            //替换时间开关列表位置
            $("body").on("click",".icon-change-box",function(){
                var $li = $(".setTiming-switch-select").find(".ui-item-list>ul>li");
                $li.eq(0).before($li.eq(1));
            });
        },
        //创建时间
        createTime : function(info){
            console.log(info);
            window.WindVane.call('AlinkDateTimePicker','show',{
                'type':'2',
                'title':'设置时间',
                'ok':'确定',
                'cancel':'取消',
                'defaultValue':info[0]+':'+info[1],
            },
            function(e) {
                $(".setTiming-switch-select").find(".active .ui-aftertxt").text(setTimerFunc.decade(e.result.split(":")[0])+":"+setTimerFunc.decade(e.result.split(":")[1])).closest("li.active").removeClass("active");
            },
            function(e) {
                console.log(e,JSON.stringify(e));
            });
        },
        //展示重复信息
        showRepeatInfo : function(data){
            console.log(data);
            $(".operate").html("").attr("dayInfo",data.dayInfo);
            var RadioList = new DA.AlinkUI.RadioItemList('RadioItemList',{
                domhook : $('.operate'),
                datamodel: {
                    key: 'nine',
                    value: "0", 
                    unCheckedValue:'0',
                    map: [{
                            title: '重复', 
                            checkedValue:'0',
                            after:data.subtitle||'永不',
                            rightIcon:'&#xe617;'
                          }],
                },
                clickTocancel:true,
                separate:true, 
                onClickBefore:function(){
                    return true;
                },
                onClickAfter:function(){
                    console.log('onClickAfter');
                    return true;
                },
                onItemClick:function(targetItem,e){
                },    
                onClickItemInner:function(item,index){
                    var info = {
                        dayInfo : data.dayInfo,
                        key : data.key,
                        formUrl : location.href
                    }
                    console.log("参数",info);
                    //当separate为true，点击ui-item-inner才会触发这个onClickItemInner
                    //DA.loadPage("http://30.10.149.159:8080/WEBER_I5/repeat/app.html",info);
                    DA.loadPage("./repeat/app.html",info);
                }
            });
        },
        //处理单数为十位数
        decade : function(val){
            if(val.length==1){
                val = "0"+val;
            }
            return val;
        },
        //处理天数信息
        getDayInfo : function(info){
            console.log(info);
            //仅一次
            if(info=="0"){
                return "仅一次";
            }
            //双休日
            if(info=="6,7"){
                return "双休日";
            }
            //工作日
            if(info=="1,2,3,4,5"){
                return "工作日";
            }
            //每天
            if(info=="*"||info=="1,2,3,4,5,6,7"){
                return "每天";
            }
            //获取重复日
            info = info.split(",");
            var html = "<ul class='day-list'>";
            for(var i=0;i<info.length;i++){
                console.log(info,info[i]);
                switch(info[i]){
                    case "1":
                      html += "<li>周一</li>";
                      break;
                    case "2":
                      html += "<li>周二</li>";
                      break;
                    case "3":
                      html += "<li>周三</li>";
                      break;
                    case "4":
                      html += "<li>周四</li>";
                      break;
                    case "5":
                      html += "<li>周五</li>";
                      break;
                    case "6":
                      html += "<li>周六</li>";
                      break;
                    case "7":
                      html += "<li>周日</li>";
                      break;
                } 
            }
            html+="</ul>"
            return html;
        }
    };
    return setTimerFunc;
});

