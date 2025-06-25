import React, { useEffect, useRef, useContext } from "react";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { RagChatbotContext } from "@/context/RagChatbotContext";
import ReactMarkdown from 'react-markdown';

const RagMessageArea = () => {
  const { messages, botResponseLoading } = useContext(RagChatbotContext);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, botResponseLoading]);

  return (
    <div className="panel-body msg-area" id="my-cellibrity-chat-area">
      <OverlayScrollbarsComponent
        className="main-menu"
        options={{
          className: "os-theme-light",
          scrollbars: {
            autoHide: "scroll",
          },
        }}
      >
        <div
          ref={scrollRef}
          className="scrollable main-chat-area"
          style={{ maxHeight: "900px", overflowY: "auto" }}
        >
          {messages
            .filter((message) => message.role !== "system")
            .map((message, index) => {
              if (message.role === "user") {
                return (
                  <div
                    key={index}
                    className="single-message outgoing"
                    style={{ justifyContent: "flex-end", textAlign: "right" }}
                  >
                    <div className="msg-box">
                      <div className="msg-box-inner">
                       
                      
                     <p>{message.content}</p>
                      </div>
                    </div>
                    <div className="avatar">
                      <img
                        src="/assets/images/munif.jpg"
                        alt="User Avatar"
                        width={35}
                        height={35}
                      />
                    </div>
                  </div>
                );
              } else if (message.role === "assistant") {
                return (
                  <div
                    key={index}
                    className="single-message"
                    style={{ justifyContent: "flex-start", textAlign: "left" }}
                  >
                    <div className="avatar">
                      <img
                        src="/assets/images/robot-44.png"
                        alt="Assistant Avatar"
                        width={35}
                        height={35}
                      />
                    </div>
                    <div className="msg-box">
                      <div className="msg-box-inner">
                       
                      <ReactMarkdown
  components={{
    a: ({ node, ...props }) => (
      <a
        {...props}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: "yellow", textDecoration: "underline" }} // 👈 change color here
      />
    ),
  }}
>
  {message.content}
</ReactMarkdown>

                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            })}
          {botResponseLoading && (
            <div
              className="single-message"
              style={{ justifyContent: "flex-start", textAlign: "left" }}
            >
              <div className="avatar">
                <img
                  src="/assets/images/robot-44.png"
                  alt="Assistant Avatar"
                  width={35}
                  height={35}
                />
              </div>
              <div className="msg-box">
                <div className="msg-box-inner">
                 
                  <div className="bouncing-loader">
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </OverlayScrollbarsComponent>
    </div>
  );
};

export default RagMessageArea;
