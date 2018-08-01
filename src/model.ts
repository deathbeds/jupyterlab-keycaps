import {CommandRegistry} from '@phosphor/commands';

import {VDomModel} from '@jupyterlab/apputils';
import {ISettingRegistry} from '@jupyterlab/coreutils';

const SORT: {[key: string]: string} = {
  label: 'Label',
  keys: 'Keys',
  selector: 'Selector',
};

export class ShortcutModel extends VDomModel implements CommandRegistry.IKeyBinding {
  private _command = '';
  private _keys: string[] = [];
  private _selector = '';

  args: any = null;

  get command() {
    return this._command;
  }
  set command(command) {
    this._command = command;
    this.stateChanged.emit(void 0);
  }

  get selector() {
    return this._selector;
  }
  set selector(selector) {
    this._selector = selector;
    this.stateChanged.emit(void 0);
  }

  get keys() {
    return this._keys;
  }
  set keys(keys) {
    this._keys = keys;
    this.stateChanged.emit(void 0);
  }

  get error() {
    const {keys, command} = this;
    if (!keys.length) {
      return 'At least one key must be provided';
    }
    if (!command) {
      return 'Select a command';
    }
  }
}

export class KeyCapsModel extends VDomModel {
  private _commands: CommandRegistry;
  private _showAll = false;
  private _showSelectors = false;
  private _sortOrder = 'label';
  private _settings: ISettingRegistry.ISettings;
  private _showEditor = false;
  private _newShortcut: ShortcutModel;

  dispose() {
    this.commands = null;
    this._newShortcut!.dispose();
    super.dispose();
  }

  get showAll() {
    return this._showAll;
  }

  set showAll(showAll) {
    this._showAll = showAll;
    this.stateChanged.emit(void 0);
  }

  get settings() {
    return this._settings;
  }

  set settings(settings) {
    this._settings = settings;
    this.stateChanged.emit(void 0);
  }

  get showSelectors() {
    return this._showSelectors;
  }

  set showSelectors(showSelectors) {
    this._showSelectors = showSelectors;
    this.stateChanged.emit(void 0);
  }

  get commands() {
    return this._commands;
  }

  get showEditor() {
    return this._showEditor;
  }

  set showEditor(showEditor) {
    this._showEditor = showEditor;
    if (!showEditor) {
      this._newShortcut!.dispose();
      this._newShortcut = null;
    } else {
      this._newShortcut = new ShortcutModel();
      this._newShortcut.stateChanged.connect(
        () => this.stateChanged.emit(void 0),
        this
      );
    }
    this.stateChanged.emit(void 0);
  }

  get newShortcut() {
    return this._newShortcut;
  }

  get sorts() {
    return SORT;
  }

  get sortOrder() {
    return this._sortOrder;
  }

  set sortOrder(sortOrder) {
    this._sortOrder = sortOrder;
    this.stateChanged.emit(void 0);
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

  get sortedShortcuts() {
    let shortcuts = Array.from(this.shortcuts);

    shortcuts.sort((a, b) => {
      switch (this.sortOrder) {
        default:
        case 'label':
          return this.commands
            .label(a.command)
            .localeCompare(this.commands.label(b.command));
        case 'keys':
          return (
            a.keys.length - b.keys.length ||
            a.keys.join(',').length - b.keys.join(',').length ||
            a.keys.join(',').localeCompare(b.keys.join(','))
          );
        case 'selector':
          return a.selector.localeCompare(b.selector);
      }
    });
    return shortcuts;
  }

  get sortedCommands() {
    let commandIds = this.commands.listCommands();
    let labels: {[key: string]: string} = {};
    commandIds.sort((a, b) => {
      let al = labels[a] || (labels[a] = this.commands.label(a) || a);
      let bl = labels[b] || (labels[b] = this.commands.label(b) || b);
      return al.localeCompare(bl);
    });
    return commandIds.map((id) => {
      return {id, label: labels[id]};
    });
  }

  private _onCommandsChanged() {
    this.stateChanged.emit(void 0);
  }
}
