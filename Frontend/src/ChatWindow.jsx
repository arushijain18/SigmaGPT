import { useContext, useState, useEffect, useRef } from "react";
import './App.css';
import Sidebar from "./Sidebar.jsx";
import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { ScaleLoader } from "react-spinners";

function ChatWindow() {
  const { prompt, setPrompt, reply, setReply, currThreadId, setCurrThreadId, prevChats, setPrevChats, setNewChat, token, setToken } = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const cancelledRef = useRef(false); // NEW: tracks whether user cancelled the recording

  const getReply = async () => {
    setLoading(true);
    setNewChat(false);
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        message: prompt,
        threadId: currThreadId
      })
    };
    try {
      const response = await fetch("http://localhost:8080/api/chat", options);
      const res = await response.json();
      setReply(res.reply);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (prompt && reply) {
      setPrevChats(prevChats => (
        [...prevChats,
          { role: "user", content: prompt },
          { role: "assistant", content: reply }
        ]
      ));
    }
    setPrompt("");
  }, [reply]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleProfileClick = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    mediaRecorderRef.current = recorder;
    audioChunksRef.current = [];
    cancelledRef.current = false; // reset on every new recording

    recorder.ondataavailable = (e) => audioChunksRef.current.push(e.data);

    recorder.onstop = async () => {
      stream.getTracks().forEach(t => t.stop());

      // NEW: if cancelled, discard audio and skip transcription entirely
      if (cancelledRef.current) {
        cancelledRef.current = false;
        return;
      }

      await new Promise(r => setTimeout(r, 100)); // ensures all chunks are flushed
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        console.log("blob size:", audioBlob.size); 
      await sendAudioForTranscription(audioBlob);
    };

    recorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  // NEW: stops recording and discards the audio (no transcription sent)
  const cancelRecording = () => {
    cancelledRef.current = true;
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  const sendAudioForTranscription = async (audioBlob) => {
    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.webm");

    const res = await fetch("http://localhost:8080/api/transcribe", {
      method: "POST",
      headers: { "Authorization": `Bearer ${token}` },
      body: formData
    }).then(r => r.json());

    if (res.text) setPrompt(prev => prev + " " + res.text);
  };

  return (
    <div className="chatWindow">
      <div className="navbar">
        <span onClick={() => setIsOpen(!isOpen)}>
          SIGMAGPT &nbsp;<i className="fa-solid fa-angle-down"></i>
        </span>

        <div className="userIconDiv" onClick={handleProfileClick} ref={dropdownRef}>
          <span className="userIcon"><i className="fa-solid fa-user"></i></span>

          {isOpen &&
            <div className="dropDown">
              <div className="dropNameItem"><i className="fa-solid fa-cloud-arrow-up"></i>Upgrade plan</div>
              <div className="dropNameItem"><i className="fa-solid fa-gear"></i>Settings</div>
              <div className="dropNameItem" onClick={handleLogout}><i className="fa-solid fa-right-from-bracket"></i>Log out</div>
            </div>
          }
        </div>
      </div>

      <Chat></Chat>
      <ScaleLoader color="#fff" loading={loading}></ScaleLoader>

      <div className="chatInput">
        <div className="inputBox">
          <input
            placeholder="Ask anything"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !isRecording ? getReply() : ''}
          />

          {/* NEW: while recording, show pulsing dot (click = stop & send) + X (click = cancel) */}
          {isRecording ? (
            <div className="recordingUI" onClick={stopRecording}>
              <span className="recDot"></span>
              <i className="fa-solid fa-xmark cancelBtn" onClick={(e) => { e.stopPropagation(); cancelRecording(); }}></i>
            </div>
          ) : (
            <div className="micBtn" onClick={startRecording}>
              <i className="fa-solid fa-microphone"></i>
            </div>
          )}

          <div id="submit" onClick={getReply}><i className="fa-solid fa-paper-plane"></i></div>
        </div>
        <p className="info">
          SigmaGPT can make mistakes. Check important info.
        </p>
      </div>
    </div>
  );
}

export default ChatWindow;