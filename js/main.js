var $bigNewButton = document.querySelector('#big-new-button');
var $viewHomeEmpty = document.querySelector('.home-empty-view');
var $viewNewEntry = document.querySelector('.new-entry-view');

$bigNewButton.addEventListener('click', function (event) {
  $viewHomeEmpty.className = 'home-empty-view hidden';
  $viewNewEntry.className = 'new-entry-view';
});
