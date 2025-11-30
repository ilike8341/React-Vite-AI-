import "./answerBox.css";
import { ScrollAnchor } from "./ScrollAnchor";
import { MarkdownRenderer } from "./MarkdownRenderer";

export function AnswerBox({ stage, ifHistory, answerFlow, handleReGen }) {
  //第一次的输出，只在4、5阶段渲染
  if (!ifHistory && stage != 3 && stage != 4 && stage != 5) {
    return null;
  } else if (ifHistory && stage != 1) {
    return (
      <div className="answerBox">
        <MarkdownRenderer content={answerFlow} />
      </div>
    );
  }
  const handleCopy = async (text) => {
    await navigator.clipboard.writeText(text).catch((err) => console.log(err));
  };

  //历史一直渲染,除非清除后stage回1
  if (stage != 1) {
    return (
      <ScrollAnchor trigger={stage == 3 || stage == 4}>
        <div className="answerBox">
          {stage == 3 && "生成中……"}
          <MarkdownRenderer content={answerFlow} />
          <br />
          {stage === 5 && (
            <>
              <button
                className="copyButton"
                onClick={() => handleCopy(answerFlow)}
              >
                复制
              </button>
              <button className="reGenerateButton" onClick={handleReGen}>
                重新回答
              </button>
            </>
          )}
        </div>
      </ScrollAnchor>
    );
  }
}
