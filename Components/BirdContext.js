// src/Components/BirdContext.js
import React, {createContext, useContext, useReducer} from 'react';

/* ───────── bird data (5 species) ───────── */
export const BIRDS = [
  {
    id: 'rock-dove',
    name: 'Rock Dove',
    image: require('../assets/bird1.png'),       // full‑size hero image
    tags: ['urban birds'],
    range: 'Urban areas worldwide',
    traits:
      'Flocks often scavenge human food scraps; social and adaptable',
    tagsplays: ['seen around town'],
    comment:
      'Everyone knows these! Always lurking around benches for crumbs',
    sounds: [
      {
        id: 'rd-1',
        title: 'Classic coo',
        src: require('../assets/blackbird_singing.mp3'),
      },
    ],
  },
  {
    id: 'nightingale',
    name: 'Common Nightingale',
    image: require('../assets/bird2.png'),
    tags: ['songbirds', 'wild birds'],
    range: 'Europe, Asia, North Africa',
    traits:
      'Famous for complex nocturnal songs during mating season',
    tagsplays: ['migratory', 'sings in the morning'],
    comment:
      'I listened to them every summer in my grandma’s garden — true vocal virtuosos!',
    sounds: [
      {
        id: 'ng-1',
        title: 'Evening song',
        src: require('../assets/blackbird_singing.mp3'),
      },
      {
        id: 'ng-2',
        title: 'Dawn song',
        src: require('../assets/blackbird_singing.mp3'),
      },
    ],
  },
  {
    id: 'black-swan',
    name: 'Black swan',
    image: require('../assets/bird3.png'),
    tags: ['waterfowl', 'exotic birds'],
    range: 'Australia, New Zealand',
    traits:
      'Form monogamous pairs, aggressive during nesting',
    tagsplays: ['very rare'],
    comment:
      'Saw them at the zoo — graceful but hiss like geese!',
    sounds: [
      {
        id: 'bs-1',
        title: 'Trumpet call',
        src: require('../assets/blackbird_singing.mp3'),
      },
    ],
  },
  {
    id: 'toco-toucan',
    name: 'Toco Toucan',
    image: require('../assets/bird4.png'),
    tags: ['exotic birds'],
    range: 'South American rainforests',
    traits:
      'Uses large beak for thermoregulation and fruit foraging',
    tagsplays: ['very loud'],
    comment:
      'Dream of seeing one in real life — looks straight out of a cartoon!',
    sounds: [
      {
        id: 'tc-1',
        title: 'Tree croak',
        src: require('../assets/blackbird_singing.mp3'),
      },
    ],
  },
  {
    id: 'eurasian-magpie',
    name: 'Eurasian Magpie',
    image: require('../assets/bird5.png'),
    tags: ['urban birds', 'wild birds'],
    range: 'Eurasia, North Africa',
    traits:
      'Attracted to shiny objects; highly intelligent',
    tagsplays: ['seen in town', 'very loud'],
    comment:
      "This one's loud and sassy, especially in spring!",
    sounds: [
      {
        id: 'em-1',
        title: 'Chatter',
        src: require('../assets/blackbird_singing.mp3'),
      },
    ],
  },
];

/* ───────── context setup ───────── */
const BirdContext = createContext();

function reducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_OBSERVED':
      return {
        ...state,
        observed: state.observed.includes(action.id)
          ? state.observed.filter(i => i !== action.id)
          : [...state.observed, action.id],
      };
    default:
      return state;
  }
}

export function BirdProvider({children}) {
  const [state, dispatch] = useReducer(reducer, {
    birds: BIRDS,
    observed: [],
  });

  const toggleObserved = id => dispatch({type: 'TOGGLE_OBSERVED', id});

  return (
    <BirdContext.Provider value={{...state, toggleObserved}}>
      {children}
    </BirdContext.Provider>
  );
}

export function useBirds() {
  return useContext(BirdContext);
}
