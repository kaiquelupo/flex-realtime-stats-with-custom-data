import React from 'react';
import { FlexPlugin } from 'flex-plugin';

import CustomQueueStatsViewContainer from './components/CustomQueueStatsView/CustomQueueStatsView.Container';

const PLUGIN_NAME = 'RealtimeQueuesRolesFilterPlugin';

export default class RealtimeQueuesRolesFilterPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof import('@twilio/flex-ui') }
   * @param manager { import('@twilio/flex-ui').Manager }
   */
  async init(flex, manager) {    
    flex.QueuesStatsView.Content.replace(<CustomQueueStatsViewContainer manager={manager} key="custom-queue-stats-view"/>);
  }

}
