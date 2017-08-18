require(['./main.js'], function (WB) {
    //获取传进来的数据
    var data = DA.urlParam();
   
   WB.init(data);
});