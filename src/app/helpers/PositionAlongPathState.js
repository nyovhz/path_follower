class PositionAlongPathState {
    constructor() {
        this.startingDistance = 0.0001;
        this.currentDistanceOnPath = 0.0001;
        this.currentPercentageOnPath = 0.0001;
        this.targetDistance = 0;
        this.movementDuration = 1500; // Más tiempo para animación suave
        this.lengthToScroll = 200; // Más desplazamiento para completar un ciclo
        this.lastScrollTime = 0;
    }
}

export default PositionAlongPathState;