import { PixelConfiguration } from './pixel.models';
import { ModuleWithProviders } from '@angular/core';
import { PixelService } from './pixel.service';
import * as i0 from "@angular/core";
export declare class PixelModule {
    private pixel;
    private static config;
    constructor(pixel: PixelService, platformId: Object);
    /**
     * Initiale the Facebook Pixel Module
     *
     * Add your Pixel ID as parameter
     */
    static forRoot(config: PixelConfiguration): ModuleWithProviders<PixelModule>;
    /**
     * Verifies the Pixel ID that was passed into the configuration.
     * - Checks if Pixel was initialized
     * @param pixelId Pixel ID to verify
     */
    private static verifyPixelId;
    static ɵfac: i0.ɵɵFactoryDeclaration<PixelModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<PixelModule, never, never, never>;
    static ɵinj: i0.ɵɵInjectorDeclaration<PixelModule>;
}
