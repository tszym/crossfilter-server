/**
## Group

### crossfilterServer.dimension.group()

Constructs a new grouping for the given dimension, that is to say a group in which you have
one value per element of the dimension.

The group's reduce function will sum the value of the OLAP mesure selected in the metadata
passed to crossfilterServer (this reduce operation will be done server side).

For example the group that will give a datum for each country is:

```js
var countriesGroup = countries.group();
```

In the current version of crossfilter server, you can't choose how the elements are grouped,
and by default they are grouped with the identity function (that is you say same elements
are grouped together).

Note: a grouping intersects the crossfilter's current filters, **except for the associated
dimension's filter**. Thus, group methods consider only records that satisfy every filter
except this dimension's filter. So, if the crossfilter of payments is filtered by type and
total, then group by total only observes the filter by type.
**/
function group() {

  var reduceMeasures = [];

  // returned object with function accessors
  var groupObj = {
    top: top,
    all: all,
    reduce: reduce,
    reduceCount: reduceCount,
    reduceSum: reduceSum,
    order: order,
    orderNatural: orderNatural,
    size: size,
    dispose: dispose
  };
  // importTest "group-test-accessors.js"


  var sortFunc = null;

  /*
   * Get a copy of the data sorted on value accoring to the ket returned by `sortFunc`
   * (if no function defined, using identity as sort key function)
   * @private
   */
  function getDataAndSort() {
    if (sortFunc === null)
      sortFunc = function(d) { return d; };

    var out = [];
    var data = all();

    // copy data
    for (var i = 0; i < data.length; i++) {
      out[i] = data[i];
    }

    // sort copy
    out.sort(function(a, b) {
      if (sortFunc(a.value) > sortFunc(b.value))
        return -1;
      else
        return 1;
    });

    return out;
  }

  /**
  ### crossfilterServer.dimension.group.all()

  Returns the array of all groups, in ascending natural order by key. Like **top**, the returned
  objects contain `key` and `value` attributes. The returned array may also contain empty groups,
  whose value is the return value from the group's reduce *initial* function. For example, to
  count payments by type:

  ```js
  var countriesValues = countriesGroup.all();
  ```
  **/
  function all() {
    if (reduceMeasures.length > 0)
      return getData(dimensionName, true, reduceMeasures);
    else
      return getData(dimensionName, true);
  }

  /**
  ### crossfilterServer.dimension.group.top(*k*)

  Returns a new array containing the top *k* groups, according to the **group order** of the
  associated reduce value. The returned array is in descending order by reduce value. For example,
  to retrieve the top payment type by count:

  ```js
  var paymentsByType = payments.dimension(function(d) { return d.type; }),
      paymentCountByType = paymentsByType.group(),
      topTypes = paymentCountByType.top(1);
  topTypes[0].key; // the top payment type (e.g., "tab")
  topTypes[0].value; // the count of payments of that type (e.g., 8)
  ```

  If there are fewer than *k* groups according to all of the crossfilter's filters, then an array
  smaller than *k* will be returned. If there are fewer than *k* non-empty groups, this method may
  also return empty groups (those with zero selected records).
  **/
  function top(k) {
    return getDataAndSort().slice(0, k);
  }

  /**
  ### crossfilterServer.dimension.group.reduce(add, remove, initial), reduceCount(), reduceSum()

  These functions are here for compatibility with crossfilter interfaces but actually does nothing
  because currently we can't choose how the database will aggregate data.

  Currently, the agregate function is the one your API use.
  **/
  function reduce(add, remove, initial) {
    reduceMeasures = Object.keys(initial());
    return groupObj;
  }
  function reduceCount() {
    return groupObj;
  }
  function reduceSum() {
    return groupObj;
  }

  /**
  ### crossfilterServer.dimension.group.order(*sortFunction*)


  Specifies the order value for computing the **top-K** groups. The default
  order is the identity function, which assumes that the reduction values are naturally-ordered
  (such as simple counts or sums). For example, you can get the least value with:

  ```js
  var topCountry = countriesGroup.order(function (d) { return -d; }).top(1);
  topCountry[0].key;   // last country
  topCountry[0].value; // last value
  ```
  **/
  function order(sortFunction) {
    sortFunc = sortFunction;
    return groupObj;
  }

  /**
  ### crossfilterServer.dimension.group.orderNatural()

  This technique can likewise be used to compute the number of unique values in each group, by
  storing a map from value to count within each group's reduction, and removing the value from
  the map when the count reaches zero.
  **/
  function orderNatural() {
    sortFunc = null;
    return groupObj;
  }

  /**
  ### crossfilterServer.dimension.group.size()

  Returns the number of distinct values in the group, independent of any filters;
  the cardinality.
  **/
  function size() {
    return members.length;
  }

  /**
  ### crossfilterServer.dimension.group.dispose()

  Removes this group from its dimension. This group will no longer update when new filters
  are applied to the crossfilter, and it may be garbage collected if there are no other
  references to it remaining.
  **/
  function dispose() {
  }


  return groupObj;
}