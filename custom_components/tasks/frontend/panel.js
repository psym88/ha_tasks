export const VERSION = "0.5.7";
import { TasksPanel } from "./main.js";

TasksPanel.version = VERSION;
if(!customElements.get("tasks-panel"))customElements.define("tasks-panel",TasksPanel);
