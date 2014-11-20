(function() {
  var feeds, getDate, stripNickname, _ref;
  if ((_ref = String.prototype.trim) == null) {
    String.prototype.trim = function() {
      return this.replace(/^\s+|\s+$/g, '');
    };
  }
  google.load('feeds', '1');
  getDate = function(str) {
    var date, day, month;
    date = new Date(str);
    day = date.getDate();
    month = date.getMonth() + 1;
    if (day < 10) day = '0' + day;
    if (month < 10) month = '0' + month;
    return "" + day + "/" + month + "/" + (date.getFullYear());
  };
  stripNickname = function(text) {
    return text.replace("" + window.twitterAccount, '').replace(/^: /, '').trim();
  };
  feeds = {
    load: function(url, callback) {
      var feed;
      if (callback == null) callback = function() {};
      feed = new google.feeds.Feed(url);
      return feed.load(function(result) {
        if (!result.error) return callback(result.feed.entries);
      });
    },
    facebook: function(entries) {
      var counter, entry, _len, _results;
      _results = [];
      for (counter = 0, _len = entries.length; counter < _len; counter++) {
        entry = entries[counter];
        if (!(counter < 3)) continue;
        window.dt = entry.publishedDate;
        _results.push($('.facebook-entries').append("<div class=\"fb-status\">\n  " + (stripNickname(entry.content)) + "\n  <div class=\"tweet-date\">" + (getDate(entry.publishedDate)) + "</div> \n</div>"));
      }
      return _results;
    },
    twitter: function(entries) {
      var tweet;
      tweet = entries.shift();
      $('.tweet-text').html(stripNickname(tweet.content));
      return $('.tweet-date').html(getDate(tweet.publishedDate));
    },
    google: function(entries) {
      var counter, entry, _len, _results;
      _results = [];
      for (counter = 0, _len = entries.length; counter < _len; counter++) {
        entry = entries[counter];
        if (counter < 3) {
          _results.push($('.google-entries').append("<div class=\"google-post\">\n  <div class=\"google-post-header\">\n    <span class=\"post-date\">" + (getDate(entry.publishedDate)) + "</span>\n    <span class=\"post-title\">\n      " + entry.author + " написал в теме\n      <a href=\"" + entry.link + "\" class=\"link\">" + entry.title + "</a>\n    </span>\n  </div>\n  <div class=\"main-post-body\">" + entry.contentSnippet + "</div>\n</div>"));
        }
      }
      return _results;
    }
  };
  google.setOnLoadCallback(function() {
    var callback, feed, name, url, _ref2, _results;
    _results = [];
    for (name in feeds) {
      feed = feeds[name];
      _ref2 = [window.feedUrls[name], feeds[name]], url = _ref2[0], callback = _ref2[1];
      _results.push(feeds.load(url, callback));
    }
    return _results;
  });
}).call(this);
