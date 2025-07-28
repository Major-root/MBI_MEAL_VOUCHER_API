class APIFeatures {
  constructor(queryParams) {
    this.queryParams = queryParams;
    this.options = {
      where: {},
      order: [["createdAt", "DESC"]],
    };
  }

  filter() {
    const queryObj = { ...this.queryParams };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    for (let key in queryObj) {
      if (typeof queryObj[key] === "object") {
        for (let operator in queryObj[key]) {
          const sequelizeOp = `$${operator}`;
          this.options.where[key] = {
            ...this.options.where[key],
            [sequelizeOp]: queryObj[key][operator],
          };
        }
      } else {
        this.options.where[key] = queryObj[key];
      }
    }

    return this;
  }

  sort() {
    if (this.queryParams.sort) {
      const sortFields = this.queryParams.sort.split(",").map((field) => {
        if (field.startsWith("-")) return [field.substring(1), "DESC"];
        return [field, "ASC"];
      });
      this.options.order = sortFields;
    }

    return this;
  }

  limitFields() {
    if (this.queryParams.fields) {
      this.options.attributes = this.queryParams.fields.split(",");
    }

    return this;
  }

  paginate() {
    const page = parseInt(this.queryParams.page, 10) || 1;
    const limit = parseInt(this.queryParams.limit, 10) || 10;
    const offset = (page - 1) * limit;

    this.options.limit = limit;
    this.options.offset = offset;

    return this;
  }

  build() {
    return this.options;
  }
}

module.exports = APIFeatures;
