import React, { useState, useEffect, useRef } from "react";
import { BsFillChatLeftTextFill, BsFillChatRightDotsFill, BsSendFill  } from "react-icons/bs";

function App() {
const chatBoxWrapper = useRef();
const chatBox = useRef();

const [prompt, setPrompt] = useState("");
const [typing, setTyping] = useState(false);
const [messages, setMessages] = useState([
  {
    message: "Hello, I'm chatGPT! Ask me anything",
    sender: "assistant",
  }
]);

const [current, setCurrent] = useState("now");
const systemMethod = {"role": "system", "content": "You are a helpful assistant."}

 const composePrompt = (e) => {
    setPrompt(e.target.value);
 }

 const queryPrompt = () => {
  if(prompt !=="") {
    setTyping(true);
    setMessages(previousState => [...previousState, {
      message: prompt,
      sender: "user",
    }])

    setPrompt("");
    setCurrent(new Date().getMilliseconds());
  }
 }
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      // Perform the same action as the click event
      queryPrompt();
    }
  };

 const fetchApi = async () => {
  let chatRoles = messages.map((obj) => {
    return {role: obj.sender, content: obj.message}
  })

  const reqBody = {
    "model": "gpt-3.5-turbo",
    "messages": [systemMethod, ...chatRoles]
  }

   const api = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": "Bearer "+ import.meta.env.VITE_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(reqBody),
  })

  return api;
 }

  useEffect(() => {
    if (current !== "now") {
      fetchApi().then(data => {
        return data.json();
      }).then(data => {
        setMessages(previousState => [...previousState, {
          message: data.choices[0].message.content,
          sender: "assistant",
        }]);
        setTyping(false);
        chatBoxWrapper.current.scrollTop = chatBox.current.scrollHeight
      });
    }
  }, [current]);



  return (
    <>
      <div className="relative h-[100vh] mx-auto lg:max-w-2xl xl:max-w-3xl">
        <div ref={chatBoxWrapper} className="wrapper overflow-auto h-[calc(100%-87px)] flex flex-col scroll-smooth p-[10px]">
          <div ref={chatBox}> 
          {
            messages && messages.length > 0 && messages.map((message, index) => (
              <React.Fragment key={index}>
                <div className="flex px-3">
                  <div className={`container mx-auto flex items-start ${message.sender === "assistant" ? "flex-row" : "flex-row-reverse"}`}>

                   {
                      
                      message.sender === "assistant" ?
                        (<BsFillChatLeftTextFill style={{ fontSize: "30px", color: "#62ac9c", marginRight: "20px", marginTop: "10px" }} />):
                        (<BsFillChatRightDotsFill style={{ fontSize: "30px", color: "#fff", marginLeft: "20px", marginTop: "10px" }} />)
                    } 

                    <p className={`text-lg min-h-[52px] ${message.sender === "assistant" ? "bg-[#62ac9c] text-[#fff]" : "bg-[#fff] text-[#000]"} py-3 px-5 rounded-lg w-[calc(100%-42px)] my-1`}>{message.message}</p>

                  </div>
                </div>
              </React.Fragment>
            ))
          }
          </div>

        </div>

        <div className="flex p-[5px] absolute w-full justify-center ">
          <div className="container relative">
            <div className="p-4 bg-[#3e414e] rounded-sm flex justify-between">
              {typing && <span className="absolute self-start top-[-20px] text-xs left-0 text-[#9ca3af]">Typing...</span>}

              <input className="w-[calc(100%-6rem)] m-0 rounded-sm bg-[#353641] outline-none p-[10px]  h-[45px] text-[#fff]" type="text" placeholder="Send a message..." 
              onChange={composePrompt}
              value={prompt}
              onKeyDown={handleKeyDown}
              
              />

              <button 
              onClick={queryPrompt}    
              className="w-[5rem] flex items-center justify-center bg-[#353641] cursor-pointer ">
                <BsSendFill style={{ fontSize: "20px", color: "#fff"  }} />
                </button>

            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
