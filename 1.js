const set = async () => {
  // return new Promise(resolve => {
  //   resolve(1)
  // })
  // await setTimeout(() => {
  //   return 1
  // })
  // return new Promise((resolve) => {
  //   setTimeout(() => {
  //     resolve(1)
  //   }, 1000)
  // })
 setTimeout(() => {
    return 12
  }, 2000)
}

async function aaa() {
  let res = await set()
  console.log(res)
}
aaa()

// async function fetchData() {
//   return new Promise(resolve => {
//     setTimeout(() => {
//       resolve(2131)
//     }, 2000)
//   }); // 这个字符串会被包装成一个已解决的 Promise
// }

// async function main() {
//   const result = await fetchData();
//   console.log(result);
// }

// main();
