import type { CSSProperties } from "vue";

export enum Alignment {
  CENTER = "center",
  LEFT = "left",
  RIGHT = "right",
  TOP = "top",
  ABOVE = "above",
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
  content: string;
  content_mobile: string;
}

export interface IcontentBackground {
  children: any[];
  alignment: Alignment;
  image: string;
  icon: string;
  type: string;
  content: string;
  content_mobile: string;
  raw: {
    style: CSSProperties;
    backgroundImageStyle: CSSProperties;
    backgroundStyle: CSSProperties;
    overlayColor: string;
    wrapperStyle: CSSProperties;
    videoId: string;
    volumeStyle: CSSProperties;
    backgroundImageMobileStyle: CSSProperties;
  };
}

export interface MainType {
  children: any[];
  alignment: string;
  image: string;
  name: string;
  icon: string;
  type: string;
  content: string;
  content_mobile: string;
  app: string;
}

export interface Wyiswyg extends MainType {
  raw: {
    style: CSSProperties;
  };
}

export interface FormFields {
  app?: string | undefined;
  type: string;
  label: string;
  field: string;
  error: boolean;
  errorMessage: string;
  value: string | [] | null;
  required: boolean;
  dateRequired: string[];
  openDateModal?: boolean;
  color?: string;
  options: {
    label: string;
    field: string;
    error: boolean;
    errorMessage: string;
    value: string | [] | null;
  }[];
}

export interface Form extends MainType {
  color: string | null;
  raw?: {
    style: CSSProperties;
    buttonStyle: CSSProperties;
    button: string;
    form: FormFields[];
    color: string;
  };
}

export interface Icon extends MainType {
  raw: {
    cardIconStyle: CSSProperties;
    style: CSSProperties;
  };
}

export interface Cover extends MainType {
  raw: {
    contentStyle: CSSProperties;
    style: CSSProperties;
    styleMobile: CSSProperties;
  };
}

export interface Carousel {
  raw: {
    time: number;
    contentStyle: CSSProperties;
    wrapperStyle: CSSProperties;
    iconSize: {
      width: string | number;
      height: string | number;
    };
    iconAligment: Alignment;
    style: string;
    props: {
      duration: number;
    };
  };
  children: any[];
  alignment: Alignment;
  image: string;
  icon: string;
  type: string;
  content_mobile: string;
  content: string;
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
