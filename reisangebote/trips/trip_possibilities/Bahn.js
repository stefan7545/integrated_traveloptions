class Bahn extends Trip {
    constructor(Bahn_Trip) {
        super(Bahn_Trip, "directions");
        this.produkt = "";
        this.umstiege = "";
        this.prices = [];
    }
}