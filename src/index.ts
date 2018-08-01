const PREFIX = 'jp-KeyCaps';

export const CSS = {
  ICON: `jp-MaterialIcon ${PREFIX}Icon`,
  WIDGET: PREFIX,
  WIDGET_ID: PREFIX.toLowerCase(),
  TOOLBAR: `${PREFIX}-Toolbar`,
  SHORTCUTS: `${PREFIX}-Shortcuts`,
  STYLED: 'jp-mod-styled',
  EDITOR: `${PREFIX}-Editor`,
  ICON_SETTINGS: `jp-MaterialIcon ${PREFIX}SettingsIcon`,
};

export const PLUGIN_ID = 'jupyterlab-keycaps';

export const COMMANDS = {
  view: 'keycaps:view',
};
