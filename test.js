const data = [
  [0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
  [0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0],
  [0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
];


function getCount(i, j) {
  if (i >= data.length || j >= data[0].length) {
    return 0;
  }
  if (data[i][j] !== 1) {
    return 0;
  }
  if(data[i][j] === 1) {
    return 1 + getCount(i + 1, j) + getCount(i, j + 1)
  }
}


function getMaxCount() {
  let alreadySearch = new Set()
  let max = 0
  data.forEach((row, rowIndex) => {
    row.forEach((col, colIndex) => {
      if(data[rowIndex][colIndex] === 1) {
        const key = `${rowIndex}-${colIndex}`
        if(alreadySearch.has(key)) {
          return 
        } else {
          alreadySearch.add(key)
          max = Math.max(max, getCount(rowIndex, colIndex))
        }
      }
    })
  })
  return max
}
console.log('count: ', getMaxCount());
