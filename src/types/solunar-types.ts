export type SolunarData = {
    sunRise: string;
    sunSet: string;
    moonPhase: string;
    moonIllumination: number;
    major1Start: string;
    major1Stop: string;
    major2Start: string;
    major2Stop: string;
    minor1Start: string;
    minor1Stop: string;
    minor2Start: string;
    minor2Stop: string;
    dayRating: number;
    hourlyRating: Record<string, number>;
};