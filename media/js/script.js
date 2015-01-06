// Generated by CoffeeScript 1.8.0
var feeds, getDate, githubJobs, stripNickname, _base;

if ((_base = String.prototype).trim == null) {
  _base.trim = function() {
    return this.replace(/^\s+|\s+$/g, '');
  };
}

google.load('feeds', '1');

jQuery.ajax({
  url: "https://api.github.com/repos/scalaby/jobs/issues"
}).done(function(data) {
  return githubJobs(data);
}).error(function() {
  return $('.job-badge').html(1);
});

githubJobs = function(entries) {
  var counter, entry, _i, _len, _results;
  alert(entries.length);
  $('.job-badge').html(entries.length);
  _results = [];
  for (counter = _i = 0, _len = entries.length; _i < _len; counter = ++_i) {
    entry = entries[counter];
    if (counter < 10) {
      _results.push($('.github-jobs-entries').append("<div class=\"github-job\">\n  <span class=\"job-date\">" + (entry.created_at.substring(0, 10)) + "</span>\n  <span class=\"job-subject\">\n    <a href=\"" + entry.html_url + "\" class=\"link\">" + entry.title + "</a>\n  </span>\n</div>"));
    }
  }
  return _results;
};

getDate = function(str) {
  var date, day, month;
  date = new Date(str);
  day = date.getDate();
  month = date.getMonth() + 1;
  if (day < 10) {
    day = '0' + day;
  }
  if (month < 10) {
    month = '0' + month;
  }
  return "" + day + "/" + month + "/" + (date.getFullYear());
};

stripNickname = function(text) {
  return text.replace("" + window.twitterAccount, '').replace(/^: /, '').trim();
};

feeds = {
  load: function(url, callback) {
    var feed;
    if (callback == null) {
      callback = function() {};
    }
    feed = new google.feeds.Feed(url);
    return feed.load(function(result) {
      if (!result.error) {
        return callback(result.feed.entries);
      }
    });
  },
  facebook: function(entries) {
    var counter, entry, _i, _len, _results;
    _results = [];
    for (counter = _i = 0, _len = entries.length; _i < _len; counter = ++_i) {
      entry = entries[counter];
      if (!(counter < 3)) {
        continue;
      }
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
    var counter, entry, _i, _len, _results;
    _results = [];
    for (counter = _i = 0, _len = entries.length; _i < _len; counter = ++_i) {
      entry = entries[counter];
      if (counter < 3) {
        _results.push($('.google-entries').append("<div class=\"google-post\">\n  <div class=\"google-post-header\">\n    <span class=\"post-date\">" + (getDate(entry.publishedDate)) + "</span>\n    <span class=\"post-title\">\n      " + entry.author + " написал в теме\n      <a href=\"" + entry.link + "\" class=\"link\">" + entry.title + "</a>\n    </span>\n  </div>\n  <div class=\"main-post-body\">" + entry.contentSnippet + "</div>\n</div>"));
      }
    }
    return _results;
  }
};

google.setOnLoadCallback(function() {
  var callback, feed, name, url, _ref, _results;
  _results = [];
  for (name in feeds) {
    feed = feeds[name];
    _ref = [window.feedUrls[name], feeds[name]], url = _ref[0], callback = _ref[1];
    _results.push(feeds.load(url, callback));
  }
  return _results;
});
