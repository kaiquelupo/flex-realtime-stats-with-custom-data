import { get } from 'lodash';
import React from 'react';
import { supervisors } from "../config/supervisors.json";

const { REACT_APP_CHANNELS: CHANNELS, REACT_APP_ACTIVITIES: ACTIVITIES } = process.env

export const channels = CHANNELS ? CHANNELS.split(",") : [];
export const activities = ACTIVITIES ? ACTIVITIES.split(",") : [];

export const getBPO = (manager) => {
    const { location, email } = manager.workerClient.attributes;

    const supervisor = supervisors.find(
        supervisor => supervisor.email === email
    ) || {};

    return supervisor.full_access ? "all" : (location || "rest")
}

export const numbersPerChannel = (bpo, active, waiting, obj, loaded) => {

    if(loaded) {

        channels.forEach((channel) => {

            active[channel] = 
                get(obj, `${bpo}.tasks.assigned.${channel}`, 0) + 
                get(obj, `${bpo}.tasks.wrapping.${channel}`, 0)

            waiting[channel] = 
                get(obj, `${bpo}.tasks.pending.${channel}`, 0) + 
                get(obj, `${bpo}.tasks.reserved.${channel}`, 0) + 
                (["rest", "all"].includes(bpo) ? 0 :  get(obj, `rest.tasks.pending.${channel}`, 0))

                    
        });
            
    } 

}

export const getEmoji = (channel) => {

    const emojis = {
        voice: "🗣️ ",
        chat: "💬 ",
        all: "📈 "
    }
   
    return emojis[channel] || " ";
}

export const showNumbersPerChannel = (values, showEmoji, showTotal = true) => {

    let total = 0;

    let numbers = channels.map(channel => { 

        total = total + (values[channel] || 0);

        return <div>{(showEmoji ? getEmoji(channel) : "") + (values[channel] === undefined ? "-" : values[channel])}</div>
    });

    if(showTotal){
        numbers = [
            <div>{total}</div>,
            ...numbers
        ]
    }

    return numbers;

}
  
