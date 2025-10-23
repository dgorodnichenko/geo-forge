import { BadRequestException, Injectable } from "@nestjs/common";
import { ConversionType } from "../constants/conversion-types.enum";
import { ConversionStrategy } from "../interfaces/conversion-strategy";
import { KmzToGeojsonStrategy } from "../strategies/kmz-to-geojson.strategy";

@Injectable()
export class ConversionStrategyRegistry {
    private readonly strategies = new Map<ConversionType, ConversionStrategy>();

    constructor(private readonly kmzToGeojsonStrategy: KmzToGeojsonStrategy) {
        this.registerStrategies();
    }

    getStrategy(conversionType: ConversionType): ConversionStrategy {
        const strategy = this.strategies.get(conversionType);
        if (!strategy) {
            throw new BadRequestException(`Conversion type '${conversionType}' is not supported`);
        }
        return strategy;
    }

    getSupportedFormats(): { input: string[], output: string[] } {
        const inputFormats = new Set<string>();
        const outputFormats = new Set<string>();

        this.strategies.forEach(strategy => {
            strategy.getSupportedExtensions().forEach(ext => inputFormats.add(ext));
            outputFormats.add(strategy.getOutputExtension());
        });

        return {
            input: Array.from(inputFormats),
            output: Array.from(outputFormats)
        };
    }

    private registerStrategies(): void {
        this.strategies.set(ConversionType.KMZ_TO_GEOJSON, this.kmzToGeojsonStrategy);
    }
}