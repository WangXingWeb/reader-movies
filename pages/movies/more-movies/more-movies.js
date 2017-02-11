// pages/movies/more-movies/more-more-movies.js
var app=getApp();
var util=require('../../../utils/util.js');
Page({
  data:{
    movies:{},
    navigateTitle:'',
    requestUrl:'',
    totalCount:0,
    isEmpty:true,
  },

  onShareAppMessage: function () {
    return [{
      title: '分享',
      desc: '分享给好友',
      path: '/page/user?id=123'
    },{
       title: '分享',
      desc: '分享给好友',
      path: '/page/user?id=123'
    }]

  },

  onLoad:function(options){
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000,
    });
    var category=options.category;
    this.setData({
      navigateTitle:category
    });
    
    var dataUrl="";
    switch(category){
      case "正在热映":
        dataUrl=app.globalData.doubanBase+"/v2/movie/in_theaters";
        break;
      case "即将上映":
        dataUrl=app.globalData.doubanBase+"/v2/movie/coming_soon";
         break;
      case "豆瓣TOP250":
        dataUrl=app.globalData.doubanBase+"/v2/movie/top250";
        break;
    }
    this.setData({
      requestUrl:dataUrl
    });
    
    util.http(dataUrl,this.processDoubanData);
  },

  onReachBottom:function(event){
    var nextUrl=this.data.requestUrl+"?start="+this.data.totalCount+"&count=20";
    util.http(nextUrl,this.processDoubanData);
    wx.showNavigationBarLoading();
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000,
    });
  },

  onPullDownRefresh:function(event){
    var refreshUrl=this.data.requestUrl+"?star=0&count=20";
    this.data.movies={};
    this.data.isEmpty=true;
    util.http(refreshUrl,this.processDoubanData);
    wx.showNavigationBarLoading();
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000,
    });
  },

  processDoubanData:function(moviesDouban){
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
    var totalMovies={};
  
    if(!this.data.isEmpty){
      totalMovies=this.data.movies.concat(movies);    
    }else{
      totalMovies=movies;
      this.setData({
        isEmpty:false
      });  
     
    }
    this.setData({
      movies:totalMovies, 
    });
    this.data.totalCount+=20;
    wx.hideNavigationBarLoading();
    wx.hideToast();
    wx.stopPullDownRefresh();


     
  },

  onReady:function(){
    wx.setNavigationBarTitle({
      title: this.data.navigateTitle,
    })
  },

   onMovietap:function(event){
    var movieId=event.currentTarget.dataset.movieid;
     wx.navigateTo({
        url: "../movie-detail/movie-detail?movieId="+movieId
     });
  },
  
})