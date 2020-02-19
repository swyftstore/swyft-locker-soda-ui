//import API from "./API";
const somaMethods = {};

function SOMA(viewIds, host) {

    const soma = Object.create(somaMethods),
          self = this,
          api = new API(host),
          products = {};
          
    let cart = [],
        locations = {},
        user,
        selectedLocation,
        homeAddress;

    // mock data loaders

    this.loadSampleUser = () => {
        const _user = {
            is_ada: false,
            firstName: "John",
            lastName: "Smith",
            emailAddress: "jonSmith@jsmithsemail.com",
            phoneNumber: "415-123-0987",
            notification: ["sms", "email/push"],            
        }
        user = _user;
    }
    this.loadSampleProducts = (containerId) => {
        let container = $(`#${containerId}`);

        products[0] = {
            id: 0,
            img: "./img/product0.png",
            dims: {
                h: 10,
                w: 10,
                l: 10
            }
        }

        products[1] = { 
            id: 1,
            img: "./img/product1.png",
            dims: {
                h: 17,
                w: 12,
                l: 10
            }
        }

        products[2] = { 
            id: 2,
            img: "./img/product2.png",
            dims: {
                h: 24,
                w: 12,
                l: 10
            }
        }

        container.html("")
        container.append(this.buildSampleProduct(0))
        container.append(this.buildSampleProduct(1))
        container.append(this.buildSampleProduct(2))
         
    }

   
    // context getters
    this.getAda = () => {
        return user?user.is_ada:false;
    }

    this.getDims = () => {
        if (cart && cart.length > 0) {
            return cart[0].dims
        }
    }

    this.getArrivalDate = () => {
        //should we pass in a date or use the default?
        return;
    }

    this.getNotifcationType = () => {
        return user?user.notification:false;
    }

     // UI modifiers
     this.showSpinner = () => {
        $("#spinerContainer").show()
    }

    this.hideSpinner = () => {
        $("#spinerContainer").hide()
    }

    this.hideLowerContainer = () => {
        $("#lowerContainer").hide()
    }

    this.ShowLowerContainer = () => {
        $("#lowerContainer").show()
    }

  

    // UI builders

    this.buildSampleProduct = (productId) =>{
        const product = `<div class=\"productItem floatLeft\"><img class="productImg" src=\"${products[productId].img}\"/><div class="productContainer"><span>Product ${productId}</span></div><div class="productContainer"><button class="btn" onclick=\"soma.selectProduct(${productId})\">Buy Now</button</div></div>`
        return product
    }

    this.buildRandomId = () => {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    this.buildAddress = (address) => {
        if (address) {
            const addressArray = address.split(','),
                  addressContainer = `<div class="address">${this.buildAddressComponents(addressArray)}</div>`;

            return addressContainer;
        }
    }

    this.buildFinalAddress = () => {
        if (locations && locations[selectedLocation]) {
            const location = locations[selectedLocation],
                  locationDom = this.buildFinalLocationAddress(location);
            $("#finalAddr").html(locationDom)
        }        
    }

    this.buildLocations = (_locations) => {
        locations = {};
        if (_locations) {
            _locations.forEach(location => {
                const locationId = location.id;
                locations[locationId] = location;
            })
            $("#locations").html(this.buildLocationItems(_locations))
        }
    }

    this.buildLocationItems = (_locations) => {
        let locationsDom = ""
        _locations.forEach(location => {
            const locationId = location.id;
            const address_locations = `<div class="label floatLeft formatedAddr">${self.buildLocationAddress(location)}</div>`
            locationsDom += "<div class=\"container3 border pLeft10 pRight10 pTop10 pBottom10 mBottom20\">"
            locationsDom += `${address_locations}<div class=\"btnContainer\"><button class=\"btn\" onclick=\"soma.selectLocation('${locationId}')\" >Select</button></div>`
            locationsDom += "</div>"
        })
        return locationsDom;
    } 

    this.buildLocationAddress = (location)=> {
        const addressArray = [location.name,
             `${location.address.address1}, ${location.address.city}`,
              `Approx. ${ Math.round(location.address.distance * .621)} Miles Away`
            ]
        let addressContainer =  `<div class="address">${this.buildLocationComponents(addressArray)}</div>` 
        return addressContainer;   
    }

    this.buildFinalLocationAddress = (location)=> {
        const addressArray = [location.name, location.address.address1];
        
        if(location.address.address2) {
            addressArray.push(location.address.address2)
        } 
        addressArray.push(location.address.city);
        addressArray.push(location.address.state);
        addressArray.push(location.address.zip);
        if (location.address.country) {
            addressArray.push(location.address.country);       
        }
        let addressContainer =  `<div>${this.buildAddressComponents(addressArray)}</div>` 
        return addressContainer;   
    }

    this.buildLocationComponents = (address) => {
        let value = ""
        address.forEach((addr, i) =>{
            value+=`<div class="addressline">${addr}</div>`
        })
        return value;
    }

    this.buildAddressComponents = (address) => {
        let value = ""
        address.forEach((addr, i) =>{
            if (i < address.length - 1) {
                value+=`<div class="addressline">${addr},</div>`
            } else {
                value+=`<div class="addressline">${addr}</div>`
            }
        })
        return value;
    }

   

    //public methods

    soma.selectProduct = (productId) => {
        cart = [];
        if (products[productId]) {
            cart.push(products[productId])
            soma.showView('view2')
        } else {
            //todo: throw error?
        }
    }

    soma.selectLocation= (locationId) => {
        if (locations && locations[locationId]) {
            selectedLocation = locationId;
            this.buildFinalAddress()        
            soma.showView('view3')            
        } else {
            //todo: throw error?
        }
    }

    soma.shipToAddress = () => {
        if (homeAddress) {
            const formatedAddr = this.buildAddress(homeAddress);
            $("#finalAddr").html(formatedAddr)
            soma.showView('view3')
        }
    }

    soma.confirm = () => {
        if (selectedLocation) {
            this.shipToLocation()
        } else if (homeAddress) {
            this.shipToHome()
        }
    }

    soma.showView = (viewId) => {
        viewIds.forEach(_viewId => {
            $(`#${_viewId}`).hide()
        });
        $(`#${viewId}`).show()
    }
    
    //requests 

    this.getLocations = (geometry) => {
        
        const payload = {},
              coordinates = {};

        coordinates.lat = geometry.location.lat();  
        coordinates.lon = geometry.location.lng();

        payload.is_ada = this.getAda();
        payload.order_dimensions = this.getDims()
        payload.arrival_date = this.getArrivalDate();
        payload.address = {
            coordinates
        }               
        this.showSpinner();
        
        api.findLocations(payload)
        .then( resp => {
            self.hideSpinner()
            if (resp.available_locations) {
                const _locations = []
                if (resp.available_locations.length > 3) {
                    for (let n = 0; n<3; n++) {
                        _locations.push(resp.available_locations[n])
                    }
                } else {
                    _locations = resp.available_locations;
                }
                self.buildLocations(_locations);
                $("#l2Container").show()
            } else {
                const ts = new Date().getTime();
                console.error(`${ts}:`,resp)
                $("#l2Container").hide()
                $("#locations").html("")
            }
        })
        .catch( e => {
            self.hideSpinner()
            const ts = new Date().getTime();
            console.error(`${ts}:`,e)
        })
        
    }

    this.shipToLocation = () => {
        if (selectedLocation && cart.length > 0 && user) {
            const payload = {
                location_id: selectedLocation,
                is_ada: this.getAda() || false,
                notification_type: this.getNotifcationType(),
                order: {
                    ageVerificationNeeded: false,
                    dimensions: this.getDims(),
                    id: this.buildRandomId(),
                    status: 'shipping',
                    tracking_number: 'TBD',
                    carrier: 'TBD'
                },
                customer: {
                    first_name: user.firstName,
                    last_name: user.lastName,
                    email_address: user.emailAddress,
                    phone_number: user.phoneNumber
                }
            }
            this.showSpinner();
            
            api.createOrder(payload)
            .then( resp => {
                self.hideSpinner()
                if (resp.success) {
                    alert("Order Created!")
                    soma.showView("view1")
                } else {
                    logger.error(resp.message)
                }
            })
            .catch( e => {
                self.hideSpinner()
                const ts = new Date().getTime();
                console.error(`${ts}:`, e)
            })           
        }
    }

    this.shipToHome = () => {
        alert("Order Created!")
        soma.showView("view1")
    }

    // init methods
    this.init = () => {
        this.hideSpinner();
        $(`#${viewIds[0]}`).on('show', this.loadSampleProducts("products")) 
        $(`#${viewIds[1]}`).on('show', this.hideLowerContainer()) 

        const searchBar = $("#searchAddr")
        searchBar.geocomplete()
        .bind("geocode:result", function(event, result){
             if (result && result.address_components && result.address_components.length > 0) {
                const address = searchBar.val(),
                      formatedAddr = self.buildAddress(address),
                      geometry = result.geometry;

                homeAddress = address              
                $("#shipToAddr > .formatedAddr").html(formatedAddr)
                self.getLocations(geometry)
                self.ShowLowerContainer()
             }
        });        
    }

    if (viewIds && viewIds.length > 0 ) {
        this.init();
        //get sample user
        this.loadSampleUser();
    }

    return soma;

}

$( document ).ready(function() {
    const viewIds = ['view1', 'view2', 'view3', 'view4'],
          host = "http://localhost:8081/soda";

    soma = new SOMA(viewIds, host);

    soma.showView('view1')
});