define([], function() {
    var param = DA.query;
    console.log(param,param.uuid);
    //设备功能
    var DeviceFunc = {
        //初始化
        init : function(){
            DeviceFunc.getDeviceDetailInfo();
            //设备状态改变
            DA.bindPushData({
                'deviceStatusChange' : function(resp){
                    //渲染数据_将查询到的设备状态显示在界面上
                    DeviceFunc.renderData(resp);
                }
            });
            //绑定事件
            DeviceFunc.bindEvent();
        },
        //获取设备详细信息
        getDeviceDetailInfo : function(){
            //查询设备配置好的字段值
            DA.getDeviceStatus(param.uuid,function(resp){
                //渲染数据
                if (resp){
                    console.log("查询到的设备状态："+JSON.stringify(resp));
                    DeviceFunc.renderData(resp);
                }
            });
        },
        //渲染数据
        renderData : function(resp){
            //断网提示关闭
            $(".ui-offNet").html("").hide();
            if(!DeviceFunc.onlineState(resp.onlineState)){
                return;
            }
            try {
                //设备状态信息--实际机组温度
                DeviceFunc.setDeviceTemperature(resp);
                //设备开关
                DeviceFunc.setDeviceSwitch(resp.Switch.value);
                //设备模式
                DeviceFunc.setDeviceMode(resp.Wmod.value);
                //温度设定范围计算 当前模式、设定温度、节能最高温度、普通最高温度
                DeviceFunc.setTemperature(resp.Wmod.value, resp.Temperature.value,resp.WstpSv.value,resp.WstpH.value);
                //获取设备故障信息
                DeviceFunc.getDeviceFailureInfo(resp.Werr.value);
                //获取设备时间信息
                DeviceFunc.getDeviceTimingInfo(resp);
            }catch(e){
                console.log("render UI err:"+e);
            }
        },
        //在线离线状态
        onlineState : function(state){
            console.log(state);
            if(state&&state.value=="off"){
                //设备离线提示
                DeviceFunc.deviceOffLine();
                return false;
            }else{
                return true;
            }
        },
        //设备离线提示
        deviceOffLine : function(){
            var offNet = new DA.AlinkUI.OffNet('offNet1',{
                domhook : $('.bind_handle_offnet'),
                datamodel:{
                    button:{}
                }
            });
            DA.getUI('offNet1').showUI();
            $(".ui-offNet").find(".bottom-section p").text("设备当前断网，请联网后进行手机控制！");
            console.log($(".offNet1").html());
            //设置离线提示样式
            //DeviceFunc.setOffLineStyle();
        },
        //设置离线提示样式
        setOffLineStyle : function(){
            var $box     = $(".ui-offNet");
            $box.find(".section").css({height:"auto"});
            var $H       = $(window).height(),
                $bottom  = $(".bottom-section"),
                $bottomH = $bottom.height();
            console.log($H,$bottomH,$H-$bottomH);
            $bottom.siblings(".section").css({height:$H-$bottomH});
        },
        //设置热水器的状态信息 （当前机组温度、设定温度、工作状态）
        setDeviceTemperature : function(resp){
            $('.temperature-now').text(resp.CurrentTemp.value+'°C');//实际机组温度
            var workStatus = resp.CurrentTemp.value - resp.Temperature.value > 0 ? '未加热' : '加热中' ;
            $('.WorkStatus').text(workStatus);
            $('.temperature-set').text('温度设定 '+resp.Temperature.value+'°C');
        },
        //控制开关显示
        setDeviceSwitch : function(OnOff_Power){
            DA.getUI('powerSwitch').setValue(OnOff_Power);
            //判断开关设备
            DeviceFunc.DeviceSwitchStatus(OnOff_Power);
        },
        //判断开关设备
        DeviceSwitchStatus : function(OnOff_Power){
            if(OnOff_Power==1){
                $(".device-info-list").removeClass("close");
            }else if(OnOff_Power==0){
                $(".device-info-list").addClass("close");
                //获取设备关闭提示最小高度
                DeviceFunc.getDeviceCloseHintMinHeight();
            }
        },
        //获取设备关闭提示最小高度
        getDeviceCloseHintMinHeight : function(){
            //防止页面过高 元素不够 这样保证能够填充满
            var $H     = $(window).height(),
                $topH  = $(".panel-wraper").height(),
                $infoH = $(".device-info-list").find("ul").height();
            console.log($H,$topH,$infoH);
            $(".Device-close-hint").css({minHeight:$H-$topH-$infoH});
        },
        //输入设备模式
        setDeviceMode : function(HeatMode){
            DA.getUI('grid2').setValue(HeatMode);
        },
        //输入设备温度设定
        setTemperature : function(wmod,setTemp,energyMax,normalMax){
            //根据模式判断温度范围 最低35℃ 最高需要根据字段查询
          try {
              //先删除再渲染
              var limitDiv = $('#temp_limit');
              console.log("length="+limitDiv.length);
              limitDiv.remove();

              var limitElement = "<div class='ui-slider-item temperature-slider' id='temp_limit'></div>";
              $(".device-set-temperature").append(limitElement);
              var max = 35;
              wmod = parseInt(wmod);
              switch (wmod) {
                  case 0:
                      max = normalMax;
                      break;
                  case 1:
                      max = energyMax;
                      break;
                  case 2:
                      max = normalMax;
                      break;
              }
              console.log("temp max="+max);
              new DA.AlinkUI.Slider({
                  name: 'Temperature_TargetSlider',
                  datamodel: {
                      key: 'Temperature'
                  },
                  sliderLabel: '设定温度',
                  element: '.temperature-slider',
                  value: "50",
                  min: 35,
                  max: max,
                  step: 1,  //滑动时跳动的步长
                  changed: function () {
                      DA.setDeviceStatus(param.uuid, {
                          "Temperature": {
                              "value": this.getValue()
                          }
                      })
                      return true;
                  }
              });
              DA.getUI('Temperature_TargetSlider').setValue(setTemp);
          }catch(e){
              console.log(e);
          }
        },

        //获取设备故障信息
        getDeviceFailureInfo : function(ErrorCode){
            if(ErrorCode){
                var info;
                switch(ErrorCode){
                    case 0:
                      //info = {text:"漏电",code:"E1"};
                      break;
                    case 1:
                      info = {text:"故障",code:"E1"};
                        //设备故障页
                        DA.loadPage("./failure/app.html",info);
                      break;
                }

            }
        },
        //预约 只能保存一条预约 开机和关机时间
        getDeviceTimingInfo : function(resp){
            //console.log("getDeviceTimingInfo:"+JSON.stringify(resp));
            DeviceFunc.deviceTimingInfo = [];
           try {
               DeviceFunc.deviceTimingInfo.push({
                   start: DeviceFunc.timeInfoIntegration(1, "2017 9 12 12 12 12", 1),
                   end: DeviceFunc.timeInfoIntegration(1, "2017 9 12 12 12 12", 0)
               });
               //DeviceFunc.deviceTimingInfo.push({start:DeviceFunc.timeInfoIntegration(resp.WschOn.value,resp.WschOnMin.value,"OnOff_Timer1"),
               //    end:DeviceFunc.timeInfoIntegration(resp.WschOff.value,resp.WschOffMin.value,"OnOff_Timer1")});
               console.log("getDeviceTimingInfo:" + DeviceFunc.deviceTimingInfo);
           }catch(e){
               console.log("getDeviceTimingInfo:"+e);
           }
        },
        //时间信息处理成对象
        timeInfoIntegration : function(value,time,flag){
            //预约开机和预约关机同时为1才有效
         try {
             var timeArray = time.split(" "),
                 hour = Number(timeArray[3]);//时间数组的第三位是小时
             console.log("hour:"+hour);
             return {
                 section: hour >= 12 ? "下午" : "上午",
                 time: hour % 12 + ':' + timeArray[2],//开机或者关机的时间
                 switch: time,//预约是否有效
                 effect: value,//1 有效
                 status: flag,// 1 开机 0 关机
             };
         }catch(e){
             console.log("timeInfoIntegration:"+e);
         }
        },
        //绑定事件
        bindEvent : function(){
            //进入定时列表页面
            $("body").on("click",".device-timing",function(){
                console.log(DeviceFunc.deviceTimingInfo);

                var fromUrl = DA.urlParam().fromUrl;
                DA.sendDataToWebView(fromUrl,{
                    WschOn:'1',
                    WschOnMin:'4545',
                    WschOff:'1',
                    WschOffMin:'3232',
                });
                DA.loadPage("./timingList/app.html",{formUrl:location.href});
            });
        }
    };
    return DeviceFunc;
});

