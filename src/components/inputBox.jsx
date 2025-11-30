import "./inputBox.css";
//输入框
export function InputBox({ text, stage, onTextChange, onSubmit }) {
  //可以提交：AI没有在思考、答案已经生成完并且输入框有内容
  const canWeSubmit =
    !(text.trim() === "") && (stage == 1 || stage == 5 || stage == 6);
  const handleKeyDown = (e) => {
    // 按Enter键时
    if (e.key === "Enter") {
      // Shift+Enter：换行（保留默认行为）
      if (e.shiftKey) {
        return;
      }
      // 仅Enter：阻止换行，触发提交（需满足提交条件）
      e.preventDefault();
      canWeSubmit && onSubmit();
    }
  };
  //有输入并且：第一次使用\后面继续使用
  return (
    <div className="inputBoxWrapper">
      <textarea
        className="inputBox"
        placeholder="您有什么疑问?"
        value={text}
        onChange={(e) => {
          const sentValue = e.target.value;
          onTextChange(sentValue);
        }}
        onKeyDown={handleKeyDown}
      />
      <button
        className={`submitBtn ${stage == 3 || stage == 4}`} //改变一下悬停提示
        type="button"
        disabled={!canWeSubmit}
        onClick={onSubmit}
      >
        提交
      </button>
    </div>
  );
}
