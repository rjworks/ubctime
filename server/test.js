// x = [];
// for(let i = 0; i < 30; i++)
//     x[i] = i;
//
// const wait = ms => new Promise(res => setTimeout(res, ms))
//
// // const d = async() => {
// //     x.map(async(el, i)=>{
// //         console.log("PAUSE")
// //         await wait(3000);
// //         console.log("CONTINUE")
// //     })
// // }
// //
// // d();
// for(const i of x){
//     console.log(i)
// }
//
// const d = async() => {
//     try{
//         console.log("PAUSE")
//         await wait(3000)
//         console.log("CONT")
//     }catch(e){
//         console.log(e.message)
//     }
// }
//
// d();
const d = () => {
    const banned = [3];
    const h = [1, 2, 3, 4, 5];
    let processed = [];
    for(const i of h) {
        let succ = false;
        while(!succ) {
            console.log("back here")
            try {
                if(i === 3){
                    throw new Error("err");
                }
                console.log("success")
                console.log(i)
                processed.push(i);
                succ = true;
            } catch(e) {
                succ = false;
                setTimeout(() => {
                    console.log("Stop here")
                }, 3000)
                // console.log(e.message)
            }
        }
    }
}

d();