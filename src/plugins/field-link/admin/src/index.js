import pluginPkg from '../../package.json';
import pluginId from './pluginId';
import lifecycles from './lifecycles';
import trads from './translations';

import Link from './components/Link';

export default (strapi) => {
  const pluginDescription = pluginPkg.strapi.description || pluginPkg.description;
  const { icon, name } = pluginPkg.strapi;

  const plugin = {
    blockerComponent: null,
    blockerComponentProps: {},
    description: pluginDescription,
    icon,
    id: pluginId,
    initializer: () => null,
    injectedComponents: [],
    isReady: true,
    isRequired: pluginPkg.strapi.required || false,
    layout: null,
    lifecycles,
    mainComponent: null,
    name,
    preventComponentRendering: false,
    trads,
  };

  strapi.registerField({ type: 'link', Component: Link });

  return strapi.registerPlugin(plugin);
};
