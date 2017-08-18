    // 设备离线时显示的内容
    var offlineConfig = {  
        "bgColor": "#AEAEAE"
        , "panel": {
            "p1": {
                "vUnit": ""
                , "vTitle": ""
                , "vContent": ""
            }
            , "p2": {
                "vUnit": ""
                , "vTitle": ""
                , "vContent": ""
            }
            , "p3": {
                "vUnit": ""
                , "vTitle": ""
                , "vContent": "设备离线"
            }
            , "connection": {
                "vUnit": ""
                , "vTitle": ""
                , "vContent": ""
            }
        }
    };

    // 设备在线时显示的内容
    var config = {  
        "bgColor": "#99c72a"
        , "panel": {
            "p1": {
                "vUnit": ""   // 单位
                , "vTitle": "开关" // 标题
                , "vContent": getDevicePower()==1?"开":"关"  // 支持JavaScript函数，对数据进行简单加工
            }
            , "p2": {
                "vUnit": ""
                , "vTitle": ""
                , "vContent": getDevicePower()==1?"当前温度"+model.data.Temperature_Now.value:"" //支持直接读取设备属性值
            }
            , "p3": {
                "vUnit": ""
                , "vTitle": ""
                , "vContent": getDevicePower()==1?"模式："+getStates():"待机"
            }
            , "connection": {
                "vUnit": ""
                , "vTitle": ""
                , "vContent": ""
            }
        }
    };
    //启用
    function main() {
        if (model.data.onlineState.value == "on") {
            return JSON.stringify(config);
        } else {
            return JSON.stringify(offlineConfig);
        }
    }
    //获取设备开关状态
    function getDevicePower(){
       return model.data.OnOff_Power.value;
    }
    //获取设备模式
    function getStates() {
        if(model.data.OnOff_Timer1.value == "1" || model.data.OnOff_Timer2.value == "1" || model.data.OnOff_Timer3.value == "1"){
            return "预约中";
        }
        if(model.data.WorkStatus.value == "1"){ 
            return '加热中';
        }else{ 
            if(model.data.OnOff_Power.value=="0"){return '';}
            return '保温中';
        }
        return '工作模式';
    }
    