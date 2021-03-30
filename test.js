const arr = [1000, 1500, 3000, 2000, 5000];

for (let item of arr) {
  setTimeout(() => {
    console.log(item);
  }, item);
}
