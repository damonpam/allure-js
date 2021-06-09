/// <reference types="chai" />
declare global {
    namespace Chai {
        interface Assertion extends LanguageChains, NumericComparison, TypeComparison {
            partial(expected: any, granularity?: string): void;
        }
    }
}
export declare function ChaiPartial(_chai: any, utils: any): void;
