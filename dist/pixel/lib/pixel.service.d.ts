import { PixelEventName, PixelConfiguration, PixelEventProperties } from './pixel.models';
import { RendererFactory2 } from '@angular/core';
import { Router } from '@angular/router';
import * as i0 from "@angular/core";
export declare class PixelService {
    private config;
    private injectedDocument;
    private platformId;
    private router;
    private rendererFactory;
    private doc;
    private renderer;
    constructor(config: PixelConfiguration, injectedDocument: any, platformId: Object, router: Router, rendererFactory: RendererFactory2);
    /**
     * Initialize the Pixel tracking script
     * - Adds the script to page's head
     * - Tracks first page view
     */
    initialize(pixelId?: string): void;
    /** Remove the Pixel tracking script */
    remove(): void;
    /**
     * Track a Standard Event as predefined by Facebook
     *
     * See {@link https://developers.facebook.com/docs/facebook-pixel/reference Facebook Pixel docs - reference}
     * @param eventName The name of the event that is being tracked
     * @param properties Optional properties of the event
     */
    track(eventName: PixelEventName, properties?: PixelEventProperties): void;
    /**
     * Track a custom Event
     *
     * See {@link https://developers.facebook.com/docs/facebook-pixel/implementation/conversion-tracking#custom-conversions Facebook Pixel docs - custom conversions}
     * @param eventName The name of the event that is being tracked
     * @param properties Optional properties of the event
     */
    trackCustom(eventName: string, properties?: object): void;
    /**
     * Adds the Facebook Pixel tracking script to the application
     * @param pixelId The Facebook Pixel ID to use
     */
    private addPixelScript;
    /** Remove Facebook Pixel tracking script from the application */
    private removePixelScript;
    /** Checks if the script element is present */
    private isLoaded;
    static ɵfac: i0.ɵɵFactoryDeclaration<PixelService, [null, null, null, { optional: true; }, null]>;
    static ɵprov: i0.ɵɵInjectableDeclaration<PixelService>;
}
