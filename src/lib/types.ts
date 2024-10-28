export declare type ScrollBehavior = "auto" | "smooth";

export declare type GetKey = (index: number) => unknown;

export declare type ScrollToIndex = (index: number, behavior?: ScrollBehavior) => void;

export declare type ScrollToPosition = (position: number, behavior?: ScrollBehavior) => void;

export declare type ScrollEvent = UIEvent & { currentTarget: EventTarget & HTMLDivElement };

export declare type OnScroll = (event: ScrollEvent) => void;
