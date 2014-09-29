/**

## Dimension

### crossfilterServer.dimension(*dimensionFct*)

Creates and return a dimension object from the string `dimensionFct` passed as
parameter.

For example, to create a dimension of countries:

```js
var countries = payments.dimension(function(d) { return d["countries"]; });
```

Dimensions are stateful, recording the associated dimension-specific filters, if
any. Initially, no filters are applied to the dimension: all records are selected.
Since creating dimensions is expensive, you should be careful to keep a reference
to whatever dimensions you create.

**/
function dimension(dimensionFct) {

  // get dimension name
  var dimensionName = getDimensionName();

  var hierarchy = dimensions[dimensionName].hierarchy;
  var level     = dimensions[dimensionName].level;
  var members   = dimensions[dimensionName].members;

  // check existence in metadata
  if (typeof dimensionName != "string" ||
      typeof hierarchy     != "string" ||
      typeof level         != "number" ||
      !Array.isArray(members)          ||
      members.length <= 0)
  {
    throw "Dimension do not exist or malformed in declared metadata";
  }

  // returned object
  var dimensionObj = {
    filter: filter,
    filterExact: filterExact,
    filterRange: filterRange,
    filterFunction: filterFunction,
    filterAll: filterAll,
    top: top,
    bottom: bottom,
    group: group,
    groupAll: groupAll,
    dispose: dispose
  };

  /**
   * Guess the dimension name from the dimension function
   */
  function getDimensionName() {
    var dummyRecord = {};
    Object.keys(dimensions).forEach(function(d) {
      dummyRecord[d] = d;
    });

    return dimensionFct(dummyRecord);
  }

  /**
  ### crossfilterServer.dimension.filter(*value*)

  Filters records such that this dimension's value matches *value*, and returns this
  dimension. The specified *value* may be:

  * null, equivalent to **filterAll**;
  * an array, equivalent to **filterRange**;
  * a function, equivalent to **filterFunction**;
  * a single value, equivalent to **filterExact**.

  For example:

  ```js
  countries.filter(["Belgium", "France"]); // selects countries beetween "Belgium" and "France"
  countries.filter("France"); // selects records for France only
  countries.filter(function(d) { return d[0] == "A"; }); // countries starting with "A"
  countries.filter(null); // selects all countries
  ```

  Calling filter replaces the existing filter for this dimension, if any.
  **/
  function filter(range) {
    if (range === null)
      return filterAll();
    else if (Array.isArray(range))
      return filterRange(range);
    else if (typeof range === "function")
      return filterFunction(range);
    else
      return filterExact(range);
  }

  /**
  ### crossfilterServer.dimension.filterExact(*value*)

  Filters records such that this dimension's value equals *value*, and returns this
  dimension. For example:

  ```js
  countries.filterExact("France"); // selects records for France only
  ```

  Note that exact comparisons are performed using the ordering operators (`<`, `<=`,
  `>=`, `>`). For example, if you pass an exact value of null, this is equivalent to
  0; filtering does not use the `==` or `===` operator.

  Calling filterExact replaces the existing filter on this dimension, if any.
  **/
  function filterExact(value) {
    emptyDatasets();
    return filterFunction(function(d) {
      return d == value;
    });
  }

  /**
  ### crossfilterServer.dimension.filterRange(*range*)

  Filters records such that this dimension's value is greater than or equal to *range[0]*,
  and less than *range[1]*, returning this dimension. For example:

  ```js
  countries.filterRange(["Belgium", "France"]); // selects countries beetween "Belgium" and "France"
  ```

  Calling filterRange replaces the existing filter on this dimension, if any.
  **/
  function filterRange(range) {
    emptyDatasets();
    return filterFunction(function(d) {
      return d >= range[0] && d <= range[1];
    });
  }

  /**
  ### crossfilterServer.dimension.filterFunction(*function*)

  Filters records such that the specified *function* returns truthy when called with this
  dimension's value, and returns this dimension. For example:

  ```js
  countries.filterFunction(function(d) { return d[0] == "A"; }); // countries starting with "A"
  ```

  This can be used to implement a UNION filter, e.g.

  ```js
  // Selects countries with name stating by "Ab" or "Ac"
  countries.filterFunction(function(d) { return d[0] == "A" && d[1] == "b" || d[1] == "c"; });
  ```
  **/
  function filterFunction(f) {
    emptyDatasets();
    filters[dimensionName] = [];
    for (i = 0; i < members.length; i++)
      if (f(members[i]))
        filters[dimensionName].push(members[i]);
    return dimensionObj;
  }

  /**
  ### crossfilterServer.dimension.filterAll()

  Clears any filters on this dimension, selecting all records and returning this dimension.
  For example:

  ```js
  countries.filterAll(); // selects all countries
  ```
  **/
  function filterAll() {
    emptyDatasets();
    filters[dimensionName] = members;
    return dimensionObj;
  }

  /**
  ### crossfilterServer.dimension.top(*k*)

  **Not implemented yet**

  Returns a new array containing the top *k* records, according to the natural order of this
  dimension. The returned array is sorted by descending natural order. This method intersects
  the crossfilter's current filters, returning only records that satisfy every active filter
  (including this dimension's filter). For example, to retrieve the top 4 payments by total:

  ```js
  var topPayments = paymentsByTotal.top(4); // the top four payments, by total
  topPayments[0]; // the biggest payment
  topPayments[1]; // the second-biggest payment
  // etc.
  ```

  If there are fewer than *k* records selected according to all of the crossfilter's filters,
  then an array smaller than *k* will be returned. For example, to retrieve all selected
  payments in descending order by total:

  ```js
  var allPayments = paymentsByTotal.top(Infinity);
  ```
  **/
  // TODO implement and rewrite doc
  function top(k) {
    throw "Not implemented yet";
  }

  /**
  ### crossfilterServer.dimension.bottom(*k*)

  **Not implemented yet**

  Returns a new array containing the bottom *k* records, according to the natural order of this
  dimension. The returned array is sorted by ascending natural order. This method intersects the
  crossfilter's current filters, returning only records that satisfy every active filter (including
  this dimension's filter). For example, to retrieve the bottom 4 payments by total:

  ```js
  var bottomPayments = paymentsByTotal.bottom(4); // the bottom four payments, by total
  bottomPayments[0]; // the smallest payment
  bottomPayments[1]; // the second-smallest payment
  // etc.
  ```
  **/
  // TODO implement and rewrite doc
  function bottom(k) {
    throw "Not implemented yet";
  }

  /**
  ### crossfilterServer.dimension.groupAll()

  This is a convenience function for grouping all records into a single group. he returned
  object is similar to a standard **group**, except it has no **top** or **order** methods.
  Instead, use **value** to retrieve the reduce value for all matching records.

  Note: a grouping intersects the crossfilter's current filters, **except for the associated
  dimension's filter**. Thus, group methods consider only records that satisfy every filter
  except this dimension's filter. So, if the crossfilter of countries is filtered by all
  dimensions of your cube other than country.

  #### crossfilterServer.dimension.groupAll.reduce(), reduceCount(), reduceSum()

  As for the groups, we can't currently choose how data is aggregated, it's the default agregate
  done by the server. So these functions does nothing.

  #### crossfilterServer.dimension.groupAll.value()

  Return the agregated value for the group.
  **/
  function groupAll() {

    // reducing does nothing because currently we can't choose how the database will aggregate data
    var groupAllObj = {
      reduce:      function () { return groupAllObj; },
      reduceCount: function () { return groupAllObj; },
      reduceSum:   function () { return groupAllObj; },
      dispose:     function () {},
      value:       function () { return getData(dimensionName, false)[0].value; }
    };

    return groupAllObj;
  }

  /**
  ### crossfilterServer.dimension.dispose()

  Removes this dimension (and its groups) from its crossfilter.
  **/
  function dispose() {
    delete filters[dimensionName];
    delete datasets[dimensionName];
  }

  ////////////////////////////////////////
  // import "group.js"
  ////////////////////////////////////////

  return dimensionObj;
}
