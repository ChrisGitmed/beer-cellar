var $bigNewButton = document.querySelector('#big-new-button');
var $viewHomeEmpty = document.querySelector('#home-empty-view');
var $viewNewEntry = document.querySelector('#new-entry-view');
var $viewEntries = document.querySelector('#entries-view');
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

function getBeerObjectInDOM(beerObject) {
  const $newEntryRow = document.createElement('div');
  $newEntryRow.setAttribute('class', 'row justify-center');

  const $entryBox = document.createElement('div');
  $entryBox.setAttribute('class', 'dark-box col-90p');
  $newEntryRow.appendChild($entryBox);

  const $newEntryHeader = document.createElement('div');
  $newEntryHeader.setAttribute('class', 'row justify-center');
  $entryBox.appendChild($newEntryHeader);

  const $newEntryHeaderText = document.createElement('h2');
  $newEntryHeaderText.textContent = beerObject.name;
  // Fix here ^^^
  $newEntryHeader.appendChild($newEntryHeaderText);

  if (beerObject.brewery !== '') {
    const $newBrewerCityRow = document.createElement('div');
    $newBrewerCityRow.setAttribute('class', 'row');
    $entryBox.appendChild($newBrewerCityRow);

    const $brewerColumn = document.createElement('div');
    $brewerColumn.setAttribute('class', 'col-2');
    $newBrewerCityRow.appendChild($brewerColumn);

    const $brewerText = document.createElement('p');
    const $brewerHeading = document.createElement('span');
    $brewerHeading.textContent = 'Brewery: ';
    $brewerText.appendChild($brewerHeading);
    $brewerText.append(beerObject.brewery); // Make this reflect API data
    $brewerColumn.appendChild($brewerText);

    const $cityColumn = document.createElement('div');
    $cityColumn.setAttribute('class', 'col-2');
    $newBrewerCityRow.appendChild($cityColumn);

    const $cityText = document.createElement('p');
    const $cityHeading = document.createElement('span');
    $cityHeading.textContent = 'City: ';
    $cityText.appendChild($cityHeading);
    $cityText.append(beerObject.city); // Make this reflect API data
    $cityColumn.appendChild($cityText);

    const $websiteRow = document.createElement('div');
    $websiteRow.setAttribute('class', 'row');
    $entryBox.appendChild($websiteRow);

    const $websiteText = document.createElement('p');
    const $webLink = document.createElement('a');
    $websiteText.setAttribute('class', 'yellow-text');
    $websiteText.textContent = 'Website: ';
    $webLink.setAttribute('href', beerObject.url); // Make this reflect API data
    $webLink.textContent = 'modertimes.com';
    $websiteText.appendChild($webLink);
    $websiteRow.appendChild($websiteText);
  }

  if (beerObject.notes !== '') {
    const $notesRow = document.createElement('div');
    $notesRow.setAttribute('class', 'row');
    $entryBox.appendChild($notesRow);

    const $notesText = document.createElement('p');
    const $notesHeading = document.createElement('span');
    $notesHeading.textContent = 'Notes: ';
    $notesText.appendChild($notesHeading);
    const $br = document.createElement('br');
    $notesText.appendChild($br);
    $notesText.append(beerObject.notes);
    $notesRow.appendChild($notesText);
  }
  return $newEntryRow;
}

document.addEventListener('DOMContentLoaded', checkLoaded);

function checkLoaded(event) {
  const cellarList = localStorage.getItem('beer-cellar');
  if (cellarList !== null) {
    data = JSON.parse(cellarList);
  }
  if (data.beers.length !== 0) {
    $viewHomeEmpty.className = 'hidden';
    $viewEntries.className = '';
    for (let i = 0; i < data.beers.length; i++) {
      $viewEntries.appendChild(getBeerObjectInDOM(data.beers[i]));
    }
  }

}
