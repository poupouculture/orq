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

// Component: BackgroundWithIcon.vue
export interface IRawBackgroundWithIcon {
  autoplay: number; // autoplay time for carousel. default is 0
  icon: {
    alignment: string; // icon container alignment. ref: LandingPageHelper.ts default: evenly
  }; // for icon container style
  overlay?: {
    opacity: string;
    background: string;
  }; // for overlay background container style
}
export interface IContent {
  raw: IRawBackgroundWithIcon;
  children: any[];
  alignment: string;
  image: string;
  icon: string;
}

export interface VideoFrame {
  raw?: {
    videoId?: string;
  };
}
