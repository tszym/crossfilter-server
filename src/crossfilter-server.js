/**

## Crossfilter Server

Everything in Crossfilter Server is scoped under the `crossfilterServer`
namespace, which is also the [constructor](#crossfilterServer).

### crossfilterServer(*metadata*)

Constructs a new crossfilterServer. A CrossfilterServer represents a
multi-dimensional dataset **stored and queried server side**.

It is initialized with metadata describing the cube we will query,
following this format:

```js
metadata = {
  api : APIObject,
  schema : "<schemaId>",
  cube : "<cubeId>",
  measure : "<mesureId>",
  dimensions : {
    <dim1Id> : {
      hierarchy : "<hierarchyId>",
      level : <levelIntId>,
      members : ["<member1Id>", "<member2Id>", "<member3Id>", ...]
    },
    <dim2Id> : {
      ...
    }
  }
}
```

Note that you will pass a reference to an API Object that will allow
`crossfilterServer` to query the server. This API should implement the
same interfaces as [solap4py-js](https://github.com/loganalysis/solap4py-js)
for this class to work. You can also rewrite the function `getData()`
to adapt it to your own API.

**/

function crossfilterServer(metadata) {

  var api = metadata.api;
  var dimensions = metadata.dimensions;

  // check validity of metadata
  if (typeof api              != "object" ||
      typeof metadata.schema  != "string" ||
      typeof metadata.cube    != "string" ||
      typeof metadata.measure != "string" ||
      typeof dimensions       != "object" ||
      Object.keys(dimensions).length < 1)
  {
    throw "Metadata are malformed";
  }

  var crossfilterServerObj = {
    dimension: dimension,
    groupAll: groupAll,
    size: size
  };

  // this will store the filters
  var filters = {};

  // this will store the datasets for each group
  var datasets = {};

  /**
   * Empty the stored datasets
   * @private
   */
  function emptyDatasets() {
    for (var dim in datasets) {
      delete datasets[dim];
    }
  }

  /**
   * Get current slice for a dimension
   * @private
   */
  function getSlice(dimensionName) {
    if (typeof filters[dimensionName] != "undefined") {
      return filters[dimensionName];
    }
    else {
      return dimensions[dimensionName].members;
    }
  }

  /*
   * get data for this dimension
   * @param {String} [dimensionName=null] - dimension that won't be filtered
   * @param {Boolean} [dice=true] - dice the dimension `dimensionName`
   * @private
   */
  function getData(dimensionName, dice) {
    dimensionName = (dimensionName === undefined || dimensionName === null) ? "_all" : dimensionName;
    dice          = (dice          === undefined) ? true : dice;

    if (typeof datasets[dimensionName] == "undefined") {

      // init query
      api.clear();
      api.drill(metadata.cube);
      api.push(metadata.measure);

      // Slice cube according to current slices + filters (exect current dim. filters)
      for (var dim in dimensions) {
        if (dim == dimensionName)
          api.slice(dimensions[dim].hierarchy, dimensions[dimensionName].members);
        else
          api.slice(dimensions[dim].hierarchy, getSlice(dim));
      }

      // Dice on current dimension
      if (dimensionName != "_all" && dice)
        api.dice([dimensions[dimensionName].hierarchy]);

      // run query & format data like CF does & sort by key
      datasets[dimensionName] = api.execute().map(function(d) {
        return {
          "key" : d[dimensionName],
          "value" : d[metadata.measure]
        };
      }).sort(function (a, b) {
        if (a.key > b.key) {
          return 1;
        } else {
          return -1;
        }
      });
    }

    return datasets[dimensionName];
  }


  /**
  ### crossfilterServer.size()

  Returns the number of records in the crossfilterServer, independent of
  any filters.
  **/
  function size() {
    out = 1;
    for (var dim in dimensions) {
      out *= dimensions[dim].members.length;
    }
    return out;
  }

  /**
  ### crossfilterServer.groupAll()

  A convenience function for grouping all records and reducing to a single
  value. See **dimension.groupAll** for details.

  **Note:** unlike a dimension's groupAll, this grouping observes all current
  filters.

  **Not implemented yet**
  **/
  function groupAll() {

    // reducing does nothing because currently we can't choose how the database will aggregate data
    var groupAllObj = {
      reduce:      function () { return groupAllObj; },
      reduceCount: function () { return groupAllObj; },
      reduceSum:   function () { return groupAllObj; },
      dispose:     function () {},
      value:       function () { return getData(null, false)[0].value; }
    };

    return groupAllObj;
  }

  ////////////////////////////////////////
  // import "dimension.js"
  ////////////////////////////////////////

  // importTest "crossfilter-server-test-accessors.js"

  return crossfilterServerObj;
}
