function FitScoreOccupiedApps(totalusers, expectedappmembercount) {

  if (totalusers === expectedappmembercount) {
    return 2;
  } else if (
    (totalusers > 0 && totalusers < expectedappmembercount) ||
    totalusers > expectedappmembercount
  ) {
    return 0.5;
  } else {
    return 0;
  }
}

export default FitScoreOccupiedApps;
