LIBRARY({
	name: "Vector",
	version: 1,
	shared: false,
	api: "AdaptedScript"
});

var VectorAPI = {
	copy: function(dst){
		if(dst){
			return dst.set(this);
		}
        return new Vector3(this);
    },
	
	set: function(vx, vy, vz) {
		if(typeof(vx)=="number"){
			this.x = vx;
			this.y = vy;
			this.z = vz;
			return this;
		}
		let v = vx;
		return this.set(v.x, v.y, v.z);
    },

    add: function(vx, vy, vz) {
		if(typeof(vx)=="number"){
			this.x += vx;
			this.y += vy;
			this.z += vz;
			return this;
		}
		let v = vx;
		return this.add(v.x, v.y, v.z);
    },
	
    addScaled: function(v, scale) {
        return this.add(v.x * scale, v.y * scale, v.z * scale);
    },

    sub: function(vx, vy, vz) {
		if(typeof(vx)=="number"){
			this.x -= vx;
			this.y -= vy;
			this.z -= vz;
			return this;
		}
		return this.sub(v.x, v.y, v.z);        
    },

    cross: function(vx, vy, vz) {
		if(typeof(vx)=="number"){
			return this.set(this.y * vz - this.z * vy, this.z * vx - this.x * vz, this.x * vy - this.y * vx);
		}
		let v = vx;
		return this.cross(v.x, v.y, v.z);
    },
	
	dot: function(vx, vy, vz) {
		if(typeof(vx)=="number"){
			return this.x * vx + this.y * vy + this.z * vz;
		}
		let v = vx;
		return this.dot(v.x, v.y, v.z);
    },

    normalize: function() {
        let len = this.length();
        this.x /= len;
        this.y /= len;
        this.z /= len;
        return this;
    },

    lengthSquared: function() {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    },

    length: function() {
        return Math.sqrt(this.lengthSquared());
    },

    negate: function() {
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;
        return this;
    },

    distanceSquared: function(vx, vy, vz) {
		if(typeof(vx)=="number"){
			let dx = vx - this.x;
			let dy = vy - this.y;
			let dz = vz - this.z;
			return dx * dx + dy * dy + dz * dz;
		}
		let v = vx;
		return this.distanceSquared(v.x, v.y, v.z);
    },
	
	distance: function(vx, vy, vz) {
		if(typeof(vx)=="number"){
			return Math.sqrt(this.distanceSquared(vx, vy, vz));
		}
		let v = vx;
		return this.distance(v.x, v.y, v.z);
    },
	
    scale: function(factor) {
        this.x *= factor;
        this.y *= factor;
        this.z *= factor;
        return this;
    },

    scaleTo: function(len) {
        var factor = len / this.length();
        return this.scale(factor);
    },

    toString: function() {
        return "[ " + this.x + ", " + this.y + ", " + this.z + " ]";
    }
}

function Vector3(vx, vy, vz) {
	if(typeof(vx)=="number"){
		this.x = vx;
		this.y = vy;
		this.z = vz;
	}
	else{
		let v = vx;
		this.x = v.x;
		this.y = v.y;
		this.z = v.z;
	}
	for(var i in VectorAPI){
		this[i] = VectorAPI[i];
	}
}

VectorAPI.UP = new Vector3(0, 1, 0);
VectorAPI.DOWN = new Vector3(0, -1, 0);

EXPORT("Vector", VectorAPI);
EXPORT("Vector3", Vector3);