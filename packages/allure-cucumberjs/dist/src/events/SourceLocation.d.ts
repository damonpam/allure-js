export declare class SourceLocation {
    sourceLocation?: {
        uri: string;
        line: number;
    };
    actionLocation?: {
        uri: string;
        line: number;
    };
    static toKey(s: SourceLocation): string;
}
