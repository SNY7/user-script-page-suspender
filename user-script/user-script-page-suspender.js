// ==UserScript==
// @name        Page Suspender
// @namespace   sny7.com
// @match       <all_urls>
// @grant       GM.xmlHttpRequest
// @version     1.0
// @author      Henry
// @description 8/9/2022, 11:01:34 PM
// ==/UserScript==

const baseUrl = 'https://user-script-page-suspender.pages.dev/';

if (window.location.href.startsWith(baseUrl)) {
  const urlParams = new URLSearchParams(window.location.search);
  const icon = urlParams.get('icon');
  GM.xmlHttpRequest({
    method: 'GET',
    url: icon,
    responseType: 'blob',
    onload: resp => {
      const reader = new FileReader();
      reader.onloadend = function() {
        const hiddenIcon = new Image();
        hiddenIcon.onload = function() {
          const canvas = document.createElement("canvas");
          canvas.width = hiddenIcon.width;
          canvas.height = hiddenIcon.height;
          const ctx = canvas.getContext("2d");
          ctx.globalAlpha = 0.5;
          ctx.drawImage(hiddenIcon, 0, 0);
          const base64Icon = canvas.toDataURL("image/png");
          const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
          link.type = 'image/x-icon';
          link.rel = 'shortcut icon';
          link.href = base64Icon;
          document.getElementsByTagName('head')[0].appendChild(link);
        };
        hiddenIcon.src = reader.result;
        document.getElementById('icon').src = reader.result;
      }
      reader.readAsDataURL(resp.response);
    }
  });
} else {
  document.addEventListener('keydown', function(event) {
    if (event.metaKey && event.shiftKey && event.key === 'k') {
      window.location.href = `${baseUrl}?title=${encodeURIComponent(document.querySelector('title').textContent)}&icon=${encodeURIComponent(document.querySelector('link[rel*="icon"]').href)}&uri=${encodeURIComponent(window.location.href)}`;
    }
  });
}
