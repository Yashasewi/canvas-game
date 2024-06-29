import { Particle } from "../classes/Particle";
export function SpawnParticles(x, y) {
    const angle = Math.atan2(y, x);
    const velocity = {
        x: Math.cos(angle),
        y: Math.sin(angle),
    };
    const par = new Particle(x, y, 15, velocity);
}
