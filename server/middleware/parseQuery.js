module.exports = (req, res, next) => {
  req.sorting = {};
  req.fields = null;

  if (req.query.getFields) {
    req.fields = req.query.getFields.replace(/,/g, ' ');
    delete req.query.getFields;
  }

  if (req.query.sortBy) {
    req.sorting.sort = {};

    req.query.sortBy.split(',').forEach(el => {
      const parameter = el.split('_')[0];
      const sortType = el.split('_')[1];
      req.sorting.sort[parameter] = sortType;
    });

    delete req.query.sortBy;
  }

  //  Pagination
  req.pagination = {};
  req.pagination.limit = +req.query.limit || 0;
  req.pagination.skip = +req.query.page * req.pagination.limit || 0;

  delete req.query.page;
  delete req.query.limit;

  next();
};
