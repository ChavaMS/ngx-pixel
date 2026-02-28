import { Inject, Injectable, Optional, PLATFORM_ID } from '@angular/core';
import { NavigationEnd } from '@angular/router';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { filter } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
export class PixelService {
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
        console.log("eventi");
        if (properties && eventId) {
            console.log("eventid", eventId);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGl4ZWwuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL3BpeGVsL3NyYy9saWIvcGl4ZWwuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUErQixNQUFNLGVBQWUsQ0FBQztBQUN2RyxPQUFPLEVBQUUsYUFBYSxFQUFVLE1BQU0saUJBQWlCLENBQUM7QUFDeEQsT0FBTyxFQUFFLFFBQVEsRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzlELE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQzs7O0FBT3hDLE1BQU0sT0FBTyxZQUFZO0lBS3ZCLFlBQzRCLE1BQTBCLEVBQzFCLGdCQUFxQixFQUNsQixVQUFrQixFQUMzQixNQUFjLEVBQzFCLGVBQWlDO1FBSmYsV0FBTSxHQUFOLE1BQU0sQ0FBb0I7UUFDMUIscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFLO1FBQ2xCLGVBQVUsR0FBVixVQUFVLENBQVE7UUFDM0IsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUMxQixvQkFBZSxHQUFmLGVBQWUsQ0FBa0I7UUFHekMsNkdBQTZHO1FBQzdHLDREQUE0RDtRQUM1RCxJQUFJLENBQUMsR0FBRyxHQUFHLGdCQUE0QixDQUFDO1FBQ3hDLElBQUksQ0FBQyxRQUFRLEdBQUcsZUFBZSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFFM0QsSUFBSSxNQUFNLEVBQUUsQ0FBQztZQUNYLDhDQUE4QztZQUM5QyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLFlBQVksYUFBYSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0JBRXBGLElBQUksSUFBSSxDQUFDLFFB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QkFDZixNQUFNO3VCQUFDLFdBQVc7O3NCQUNsQixRQUFRIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUGl4ZWxFdmVudE5hbWUsIFBpeGVsQ29uZmlndXJhdGlvbiwgUGl4ZWxFdmVudFByb3BlcnRpZXMgfSBmcm9tICcuL3BpeGVsLm1vZGVscyc7XG5pbXBvcnQgeyBJbmplY3QsIEluamVjdGFibGUsIE9wdGlvbmFsLCBQTEFURk9STV9JRCwgUmVuZGVyZXIyLCBSZW5kZXJlckZhY3RvcnkyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBOYXZpZ2F0aW9uRW5kLCBSb3V0ZXIgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgRE9DVU1FTlQsIGlzUGxhdGZvcm1Ccm93c2VyIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IGZpbHRlciB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuZGVjbGFyZSBjb25zdCBmYnE6IGFueTtcblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgUGl4ZWxTZXJ2aWNlIHtcblxuICBwcml2YXRlIGRvYzogRG9jdW1lbnQ7XG4gIHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyMlxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIEBJbmplY3QoJ2NvbmZpZycpIHByaXZhdGUgY29uZmlnOiBQaXhlbENvbmZpZ3VyYXRpb24sXG4gICAgQEluamVjdChET0NVTUVOVCkgcHJpdmF0ZSBpbmplY3RlZERvY3VtZW50OiBhbnksXG4gICAgQEluamVjdChQTEFURk9STV9JRCkgcHJpdmF0ZSBwbGF0Zm9ybUlkOiBPYmplY3QsXG4gICAgQE9wdGlvbmFsKCkgcHJpdmF0ZSByb3V0ZXI6IFJvdXRlcixcbiAgICBwcml2YXRlIHJlbmRlcmVyRmFjdG9yeTogUmVuZGVyZXJGYWN0b3J5MlxuICApIHtcblxuICAgIC8vIERPQ1VNRU5UIGNhbm5vdCBiZSBpbmplY3RlZCBkaXJlY3RseSBhcyBEb2N1bWVudCB0eXBlLCBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9pc3N1ZXMvMjAzNTFcbiAgICAvLyBJdCBpcyB0aGVyZWZvcmUgaW5qZWN0ZWQgYXMgYW55IGFuZCB0aGVuIGNhc3QgdG8gRG9jdW1lbnRcbiAgICB0aGlzLmRvYyA9IGluamVjdGVkRG9jdW1lbnQgYXMgRG9jdW1lbnQ7XG4gICAgdGhpcy5yZW5kZXJlciA9IHJlbmRlcmVyRmFjdG9yeS5jcmVhdGVSZW5kZXJlcihudWxsLCBudWxsKTtcblxuICAgIGlmIChyb3V0ZXIpIHtcbiAgICAgIC8vIExvZyBwYWdlIHZpZXdzIGFmdGVyIHJvdXRlciBuYXZpZ2F0aW9uIGVuZHNcbiAgICAgIHJvdXRlci5ldmVudHMucGlwZShmaWx0ZXIoZXZlbnQgPT4gZXZlbnQgaW5zdGFuY2VvZiBOYXZpZ2F0aW9uRW5kKSkuc3Vic2NyaWJlKGV2ZW50ID0+IHtcblxuICAgICAgICBpZiAodGhpcy5pc0xvYWRlZCgpICYmIGNvbmZpZy5lbmFibGVQYWdlVmlld1RyYWNrKSB7XG4gICAgICAgICAgdGhpcy50cmFjaygnUGFnZVZpZXcnKTtcbiAgICAgICAgfVxuXG4gICAgICB9KTtcbiAgICB9XG5cbiAgfVxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplIHRoZSBQaXhlbCB0cmFja2luZyBzY3JpcHRcbiAgICogLSBBZGRzIHRoZSBzY3JpcHQgdG8gcGFnZSdzIGhlYWRcbiAgICogLSBUcmFja3MgZmlyc3QgcGFnZSB2aWV3XG4gICAqL1xuICBpbml0aWFsaXplKHBpeGVsSWQgPSB0aGlzLmNvbmZpZy5waXhlbElkKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuaXNMb2FkZWQoKSkge1xuICAgICAgY29uc29sZS53YXJuKCdUcmllZCB0byBpbml0aWFsaXplIGEgUGl4ZWwgaW5zdGFuY2Ugd2hpbGUgYW5vdGhlciBpcyBhbHJlYWR5IGFjdGl2ZS4gUGxlYXNlIGNhbGwgYHJlbW92ZSgpYCBiZWZvcmUgaW5pdGlhbGl6aW5nIGEgbmV3IGluc3RhbmNlLicpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLmNvbmZpZy5lbmFibGVkID0gdHJ1ZTtcbiAgICB0aGlzLmFkZFBpeGVsU2NyaXB0KHBpeGVsSWQpO1xuICB9XG5cbiAgLyoqIFJlbW92ZSB0aGUgUGl4ZWwgdHJhY2tpbmcgc2NyaXB0ICovXG4gIHJlbW92ZSgpOiB2b2lkIHtcbiAgICB0aGlzLnJlbW92ZVBpeGVsU2NyaXB0KCk7XG4gICAgdGhpcy5jb25maWcuZW5hYmxlZCA9IGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFRyYWNrIGEgU3RhbmRhcmQgRXZlbnQgYXMgcHJlZGVmaW5lZCBieSBGYWNlYm9va1xuICAgKlxuICAgKiBTZWUge0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVycy5mYWNlYm9vay5jb20vZG9jcy9mYWNlYm9vay1waXhlbC9yZWZlcmVuY2UgRmFjZWJvb2sgUGl4ZWwgZG9jcyAtIHJlZmVyZW5jZX1cbiAgICogQHBhcmFtIGV2ZW50TmFtZSBUaGUgbmFtZSBvZiB0aGUgZXZlbnQgdGhhdCBpcyBiZWluZyB0cmFja2VkXG4gICAqIEBwYXJhbSBwcm9wZXJ0aWVzIE9wdGlvbmFsIHByb3BlcnRpZXMgb2YgdGhlIGV2ZW50XG4gICAqIEBwYXJhbSBldmVudElkIE9wdGlvbmFsIGV2ZW50IElEIGZvciBzZXJ2ZXItc2lkZSBkZWR1cGxpY2F0aW9uIHZpYSBDQVBJXG4gICAqL1xuICB0cmFjayhcbiAgICBldmVudE5hbWU6IFBpeGVsRXZlbnROYW1lLFxuICAgIHByb3BlcnRpZXM/OiBQaXhlbEV2ZW50UHJvcGVydGllcyxcbiAgICBldmVudElkPzogc3RyaW5nXG4gICk6IHZvaWQge1xuICAgIGlmICghaXNQbGF0Zm9ybUJyb3dzZXIodGhpcy5wbGF0Zm9ybUlkKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5pc0xvYWRlZCgpKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ1RyaWVkIHRvIHRyYWNrIGFuIGV2ZW50IHdpdGhvdXQgaW5pdGlhbGl6aW5nIGEgUGl4ZWwgaW5zdGFuY2UuIENhbGwgYGluaXRpYWxpemUoKWAgZmlyc3QuJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc29sZS5sb2coXCJldmVudGlcIik7XG4gICAgaWYgKHByb3BlcnRpZXMgJiYgZXZlbnRJZCkge1xuICAgICAgY29uc29sZS5sb2coXCJldmVudGlkXCIsIGV2ZW50SWQpO1xuICAgICAgZmJxKCd0cmFjaycsIGV2ZW50TmFtZSwgcHJvcGVydGllcywgeyBldmVudElEOiBldmVudElkIH0pO1xuICAgIH0gZWxzZSBpZiAocHJvcGVydGllcykge1xuICAgICAgZmJxKCd0cmFjaycsIGV2ZW50TmFtZSwgcHJvcGVydGllcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZicSgndHJhY2snLCBldmVudE5hbWUpO1xuICAgIH1cblxuICB9XG5cbiAgLyoqXG4gICAqIFRyYWNrIGEgY3VzdG9tIEV2ZW50XG4gICAqXG4gICAqIFNlZSB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXJzLmZhY2Vib29rLmNvbS9kb2NzL2ZhY2Vib29rLXBpeGVsL2ltcGxlbWVudGF0aW9uL2NvbnZlcnNpb24tdHJhY2tpbmcjY3VzdG9tLWNvbnZlcnNpb25zIEZhY2Vib29rIFBpeGVsIGRvY3MgLSBjdXN0b20gY29udmVyc2lvbnN9XG4gICAqIEBwYXJhbSBldmVudE5hbWUgVGhlIG5hbWUgb2YgdGhlIGV2ZW50IHRoYXQgaXMgYmVpbmcgdHJhY2tlZFxuICAgKiBAcGFyYW0gcHJvcGVydGllcyBPcHRpb25hbCBwcm9wZXJ0aWVzIG9mIHRoZSBldmVudFxuICAgKi9cbiAgdHJhY2tDdXN0b20oZXZlbnROYW1lOiBzdHJpbmcsIHByb3BlcnRpZXM/OiBvYmplY3QpOiB2b2lkIHtcbiAgICBpZiAoIWlzUGxhdGZvcm1Ccm93c2VyKHRoaXMucGxhdGZvcm1JZCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuaXNMb2FkZWQoKSkge1xuICAgICAgY29uc29sZS53YXJuKCdUcmllZCB0byB0cmFjayBhbiBldmVudCB3aXRob3V0IGluaXRpYWxpemluZyBhIFBpeGVsIGluc3RhbmNlLiBDYWxsIGBpbml0aWFsaXplKClgIGZpcnN0LicpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChwcm9wZXJ0aWVzKSB7XG4gICAgICBmYnEoJ3RyYWNrQ3VzdG9tJywgZXZlbnROYW1lLCBwcm9wZXJ0aWVzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZmJxKCd0cmFja0N1c3RvbScsIGV2ZW50TmFtZSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgdGhlIEZhY2Vib29rIFBpeGVsIHRyYWNraW5nIHNjcmlwdCB0byB0aGUgYXBwbGljYXRpb25cbiAgICogQHBhcmFtIHBpeGVsSWQgVGhlIEZhY2Vib29rIFBpeGVsIElEIHRvIHVzZVxuICAgKi9cbiAgcHJpdmF0ZSBhZGRQaXhlbFNjcmlwdChwaXhlbElkOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBpZiAoIWlzUGxhdGZvcm1Ccm93c2VyKHRoaXMucGxhdGZvcm1JZCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBwaXhlbENvZGUgPSBgXG4gICAgdmFyIHBpeGVsQ29kZSA9IGZ1bmN0aW9uKGYsYixlLHYsbix0LHMpXG4gICAge2lmKGYuZmJxKXJldHVybjtuPWYuZmJxPWZ1bmN0aW9uKCl7bi5jYWxsTWV0aG9kP1xuICAgIG4uY2FsbE1ldGhvZC5hcHBseShuLGFyZ3VtZW50cyk6bi5xdWV1ZS5wdXNoKGFyZ3VtZW50cyl9O1xuICAgIGlmKCFmLl9mYnEpZi5fZmJxPW47bi5wdXNoPW47bi5sb2FkZWQ9ITA7bi52ZXJzaW9uPScyLjAnO1xuICAgIG4ucXVldWU9W107dD1iLmNyZWF0ZUVsZW1lbnQoZSk7dC5hc3luYz0hMDtcbiAgICB0LnNyYz12O3M9Yi5nZXRFbGVtZW50c0J5VGFnTmFtZShlKVswXTtcbiAgICBzLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHQscyl9KHdpbmRvdywgZG9jdW1lbnQsJ3NjcmlwdCcsXG4gICAgJ2h0dHBzOi8vY29ubmVjdC5mYWNlYm9vay5uZXQvZW5fVVMvZmJldmVudHMuanMnKTtcbiAgICBmYnEoJ2luaXQnLCAnJHtwaXhlbElkfScpO1xuICAgIGZicSgndHJhY2snLCAnUGFnZVZpZXcnKTtgO1xuXG5cbiAgICBjb25zdCBzY3JpcHRFbGVtZW50ID0gdGhpcy5yZW5kZXJlci5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcbiAgICB0aGlzLnJlbmRlcmVyLnNldEF0dHJpYnV0ZShzY3JpcHRFbGVtZW50LCAnaWQnLCAncGl4ZWwtc2NyaXB0Jyk7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRBdHRyaWJ1dGUoc2NyaXB0RWxlbWVudCwgJ3R5cGUnLCAndGV4dC9qYXZhc2NyaXB0Jyk7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRQcm9wZXJ0eShzY3JpcHRFbGVtZW50LCAnaW5uZXJIVE1MJywgcGl4ZWxDb2RlKTtcbiAgICB0aGlzLnJlbmRlcmVyLmFwcGVuZENoaWxkKHRoaXMuZG9jLmhlYWQsIHNjcmlwdEVsZW1lbnQpO1xuICB9XG5cbiAgLyoqIFJlbW92ZSBGYWNlYm9vayBQaXhlbCB0cmFja2luZyBzY3JpcHQgZnJvbSB0aGUgYXBwbGljYXRpb24gKi9cbiAgcHJpdmF0ZSByZW1vdmVQaXhlbFNjcmlwdCgpOiB2b2lkIHtcbiAgICBpZiAoIWlzUGxhdGZvcm1Ccm93c2VyKHRoaXMucGxhdGZvcm1JZCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgcGl4ZWxFbGVtZW50ID0gdGhpcy5kb2MuZ2V0RWxlbWVudEJ5SWQoJ3BpeGVsLXNjcmlwdCcpO1xuICAgIGlmIChwaXhlbEVsZW1lbnQpIHtcbiAgICAgIHBpeGVsRWxlbWVudC5yZW1vdmUoKTtcbiAgICB9XG4gIH1cblxuICAvKiogQ2hlY2tzIGlmIHRoZSBzY3JpcHQgZWxlbWVudCBpcyBwcmVzZW50ICovXG4gIHByaXZhdGUgaXNMb2FkZWQoKTogYm9vbGVhbiB7XG4gICAgaWYgKGlzUGxhdGZvcm1Ccm93c2VyKHRoaXMucGxhdGZvcm1JZCkpIHtcbiAgICAgIGNvbnN0IHBpeGVsRWxlbWVudCA9IHRoaXMuZG9jLmdldEVsZW1lbnRCeUlkKCdwaXhlbC1zY3JpcHQnKTtcbiAgICAgIHJldHVybiAhIXBpeGVsRWxlbWVudDtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbn1cbiJdfQ==