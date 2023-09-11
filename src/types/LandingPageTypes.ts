import type { CSSProperties } from "vue";
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
// Component: WhatsAppOverlay.vue
export interface IRawWhatsAppOverlay {
  number: string; // number
  imageStyle?: CSSProperties; // image style
  imageStyleMobile?: CSSProperties; // image mobile style
  containerStyle?: CSSProperties; // for container on desktop style
  containerMobileStyle?: CSSProperties; // for container on mobile style
}
export interface IContent {
  raw: IRawBackgroundWithIcon & IRawWhatsAppOverlay;
  children: any[];
  alignment: string;
  image: string;
  icon: string;
  type: string;
  content_mobile: string;
  content: string;
}

export interface Carousel {
  raw: {
    time: number;
  };
  children: any[];
  alignment: string;
  image: string;
  icon: string;
  type: string;
}
export interface Navigation {
  items: [] | any;
  navigationBottom: [] | any;
  component: {
    content: IContent | any;
    iconCover: string;
    children: [] | any;
    heroText: string;
  };
}

export interface VideoFrame {
  raw?: {
    videoId?: string;
  };
}
export enum Alignment {
  CENTER = "center",
  LEFT = "left",
  RIGHT = "right",
}
