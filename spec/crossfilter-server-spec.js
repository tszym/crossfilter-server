describe('crossfilterServer', function() {
  var metadata, dimensionName, crossfilter;

  beforeEach(function() {
    metadata = getCube();
    dimensionName = getTestDim().dim1;
    crossfilter = crossfilterServer(metadata);
  });

  describe('constructor', function() {
    it('should return a crossfilter object', function() {
      expect(typeof crossfilter).toEqual("object");
      expect(typeof crossfilter.dimension).toEqual("function");
    });
  });

  describe('size', function() {
    it('counts the number of records', function() {
      var count = crossfilter.size();
      expect(count).toBe(getN());
    });
  });

  describe('getSlice', function() {
    it('return the list of members if without filters', function() {
      expect(crossfilter.getSlice(dimensionName)).toEqual(metadata.dimensions[dimensionName].members);
    });
  });

  describe('groupAll', function() {
    it('return the sum of all value', function() {
      expect(crossfilter.groupAll().value()).toEqual(getTestData().groupAll);
    });
  });

});