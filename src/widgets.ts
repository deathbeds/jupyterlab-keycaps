import * as React from 'react';
import {CommandRegistry} from '@phosphor/commands';

import {VDomModel, VDomRenderer} from '@jupyterlab/apputils';

const h = React.createElement;

import {CSS} from '.';

export class KeyCapsModel extends VDomModel {
  private _commands: CommandRegistry;
  private _showAll: boolean;

  dispose() {
    this.commands = null;
    super.dispose();
  }

  get showAll() {
    return this._showAll;
  }

  set showAll(showAll) {
    this._showAll = showAll;
    this.stateChanged.emit(void 0);
  }

  get commands() {
    return this._commands;
  }

  set commands(commands) {
    if (this.commands) {
      this.commands.keyBindingChanged.disconnect(this._onCommandsChanged, this);
      this.commands.commandChanged.disconnect(this._onCommandsChanged, this);
    }
    this._commands = commands;
    commands.keyBindingChanged.connect(this._onCommandsChanged, this);
    commands.commandChanged.connect(this._onCommandsChanged, this);
  }

  get shortcuts() {
    const cmds = this._commands;
    if (this._showAll) {
      return cmds.keyBindings;
    }
    return cmds.keyBindings.filter((kb) => {
      const c = kb.command;
      try {
        if (!cmds.isVisible(c) || !cmds.isEnabled(c) || !cmds.label(c)) {
          return false;
        }
      } catch (err) {
        return false;
      }
      return true;
    });
  }

  private _onCommandsChanged() {
    this.stateChanged.emit(void 0);
  }
}

export class KeyCaps extends VDomRenderer<KeyCapsModel> {
  protected render(): React.ReactElement<any>[] {
    this.addClass(CSS.WIDGET);
    this.title.label = 'Shortcuts';
    this.title.iconClass = CSS.ICON;

    const m = this.model;
    if (!m) {
      return;
    }

    return [this.toolbar(m), this.shortCutList(m)];
  }

  protected toolbar(m: KeyCapsModel) {
    let toggleDisabled = (evt: Event) => {
      m.showAll = (evt.currentTarget as HTMLInputElement).checked;
    };

    return h(
      'div',
      {className: CSS.TOOLBAR},
      h(
        'label',
        null,
        h('input', {type: 'checkbox', value: m.showAll, onClick: toggleDisabled}),
        'Show disabled'
      )
    );
  }

  protected shortCutList(m: KeyCapsModel) {
    return h(
      'ul',
      {className: CSS.SHORTCUTS},
      m.shortcuts.map((b, key) => {
        const label = m.commands.label(b.command) || b.command;
        return h(
          'li',
          {key},
          h(
            'div',
            {key: 'keys'},
            ...b.keys.reduce((m, k, i) => {
              if (m.length) {
                m = m.concat(',');
              }
              return m.concat(k.split(' ').map((k) => h('kbd', null, k)));
            }, [])
          ),
          h('label', {key: 'label'}, label)
        );
      })
    );
  }
}
