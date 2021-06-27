// import React, {useState} from 'react';
//
// function CalendarUpload(props) {
//     const [file ,setFile] = useState(null);
//     return (
//         <div className="flex w-ful bg-grey-lighter">
//             <label
//                 className="ml-8 w-64 flex flex-col items-center px-4 py-6 bg-white text-blue-700 rounded-lg shadow-lg tracking-wide uppercase border border-blue-700 cursor-pointer hover:bg-blue-900 hover:text-white">
//                 <svg className="w-8 h-8" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
//                     <path
//                         d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z"/>
//                 </svg>
//                 <span className="mt-2 text-base leading-normal">Select a file</span>
//                 <input type='file'
//                        className="hidden"
//                        accept={"text/calendar"}
//                        onChange={(e) => setFile(e.target.files[0])}/>
//             </label>
//         </div>
//         // <div className={"calendar-upload"}>
//         //     <form>
//         //         <input type="file" name="upload" accept={"text/calendar"} max={1} multiple={false}
//         //                onChange={(e) => {
//         //                    setFile(e.target.files[0]);
//         //                }}/>
//         //         {/*<input type="submit" disabled={file === null}/>*/}
//         //         <button disabled={file === null}
//         //                 className="bg-blue-700 hover:bg-blue-900 rounded text-white p-2 pl-4 pr-4"
//         //                 onClick={(e) => {
//         //                     e.preventDefault();
//         //                     alert("The file has been uploaded!")
//         //                 }}>
//         //             <p className="font-semibold text-xs">Upload</p>
//         //         </button>
//         //     </form>
//         // </div>
//     );
// }
//
// export default CalendarUpload;