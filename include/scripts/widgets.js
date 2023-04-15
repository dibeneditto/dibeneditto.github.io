/* 
Source: https://developer.twitter.com/en/docs/twitter-for-websites/javascript-api/guides/set-up-twitter-for-websites
Description: Include the Twitter for Websites JavaScript once in your page template for optimal web page performance 
  and to enable tracking of Twitter widget JavaScript events. If your site is using multiple widgets you can set up 
  Twitter widgets in your pages once, which will make your site faster, and widgets such as embedded Tweets will be 
  more reliable for authors when using content management systems.
*/
window.twttr = (function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0],
    t = window.twttr || {};
  if (d.getElementById(id)) return t;
  js = d.createElement(s);
  js.id = id;
  js.src = "https://platform.twitter.com/widgets.js";
  fjs.parentNode.insertBefore(js, fjs);

  t._e = [];
  t.ready = function(f) {
    t._e.push(f);
  };

  return t;
}(document, "script", "twitter-wjs"));
