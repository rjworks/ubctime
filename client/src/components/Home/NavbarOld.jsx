// import React, {useState} from "react";
//
// function Navbar() {
//     const [isOpen, setIsOpen] = useState(false);
//     const [showCampuses, setShowCampuses] = useState(false);
//     return (
//         <nav className="bg-gradient-to-r from-blue-800 to-blue-500 py-2">
//             <div className="max-w-8xl mx-auto px-4">
//                 <div className="flex justify-between">
//                     <div className="flex space-x-4">
//                         <div>
//                             <a href="/"
//                                className="flex items-center py-2 px-9 text-gray-700 hover:text-gray-900">
//                                 <svg
//                                     xmlns="http://www.w3.org/2000/svg"
//                                     className="
//                                     fill-current py-1 px-1 rounded-md text-white w-20 border-2
//                                     border-white
//                                     hover:border-white hover:bg-blue-500 transition duration-500"
//                                     version="1"
//                                     viewBox="0 0 235 87">
//                                     <path
//                                         d="M1898 841c-76-25-118-52-177-116-73-81-95-144-95-280-1-164 42-265 145-341 76-56 139-76 254-82 106-5 184 9 270 47l43 19-14 77c-7 43-16 80-19 83s-22-4-43-15c-50-28-137-53-184-53-77 0-130 21-180 71-55 55-72 104-71 201 1 90 39 170 101 213 41 28 49 30 140 30s101-2 156-33c33-17 63-29 67-25 3 5 12 43 19 87 14 91 17 86-79 116-84 27-251 27-333 1zM10 563c0-165 4-304 10-325 17-61 71-130 127-164 70-42 152-58 266-52 120 6 198 39 262 110 71 80 75 100 75 430v288H550V578c0-245-2-277-19-314-49-109-246-112-300-5-20 38-21 57-21 316v275H10V563zM910 439V28l198 4c235 6 281 17 353 88 99 95 89 256-19 321-20 12-39 24-41 25-2 2 11 16 29 31 91 76 78 237-25 302-66 42-122 51-320 51H910V439zm357 246c12-9 25-26 29-40 18-71-34-115-133-115h-63v183l72-7c40-4 83-13 95-21zm-23-306c56-15 86-50 86-96 0-21-7-46-14-55-22-29-81-48-151-48h-65v210h53c28 0 69-5 91-11z"
//                                         transform="matrix(.1 0 0 -.1 0 87)"
//                                     />
//                                 </svg>
//                                 {/*<svg xmlns="http://www.w3.org/2000/svg"*/}
//                                 {/*     className="h-9 w-15 stroke-current text-white"*/}
//                                 {/*     fill={"none"}*/}
//                                 {/*     viewBox="0 0 24 24" stroke="currentColor">*/}
//                                 {/*    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"*/}
//                                 {/*          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>*/}
//                                 {/*</svg>*/}
//                                 <span
//                                     className="font-bold text-xl ml-2 py-1 text-white hover:border-white
//                                     rounded-md transform hover:scale-110 transition duration-500">
//                                     T i M E
//                                 </span>
//                                 <svg
//                                     className="flex ml-1 mb-2 w-4 h-4"
//                                     xmlns="http://www.w3.org/2000/svg"
//                                     width="16"
//                                     height="16"
//                                     x="0"
//                                     y="0"
//                                     version="1.1"
//                                     viewBox="0 0 16 16"
//                                     xmlSpace="preserve">
//                                     <image width="16" height="16" x="0" y="0"
//                                            href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABZVBMVEUAAAD/zk//zE3/yUv/ /wD/y03/zU3/zE3/zE3/yk3bMT3eL0PsdUfsdEfbLEPjL0L/zE34u0vcLkPdLkTdLkTcLkP7s0z/ zE3/y0z/zEy5kFLKNUfTMUa7ilH/zE3/yk3cLUPdLkP9w0z/zDPdLEPfLUPdL0TdLUTcLkTeLkTj HDmAAADeLkTkLkDcLUPdM0TcLUTcLUPcLUPeLUXbJEneLUTdLkPhLUvhL0HcLUTeLkTeLkPxdjjw dTr/rTP/qjPcLULcLUPdLkPdLUTdLkT/pzT/rDL/zE3+y03dLkTeQ1fhjJfjs7rjtbvikp3eSl3g cH7l4OLm5+ijo6WkpKXm5OXhgI3fXW7m5eacnJ7kwsjl1NfdMUfeRFjl5uffV2nfWWqsrK1TUlSS kpTgbXzeTF/fYHDdMEXl0tbl3+HdN0zgeIbimKLjqrLgZ3fjt77l3d/kvcPgcoDdL0XkSEDiQkH/ //9YtRXdAAAAR3RSTlMAKmpHAbdW+/0/FVzw8GMb33CQ+Pygdf73/sbu7tKparbNbwVMZ6/L6vwJ Av0c8g/A3GeCB9bnESvs9D1bdnm1SZi+nlOdlJzxdo0AAAABYktHRHYxY8lBAAAAB3RJTUUH5QUF FykcPE0pggAAAN9JREFUGNM9jGk3QmEYRU/zICShogwRCkU0mEJxPTLkoShNMpUhSv3/XreyP5y1 9v5wAIVSpQY0GkCtUioArU7SG4wDpsGhYYNe0mlhlk5HLKMksI6NT0hm2OyOSTpLnl9cXtGU026D a3qGUtd8c8vpDM3OueCep7t75myWmVO04AY8lONeeMgvAlgqsByKYkvLXvhWyn/hsVJ5Yn6mVWDt hf95JT8QeKv2vfa+Lj426KMfkhQUYXOLPrv+lQ+FRUAkSvXvn1qj+bu9A5ndFsm097qO/djB4VEg njg+EdIB/k44s6DWCIoAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjEtMDUtMDVUMjM6NDE6MjgrMDA6 MDAtEqtbAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIxLTA1LTA1VDIzOjQxOjI4KzAwOjAwXE8T5wAA AABJRU5ErkJggg=="/>
//                                 </svg>
//                                 {/*<div className="block font-bold text-xl px-3 text-white hover:text-gray-200 rounded-full transition duration-300">*/}
//                                 {/*    <p className="text-3xl">UBC</p>*/}
//                                 {/*    <p*/}
//                                 {/*        className="ml-1">*/}
//                                 {/*    Time*/}
//                                 {/*</p>*/}
//                                 {/*</div>*/}
//                             </a>
//                         </div>
//                     </div>
//
//                     <div className="hidden flex md:flex items-center space-x-5">
//                         <span
//                             className="flex space-x-4 rounded-md font-semibold justify-between m-4 text-md py-1 px-4 bg-blue-800
//                            hover:bg-blue-700 text-white
//                            transition duration-300">
//                             UBC Okanagan
//                             <div className="flex">
//                                 <button
//                                     className="
//                                         ml-3
//                                         focus:outline-none transform hover:scale-125 transition duration-300"
//                                     onClick={() => setShowCampuses(true)}>
//                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
//                                          viewBox="0 0 24 24"
//                                          stroke="currentColor">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//                                               d="M19 9l-7 7-7-7"/>
//                                     </svg>
//                                 </button>
//                             </div>
//                         </span>
//                         <span
//                             className="flex space-x-4 rounded-md font-semibold justify-between m-4 text-md py-1 px-4 bg-blue-800
//                            hover:bg-blue-700 text-white
//                            transition duration-300">
//                             Summer 2021
//                             <div className="flex">
//                                 <button
//                                     className="
//                                         ml-3
//                                         focus:outline-none transform hover:scale-125 transition duration-300"
//                                     onClick={() => setShowCampuses(true)}>
//                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
//                                          viewBox="0 0 24 24"
//                                          stroke="currentColor">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//                                               d="M19 9l-7 7-7-7"/>
//                                     </svg>
//                                 </button>
//                             </div>
//                         </span>
//                         {/*<div className="block">*/}
//                         {/*    <ul>*/}
//                         {/*        <li>hi</li>*/}
//                         {/*    </ul>*/}
//                         {/*</div>*/}
//                         <span
//                             className="flex space-x-4 rounded-md font-semibold justify-between m-4 text-md py-1 px-4 bg-blue-800
//                            hover:bg-blue-700 text-white
//                            transition duration-300">
//                             Degree Requirements
//                             <div className="flex">
//                                 <button
//                                     className="
//                                         ml-3
//                                         focus:outline-none transform hover:scale-125 transition duration-300">
//                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
//                                          viewBox="0 0 24 24"
//                                          stroke="currentColor">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//                                               d="M19 9l-7 7-7-7"/>
//                                     </svg>
//                                 </button>
//                             </div>
//                         </span>
//                     </div>
//
//                     <div className="md:hidden flex items-center">
//                         <button className="mobile-menu-button">
//                             <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
//                                  stroke="currentColor">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
//                                       d="M4 6h16M4 12h16M4 18h16"/>
//                             </svg>
//                         </button>
//                     </div>
//
//                 </div>
//             </div>
//
//             <div className="mobile-menu hidden md:hidden">
//                 <a href="/" className="block py-2 px-4 text-sm hover:bg-gray-200">Features</a>
//                 <a href="/" className="block py-2 px-4 text-sm hover:bg-gray-200">Pricing</a>
//             </div>
//         </nav>
//         // <div>
//         //     <nav className="bg-blue-900">
//         //         <div className="px-5 py-5 flex justify-between">
//         //             <a href="/" className={"flex"}>
//         //                 <svg
//         //                     className="w-60 fill-current text-white"
//         //                     xmlns="http://www.w3.org/2000/svg"
//         //                     version="1"
//         //                     viewBox="0 0 768 87"
//         //                 >
//         //                     <path
//         //                         d="M1898 841c-76-25-118-52-177-116-73-81-95-144-95-280-1-164 42-265 145-341 76-56 139-76 254-82 106-5 184 9 270 47l43 19-14 77c-7 43-16 80-19 83s-22-4-43-15c-50-28-137-53-184-53-77 0-130 21-180 71-55 55-72 104-71 201 1 90 39 170 101 213 41 28 49 30 140 30s101-2 156-33c33-17 63-29 67-25 3 5 12 43 19 87 14 91 17 86-79 116-84 27-251 27-333 1zM10 563c0-165 4-304 10-325 17-61 71-130 127-164 70-42 152-58 266-52 120 6 198 39 262 110 71 80 75 100 75 430v288H550V578c0-245-2-277-19-314-49-109-246-112-300-5-20 38-21 57-21 316v275H10V563zM910 439V28l198 4c235 6 281 17 353 88 99 95 89 256-19 321-20 12-39 24-41 25-2 2 11 16 29 31 91 76 78 237-25 302-66 42-122 51-320 51H910V439zm357 246c12-9 25-26 29-40 18-71-34-115-133-115h-63v183l72-7c40-4 83-13 95-21zm-23-306c56-15 86-50 86-96 0-21-7-46-14-55-22-29-81-48-151-48h-65v210h53c28 0 69-5 91-11z"
//         //                         transform="matrix(.1 0 0 -.1 0 87)"
//         //                     ></path>
//         //                 </svg>
//         //                 <div className="text-2xl text-white">Time</div>
//         //                 {/*<a href="/" className={"text-white"}>Time</a>*/}
//         //             </a>
//         //         </div>
//         //         <a href="/"></a>
//         //     </nav>
//         // </div>
//     );
// }
//
// export default Navbar;
