function FitScoreColor(fitScore) {
  var ScoreColor = {
    2: "fit-score-color-success",
    1.5: "fit-score-color-success",
    1: "fit-score-color-warning",
    0.5: "fit-score-color-warning",
    0: "fit-score-color-danger",
    default: "",
  };
  return ScoreColor[fitScore] || ScoreColor["default"];
}

export default FitScoreColor;
