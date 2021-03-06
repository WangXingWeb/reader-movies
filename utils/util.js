//处理评分数据
function convertToStarsArray(stars){
    var num1=stars.toString().substring(0,1);
    var num2=stars.toString().substring(1,2);
    var array=[];
    for(var i=1;i<=5;i++){
        if(i<=num1){
            array.push(1);
        }else{
            array.push(0);
        }
    }
    if(num2==5){
        array[num1]=2;
    }
    return array;
}


function http(url,callBack){
     wx.request({
      url: url,
      method: 'GET',
      header: {"Content-Type": "/json" }, 
      success: function (res) {
          callBack(res.data);      
      },
      fail: function (error) {
        console.log(error);
      },
     
    })
  }

function convertToCastString(casts){
    var castsjoin="";
    for(var idx in casts){
        castsjoin=castsjoin+casts[idx].name+"/";
    }
    return castsjoin.substring(0,castsjoin.length-2);
}

function convertToCastInfos(casts){
    var castsArray=[];
    for(var idx in casts){
        var cast={
            img:casts[idx].avatars?casts[idx].avatars.large:"",
            name:casts[idx].name
        }
        castsArray.push(cast);
    }
    return castsArray;

}

  module.exports={
    convertToStarsArray:convertToStarsArray,
    http:http,
    convertToCastInfos:convertToCastInfos,
    convertToCastString:convertToCastString
}
