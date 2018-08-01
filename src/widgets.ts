import * as React from 'react';

import {CommandRegistry} from '@phosphor/commands';

import {VDomRenderer} from '@jupyterlab/apputils';

const h = React.createElement;

import {CSS} from '.';

import {KeyCapsModel} from './model';

export class KeyCaps extends VDomRenderer<KeyCapsModel> {
  protected render(): React.ReactElement<any>[] {
    this.addClass(CSS.WIDGET);
    this.title.label = 'Shortcuts';
    this.title.iconClass = CSS.ICON;
    this.title.closable = true;

    const m = this.model;
    if (!m) {
      return;
    }

    return [
      this.toolbar(m),
      ...(m.showEditor ? [this.renderEditor(m)] : []),
      this.shortCutList(m),
    ];
  }

  private onChangeSort = (evt: Event) => {
    this.model.sortOrder = (evt.currentTarget as HTMLSelectElement).value;
  }

  private onToggleDisabled = (evt: Event) => {
    this.model.showAll = (evt.currentTarget as HTMLInputElement).checked;
  }

  private onToggleSelectors = (evt: Event) => {
    this.model.showSelectors = (evt.currentTarget as HTMLInputElement).checked;
  }

  private onNewClicked = () => {
    this.model.showEditor = !this.model.showEditor;
  }

  protected toolbar(m: KeyCapsModel) {
    return h(
      'div',
      {className: CSS.TOOLBAR},
      this.renderSortOrder(m),
      this.renderSelectors(m),
      this.renderToggleDisabled(m),
      ...(m.settings ? [this.renderEditorButton()] : [])
    );
  }

  protected renderEditorButton() {
    return h('button', {
      onClick: this.onNewClicked,
      className: CSS.ICON_SETTINGS,
    });
  }

  protected renderEditor(m: KeyCapsModel) {
    return h(
      'div',
      {className: CSS.EDITOR},
      h(
        'label',
        null,
        h('span', null, 'Keys'),
        h('input', {
          placeholder: 'Keys',
          defaultValue: m.newShortcut.keys[0],
          onInput: (e) => {
            m.newShortcut.keys = [e.currentTarget.value];
          },
        })
      ),
      h(
        'label',
        null,
        h('span', null, 'Command'),
        h(
          'select',
          {
            defaultValue: m.newShortcut.command,
            onChange: (e) => {
              m.newShortcut.command = (e.currentTarget as HTMLSelectElement).value;
            },
          },
          ...[null, ...m.sortedCommands].map((cmd) => {
            return h('option', {value: cmd ? cmd.id : null},
              cmd ? cmd.label : 'Select command...');
          })
        )
      ),
      h(
        'label',
        null,
        h('span', null, 'Selector'),
        h('input', {
          placeholder: 'body',
          defaultValue: m.newShortcut.selector,
          onInput: (e) => {
            m.newShortcut.selector = e.currentTarget.value;
          },
        })
      ),
      h('ul', {className: CSS.SHORTCUTS}, this.renderShortcut(m, m.newShortcut, 0)),
      h('button', {disabled: !!m.newShortcut.error}, m.newShortcut.error || 'Create')
    );
  }

  protected renderSortOrder(m: KeyCapsModel) {
    return h(
      'label',
      null,
      'Sort By',
      h(
        'select',
        {
          defaultValue: m.sortOrder,
          onChange: this.onChangeSort,
        },
        ...Object.keys(m.sorts).map((v) => {
          return h('option', {value: v}, m.sorts[v]);
        })
      )
    );
  }

  protected renderToggleDisabled(m: KeyCapsModel) {
    return h(
      'label',
      null,
      h('input', {
        type: 'checkbox',
        value: m.showAll,
        onClick: this.onToggleDisabled,
      }),
      'Show All'
    );
  }

  protected renderSelectors(m: KeyCapsModel) {
    return h(
      'label',
      null,
      h('input', {
        type: 'checkbox',
        value: m.showSelectors,
        onClick: this.onToggleSelectors,
      }),
      'Selectors'
    );
  }

  protected shortCutList(m: KeyCapsModel) {
    return h(
      'ul',
      {className: CSS.SHORTCUTS},
      m.sortedShortcuts.map((b, key) => this.renderShortcut(m, b, key))
    );
  }

  protected renderShortcut(
    m: KeyCapsModel,
    b: CommandRegistry.IKeyBinding,
    key: number
  ) {
    const label = m.commands.label(b.command) || b.command;
    return h(
      'li',
      {key},
      h(
        'div',
        {key: 'keys'},
        ...b.keys.reduce((m, k) => {
          if (m.length) {
            m = m.concat(',');
          }
          return m.concat(
            h(
              'span',
              null,
              ...k.split(' ').map((k) => {
                return h(
                  'kbd',
                  null,
                  k
                    .replace('ArrowUp', '⯅')
                    .replace('ArrowDown', '⯆')
                    .replace('ArrowLeft', '⯇')
                    .replace('ArrowRight', '⯈')
                );
              })
            )
          );
        }, [])
      ),
      h('label', {key: 'label'}, label),
      ...(m.showSelectors ? [h('code', null, b.selector)] : [])
    );
  }
}
