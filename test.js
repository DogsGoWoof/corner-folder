const arr = [];
for (let i = 0; i < 10; i++) {
    arr.push(i);
};
console.log(arr);
const splicedArr = arr.splice(arr.indexOf(3), 1);
    // returns removed item, spliced array is original array regardless of const of let declaration
console.log(splicedArr);
console.log(arr);