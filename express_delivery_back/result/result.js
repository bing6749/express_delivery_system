class Result {
    constructor() {
        this.status = 0;
        this.message = '';
        this.data = null;
    }

    getStatus() {
        return this.status;
    }

    getMessage() {
        return this.message;
    }

    getData() {
        return this.data;
    }

    success() {
        this.status = 1;
        this.message = '';
        this.data = null;
        return this;
    }

    error(message) {
        this.status = 0;
        this.message = message;
        this.data = null;
        return this;
    }

    errorData(message, data) {
        this.status = 0;
        this.message = message;
        this.data = data;
        return this;
    }

    successData(data) {
        this.status = 1;
        this.message = '';
        this.data = data;
        return this;
    }
}
