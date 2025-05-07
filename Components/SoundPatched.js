// Components/SoundPatched.js
import resolveAssetSourceModule from 'react-native/Libraries/Image/resolveAssetSource';

// если это объект — достаём функцию и кладём её в глобал,
// чтобы react‑native‑sound увидел именно функцию
const resolveAssetSource =
  typeof resolveAssetSourceModule === 'function'
    ? resolveAssetSourceModule
    : resolveAssetSourceModule.default;

if (typeof global.resolveAssetSource !== 'function') {
  global.resolveAssetSource = resolveAssetSource;
}

// импортируем библиотеку ***после*** патча
// (require, а не import, чтобы вызвать её именно сейчас)
const Sound = require('react-native-sound');

// — экспорт —
export default Sound;
