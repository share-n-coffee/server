module.exports = (req, totalQuantity) => {
  const page = +req.pagination.page;
  const limit = +req.pagination.limit;
  const skip = page * limit;

  const baseUrl = `${req.protocol}://${req.get('host') + req.baseUrl}`;
  console.log(`baseUrl: ${baseUrl}`);

  console.log('-=-=-=-=-=-=-=-=-');
  const query = Object.keys(req.query)
    .map(key => `${key}=${req.query[key]}`)
    .join('&');
  console.log(query);
  Object.keys(req.query).forEach(el => {
    console.log(el);
  });
  console.log('-=-=-=-=-=-=-=-=-');

  req.pagination.pages = {};

  if (totalQuantity - (page + 1) * limit > 0) {
    req.pagination.pages.nextPage = `${baseUrl}?page=${page +
      1}&limit=${limit}&${query}`;
  }

  if (page > 0) {
    req.pagination.pages.prevPage = `${baseUrl}?page=${page -
      1}&limit=${limit}&${query}`;
  }

  console.log(`nextPage: ${req.pagination.pages.nextPage}`);
  console.log(`prevPage: ${req.pagination.pages.prevPage}`);
  console.log(req.pagination.pages);

  return {
    skip,
    limit
  };
};
