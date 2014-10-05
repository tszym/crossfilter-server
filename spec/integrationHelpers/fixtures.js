function getN() {
  var n = 1;
  var dims = getCube().dimensions;
  for (var d in dims) {
    n *= dims[d].members.length;
  }
  return n;
}

function getAPI() {
  return {
    queryAPI : new QueryAPI(),

    drill : function(idCube) {
      this.queryAPI.drill(idCube);
    },

    push : function(idMeasure) {
      this.queryAPI.push(idMeasure);
    },

    pull : function(idMeasure) {
      this.queryAPI.pull(idMeasure);
    },

    slice : function(idHierarchy, members, range) {
      this.queryAPI.slice(idHierarchy, members, range);
    },

    dice : function (hierarchies) {
      this.queryAPI.dice(hierarchies);
    },

    project : function(idHierarchy) {
      this.queryAPI.project(idHierarchy);
    },

    filter : function(idHierarchy, members, range) {
      this.queryAPI.filter(idHierarchy, members, range);
    },

    execute : function() {
      return this.queryAPI.execute().data;
    },

    clear : function() {
      this.queryAPI.clear();
    }
  };
}

function getAPIOrder() {
  return getAPI();
}

function getCube() {
  return {
    "api" : getAPI(),
    "schema" : "Olap",
    "cube" : "[Loading]",
    "measure" : "[Measures].[Goods unloaded ktons]",
    "dimensions" : {
      "[Modes of Transport]" : {
        "hierarchy" : "[Modes of Transport.Name]",
        "level" : 0,
        "members" : ["[Modes of Transport.Name].[All Modes of Transport.Names].[Air]", "[Modes of Transport.Name].[All Modes of Transport.Names].[Inland Waterway]", "[Modes of Transport.Name].[All Modes of Transport.Names].[Rail]", "[Modes of Transport.Name].[All Modes of Transport.Names].[Road]", "[Modes of Transport.Name].[All Modes of Transport.Names].[Shortsea Shipping and Inland Waterway]", "[Modes of Transport.Name].[All Modes of Transport.Names].[Shortsea Shipping]"]
      },
      "[Time]" : {
        "hierarchy" : "[Time]",
        "level" : 0,
        "members" : ["[Time].[All Times].[1982]", "[Time].[All Times].[1983]", "[Time].[All Times].[1984]", "[Time].[All Times].[1985]", "[Time].[All Times].[1986]", "[Time].[All Times].[1987]", "[Time].[All Times].[1988]", "[Time].[All Times].[1989]", "[Time].[All Times].[1990]", "[Time].[All Times].[1991]", "[Time].[All Times].[1992]", "[Time].[All Times].[1993]", "[Time].[All Times].[1994]", "[Time].[All Times].[1995]", "[Time].[All Times].[1996]", "[Time].[All Times].[1997]", "[Time].[All Times].[1998]", "[Time].[All Times].[1999]", "[Time].[All Times].[2000]", "[Time].[All Times].[2001]", "[Time].[All Times].[2002]", "[Time].[All Times].[2003]", "[Time].[All Times].[2004]", "[Time].[All Times].[2005]", "[Time].[All Times].[2006]", "[Time].[All Times].[2007]", "[Time].[All Times].[2008]", "[Time].[All Times].[2009]", "[Time].[All Times].[2010]", "[Time].[All Times].[2011]", "[Time].[All Times].[2012]", "[Time].[All Times].[2013]", "[Time].[All Times].[2014]", "[Time].[All Times].[2015]"]
      },
      "[Zone]" : {
        "hierarchy" : "[Zone.Name]",
        "level" : 0,
        "members" : ["[Zone.Name].[All Zone.Names].[Austria]", "[Zone.Name].[All Zone.Names].[Belgium]", "[Zone.Name].[All Zone.Names].[Bulgaria]", "[Zone.Name].[All Zone.Names].[Croatia]", "[Zone.Name].[All Zone.Names].[Cyprus]", "[Zone.Name].[All Zone.Names].[Czech Republic]", "[Zone.Name].[All Zone.Names].[Denmark]", "[Zone.Name].[All Zone.Names].[Estonia]", "[Zone.Name].[All Zone.Names].[Finland]", "[Zone.Name].[All Zone.Names].[France]", "[Zone.Name].[All Zone.Names].[Germany]", "[Zone.Name].[All Zone.Names].[Greece]", "[Zone.Name].[All Zone.Names].[Hungary]", "[Zone.Name].[All Zone.Names].[Iceland]", "[Zone.Name].[All Zone.Names].[Ireland]", "[Zone.Name].[All Zone.Names].[Italy]", "[Zone.Name].[All Zone.Names].[Latvia]", "[Zone.Name].[All Zone.Names].[Liechtenstein]", "[Zone.Name].[All Zone.Names].[Lithuania]", "[Zone.Name].[All Zone.Names].[Luxembourg]", "[Zone.Name].[All Zone.Names].[Malta]", "[Zone.Name].[All Zone.Names].[Netherlands]", "[Zone.Name].[All Zone.Names].[Norway]", "[Zone.Name].[All Zone.Names].[Poland]", "[Zone.Name].[All Zone.Names].[Portugal]", "[Zone.Name].[All Zone.Names].[Romania]", "[Zone.Name].[All Zone.Names].[Slovakia]", "[Zone.Name].[All Zone.Names].[Slovenia]", "[Zone.Name].[All Zone.Names].[Spain]", "[Zone.Name].[All Zone.Names].[Sweden]", "[Zone.Name].[All Zone.Names].[Switzerland]", "[Zone.Name].[All Zone.Names].[The former Yugoslav Republic of Macedonia]", "[Zone.Name].[All Zone.Names].[Turkey]", "[Zone.Name].[All Zone.Names].[United Kingdom]"]
      }
    }
  };
}

function getCubeOrder() {
  return getCube();
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
        in:  ["[Time].[All Times].[2000]", "[Time].[All Times].[2002]"],
        out: ["[Time].[All Times].[2000]", "[Time].[All Times].[2001]", "[Time].[All Times].[2002]"]
      },
      function: {
        in:  function(d) { return d[23] == "0"; },
        out: ['[Time].[All Times].[1990]', '[Time].[All Times].[2000]', '[Time].[All Times].[2010]']
      },
      value: "[Time].[All Times].[2002]"
    },
    dim3: {
      value: "[Zone.Name].[All Zone.Names].[France]"
    }
  };
}

function getTestData() {
  return {
    groupAll: 29066815,
    noFilter: {
      group2All : [{ key: '[Modes of Transport.Name].[All Modes of Transport.Names].[Air]', value: 0 },
                   { key: '[Modes of Transport.Name].[All Modes of Transport.Names].[Inland Waterway]', value: 0 },
                   { key: '[Modes of Transport.Name].[All Modes of Transport.Names].[Rail]', value: 0 },
                   { key: '[Modes of Transport.Name].[All Modes of Transport.Names].[Road]', value: 0 },
                   { key: '[Modes of Transport.Name].[All Modes of Transport.Names].[Shortsea Shipping and Inland Waterway]', value: 29066815 },
                   { key: '[Modes of Transport.Name].[All Modes of Transport.Names].[Shortsea Shipping]', value: 0 } ],
      group2Top3NoOrder : [ { key: '[Modes of Transport.Name].[All Modes of Transport.Names].[Shortsea Shipping and Inland Waterway]', value: 29066815 },
                            { key: '[Modes of Transport.Name].[All Modes of Transport.Names].[Shortsea Shipping]', value: 0 },
                            { key: '[Modes of Transport.Name].[All Modes of Transport.Names].[Road]', value: 0 } ],
      group2Top3OrderDesc : [ { key: '[Modes of Transport.Name].[All Modes of Transport.Names].[Shortsea Shipping]', value: 0 },
                              { key: '[Modes of Transport.Name].[All Modes of Transport.Names].[Road]', value: 0 },
                              { key: '[Modes of Transport.Name].[All Modes of Transport.Names].[Rail]', value: 0 } ]
    },
    dim1filterRange: {
      dim2groupAll : 5081309,
      group2All : [ { key: '[Modes of Transport.Name].[All Modes of Transport.Names].[Air]', value: 0 },
                    { key: '[Modes of Transport.Name].[All Modes of Transport.Names].[Inland Waterway]', value: 0 },
                    { key: '[Modes of Transport.Name].[All Modes of Transport.Names].[Rail]', value: 0 },
                    { key: '[Modes of Transport.Name].[All Modes of Transport.Names].[Road]', value: 0 },
                    { key: '[Modes of Transport.Name].[All Modes of Transport.Names].[Shortsea Shipping and Inland Waterway]', value: 5081309 },
                    { key: '[Modes of Transport.Name].[All Modes of Transport.Names].[Shortsea Shipping]', value: 0 } ]
    },
    dim1filterRangeAndDim3filterVal: {
      group2All : [ { key: '[Modes of Transport.Name].[All Modes of Transport.Names].[Air]', value: 0 },
                    { key: '[Modes of Transport.Name].[All Modes of Transport.Names].[Inland Waterway]', value: 0 },
                    { key: '[Modes of Transport.Name].[All Modes of Transport.Names].[Rail]', value: 0 },
                    { key: '[Modes of Transport.Name].[All Modes of Transport.Names].[Road]', value: 0 },
                    { key: '[Modes of Transport.Name].[All Modes of Transport.Names].[Shortsea Shipping and Inland Waterway]', value: 670842 },
                    { key: '[Modes of Transport.Name].[All Modes of Transport.Names].[Shortsea Shipping]', value: 0 } ]
    }
  };
}
