var $bigNewButton = document.querySelector('#big-new-button');
var $smallNewButton = document.querySelector('#small-new-button');
var $searchButton = document.querySelector('.drop-button');
var $breweryInput = document.querySelector('#brewery-input');
var $viewHomeEmpty = document.querySelector('#home-empty-view');
var $viewNewEntry = document.querySelector('#new-entry-view');
var $viewEntries = document.querySelector('#entries-view');
var $form = document.querySelector('form');
var $dropdownMenu;
var matches = [];
var breweryData;

$bigNewButton.addEventListener('click', openNewEntryView);

$smallNewButton.addEventListener('click', openNewEntryView);

$searchButton.addEventListener('click', function (event) {
  if (event.target.tagName === 'BUTTON') {
    if ($breweryInput.value.length > 0) {
      getBreweryMatches();
    }
  }
});

window.addEventListener('click', function (event) {
  if ($viewNewEntry.className !== 'hidden') {
    if (event.target !== $dropdownMenu) {
      $dropdownMenu.className = 'dropdown-menu';
    }
  }
});

$form.addEventListener('submit', function (event) {
  event.preventDefault();
  const newBeer = {};
  newBeer.name = $form.elements.name.value;
  newBeer.brewery = breweryData;
  newBeer.notes = $form.elements.notes.value;
  data.beers.push(newBeer);
  $viewEntries.appendChild(getBeerEntryInDOM(newBeer));
  $form.reset();
  openHomeView();
});

document.addEventListener('DOMContentLoaded', checkLoaded);

window.addEventListener('beforeunload', function (event) {
  const dataJSON = JSON.stringify(data);
  localStorage.setItem('beer-cellar', dataJSON);
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
      $viewEntries.appendChild(getBeerEntryInDOM(data.beers[i]));
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

function getBeerEntryInDOM(beerObject) {
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

  if (breweryData !== undefined) {
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
    $brewerText.append(beerObject.brewery.name);
    $brewerColumn.appendChild($brewerText);

    const $cityColumn = document.createElement('div');
    $cityColumn.setAttribute('class', 'col-2');
    $newBrewerCityRow.appendChild($cityColumn);

    const $cityText = document.createElement('p');
    const $cityHeading = document.createElement('span');
    $cityHeading.textContent = 'City: ';
    $cityText.appendChild($cityHeading);
    $cityText.append(beerObject.brewery.city);
    $cityColumn.appendChild($cityText);

    const $websiteRow = document.createElement('div');
    $websiteRow.setAttribute('class', 'row');
    $entryBox.appendChild($websiteRow);

    const $websiteText = document.createElement('p');
    const $webLink = document.createElement('a');
    $websiteText.setAttribute('class', 'yellow-text');
    $websiteText.textContent = 'Website: ';
    $webLink.setAttribute('href', beerObject.brewery.website_url);
    $webLink.textContent = beerObject.brewery.website_url;
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
  breweryData = undefined;
  return $newEntryRow;
}

function getDropdownMenuInDOM() {
  if ($dropdownMenu !== undefined) {
    while ($dropdownMenu.firstChild) {
      $dropdownMenu.removeChild($dropdownMenu.firstChild);
    }
    for (let i = 0; i < 3; i++) {
      if (matches[i] !== undefined) {
        var $newOption = document.createElement('p');
        $newOption.textContent = matches[i].name;
        $dropdownMenu.appendChild($newOption);
        $newOption.addEventListener('click', getBreweryData);
      }
    }
  } else {
    $dropdownMenu = document.createElement('div');
    $dropdownMenu.className = 'dropdown-menu';
    for (let x = 0; x < 3; x++) {
      if (matches[x] !== undefined) {
        $newOption = document.createElement('p');
        $newOption.textContent = matches[x].name;
        $dropdownMenu.appendChild($newOption);
        $newOption.addEventListener('click', getBreweryData);
      }
    }
  }
  return $dropdownMenu;
}

function getBreweryMatches() {
  const xhr = new XMLHttpRequest();

  xhr.open('get', 'https://api.openbrewerydb.org/breweries?by_name=' + $breweryInput.value);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    for (let i = 0; i < 3; i++) {
      matches[i] = (xhr.response[i]);
    }
    $searchButton.appendChild(getDropdownMenuInDOM());
    $dropdownMenu = document.querySelector('.dropdown-menu');
    $dropdownMenu.className = 'dropdown-menu show';
  });
  xhr.send();
}

function getBreweryData(event) {
  for (let i = 0; i < matches.length; i++) {
    if (event.target.textContent === matches[i].name) {
      breweryData = matches[i];
      $breweryInput.value = breweryData.name;
    }
  }
}
