const express = require('express');
const cors = require('cors');
const path = require('path');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));

// Bot Status Storage (für Demo-Zwecke - in Produktion würde das aus einer Datenbank kommen)
let botStatus = {
    isOnline: true, // Für Demo auf true gesetzt
    lastSeen: Date.now(),
    startTime: Date.now() - (2 * 60 * 60 * 1000), // 2 Stunden Uptime für Demo
    totalUsers: 14,
    totalGroups: 36,
    totalPets: 4,
    version: '2.0.0'
};

// Get system stats
function getSystemStats() {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    
    return {
        ram: {
            total: Math.round(totalMem / 1024 / 1024 / 1024 * 100) / 100, // GB
            used: Math.round(usedMem / 1024 / 1024 / 1024 * 100) / 100, // GB
            free: Math.round(freeMem / 1024 / 1024 / 1024 * 100) / 100, // GB
            percentage: Math.round((usedMem / totalMem) * 100)
        },
        cpu: {
            model: os.cpus()[0].model,
            cores: os.cpus().length,
            platform: os.platform(),
            arch: os.arch()
        },
        uptime: os.uptime()
    };
}

// Get registered users count (Demo-Daten)
function getRegisteredUsers() {
    return 14; // Demo-Wert
}

// Get all commands
function getAllCommands() {
    return {
        economy: [
            { cmd: '/balance [@user]', desc: 'Zeige Kontostand' },
            { cmd: '/bal [@user]', desc: 'Zeige Kontostand (Kurzform)' },
            { cmd: '/daily', desc: 'Hole dein Daily' },
            { cmd: '/work', desc: 'Arbeite (Cooldown 15min)' },
            { cmd: '/pay @user <betrag>', desc: 'Zahle Coins' },
            { cmd: '/leaderboard', desc: 'Bestenliste' },
            { cmd: '/level [@user]', desc: 'Level & XP anzeigen' },
            { cmd: '/xp [@user]', desc: 'XP anzeigen' },
            { cmd: '/achievements [@user]', desc: 'Erfolge anzeigen' },
            { cmd: '/setrand <1-5>', desc: 'Premium-Rahmen auswählen' }
        ],
        games: [
            { cmd: '/coinflip <betrag> <kopf|zahl>', desc: 'Münzwurf-Spiel' },
            { cmd: '/dice <betrag> <1-6>', desc: 'Würfel-Spiel' },
            { cmd: '/slots <betrag>', desc: 'Spielautomaten' },
            { cmd: '/lotto buy [n1,n2,..]', desc: 'Lotto-Ticket kaufen' },
            { cmd: '/lotto draw', desc: 'Lotto ziehen (Admin)' }
        ],
        shop: [
            { cmd: '/shop', desc: 'Shop anzeigen' },
            { cmd: '/buy <itemId>', desc: 'Item kaufen' },
            { cmd: '/inventory', desc: 'Inventar anzeigen' },
            { cmd: '/inv', desc: 'Inventar anzeigen (Kurzform)' },
            { cmd: '/sell <itemId>', desc: 'Item verkaufen' },
            { cmd: '/sell house', desc: 'Haus verkaufen' },
            { cmd: '/use <itemId>', desc: 'Item verwenden' }
        ],
        jobs: [
            { cmd: '/jobs', desc: 'Verfügbare Jobs anzeigen' },
            { cmd: '/job', desc: 'Aktuellen Job anzeigen' },
            { cmd: '/job take <jobId>', desc: 'Job annehmen' },
            { cmd: '/job quit', desc: 'Job kündigen' },
            { cmd: '/take job <jobId>', desc: 'Job annehmen (Alternative)' }
        ],
        houses: [
            { cmd: '/house list', desc: 'Verfügbare Häuser anzeigen' },
            { cmd: '/house buy <houseId>', desc: 'Haus kaufen' },
            { cmd: '/house info', desc: 'Haus-Informationen anzeigen' }
        ],
        pets: [
            { cmd: '/petshop', desc: 'Pet Shop anzeigen' },
            { cmd: '/petbuy <typ> <name>', desc: 'Pet kaufen (z.B. katze Fluffy)' },
            { cmd: '/pet', desc: 'Pet Status anzeigen' },
            { cmd: '/pets', desc: 'Alle deine Pets anzeigen' },
            { cmd: '/petfeed', desc: 'Pet füttern' },
            { cmd: '/petplay', desc: 'Mit Pet spielen' },
            { cmd: '/petclean', desc: 'Pet putzen' },
            { cmd: '/pettrain', desc: 'Pet trainieren' },
            { cmd: '/petheal', desc: 'Pet heilen' },
            { cmd: '/petdaily', desc: 'Tägliche Pet-Belohnung' },
            { cmd: '/petbattle @user', desc: 'Pet-Kampf starten' },
            { cmd: '/petrelease', desc: 'Pet freilassen' },
            { cmd: '/petleaderboard', desc: 'Pet-Rangliste' },
            { cmd: '/petachievements', desc: 'Pet-Erfolge anzeigen' }
        ],
        notes: [
            { cmd: '/note add <notiz>', desc: 'Neue Notiz hinzufügen' },
            { cmd: '/note list', desc: 'Alle Notizen anzeigen' },
            { cmd: '/note remove <id>', desc: 'Notiz per ID löschen' },
            { cmd: '/note clear', desc: 'Alle Notizen löschen' }
        ],
        sticker: [
            { cmd: '/sticker', desc: 'Bild zu Sticker konvertieren' }
        ],
        group: [
            { cmd: '/welcome <nachricht>', desc: 'Willkommensnachricht setzen (Admin)' },
            { cmd: '/goodbye <nachricht>', desc: 'Abschiedsnachricht setzen (Admin)' },
            { cmd: '/rules [set <text>]', desc: 'Gruppenregeln anzeigen/setzen (Admin)' },
            { cmd: '/stats', desc: 'Gruppenstatistiken anzeigen' },
            { cmd: '/afk [grund]', desc: 'AFK-Status setzen' },
            { cmd: '/setprefix <prefix>', desc: 'Gruppenprefix setzen (Admin)' },
            { cmd: '/prefix', desc: 'Aktuellen Prefix anzeigen' }
        ],
        moderation: [
            { cmd: '/warn @user [grund]', desc: 'Nutzer verwarnen (Admin)' },
            { cmd: '/delwarn @user', desc: 'Verwarnung löschen (Admin)' },
            { cmd: '/kick @user', desc: 'Nutzer kicken (Admin)' },
            { cmd: '/promote @user', desc: 'Zum Admin machen (Admin)' },
            { cmd: '/demote @user', desc: 'Admin-Rechte entziehen (Admin)' },
            { cmd: '/mute @user <minuten>', desc: 'Nutzer stummschalten (Admin)' },
            { cmd: '/unmute @user', desc: 'Stummschaltung aufheben (Admin)' },
            { cmd: '/mutes', desc: 'Stummgeschaltete Nutzer anzeigen (Admin)' },
            { cmd: '/tempban @user <minuten>', desc: 'Temporärer Bann (Admin)' },
            { cmd: '/lock', desc: 'Gruppe sperren (Admin)' },
            { cmd: '/unlock', desc: 'Gruppe entsperren (Admin)' },
            { cmd: '/autospam <an|aus>', desc: 'Autospam konfigurieren (Admin)' },
            { cmd: '/antispam <an|aus>', desc: 'Antispam konfigurieren (Admin)' },
            { cmd: '/badword <wort>', desc: 'Badword hinzufügen/entfernen (Admin)' },
            { cmd: '/nsfw <an|aus>', desc: 'NSFW-Filter konfigurieren (Admin)' }
        ],
        botmoderation: [
            { cmd: '/botban @user', desc: 'Bot-weiter Ban (Moderator+)' },
            { cmd: '/botunban @user', desc: 'Bot-Ban aufheben (Moderator+)' },
            { cmd: '/bottempban @user <min>', desc: 'Temporärer Bot-Ban (Moderator+)' },
            { cmd: '/botwarn @user <grund>', desc: 'Bot-Verwarnung (Moderator+)' },
            { cmd: '/botdelwarn @user', desc: 'Bot-Verwarnung löschen (Moderator+)' }
        ],
        owner: [
            { cmd: '/owner', desc: 'Bot-Owner anzeigen' },
            { cmd: '/setpremium @user', desc: 'Premium-Status setzen (Owner/Co-Owner)' },
            { cmd: '/removepremium @user', desc: 'Premium-Status entfernen (Owner/Co-Owner)' },
            { cmd: '/fixjobs', desc: 'Ungültige Jobs bereinigen (Moderator+)' },
            { cmd: '/logout', desc: 'Bot-Session beenden (Moderator+)' },
            { cmd: '/cmdlock <command>', desc: 'Command sperren (Moderator+)' },
            { cmd: '/cmdunlock <command>', desc: 'Command entsperren (Moderator+)' },
            { cmd: '/join <gruppenlink>', desc: 'Beitrittsanfrage senden' },
            { cmd: '/join allow <id>', desc: 'Beitrittsanfrage akzeptieren (Trial Mod+)' },
            { cmd: '/join deny <id>', desc: 'Beitrittsanfrage ablehnen (Trial Mod+)' },
            { cmd: '/joingroup <link|here>', desc: 'Join-Gruppe setzen (Owner)' }
        ],
        utility: [
            { cmd: '/weather <stadt>', desc: 'Wetter abfragen' },
            { cmd: '/translate <sprache> <text>', desc: 'Text übersetzen' },
            { cmd: '/wiki <begriff>', desc: 'Wikipedia-Suche' },
            { cmd: '/define <wort>', desc: 'Wort-Definition' },
            { cmd: '/ping', desc: 'Bot-Ping testen' },
            { cmd: '/runtime', desc: 'Bot-Latenz anzeigen' },
            { cmd: '/register <name>', desc: 'Registrieren (erforderlich)' },
            { cmd: '/unregister', desc: 'Registrierung löschen' },
            { cmd: '/me', desc: 'Profil anzeigen' },
            { cmd: '/menu', desc: 'Alle Befehle anzeigen' },
            { cmd: '/id', desc: 'Deine ID anzeigen' },
            { cmd: '/dsgvo', desc: 'Datenschutzerklärung' },
            { cmd: '/agb', desc: 'Allgemeine Geschäftsbedingungen' }
        ]
    };
}

// API Endpoints
app.get('/api/status', (req, res) => {
    const systemStats = getSystemStats();
    const registeredUsers = getRegisteredUsers();
    const commands = getAllCommands();
    
    res.json({
        success: true,
        data: {
            ...botStatus,
            uptime: botStatus.startTime ? Date.now() - botStatus.startTime : 0,
            system: systemStats,
            registeredUsers: registeredUsers,
            commands: commands
        }
    });
});

// Update bot status (für echte Bot-Integration)
app.post('/api/status', (req, res) => {
    const { isOnline, totalUsers, totalGroups, totalPets } = req.body;
    
    botStatus.isOnline = isOnline;
    botStatus.lastSeen = Date.now();
    
    if (isOnline && !botStatus.startTime) {
        botStatus.startTime = Date.now();
    }
    
    if (totalUsers !== undefined) botStatus.totalUsers = totalUsers;
    if (totalGroups !== undefined) botStatus.totalGroups = totalGroups;
    if (totalPets !== undefined) botStatus.totalPets = totalPets;
    
    res.json({ success: true, data: botStatus });
});

// Serve website
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/dashboard.html'));
});

// Health check for Vercel
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Export for Vercel
module.exports = app;

// Start server only if not in Vercel environment
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`🌐 AegisBot Dashboard running on http://localhost:${PORT}`);
    });
}