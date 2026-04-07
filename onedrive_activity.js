(function () {
  function updateActivity(text) {
    var el = document.getElementById('file-activity');
    if (el) el.textContent = text;
  }
  updateActivity('Syncing OneDrive activity…');
  setTimeout(function () { updateActivity('Last update: just now'); }, 1500);
})(); 
