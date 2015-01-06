String::trim ?= -> @replace /^\s+|\s+$/g, ''

google.load 'feeds', '1'

jQuery.ajax
  url: "https://api.github.com/repos/scalaby/jobs/issues"
.done (data) ->
  githubJobs data
.error () ->  
  $('.job-badge').html(1);

githubJobs = (entries) ->  
  $('.job-badge').html(entries.length);

  for entry, counter in entries when counter < 10
    $('.github-jobs-entries').append """
      <div class="github-job">
        <span class="job-date">#{entry.created_at.substring(0, 10)}</span>
        <span class="job-subject">
          <a href="#{entry.html_url}" class="link">#{entry.title}</a>
        </span>
      </div>
    """

getDate = (str) ->
  date = new Date str
  day = date.getDate()
  month = date.getMonth() + 1

  day = '0' + day if day < 10
  month = '0' + month if month < 10
  "#{day}/#{month}/#{date.getFullYear()}"


stripNickname = (text) ->
  text
    .replace("#{window.twitterAccount}", '')
    .replace(/^: /, '')
    .trim()


feeds =
  load: (url, callback = ->) ->
    feed = new google.feeds.Feed url
    feed.load (result) -> callback result.feed.entries unless result.error

  facebook: (entries) ->
    for entry, counter in entries when counter < 3
      window.dt = entry.publishedDate
      $('.facebook-entries').append """
        <div class="fb-status">
          #{stripNickname(entry.content)}
          <div class="tweet-date">#{getDate(entry.publishedDate)}</div> 
        </div>
      """

  twitter: (entries) ->
    # Get only the first tweet.
    tweet = entries.shift()
    $('.tweet-text').html stripNickname tweet.content
    $('.tweet-date').html getDate tweet.publishedDate

  google: (entries) ->
    for entry, counter in entries when counter < 3
      $('.google-entries').append """
        <div class="google-post">
          <div class="google-post-header">
            <span class="post-date">#{getDate(entry.publishedDate)}</span>
            <span class="post-title">
              #{entry.author} написал в теме
              <a href="#{entry.link}" class="link">#{entry.title}</a>
            </span>
          </div>
          <div class="main-post-body">#{entry.contentSnippet}</div>
        </div>
      """

google.setOnLoadCallback -> 
  for name, feed of feeds
    [url, callback] = [window.feedUrls[name], feeds[name]]
    feeds.load url, callback
