import { registerRootComponent } from 'expo';

import Application from './src/Application';

// registerRootComponent calls AppRegistry.registerComponent('main', () => Application);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(Application);
