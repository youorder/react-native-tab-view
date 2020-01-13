import * as React from 'react';
import { isValidElementType } from 'react-is';
import SceneMap from './SceneMap';
import { Route } from './types';

type TabRoute = Route & {
  component: React.ComponentType<any>;
};

type Config = {
  [key: string]: React.ComponentType<any> | Omit<TabRoute, 'key'>;
};

export default function useTabs(config: Config) {
  const [index, setIndex] = React.useState(0);

  const routes = Object.keys(config).map(key => {
    const route = isValidElementType(config[key])
      ? ({ component: config[key] } as Omit<TabRoute, 'key'>)
      : (config[key] as Omit<TabRoute, 'key'>);

    const title = route.title !== undefined ? route.title : key;

    return { ...route, title, key } as TabRoute;
  });

  if (routes.length === 0) {
    throw new Error('No routes found in provided config!');
  }

  return {
    navigationState: {
      index: Math.min(index, routes.length - 1),
      routes,
    },
    onIndexChange: setIndex,
    renderScene: SceneMap(
      routes.reduce<{ [key: string]: React.ComponentType<any> }>(
        (acc, route) => {
          acc[route.key] = route.component;

          return acc;
        },
        {}
      )
    ),
  };
}
