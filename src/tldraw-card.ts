/* eslint-disable @typescript-eslint/no-explicit-any */
import { LitElement, html, TemplateResult, css, PropertyValues, CSSResultGroup } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
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
      name: 'tldraw-card-config',
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
    /*if (this.config.show_warning) {
    return this._showWarning("Show warning iwas mit config");
  }

  if (this.config.show_error) {
  return this._showError("Show error iwas mit config");
  }*/

    try {
      return html`
      <ha-card .header=${this.config.name}>
        <div id="tldraw-wrapper" style="position: relative; width: 100%; height: 100%;">
          <Tldraw class="class-test" .onMount=${(editor: any) => this._onMount(editor)} />
        </div>
      </ha-card>
    `;
    } catch (error) {
      console.error("Render error:", error);
      return this._showError("Render error");
    }
  }

  private _onMount(editor: any) {
    editor.createShapes([{ id: 'shape:box1', type: 'text', x: 100, y: 100, props: { text: 'ok' } }]);
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

      #tldraw-wrapper {
        width: 100%;
        height: 100%;
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
