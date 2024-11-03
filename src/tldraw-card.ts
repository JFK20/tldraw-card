/* eslint-disable @typescript-eslint/no-explicit-any */
import { LitElement, html, TemplateResult, css, PropertyValues, CSSResultGroup } from 'lit';
import { customElement, property, state } from 'lit/decorators';
import {
  HomeAssistant,
  hasConfigOrEntityChanged,
  hasAction,
  ActionHandlerEvent,
  handleAction,
  LovelaceCardEditor,
  getLovelace,
} from 'custom-card-helpers'; // This is a community maintained npm module with common helper functions/types. https://github.com/custom-cards/custom-card-helpers

import type { TldrawCardConfig } from './types';
import { CARD_VERSION } from './const';
import { Tldraw } from 'tldraw';
import 'tldraw/tldraw.css';

/* eslint no-console: 0 */
console.info(
  `%c  TLDRAW-CARD \n%c`,
  'color: orange; font-weight: bold; background: black',
  'color: white; font-weight: bold; background: dimgray',
);

// This puts your card into the UI card picker dialog
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: 'tldraw-card',
  name: 'tldraw Card',
  description: 'A template custom card for you to create something awesome',
});

// TODO Name your custom element
@customElement('tldraw-card')
export class TldrawCard extends LitElement {
  public static getStubConfig(): Record<string, unknown> {
    return {};
  }

  // TODO Add any properities that should cause your element to re-render here
  // https://lit.dev/docs/components/properties/
  @property({ attribute: false }) public hass!: HomeAssistant;

  @state() private config!: TldrawCardConfig;

  // https://lit.dev/docs/components/properties/#accessors-custom
  public setConfig(config: TldrawCardConfig): void {
    // TODO Check for required fields and that they are of the proper format
    if (!config) {
      throw new Error("Invalid configuration");
    }

    if (config.test_gui) {
      getLovelace().setEditMode(true);
    }

    this.config = {
      name: 'tldraw',
      ...config,
    };
  }

  // https://lit.dev/docs/components/lifecycle/#reactive-update-cycle-performing
  protected shouldUpdate(changedProps: PropertyValues): boolean {
    if (!this.config) {
      return false;
    }

    return hasConfigOrEntityChanged(this, changedProps, false);
  }

  // https://lit.dev/docs/components/rendering/
  protected render(): TemplateResult | void {
    // TODO Check for stateObj or other necessary things and render a warning if missing
    if (this.config.show_warning) {
      return this._showWarning("Show warning");
    }

    if (this.config.show_error) {
      return this._showError("Show error");
    }

    return html`
        <ha-card
                .header=${this.config.name}xm lns="http://www.w3.org/1999/html">
        <div>Endlich Funktoniert es</div>
        <div style={{position: 'fixed', inset: 0}}>
          <Tldraw class="class-test" onMount={(editor) => {
          editor.createShapes([{ id: 'shape:box1', type: 'text', x:100, y:100, props: { text: "ok" } },
          ])
            }}
          />
        </div>
      </ha-card>
    `;
  }

  private _handleAction(ev: ActionHandlerEvent): void {
    if (this.hass && this.config && ev.detail.action) {
      handleAction(this, this.hass, this.config, ev.detail.action);
    }
  }

  private _showWarning(warning: string): TemplateResult {
    return html` <hui-warning>${warning}</hui-warning> `;
  }

  private _showError(error: string): TemplateResult {
    const errorCard = document.createElement('hui-error-card');
    errorCard.setConfig({
      type: 'error',
      error,
      origConfig: this.config,
    });

    return html` ${errorCard} `;
  }

  // https://lit.dev/docs/components/styles/
  static get styles(): CSSResultGroup {
    return css`
      ha-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-width: 400px;
        min-height: 400px;
      }

      Tldraw {
        width: 100%;
        height: 100%;
        min-width: 400px;
        min-height: 400px;
      }

      .test-class {
        width: 100%;
        height: 100%;
        min-width: 400px;
        min-height: 400px;
      }
    `;
  }
}
