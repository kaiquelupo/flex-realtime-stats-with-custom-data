import React from 'react';
import { Grid } from '@material-ui/core';
import {
  ActiveTasks,
  WaitingTasks,
  AgentByActivityChart
} from './WorkspaceStatsView.Components';
import { get } from 'lodash';
import { Wrapper } from './WorkspaceStatsView.Styles';
import { numbersPerChannel, showNumbersPerChannel, channels, getEmoji, getBPO } from '../../../helpers';

const WorkspaceStatsView = ({ stats, manager }) => {

  let active = {};
  let waiting = {};

  const bpo = getBPO(manager);
  
  Object.keys(stats).forEach((queue) => {

    numbersPerChannel(bpo, active, waiting, stats[queue], true);

  });

  return (
    <Wrapper container spacing={16} style={{ padding: '0px 16px' }}>
      <Grid item xs={4}>
        <ActiveTasks
          count={
            showNumbersPerChannel(active, true)
          }
        />
      </Grid>
      <Grid item xs={4}>
        <WaitingTasks
          count={
            showNumbersPerChannel(waiting, true)
          }
        />
      </Grid>
      <Grid item xs={4}>
        <AgentByActivityChart
          availableAgents={
            get(stats, `general.${bpo}.workers.available.total`, 0)
          }
          offlineAgents={
            get(stats, `general.${bpo}.workers.offline.total`, 0)
          }
          unavailableAgents={
            get(stats, `general.${bpo}.workers.unavailable.total`, 0)
          }
          bottom={
            <div style={{ paddingTop: '5px', borderTop: "1px solid #CCC", marginTop: "15px"}}>
              {channels.map(channel =>  
                <div style={{ marginTop: "5px"}}>
                  <div style={{ float: "left", fontSize: "20px", width: "20px", margin: "5px 10px 0 0" }}>
                    {getEmoji(channel)}
                  </div>
                  <AgentByActivityChart
                    availableAgents={
                      get(stats, `general.${bpo}.workers.available.${channel}`, 0)
                    }
                    offlineAgents={
                      get(stats, `general.${bpo}.workers.offline.${channel}`, 0)
                    }
                    unavailableAgents={
                      get(stats, `general.${bpo}.workers.unavailable.${channel}`, 0)
                    }
                  />

                </div>

              )}
            </div>
          }
          showChart={true}
        />
      </Grid>
    </Wrapper>
  );
};

export default WorkspaceStatsView;
