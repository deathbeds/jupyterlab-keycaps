import {JupyterLab, JupyterLabPlugin} from '@jupyterlab/application';

import {ICommandPalette} from '@jupyterlab/apputils';

// import {ISettingRegistry} from '@jupyterlab/coreutils';

import '../style/index.css';
import {PLUGIN_ID, CSS, COMMANDS} from '.';
import {KeyCaps, KeyCapsModel} from './widgets';

function activate(
  lab: JupyterLab,
  palette: ICommandPalette
  // settings: ISettingRegistry*/
): void {
  const {commands} = lab;
  commands.addCommand(COMMANDS.view, {
    label: 'View Keyboard Shortcuts',
    iconClass: CSS.ICON,
    execute: () => {
      const w = new KeyCaps();
      w.model = new KeyCapsModel();
      w.model.commands = commands;
      w.id = CSS.WIDGET_ID;
      lab.shell.addToMainArea(w, {mode: 'split-right'});
    },
  });

  palette.addItem({
    category: 'Keyboard Shortcuts',
    command: COMMANDS.view,
  });
}

/**
 * Initialization data for the jupyterlab-keycaps extension.
 */
const extension: JupyterLabPlugin<void> = {
  id: PLUGIN_ID,
  autoStart: true,
  requires: [
    ICommandPalette,
    //  ISettingRegistry,
  ],
  activate,
};

export default extension;
