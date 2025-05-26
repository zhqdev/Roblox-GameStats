const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
const fetch = require('node-fetch');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const TOKEN = 'TON_TOKEN_DISCORD';
const PLACE_ID = 'TON_PLACE_ID';
const GROUP_ID = 'TON_GROUP_ID';

async function getPlayerCount() {
    const res = await fetch(`https://games.roblox.com/v1/games?placeIds=${PLACE_ID}`);
    const data = await res.json();
    if (data.data && data.data.length > 0) {
        return data.data[0].playing || 0;
    }
    return 0;
}

async function getGroupMemberCount() {
    const res = await fetch(`https://groups.roblox.com/v1/groups/${GROUP_ID}`);
    const data = await res.json();
    return data.memberCount || 0;
}

async function updateStatus() {
    try {
        const players = await getPlayerCount();
        const members = await getGroupMemberCount();
        const statusText = `👥 ${players} joueurs | 🛡️ ${members} membres`;
        client.user.setActivity(statusText, { type: ActivityType.Watching });
    } catch (err) {
        console.error('Erreur lors de la mise à jour du status:', err);
    }
}

client.once('ready', () => {
    console.log(`✅ Connecté en tant que ${client.user.tag}`);
    updateStatus();
    setInterval(updateStatus, 5 * 60 * 1000);
});

client.login(TOKEN);
