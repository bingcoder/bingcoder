import { atom } from 'recoil';

export const globalAsideWidth = atom({
  key: 'globalAsideWidth',
  default: parseInt(localStorage.getItem('globalAsideWidth') || '200'),
  effects: [
    ({ onSet }) => {
      onSet((newValue) => {
        localStorage.setItem('globalAsideWidth', newValue?.toString());
      });
    },
  ],
});
export const globalAsideCollapsed = atom({
  key: 'globalAsideCollapsed',
  default: localStorage.getItem('asideCollapsed') === 'true' ? true : false,
  effects: [
    ({ onSet }) => {
      onSet((newValue) => {
        localStorage.setItem('asideCollapsed', newValue?.toString());
      });
    },
  ],
});
