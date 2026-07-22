// import './App.css';
// import Login from "./Login.jsx";
// import Sidebar from "./Sidebar.jsx";
// import ChatWindow from "./ChatWindow.jsx";
// import{MyContext} from "./MyContext.jsx";
// import { useState } from "react";
// import{v1 as uuidv1} from "uuid";
// import Auth from "./Auth.jsx";

// function App() {
//   const[prompt,setPrompt]= useState("");
//   const[reply, setReply] = useState(null);
//   const[currThreadId, setCurrThreadId] = useState(uuidv1());
//   const[prevChats,setPrevChats] = useState([]);// stores all chats of current thread
//   const [newChat,setNewChat]= useState(true);
//   const[allThreads,setAllThreads]=useState([]);

//    //  INSERT THIS — holds the login token, checks localStorage first so refresh doesn't log you out
//   const [token, setToken] = useState(localStorage.getItem("token") || null);

//   // this is an object
//  const providerValues={
//   prompt,setPrompt,
//   reply,setReply,
//   currThreadId, setCurrThreadId,
//   newChat, setNewChat,
//   prevChats, setPrevChats,
//   allThreads,setAllThreads
//  };

//  //  INSERT THIS WHOLE BLOCK — if no token, show login/signup instead of the chat app
//   if (!token) {
//     return (
//       <div className='app'>
//         <MyContext.Provider value={providerValues}>
//           <Auth />
//         </MyContext.Provider>
//       </div>
//     );
//   }

// //  passing values

//   return (
//     <div className='app'>
//       <MyContext.Provider value={providerValues}>
//       <Sidebar></Sidebar>
//       <ChatWindow></ChatWindow>
//       </MyContext.Provider>
//     </div>
//   )
// }

// export default App;

import './App.css';
import Sidebar from "./Sidebar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import { MyContext } from "./MyContext.jsx";
import { useState } from "react";
import { v1 as uuidv1 } from "uuid";
import Auth from "./Auth.jsx";

function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [currThreadId, setCurrThreadId] = useState(uuidv1());
  const [prevChats, setPrevChats] = useState([]);
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  const providerValues = {
    prompt, setPrompt,
    reply, setReply,
    currThreadId, setCurrThreadId,
    newChat, setNewChat,
    prevChats, setPrevChats,
    allThreads, setAllThreads,
    token, setToken   // ← added
  };

  if (!token) {
    return (
      <div className='app'>
        <MyContext.Provider value={providerValues}>
          <Auth />
        </MyContext.Provider>
      </div>
    );
  }

  return (
    <div className='app'>
      <MyContext.Provider value={providerValues}>
        <Sidebar></Sidebar>
        <ChatWindow></ChatWindow>
      </MyContext.Provider>
    </div>
  );
}

export default App;