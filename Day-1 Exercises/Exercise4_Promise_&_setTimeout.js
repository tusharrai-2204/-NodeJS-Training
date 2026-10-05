/* 
Make a function that takes in a single parameter and returns a new promise. using setTimeout, after 500 milliseconds, the promise will either resolve or reject. 
if the input is a string, the promise resolves with that same string in uppercase. 
if the input is anything but not a string, it rejects with that same input.
call the function delayedUpperCase
*/

function delayedUpperCase(param) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (typeof param === 'string') {
        resolve(param.toUpperCase());
      } else {
        reject(param);
      }
    }, 500);
  })
}

delayedUpperCase('Tushar')
.then(res => console.log(res))
.catch(res => console.log(res));

delayedUpperCase(40)
.then(res => console.log(res))
.catch(res => console.log(res));