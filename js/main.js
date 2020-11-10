var $bigNewButton = document.querySelector('#big-new-button');
var $viewHomeEmpty = document.querySelector('#home-empty-view');
var $viewNewEntry = document.querySelector('#new-entry-view');
var $form = document.querySelector('form');

$bigNewButton.addEventListener('click', function (event) {
  $viewHomeEmpty.className = 'home-empty-view hidden';
  $viewNewEntry.className = 'new-entry-view';
});

$form.addEventListener('submit', function (event) {
  event.preventDefault();
  const newBeer = {};
  newBeer.name = $form.elements.name.value;
  newBeer.brewery = $form.elements.brewery.value;
  newBeer.notes = $form.elements.notes.value;
  data.beers.push(newBeer);
  $form.reset();
});

window.addEventListener('beforeunload', function (event) {
  const dataJSON = JSON.stringify(data);
  localStorage.setItem('beer-cellar', dataJSON);
});
