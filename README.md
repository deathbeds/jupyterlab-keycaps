# jupyterlab-keycaps

Shows the current keyboard shortcuts in JupyterLab

## Prerequisites

* JupyterLab 0.32
* NodeJS 8 or 9

## Installation

```bash
jupyter labextension install @deathbeds/jupyterlab-keycaps
```

## Development

Do an initial build of the extension, link into JupyterLab and rebuild
Jupyterlab:

```bash
jlpm bootstrap
```

To rebuild the extension and JupyterLab:

```bash
jlpm build:all
```

To rebuild continuously:

```bash
jlpm watch
# and in another terminal
jupyter lab --watch
```

To apply source formatting and linting:

```bash
jlpm lint
```
