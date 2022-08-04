import GUI from "lil-gui";
import hljs from "highlight.js";
import typescript from "highlight.js/lib/languages/typescript";
import "highlight.js/styles/github-dark.css";
import _code from "../app.vue?raw";
hljs.registerLanguage("typescript", typescript);
const doc = document.getElementById("doc") as HTMLDivElement;
const code = hljs.highlight("typescript", _code).value;
doc.children[0].innerHTML = code;
doc.style.display = "none";
const gui = new GUI({
  title: "控制面板",
});
gui
  .add(
    {
      案例代码: false,
    },
    "案例代码"
  )
  .onChange((val: boolean) => {
    doc.style.display = val ? "" : "none";
  });
export { gui };
