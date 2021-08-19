function FitScoreApps(usertechstack, appstechstack) {
  let appStack = appstechstack.split(",");

  if (arrayEquals(usertechstack, appStack) === true) {
    return 2;
  } else if (arrayMatch(usertechstack, appStack).length > 0) {
    return 1;
  } else {
    return 0;
  }
}

//figure out if array is equal
function arrayEquals(a, b) {
  return (
    Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index])
  );
}

//find match inside array
function arrayMatch(arr1, arr2) {
  var arr = []; // Array to contain match elements
  for (var i = 0; i < arr1.length; ++i) {
    for (var j = 0; j < arr2.length; ++j) {
      if (arr1[i] === arr2[j]) {
        // If element is in both the arrays
        arr.push(arr1[i]); // Push to arr array
      }
    }
  }

  return arr; // Return the arr elements
}

export default FitScoreApps;
