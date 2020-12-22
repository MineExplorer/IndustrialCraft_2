/// <reference path="./core-engine.d.ts"/>

declare class Vector3 implements Vector {
    static UP: Vector3;
    static DOWN: Vector3;
    x: number;
    y: number;
    z: number;
    constructor(vx: number, vy: number, vz: number);
    constructor(vx: Vector);
    copy(dst?: Vector3): Vector3;
    set(vx: number, vy: number, vz: number): Vector3;
    set(vx: Vector): Vector3;
    add(vx: number, vy: number, vz: number): Vector3;
    add(vx: Vector): Vector3;
    addScaled(v: Vector, scale: number): Vector3;
    sub(vx: number, vy: number, vz: number): Vector3;
    sub(vx: Vector): Vector3;
    cross(vx: number, vy: number, vz: number): Vector3;
    cross(vx: Vector): Vector3;
    dot(vx: number, vy: number, vz: number): Vector3;
    dot(vx: any): Vector3;
    normalize(): Vector3;
    lengthSquared(): number;
    length(): number;
    negate(): Vector3;
    distanceSquared(vx: number, vy: number, vz: number): number;
    distanceSquared(vx: Vector): number;
    distance(vx: number, vy: number, vz: number): number;
    distance(vx: Vector): number;
    scale(factor: number): Vector3;
    scaleTo(len: number): Vector3;
    toString(): string;
}
