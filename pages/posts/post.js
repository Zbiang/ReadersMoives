var postsData = require('../../data/posts.js')

Page({
  data: {
    
  },
  onLoad: function (options) {
    // this.data.postList = postsData.postList
    this.setData({
      posts_keys: postsData.postList
    })
  },
  onPostTap: function(event) {
    var postId = event.currentTarget.dataset.postid
    wx.navigateTo({
      url: 'post-detail/post-detail?id=' + postId,
    })
  },

  onSwiperTap: function(event) {
    var postId = event.target.dataset.postid
    wx.navigateTo({
      url: 'post-detail/post-detail?id=' + postId,
    })
  }
})