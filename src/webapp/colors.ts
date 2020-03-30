// https://github.com/crusoexia/vim-monokai/blob/master/colors/monokai.vim

export const WHITE = '#E8E8E3';
export const WHITE_2 = '#d8d8d3';
export const BLACK = '#272822';
export const LIGHTBLACK = '#2D2E27';
export const LIGHTBLACK2 = '#383a3e';
export const LIGHTBLACK3 = '#3f4145';
export const DARKBLACK = '#211F1C';
export const GREY = '#8F908A';
export const LIGHTGREY = '#575b61';
export const DARKGREY = '#64645e';
export const WARMGREY = '#75715E';

export const PINK = '#F92772';
export const GREEN = '#A6E22D';
export const AQUA = '#66d9ef';
export const YELLOW = '#E6DB74';
export const ORANGE = '#FD9720';
export const PURPLE = '#ae81ff';
export const RED = '#e73c50';
export const PURERED = '#ff0000';
export const DARKRED = '#5f0000';

export const ADDFG = '#d7ffaf';
export const ADDBG = '#5f875f';
export const DELBG = '#f75f5f';
export const CHANGEFG = '#d7d7ff';
export const CHANGEBG = '#5f5f87';

export const CYAN = '#A1EFE4';
export const BR_GREEN = '#9EC400';
export const BR_YELLOW = '#E7C547';
export const BR_BLUE = '#7AA6DA';
export const BR_PURPLE = '#B77EE0';
export const BR_CYAN = '#54CED6';
export const BR_WHITE = '#FFFFFF';

export function hexToRgba(hex: string, a: number): string {
  hex = hex.replace('#', '');

  if (hex.length !== 6) {
    throw new Error(`Hex value "${hex}" must be 6 characters long`);
  }

  const [r, g, b] = [hex.slice(0, 2), hex.slice(2, 4), hex.slice(4, 6)].map(a =>
    parseInt(a, 16),
  );

  return `rgba(${r}, ${g}, ${b}, ${a})`;
}
