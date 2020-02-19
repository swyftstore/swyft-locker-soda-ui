const repository = {}

function API(host) {

    const repo = Object.create(repository),
          self = this;

    repo.findLocations = (payload) => {
        const path = `${host}/find_locations`
        return this.post(path, payload)
    }
    
    repo.createOrder = (payload) => {
        const path = `${host}/create_order`
        return this.post(path, payload)
    }

    repo.updateOrder = (orderId, payload) => {
        const path = `${host}/update_order?order_id=${orderId}`
        return this.put(path, payload)
    }

    repo.getOrder = (orderId) => {
        const path = `${host}/get_order?order_id=${orderId}`
        return this.get(path)
    }

    this.get = (path) => {
        return new Promise((resolve, reject)=>{
            $.ajax({
                type: "GET",
                url: path, 
                dataType: "json",
                success: (resp, textStatus, jqXHR)=>{
                    return resolve(resp)
                },
                error: (jqXHR, textStatus, errorThrown)=>{
                    return reject(errorThrown)
                }
                
            });
        });
    }

    this.post = (path, payload) => {
        return new Promise((resolve, reject)=>{
            $.ajax({
                type: "POST",
                url: path, 
                contentType: "application/json",
                dataType: "json",
                data: JSON.stringify(payload),
                success: (resp, textStatus, jqXHR)=>{
                    return resolve(resp)
                },
                error: (jqXHR, textStatus, errorThrown)=>{
                    return reject(errorThrown)
                }
                
            });
        });
    }

    this.put = (path, payload) => {
        return new Promise((resolve, reject)=>{
            $.ajax({
                type: "PUT",
                url: path, 
                contentType: "application/json",
                dataType: "json",
                data: JSON.stringify(payload),
                success: (resp, textStatus, jqXHR)=>{
                    return resolve(resp)
                },
                error: (jqXHR, textStatus, errorThrown)=>{
                    return reject(errorThrown)
                }
                
            });
        });
    }

    this.del = (path) => {
        return new Promise((resolve, reject)=>{
            $.ajax({
                type: "GET",
                url: path, 
                dataType: "json",
                success: (resp, textStatus, jqXHR)=>{
                    return resolve(resp)
                },
                error: (jqXHR, textStatus, errorThrown)=>{
                    return reject(errorThrown)
                }
                
            });
        });
    }

    return repo;

}