module.exports = (req, res, next) => {
  req.sorting = {};
  req.fields = null;

  console.log(req.query);

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

  console.log(req.query);

  next();
};
