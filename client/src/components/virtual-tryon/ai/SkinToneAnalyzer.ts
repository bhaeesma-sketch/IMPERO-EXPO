import { NormalizedLandmark } from '@mediapipe/face_mesh';

export type SkinTone = 'warm' | 'cool' | 'neutral';

export interface AnalysisResult {
    skinTone: SkinTone;
    recommendedMetal: string;
    description: string;
    colors: string[]; // Debug colors
}

export class SkinToneAnalyzer {

    static analyze(video: HTMLVideoElement, landmarks: NormalizedLandmark[]): AnalysisResult {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            throw new Error("Could not get canvas context");
        }

        ctx.drawImage(video, 0, 0);

        // Landmarks indices (MediaPipe Face Mesh)
        // Cheeks are good areas. Forehead too.
        // Left Cheek: 234, Right Cheek: 454
        // Forehead: 10
        // We use regions around these points.

        const samplePoints = [234, 454, 10];
        let totalR = 0, totalG = 0, totalB = 0;
        let count = 0;

        samplePoints.forEach(index => {
            const point = landmarks[index];
            if (!point) return;

            const x = Math.floor(point.x * canvas.width);
            const y = Math.floor(point.y * canvas.height);

            // Sample 5x5 area around the point
            const imageData = ctx.getImageData(x - 2, y - 2, 5, 5);
            const data = imageData.data;

            for (let i = 0; i < data.length; i += 4) {
                totalR += data[i];
                totalG += data[i + 1];
                totalB += data[i + 2];
                count++;
            }
        });

        const r = totalR / count;
        const g = totalG / count;
        const b = totalB / count;

        // Convert RGB to Lab (more perceptually uniform) or use simple heuristics
        // Simple heuristic for MVP:
        // Warm: Higher component of Yellow/Red.
        // Cool: Higher component of Blue relative to Green/Red balance? 
        // Actually, skin is always "Red/Orange". The nuance is sub-surface.

        // Let's use YCbCr test or similar.
        // Cb = -0.1687R - 0.3313G + 0.5B + 128
        // Cr = 0.5R - 0.4187G - 0.0813B + 128
        // High Cr = Red (Warm?). High Cb = Blue (Cool?).

        const cr = 0.5 * r - 0.4187 * g - 0.0813 * b + 128;
        const cb = -0.1687 * r - 0.3313 * g + 0.5 * b + 128;

        // Normal skin: Cb [77, 127], Cr [133, 173]
        // This is generic detection. For TONE:

        // Cool skin tends to have more blue (higher Cb) and less yellow.
        // Warm skin has more yellow (lower Cb, higher Cr?)

        // Let's try a simple B/G ratio.
        // If (B / G) is higher -> Cool.
        // If (R / G) is higher -> Warm.

        let tone: SkinTone = 'neutral';

        // Empirically tuned thresholds (very approximate)
        if (cb > 115) {
            tone = 'cool'; // More blue
        } else if (cr > 150) {
            tone = 'warm'; // More red/yellow
        } else {
            tone = 'neutral';
        }

        // Refine with HSV
        // ...

        return this.getRecommendation(tone, `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`);
    }

    private static getRecommendation(tone: SkinTone, colorStr: string): AnalysisResult {
        if (tone === 'warm') {
            return {
                skinTone: 'warm',
                recommendedMetal: 'Yellow Gold (22K/24K)',
                description: 'Your skin has warm, golden undertones. Traditional yellow gold radiates beautifully against your complexion.',
                colors: [colorStr]
            };
        } else if (tone === 'cool') {
            return {
                skinTone: 'cool',
                recommendedMetal: 'White Gold, Platinum, or Rose Gold',
                description: 'Your skin has cool, pink or olive undertones. White metals or Rose Gold provide a stunning, sophisticated contrast.',
                colors: [colorStr]
            };
        } else {
            return {
                skinTone: 'neutral',
                recommendedMetal: 'All Golds (Yellow, White, Rose)',
                description: 'You have a versatile neutral skin tone. You can pull off any metal color effortlessly!',
                colors: [colorStr]
            };
        }
    }
}
