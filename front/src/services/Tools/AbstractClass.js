class AbstractClass {
    constructor() {
        if (this.constructor === AbstractClass) {
            throw new TypeError(
                'Abstract class "AbstractClass" cannot be instantiated directly'
            );
        }
    }

    get(name) {
        if (!this.has(name)) {
            throw new Error(`Property ${name} not found`);
        }
        return this[name];
    }

    has(name) {
        return this[name] !== undefined;
    }
}

export default AbstractClass;
