/**
 * User: DISI
 * Date: 20.08.13
 * Time: 09:14
 */




exports.distArrayByKey = function(inputArray, distKey){
    var distMap = {};
    for(var i = 0; i < inputArray.length; i++){
        //disi:todo optimise algorithm
        distMap[inputArray[i][distKey]] = inputArray[i];
    }
    return exports.cvtMapToValueArray(distMap);
}

exports.cvtMapToValueArray = function(map){
    var valueArray = [];
    for (var k in map) {
        valueArray.push(map[k]);
    }
    return valueArray;
}

