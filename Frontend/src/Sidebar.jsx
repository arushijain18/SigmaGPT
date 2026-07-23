import "./Sidebar.css";
import logo from "./assets/blacklogo.png";
import { MyContext } from "./MyContext";
import { useContext, useEffect } from "react";
import { v1 as uuidv1 } from "uuid";

const API_URL = import.meta.env.VITE_API_URL; // NEW

function Sidebar() {
  const { allThreads, setAllThreads, currThreadId, setNewChat, setPrompt, setReply, setCurrThreadId, setPrevChats, token } = useContext(MyContext);

  const getAllThreads = async () => {
    try {
      const response = await fetch(`${API_URL}/api/thread`, { // CHANGED
        headers: { "Authorization": `Bearer ${token}` }
      });
      const res = await response.json();
      const filteredData = res.map(thread => ({ threadId: thread.threadId, title: thread.title }));
      setAllThreads(filteredData);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllThreads();
  }, [currThreadId]);

  const createNewChat = () => {
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setCurrThreadId(uuidv1());
    setPrevChats([]);
  };

  const changeThread = async (newThreadId) => {
    setCurrThreadId(newThreadId);
    try {
      const response = await fetch(`${API_URL}/api/thread/${newThreadId}`, { // CHANGED
        headers: { "Authorization": `Bearer ${token}` }
      });
      const res = await response.json();
      setPrevChats(res);
      setNewChat(false);
      setReply(null);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteThread = async (threadId) => {
    try {
      const response = await fetch(`${API_URL}/api/thread/${threadId}`, { // CHANGED
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      const res = await response.json();
      console.log(res);
      setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId));
      if (threadId === currThreadId) {
        createNewChat();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <section className="sidebar">
      <button onClick={createNewChat}>
        <img src={logo} alt="gpt logo" className="logo" />
        <span><i className="fa-solid fa-pen-to-square"></i></span>
      </button>

      <ul className="history">
        {allThreads?.map((thread) => (
          <li
            key={thread.threadId}
            onClick={() => changeThread(thread.threadId)}
            className={thread.threadId === currThreadId ? "highlighted" : ""}
          >
            {thread.title}
            <i
              className="fa-solid fa-trash"
              onClick={(e) => {
                e.stopPropagation();
                deleteThread(thread.threadId);
              }}
            ></i>
          </li>
        ))}
      </ul>

      <div className="sign">
        <p>By OpenAI ©</p>
      </div>
    </section>
  );
}

export default Sidebar;