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
var xhr;

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
  localStorage.setItem('beer-cellar', JSON.stringify(data));
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

  const $deleteButtonRow = document.createElement('div');
  $deleteButtonRow.setAttribute('class', 'row justify-end');
  $entryBox.appendChild($deleteButtonRow);

  const $deleteButton = document.createElement('button');
  $deleteButton.setAttribute('type', 'button');
  $deleteButton.setAttribute('class', 'delete-button');
  $deleteButton.addEventListener('click', function (event) {
    for (let i = 0; i < data.beers.length; i++) {
      if (data.beers[i].name === $entryHeaderText.textContent) {
        data.beers.splice(i, 1);
      }
    }
    $newEntryRow.remove();
    localStorage.setItem('beer-cellar', JSON.stringify(data));
  });
  $deleteButtonRow.appendChild($deleteButton);

  const $icon = document.createElement('i');
  $icon.setAttribute('class', 'fa fa-times');
  $icon.setAttribute('aria-hidden', 'true');
  $deleteButton.appendChild($icon);

  const $entryHeader = document.createElement('div');
  $entryHeader.setAttribute('class', 'row justify-center');
  $entryBox.appendChild($entryHeader);

  const $entryHeaderText = document.createElement('h3');
  $entryHeaderText.textContent = beerObject.name;
  $entryHeader.appendChild($entryHeaderText);

  if (beerObject.brewery !== undefined) {
    const $brewerCityRow = document.createElement('div');
    $brewerCityRow.setAttribute('class', 'row');
    $entryBox.appendChild($brewerCityRow);

    const $brewerColumn = document.createElement('div');
    $brewerColumn.setAttribute('class', 'col-2');
    $brewerCityRow.appendChild($brewerColumn);

    const $brewerText = document.createElement('p');
    const $brewerHeading = document.createElement('span');
    $brewerHeading.textContent = 'Brewery: ';
    $brewerText.appendChild($brewerHeading);
    $brewerText.append(beerObject.brewery.name);
    $brewerColumn.appendChild($brewerText);

    const $cityColumn = document.createElement('div');
    $cityColumn.setAttribute('class', 'col-2');
    $brewerCityRow.appendChild($cityColumn);

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
    getDropdownOptionsInDOM();
  } else {
    $dropdownMenu = document.createElement('div');
    $dropdownMenu.className = 'dropdown-menu';
    getDropdownOptionsInDOM();
  }
  return $dropdownMenu;
}

function getDropdownOptionsInDOM() {
  if (xhr.status !== 200) {
    const $badAPIRequestText = document.createElement('p');
    $badAPIRequestText.textContent = 'Bad API Request.';
    $dropdownMenu.appendChild($badAPIRequestText);
  } else if (matches[0] === undefined) {
    const $tryAgainText = document.createElement('p');
    $tryAgainText.textContent = 'No matches found.';
    $dropdownMenu.appendChild($tryAgainText);
  } else {
    for (let i = 0; i < 3; i++) {
      if (matches[i] !== undefined) {
        const $newOption = document.createElement('p');
        $newOption.textContent = matches[i].name;
        $dropdownMenu.appendChild($newOption);
        $newOption.addEventListener('click', getBreweryData);
      }
    }
  }
}

function getBreweryMatches() {
  xhr = new XMLHttpRequest();
  xhr.open('get', 'https://api.openbrewerydb.org/breweries?by_name=' + $breweryInput.value);
  xhr.responseType = 'json';
  xhr.addEventListener('error', function () {
    $searchButton.appendChild(getDropdownMenuInDOM());
    $dropdownMenu = document.querySelector('.dropdown-menu');
    $dropdownMenu.className = 'dropdown-menu show';
  });
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
    if (matches[i] !== undefined) {
      if (event.target.textContent === matches[i].name) {
        breweryData = matches[i];
        $breweryInput.value = breweryData.name;
      }
    }
  }
}
