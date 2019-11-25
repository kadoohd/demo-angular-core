"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var environment_prod_1 = require("../../environments/environment.prod");
var DataService = /** @class */ (function () {
    function DataService(http) {
        this.http = http;
        this.baseUrl = environment_prod_1.environment.apiUrl;
        this.baseCustomersUrl = this.baseUrl + 'customers';
        this.baseStatesUrl = this.baseUrl + 'states';
    }
    DataService.prototype.getCustomers = function () {
        var _this = this;
        return this.http.get(this.baseCustomersUrl)
            .pipe(operators_1.map(function (customers) {
            _this.calculateCustomersOrderTotal(customers);
            return customers;
        }), operators_1.catchError(this.handleError));
    };
    DataService.prototype.getCustomersPage = function (page, pageSize) {
        var _this = this;
        return this.http.get(this.baseCustomersUrl + "/page/" + page + "/" + pageSize, { observe: 'response' })
            .pipe(operators_1.map(function (res) {
            //Need to observe response in order to get to this header (see {observe: 'response'} above)
            var totalRecords = +res.headers.get('x-inlinecount');
            var customers = res.body;
            _this.calculateCustomersOrderTotal(customers);
            return {
                results: customers,
                totalRecords: totalRecords
            };
        }), operators_1.catchError(this.handleError));
    };
    DataService.prototype.getCustomer = function (id) {
        return this.http.get(this.baseCustomersUrl + '/' + id)
            .pipe(operators_1.catchError(this.handleError));
    };
    DataService.prototype.insertCustomer = function (customer) {
        return this.http.post(this.baseCustomersUrl, customer)
            .pipe(operators_1.map(function (data) {
            console.log('insertCustomer status: ' + data.status);
            return data.customer;
        }), operators_1.catchError(this.handleError));
    };
    DataService.prototype.updateCustomer = function (customer) {
        return this.http.put(this.baseCustomersUrl + '/' + customer.id, customer)
            .pipe(operators_1.map(function (data) {
            console.log('updateCustomer status: ' + data.status);
            return data.customer;
        }), operators_1.catchError(this.handleError));
    };
    DataService.prototype.deleteCustomer = function (id) {
        return this.http.delete(this.baseCustomersUrl + '/' + id)
            .pipe(operators_1.catchError(this.handleError));
    };
    DataService.prototype.getStates = function () {
        return this.http.get(this.baseStatesUrl)
            .pipe(operators_1.catchError(this.handleError));
    };
    DataService.prototype.calculateCustomersOrderTotal = function (customers) {
        for (var _i = 0, customers_1 = customers; _i < customers_1.length; _i++) {
            var customer = customers_1[_i];
            if (customer && customer.orders) {
                var total = 0;
                for (var _a = 0, _b = customer.orders; _a < _b.length; _a++) {
                    var order = _b[_a];
                    total += (order.price * order.quantity);
                }
                customer.orderTotal = total;
            }
        }
    };
    DataService.prototype.handleError = function (error) {
        console.error('server error:', error);
        if (error.error instanceof Error) {
            var errMessage = error.error.message;
            return rxjs_1.Observable.throw(errMessage);
        }
        return rxjs_1.Observable.throw(error || 'ASP.NET Core server error');
    };
    DataService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [http_1.HttpClient])
    ], DataService);
    return DataService;
}());
exports.DataService = DataService;
//# sourceMappingURL=data.service.js.map