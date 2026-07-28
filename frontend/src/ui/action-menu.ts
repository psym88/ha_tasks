import { LitElement, css, html } from "lit";

import { elementName } from "../version";

export interface ActionMenuItem {
  label: string;
  value: string;
  destructive?: boolean;
  disabled?: boolean;
}

class TasksActionMenu extends LitElement {
  static properties = {
    items: { attribute: false },
    label: {},
    open: { state: true },
  };

  static styles = css`
    :host {
      display: inline-flex;
    }

    button {
      color: var(--primary-text-color);
      background: transparent;
      border: 0;
      font: inherit;
      cursor: pointer;
    }

    .trigger {
      width: 40px;
      height: 40px;
      padding: 0;
      border-radius: 50%;
      color: var(--secondary-text-color);
      font-size: 24px;
      line-height: 1;
    }

    .trigger:hover,
    .trigger:focus-visible {
      background: var(--secondary-background-color);
    }

    .trigger:focus-visible,
    .item:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: -2px;
    }

    .menu {
      position: fixed;
      inset: auto;
      min-width: 176px;
      max-width: min(280px, calc(100vw - 16px));
      box-sizing: border-box;
      margin: 0;
      padding: 6px 0;
      color: var(--primary-text-color);
      background: var(--card-background-color);
      border: 1px solid var(--divider-color);
      border-radius: var(--ha-card-border-radius, 12px);
      box-shadow: var(
        --ha-card-box-shadow,
        0 6px 24px rgba(0, 0, 0, 0.28)
      );
      font-family: var(--ha-font-family-body, sans-serif);
    }

    .item {
      display: block;
      width: 100%;
      min-height: 40px;
      padding: 8px 16px;
      text-align: left;
    }

    .item:hover:not(:disabled) {
      background: var(--secondary-background-color);
    }

    .item:disabled {
      color: var(--disabled-text-color);
      cursor: default;
    }

    .destructive {
      color: var(--error-color);
    }
  `;

  declare items: ActionMenuItem[];
  declare label: string;
  declare open: boolean;

  private readonly reposition = (): void => this.positionMenu();

  constructor() {
    super();
    this.items = [];
    this.label = "Actions";
    this.open = false;
  }

  disconnectedCallback(): void {
    this.stopTrackingPosition();
    super.disconnectedCallback();
  }

  private get trigger(): HTMLButtonElement | null {
    return this.renderRoot.querySelector(".trigger");
  }

  private get menu(): HTMLElement | null {
    return this.renderRoot.querySelector(".menu");
  }

  private toggleMenu(event: Event): void {
    event.stopPropagation();
    const menu = this.menu;
    if (!menu) {
      return;
    }
    if (this.open) {
      menu.hidePopover();
    } else {
      menu.showPopover();
      this.positionMenu();
      this.menuItems()[0]?.focus();
    }
  }

  private positionMenu(): void {
    const trigger = this.trigger;
    const menu = this.menu;
    if (!trigger || !menu) {
      return;
    }
    const anchor = trigger.getBoundingClientRect();
    const bounds = menu.getBoundingClientRect();
    const viewport = window.visualViewport;
    const leftEdge = viewport?.offsetLeft || 0;
    const topEdge = viewport?.offsetTop || 0;
    const rightEdge = leftEdge + (viewport?.width || window.innerWidth);
    const bottomEdge = topEdge + (viewport?.height || window.innerHeight);
    const margin = 8;
    const gap = 4;
    const left = Math.min(
      Math.max(leftEdge + margin, anchor.right - bounds.width),
      rightEdge - bounds.width - margin,
    );
    const below = anchor.bottom + gap;
    const top =
      below + bounds.height <= bottomEdge - margin
        ? below
        : Math.max(topEdge + margin, anchor.top - bounds.height - gap);
    menu.style.left = `${left}px`;
    menu.style.top = `${top}px`;
  }

  private menuItems(): HTMLButtonElement[] {
    return [
      ...this.renderRoot.querySelectorAll<HTMLButtonElement>(
        ".item:not(:disabled)",
      ),
    ];
  }

  private moveFocus(event: KeyboardEvent): void {
    const items = this.menuItems();
    if (!items.length) {
      return;
    }
    const current = items.indexOf(
      (this.renderRoot as ShadowRoot).activeElement as HTMLButtonElement,
    );
    let next: number | undefined;
    if (event.key === "ArrowDown") {
      next = (current + 1) % items.length;
    } else if (event.key === "ArrowUp") {
      next = (current - 1 + items.length) % items.length;
    } else if (event.key === "Home") {
      next = 0;
    } else if (event.key === "End") {
      next = items.length - 1;
    }
    if (next !== undefined) {
      event.preventDefault();
      items[next].focus();
    }
  }

  private choose(event: Event, item: ActionMenuItem): void {
    event.stopPropagation();
    this.menu?.hidePopover();
    this.trigger?.focus();
    this.dispatchEvent(
      new CustomEvent("tasks-action", {
        bubbles: true,
        composed: true,
        detail: item.value,
      }),
    );
  }

  private trackPosition(): void {
    window.addEventListener("resize", this.reposition);
    window.addEventListener("scroll", this.reposition, true);
    window.visualViewport?.addEventListener("resize", this.reposition);
    window.visualViewport?.addEventListener("scroll", this.reposition);
  }

  private stopTrackingPosition(): void {
    window.removeEventListener("resize", this.reposition);
    window.removeEventListener("scroll", this.reposition, true);
    window.visualViewport?.removeEventListener("resize", this.reposition);
    window.visualViewport?.removeEventListener("scroll", this.reposition);
  }

  protected render() {
    return html`
      <button
        class="trigger"
        type="button"
        aria-haspopup="menu"
        aria-expanded=${this.open}
        aria-label=${this.label}
        @click=${(event: Event) => this.toggleMenu(event)}
      >
        ⋮
      </button>
      <div
        class="menu"
        popover="auto"
        role="menu"
        @click=${(event: Event) => event.stopPropagation()}
        @keydown=${(event: KeyboardEvent) => this.moveFocus(event)}
        @toggle=${(event: Event) => {
          const open =
            (event as Event & { newState: string }).newState === "open";
          this.open = open;
          if (open) {
            this.trackPosition();
          } else {
            this.stopTrackingPosition();
          }
        }}
      >
        ${this.items.map(
          (item) => html`
            <button
              class=${item.destructive ? "item destructive" : "item"}
              type="button"
              role="menuitem"
              ?disabled=${item.disabled}
              @click=${(event: Event) => this.choose(event, item)}
            >
              ${item.label}
            </button>
          `,
        )}
      </div>
    `;
  }
}

export const actionMenuElementName = elementName("action-menu");

if (!customElements.get(actionMenuElementName)) {
  customElements.define(actionMenuElementName, TasksActionMenu);
}
