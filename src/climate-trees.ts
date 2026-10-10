import type {TrackId} from './track-layout';
/** Avenue variants use spatial material batches. Mediterranean stone pines/cypresses remain. */
export const CLIMATE_TREES:Record<TrackId,Record<string,string>>={
 stadionring:{'kit-linden':'broadleaf','kit-cypress':'broadleafB'},
 'duce-drom':{'kit-linden':'broadleafB'},
 havanna:{'kit-palm':'palm','kit-palm-b':'palmB'},
 pyongyang:{'kit-linden':'broadleaf','kit-cypress':'pine'},
 moscow:{'kit-linden':'birch','kit-cypress':'pine'},
 beijing:{'kit-linden':'broadleafB','kit-cypress':'pine'},
};
export const PARK_TREE:Record<TrackId,string>={stadionring:'broadleaf','duce-drom':'broadleafB',havanna:'palm',pyongyang:'pine',moscow:'birch',beijing:'broadleafB'};
