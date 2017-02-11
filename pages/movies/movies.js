
var util=require("../../utils/util.js");
var app=getApp();

Page({

  data:{
      inTheaters:{},
      comingSoon:{},
      top250:{},
      searchResult:{},
      containerShow:true,
      searchPanelShow:false,

  },

  onLoad: function (event) {
    var inTheatersUrl=app.globalData.doubanBase+"/v2/movie/in_theaters"+"?start=0&count=3";
    var comingSoon=app.globalData.doubanBase+"/v2/movie/coming_soon"+"?start=0&count=3";
    var top250Url=app.globalData.doubanBase+"/v2/movie/top250"+"?start=0&count=3";
    
    this.getMovieListData(inTheatersUrl, "inTheaters","正在热映");
    this.getMovieListData(comingSoon, "comingSoon","即将上映");
    this.getMovieListData(top250Url, "top250","豆瓣TOP250");
  },

  onMoreTap:function(event){
    var category=event.currentTarget.dataset.category;
      wx.navigateTo({
        url: 'more-movies/more-movies?category='+category,
        success: function(res){
          // success
        },
        fail: function() {
          // fail
        },
        complete: function() {
          // complete
        }
      })
  },

  onCancelImgTap:function(event){
    this.setData({
      containerShow:true,
      searchPanelShow:false,
      searchResult:{},
    })
  },

  onBindFocus:function(event){
    this.setData({
      containerShow:false,
      searchPanelShow:true,
    })
  },

  onBindBlur:function(event){
    var text=event.detail.value;
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000,
    });
    var searchUrl=app.globalData.doubanBase+"/v2/movie/search?q="+text;
    this.getMovieListData(searchUrl,"searchResult","");
  },
  onMovietap:function(event){
    var movieId=event.currentTarget.dataset.movieid;
     wx.navigateTo({
        url: "movie-detail/movie-detail?movieId="+movieId
     });
  },

  getMovieListData:function(url,settedKey,catetoryTitle){
     var that=this;
     wx.request({
      url: url,
      method: 'GET',
      header: {"Content-Type": "/json" }, 
      success: function (res) {
        // success
        // console.log(res);
        that.processDoubanData(res.data,settedKey,catetoryTitle);
      },
      fail: function (error) {
        // fail
        console.log("fail");
        console.log(error);
      },
     
    })
  },

  processDoubanData:function(moviesDouban,settedKey, catetoryTitle){
    var movies=[];
    for(var idx in moviesDouban.subjects){
      var subject=moviesDouban.subjects[idx];
      var title=subject.title;
      if(title.length>=6){
        title=title.substring(0,6)+"...";
      }
      var temp={
        stars:util.convertToStarsArray(subject.rating.stars),
        title:title,
        average:subject.rating.average,
        coverageUrl:subject.images.large,
        movieId:subject.id,
      }
      movies.push(temp); 
    }
    var readyData={};
    readyData[settedKey]={
      movies:movies,
      catetoryTitle:catetoryTitle,
   };
    this.setData(readyData);
    wx.hideToast();
  },

})