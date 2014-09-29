function copyArray(arr) {
  return arr.slice(0, Infinity);
}

function copyObject(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function getData(cube, measures, hierarchies) {
  var out = [{}];

  // init to a list of measures with values (case with no dice)
  copyArray(measures).forEach(function(d) {
    out[0][d] = 42;
  });

  // for each hier, if dice
  hierarchies.forEach(function (hier) {
    if (hierarchies[hier].dice) {
      out = out.map(function(d) {
        var tmp = copyArray(hierarchies[hier].members).map(function(m) {
          d = copyObject(d);
          d[hier] = m;
          return d;
        });
        return tmp;
      });
      out = [].concat.apply([], out);
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
      this.measures.push(idMeasure);
    },
    pull : function(idMeasure) {
      delete this.measures[idMeasure];
    },
    slice : function(idHierarchy, members, range) {
      range = range || false;
      this.hierarchies[idHierarchy] = {"members" : members, "range" : range, "dice" : false};
    },
    dice : function(hierarchies) {
      this.hierarchies[idHierarchy].dice = true;
    },
    project : function(idHierarchy) {
      delete this.hierarchies[idHierarchy];
    },
    execute : function() {
      return getData(cube, measures, hierarchies);
    },
    clear : function() {
      cube = null;
      measures = [];
      hierarchies = {};
    },
  };
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
