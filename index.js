const fetch = require("node-fetch");

const CATEGORY = {
  ARMCHAIRS: 21005,
  BEDS: 20074,
  BEDSIDE_TABLES: 21010,
  BOOKCASES_AND_SHELVES: 21013,
  BUFFETS_AND_SIDE_TABLES: 21011,
  CABINETS: 21014,
  DINING_CHAIRS: 20075,
  COFFEE_TABLES: 21009,
  DESKS: 20076,
  DRESSERS_AND_DRAWERS: 21015,
  ENTERTAINMENT_AND_TV_UNITS: 21012,
  MIRRORS: 20077,
  OFFICE_CHAIRS: 21006,
  OTHER_FURNITURE: 20078,
  SOFAS: 20079,
  STOOLS_AND_BAR_STOOLS: 21007,
  DINING_TABLES: 20080,
  WARDROBES: 20081,
  FURNITURE: 20073,
};

const PAGE_SIZE = 96;
const SEARCH_RADIUS = 50; // Kilometres

const fetchAllResults = async (
  pageNumber = 1,
  results = [],
  lastPageNumber = 0
) => {
  let newResultCount = 0;
  let currentPage = pageNumber;
  let currentResults = results;

  console.log(`Fetching page: ${currentPage} of ${lastPageNumber}`);

  await fetch(
    `https://www.gumtree.com.au/ws/search.json?categoryId=${CATEGORY.DINING_TABLES}&locationId=3006035&locationStr=Gold%20Coast%20Region&pageNum=${currentPage}&pageSize=${PAGE_SIZE}&radius=${SEARCH_RADIUS}&sortByName=price_desc`
  )
    .then((res) => res.json())
    .then((result) => {
      lastPageNumber = result.data.pager.lastPageNum;
      return result.data.results.resultList;
    })
    .then((listings) => {
      currentResults = currentResults.concat(listings);
      newResultCount = listings.length;
    });

  // TODO: If there are more results attempt to fetch the next page. If there are 0 results then just return what we have gathered.

  if (lastPageNumber !== currentPage) {
    return fetchAllResults(currentPage + 1, currentResults, lastPageNumber);
  }

  return Promise.resolve(currentResults);
};

const tapLog = (data) => {
  console.log(data);
  return data;
};

fetchAllResults().then((results) => {
  const filteredResults = results
    .filter((result) => !isNaN(parseInt(result.priceText.replace("$", ""))))
    .map((result) => parseInt(result.priceText.replace("$", "")));

  const priceTotals = filteredResults.reduce((result, currentPrice) => {
    return (result += parseInt(currentPrice));
  }, 0);

  console.log(`Total of Listed Items: `, priceTotals);
  console.log(`Average Listing Price: `, priceTotals / filteredResults.length);
  console.log(`Total Listings: `, filteredResults.length);
});
