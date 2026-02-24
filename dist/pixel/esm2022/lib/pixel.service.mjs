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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGl4ZWwuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL3BpeGVsL3NyYy9saWIvcGl4ZWwuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUErQixNQUFNLGVBQWUsQ0FBQztBQUN2RyxPQUFPLEVBQUUsYUFBYSxFQUFVLE1BQU0saUJBQWlCLENBQUM7QUFDeEQsT0FBTyxFQUFFLFFBQVEsRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzlELE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQzs7O0FBT3hDLE1BQU0sT0FBTyxZQUFZO0lBS3ZCLFlBQzRCLE1BQTBCLEVBQzFCLGdCQUFxQixFQUNsQixVQUFrQixFQUMzQixNQUFjLEVBQzFCLGVBQWlDO1FBSmYsV0FBTSxHQUFOLE1BQU0sQ0FBb0I7UUFDMUIscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFLO1FBQ2xCLGVBQVUsR0FBVixVQUFVLENBQVE7UUFDM0IsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUMxQixvQkFBZSxHQUFmLGVBQWUsQ0FBa0I7UUFHekMsNkdBQTZHO1FBQzdHLDREQUE0RDtRQUM1RCxJQUFJLENBQUMsR0FBRyxHQUFHLGdCQUE0QixDQUFDO1FBQ3hDLElBQUksQ0FBQyxRQUFRLEdBQUcsZUFBZSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFFM0QsSUFBSSxNQUFNLEVBQUUsQ0FBQztZQUNYLDhDQUE4QztZQUM5QyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLFlBQVksYUFBYSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0JBRXBGLElBQUksSUFBSSxDQUFDLFFB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QUFFLGFBQWEsQ0FBQyxDQUFDO0lBQzFELENBQUM7SUFFRCxpRUFBaUU7SUFDekQsaUJBQWlCO1FBQ3ZCLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQztZQUN4QyxPQUFPO1FBQ1QsQ0FBQztRQUNELE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQzdELElBQUksWUFBWSxFQUFFLENBQUM7WUFDakIsWUFBWSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ3hCLENBQUM7SUFDSCxDQUFDO0lBRUQsOENBQThDO0lBQ3RDLFFBQVE7UUFDZCxJQUFJLGlCQUFpQixDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDO1lBQ3ZDLE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBQzdELE9BQU8sQ0FBQyxDQUFDLFlBQVksQ0FBQztRQUN4QixDQUFDO1FBQ0QsT0FBTyxLQUFLLENBQUM7SUFDZixDQUFDOzZFQXRKVSxZQUFZLGNBTWIsUUFBUSxlQUNSLFFBQVEsZUFDUixXQUFXO3VFQVJWLFlBQVksV0FBWixZQUFZLG1CQUZYLE1BQU07O2lGQUVQLFlBQVk7Y0FIeEIsVUFBVTtlQUFDO2dCQUNWLFVBQVUsRUFBRSxNQUFNO2FBQ25COztzQkFPSSxNQUFNO3VCQUFDLFFBQVE7O3NCQUNmLE1BQU07dUJBQUMsUUFBUTs7c0JBQ2YsTUFBTTt1QkFBQyxXQUFXOztzQkFDbEIsUUFBUSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFBpeGVsRXZlbnROYW1lLCBQaXhlbENvbmZpZ3VyYXRpb24sIFBpeGVsRXZlbnRQcm9wZXJ0aWVzIH0gZnJvbSAnLi9waXhlbC5tb2RlbHMnO1xuaW1wb3J0IHsgSW5qZWN0LCBJbmplY3RhYmxlLCBPcHRpb25hbCwgUExBVEZPUk1fSUQsIFJlbmRlcmVyMiwgUmVuZGVyZXJGYWN0b3J5MiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTmF2aWdhdGlvbkVuZCwgUm91dGVyIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IERPQ1VNRU5ULCBpc1BsYXRmb3JtQnJvd3NlciB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBmaWx0ZXIgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmRlY2xhcmUgY29uc3QgZmJxOiBhbnk7XG5cbkBJbmplY3RhYmxlKHtcbiAgcHJvdmlkZWRJbjogJ3Jvb3QnXG59KVxuZXhwb3J0IGNsYXNzIFBpeGVsU2VydmljZSB7XG5cbiAgcHJpdmF0ZSBkb2M6IERvY3VtZW50O1xuICBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjJcblxuICBjb25zdHJ1Y3RvcihcbiAgICBASW5qZWN0KCdjb25maWcnKSBwcml2YXRlIGNvbmZpZzogUGl4ZWxDb25maWd1cmF0aW9uLFxuICAgIEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgaW5qZWN0ZWREb2N1bWVudDogYW55LFxuICAgIEBJbmplY3QoUExBVEZPUk1fSUQpIHByaXZhdGUgcGxhdGZvcm1JZDogT2JqZWN0LFxuICAgIEBPcHRpb25hbCgpIHByaXZhdGUgcm91dGVyOiBSb3V0ZXIsXG4gICAgcHJpdmF0ZSByZW5kZXJlckZhY3Rvcnk6IFJlbmRlcmVyRmFjdG9yeTJcbiAgKSB7XG5cbiAgICAvLyBET0NVTUVOVCBjYW5ub3QgYmUgaW5qZWN0ZWQgZGlyZWN0bHkgYXMgRG9jdW1lbnQgdHlwZSwgc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIvaXNzdWVzLzIwMzUxXG4gICAgLy8gSXQgaXMgdGhlcmVmb3JlIGluamVjdGVkIGFzIGFueSBhbmQgdGhlbiBjYXN0IHRvIERvY3VtZW50XG4gICAgdGhpcy5kb2MgPSBpbmplY3RlZERvY3VtZW50IGFzIERvY3VtZW50O1xuICAgIHRoaXMucmVuZGVyZXIgPSByZW5kZXJlckZhY3RvcnkuY3JlYXRlUmVuZGVyZXIobnVsbCwgbnVsbCk7XG5cbiAgICBpZiAocm91dGVyKSB7XG4gICAgICAvLyBMb2cgcGFnZSB2aWV3cyBhZnRlciByb3V0ZXIgbmF2aWdhdGlvbiBlbmRzXG4gICAgICByb3V0ZXIuZXZlbnRzLnBpcGUoZmlsdGVyKGV2ZW50ID0+IGV2ZW50IGluc3RhbmNlb2YgTmF2aWdhdGlvbkVuZCkpLnN1YnNjcmliZShldmVudCA9PiB7XG5cbiAgICAgICAgaWYgKHRoaXMuaXNMb2FkZWQoKSAmJiBjb25maWcuZW5hYmxlUGFnZVZpZXdUcmFjaykge1xuICAgICAgICAgIHRoaXMudHJhY2soJ1BhZ2VWaWV3Jyk7XG4gICAgICAgIH1cblxuICAgICAgfSk7XG4gICAgfVxuXG4gIH1cblxuICAvKipcbiAgICogSW5pdGlhbGl6ZSB0aGUgUGl4ZWwgdHJhY2tpbmcgc2NyaXB0XG4gICAqIC0gQWRkcyB0aGUgc2NyaXB0IHRvIHBhZ2UncyBoZWFkXG4gICAqIC0gVHJhY2tzIGZpcnN0IHBhZ2Ugdmlld1xuICAgKi9cbiAgaW5pdGlhbGl6ZShwaXhlbElkID0gdGhpcy5jb25maWcucGl4ZWxJZCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmlzTG9hZGVkKCkpIHtcbiAgICAgIGNvbnNvbGUud2FybignVHJpZWQgdG8gaW5pdGlhbGl6ZSBhIFBpeGVsIGluc3RhbmNlIHdoaWxlIGFub3RoZXIgaXMgYWxyZWFkeSBhY3RpdmUuIFBsZWFzZSBjYWxsIGByZW1vdmUoKWAgYmVmb3JlIGluaXRpYWxpemluZyBhIG5ldyBpbnN0YW5jZS4nKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5jb25maWcuZW5hYmxlZCA9IHRydWU7XG4gICAgdGhpcy5hZGRQaXhlbFNjcmlwdChwaXhlbElkKTtcbiAgfVxuXG4gIC8qKiBSZW1vdmUgdGhlIFBpeGVsIHRyYWNraW5nIHNjcmlwdCAqL1xuICByZW1vdmUoKTogdm9pZCB7XG4gICAgdGhpcy5yZW1vdmVQaXhlbFNjcmlwdCgpO1xuICAgIHRoaXMuY29uZmlnLmVuYWJsZWQgPSBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUcmFjayBhIFN0YW5kYXJkIEV2ZW50IGFzIHByZWRlZmluZWQgYnkgRmFjZWJvb2tcbiAgICpcbiAgICogU2VlIHtAbGluayBodHRwczovL2RldmVsb3BlcnMuZmFjZWJvb2suY29tL2RvY3MvZmFjZWJvb2stcGl4ZWwvcmVmZXJlbmNlIEZhY2Vib29rIFBpeGVsIGRvY3MgLSByZWZlcmVuY2V9XG4gICAqIEBwYXJhbSBldmVudE5hbWUgVGhlIG5hbWUgb2YgdGhlIGV2ZW50IHRoYXQgaXMgYmVpbmcgdHJhY2tlZFxuICAgKiBAcGFyYW0gcHJvcGVydGllcyBPcHRpb25hbCBwcm9wZXJ0aWVzIG9mIHRoZSBldmVudFxuICAgKi9cbiAgdHJhY2soXG4gICAgZXZlbnROYW1lOiBQaXhlbEV2ZW50TmFtZSxcbiAgICBwcm9wZXJ0aWVzPzogUGl4ZWxFdmVudFByb3BlcnRpZXNcbiAgKTogdm9pZCB7XG4gICAgaWYgKCFpc1BsYXRmb3JtQnJvd3Nlcih0aGlzLnBsYXRmb3JtSWQpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmlzTG9hZGVkKCkpIHtcbiAgICAgIGNvbnNvbGUud2FybignVHJpZWQgdG8gdHJhY2sgYW4gZXZlbnQgd2l0aG91dCBpbml0aWFsaXppbmcgYSBQaXhlbCBpbnN0YW5jZS4gQ2FsbCBgaW5pdGlhbGl6ZSgpYCBmaXJzdC4nKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAocHJvcGVydGllcykge1xuICAgICAgZmJxKCd0cmFjaycsIGV2ZW50TmFtZSwgcHJvcGVydGllcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZicSgndHJhY2snLCBldmVudE5hbWUpO1xuICAgIH1cblxuICB9XG5cbiAgLyoqXG4gICAqIFRyYWNrIGEgY3VzdG9tIEV2ZW50XG4gICAqXG4gICAqIFNlZSB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXJzLmZhY2Vib29rLmNvbS9kb2NzL2ZhY2Vib29rLXBpeGVsL2ltcGxlbWVudGF0aW9uL2NvbnZlcnNpb24tdHJhY2tpbmcjY3VzdG9tLWNvbnZlcnNpb25zIEZhY2Vib29rIFBpeGVsIGRvY3MgLSBjdXN0b20gY29udmVyc2lvbnN9XG4gICAqIEBwYXJhbSBldmVudE5hbWUgVGhlIG5hbWUgb2YgdGhlIGV2ZW50IHRoYXQgaXMgYmVpbmcgdHJhY2tlZFxuICAgKiBAcGFyYW0gcHJvcGVydGllcyBPcHRpb25hbCBwcm9wZXJ0aWVzIG9mIHRoZSBldmVudFxuICAgKi9cbiAgdHJhY2tDdXN0b20oZXZlbnROYW1lOiBzdHJpbmcsIHByb3BlcnRpZXM/OiBvYmplY3QpOiB2b2lkIHtcbiAgICBpZiAoIWlzUGxhdGZvcm1Ccm93c2VyKHRoaXMucGxhdGZvcm1JZCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuaXNMb2FkZWQoKSkge1xuICAgICAgY29uc29sZS53YXJuKCdUcmllZCB0byB0cmFjayBhbiBldmVudCB3aXRob3V0IGluaXRpYWxpemluZyBhIFBpeGVsIGluc3RhbmNlLiBDYWxsIGBpbml0aWFsaXplKClgIGZpcnN0LicpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChwcm9wZXJ0aWVzKSB7XG4gICAgICBmYnEoJ3RyYWNrQ3VzdG9tJywgZXZlbnROYW1lLCBwcm9wZXJ0aWVzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZmJxKCd0cmFja0N1c3RvbScsIGV2ZW50TmFtZSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFkZHMgdGhlIEZhY2Vib29rIFBpeGVsIHRyYWNraW5nIHNjcmlwdCB0byB0aGUgYXBwbGljYXRpb25cbiAgICogQHBhcmFtIHBpeGVsSWQgVGhlIEZhY2Vib29rIFBpeGVsIElEIHRvIHVzZVxuICAgKi9cbiAgcHJpdmF0ZSBhZGRQaXhlbFNjcmlwdChwaXhlbElkOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBpZiAoIWlzUGxhdGZvcm1Ccm93c2VyKHRoaXMucGxhdGZvcm1JZCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBwaXhlbENvZGUgPSBgXG4gICAgdmFyIHBpeGVsQ29kZSA9IGZ1bmN0aW9uKGYsYixlLHYsbix0LHMpXG4gICAge2lmKGYuZmJxKXJldHVybjtuPWYuZmJxPWZ1bmN0aW9uKCl7bi5jYWxsTWV0aG9kP1xuICAgIG4uY2FsbE1ldGhvZC5hcHBseShuLGFyZ3VtZW50cyk6bi5xdWV1ZS5wdXNoKGFyZ3VtZW50cyl9O1xuICAgIGlmKCFmLl9mYnEpZi5fZmJxPW47bi5wdXNoPW47bi5sb2FkZWQ9ITA7bi52ZXJzaW9uPScyLjAnO1xuICAgIG4ucXVldWU9W107dD1iLmNyZWF0ZUVsZW1lbnQoZSk7dC5hc3luYz0hMDtcbiAgICB0LnNyYz12O3M9Yi5nZXRFbGVtZW50c0J5VGFnTmFtZShlKVswXTtcbiAgICBzLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHQscyl9KHdpbmRvdywgZG9jdW1lbnQsJ3NjcmlwdCcsXG4gICAgJ2h0dHBzOi8vY29ubmVjdC5mYWNlYm9vay5uZXQvZW5fVVMvZmJldmVudHMuanMnKTtcbiAgICBmYnEoJ2luaXQnLCAnJHtwaXhlbElkfScpO1xuICAgIGZicSgndHJhY2snLCAnUGFnZVZpZXcnKTtgO1xuXG5cbiAgICBjb25zdCBzY3JpcHRFbGVtZW50ID0gdGhpcy5yZW5kZXJlci5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcbiAgICB0aGlzLnJlbmRlcmVyLnNldEF0dHJpYnV0ZShzY3JpcHRFbGVtZW50LCAnaWQnLCAncGl4ZWwtc2NyaXB0Jyk7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRBdHRyaWJ1dGUoc2NyaXB0RWxlbWVudCwgJ3R5cGUnLCAndGV4dC9qYXZhc2NyaXB0Jyk7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRQcm9wZXJ0eShzY3JpcHRFbGVtZW50LCAnaW5uZXJIVE1MJywgcGl4ZWxDb2RlKTtcbiAgICB0aGlzLnJlbmRlcmVyLmFwcGVuZENoaWxkKHRoaXMuZG9jLmhlYWQsIHNjcmlwdEVsZW1lbnQpO1xuICB9XG5cbiAgLyoqIFJlbW92ZSBGYWNlYm9vayBQaXhlbCB0cmFja2luZyBzY3JpcHQgZnJvbSB0aGUgYXBwbGljYXRpb24gKi9cbiAgcHJpdmF0ZSByZW1vdmVQaXhlbFNjcmlwdCgpOiB2b2lkIHtcbiAgICBpZiAoIWlzUGxhdGZvcm1Ccm93c2VyKHRoaXMucGxhdGZvcm1JZCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgcGl4ZWxFbGVtZW50ID0gdGhpcy5kb2MuZ2V0RWxlbWVudEJ5SWQoJ3BpeGVsLXNjcmlwdCcpO1xuICAgIGlmIChwaXhlbEVsZW1lbnQpIHtcbiAgICAgIHBpeGVsRWxlbWVudC5yZW1vdmUoKTtcbiAgICB9XG4gIH1cblxuICAvKiogQ2hlY2tzIGlmIHRoZSBzY3JpcHQgZWxlbWVudCBpcyBwcmVzZW50ICovXG4gIHByaXZhdGUgaXNMb2FkZWQoKTogYm9vbGVhbiB7XG4gICAgaWYgKGlzUGxhdGZvcm1Ccm93c2VyKHRoaXMucGxhdGZvcm1JZCkpIHtcbiAgICAgIGNvbnN0IHBpeGVsRWxlbWVudCA9IHRoaXMuZG9jLmdldEVsZW1lbnRCeUlkKCdwaXhlbC1zY3JpcHQnKTtcbiAgICAgIHJldHVybiAhIXBpeGVsRWxlbWVudDtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbn1cbiJdfQ==