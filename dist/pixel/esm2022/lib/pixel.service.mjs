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
                if (this.isLoaded()) {
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
     */
    track(eventName, properties) {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }
        if (!this.isLoaded()) {
            console.warn('Tried to track an event without initializing a Pixel instance. Call `initialize()` first.');
            return;
        }
        if (properties) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGl4ZWwuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL3BpeGVsL3NyYy9saWIvcGl4ZWwuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUErQixNQUFNLGVBQWUsQ0FBQztBQUN2RyxPQUFPLEVBQUUsYUFBYSxFQUFVLE1BQU0saUJBQWlCLENBQUM7QUFDeEQsT0FBTyxFQUFFLFFBQVEsRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzlELE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQzs7O0FBT3hDLE1BQU0sT0FBTyxZQUFZO0lBS3ZCLFlBQzRCLE1BQTBCLEVBQzFCLGdCQUFxQixFQUNsQixVQUFrQixFQUMzQixNQUFjLEVBQzFCLGVBQWlDO1FBSmYsV0FBTSxHQUFOLE1BQU0sQ0FBb0I7UUFDMUIscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFLO1FBQ2xCLGVBQVUsR0FBVixVQUFVLENBQVE7UUFDM0IsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUMxQixvQkFBZSxHQUFmLGVBQWUsQ0FBa0I7UUFHekMsNkdBQTZHO1FBQzdHLDREQUE0RDtRQUM1RCxJQUFJLENBQUMsR0FBRyxHQUFHLGdCQUE0QixDQUFDO1FBQ3hDLElBQUksQ0FBQyxRQUFRLEdBQUcsZUFBZSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFFM0QsSUFBSSxNQUFNLEVBQUUsQ0FBQztZQUNYLDhDQUE4QztZQUM5QyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLFlBQVksYUFBYSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0JBRXBGLElBQUksSUFBSSxDQUFDLFFB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MUQsQ0FBQztJQUVELGlFQUFpRTtJQUN6RCxpQkFBaUI7UUFDdkIsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDO1lBQ3hDLE9BQU87UUFDVCxDQUFDO1FBQ0QsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDN0QsSUFBSSxZQUFZLEVBQUUsQ0FBQztZQUNqQixZQUFZLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDeEIsQ0FBQztJQUNILENBQUM7SUFFRCw4Q0FBOEM7SUFDdEMsUUFBUTtRQUNkLElBQUksaUJBQWlCLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUM7WUFDdkMsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsY0FBYyxDQUFDLENBQUM7WUFDN0QsT0FBTyxDQUFDLENBQUMsWUFBWSxDQUFDO1FBQ3hCLENBQUM7UUFDRCxPQUFPLEtBQUssQ0FBQztJQUNmLENBQUM7NkVBdEpVLFlBQVksY0FNYixRQUFRLGVBQ1IsUUFBUSxlQUNSLFdBQVc7dUVBUlYsWUFBWSxXQUFaLFlBQVksbUJBRlgsTUFBTTs7aUZBRVAsWUFBWTtjQUh4QixVQUFVO2VBQUM7Z0JBQ1YsVUFBVSxFQUFFLE1BQU07YUFDbkI7O3NCQU9JLE1BQU07dUJBQUMsUUFBUTs7c0JBQ2YsTUFBTTt1QkFBQyxRQUFROztzQkFDZixNQUFNO3VCQUFDLFdBQVc7O3NCQUNsQixRQUFRIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUGl4ZWxFdmVudE5hbWUsIFBpeGVsQ29uZmlndXJhdGlvbiwgUGl4ZWxFdmVudFByb3BlcnRpZXMgfSBmcm9tICcuL3BpeGVsLm1vZGVscyc7XG5pbXBvcnQgeyBJbmplY3QsIEluamVjdGFibGUsIE9wdGlvbmFsLCBQTEFURk9STV9JRCwgUmVuZGVyZXIyLCBSZW5kZXJlckZhY3RvcnkyIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBOYXZpZ2F0aW9uRW5kLCBSb3V0ZXIgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgRE9DVU1FTlQsIGlzUGxhdGZvcm1Ccm93c2VyIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IGZpbHRlciB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuZGVjbGFyZSBjb25zdCBmYnE6IGFueTtcblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgUGl4ZWxTZXJ2aWNlIHtcblxuICBwcml2YXRlIGRvYzogRG9jdW1lbnQ7XG4gIHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyMlxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIEBJbmplY3QoJ2NvbmZpZycpIHByaXZhdGUgY29uZmlnOiBQaXhlbENvbmZpZ3VyYXRpb24sXG4gICAgQEluamVjdChET0NVTUVOVCkgcHJpdmF0ZSBpbmplY3RlZERvY3VtZW50OiBhbnksXG4gICAgQEluamVjdChQTEFURk9STV9JRCkgcHJpdmF0ZSBwbGF0Zm9ybUlkOiBPYmplY3QsXG4gICAgQE9wdGlvbmFsKCkgcHJpdmF0ZSByb3V0ZXI6IFJvdXRlcixcbiAgICBwcml2YXRlIHJlbmRlcmVyRmFjdG9yeTogUmVuZGVyZXJGYWN0b3J5MlxuICApIHtcblxuICAgIC8vIERPQ1VNRU5UIGNhbm5vdCBiZSBpbmplY3RlZCBkaXJlY3RseSBhcyBEb2N1bWVudCB0eXBlLCBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9pc3N1ZXMvMjAzNTFcbiAgICAvLyBJdCBpcyB0aGVyZWZvcmUgaW5qZWN0ZWQgYXMgYW55IGFuZCB0aGVuIGNhc3QgdG8gRG9jdW1lbnRcbiAgICB0aGlzLmRvYyA9IGluamVjdGVkRG9jdW1lbnQgYXMgRG9jdW1lbnQ7XG4gICAgdGhpcy5yZW5kZXJlciA9IHJlbmRlcmVyRmFjdG9yeS5jcmVhdGVSZW5kZXJlcihudWxsLCBudWxsKTtcblxuICAgIGlmIChyb3V0ZXIpIHtcbiAgICAgIC8vIExvZyBwYWdlIHZpZXdzIGFmdGVyIHJvdXRlciBuYXZpZ2F0aW9uIGVuZHNcbiAgICAgIHJvdXRlci5ldmVudHMucGlwZShmaWx0ZXIoZXZlbnQgPT4gZXZlbnQgaW5zdGFuY2VvZiBOYXZpZ2F0aW9uRW5kKSkuc3Vic2NyaWJlKGV2ZW50ID0+IHtcblxuICAgICAgICBpZiAodGhpcy5pc0xvYWRlZCgpKSB7XG4gICAgICAgICAgdGhpcy50cmFjaygnUGFnZVZpZXcnKTtcbiAgICAgICAgfVxuXG4gICAgICB9KTtcbiAgICB9XG5cbiAgfVxuXG4gIC8qKlxuICAgKiBJbml0aWFsaXplIHRoZSBQaXhlbCB0cmFja2luZyBzY3JpcHRcbiAgICogLSBBZGRzIHRoZSBzY3JpcHQgdG8gcGFnZSdzIGhlYWRcbiAgICogLSBUcmFja3MgZmlyc3QgcGFnZSB2aWV3XG4gICAqL1xuICBpbml0aWFsaXplKHBpeGVsSWQgPSB0aGlzLmNvbmZpZy5waXhlbElkKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuaXNMb2FkZWQoKSkge1xuICAgICAgY29uc29sZS53YXJuKCdUcmllZCB0byBpbml0aWFsaXplIGEgUGl4ZWwgaW5zdGFuY2Ugd2hpbGUgYW5vdGhlciBpcyBhbHJlYWR5IGFjdGl2ZS4gUGxlYXNlIGNhbGwgYHJlbW92ZSgpYCBiZWZvcmUgaW5pdGlhbGl6aW5nIGEgbmV3IGluc3RhbmNlLicpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLmNvbmZpZy5lbmFibGVkID0gdHJ1ZTtcbiAgICB0aGlzLmFkZFBpeGVsU2NyaXB0KHBpeGVsSWQpO1xuICB9XG5cbiAgLyoqIFJlbW92ZSB0aGUgUGl4ZWwgdHJhY2tpbmcgc2NyaXB0ICovXG4gIHJlbW92ZSgpOiB2b2lkIHtcbiAgICB0aGlzLnJlbW92ZVBpeGVsU2NyaXB0KCk7XG4gICAgdGhpcy5jb25maWcuZW5hYmxlZCA9IGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFRyYWNrIGEgU3RhbmRhcmQgRXZlbnQgYXMgcHJlZGVmaW5lZCBieSBGYWNlYm9va1xuICAgKlxuICAgKiBTZWUge0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVycy5mYWNlYm9vay5jb20vZG9jcy9mYWNlYm9vay1waXhlbC9yZWZlcmVuY2UgRmFjZWJvb2sgUGl4ZWwgZG9jcyAtIHJlZmVyZW5jZX1cbiAgICogQHBhcmFtIGV2ZW50TmFtZSBUaGUgbmFtZSBvZiB0aGUgZXZlbnQgdGhhdCBpcyBiZWluZyB0cmFja2VkXG4gICAqIEBwYXJhbSBwcm9wZXJ0aWVzIE9wdGlvbmFsIHByb3BlcnRpZXMgb2YgdGhlIGV2ZW50XG4gICAqL1xuICB0cmFjayhcbiAgICBldmVudE5hbWU6IFBpeGVsRXZlbnROYW1lLFxuICAgIHByb3BlcnRpZXM/OiBQaXhlbEV2ZW50UHJvcGVydGllc1xuICApOiB2b2lkIHtcbiAgICBpZiAoIWlzUGxhdGZvcm1Ccm93c2VyKHRoaXMucGxhdGZvcm1JZCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuaXNMb2FkZWQoKSkge1xuICAgICAgY29uc29sZS53YXJuKCdUcmllZCB0byB0cmFjayBhbiBldmVudCB3aXRob3V0IGluaXRpYWxpemluZyBhIFBpeGVsIGluc3RhbmNlLiBDYWxsIGBpbml0aWFsaXplKClgIGZpcnN0LicpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChwcm9wZXJ0aWVzKSB7XG4gICAgICBmYnEoJ3RyYWNrJywgZXZlbnROYW1lLCBwcm9wZXJ0aWVzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZmJxKCd0cmFjaycsIGV2ZW50TmFtZSk7XG4gICAgfVxuXG4gIH1cblxuICAvKipcbiAgICogVHJhY2sgYSBjdXN0b20gRXZlbnRcbiAgICpcbiAgICogU2VlIHtAbGluayBodHRwczovL2RldmVsb3BlcnMuZmFjZWJvb2suY29tL2RvY3MvZmFjZWJvb2stcGl4ZWwvaW1wbGVtZW50YXRpb24vY29udmVyc2lvbi10cmFja2luZyNjdXN0b20tY29udmVyc2lvbnMgRmFjZWJvb2sgUGl4ZWwgZG9jcyAtIGN1c3RvbSBjb252ZXJzaW9uc31cbiAgICogQHBhcmFtIGV2ZW50TmFtZSBUaGUgbmFtZSBvZiB0aGUgZXZlbnQgdGhhdCBpcyBiZWluZyB0cmFja2VkXG4gICAqIEBwYXJhbSBwcm9wZXJ0aWVzIE9wdGlvbmFsIHByb3BlcnRpZXMgb2YgdGhlIGV2ZW50XG4gICAqL1xuICB0cmFja0N1c3RvbShldmVudE5hbWU6IHN0cmluZywgcHJvcGVydGllcz86IG9iamVjdCk6IHZvaWQge1xuICAgIGlmICghaXNQbGF0Zm9ybUJyb3dzZXIodGhpcy5wbGF0Zm9ybUlkKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5pc0xvYWRlZCgpKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ1RyaWVkIHRvIHRyYWNrIGFuIGV2ZW50IHdpdGhvdXQgaW5pdGlhbGl6aW5nIGEgUGl4ZWwgaW5zdGFuY2UuIENhbGwgYGluaXRpYWxpemUoKWAgZmlyc3QuJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHByb3BlcnRpZXMpIHtcbiAgICAgIGZicSgndHJhY2tDdXN0b20nLCBldmVudE5hbWUsIHByb3BlcnRpZXMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBmYnEoJ3RyYWNrQ3VzdG9tJywgZXZlbnROYW1lKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQWRkcyB0aGUgRmFjZWJvb2sgUGl4ZWwgdHJhY2tpbmcgc2NyaXB0IHRvIHRoZSBhcHBsaWNhdGlvblxuICAgKiBAcGFyYW0gcGl4ZWxJZCBUaGUgRmFjZWJvb2sgUGl4ZWwgSUQgdG8gdXNlXG4gICAqL1xuICBwcml2YXRlIGFkZFBpeGVsU2NyaXB0KHBpeGVsSWQ6IHN0cmluZyk6IHZvaWQge1xuICAgIGlmICghaXNQbGF0Zm9ybUJyb3dzZXIodGhpcy5wbGF0Zm9ybUlkKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHBpeGVsQ29kZSA9IGBcbiAgICB2YXIgcGl4ZWxDb2RlID0gZnVuY3Rpb24oZixiLGUsdixuLHQscylcbiAgICB7aWYoZi5mYnEpcmV0dXJuO249Zi5mYnE9ZnVuY3Rpb24oKXtuLmNhbGxNZXRob2Q/XG4gICAgbi5jYWxsTWV0aG9kLmFwcGx5KG4sYXJndW1lbnRzKTpuLnF1ZXVlLnB1c2goYXJndW1lbnRzKX07XG4gICAgaWYoIWYuX2ZicSlmLl9mYnE9bjtuLnB1c2g9bjtuLmxvYWRlZD0hMDtuLnZlcnNpb249JzIuMCc7XG4gICAgbi5xdWV1ZT1bXTt0PWIuY3JlYXRlRWxlbWVudChlKTt0LmFzeW5jPSEwO1xuICAgIHQuc3JjPXY7cz1iLmdldEVsZW1lbnRzQnlUYWdOYW1lKGUpWzBdO1xuICAgIHMucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUodCxzKX0od2luZG93LCBkb2N1bWVudCwnc2NyaXB0JyxcbiAgICAnaHR0cHM6Ly9jb25uZWN0LmZhY2Vib29rLm5ldC9lbl9VUy9mYmV2ZW50cy5qcycpO1xuICAgIGZicSgnaW5pdCcsICcke3BpeGVsSWR9Jyk7XG4gICAgZmJxKCd0cmFjaycsICdQYWdlVmlldycpO2A7XG5cblxuICAgIGNvbnN0IHNjcmlwdEVsZW1lbnQgPSB0aGlzLnJlbmRlcmVyLmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuICAgIHRoaXMucmVuZGVyZXIuc2V0QXR0cmlidXRlKHNjcmlwdEVsZW1lbnQsICdpZCcsICdwaXhlbC1zY3JpcHQnKTtcbiAgICB0aGlzLnJlbmRlcmVyLnNldEF0dHJpYnV0ZShzY3JpcHRFbGVtZW50LCAndHlwZScsICd0ZXh0L2phdmFzY3JpcHQnKTtcbiAgICB0aGlzLnJlbmRlcmVyLnNldFByb3BlcnR5KHNjcmlwdEVsZW1lbnQsICdpbm5lckhUTUwnLCBwaXhlbENvZGUpO1xuICAgIHRoaXMucmVuZGVyZXIuYXBwZW5kQ2hpbGQodGhpcy5kb2MuaGVhZCwgc2NyaXB0RWxlbWVudCk7XG4gIH1cblxuICAvKiogUmVtb3ZlIEZhY2Vib29rIFBpeGVsIHRyYWNraW5nIHNjcmlwdCBmcm9tIHRoZSBhcHBsaWNhdGlvbiAqL1xuICBwcml2YXRlIHJlbW92ZVBpeGVsU2NyaXB0KCk6IHZvaWQge1xuICAgIGlmICghaXNQbGF0Zm9ybUJyb3dzZXIodGhpcy5wbGF0Zm9ybUlkKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBwaXhlbEVsZW1lbnQgPSB0aGlzLmRvYy5nZXRFbGVtZW50QnlJZCgncGl4ZWwtc2NyaXB0Jyk7XG4gICAgaWYgKHBpeGVsRWxlbWVudCkge1xuICAgICAgcGl4ZWxFbGVtZW50LnJlbW92ZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBDaGVja3MgaWYgdGhlIHNjcmlwdCBlbGVtZW50IGlzIHByZXNlbnQgKi9cbiAgcHJpdmF0ZSBpc0xvYWRlZCgpOiBib29sZWFuIHtcbiAgICBpZiAoaXNQbGF0Zm9ybUJyb3dzZXIodGhpcy5wbGF0Zm9ybUlkKSkge1xuICAgICAgY29uc3QgcGl4ZWxFbGVtZW50ID0gdGhpcy5kb2MuZ2V0RWxlbWVudEJ5SWQoJ3BpeGVsLXNjcmlwdCcpO1xuICAgICAgcmV0dXJuICEhcGl4ZWxFbGVtZW50O1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxufVxuIl19