/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
  // TODO: Make an ajax request to the searchShows api.  Remove
  // hard coded data.

  const results = await axios.get('http://api.tvmaze.com/search/shows', {params: {q: query}});
  const shows = []
  for (let item of results.data) {
    const showObj = {
      id: item.show.id, 
      name: item.show.name, 
      summary: item.show.summary, 
    };
    showObj.image = !item.show.image ? "https://tinyurl.com/tv-missing" : item.show.image.medium; 
    shows.push(showObj);
  }
  return shows;
}



/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
           <div class="card-body">
             <img class="card-img-top" src=${show.image}>
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <button>Episodes</button>
           </div>
         </div>
       </div>
      `);
      $showsList.append($item);
      // console.log($item.data("show-id"));
  }
}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);
});

$("#shows-list").on("click", "button", async function handleClick (evt) {

  let showId = $(evt.target.closest(".Show")).data("show-id");

  let episodes = await getEpisodes(showId);

  populateEpisodes(episodes);
});

/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  // TODO: get episodes from tvmaze
  //       you can get this by making GET request to
  //       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes

  // TODO: return array-of-episode-info, as described in docstring above
  let results = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
  let episodes = [];
  for (let item of results.data) {
    let ep = {
      id: item.id,
      name: item.name,
      season: item.season, 
      number: item.number
    }
    episodes.push(ep);
  } 
  return episodes;
}


function populateEpisodes(episodes) {
  // let $episodesList = $("#episodes-list");
  // $episodesList.empty();
  const $episodesArea = $("#episodes-area");
  $episodesArea.empty();
  $episodesArea.show();

  const $episodesList = $(`
    <div class="dropdown">
      <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
        Episodes
      </button>
      <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1" id="dropdown-list">
      </ul>
    </div>
    `);
  $episodesArea.append($episodesList);

  const $dropdownList = $("#dropdown-list");

  for (let episode of episodes) {
    let $item = $(`<li><a class="dropdown-item" href="#">${episode.name}: (season ${episode.season}, number ${episode.number})</a></li>`);
    $dropdownList.append($item);
  }

  $episodesArea.append($episodesList);

}