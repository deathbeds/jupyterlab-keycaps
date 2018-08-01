import {JupyterLab, JupyterLabPlugin} from '@jupyterlab/application';

import {ICommandPalette} from '@jupyterlab/apputils';

import {ISettingRegistry} from '@jupyterlab/coreutils';

import '../style/index.css';
import {PLUGIN_ID, CSS, COMMANDS} from '.';
import {KeyCaps} from './widgets';
import {KeyCapsModel} from './model';

function activate(
  lab: JupyterLab,
  palette: ICommandPalette,
  settingsRegistry: ISettingRegistry
): void {
  const {commands} = lab;
  let viewer: KeyCaps;

  commands.addCommand(COMMANDS.view, {
    label: 'View Keyboard Shortcuts',
    iconClass: CSS.ICON,
    execute: async () => {
      if (viewer != null) {
        viewer.dispose();
        viewer = null;
        return;
      }
      viewer = new KeyCaps();
      viewer.model = new KeyCapsModel();
      viewer.model.commands = commands;
      viewer.id = CSS.WIDGET_ID;
      lab.shell.addToMainArea(viewer, {mode: 'split-right'});
      let settings: ISettingRegistry.ISettings;
      try {
        settings = await settingsRegistry.load(
          '@jupyterlab/shortcuts-extension:plugin'
        );
      } catch (err) {
        console.warn(
          `Shortcut settings couldn't be loaded, won't be able to customize`
        );
      }
      viewer.model.settings = settings;
    },
  });

  palette.addItem({
    category: 'Keyboard Shortcuts',
    command: COMMANDS.view,
  });

  commands.addKeyBinding({
    keys: ['Accel Shift /'],
    selector: 'body',
    command: COMMANDS.view,
  });
}

/**
 * Initialization data for the jupyterlab-keycaps extension.
 */
const extension: JupyterLabPlugin<void> = {
  id: PLUGIN_ID,
  autoStart: true,
  requires: [ICommandPalette, ISettingRegistry],
  activate,
};

export default extension;
