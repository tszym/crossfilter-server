describe('dimension', function() {

  var metadata, dimensionName, crossfilter, dimension;

  beforeEach(function() {
    metadata = getCube();
    dimensionName = getTestDim().dim1;
    crossfilter = crossfilterServer(metadata);
    dimension = crossfilter.dimension(function(d) { return d[dimensionName]; });
  });

  describe('constructor', function() {
    it('should return a dimension object', function() {
      expect(typeof dimension).toEqual("object");
      expect(typeof dimension.filter).toEqual("function");
    });
  });

  describe('get name', function() {
    it('should return the good name', function () {
      expect(dimension.getDimensionName()).toEqual(dimensionName);
    });
  });

  describe('filters & getSlice functions', function() {

    it('should not have any filter at first', function() {
      expect(dimension.getFilters() === [] || dimension.getFilters() === undefined || dimension.getFilters() == metadata.dimensions[dimensionName].members).toBeTruthy();
      expect(crossfilter.getSlice(dimensionName)).toEqual(metadata.dimensions[dimensionName].members);
    });

    it('should be able to filter all', function() {
      expect(dimension.filter(null).getFilters()).toEqual(dimension.filterAll().getFilters());
      expect(dimension.filter(null).getFilters()).toEqual(metadata.dimensions[dimensionName].members);
      expect(crossfilter.getSlice(dimensionName)).toEqual(metadata.dimensions[dimensionName].members);
    });

    it('should be able to filter a range', function() {
      var range = getTestFilters().dim1.range.in;
      var expectedFilter = getTestFilters().dim1.range.out;

      expect(dimension.filter(range).getFilters()).toEqual(dimension.filterRange(range).getFilters());
      expect(dimension.filter(range).getFilters()).toEqual(expectedFilter);
      expect(crossfilter.getSlice(dimensionName)).toEqual(expectedFilter);
    });

    it('should be able to filter with a function', function() {
      var selector = getTestFilters().dim1.function.in;
      var expectedFilter = getTestFilters().dim1.function.out;

      expect(dimension.filter(selector).getFilters()).toEqual(dimension.filterFunction(selector).getFilters());
      expect(dimension.filter(selector).getFilters()).toEqual(expectedFilter);
      expect(crossfilter.getSlice(dimensionName)).toEqual(expectedFilter);
    });

    it('should be able to filter a single value', function() {
      var selector = getTestFilters().dim1.value;

      expect(dimension.filter(selector).getFilters()).toEqual(dimension.filterExact(selector).getFilters());
      expect(dimension.filter(selector).getFilters()).toEqual([selector]);
      expect(crossfilter.getSlice(dimensionName)).toEqual([selector]);
    });
  });

  describe('group all', function() {

    it('return the sum of all value when no filter applied', function() {
      expect(dimension.groupAll().value()).toEqual(getTestData().groupAll);
    });

    it('return the sum of the filtered values', function() {
      var dimension2 = crossfilter.dimension(function(d) { return d[getTestDim().dim2]; });
      dimension.filter(getTestFilters().dim1.range.in);
      expect(dimension2.groupAll().value()).toEqual(getTestData().dim1filterRange.dim2groupAll);
    });

  });

});
