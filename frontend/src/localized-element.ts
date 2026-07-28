import { LitElement } from "lit";

import { subscribeLanguage } from "./localize";

export abstract class LocalizedLitElement extends LitElement {
  private unsubscribeLanguage?: () => void;

  connectedCallback(): void {
    this.unsubscribeLanguage?.();
    this.unsubscribeLanguage = subscribeLanguage(() => this.requestUpdate());
    super.connectedCallback();
  }

  disconnectedCallback(): void {
    this.unsubscribeLanguage?.();
    this.unsubscribeLanguage = undefined;
    super.disconnectedCallback();
  }
}
