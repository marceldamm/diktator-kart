export type DriverDefinition = Readonly<{
    id: string;
    name: string;
    title: string;
    kart: string;
    color: string;
    accent: string;
    personality: string;
    movingDetail: string;
}>;

/** First production roster. The caricatures ridicule authoritarian vanity, not its victims. */
export const DRIVERS: readonly DriverDefinition[] = [
    {
        id: 'groefaz',
        name: 'GröFaZ',
        title: 'Selbsternannter Streckenbesitzer',
        kart: 'Größenwahn-Mobil',
        color: '#8e2635',
        accent: '#e2c35b',
        personality: 'Schwer · schnell · lenkt wie eine Kabinettskrise',
        movingDetail: 'Wackelnde Blechorden'
    },
    {
        id: 'stalin',
        name: 'Stalin',
        title: 'Vorsitzender der Kurvenkommission',
        kart: 'Fünfjahresplan 3000',
        color: '#6f2424',
        accent: '#f0b83f',
        personality: 'Sehr schwer · stabil · planmäßig verspätet',
        movingDetail: 'Federnder Sitzungsthron'
    },
    {
        id: 'mussolini',
        name: 'Mussolini',
        title: 'Balkonfahrer ohne Balkon',
        kart: 'Il Duce GT',
        color: '#31557a',
        accent: '#e9dfc4',
        personality: 'Schnell · nervös · posiert vor dem Boost',
        movingDetail: 'Vibrierende Mini-Lautsprecher'
    },
    {
        id: 'mao',
        name: 'Mao',
        title: 'Großer Lenker, mittelgroße Lenkung',
        kart: 'Kultur-Kart',
        color: '#b72f2b',
        accent: '#f4d44d',
        personality: 'Leicht · wendig · verteilt rote Zettel',
        movingDetail: 'Flatterndes Regelheft'
    },
    {
        id: 'kim',
        name: 'Kim',
        title: 'Sieger vor Rennbeginn',
        kart: 'Propaganda-Rakete',
        color: '#263f70',
        accent: '#e63f44',
        personality: 'Ausgewogen · explosiver Auftritt · große Anzeige',
        movingDetail: 'Überlanger Auspuff'
    },
    {
        id: 'castro',
        name: 'Castro',
        title: 'Dienstältester Boxengassenredner',
        kart: 'Revolutions-Cabrio',
        color: '#315d42',
        accent: '#d7c99a',
        personality: 'Leicht · präzise · findet immer noch eine Rede',
        movingDetail: 'Aufklappender Aktenkoffer'
    }
];

export const DEFAULT_DRIVER = DRIVERS[0];
