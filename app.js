require(["./main.js"],function(WB){
    var param = DA.query;
    //导航栏配置
    DA.nativeCmp.topbar.setNavbar({
        title:'格力牌热水器',
        type:'mixed',//导航条样式 mixed: 透明背景滑动过渡到非透明效果 solid: 白色背景无过度效果
        rightButton:[{//导航条右边按钮配置
            iconfont:'', //iconfont代码
            name:'iconCode',
            handler:function(){}
        }]
    });

    //电源开配置
    var powerSwitch = new DA.AlinkUI.Switch('powerSwitch', {
        domhook : $('.device-switch'),
        datamodel: {
            title: '电源',
            subtitle:'', 
            key: 'Switch',
            value: "1",
            map: {on: "1", off: "0"}
        },
        tpl:'switchItem',
        onClickBefore: function(){
            return true;
        },
        onClickAfter: function(){
            return true;
        },
        changed: function(){
            //下发指令
            var OnOff_Power = this.getValue();
            //发送改变开关指令
            DA.setDeviceStatus(param.uuid,{
                "Switch":{
                    "value": OnOff_Power
                }
            });
            //判断设备开关
            WB.DeviceSwitchStatus(OnOff_Power);
        }
    });

    //设备模式选择
    var modeGrid = new DA.AlinkUI.Grid('grid2',{
        domhook : $('.heating-mode'),
        datamodel:{
            key:'grid1',
            gridNum:'3',
            value:'0',
            uiTitle:'加热模式',
            map:[
                {
                    txt:'标准模式',
                    value:'0',
                },
                {
                    txt:'节能模式',
                    value:'1',
                },
                {
                    txt:'快速模式',
                    value:'2',
                }

            ]
        },
        onItemClick:function(item, index, e){
            return true;
        },
        changed:function(){
            console.log(param.uuid,DA.uuid,this.getValue());
            //发送改变设备模式指令
            DA.setDeviceStatus(param.uuid,{
                "Wmod":{
                    "value": this.getValue()
                }
            });
        }
    });

    //定时预约
    var itemList = new DA.AlinkUI.ItemList('itemList',{
        domhook : $('.timing'),
        datamodel: {
            map: [{
                     leftIcon:'&#x3071;',
                     title: '定时预约', 
                     subtitle: "预约开启和 关闭时间",
                     rightIcon:"&#xe617;"
                  }]
        },
        onClickBefore:function(){
            return true;
        },
        onClickAfter:function(){
            console.log('onClickAfter');
            return true;
        },
        onItemClick:function(targetItem,e){
            console.log('onItemClick',targetItem,e)
            //DA.loadPage("./timingList/app.html");
        },    
    });

    //设定温度
    //var Temperature_TargetSlider = new DA.AlinkUI.Slider({
    //    name:'Temperature_TargetSlider',
    //    datamodel: {
    //        key: 'Temperature'
    //    },
    //    sliderLabel: '设定温度',
    //    element: '.temperature-slider',
    //    value: "50",
    //    min: 35,
    //    max: 75,
    //    step: 1,  //滑动时跳动的步长
    //    changed:function  () {
    //        DA.setDeviceStatus(DA.uuid, {
    //            "Temperature": {
    //                "value": this.getValue()
    //            }
    //        })
    //        return true;
    //    }
    //});

    //启用main.js
    WB.init();
    window.a=WB;
    console.log(WB);
});

