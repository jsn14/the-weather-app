// detect location 
class Location {
    constructor() {
        let location = new Promise((resolve, reject) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    resolve(position);
                }, (error) => {
                    reject(error);
                });
            } else {
                reject('Location service is not supported by this browser.');
            };
        });
        return location;
    }
}

// Api call
class ApiCall {
    constructor(apiURL) {
        let result = new Promise((resolve, reject) => {
            fetch(apiURL).then(response => {
                return response.json();
            }).then(data => {
                resolve(data);
            }).catch(error => {
                reject(error);
            });
        });
        return result;
    }
}

// find current year
class Copyright {
    constructor() {
        let copyrightYear = document.querySelector('#copyright-year');
        copyrightYear.textContent = new Date().getFullYear();
    }
}

//exports classes
export {
    ApiCall,
    Location,
    Copyright
}