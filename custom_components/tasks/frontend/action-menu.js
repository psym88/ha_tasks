import { t } from "./localize.js";

export function createActionMenu({ label, active = true, toggleActive, edit, remove }) {
  const dropdown = document.createElement("ha-dropdown");
  const button = document.createElement("ha-icon-button");
  const icon = document.createElement("ha-icon");
  const editItem = document.createElement("ha-dropdown-item");
  const activeItem = document.createElement("ha-dropdown-item");
  const removeItem = document.createElement("ha-dropdown-item");
  const stop = event => event.stopPropagation();

  button.className = "row-action-toggle";
  button.slot = "trigger";
  button.label = label;
  button.title = label;
  button.setAttribute("aria-label", label);
  icon.setAttribute("icon", "mdi:dots-vertical");
  button.append(icon);

  editItem.value = "edit";
  editItem.innerHTML = `<ha-icon slot="icon" icon="mdi:pencil"></ha-icon>${t("menu.edit")}`;
  activeItem.value = "active";
  activeItem.innerHTML = `<ha-icon slot="icon" icon="mdi:${active?"pause-circle-outline":"play-circle-outline"}"></ha-icon>${t(active?"menu.deactivate":"menu.activate")}`;
  removeItem.value = "delete";
  removeItem.setAttribute("variant", "danger");
  removeItem.innerHTML = `<ha-icon slot="icon" icon="mdi:delete"></ha-icon>${t("menu.delete")}`;

  dropdown.addEventListener("pointerdown", stop);
  dropdown.addEventListener("click", stop);
  dropdown.addEventListener("wa-select", event => {
    event.stopPropagation();
    const action = event.detail?.item?.value;
    if (action === "edit") edit();
    if (action === "active") toggleActive?.();
    if (action === "delete") remove();
  });
  dropdown.append(button, activeItem, editItem, removeItem);
  return dropdown;
}
