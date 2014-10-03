describe('group', function() {

  var metadata, crossfilter, dimension1, dimension2, dimension3, group1, group2, group3;

  beforeEach(function() {
    metadata = getCube();
    crossfilter = crossfilterServer(metadata);
    dimension1 = crossfilter.dimension(function(d) { return d[getTestDim().dim1]; });
    dimension2 = crossfilter.dimension(function(d) { return d[getTestDim().dim2]; });
    dimension3 = crossfilter.dimension(function(d) { return d[getTestDim().dim3]; });
    group1 = dimension1.group();
    group2 = dimension2.group();
    group3 = dimension3.group();
  });

  describe('constructor', function() {
    it('should return a group object', function() {
      expect(typeof group1).toEqual("object");
      expect(typeof group1.all).toEqual("function");
    });
  });

  describe('all', function() {
    it('should return the right values for the dimension, when no filter applied to other dimensions', function() {
      expect(group2.all()).toEqual(getTestData().noFilter.group2All);
    });

    it('should return the right values for the dimension, when filter applied to other dimensions', function() {
      dimension1.filter(getTestFilters().dim1.range.in);
      expect(group2.all()).toEqual(getTestData().dim1filterRange.group2All);

      dimension3.filter(getTestFilters().dim3.value);
      expect(group2.all()).toEqual(getTestData().dim1filterRangeAndDim3filterVal.group2All);
    });
  });

  describe('size', function() {
    it('should return the number of members in the group', function() {
      expect(group1.size()).toEqual(metadata.dimensions[getTestDim().dim1].members.length);
      expect(group2.size()).toEqual(metadata.dimensions[getTestDim().dim2].members.length);
      expect(group3.size()).toEqual(metadata.dimensions[getTestDim().dim3].members.length);
    });
  });

  describe('top (with orders)', function() {
    it('should return top k data according to the set order', function() {
      var metadataOrder = getCubeOrder();
      var crossfilterOrder = crossfilterServer(metadataOrder);
      var dimensionOrder = crossfilterOrder.dimension(function(d) { return d[getTestDim().dim2]; });
      var groupOrder = dimensionOrder.group();

      // test natural top
      expect(groupOrder.top(3)).toEqual(getTestData().noFilter.group2Top3NoOrder);
      // test reversed sort
      groupOrder.order(function (d) { return -d; });
      expect(groupOrder.top(3)).toEqual(getTestData().noFilter.group2Top3OrderDesc);
      // test reset to natural sort
      groupOrder.orderNatural();
      expect(groupOrder.top(3)).toEqual(getTestData().noFilter.group2Top3NoOrder);
    });
  });

});
