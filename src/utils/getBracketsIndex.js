export default string => {
  let resultString = ''
  for (let i = 1; string[i] !== ']'; i++) {
    resultString += string[i]
  }
  return Number(resultString) - 1
}
