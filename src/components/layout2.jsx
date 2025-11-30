import styles from "./layout2.module.css";
import { useRef, useEffect, useLayoutEffect } from "react";
import { useState } from "react";
import { Greeting } from "./greeting";
import { InputBox } from "./inputBox";
import { OutputBox } from "./outPutBox";
import { AnswerBox } from "./answerBox";
import { Sidebar } from "./historySideBar";

import mockAnswers from "../answerMock.json";

export default function Layout() {
  //输入框的文本
  const [text, setText] = useState("");

  //本次的对话：因为需要持续渲染

  //欢迎界面应该消失吗
  const [greetingAlreadyOut, setgreetingAlreadyOut] = useState(false);

  //输出用户的问题
  const [displayText, setDisplayText] = useState("");

  // AI的打字机文本
  const [answerFlow, setAnswerFlow] = useState("");

  //持久化
  const [history, setHistory] = useState(() => {
    // 从 localStorage 读取，不存在则用空数组
    const savedHistory = localStorage.getItem("chatHistory");
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  const [sidebarTitles, setSidebarTitles] = useState(() => {
    const savedTitles = localStorage.getItem("sidebarTitles");
    return savedTitles ? JSON.parse(savedTitles) : [];
  });

  const [activeIndex, setActiveIndex] = useState(0); // 高亮选中项

  //5个状态：1：初始状态，2：第一次提交，欢迎内容消失，
  // 3：显示用户的输入，4：显示打字机的回答, 5：停留并可以重新提交，一旦提交回到状态3打印新的用户输入
  const [stage, setStage] = useState(1);

  const timeoutRef = useRef(null);

  //管理打字机：定时器、打字索引、显示的回答
  const timerRef = useRef(null);
  const textIndexRef = useRef(0);
  const answerRef = useRef("");

  //截取字模拟生成历史信息"标题"
  const getSidebarTitles = () => {
    const titles = [];
    history.forEach((item) => {
      if (item.user && item.ai) {
        const userContent = item.user.slice(0, 4);
        const aiContent = item.ai.slice(0, 4);
        titles.push(`问:${userContent}   答:${aiContent}`);
      }
    });

    return titles;
  };

  //输入框
  const handleTextChange = (inputText) => {
    setText(inputText);
  };

  //模拟回答：随机选择一条
  const getFullAnswer = () => {
    const randomIndex = Math.floor(Math.random() * mockAnswers.length);
    return mockAnswers[randomIndex];
  };

  //提交按钮的更新
  const handleSubmit = () => {
    //把输入内容记下来，清空输入框、回答、打字序列
    const updateInput = () => {
      setText("");
      setDisplayText(text);
      setAnswerFlow("");
      textIndexRef.current = 0;
    };

    //提交了，看是否需要进入stage2消失动画，如果欢迎已经消失就直接进入：允许显示用户输入stage3
    if (!greetingAlreadyOut) {
      setStage(2);
      updateInput();
    } else {
      setStage(3);
      updateInput();
    }

    //清空计时器，需要思考、打字
    if (timerRef.current) clearInterval(timerRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    //先"思考"3s
    setTimeout(() => {
      setStage(4);
      answerRef.current = getFullAnswer();
      //加入历史、侧边栏
      const userContent = text.slice(0, 4);
      const aiContent = answerRef.current.slice(0, 4);
      const newTitle = `问:${userContent}   答:${aiContent}`;
      setSidebarTitles(() => [...getSidebarTitles(), newTitle]);
      setActiveIndex(history.length);
      setHistory((prevHistory) => [
        ...prevHistory,
        { user: text, ai: answerRef.current }, //用ref将生成的新值保存，防止闭包陷阱。而text利用了闭包
      ]);
    }, 3000);
  };

  //重新回答，还差：这三秒禁用提交、禁用生成，禁用复制
  const handleReGen = () => {
    setAnswerFlow("重新生成中……");
    setTimeout(() => {
      setAnswerFlow("");
      setStage(4);
      answerRef.current = getFullAnswer();
      const aiContent = answerRef.current.slice(0, 4);
      setSidebarTitles((prevTitles) => {
        // 重新生成时，标题、历史变成修改最后一项的回答
        const lastQuestion =
          prevTitles[prevTitles.length - 1].split("   答:")[0];
        const updatedLastItem = `${lastQuestion}   答:${aiContent}`;
        return [...prevTitles.slice(0, -1), updatedLastItem];
      });
      setHistory((prevHistory) => [
        ...prevHistory.slice(0, -1),
        { ...prevHistory[prevHistory.length - 1], ai: answerRef.current },
      ]);
    }, 3000);
  };
  // 监听stage的打字机：每过一定时间给answerflow拼一个字符
  useEffect(() => {
    if (stage === 4) {
      if (timerRef.current) clearInterval(timerRef.current);
      textIndexRef.current = 0;
      timerRef.current = setInterval(() => {
        const currentIndex = textIndexRef.current;
        if (currentIndex < answerRef.current.length) {
          setAnswerFlow(
            (prev) => prev + answerRef.current.charAt(currentIndex)
          );
          textIndexRef.current += 1;
        } else {
          clearInterval(timerRef.current);
          setStage(5); // 进入打字完成阶段
        }
      }, 100);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [stage]);

  const scrollToHistoryItem = (index) => {
    const targetElement = document.getElementById(`history-item-${index}`);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  //刷新界面后，等DOM更新完成再滚动，不然位置不正确
  useLayoutEffect(() => {
    if (stage === 6 && activeIndex >= 0) {
      const timer = setTimeout(() => {
        scrollToHistoryItem(activeIndex);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [activeIndex, stage]);

  useEffect(() => {
    if (stage === 2) {
      const timer = setTimeout(() => {
        setStage(3);
        setgreetingAlreadyOut(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [stage]);

  //存储
  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem("sidebarTitles", JSON.stringify(sidebarTitles));
  }, [sidebarTitles]);

  return (
    <div className={styles.gridContainer}>
      <div className={styles.leftSide}>
        <Sidebar
          titles={sidebarTitles}
          activeIndex={activeIndex}
          onActiveIndex={(index) => {
            setActiveIndex(index);
          }}
          onStageBack={setStage}
          stage={stage}
          onHistoryClear={setHistory}
          onTitleClear={setSidebarTitles}
          onGreetingReset={setgreetingAlreadyOut}
        />
      </div>
      <div className={styles.rightTop}>新功能菜单</div>
      <div className={styles.rightMiddle}>
        {(stage === 1 || stage == 2) && !greetingAlreadyOut && (
          <Greeting stage={stage} />
        )}
        {history.slice(0, -1).map((item, index) => (
          //历史对话"留"在界面上，除非点侧边栏不滚动。最后一项去掉防止答案生成完后出现两遍新对话
          <div
            className={styles.couple}
            key={index}
            id={`history-item-${index}`}
          >
            <OutputBox stage={stage} ifHistory={true} displayText={item.user} />
            <AnswerBox stage={stage} ifHistory={true} answerFlow={item.ai} />
          </div>
        ))}
        {
          //新的阶段3需要拿出上一次打印
          (stage === 3 || stage === 6) &&
            history.length > 0 &&
            history.slice(-1).map((item, index) => (
              <div
                className={styles.couple}
                key={index}
                id={`history-item-${history.length - 1}`}
              >
                <OutputBox
                  stage={stage}
                  ifHistory={true}
                  displayText={item.user}
                />
                <AnswerBox
                  stage={stage}
                  ifHistory={true}
                  answerFlow={item.ai}
                />
              </div>
            ))
        }
        <div
          className={styles.couple}
          id={`history-item-${history.length - 1}`}
        >
          <OutputBox
            stage={stage}
            ifHistory={false}
            displayText={displayText}
          />
          <AnswerBox
            stage={stage}
            ifHistory={false}
            answerFlow={answerFlow}
            handleReGen={handleReGen}
            //最新一次对话，触发滚动
          />
        </div>
      </div>
      <div className={styles.rightBottom}>
        <InputBox
          text={text}
          stage={stage}
          onTextChange={handleTextChange}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
