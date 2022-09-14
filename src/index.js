import { docReady } from "./lib/helpers";
import { generateCharts } from "./lib/drawChart";
import { element } from "./lib/components/element";

function app() {
  const buttonText = element({
    tag: "div",
    classes: ["game-tools-bg"],
    children: ['Stats']
  });

  const button = element({
    tag: "div",
    classes: ["game-tools-btn", "enchanced-stats"],
    children: [buttonText],
  });

  button.onclick = () => {
    generateCharts();
  };

  const section = element({
    tag: "section",
    children: [button],
  });

  const menu = document.getElementById("game-menu-controls");
  menu.prepend(section);
}

docReady(app());
