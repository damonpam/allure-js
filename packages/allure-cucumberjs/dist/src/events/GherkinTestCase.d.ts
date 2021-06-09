import { GherkinStep } from "./GherkinStep";
import { GherkinExample } from "./GherkinExample";
import { Example } from "./Example";
export declare class GherkinTestCase {
    type?: string;
    location?: {
        line: number;
    };
    tags?: {
        name: string;
    }[];
    name?: string;
    description?: string;
    steps: GherkinStep[];
    stepMap: Map<number, GherkinStep>;
    examples?: GherkinExample[];
    example?: Example;
}
