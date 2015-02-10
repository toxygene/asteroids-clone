define(function(require) {
    function CanvasVector(magnatude, angle) {
        this.magnatude = magnatude;
        this.angle = angle;
    };
    
    CanvasVector.prototype.getX = function() {
        return this.getMagnatude() * Math.cos(this.getAngle());
    };
    
    CanvasVector.prototype.getY = function() {
        return this.getMagnatude() * Math.sin(this.getAngle());
    };
    
    CanvasVector.prototype.getMagnatude = function() {
        return this.magnatude;
    };
    
    CanvasVector.prototype.getAngle = function() {
        return this.angle;
    };
    
    CanvasVector.prototype.add = function(that) {
        var x = this.getX() + that.getX();
        var y = this.getY() + that.getY();
        
        var magnatude = Math.sqrt((x*x)+(y*y));
        var angle = Math.atan2(y, x);
        
        return new CanvasVector(magnatude, angle);
    };
    
    CanvasVector.prototype.addMagnatude = function(magnatude) {
        return new CanvasVector(this.getMagnatude() + magnatude, this.getAngle());
    };
    
    CanvasVector.prototype.magnatudeRange = function(min, max) {
        if (this.getMagnatude() < min) {
            return new CanvasVector(min, this.getAngle());
        } else if (this.getMagnatude() > max) {
            return new CanvasVector(max, this.getAngle());
        }
        
        return this;
    };
    
    return CanvasVector;
});
