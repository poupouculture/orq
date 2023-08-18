export interface Navigation {
  items: [] | any;
  navigationBottom: [] | any;
  component: {
    content: [] | any;
    iconCover: string;
    children: [] | any;
    heroText: string;
  };
}

export interface IRaw {
  time: number;
  icon: any; // for icon container style
  overlay?: any; // for overlay container style
}
export interface IContent {
  raw: IRaw;
  children: any[];
  alignment: string;
}
