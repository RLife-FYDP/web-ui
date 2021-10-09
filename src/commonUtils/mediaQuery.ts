import debounce from "lodash/debounce";

export class MediaQueries {
  width = window.innerWidth;

  constructor() {
    window.addEventListener(
      "resize",
      () => {
        debounce(this.debounceDimensions, 200);
      },
      false
    );
  }

  debounceDimensions = () => {
    this.width = window.innerWidth;
  };

  get isMobile() {
    return this.width < 768;
  }

  get isTablet() {
    return this.width >= 768 && this.width < 1024;
  }

  get isTabletOrBelow() {
    return this.width < 1024;
  }
}

export const isMobile = "@media screen and (max-width: 767px)";
export const isTablet =
  "@media screen and (min-width: 768px) and (max-width: 1023px)";
export const isTabletOrBelow = "@media screen and (max-width: 1023px)";