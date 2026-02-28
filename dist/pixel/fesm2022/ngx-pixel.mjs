import * as i0 from '@angular/core';
import { PLATFORM_ID, Injectable, Inject, Optional, NgModule } from '@angular/core';
import * as i1 from '@angular/router';
import { NavigationEnd } from '@angular/router';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { filter } from 'rxjs/operators';

class PixelService {
    constructor(config, injectedDocument, platformId, router, rendererFactory) {
        this.config = config;
        this.injectedDocument = injectedDocument;
        this.platformId = platformId;
        this.router = router;
        this.rendererFactory = rendererFactory;
        // DOCUMENT cannot be injected directly as Document type, see https://github.com/angular/angular/issues/20351
        // It is therefore injected as any and then cast to Document
        this.doc = injectedDocument;
        this.renderer = rendererFactory.createRenderer(null, null);
        if (router) {
            // Log page views after router navigation ends
            router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(event => {
                if (this.isLoaded() && config.enablePageViewTrack) {
                    this.track('PageView');
                }
            });
        }
    }
    /**
     * Initialize the Pixel tracking script
     * - Adds the script to page's head
     * - Tracks first page view
     */
    initialize(pixelId = this.config.pixelId) {
        if (this.isLoaded()) {
            console.warn('Tried to initialize a Pixel instance while another is already active. Please call `remove()` before initializing a new instance.');
            return;
        }
        this.config.enabled = true;
        this.addPixelScript(pixelId);
    }
    /** Remove the Pixel tracking script */
    remove() {
        this.removePixelScript();
        this.config.enabled = false;
    }
    /**
     * Track a Standard Event as predefined by Facebook
     *
     * See {@link https://developers.facebook.com/docs/facebook-pixel/reference Facebook Pixel docs - reference}
     * @param eventName The name of the event that is being tracked
     * @param properties Optional properties of the event
     * @param eventId Optional event ID for server-side deduplication via CAPI
     */
    track(eventName, properties, eventId) {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }
        if (!this.isLoaded()) {
            console.warn('Tried to track an event without initializing a Pixel instance. Call `initialize()` first.');
            return;
        }
        console.warn("eventID", eventId);
        if (properties && eventId) {
            fbq('track', eventName, properties, { eventID: eventId });
        }
        else if (properties) {
            fbq('track', eventName, properties);
        }
        else {
            fbq('track', eventName);
        }
    }
    /**
     * Track a custom Event
     *
     * See {@link https://developers.facebook.com/docs/facebook-pixel/implementation/conversion-tracking#custom-conversions Facebook Pixel docs - custom conversions}
     * @param eventName The name of the event that is being tracked
     * @param properties Optional properties of the event
     */
    trackCustom(eventName, properties) {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }
        if (!this.isLoaded()) {
            console.warn('Tried to track an event without initializing a Pixel instance. Call `initialize()` first.');
            return;
        }
        if (properties) {
            fbq('trackCustom', eventName, properties);
        }
        else {
            fbq('trackCustom', eventName);
        }
    }
    /**
     * Adds the Facebook Pixel tracking script to the application
     * @param pixelId The Facebook Pixel ID to use
     */
    addPixelScript(pixelId) {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }
        const pixelCode = `
    var pixelCode = function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '${pixelId}');
    fbq('track', 'PageView');`;
        const scriptElement = this.renderer.createElement('script');
        this.renderer.setAttribute(scriptElement, 'id', 'pixel-script');
        this.renderer.setAttribute(scriptElement, 'type', 'text/javascript');
        this.renderer.setProperty(scriptElement, 'innerHTML', pixelCode);
        this.renderer.appendChild(this.doc.head, scriptElement);
    }
    /** Remove Facebook Pixel tracking script from the application */
    removePixelScript() {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }
        const pixelElement = this.doc.getElementById('pixel-script');
        if (pixelElement) {
            pixelElement.remove();
        }
    }
    /** Checks if the script element is present */
    isLoaded() {
        if (isPlatformBrowser(this.platformId)) {
            const pixelElement = this.doc.getElementById('pixel-script');
            return !!pixelElement;
        }
        return false;
    }
    static { this.ɵfac = function PixelService_Factory(t) { return new (t || PixelService)(i0.ɵɵinject('config'), i0.ɵɵinject(DOCUMENT), i0.ɵɵinject(PLATFORM_ID), i0.ɵɵinject(i1.Router, 8), i0.ɵɵinject(i0.RendererFactory2)); }; }
    static { this.ɵprov = /*@__PURE__*/ i0.ɵɵdefineInjectable({ token: PixelService, factory: PixelService.ɵfac, providedIn: 'root' }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(PixelService, [{
        type: Injectable,
        args: [{
                providedIn: 'root'
            }]
    }], () => [{ type: undefined, decorators: [{
                type: Inject,
                args: ['config']
            }] }, { type: undefined, decorators: [{
                type: Inject,
                args: [DOCUMENT]
            }] }, { type: Object, decorators: [{
                type: Inject,
                args: [PLATFORM_ID]
            }] }, { type: i1.Router, decorators: [{
                type: Optional
            }] }, { type: i0.RendererFactory2 }], null); })();

class PixelModule {
    static { this.config = null; }
    constructor(pixel, platformId) {
        this.pixel = pixel;
        if (!PixelModule.config) {
            throw Error('ngx-pixel not configured correctly. Pass the `pixelId` property to the `forRoot()` function');
        }
        if (PixelModule.config.enabled && isPlatformBrowser(platformId)) {
            this.pixel.initialize();
        }
    }
    /**
     * Initiale the Facebook Pixel Module
     *
     * Add your Pixel ID as parameter
     */
    static forRoot(config) {
        this.config = config;
        const pixelId = config.pixelId;
        this.verifyPixelId(pixelId);
        return {
            ngModule: PixelModule,
            providers: [PixelService, { provide: 'config', useValue: config }]
        };
    }
    /**
     * Verifies the Pixel ID that was passed into the configuration.
     * - Checks if Pixel was initialized
     * @param pixelId Pixel ID to verify
     */
    static verifyPixelId(pixelId) {
        // Have to verify first that all Pixel IDs follow the same 15 digit format
        if (pixelId === null || pixelId === undefined || pixelId.length === 0) {
            throw Error('Invalid Facebook Pixel ID. Did you pass the ID into the forRoot() function?');
        }
    }
    static { this.ɵfac = function PixelModule_Factory(t) { return new (t || PixelModule)(i0.ɵɵinject(PixelService), i0.ɵɵinject(PLATFORM_ID)); }; }
    static { this.ɵmod = /*@__PURE__*/ i0.ɵɵdefineNgModule({ type: PixelModule }); }
    static { this.ɵinj = /*@__PURE__*/ i0.ɵɵdefineInjector({}); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(PixelModule, [{
        type: NgModule,
        args: [{
                imports: [],
            }]
    }], () => [{ type: PixelService }, { type: Object, decorators: [{
                type: Inject,
                args: [PLATFORM_ID]
            }] }], null); })();

/**
 * Generated bundle index. Do not edit.
 */

export { PixelModule, PixelService };
//# sourceMappingURL=ngx-pixel.mjs.map
