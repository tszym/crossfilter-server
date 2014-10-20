function copyArray(arr) {
  return arr.slice(0, Infinity);
}

function copyObject(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function getN() {
  var n = 1;
  var dims = getCube().dimensions;
  for (var d in dims) {
    n *= dims[d].members.length;
  }
  return n;
}

function getHierarchyDimension(hier) {
  var dims = getCube().dimensions;
  for (var dim in dims) {
    if (dims[dim].hierarchy == hier)
      return dim;
  }
}

function getHierarchyMembers(hier) {
  return getCube().dimensions[getHierarchyDimension(hier)].members;
}

function getData2(cube, measures, hierarchies) {
  return [{"[Measures].[Goods unloaded ktons]":3,"[Modes of Transport]":"[Modes of Transport.Name].[All Modes of Transport.Names].[Air]"},
          {"[Measures].[Goods unloaded ktons]":2,"[Modes of Transport]":"[Modes of Transport.Name].[All Modes of Transport.Names].[Inland Waterway]"},
          {"[Measures].[Goods unloaded ktons]":4,"[Modes of Transport]":"[Modes of Transport.Name].[All Modes of Transport.Names].[Rail]"},
          {"[Measures].[Goods unloaded ktons]":1,"[Modes of Transport]":"[Modes of Transport.Name].[All Modes of Transport.Names].[Road]"},
          {"[Measures].[Goods unloaded ktons]":6,"[Modes of Transport]":"[Modes of Transport.Name].[All Modes of Transport.Names].[Shortsea Shipping and Inland Waterway]"},
          {"[Measures].[Goods unloaded ktons]":5,"[Modes of Transport]":"[Modes of Transport.Name].[All Modes of Transport.Names].[Shortsea Shipping]"}];
}

function getData(cube, measures, hierarchies) {
  var out = [{}];
  // init to a list of measures with values (case with no dice)
  measures.forEach(function(d) {
    out[0][d] = getN();
  });

  // for each hier
  Object.keys(hierarchies).forEach(function (hier) {

    var n = getHierarchyMembers(hier).length;

    // if we dice, split the value of the measures for each member
    if (hierarchies[hier].dice) {
      out = out.map(function(d) {
        var tmp = copyArray(hierarchies[hier].members).map(function(member) {
          di = copyObject(d);
          measures.forEach(function(mes) {
            di[mes] = di[mes]/n;
          });
          di[getHierarchyDimension(hier)] = member;
          return di;
        });
        return tmp;
      });

      out = [].concat.apply([], out);
    }
    // if we don't dice, just remove the values of members not in the filter
    else {
      var nFiltered = hierarchies[hier].members.length;

      out = out.map(function(d) {
        d = copyObject(d);
        measures.forEach(function(mes) {
          d[mes] = d[mes]*nFiltered/n;
        });
        return d;
      });
    }
  });

  return out;
}

function getAPI() {
  return {
    cube : null,
    measures : [],
    hierarchies : {},

    drill : function(idCube) {
      this.cube = idCube;
    },
    push : function(idMeasure) {
      if (this.measures.indexOf(idMeasure) < 0)
        this.measures.push(idMeasure);
    },
    pull : function(idMeasure) {
      index = this.measures.indexOf(idMeasure);
      if (index != -1) {
        this.measures.splice(index, 1);
      }
    },
    slice : function(idHierarchy, members, range) {
      range = range || false;
      this.hierarchies[idHierarchy] = {"members" : members, "range" : range, "dice" : false};
    },
    dice : function(hierarchies) {
      for (var i = 0; i < hierarchies.length; i++) {
        if (typeof this.hierarchies[hierarchies[i]] != "undefined")
          this.hierarchies[hierarchies[i]].dice = true;
      }
    },
    project : function(idHierarchy) {
      delete this.hierarchies[idHierarchy];
    },
    execute : function() {
      return getData(this.cube, this.measures, this.hierarchies);
    },
    clear : function() {
      this.cube = null;
      this.measures = [];
      this.hierarchies = {};
    },
  };
}

function getAPIOrder() {
  var api = getAPI();
  api.execute = function () {
    return getData2(this.cube, this.measures, this.hierarchies);
  };
  return api;
}

function getCube() {
  return {
    "api" : getAPI(),
    "schema" : "Olap",
    "cube" : "[Loading]",
    "measures" : ["[Measures].[Goods unloaded ktons]", "[Measures].[Goods loaded ktons]"],
    "dimensions" : {
      "[Modes of Transport]" : {
        "hierarchy" : "[Modes of Transport.Name]",
        "level" : 1,
        "members" : ["[Modes of Transport.Name].[All Modes of Transport.Names].[Air]", "[Modes of Transport.Name].[All Modes of Transport.Names].[Inland Waterway]", "[Modes of Transport.Name].[All Modes of Transport.Names].[Rail]", "[Modes of Transport.Name].[All Modes of Transport.Names].[Road]", "[Modes of Transport.Name].[All Modes of Transport.Names].[Shortsea Shipping and Inland Waterway]", "[Modes of Transport.Name].[All Modes of Transport.Names].[Shortsea Shipping]"]
      },
      "[Time]" : {
        "hierarchy" : "[Time]",
        "level" : 1,
        "members" : ["[Time].[All Times].[1982]", "[Time].[All Times].[1983]", "[Time].[All Times].[1984]", "[Time].[All Times].[1985]", "[Time].[All Times].[1986]", "[Time].[All Times].[1987]", "[Time].[All Times].[1988]", "[Time].[All Times].[1989]", "[Time].[All Times].[1990]", "[Time].[All Times].[1991]", "[Time].[All Times].[1992]", "[Time].[All Times].[1993]", "[Time].[All Times].[1994]", "[Time].[All Times].[1995]", "[Time].[All Times].[1996]", "[Time].[All Times].[1997]", "[Time].[All Times].[1998]", "[Time].[All Times].[1999]", "[Time].[All Times].[2000]", "[Time].[All Times].[2001]", "[Time].[All Times].[2002]", "[Time].[All Times].[2003]", "[Time].[All Times].[2004]", "[Time].[All Times].[2005]", "[Time].[All Times].[2006]", "[Time].[All Times].[2007]", "[Time].[All Times].[2008]", "[Time].[All Times].[2009]", "[Time].[All Times].[2010]", "[Time].[All Times].[2011]", "[Time].[All Times].[2012]", "[Time].[All Times].[2013]", "[Time].[All Times].[2014]", "[Time].[All Times].[2015]"]
      },
      "[Zone]" : {
        "hierarchy" : "[Zone.Name]",
        "level" : 1,
        "members" : ["[Zone.Name].[All Zone.Names].[Austria]", "[Zone.Name].[All Zone.Names].[Belgium]", "[Zone.Name].[All Zone.Names].[Bulgaria]", "[Zone.Name].[All Zone.Names].[Croatia]", "[Zone.Name].[All Zone.Names].[Cyprus]", "[Zone.Name].[All Zone.Names].[Czech Republic]", "[Zone.Name].[All Zone.Names].[Denmark]", "[Zone.Name].[All Zone.Names].[Estonia]", "[Zone.Name].[All Zone.Names].[Finland]", "[Zone.Name].[All Zone.Names].[France]", "[Zone.Name].[All Zone.Names].[Germany]", "[Zone.Name].[All Zone.Names].[Greece]", "[Zone.Name].[All Zone.Names].[Hungary]", "[Zone.Name].[All Zone.Names].[Iceland]", "[Zone.Name].[All Zone.Names].[Ireland]", "[Zone.Name].[All Zone.Names].[Italy]", "[Zone.Name].[All Zone.Names].[Latvia]", "[Zone.Name].[All Zone.Names].[Liechtenstein]", "[Zone.Name].[All Zone.Names].[Lithuania]", "[Zone.Name].[All Zone.Names].[Luxembourg]", "[Zone.Name].[All Zone.Names].[Malta]", "[Zone.Name].[All Zone.Names].[Netherlands]", "[Zone.Name].[All Zone.Names].[Norway]", "[Zone.Name].[All Zone.Names].[Poland]", "[Zone.Name].[All Zone.Names].[Portugal]", "[Zone.Name].[All Zone.Names].[Romania]", "[Zone.Name].[All Zone.Names].[Slovakia]", "[Zone.Name].[All Zone.Names].[Slovenia]", "[Zone.Name].[All Zone.Names].[Spain]", "[Zone.Name].[All Zone.Names].[Sweden]", "[Zone.Name].[All Zone.Names].[Switzerland]", "[Zone.Name].[All Zone.Names].[The former Yugoslav Republic of Macedonia]", "[Zone.Name].[All Zone.Names].[Turkey]", "[Zone.Name].[All Zone.Names].[United Kingdom]"]
      }
    }
  };
}

function reduceInitial(p, v) {
  return {"[Measures].[Goods unloaded ktons]" : 0, "[Measures].[Goods loaded ktons]" : 0};
}

function reduceRemove() {
  p["[Measures].[Goods unloaded ktons]"]       -= v["[Measures].[Goods unloaded ktons]"];
  p["[Measures].[Goods unloadedloaded ktons]"] -= v["[Measures].[Goods loaded ktons]"];
  return p;
}

function reduceAdd(p, v) {
  p["[Measures].[Goods unloaded ktons]"]       += v["[Measures].[Goods unloaded ktons]"];
  p["[Measures].[Goods unloadedloaded ktons]"] += v["[Measures].[Goods loaded ktons]"];
  return p;
}

function getCubeOrder() {
  var cube = getCube();
  cube.api = getAPIOrder();
  return cube;
}

function getTestDim() {
  return {
    dim1: "[Time]",
    dim2: "[Modes of Transport]",
    dim3: "[Zone]"
  };
}

function getTestFilters() {
  return {
    dim1: {
      range: {
        in:  ["[Time].[All Times].[1982]", "[Time].[All Times].[1984]"],
        out: ["[Time].[All Times].[1982]", "[Time].[All Times].[1983]", "[Time].[All Times].[1984]"]
      },
      function: {
        in:  function(d) { return d[23] == "0"; },
        out: ['[Time].[All Times].[1990]', '[Time].[All Times].[2000]', '[Time].[All Times].[2010]']
      },
      value: "[Time].[All Times].[1986]"
    },
    dim3: {
      value: "[Zone.Name].[All Zone.Names].[France]"
    }
  };
}

function getTestData() {
  return {
    groupAll: getN(),
    noFilter: {
      group2AllReduce : [{"key":"[Modes of Transport.Name].[All Modes of Transport.Names].[Air]","value":{"[Measures].[Goods unloaded ktons]":1156,"[Measures].[Goods loaded ktons]":1156}},
                         {"key":"[Modes of Transport.Name].[All Modes of Transport.Names].[Inland Waterway]","value":{"[Measures].[Goods unloaded ktons]":1156,"[Measures].[Goods loaded ktons]":1156}},
                         {"key":"[Modes of Transport.Name].[All Modes of Transport.Names].[Rail]","value":{"[Measures].[Goods unloaded ktons]":1156,"[Measures].[Goods loaded ktons]":1156}},
                         {"key":"[Modes of Transport.Name].[All Modes of Transport.Names].[Road]","value":{"[Measures].[Goods unloaded ktons]":1156,"[Measures].[Goods loaded ktons]":1156}},
                         {"key":"[Modes of Transport.Name].[All Modes of Transport.Names].[Shortsea Shipping and Inland Waterway]","value":{"[Measures].[Goods unloaded ktons]":1156,"[Measures].[Goods loaded ktons]":1156}},
                         {"key":"[Modes of Transport.Name].[All Modes of Transport.Names].[Shortsea Shipping]","value":{"[Measures].[Goods unloaded ktons]":1156,"[Measures].[Goods loaded ktons]":1156}}],
      group2All : [{key: '[Modes of Transport.Name].[All Modes of Transport.Names].[Air]', value: 1156 },
                   {key: '[Modes of Transport.Name].[All Modes of Transport.Names].[Inland Waterway]', value: 1156 },
                   {key: '[Modes of Transport.Name].[All Modes of Transport.Names].[Rail]', value: 1156 },
                   {key: '[Modes of Transport.Name].[All Modes of Transport.Names].[Road]', value: 1156 },
                   {key: '[Modes of Transport.Name].[All Modes of Transport.Names].[Shortsea Shipping and Inland Waterway]', value: 1156 },
                   {key: '[Modes of Transport.Name].[All Modes of Transport.Names].[Shortsea Shipping]', value: 1156 } ],
      group2Top3NoOrder : [{"key":"[Modes of Transport.Name].[All Modes of Transport.Names].[Shortsea Shipping and Inland Waterway]","value":6},
                           {"key":"[Modes of Transport.Name].[All Modes of Transport.Names].[Shortsea Shipping]","value":5},
                           {"key":"[Modes of Transport.Name].[All Modes of Transport.Names].[Rail]","value":4}],
      group2Top3OrderDesc : [{"key":"[Modes of Transport.Name].[All Modes of Transport.Names].[Road]","value":1},
                             {"key":"[Modes of Transport.Name].[All Modes of Transport.Names].[Inland Waterway]","value":2},
                             {"key":"[Modes of Transport.Name].[All Modes of Transport.Names].[Air]","value":3}]
    },
    dim1filterRange: {
      dim2groupAll : 612,
      group2All : [{key: '[Modes of Transport.Name].[All Modes of Transport.Names].[Air]', value: 102 },
                   {key: '[Modes of Transport.Name].[All Modes of Transport.Names].[Inland Waterway]', value: 102 },
                   {key: '[Modes of Transport.Name].[All Modes of Transport.Names].[Rail]', value: 102 },
                   {key: '[Modes of Transport.Name].[All Modes of Transport.Names].[Road]', value: 102 },
                   {key: '[Modes of Transport.Name].[All Modes of Transport.Names].[Shortsea Shipping and Inland Waterway]', value: 102 },
                   {key: '[Modes of Transport.Name].[All Modes of Transport.Names].[Shortsea Shipping]', value: 102 } ]
    },
    dim1filterRangeAndDim3filterVal: {
      group2All : [{key: '[Modes of Transport.Name].[All Modes of Transport.Names].[Air]', value: 3 },
                   {key: '[Modes of Transport.Name].[All Modes of Transport.Names].[Inland Waterway]', value: 3 },
                   {key: '[Modes of Transport.Name].[All Modes of Transport.Names].[Rail]', value: 3 },
                   {key: '[Modes of Transport.Name].[All Modes of Transport.Names].[Road]', value: 3 },
                   {key: '[Modes of Transport.Name].[All Modes of Transport.Names].[Shortsea Shipping and Inland Waterway]', value: 3 },
                   {key: '[Modes of Transport.Name].[All Modes of Transport.Names].[Shortsea Shipping]', value: 3 } ]
    }
  };
}
