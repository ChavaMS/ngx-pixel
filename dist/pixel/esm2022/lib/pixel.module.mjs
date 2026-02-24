import { Inject, NgModule, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PixelService } from './pixel.service';
import * as i0 from "@angular/core";
import * as i1 from "./pixel.service";
export class PixelModule {
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
    static { this.ɵfac = function PixelModule_Factory(t) { return new (t || PixelModule)(i0.ɵɵinject(i1.PixelService), i0.ɵɵinject(PLATFORM_ID)); }; }
    static { this.ɵmod = /*@__PURE__*/ i0.ɵɵdefineNgModule({ type: PixelModule }); }
    static { this.ɵinj = /*@__PURE__*/ i0.ɵɵdefineInjector({}); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(PixelModule, [{
        type: NgModule,
        args: [{
                imports: [],
            }]
    }], () => [{ type: i1.PixelService }, { type: Object, decorators: [{
                type: Inject,
                args: [PLATFORM_ID]
            }] }], null); })();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGl4ZWwubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vcHJvamVjdHMvcGl4ZWwvc3JjL2xpYi9waXhlbC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLE1BQU0sRUFBdUIsUUFBUSxFQUFFLFdBQVcsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNuRixPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUNwRCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7OztBQUsvQyxNQUFNLE9BQU8sV0FBVzthQUVQLFdBQU0sR0FBOEIsSUFBSSxBQUFsQyxDQUFtQztJQUV4RCxZQUNVLEtBQW1CLEVBQ04sVUFBa0I7UUFEL0IsVUFBSyxHQUFMLEtBQUssQ0FBYztRQUczQixJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ3hCLE1BQU0sS0FBSyxDQUFDLDZGQUE2RixDQUFDLENBQUM7UUFDN0csQ0FBQztRQUNELElBQUksV0FBVyxDQUFDLE1BQU0sQ0FBQyxPQUFPLElBQUksaUJBQWlCLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQztZQUNoRSxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQzFCLENBQUM7SUFDSCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBMEI7UUFDdkMsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsTUFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQztRQUMvQixJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRTVCLE9BQU87WUFDTCxRQUFRLEVBQUUsV0FBVztZQUNyQixTQUFTLEVBQUUsQ0FBQyxZQUFZLEVBQUUsRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsQ0FBQztTQUNuRSxDQUFDO0lBQ0osQ0FBQztJQUVEOzs7O09BSUc7SUFDSyxNQUFNLENBQUMsYUFBYSxDQUFDLE9BQWU7UUFDMUMsMEVBQTBFO1FBQzFFLElBQUksT0FBTyxLQUFLLElBQUksSUFBSSxPQUFPLEtBQUssU0FBUyxJQUFJLE9BQU8sQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFLENBQUM7WUFDdEUsTUFBTSxLQUFLLENBQUMsNkVBQTZFLENBQUMsQ0FBQztRQUM3RixDQUFDO0lBQ0gsQ0FBQzs0RUExQ1UsV0FBVyw0Q0FNWixXQUFXO21FQU5WLFdBQVc7OztpRkFBWCxXQUFXO2NBSHZCLFFBQVE7ZUFBQztnQkFDUixPQUFPLEVBQUUsRUFBRTthQUNaOztzQkFPSSxNQUFNO3VCQUFDLFdBQVciLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQaXhlbENvbmZpZ3VyYXRpb24gfSBmcm9tICcuL3BpeGVsLm1vZGVscyc7XG5pbXBvcnQgeyBJbmplY3QsIE1vZHVsZVdpdGhQcm92aWRlcnMsIE5nTW9kdWxlLCBQTEFURk9STV9JRCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgaXNQbGF0Zm9ybUJyb3dzZXIgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgUGl4ZWxTZXJ2aWNlIH0gZnJvbSAnLi9waXhlbC5zZXJ2aWNlJztcblxuQE5nTW9kdWxlKHtcbiAgaW1wb3J0czogW10sXG59KVxuZXhwb3J0IGNsYXNzIFBpeGVsTW9kdWxlIHtcblxuICBwcml2YXRlIHN0YXRpYyBjb25maWc6IFBpeGVsQ29uZmlndXJhdGlvbiB8IG51bGwgPSBudWxsO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcGl4ZWw6IFBpeGVsU2VydmljZSxcbiAgICBASW5qZWN0KFBMQVRGT1JNX0lEKSBwbGF0Zm9ybUlkOiBPYmplY3RcbiAgKSB7XG4gICAgaWYgKCFQaXhlbE1vZHVsZS5jb25maWcpIHtcbiAgICAgIHRocm93IEVycm9yKCduZ3gtcGl4ZWwgbm90IGNvbmZpZ3VyZWQgY29ycmVjdGx5LiBQYXNzIHRoZSBgcGl4ZWxJZGAgcHJvcGVydHkgdG8gdGhlIGBmb3JSb290KClgIGZ1bmN0aW9uJyk7XG4gICAgfVxuICAgIGlmIChQaXhlbE1vZHVsZS5jb25maWcuZW5hYmxlZCAmJiBpc1BsYXRmb3JtQnJvd3NlcihwbGF0Zm9ybUlkKSkge1xuICAgICAgdGhpcy5waXhlbC5pbml0aWFsaXplKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxlIHRoZSBGYWNlYm9vayBQaXhlbCBNb2R1bGVcbiAgICpcbiAgICogQWRkIHlvdXIgUGl4ZWwgSUQgYXMgcGFyYW1ldGVyXG4gICAqL1xuICBzdGF0aWMgZm9yUm9vdChjb25maWc6IFBpeGVsQ29uZmlndXJhdGlvbik6IE1vZHVsZVdpdGhQcm92aWRlcnM8UGl4ZWxNb2R1bGU+IHtcbiAgICB0aGlzLmNvbmZpZyA9IGNvbmZpZztcbiAgICBjb25zdCBwaXhlbElkID0gY29uZmlnLnBpeGVsSWQ7XG4gICAgdGhpcy52ZXJpZnlQaXhlbElkKHBpeGVsSWQpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIG5nTW9kdWxlOiBQaXhlbE1vZHVsZSxcbiAgICAgIHByb3ZpZGVyczogW1BpeGVsU2VydmljZSwgeyBwcm92aWRlOiAnY29uZmlnJywgdXNlVmFsdWU6IGNvbmZpZyB9XVxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogVmVyaWZpZXMgdGhlIFBpeGVsIElEIHRoYXQgd2FzIHBhc3NlZCBpbnRvIHRoZSBjb25maWd1cmF0aW9uLlxuICAgKiAtIENoZWNrcyBpZiBQaXhlbCB3YXMgaW5pdGlhbGl6ZWRcbiAgICogQHBhcmFtIHBpeGVsSWQgUGl4ZWwgSUQgdG8gdmVyaWZ5XG4gICAqL1xuICBwcml2YXRlIHN0YXRpYyB2ZXJpZnlQaXhlbElkKHBpeGVsSWQ6IHN0cmluZyk6IHZvaWQge1xuICAgIC8vIEhhdmUgdG8gdmVyaWZ5IGZpcnN0IHRoYXQgYWxsIFBpeGVsIElEcyBmb2xsb3cgdGhlIHNhbWUgMTUgZGlnaXQgZm9ybWF0XG4gICAgaWYgKHBpeGVsSWQgPT09IG51bGwgfHwgcGl4ZWxJZCA9PT0gdW5kZWZpbmVkIHx8IHBpeGVsSWQubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aHJvdyBFcnJvcignSW52YWxpZCBGYWNlYm9vayBQaXhlbCBJRC4gRGlkIHlvdSBwYXNzIHRoZSBJRCBpbnRvIHRoZSBmb3JSb290KCkgZnVuY3Rpb24/Jyk7XG4gICAgfVxuICB9XG5cbn1cbiJdfQ==