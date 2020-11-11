var $bigNewButton = document.querySelector('#big-new-button');
var $smallNewButton = document.querySelector('#small-new-button');
var $searchButton = document.querySelector('.drop-button');
var $dropdownContent = document.querySelector('.dropdown-content');
var $viewHomeEmpty = document.querySelector('#home-empty-view');
var $viewNewEntry = document.querySelector('#new-entry-view');
var $viewEntries = document.querySelector('#entries-view');
var $form = document.querySelector('form');

$bigNewButton.addEventListener('click', openNewEntryView);

$smallNewButton.addEventListener('click', openNewEntryView);

$searchButton.addEventListener('click', function (event) {
  $dropdownContent.className = 'dropdown-content show';
});

$form.addEventListener('submit', function (event) {
  event.preventDefault();
  const newBeer = {};
  newBeer.name = $form.elements.name.value;
  newBeer.brewery = $form.elements.brewery.value;
  newBeer.notes = $form.elements.notes.value;
  data.beers.push(newBeer);
  $viewEntries.appendChild(getBeerObjectInDOM(newBeer));
  $form.reset();
  openHomeView();
});

document.addEventListener('DOMContentLoaded', checkLoaded);

window.addEventListener('beforeunload', function (event) {
  const dataJSON = JSON.stringify(data);
  localStorage.setItem('beer-cellar', dataJSON);
});

window.addEventListener('click', function (event) {
  if (event.target !== $searchButton && event.target !== $dropdownContent) { $dropdownContent.className = 'dropdown-content '; }
});

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

function openNewEntryView(event) {
  $viewHomeEmpty.className = 'hidden';
  $viewEntries.className = 'hidden';
  $viewNewEntry.className = '';
}

function openHomeView() {
  if (data.beers.length > 0) {
    $viewEntries.className = '';
    $viewNewEntry.className = 'hidden';
  } else {
    $viewHomeEmpty.className = '';
    $viewNewEntry.className = 'hidden';
  }
}

function getBeerObjectInDOM(beerObject) {
  const $newEntryRow = document.createElement('div');
  $newEntryRow.setAttribute('class', 'row justify-center');

  const $entryBox = document.createElement('div');
  $entryBox.setAttribute('class', 'dark-box col-90p');
  $newEntryRow.appendChild($entryBox);

  const $newEntryHeader = document.createElement('div');
  $newEntryHeader.setAttribute('class', 'row justify-center');
  $entryBox.appendChild($newEntryHeader);

  const $newEntryHeaderText = document.createElement('h3');
  $newEntryHeaderText.textContent = beerObject.name;
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

function getDropdownMenuInDOM(arg1, arg2, arg3) {
  const $dropMenu = document.createElement('div');
  $dropMenu.className = 'dropdown-content';

  const $option1 = document.createElement('p');
  $option1.textContent = arg1;
  $dropMenu.appendChild($option1);

  const $option2 = document.createElement('p');
  $option2.textContent = arg2;
  $dropMenu.appendChild($option2);

  const $option3 = document.createElement('p');
  $option3.textContent = arg3;
  $dropMenu.appendChild($option3);

  return $dropMenu;
}

// To avoid linter
getDropdownMenuInDOM('test1', 'test2', 'test3');
