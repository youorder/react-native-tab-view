import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { TabView, NavigationState } from 'react-native-tab-view';

type Route = { key: string; index: number };

type State = NavigationState<Route>;

type Action = { type: 'CHANGE_INDEX'; index: number };

export default function InfiniteTabsExample() {
  const [state, dispatch] = React.useReducer<React.Reducer<State, Action>>(
    (state, action) => {
      switch (action.type) {
        case 'CHANGE_INDEX': {
          const startIndex =
            action.index < state.index
              ? state.routes[0].index - 1
              : state.routes[1].index;

          return {
            index: state.index,
            routes: [startIndex, startIndex + 1, startIndex + 2].map(i => ({
              key: String(i),
              index: i,
            })),
          };
        }
        default:
          return state;
      }
    },
    {
      index: 1,
      routes: [
        { key: '0', index: 0 },
        { key: '1', index: 1 },
        { key: '2', index: 2 },
      ],
    }
  );

  return (
    <TabView
      renderTabBar={() => null}
      renderScene={({ route }) => (
        <View style={styles.page}>
          <Text style={styles.label}>{route.key}</Text>
        </View>
      )}
      navigationState={state}
      onIndexChange={index => dispatch({ type: 'CHANGE_INDEX', index })}
    />
  );
}

InfiniteTabsExample.title = 'Infinite pages';

const styles = StyleSheet.create({
  page: {
    flex: 1,
    margin: 16,
    borderColor: 'black',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 24,
  },
});
