import { Stage, Status } from "allure-js-commons";
import { Example } from "./events/Example";
export declare function statusTextToAllure(status?: string): Status;
export declare function statusTextToStage(status?: string): Stage;
export declare function hash(data: string): string;
export declare function applyExample(text: string, example: Example | undefined): string;
export declare function stripIndent(data: string): string;
