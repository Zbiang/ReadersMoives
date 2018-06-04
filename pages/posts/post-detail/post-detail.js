var postsData = require("../../../data/posts.js")
var app = getApp()

Page({
  data: {
    isPlayingMusic: false
  },
  onLoad: function(option) {
    var globalData = app.globalData
    var postId = option.id
    this.setData({
      currentPostId: postId
    })
    var postData = postsData.postList[postId]
    // this.data.postData = postData
    this.setData({
      postData: postData
    })

    var postsCollected = wx.getStorageSync('posts_collected')
    if(postsCollected) {
      var postCollected = postsCollected[postId]
      this.setData({
        collected: postCollected
      })
    }
    else {
      var postsCollected = {}
      postsCollected[postId] = false
      wx.setStorageSync("posts_collected", postsCollected)
    }
    if(app.globalData.g_isPlayingMusic && app.globalData.g_currentPostId === postId) {
      this.setData({
        isPlayingMusic: true
      })
    }
    this.setMusicMonitor()
  },

  setMusicMonitor: function() {
    var that = this
    wx.onBackgroundAudioPlay(function () {
      that.setData({
        isPlayingMusic: true
      })
      app.globalData.g_isPlayingMusic = true
      app.globalData.g_currentMusicPostId = that.data.currentPostId
    })
    wx.onBackgroundAudioPause(function () {
      that.setData({
        isPlayingMusic: false
      })
      app.globalData.g_isPlayingMusic = false
      app.globalData.g_currentMusicPostId = null
    })
    wx.onBackgroundAudioStop(function () {
      that.setData({
        isPlayingMusic: false
      })
      app.globalData.g_isPlayingMusic = false
      app.globalData.g_currentMusicPostId = null
    })
  },

  onCollectionTap: function(event) {
    this.getPostsCollectedSyc()
  },

  getPostsCollectedAsy: function() {
    var that = this
    wx.getStorage({
      key: 'posts_collected',
      success: function(res) {
        var postsCollected = res.data
        var postCollected = postsCollected[that.data.currentPostId]
        postCollected = !postCollected
        postsCollected[that.data.currentPostId] = postCollected
        that.showModal(postsCollected, postCollected)
      }
    })
  },

  getPostsCollectedSyc: function() {
    var postsCollected = wx.getStorageSync("posts_collected")
    var postCollected = postsCollected[this.data.currentPostId]
    postCollected = !postCollected
    postsCollected[this.data.currentPostId] = postCollected
    this.showModal(postsCollected, postCollected)
  },

  showModal: function(postsCollected, postCollected) {
    var that = this
    wx.showModal({
      title: '收藏',
      content: postCollected?'是否收藏该文章?':'是否取消收藏该文章',
      showCancel: "true",
      cancelText: "取消",
      cancelColor: "#333",
      confirmText: "确认",
      confirmColor: "#666",
      success: function(res) {
        if(res.confirm) {
          wx.setStorageSync("posts_collected", postsCollected)
          that.setData({
            collected: postCollected
          })
        }
      }
    })
  },

  showToast: function(postsCollected, postCollected) {
    wx.setStorageSync("posts_collected", postsCollected)
    this.setData({
      collected: postCollected
    })
    wx.showToast({
      title: postCollected ? '收藏成功' : '取消成功',
      duration: 1000,
      icon: "success"
    })
  },

  onShareTap: function() {
    var itemList = [
      "QQ",
      "微信",
      "朋友圈",
    ]
    wx.showActionSheet({
      itemList: itemList,
      itemColor: "#405f80",
      success: function(res) {
        wx.showModal({
          title: '用户' + itemList[res.tapIndex],
          content: '取消了么' + res.cancel,
        })
      }
    })
  },

  onMusicTap: function(event) {
    var currentPostId = this.data.currentPostId
    var postData = postsData.postList[currentPostId]
    var isPlayingMusic = this.data.isPlayingMusic
    if(isPlayingMusic) {
      wx.pauseBackgroundAudio()
      this.setData({
        isPlayingMusic: false
      })
    }
    else {
      wx.playBackgroundAudio({
        dataUrl: postsData.music.url,
        title: postsData.music.title,
        coverImgUrl: postsData.music.coverImg,
      })
      this.setData({
        isPlayingMusic: true
      })
    }
  }
})