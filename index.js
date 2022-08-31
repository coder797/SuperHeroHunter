const searchBox = document.getElementById('searchBar');
const url = "https://www.superheroapi.com/api.php/2496364390592143";
loadEventListeners();
const resultsContainer = document.getElementById('_containerId'); // element to display results within
function loadEventListeners() {
    searchBox.addEventListener("keyup", handleSearch);
}

function removeFromFav(e) {
    let id = e.target.parentElement.parentElement.id;
    let favs = getFavs();

    let updatedFavs = favs.filter(function (val) {
        return val != id;
    });
    console.log(updatedFavs);
    localStorage.setItem("favHeros", JSON.stringify(updatedFavs));
    e.target.classList.remove('fa-solid');
    e.target.classList.add('fa-regular');
    e.target.removeEventListener("click", removeFromFav);
    e.target.addEventListener("click", addToFav);
}

function addToFav(e) {
    let id = e.target.parentElement.parentElement.id;

    let favs = getFavs();
    if (!favs.includes(id)) {
        favs.push(id);
    }
    localStorage.setItem("favHeros", JSON.stringify(favs));
    e.target.classList.remove('fa-regular');
    e.target.classList.add('fa-solid');
    e.target.removeEventListener("click", addToFav);
    e.target.addEventListener("click", removeFromFav);
}

async function handleSearch(e) {
    let name = e.target.value.trim();

    if (name.length === 0) {
        await resultsClear();
    } else {
        let data = await fetchAsync(`${url}/search/${name}`);
        if (data && data.response === "success") {
            await resultsClear();
            let favs = getFavs();
            for (let i = 0; i < data.results.length; i++) {
                let divSuper = document.createElement("div"); // super parent
                divSuper.setAttribute("id", `${data.results[i].id}`);
                divSuper.className = 'search-itemSuper'
                // console.log(data.results[i]);
                // main child of ahref
                let _card = document.createElement("div");//p
                _card.className = "_card";
                let _img = document.createElement("div");//p
                _img.className = "_img";
                let _imgE = document.createElement("img");
                _imgE.className = "img-fluid";
                _imgE.src = data.results[i].image.url;
                _imgE.height = 95;
                _imgE.width = 90;
                // append imge from imgDiv
                _img.appendChild(_imgE);
                let _content = document.createElement("div");//p
                _content.className = "_content";
                // child of content
                let h3 = document.createElement("h3");
                h3.innerHTML = `${data.results[i].name}`;
                // append h3 to content
                _content.appendChild(h3);
                let pE = document.createElement('p');
                pE.innerHTML = `${data.results[i].connections['group-affiliation']}`
                _content.appendChild(pE);
                let spanT = document.createElement('span');
                spanT.addEventListener("click", heroPage)

                // hande favs
                let starfav = document.createElement('i');
                if (favs.includes(data.results[i].id)) {
                    starfav.classList.add('fa-solid', 'fa-star');
                    starfav.addEventListener('click', removeFromFav);

                } else {
                    starfav.classList.add('fa-regular', 'fa-star');
                    starfav.addEventListener('click', addToFav);

                }
                //spant is a child of card
                spanT.appendChild(_img);
                spanT.appendChild(_content);
                _card.appendChild(spanT);
                _card.appendChild(starfav);
                divSuper.appendChild(_card);
                // console.log(ahref);
                // adding all superheroes to dom
                resultsContainer.append(divSuper);
            }
        } else {
            await resultsClear();
            noResults();
        }
    }

}

async function fetchAsync(url) {
    try {
        let response = await fetch(url);
        let data = response.json();
        return data;
    } catch (err) {
        await resultsClear();
    }
}

async function resultsClear() {
    document.querySelectorAll('.search-itemSuper').forEach(
        child => child.remove());
    console.log("resultsClear")
}

function noResults() {
    const what = `<div class="_card"><span><div class="_content"><h3>No Result Found</h3></div></span></div>`;
    let _card = document.createElement('div');
    _card.classList.add('_card', 'search-itemSuper');
    let _span = document.createElement('span');
    let _content = document.createElement('div');
    _content.className = '_content';
    let _h3 = document.createElement('h3');
    _h3.innerHTML = 'No Result Found';
    _content.appendChild(_h3);
    _span.appendChild(_content);
    _card.appendChild(_span);
    resultsContainer.append(_card);

}

async function heroPage(e) {

    // if (e.target.parentElement.parentElement.parentElement.parentElement.id !== '_containerId') {
    //     console.log(e.target.parentElement.parentElement.parentElement.parentElement.id)
    // } else {
    //     console.log(e.target.parentElement.parentElement.parentElement.id)
    // }
    let id = e.target.parentElement.parentElement.parentElement.parentElement.id !== '_containerId'
        ? e.target.parentElement.parentElement.parentElement.parentElement.id : e.target.parentElement.parentElement.parentElement.id;
    let path = `${window.location.pathname} + /../superhero.html#id=${id}`;
    window.open(path);
}

// retrieve a list of favourite hero id's from local storage
function getFavs() {
    let favs;
    if (localStorage.getItem("favHeros") === null) {
        favs = [];
    } else {
        favs = JSON.parse(localStorage.getItem("favHeros"));
    }
    return favs;
}
